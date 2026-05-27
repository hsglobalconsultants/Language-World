export interface VocabItem {
  word: string;
  translation: string;
  category: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface PronunciationItem {
  phrase: string;
  translation: string;
  audioText: string;
}

export const GERMAN_VOCAB: Record<string, VocabItem[]> = {
  A1: [
    { word: "Hallo", translation: "Hello", category: "Greeting" },
    { word: "Danke", translation: "Thank you", category: "Politeness" },
    { word: "Bitte", translation: "Please / You're welcome", category: "Politeness" },
    { word: "Entschuldigung", translation: "Excuse me / Sorry", category: "Social" },
    { word: "Auf Wiedersehen", translation: "Goodbye", category: "Greeting" },
    { word: "Der Apfel", translation: "The Apple", category: "Food & Drinks" },
    { word: "Das Buch", translation: "The Book", category: "Everyday Objects" },
    { word: "Die Schule", translation: "The School", category: "Places" },
    { word: "Das Wasser", translation: "The Water", category: "Food & Drinks" },
    { word: "Guten Morgen", translation: "Good Morning", category: "Greeting" }
  ],
  A2: [
    { word: "Die Einladung", translation: "The invitation", category: "Social Life" },
    { word: "Der Termin", translation: "The appointment", category: "Daily Routine" },
    { word: "Empfehlen", translation: "To recommend", category: "Verbs" },
    { word: "Das Geschenk", translation: "The gift / present", category: "Celebrations" },
    { word: "Gemeinsam", translation: "Together", category: "Adjectives" },
    { word: "Einkaufen", translation: "To shop / shopping", category: "Verbs" },
    { word: "Günstig", translation: "Cheap / Affordable", category: "Adjectives" },
    { word: "Der Ausflug", translation: "The excursion / short trip", category: "Leisure" },
    { word: "Vergessen", translation: "To forget", category: "Verbs" },
    { word: "Die Gesundheit", translation: "The health", category: "Well-being" }
  ],
  B1: [
    { word: "Die Entscheidung", translation: "The decision", category: "Cognition" },
    { word: "Beeinflussen", translation: "To influence", category: "Social Verbs" },
    { word: "Die Herausforderung", translation: "The challenge / test", category: "Career & Study" },
    { word: "Unterstützen", translation: "To support / assist", category: "Verbs" },
    { word: "Zufälligerweise", translation: "Coincidentally / By chance", category: "Adverbs" },
    { word: "Die Beziehung", translation: "The relationship", category: "Social Life" },
    { word: "Sich bewerben", translation: "To apply (for a job)", category: "Business German" },
    { word: "Erfolgreich", translation: "Successful", category: "Workforce" },
    { word: "Die Erfahrung", translation: "The experience", category: "General Study" },
    { word: "Vermeiden", translation: "To avoid / escape", category: "Abstract Verbs" }
  ],
  B2: [
    { word: "Die Voraussetzung", translation: "The prerequisite / requirement", category: "Official & Business" },
    { word: "Berücksichtigen", translation: "To take into consideration / account", category: "Formal Verbs" },
    { word: "Der Zusammenhang", translation: "The context / connection", category: "Logic & Academic" },
    { word: "Nachhaltig", translation: "Sustainable", category: "Environment" },
    { word: "Die Gewährleistung", translation: "The guarantee / warranting", category: "Commercial" },
    { word: "Widersprechen", translation: "To contradict / object", category: "Discussion" },
    { word: "Beeinträchtigen", translation: "To impair / negatively affect", category: "Technical terms" },
    { word: "Die Überzeugung", translation: "The conviction / strong belief", category: "Opinion" },
    { word: "Umfangreich", translation: "Comprehensive / Extensive", category: "Adjectives" },
    { word: "Die Verantwortung", translation: "The responsibility", category: "Civic Life" }
  ]
};

export const GERMAN_QUIZ: Record<string, QuizItem[]> = {
  A1: [
    {
      question: "Which gender article is correct for 'Apfel' (Apple)?",
      options: ["Der", "Die", "Das", "Ein"],
      answer: "Der",
      explanation: "'Apfel' is a masculine noun, so it takes the definite article 'der'."
    },
    {
      question: "How do you say 'How are you?' in German informally?",
      options: ["Wie geht es dir?", "Wo bist du?", "Wer ist das?", "Wie alt bist du?"],
      answer: "Wie geht es dir?",
      explanation: "'Wie geht es dir?' or 'Wie geht's?' means 'How are you?' informally in German."
    },
    {
      question: "What does 'Ich trinke Wasser' mean?",
      options: ["I drink milk", "I drink juice", "I drink water", "I eat apples"],
      answer: "I drink water",
      explanation: "'Ich trinke' means 'I drink' and 'Wasser' means 'water'."
    },
    {
      question: "Which of the following coordinates with 'Ich' for the verb 'wohnen' (to live)?",
      options: ["wohne", "wohnst", "wohnt", "wohnen"],
      answer: "wohne",
      explanation: "Verb conjugation ending for 'ich' in the present tense is always '-e'."
    }
  ],
  A2: [
    {
      question: "Identify the correct separable verb prefix: 'Ich kaufe heute ___ (einkaufen)'.",
      options: ["an", "ein", "aus", "mit"],
      answer: "ein",
      explanation: "The verb is 'einkaufen' (to shop). In a main clause, the separable prefix 'ein' moves to the end of the sentence."
    },
    {
      question: "Fill in the correct accusative pronoun: 'Siehst du meinen Bruder? Ja, ich sehe ___.'",
      options: ["ihn", "ihm", "er", "es"],
      answer: "ihn",
      explanation: " 'Bruder' is masculine (der/mein Bruder). The accusative case singular pronoun for masculine nouns is 'ihn'."
    },
    {
      question: "Complete: 'Wenn es morgen regnet, ___ ich zu Hause.'",
      options: ["bleibe", "bleibst", "bleiben", "bleibt"],
      answer: "bleibe",
      explanation: "The main verb conjugates with 'ich' (bleibe). Since it is a dependent clause structure ('Wenn...'), the second verb starts the main clause."
    },
    {
      question: "Which preposition always requires the dative case standardly?",
      options: ["mit", "für", "gegen", "ohne"],
      answer: "mit",
      explanation: "'mit' always triggers the dative case. 'für', 'gegen', and 'ohne' are purely accusative prepositions."
    }
  ],
  B1: [
    {
      question: "Complete the indirect question: 'Ich weiß nicht, ob er heute ___.'",
      options: ["kommt", "gekommen", "kommen", "kamst"],
      answer: "kommt",
      explanation: "Subordinating conjunctions like 'ob' place the conjugated finite verb at the very end of the subclause."
    },
    {
      question: "Choose the correct Subjunctive II (Konjunktiv II) word: 'Wenn ich reich wäre, ___ ich ein großes Haus.'",
      options: ["würde kaufen", "kaufte", "kaufe", "hätte gekauft"],
      answer: "würde kaufen",
      explanation: "'würde' + infinitive is the standard Konjunktiv II construction for general verbs to express hypothetical wishes."
    },
    {
      question: "Fill in the correct relative pronoun: 'Das ist das Kind, ___ Hund weggelaufen ist.'",
      options: ["dessen", "deren", "dem", "das"],
      answer: "dessen",
      explanation: "This requires genitive case singular. Since 'Kind' is neuter (das Kind), the masculine/neuter genitive relative pronoun is 'dessen'."
    },
    {
      question: "Identify the correct conjunction: 'Ich gehe spazieren, ___ es stark regnet.'",
      options: ["obwohl", "weil", "deshalb", "trotzdem"],
      answer: "obwohl",
      explanation: "'obwohl' (although) expresses concession and is a subordinating conjunction, sending the verb to the end."
    }
  ],
  B2: [
    {
      question: "Which modal verb construction indicates past subjective probability / assumption? 'Sie ___ gestern angerufen haben.'",
      options: ["muss", "müsste", "durfte", "sollte"],
      answer: "müsste",
      explanation: "'müsste' combined with perfect infinitive triggers a subjective past assumption (She probably called yesterday)."
    },
    {
      question: "Choose the correct preposition: 'Er wurde ___ Amtsmissbrauch angeklagt.'",
      options: ["wegen", "trotz", "während", "statt"],
      answer: "wegen",
      explanation: "'wegen' denotes because of / due to and triggers genitive ('Amtmissbrauch' is masculine genitive here)."
    },
    {
      question: "Select correct word: 'Der Trainer fordert, dass sich die Mannschaft ___ konzentriert.'",
      options: ["darauf", "worüber", "womit", "hierbei"],
      answer: "darauf",
      explanation: "'Konzentrieren' takes the preposition 'auf' + accusative. Therefore, the prepositional adverb is 'darauf'."
    },
    {
      question: "Identify the passive voice in past perfect (Plusquamperfekt):",
      options: [
        "Das Haus war gebaut worden.",
        "Das Haus wurde gebaut.",
        "Das Haus ist gebaut worden.",
        "Das Haus wird gebaut werden."
      ],
      answer: "Das Haus war gebaut worden.",
      explanation: "Plusquamperfekt passive is formed with 'war' + ge-Partizip + 'worden'."
    }
  ]
};

export const PRONUNCIATION_PHRASES: Record<string, PronunciationItem[]> = {
  A1: [
    { phrase: "Guten Tag", translation: "Good day / Hello", audioText: "Goo-ten Tahk" },
    { phrase: "Ich heiße...", translation: "My name is...", audioText: "Ikh high-suh" },
    { phrase: "Wo ist die Toilette?", translation: "Where is the toilet?", audioText: "Voh ist dee toy-let-uh" },
    { phrase: "Prost!", translation: "Cheers!", audioText: "Prohst" }
  ],
  A2: [
    { phrase: "Mir geht's sehr gut, danke!", translation: "I'm doing very well, thanks!", audioText: "Meer gayts zair goot, dahnk-uh" },
    { phrase: "Was machst du heute?", translation: "What are you doing today?", audioText: "Vahs makhst doo hoy-tuh" },
    { phrase: "Kannst du mir helfen?", translation: "Can you help me?", audioText: "Kahnst doo meer helf-en" },
    { phrase: "Ich freue mich darauf!", translation: "I'm looking forward to it!", audioText: "Ikh froy-uh mikhr dah-rowf" }
  ],
  B1: [
    { phrase: "Es hängt ganz von der Situation ab.", translation: "It depends entirely on the situation.", audioText: "Es herngt gahnts fon lair zeet-oo-aht-syohn ahbst" },
    { phrase: "Ich stimme dir absolut zu.", translation: "I agree with you absolutely.", audioText: "Ikh shteem-uh deer ahb-so-loot tsoo" },
    { phrase: "Könnten Sie das bitte wiederholen?", translation: "Could you please repeat that? (formal)", audioText: "Kern-ten zee dahs beet-uh vee-der-hoh-len" },
    { phrase: "Satzverbindungen sind sehr wichtig.", translation: "Sentence connections are very important.", audioText: "Zahts-fair-been-doong-en zeent zair veekh-teekh" }
  ],
  B2: [
    { phrase: "Wir müssen alle relevanten Faktoren berücksichtigen.", translation: "We must consider all relevant factors.", audioText: "Veer mews-en ahl-uh ray-lay-vahn-ten fahk-toh-ren bair-ewk-zeekh-tee-gen" },
    { phrase: "Diese Entscheidung hat weitreichende Konsequenzen.", translation: "This decision has far-reaching consequences.", audioText: "Deez-uh ent-shy-doong haht vite-ry-khend-uh kon-zay-kven-tsen" },
    { phrase: "Das widerspricht meinen bisherigen Erfahrungen.", translation: "That contradicts my previous experiences.", audioText: "Dahs vee-der-shpreekht myn-en bees-heer-ee-gen air-fah-roong-en" },
    { phrase: "Nachhaltigkeit spielt eine entscheidende Rolle.", translation: "Sustainability plays a decisive role.", audioText: "Nahkh-hahl-teekh-kyte shpeelt ie-nuh ent-shy-dend-uh rol-uh" }
  ]
};
