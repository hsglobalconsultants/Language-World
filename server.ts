import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client safe initialization
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please configure it in your Secrets / Environment settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Safely parses JSON strings returned by the generative model
function parseJsonResponse(rawText: string): any {
  if (!rawText) return {};
  let clean = rawText.trim();
  
  // Strip Markdown JSON indicators if present
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\n?/i, "");
    clean = clean.replace(/```$/, "");
    clean = clean.trim();
  }
  
  try {
    return JSON.parse(clean);
  } catch (err: any) {
    console.warn("JSON.parse failed on the first attempt, trying nested extraction:", err.message);
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = clean.substring(firstBrace, lastBrace + 1);
      return JSON.parse(extracted);
    }
    throw err;
  }
}

// Exponential backoff helper for handling transient Google AI errors safely (e.g. 503 service unavailable, 429 rate limit exceeded)
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delayMs = 1500): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const errMsg = String(err.message || "").toLowerCase();
    const isTransient = 
      errMsg.includes("503") || 
      errMsg.includes("unavailable") || 
      errMsg.includes("high demand") || 
      errMsg.includes("limit") || 
      errMsg.includes("429") || 
      errMsg.includes("quota") ||
      errMsg.includes("resources") ||
      errMsg.includes("resource_exhausted") ||
      errMsg.includes("overload") ||
      errMsg.includes("busy") ||
      errMsg.includes("temp");

    if (isTransient && retries > 0) {
      console.warn(`Transient API error encountered: "${err.message}". Retrying in ${delayMs}ms... Retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return retryWithBackoff(fn, retries - 1, delayMs * 1.5);
    }
    throw err;
  }
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. German Tutor Chat / Grammar / Vocab assistant
app.post("/api/german-tutor/chat", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message prompt is required." });
    }

    const ai = getAi();
    
    // System instruction defining the personality and formatting
    const systemInstruction = 
      "You are 'Language World AI German Tutor', an encouraging, expert native German Language Teacher " +
      "at the prestigious Language World Karachi institute. This is a Success center for international learners.\n\n" +
      "Your core qualities:\n" +
      "1. Answer grammar questions patiently, explain rules clearly (using English and Urdu references where relevant to Pakistani students), and show helpful visual breakdowns (tables/conjugations).\n" +
      "2. Explain German vocabulary in context, explaining word genders (der, die, das), plural forms, and provide two real-life sentences with translations.\n" +
      "3. Give direct, high-quality, professional assistance. Keep your tone cheerful, warm, and structured.\n" +
      "4. Always write translations for German phrases, so learners from beginner (A1) to intermediate (B2) can understand.\n" +
      "5. Format your response beautifully using elegant typography Markdown (headers, bullet points, bold accents, codes).";

    // Build the contents payload with optional history
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.text || "" }]
        });
      });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await retryWithBackoff(() => 
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      })
    );

    res.json({
      text: response.text || "Entschuldigung (Sorry), I couldn't formulate an answer. Please try again."
    });
  } catch (err: any) {
    console.error("German Tutor Chat error:", err);
    res.status(500).json({ 
      error: err.message || "An unexpected error occurred in German AI Tutor backend." 
    });
  }
});

// 3. Personalized Practice Exercises Generator
app.post("/api/german-tutor/exercises", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { topic, level } = req.body;
    const selectedTopic = topic || "Verb conjugation in Present tense (Präsens)";
    const selectedLevel = level || "A1";

    const ai = getAi();

    const promptText = 
      `Create a set of 3 to 4 personalized language learning exercises for German level ${selectedLevel}. ` +
      `The exercises must focus precisely on the topic: "${selectedTopic}". ` +
      `Ensure you provide some multiple-choice questions (exactly 4 options) and some fill-blank questions. ` +
      `Include high-quality grammatical explanations in English for why the answer is correct.`;

    const systemInstruction = 
      "You are 'Language World Exercise Generator'. You specialize in outputting premium, structured, highly educational " +
      "curriculum tasks for German language classrooms from levels A1 to B2. Return ONLY clean structure matching the output schema.";

    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { 
                type: Type.STRING, 
                description: "Short title for this lesson sheet, e.g. 'Dative Prepositions Exercises' " 
              },
              instructions: { 
                type: Type.STRING, 
                description: "Core objective or rule summary explanation in English and German to guide the student first" 
              },
              questions: {
                type: Type.ARRAY,
                description: "List of exactly 3 to 4 interactive grammar questions",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    type: { 
                      type: Type.STRING, 
                      description: "Select either 'multiple-choice' or 'fill-blank'" 
                    },
                    question: { 
                      type: Type.STRING, 
                      description: "Prompt in German, with hints in brackets. e.g. 'Wir wohnen bei ___ (die) Großeltern.'" 
                    },
                    options: {
                      type: Type.ARRAY,
                      description: "Array of exactly 4 strings if MCQ, or completely null/empty if fill-blank question",
                      items: { type: Type.STRING }
                    },
                    answer: { 
                      type: Type.STRING, 
                      description: "The correct exact word to complete the blank" 
                    },
                    explanation: { 
                      type: Type.STRING, 
                      description: "Step-by-step grammatical breakdown explaining cases, prepositions, or endings for learner benefit in English." 
                    }
                  },
                  required: ["id", "type", "question", "answer", "explanation"]
                }
              }
            },
            required: ["title", "instructions", "questions"]
          }
        }
      })
    );

    const outputJson = parseJsonResponse(response.text || "{}");
    res.json(outputJson);
  } catch (err: any) {
    console.error("German Exercises generation error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to generate personalized German exercises." 
    });
  }
});


// German Goethe-Zertifikat Task Grader
app.post("/api/german-tutor/evaluate-letter", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { level, prompt, letter } = req.body;
    if (!letter || letter.trim().length === 0) {
      return res.status(400).json({ error: "Your letter draft is empty. Please enter some text." });
    }

    const ai = getAi();
    const evaluationPrompt = 
      `Evaluate the following German draft letter written by a student practicing for the Goethe-Zertifikat/ÖSD exam.\n\n` +
      `CEFR LEVEL: "${level || 'B1'}"\n` +
      `EXAM PROMPT: "${prompt || 'Write an email to your landlord explaining why your radiator is broken and asking for a technician.'}"\n\n` +
      `STUDENT LETTER:\n${letter}\n\n` +
      `Evaluate this response using the official Goethe/ÖSD assessment criteria at the target level:\n` +
      `1. Task Completion / Content (Inhalt): Did they answer all cue points clearly? (0-10 Score)\n` +
      `2. Formal Criteria (Formelle Kriterien): Did they use proper greetings, formal/informal address (Sie/du), and closures? (0-5 Score)\n` +
      `3. Grammar (Grammatik/Struktur): Correct sentence structures (verb positions, noun genders, case endings)? (0-5 Score)\n` +
      `4. Vocabulary (Wortschatz/Wortwahl): Range and correctness of CEFR-level words? (0-5 Score)\n\n` +
      `Calculate a total score out of 25. Provide constructive feedback, point out major grammatical mistakes with corrections and clear explanations in bilingual English/German, and write a high-scoring master-grade rewritten version of the letter.`;

    const systemInstruction = 
      "You are 'Language World Goethe Certificate Expert', a certified TELC/Goethe language examiner " +
      "at Language World Karachi. You score student letters with deep professional accuracy, explain grammatical structures clearly, " +
      "and provide a pristine rewritten email/letter. Return a clean, valid JSON response conforming to the schema.";

    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: evaluationPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalScore: { type: Type.NUMBER, description: "Total score of the letter out of 25 points" },
              scores: {
                type: Type.OBJECT,
                properties: {
                  content: { type: Type.NUMBER, description: "Task fulfillment score out of 10" },
                  formality: { type: Type.NUMBER, description: "Greeting & closing appropriateness score out of 5" },
                  grammar: { type: Type.NUMBER, description: "Grammar accuracy score out of 5" },
                  vocabulary: { type: Type.NUMBER, description: "Vocabulary range and correctness score out of 5" }
                },
                required: ["content", "formality", "grammar", "vocabulary"]
              },
              overallFeedback: { type: Type.STRING, description: "Comprehensive, motivating, and detailed evaluation of strengths and opportunities in English" },
              corrections: {
                type: Type.ARRAY,
                description: "List of specific mistakes caught in the draft",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    original: { type: Type.STRING, description: "The original faulty phrase/word" },
                    corrected: { type: Type.STRING, description: "The corrected phrase/word in German" },
                    explanation: { type: Type.STRING, description: "Explanation of why this correction was made (e.g., preposition cases, verb position) in simple business English" }
                  },
                  required: ["original", "corrected", "explanation"]
                }
              },
              improvedLetter: { type: Type.STRING, description: "Perfect native-level model letter meeting 100% Goethe criteria with standard paragraph design" }
            },
            required: ["totalScore", "scores", "overallFeedback", "corrections", "improvedLetter"]
          }
        }
      })
    );

    const outputJson = parseJsonResponse(response.text || "{}");
    res.json(outputJson);
  } catch (err: any) {
    console.error("German letter grader error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to analyze German letter draft." 
    });
  }
});


// German Goethe-Zertifikat Cue Card Speaking Evaluator
app.post("/api/german-tutor/evaluate-speaking", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { level, cueTopic, cueWord, expectedPrompt, userUtterance } = req.body;
    if (!userUtterance || userUtterance.trim().length === 0) {
      return res.status(400).json({ error: "Your oral response text is empty." });
    }

    const ai = getAi();
    const evaluationPrompt = 
      `Assess a German Goethe-style Speaking partner response (Level ${level || 'A1'}).\n\n` +
      `CUE CARD TOPIC: "${cueTopic || 'Einkaufen'}"\n` +
      `CUE CARD WORD/PROMPT: "${cueWord || 'Obst'}"\n` +
      `EXPECTED TASK: "${expectedPrompt || 'Formulate a question about fruit or state what fruit you buy.'}"\n\n` +
      `STUDENT RESPONSE (TRANSCRIPT): "${userUtterance}"\n\n` +
      `Evaluate their response under: Pronunciation/Fluidity hint, Sentence Structure (Verbstellung), Accusative/Dative correctness. ` +
      `State whether it meets the CEFR standard. Provide a perfect phrasing script they can master to express with absolute confidence.`;

    const systemInstruction = 
      "You are 'Language World Goethe Certificate Expert'. You evaluate student speaking phrases, sentences, " +
      "or small speeches and help them optimize sentence order (e.g. verb position) and casing (Nom/Akk/Dat) in German. Return JSON.";

    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: evaluationPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, description: "Either 'Sehr gut', 'Bestanden (Passed)', or 'Nicht bestanden (Improve)'" },
              overallScore: { type: Type.NUMBER, description: "Points score from 1 to 5" },
              grammarFeedback: { type: Type.STRING, description: "Simple grammar review on verb position, cases, or word choices" },
              pronunciationTips: { type: Type.STRING, description: "How to pronounce tricky sounds (like Umlauts ö/ä/ü or ch/sch) for Pakistani learners" },
              suggestedModelScript: { type: Type.STRING, description: "The most clear, elegant, and standard way to frame the question or answer during the test" }
            },
            required: ["status", "overallScore", "grammarFeedback", "pronunciationTips", "suggestedModelScript"]
          }
        }
      })
    );

    const outputJson = parseJsonResponse(response.text || "{}");
    res.json(outputJson);
  } catch (err: any) {
    console.error("German speaking evaluator error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze oral trial with AI." });
  }
});


// 4. IELTS Writing Evaluation & Band Scoring (Academic/General Task 1 & 2)
app.post("/api/ielts/evaluate-writing", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { taskType, prompt, essay } = req.body;
    if (!essay || essay.trim().length === 0) {
      return res.status(400).json({ error: "Your essay entry is empty. Please enter some text." });
    }

    const ai = getAi();
    const evaluationPrompt = 
      `Evaluate the following IELTS Writing ${taskType === "task1" ? "Task 1" : "Task 2"} essay.\n\n` +
      `PROMPT: "${prompt || 'Write an essay discussing the effects of modern technology on education.'}"\n\n` +
      `STUDENT ESSAY:\n${essay}\n\n` +
      `Provide a comprehensive and highly accurate evaluation following standard IELTS assessment criteria: ` +
      `Task Achievement/Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy. ` +
      `Return the result matching the output schema. Give precise band scores between 1.0 and 9.0 (with increments of 0.5) ` +
      `and constructive, specific, professional feedback in English. Additionally, provide an improved version of the essay achieving 8.5+ band format.`;

    const systemInstruction = 
      "You are 'Language World IELTS Master Examiner', a certified British Council IELTS writing evaluator " +
      "at Language World کراچی (Karachi). You score essays with professional integrity and provide precise, structured, " +
      "insightful feedback containing bands and actionable tips. Be extremely objective with band calculations.";

    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: evaluationPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bandScore: { type: Type.NUMBER, description: "Overall expected IELTS band score from 1.0 to 9.0" },
              criteriaScores: {
                type: Type.OBJECT,
                properties: {
                  taskAchievement: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.NUMBER },
                      feedback: { type: Type.STRING }
                    },
                    required: ["score", "feedback"]
                  },
                  coherenceCohesion: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.NUMBER },
                      feedback: { type: Type.STRING }
                    },
                    required: ["score", "feedback"]
                  },
                  lexicalResource: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.NUMBER },
                      feedback: { type: Type.STRING }
                    },
                    required: ["score", "feedback"]
                  },
                  grammaticalRange: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.NUMBER },
                      feedback: { type: Type.STRING }
                    },
                    required: ["score", "feedback"]
                  }
                },
                required: ["taskAchievement", "coherenceCohesion", "lexicalResource", "grammaticalRange"]
              },
              overallFeedback: { type: Type.STRING, description: "Detailed, actionable critique with tips to increase overall score" },
              improvedEssay: { type: Type.STRING, description: "Polished, academic-grade rewritten version of the user essay that achieves band 8.5+" }
            },
            required: ["bandScore", "criteriaScores", "overallFeedback", "improvedEssay"]
          }
        }
      })
    );

    const outputJson = parseJsonResponse(response.text || "{}");
    res.json(outputJson);
  } catch (err: any) {
    console.error("IELTS writing score error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to analyze and evaluate writing with the IELTS examiner engine." 
    });
  }
});


// 5. IELTS Speaking Evaluation (Read Aloud, Describe Image)
app.post("/api/ielts/evaluate-speaking", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { taskType, originalPrompt, userTranscript } = req.body;

    const ai = getAi();
    const promptText = 
      `Assess an IELTS Speaking task execution.\n` +
      `Task Type: "${taskType || 'Read Aloud'}"\n` +
      `Task Prompt rules/details: "${originalPrompt}"\n` +
      `User's spoken transcript or notes/attempt: "${userTranscript || '(Read-aloud spoken utterance submission)'}"\n\n` +
      `Please provide professional metrics following official IELTS Speaking criteria: \n` +
      `1. Pronunciation (band score 1.0 - 9.0)\n` +
      `2. Fluency and Coherence (band score 1.0 - 9.0)\n` +
      `3. Lexical Resource / Content (band score 1.0 - 9.0)\n\n` +
      `Calculate an Overall IELTS Speaking Band Score from 1.0 to 9.0 (with 0.5 increments, strictly aligning with IELTS standards). \n` +
      `Give highly professional feedback, recommendations, tips, and an exemplary 'modelSpeech' text (approx 40 seconds) presenting all key elements, smooth transitions, and a perfect IELTS band 9.5 model narrative.`;

    const systemInstruction = 
      "You are 'Language World IELTS Master Examiner', a certified British Council IELTS speaking evaluator " +
      "at Language World Karachi. You score oral pronunciation, oral fluency, coherence, and lexical resource with professional precision " +
      "and provide structured, constructive advice. Return a clean, parsable JSON response.";

    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER, description: "Overall expected IELTS speaking band score from 1.0 to 9.0" },
              pronunciationScore: { type: Type.NUMBER, description: "Pronunciation subscore from 1.0 to 9.0" },
              fluencyScore: { type: Type.NUMBER, description: "Fluency and Coherence subscore from 1.0 to 9.0" },
              contentScore: { type: Type.NUMBER, description: "Lexical Resource/Content subscore from 1.0 to 9.0" },
              feedback: { type: Type.STRING, description: "Constructive feedback on user pronunciation, grammar structures or delivery" },
              tips: { type: Type.STRING, description: "Actionable corrective strategies and tips for getting to a level 8+" },
              modelSpeech: { type: Type.STRING, description: "Exemplary high-scoring model spoken answer (approx. 40 seconds) presenting standard phrasing, ideal vocabulary, and flawless flow." }
            },
            required: ["overallScore", "pronunciationScore", "fluencyScore", "contentScore", "feedback", "tips", "modelSpeech"]
          }
        }
      })
    );

    const outputJson = parseJsonResponse(response.text || "{}");
    res.json(outputJson);
  } catch (err: any) {
    console.error("IELTS speaking assessment error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze Speaking attempt with AI." });
  }
});


// 6. IELTS Custom Mock Test Dynamic Generator
app.post("/api/ielts/generate-test", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { testType, topic } = req.body;
    const selectedType = testType || "Academic";
    const selectedTopic = topic || "Environment & Sustainability";

    const ai = getAi();
    const promptText = 
      `Create a complete miniature IELTS ${selectedType} test with four modules: Reading, Listening, Writing, and Speaking.\n` +
      `The overarching theme or topic should be: "${selectedTopic}".\n\n` +
      `Structure requirements:\n` +
      `1. Reading: Return a coherent reading passage (approx. 250-350 words) suitable for IELTS level. Create exactly 3 interactive reading questions (mix of multiple-choice and fill-blank).\n` +
      `2. Listening: Return an IELTS conversation scenario description and full transcript dialog (about 200 words) to read or play as dialogue. Create exactly 3 interactive matching/completion questions based on this dialog.\n` +
      `3. Writing: Define Academic/General prompt questions. Academic Task 1 should involve describing visual data/processes. Academic Task 2 is an essay prompt. Return simple structured advice for both tasks.\n` +
      `4. Speaking: Define speaking practice tasks: one Read Aloud prompt (approx. 60-80 words requiring clear oral articulation) and one Describe Image prompt (an IELTS style chart/diagram description that has multiple data points to compare).`;

    const systemInstruction = 
      "You are 'Language World IELTS Exam Planner'. You design highly realistic IELTS-style standard curriculum tests. " +
      "Ensure all questions contain valid options (exactly 4 options if MCQ) and clear answers and step-by-step grammatical explanations. " +
      "Only return valid JSON data conforming fully to the output schema.";

    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              theme: { type: Type.STRING },
              reading: {
                type: Type.OBJECT,
                properties: {
                  passage: { type: Type.STRING },
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.INTEGER },
                        type: { type: Type.STRING, description: "Select either 'multiple-choice' or 'fill-blank'" },
                        question: { type: Type.STRING },
                        options: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Exactly 4 options if MCQ, or completely null/empty if fill-blank"
                        },
                        answer: { type: Type.STRING, description: "Correct exact word or MCQ option string" },
                        explanation: { type: Type.STRING }
                      },
                      required: ["id", "type", "question", "answer", "explanation"]
                    }
                  }
                },
                required: ["passage", "questions"]
              },
              listening: {
                type: Type.OBJECT,
                properties: {
                  scenario: { type: Type.STRING },
                  transcript: { type: Type.STRING, description: "An IELTS-style audio dialog format, with speakers named clearly like 'Joe: ...' and 'Sarah: ...'" },
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.INTEGER },
                        type: { type: Type.STRING, description: "'multiple-choice' or 'fill-blank'" },
                        question: { type: Type.STRING },
                        options: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Exactly 4 options if MCQ, or null if fill-blank"
                        },
                        answer: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      },
                      required: ["id", "type", "question", "answer", "explanation"]
                    }
                  }
                },
                required: ["scenario", "transcript", "questions"]
              },
              writing: {
                type: Type.OBJECT,
                properties: {
                  task1Prompt: { type: Type.STRING },
                  task1Advice: { type: Type.STRING },
                  task2Prompt: { type: Type.STRING },
                  task2Advice: { type: Type.STRING }
                },
                required: ["task1Prompt", "task1Advice", "task2Prompt", "task2Advice"]
              },
              speaking: {
                type: Type.OBJECT,
                properties: {
                  readAloudPrompt: { type: Type.STRING, description: "A phonetic paragraph layout of 60-80 words suited for oral IELTS evaluation." },
                  describeImagePrompt: { type: Type.STRING, description: "An IELTS style chart or flow outline describing structured points to visually describe and verbally compare." }
                },
                required: ["readAloudPrompt", "describeImagePrompt"]
              }
            },
            required: ["title", "theme", "reading", "listening", "writing", "speaking"]
          }
        }
      })
    );

    const outputJson = parseJsonResponse(response.text || "{}");
    res.json(outputJson);
  } catch (err: any) {
    console.error("IELTS test generator error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to generate dynamic IELTS exam sheets with AI." 
    });
  }
});


// 6. PTE Essay Assessment & Score Engine (10 - 90 scale)
app.post("/api/pte/evaluate-essay", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { prompt, essay } = req.body;
    if (!essay || essay.trim().length === 0) {
      return res.status(400).json({ error: "Your essay entry is empty. Please type some text to submit." });
    }

    const ai = getAi();
    const evaluationPrompt = 
      `Evaluate the following PTE academic essay response.\n\n` +
      `PROMPT: "${prompt || 'Some people think that universities should provide graduates with the knowledge and skills needed in the workplace.'}"\n\n` +
      `STUDENT ESSAY:\n${essay}\n\n` +
      `Evaluate based on standard PTE academic scoring criteria: Content, Formal Requirements (word limit 200-300 words), Grammar, Spelling, Vocabulary, and Written Discourse. ` +
      `Provide an overall score between 10 and 90. Give individual criteria scores between 10 and 90. ` +
      `Provide constructive, highly actionable feedback and an improved band 90-grade rewrite version.`;

    const systemInstruction = 
      "You are 'Language World PTE Senior Assessor', a certified Pearson academic test evaluator. " +
      "You score essays with professional scrutiny following exact Pearson guidelines. " +
      "Return raw, clean JSON data matching the requested schema. Be extremely rigorous when calculating scores.";

    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: evaluationPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER, description: "Overall PTE score from 10 to 90" },
              criteriaScores: {
                type: Type.OBJECT,
                properties: {
                  content: {
                    type: Type.OBJECT,
                    properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING } },
                    required: ["score", "feedback"]
                  },
                  form: {
                    type: Type.OBJECT,
                    properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING } },
                    required: ["score", "feedback"]
                  },
                  grammar: {
                    type: Type.OBJECT,
                    properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING } },
                    required: ["score", "feedback"]
                  },
                  vocabulary: {
                    type: Type.OBJECT,
                    properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING } },
                    required: ["score", "feedback"]
                  },
                  spelling: {
                    type: Type.OBJECT,
                    properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING } },
                    required: ["score", "feedback"]
                  },
                  discourse: {
                    type: Type.OBJECT,
                    properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING } },
                    required: ["score", "feedback"]
                  }
                },
                required: ["content", "form", "grammar", "vocabulary", "spelling", "discourse"]
              },
              keyStrengths: { type: Type.STRING },
              areasToImprove: { type: Type.STRING },
              improvedEssay: { type: Type.STRING }
            },
            required: ["overallScore", "criteriaScores", "keyStrengths", "areasToImprove", "improvedEssay"]
          }
        }
      })
    );

    const outputJson = parseJsonResponse(response.text || "{}");
    res.json(outputJson);
  } catch (err: any) {
    console.error("PTE essay scoring error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to analyze PTE essay with AI." 
    });
  }
});


// 7. PTE Speaking Evaluation (Read Aloud, Describe Image, Retell Lecture)
app.post("/api/pte/evaluate-speaking", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { taskType, originalPrompt, userTranscript } = req.body;

    const ai = getAi();
    const promptText = 
      `Assess a PTE Speaking task execution.\n` +
      `Task Type: "${taskType || 'Read Aloud'}"\n` +
      `Task Prompt details: "${originalPrompt}"\n` +
      `User's spoken transcript or notes/attempt: "${userTranscript || '(Read-aloud utterance submission)'}"\n\n` +
      `Please provide professional metrics on: Pronunciation, Oral Fluency, Content, and Pacing (each scored 10-90). \n` +
      `Calculate an Overall Speaking score on a scale from 10 to 90. Give rigorous descriptive feedback with recommendations, paying close attention to speed, rhythm, pauses, and flow.\n` +
      `Provide a "modelSpeech" text which represents an exemplary 40-second spoken answer capturing the primary details, trends, and conclusions of the image or text.`;

    const systemInstruction = 
      "You are 'Language World PTE Speaking Examiner', a PTE Academic oral proficiency evaluator. " +
      "You score pronunciation, oral fluency, content, and pacing with precision. Return clean JSON data.";

    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER },
              pronunciationScore: { type: Type.NUMBER },
              fluencyScore: { type: Type.NUMBER },
              contentScore: { type: Type.NUMBER },
              pacingScore: { type: Type.NUMBER, description: "Rhythm and pacing score from 10 to 90, evaluating speed, natural pausing, and flow." },
              feedback: { type: Type.STRING },
              tips: { type: Type.STRING },
              modelSpeech: { type: Type.STRING, description: "Exemplary high-scoring model spoken answer (approx. 40 seconds) presenting all key elements, peaks, and conclusions of the image or prompt." }
            },
            required: ["overallScore", "pronunciationScore", "fluencyScore", "contentScore", "pacingScore", "feedback", "tips", "modelSpeech"]
          }
        }
      })
    );

    const outputJson = parseJsonResponse(response.text || "{}");
    res.json(outputJson);
  } catch (err: any) {
    console.error("PTE speaking assessment error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze Speaking attempt with AI." });
  }
});


// 8. Vite middleware Integration for Development & Production fallback
async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted successfully to custom server.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully running on http://0.0.0.0:${PORT}`);
  });
}

serveApp();
