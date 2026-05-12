import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const scoreLanguageTask = async (examType: 'PTE' | 'IELTS' | 'GERMAN', taskType: string, content: string, originalPrompt: string) => {
  const modelName = "gemini-3-flash-preview";

  const prompt = `
    You are an expert ${examType} examiner. 
    Task Type: ${taskType}
    Original Task Prompt: ${originalPrompt}
    Student Response: ${content}

    Please evaluate this response according to official ${examType} criteria.
    
    For IELTS: Use Band Score 0.0 - 9.0 (0.5 increments). Evaluate on Task Response, Coherence/Cohesion, Lexical Resource, and Grammatical Range/Accuracy.
    For PTE: Use Score 10 - 90. Evaluate on Content, Form, Grammar, Vocabulary, etc.
    For GERMAN: Use CEFR Levels (A1, A2, B1, B2, C1, C2). Evaluate on Grammatical Correctness, Vocabulary Range, Syntax, and Task Achievement.

    Requirement:
    1. A numerical score or level string (${examType === 'IELTS' ? '0.0-9.0' : examType === 'PTE' ? '10-90' : 'A1-C2'}).
    2. Feedback for each criterion.
    3. Suggestions for improvement.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.STRING, description: "The band score or CEFR level" },
            feedback: {
              type: Type.OBJECT,
              properties: {
                criterion1: { type: Type.STRING },
                criterion2: { type: Type.STRING },
                criterion3: { type: Type.STRING },
                criterion4: { type: Type.STRING },
              },
              description: "Detailed feedback on specific evaluation criteria"
            },
            improvement: { type: Type.STRING, description: "Actionable tips for the student" }
          },
          required: ["score", "feedback", "improvement"]
        }
      }
    });
    
    const text = response.text || "";
    try {
      return JSON.parse(text);
    } catch (e) {
      // Fallback for unexpected formats
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw e;
    }
  } catch (error) {
    console.error("Gemini Scoring Error:", error);
    return { 
      score: examType === 'IELTS' ? "0.0" : examType === 'PTE' ? "10" : "A1", 
      feedback: { error: "AI Scoring unavailable" }, 
      improvement: "Please contact support for manual evaluation." 
    };
  }
};

export const translateText = async (text: string, targetLang: string = "English") => {
  const modelName = "gemini-3-flash-preview";
  
  const prompt = `Translate the following text into ${targetLang}. 
  Provide ONLY the translation text. 
  If the input is German, translate to English. If English, translate to German.
  Input: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt
    });
    
    return response.text?.trim() || "Translation failed.";
  } catch (error) {
    console.error("Translation Error:", error);
    return "Could not translate at this time.";
  }
};

export const generateGermanGrammarQuiz = async (count: number = 5) => {
  const modelName = "gemini-3-flash-preview";
  
  const prompt = `Generate a German grammar quiz with exactly ${count} multiple-choice questions.
  Return the response as a VALID JSON array of objects.
  Each object MUST have these fields:
  - question: string (The German sentence with a blank or a question about grammar)
  - options: string[] (Exactly 4 options)
  - answer: string (The correct option from the options array)
  - explanation: string (A brief explanation in English)

  Example format:
  [
    {
      "question": "Ich ___ nach Hause.",
      "options": ["gehen", "gehe", "geht", "gehst"],
      "answer": "gehe",
      "explanation": " 'Ich' takes the verb ending '-e' in present tense."
    }
  ]

  DO NOT include markdown formatting like \`\`\`json. Just return the raw JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt
    });
    
    let text = response.text || "[]";
    // Clean up markdown if AI includes it
    text = text.replace(/```json\n?/, "").replace(/```/, "").trim();
    
    return JSON.parse(text) as Array<{
      question: string;
      options: string[];
      answer: string;
      explanation: string;
    }>;
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return [];
  }
};
