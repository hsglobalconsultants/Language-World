import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Compass, 
  RefreshCw, 
  GraduationCap, 
  CheckCircle2, 
  X, 
  Check, 
  AlertCircle, 
  User, 
  ArrowRight,
  HelpCircle,
  HelpCircle as QuestionIcon,
  FileText,
  Volume2,
  Award,
  PenTool,
  MessageSquare
} from "lucide-react";
import Markdown from "react-markdown";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ExerciseQuestion {
  id: number;
  type: "multiple-choice" | "fill-blank";
  question: string;
  options: string[] | null;
  answer: string;
  explanation: string;
}

interface ExerciseSheet {
  title: string;
  instructions: string;
  questions: ExerciseQuestion[];
}

// Goethe-Zertifikat preset writing topics/prompts
const goetheWritingPrompts: Record<string, { title: string; prompt: string }[]> = {
  A1: [
    {
      title: "Barbecue Party Invitation (Einladung zum Grillfest)",
      prompt: "Your neighbor invited you to a party, but you cannot make it on Friday. Write an email to your neighbor Thomas. 1. Thank him for the nice invitation. 2. Explain why you cannot come on Friday. 3. Suggest a different day (e.g. Sunday afternoon) to meet. (Write about 30 words)."
    },
    {
      title: "Hotel Booking Query (Hotelzimmer reservieren)",
      prompt: "Write a short email to 'Hotel Bayern' in Munich. 1. State that you want to book a double room (Doppelzimmer) for yourself and your wife for 4 nights (June 10th to 14th). 2. Ask if pets are allowed. 3. Ask for confirmation. (Write about 30 words)."
    }
  ],
  A2: [
    {
      title: "Doctor's Appointment Rescheduled (Arzttermin verschieben)",
      prompt: "You have a dental appointment with Dr. Schmidt on Thursday at 14:00, but you have an urgent meeting at your workspace. Write an email to the clinic. 1. Apologize for canceling. 2. State the reason (urgent meeting). 3. Request a new appointment next week, preferably in the morning. (Write about 40 words)."
    },
    {
      title: "Information about a Language Course (Sprachkurs Anfrage)",
      prompt: "You want to enroll in an intensive German course (Intensivkurs) in Berlin. Write an email to the language school. 1. Ask about course start dates for the next month. 2. Ask about the price for A2. 3. Ask if they can help find a room or accommodation. (Write about 40 words)."
    }
  ],
  B1: [
    {
      title: "Formal Rent Request (Wohnung mieten)",
      prompt: "You saw an advertisement for a nice 3-room apartment on the outskirts of Cologne. Write a formal email to the landlord, Frau Becker. 1. Express interest and mention that you are a software engineer relocating from Pakistan. 2. Describe your family situation (moving with spouse). 3. Politely request an appointment for a virtual or physical viewing. (Write about 80 words)."
    },
    {
      title: "Apology to a Friend: Forgotten Meeting (Entschuldigung)",
      prompt: "You forgot to meet your friend Sarah yesterday because your phone was broken and you had no calendar. Write an email to Sarah. 1. Apologize sincerely. 2. Explain how this happened (broken phone). 3. Suggest taking her out for coffee or lunch this weekend to make up. (Write about 80 words)."
    }
  ],
  B2: [
    {
      title: "Opinion Essay: Renewable Energy (Alternative Energien)",
      prompt: "You are writing a comment in an online discussion forum about renewable energies (Erneuerbare Energien). Write a detailed essay of about 100-150 words. 1. State your opinion on solar and wind power. 2. Explain why Pakistan needs to transition to green energy. 3. Highlight the economic and environmental benefits."
    },
    {
      title: "Opinion Essay: Smartphones in Preschools (Smartphones im Kindergarten)",
      prompt: "Write an opinion essay for a study forum on whether young kids in preschool should be given access to digital screens/smartphones. 1. Express your standpoint. 2. Contrast learning benefits with health risks (lack of motor skills, eye-strain). 3. Suggest a balanced approach for parents. (Write about 120-150 words)."
    }
  ]
};

// Goethe Sprechen Cue Cards
const goetheSpeakingCueCards: Record<string, { topic: string; cueWord: string; task: string; hint: string }[]> = {
  A1: [
    {
      topic: "Einkaufen (Shopping)",
      cueWord: "Gemüse (Vegetables)",
      task: "Formulate a grammatically correct question to check if the store has fresh vegetables.",
      hint: "e.g., 'Haben Sie frisches Gemüse?' or 'Wo finde ich das Gemüse?'"
    },
    {
      topic: "Freizeit (Free Time)",
      cueWord: "Sport (Sports)",
      task: "Ask your examiner/partner how often they play sports.",
      hint: "e.g., 'Machen Sie oft Sport?' or 'Welchen Sport spielst du am liebsten?'"
    },
    {
      topic: "Wohnen (Living)",
      cueWord: "Küche (Kitchen)",
      task: "Describe your kitchen at home in 1 sentence.",
      hint: "e.g., 'Meine Küche ist klein, aber sehr modern und sauber.'"
    }
  ],
  A2: [
    {
      topic: "Arbeitsplatz (Workspace)",
      cueWord: "Kollegen (Colleagues)",
      task: "Say that you work in a team and get along very well with your colleagues.",
      hint: "e.g., 'Ich arbeite gerne im Team und meine Kollegen sind sehr nett und freundlich.'"
    },
    {
      topic: "Reisen (Travel)",
      cueWord: "Flugticket (Flight Ticket)",
      task: "Ask what the ticket price of a direct flight from Karachi to Frankfurt is.",
      hint: "e.g., 'Wie viel kostet ein Flugticket von Karatschi nach Frankfurt?'"
    }
  ],
  B1: [
    {
      topic: "Präsentation: Internet im Alter (Internet in Old Age)",
      cueWord: "Vorteile und Nachteile",
      task: "Present a short statement about the pros and cons of senior citizens using computers/internet.",
      hint: "e.g., 'Ein großer Vorteil ist, dass ältere Menschen mit ihrer Familie per Videochat in Kontakt bleiben können. Ein Nachteil ist jedoch, dass die Technik oft kompliziert ist.'"
    },
    {
      topic: "Präsentation: Fleischloser Trend (Vegetarian Diet)",
      cueWord: "Eigene Meinung",
      task: "State your opinion on why many young people are becoming vegetarian.",
      hint: "e.g., 'Meiner Meinung nach ist vegetarisches Leben sehr gesund und schont die Umwelt. Aber in Pakistan essen wir traditionell sehr gerne Fleisch.'"
    }
  ],
  B2: [
    {
      topic: "Diskussion: Studium oder direkt Berufsausbildung? (Study vs. Apprenticeship)",
      cueWord: "Chancen auf dem Arbeitsmarkt",
      task: "Defend why pursuing an Ausbildung (vocational training) in Germany provides highly promising career opportunities.",
      hint: "e.g., 'Eine Ausbildung bietet eine fantastische Kombination aus Theorie und Praxis, sodass man direkt im Betrieb wertvolle Berufserfahrung sammelt und oft sofort übernommen wird.'"
    }
  ]
};

// Start Deutsch 1 (A1) & Goethe-Zertifikat A2, B1, B2 Official interactive questions datasets
const MOCK_FORM_METADATA: Record<string, {
  title: string;
  situation: string;
  advice: string;
  labels: Record<string, string>;
  placeholders: Record<string, string>;
  surnameTarget: string;
  firstnameTarget: string;
  personsTarget: string;
  dateTarget: string;
  durationTarget: string;
  childSeatsTarget: string;
}> = {
  A1: {
    title: "Anmeldeformular — Jugendgästehaus Hamburg",
    situation: "Ihr Freund Eva Meier möchte im August eine Woche Urlaub in Hamburg machen und ein Zimmer im Jugendgästehaus buchen. Sie reist mit 3 Personen (ihr Ehemann und ein 5-jähriges Kind, das einen Kindersitz braucht) am 15. August an. Füllen Sie das folgende Formular aus!",
    advice: "Traveler's surname: Meier, firstname: Eva, total persons is 3, arriving 15 August, staying 1 week, child seat: Ja (Yes).",
    labels: {
      surname: "Familienname (Surname)",
      firstname: "Vorname (First Name)",
      persons: "Anzahl der Personen (No. of Persons)",
      date: "Anreisedatum (Date of arrival)",
      duration: "Aufenthaltsdauer (Duration of Stay)",
      childSeats: "Kindersitz benötigt? (Ja/Nein)",
    },
    placeholders: {
      surname: "e.g., Meier",
      firstname: "e.g., Eva",
      persons: "e.g., 3",
      date: "e.g., 15. August",
      duration: "e.g., 1 Woche",
      childSeats: "Ja / Nein",
    },
    surnameTarget: "Meier",
    firstnameTarget: "Eva",
    personsTarget: "3",
    dateTarget: "15. August",
    durationTarget: "1 Woche / 7 Tage",
    childSeatsTarget: "Ja",
  },
  A2: {
    title: "Anmeldeformular — Deutschkurse Sprachschule",
    situation: "Ihr Bekannter Thomas Schmidt möchte im September einen Intensivkurs für das Niveau A2 buchen. Er bucht den Kurs für eine Dauer von 2 Monaten, beginnend am 1. September. Er benötigt ein Kursbuch (Lehrbuch - Ja). Füllen Sie das folgende Formular für ihn aus!",
    advice: "Student's surname: Schmidt, firstname: Thomas, level query is A2-Level, starting on 1. September, duration is 2 months, textbook: Ja.",
    labels: {
      surname: "Familienname (Surname)",
      firstname: "Vorname (First Name)",
      persons: "Gewünschtes Kurs-Niveau (Target Level)",
      date: "Kursbeginn (Start Date)",
      duration: "Kursdauer (Course Duration)",
      childSeats: "Lehrbuch benötigt? (Ja/Nein)",
    },
    placeholders: {
      surname: "e.g., Schmidt",
      firstname: "e.g., Thomas",
      persons: "e.g., A2-Level",
      date: "e.g., 1. September",
      duration: "e.g., 2 Monate",
      childSeats: "Ja / Nein",
    },
    surnameTarget: "Schmidt",
    firstnameTarget: "Thomas",
    personsTarget: "A2-Level",
    dateTarget: "1. September",
    durationTarget: "2 Monate",
    childSeatsTarget: "Ja",
  },
  B1: {
    title: "Anmeldung — Weiterbildungsakademie Köln",
    situation: "Frau Sarah Müller möchte an einem dreitägigen Seminar für 'Business German' (Geschäftsdeutsch) teilnehmen. Das Seminar beginnt am 10. Oktober. Sie ist bereits Mitglied der Akademie und hat daher Anspruch auf den Mitgliederrabatt (Ja). Füllen Sie das Formular aus!",
    advice: "Candidate's surname: Müller, firstname: Sarah, seminar title represents Business German, starting 10. Oktober, duration is 3 days, member discount: Ja.",
    labels: {
      surname: "Familienname (Surname)",
      firstname: "Vorname (First name)",
      persons: "Seminarthema (Seminar Topic)",
      date: "Beginn am (Start Date)",
      duration: "Seminardauer (Seminar Duration)",
      childSeats: "Mitgliederrabatt? (Ja/Nein)",
    },
    placeholders: {
      surname: "e.g., Müller",
      firstname: "e.g., Sarah",
      persons: "e.g., Business German",
      date: "e.g., 10. Oktober",
      duration: "e.g., 3 Tage",
      childSeats: "Ja / Nein",
    },
    surnameTarget: "Müller",
    firstnameTarget: "Sarah",
    personsTarget: "Business German",
    dateTarget: "10. Oktober",
    durationTarget: "3 Tage",
    childSeatsTarget: "Ja",
  },
  B2: {
    title: "Registrierung — Universitätsbibliothek Berlin",
    situation: "Herr Lukas Fischer studiert Informatik im ersten Semester. Er meldet sich am 1. Oktober für einen Zeitraum von 1 Semester an. Er möchte außerdem die Berechtigung zur kostenlosen Laptop-Leihe aktivieren (Ja). Füllen Sie die Angaben aus!",
    advice: "Student's surname: Fischer, firstname: Lukas, major/subject is Informatik, starts 1. Oktober, library card duration is 1 Semester, laptop rental: Ja.",
    labels: {
      surname: "Nachname (Surname)",
      firstname: "Vorname (First Name)",
      persons: "Studienfach (Subject/Major)",
      date: "Gültig ab (Valid from)",
      duration: "Gültigkeitsdauer (Card Duration)",
      childSeats: "Laptop-Ausleihe aktivieren? (Ja/Nein)",
    },
    placeholders: {
      surname: "e.g., Fischer",
      firstname: "e.g., Lukas",
      persons: "e.g., Informatik",
      date: "e.g., 1. Oktober",
      duration: "e.g., 1 Semester",
      childSeats: "Ja / Nein",
    },
    surnameTarget: "Fischer",
    firstnameTarget: "Lukas",
    personsTarget: "Informatik",
    dateTarget: "1. Oktober",
    durationTarget: "1 Semester",
    childSeatsTarget: "Ja",
  }
};

const GOETHE_MOCK_EXAMS: Record<string, {
  hoeren: {
    id: string;
    question: string;
    options: string[];
    correct: string;
    transcript: string;
    translation: string;
  }[];
  lesen: {
    id: string;
    text: string;
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }[];
  letterPrompt: string;
}> = {
  A1: {
    hoeren: [
      {
        id: "h1",
        question: "Was möchte die Frau trinken?",
        options: ["Kaffee", "Apfelsaft", "Mineralwasser"],
        correct: "Apfelsaft",
        transcript: "Frau: Guten Tag. Ich hätte gern ein kaltes Getränk. Haben Sie Apfelsaft? \nKellner: Ja natürlich, einen Apfelsaft für Sie. Möchten Sie auch einen Kaffee? \nFrau: Nein danke, heute trinke ich lieber einen kalten Apfelsaft.",
        translation: "Woman: Good day. I'd like a cold drink. Do you have apple juice? \nWaiter: Yes of course, one apple juice for you. Would you also like a coffee? \nWoman: No thank you, today I'd prefer a cold apple juice."
      },
      {
        id: "h2",
        question: "In welchem Zimmer findet der Deutschkurs heute statt?",
        options: ["Zimmer 12", "Zimmer 20", "Zimmer 21"],
        correct: "Zimmer 21",
        transcript: "Mann: Entschuldigung, sucht der Deutschkurs A1 nicht Zimmer 12? \nSekretärin: Nein, Zimmer 12 ist besetzt. Der A1-Kurs findet heute im zweiten Stock in Zimmer 21 statt. \nMann: Ach so, Zimmer 21. Vielen Dank!",
        translation: "Man: Excuse me, isn't German course A1 searching for room 12? \nSecretary: No, room 12 is occupied. The A1 course takes place today on the second floor, room 21. \nMan: Oh I see, room 21. Thank you very much!"
      },
      {
        id: "h3",
        question: "Wann fährt der nächste Zug nach Frankfurt?",
        options: ["14:15 Uhr", "14:50 Uhr", "15:15 Uhr"],
        correct: "14:50 Uhr",
        transcript: "Frau: Entschuldigung, fährt der Zug um 14:15 Uhr nach Frankfurt? \nAnsager: Nein, der Zug um 14:15 Uhr fällt heute leider aus. Der nächste Zug nach Frankfurt fährt um 14:50 Uhr von Gleis 7 ab. \nFrau: Okay, also um zehn vor drei. Danke.",
        translation: "Woman: Excuse me, does the train at 2:15 PM go to Frankfurt? \nAnnouncer: No, the 2:15 PM train is cancelled today. The next train to Frankfurt departs at 2:50 PM from platform 7. \nWoman: Okay, so at ten to three. Thanks."
      },
      {
        id: "h4",
        question: "Wie viel kostet die rote Bluse?",
        options: ["15 Euro", "50 Euro", "55 Euro"],
        correct: "15 Euro",
        transcript: "Kundin: Entschuldigung, kostet diese Bluse hier 50 Euro? \nVerkäuferin: Nein, die grüne Bluse kostet 50 Euro. Die rote Bluse ist im Angebot für nur 15 Euro! \nKundin: Wunderbar, dann nehme ich die rote Bluse.",
        translation: "Customer: Excuse me, does this blouse here cost 50 Euros? \nSaleswoman: No, the green blouse costs 50 Euros. The red blouse is on sale for only 15 Euros! \nCustomer: Wonderful, then I will take the red blouse."
      },
      {
        id: "h5",
        question: "Auf welchem Gleis fährt der Zug nach München ab?",
        options: ["Gleis 3", "Gleis 7", "Gleis 11"],
        correct: "Gleis 7",
        transcript: "Ansage: Achtung, eine wichtige Durchsage für Fahrgäste nach München. Der ICE 592 fährt heute nicht von Gleis 3 ab. Er fährt von Gleis 7 ein. Ich wiederhole: Abfahrt nach München heute von Gleis 7.",
        translation: "Announcement: Attention, an important announcement for passengers to Munich. ICE 592 does not depart from platform 3 today. It arrives on platform 7. I repeat: Departure to Munich today from platform 7."
      }
    ],
    lesen: [
      {
        id: "l1",
        text: "Liebe Eva, ich bin jetzt in Berlin. Das Wetter ist super. Gestern war ich im berühmten Museum. Morgen kaufe ich Geschenke für meine Familie und am Sonntag fliege ich zurück nach Karatschi. Liebe Grüße, Maria.",
        question: "Maria ist im Moment in Hamburg.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because Maria mentions 'ich bin jetzt in Berlin' (I am in Berlin now), not Hamburg."
      },
      {
        id: "l2",
        text: "Liebe Eva, ich bin jetzt in Berlin. Das Wetter ist super. Gestern war ich im berühmten Museum. Morgen kaufe ich Geschenke für meine Familie und am Sonntag fliege ich zurück nach Karatschi. Liebe Grüße, Maria.",
        question: "Maria fliegt am Sonntag zurück nach Pakistan.",
        options: ["Richtig", "Falsch"],
        correct: "Richtig",
        explanation: "Richtig, because she states 'am Sonntag fliege ich zurück nach Karatschi' (Karachi is in Pakistan)."
      },
      {
        id: "l3",
        text: "Deutscher Volkshochschul-Verband:\nIntensivkurse für Deutsch als Fremdsprache im Sommer! Deutsch A1 und A2 im August für nur 250 Euro inklusive Bücher und Unterkunft im Studentenheim. Jetzt anmelden unter www.vhs-sommer.de!",
        question: "Der Deutschkurs im August kostet 250 Euro.",
        options: ["Richtig", "Falsch"],
        correct: "Richtig",
        explanation: "Richtig, because the advertisement clearly states 'im August für nur 250 Euro'."
      },
      {
        id: "l4",
        text: "Deutscher Volkshochschul-Verband:\nIntensivkurse für Deutsch als Fremdsprache im Sommer! Deutsch A1 und A2 im August für nur 250 Euro inklusive Bücher und Unterkunft im Studentenheim. Jetzt anmelden unter www.vhs-sommer.de!",
        question: "Die Unterkunft im Studentenheim kostet extra Geld.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because the advertisement states 'für nur 250 Euro inklusive Bücher und Unterkunft' (including books and accommodation)."
      },
      {
        id: "l5",
        text: "Deutscher Volkshochschul-Verband:\nIntensivkurse für Deutsch als Fremdsprache im Sommer! Deutsch A1 und A2 im August für nur 250 Euro inklusive Bücher und Unterkunft im Studentenheim. Jetzt anmelden unter www.vhs-sommer.de!",
        question: "Der Deutschkurs findet im Winter statt.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because it is a summer intensive course scheduled for August."
      }
    ],
    letterPrompt: "Sie möchten im Sommer ein Zimmer im Sporthotel 'Alpenblick' in Garmisch reservieren. Schreiben Sie eine E-Mail. 1. Warum schreiben Sie? 2. Wann möchten Sie kommen und für wie lange? 3. Bitten Sie um eine Antwort. (Schreiben Sie ca. 30 Wörter)"
  },
  A2: {
    hoeren: [
      {
        id: "h1",
        question: "Wo treffen sich die Freunde heute Abend?",
        options: ["Im Café", "Im Kino", "Im Restaurant"],
        correct: "Im Restaurant",
        transcript: "Sven: Hallo Anna, gehen wir heute Abend ins Kino? \nAnna: Nein, der Film läuft erst nächste Woche. Wollen wir ins neue italienische Restaurant gehen? \nSven: Gute Idee! Ich reserviere für uns einen Tisch um 19:30 Uhr im Restaurant.",
        translation: "Sven: Hello Anna, are we going to the cinema tonight? \nAnna: No, the movie doesn't start until next week. Do we want to go to the new Italian restaurant? \nSven: Good idea! I will reserve our table for 7:30 PM in the restaurant."
      },
      {
        id: "h2",
        question: "Wann hat Herr Müller seinen nächsten Zahnarzttermin?",
        options: ["Montag um 9:00 Uhr", "Mittwoch um 14:00 Uhr", "Mittwoch um 16:00 Uhr"],
        correct: "Mittwoch um 14:00 Uhr",
        transcript: "Zahnarzthelferin: Praxis Dr. Weiß, guten Tag. \nHerr Müller: Guten Tag, ich möchte meinen Termin am Montag um 9:00 Uhr verschieben. Haben Sie am Mittwoch Zeit? \nZahnarzthelferin: Ja, am Mittwoch um 14:05 Uhr ist noch ein Termin frei. Passt das? \nHerr Müller: Ja, Mittwoch um zwei Uhr passt perfekt. Vielen Dank.",
        translation: "Dental assistant: Dr. Weiß surgery, good day. \nMr. Müller: Good day, I would like to postpone my appointment on Monday at 9:00 AM. Do you have time on Wednesday? \nDental assistant: Yes, on Wednesday at 2:00 PM there is still a slot available. Does that suit you? \nMr. Müller: Yes, Wednesday at two o'clock fits perfectly. Thank you very much."
      },
      {
        id: "h3",
        question: "Wie wird das Wetter am Wochenende im Süden Deutschlands?",
        options: ["Regnerisch", "Sonnig und warm", "Windig und kalt"],
        correct: "Sonnig und warm",
        transcript: "Wetterbericht: Und hier ist das Wetter für das kommende Wochenende. Im Norden bleibt es regnerisch bei kühlen 12 Grad. Doch wer im Süden Deutschlands lebt, kann sich freuen: Dort wird es am Samstag und Sonntag herrlich sonnig und warm mit bis zu 24 Grad.",
        translation: "Weather report: And here is the weather for the upcoming weekend. In the north, it remains rainy with cool 12 degrees. But those living in the south of Germany can rejoice: there it will be wonderfully sunny and warm on Saturday and Sunday with up to 24 degrees."
      },
      {
        id: "h4",
        question: "Wie reist Frau Becker nach Berlin?",
        options: ["Mit dem Auto", "Mit dem Zug", "Mit dem Flugzeug"],
        correct: "Mit dem Zug",
        transcript: "Frau Becker: Hallo Hans, mein Auto ist kaputt. Ich kann am Samstag leider nicht fahren. \nHans: Ach schade. Fliegst du dann? \nFrau Becker: Nein, Fliegen ist mir zu teuer. Ich nehme den ICE-Zug um 8 Uhr. Das ist bequem und pünktlich.",
        translation: "Mrs. Becker: Hello Hans, my car is broken. I unfortunately cannot drive on Saturday. \nHans: Oh what a pity. Are you flying then? \nMrs. Becker: No, flying is too expensive for me. I am taking the ICE train at 8 o'clock. This is comfortable and punctual."
      },
      {
        id: "h5",
        question: "Was hat der Sohn zum Geburtstag bekommen?",
        options: ["Ein Buch", "Ein Fahrrad", "Ein Handy"],
        correct: "Ein Fahrrad",
        transcript: "Vater: Unser Sohn Thomas hat sich so sehr über sein Geburtstagsgeschenk gefreut! \nMutter: Ja, er ist den ganzen Nachmittag mit dem neuen blauen Fahrrad im Park herumgefahren. \nVater: Zum Glück haben wir kein Handy gekauft, die Bewegung tut ihm gut.",
        translation: "Father: Our son Thomas was so happy with his birthday present! \nMother: Yes, he rode around the park all afternoon with the new blue bicycle. \nFather: Thankfully we didn't buy a mobile phone, the exercise does him good."
      }
    ],
    lesen: [
      {
        id: "l1",
        text: "Bibliothek am Gendarmenmarkt:\nLiebe Leser, ab dem 1. Juni ändern sich unsere Öffnungszeiten. Wir haben nun montags geschlossen. Dafür sind wir am Samstag von 10:00 bis 16:00 Uhr für Sie da. Ausleihen können Sie online rund um die Uhr verlängern.",
        question: "Die Bibliothek ist montags geöffnet.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because the text states 'Wir haben nun montags geschlossen' (We are now closed on Mondays)."
      },
      {
        id: "l2",
        text: "Bibliothek am Gendarmenmarkt:\nLiebe Leser, ab dem 1. Juni ändern sich unsere Öffnungszeiten. Wir haben nun montags geschlossen. Dafür sind wir am Samstag von 10:00 bis 16:00 Uhr für Sie da. Ausleihen können Sie online rund um die Uhr verlängern.",
        question: "Am Samstag kann man ab 10:00 Uhr Bücher ausleihen.",
        options: ["Richtig", "Falsch"],
        correct: "Richtig",
        explanation: "Richtig, because Saturdays they are open from 10:00 to 16:00."
      },
      {
        id: "l3",
        text: "Fit und Gesund Studio:\nSehr geehrte Mitglieder, wir freuen uns, Ihnen mitteilen zu können, dass unser neues Schwimmbad fertig ist! Alle Mitglieder dürfen es ab sofort kostenlos nutzen. Nicht-Mitglieder können eine Tageskarte für 10 Euro kaufen.",
        question: "Mitglieder müssen extra zahlen, um das Schwimmbad zu nutzen.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because it states members can use it 'kostenlos' (for free)."
      },
      {
        id: "l4",
        text: "Fit und Gesund Studio:\nSehr geehrte Mitglieder, wir freuen uns, Ihnen mitteilen zu können, dass unser neues Schwimmbad fertig ist! Alle Mitglieder dürfen es ab sofort kostenlos nutzen. Nicht-Mitglieder können eine Tageskarte für 10 Euro kaufen.",
        question: "Leute, die keine Mitglieder sind, können eine Tageskarte erwerben.",
        options: ["Richtig", "Falsch"],
        correct: "Richtig",
        explanation: "Richtig, because non-members ('Nicht-Mitglieder') can buy a day ticket ('Tageskarte') for 10 Euros."
      },
      {
        id: "l5",
        text: "Fit und Gesund Studio:\nSehr geehrte Mitglieder, wir freuen uns, Ihnen mitteilen zu können, dass unser neues Schwimmbad fertig ist! Alle Mitglieder dürfen es ab sofort kostenlos nutzen. Nicht-Mitglieder können eine Tageskarte für 10 Euro kaufen.",
        question: "Das Schwimmbad ist noch im Bau.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because the text says 'unser neues Schwimmbad ist fertig' (our new swimming pool is finished)."
      }
    ],
    letterPrompt: "Ihr deutscher Freund Paul hat Sie zu seiner Geburtstagsparty am Samstag eingeladen. Sie können aber leider nicht kommen, weil Sie arbeiten müssen. Schreiben Sie eine E-Mail an Paul: 1. Bedanken Sie sich für die Einladung. 2. Erklären Sie, warum Sie nicht kommen können. 3. Schlagen Sie ein Treffen für nächste Woche vor. (Schreiben Sie ca. 40-50 Wörter)"
  },
  B1: {
    hoeren: [
      {
        id: "h1",
        question: "Wo soll der Fahrgast umsteigen, um nach Dresden zu kommen?",
        options: ["In Leipzig Hauptbahnhof", "In Berlin Südkreuz", "In Erfurt Hauptbahnhof"],
        correct: "In Leipzig Hauptbahnhof",
        transcript: "Ansage: Achtung an Gleis 5. Der Intercity aus Erfurt zur Weiterfahrt nach Dresden über Leipzig fährt ein. Fahrgäste nach Dresden werden gebeten, in Leipzig Hauptbahnhof in den Ersatzzug umzusteigen. Der Zug nach Dresden fährt heute von Gleis 12 ab.",
        translation: "Announcement: Attention on platform 5. The Intercity from Erfurt for onward travel to Dresden via Leipzig is arriving. Passengers to Dresden are requested to change to the replacement train at Leipzig Main Station. The train to Dresden departs today from platform 12."
      },
      {
        id: "h2",
        question: "Welches Problem hat der Redner bei der Arbeit?",
        options: ["Sein Gehalt ist zu niedrig", "Sein Arbeitsweg ist zu lang", "Sein Kollege ist oft unpünktlich"],
        correct: "Sein Arbeitsweg ist zu lang",
        transcript: "Sprecher: Ich mag meine Kollegen und meine Aufgaben wirklich sehr. Aber seit unserem Umzug fahre ich jeden Tag fast zwei Stunden pro Richtung mit dem Zug zur Arbeit. Das ist extrem anstrengend und lässt mir kaum noch Freizeit für meine Familie.",
        translation: "Speaker: I really like my colleagues and tasks. But since our move, I travel almost two hours per direction by train to work every day. That is extremely tiring and leaves me with almost no free time for my family."
      },
      {
        id: "h3",
        question: "Was will der Betriebsrat nächste Woche besprechen?",
        options: ["Die Einführung einer 4-Tage-Woche", "Die Renovierung der Kantine", "Das neue Bonussystem"],
        correct: "Die Einführung einer 4-Tage-Woche",
        transcript: "Betriebsrat: Liebe Kolleginnen und Kollegen. Bei unserer nächsten Betriebsversammlung am Mittwoch steht ein großes Thema auf der Tagesordnung: die geplante Einführung einer freiwilligen 4-Tage-Arbeitswoche für die IT-Abteilung. Wir bitten um zahlreiche Teilnahme.",
        translation: "Works Council: Dear colleagues. At our next works meeting on Wednesday, a major topic is on the agenda: the planned introduction of a voluntary 4-day work week for the IT department. We request active attendance."
      },
      {
        id: "h4",
        question: "Wie bewertet der Mann das neue Home-Office-Gesetz?",
        options: ["Er findet es absolut fantastisch", "Er findet es kompliziert aber fortschrittlich", "Er lehnt es komplett ab"],
        correct: "Er findet es kompliziert aber fortschrittlich",
        transcript: "Mann: Also, ich finde dieses neue Home-Office-Gesetz einerseits ziemlich kompliziert formuliert, da gibt es viele rechtliche Unklarheiten für uns Arbeitnehmer. Andererseits ist es ein echter Fortschritt für die Vereinbarkeit von Beruf und Familie.",
        translation: "Man: Well, on one hand, I find this new home office law quite complicatedly formulated, there are many legal uncertainties for us employees. On the other hand, it is a real step forward for the compatibility of career and family."
      },
      {
        id: "h5",
        question: "Aus welchem Grund ruft der Kunde beim Support an?",
        options: ["Sein Internetanschluss funktioniert nicht", "Sein Router wurde nicht geliefert", "Seine Rechnung ist fehlerhaft"],
        correct: "Seine Rechnung ist fehlerhaft",
        transcript: "Kunde: Guten Tag, mein Name ist Peters. Ich habe gestern meine Monatsrechnung erhalten und festgestellt, dass mir 25 Euro für eine option berechnet wurden, die ich vor zwei Monaten fristgerecht gekündigt hatte. Das Internet läuft prima, aber die Summe stimmt nicht.",
        translation: "Customer: Good day, my name is Peters. I received my monthly invoice yesterday and noticed that I was charged 25 Euros for an option that I had cancelled on time two months ago. The Internet runs fine, but the sum is incorrect."
      }
    ],
    lesen: [
      {
        id: "l1",
        text: "Studie zur Work-Life-Balance:\nImmer mehr deutsche Arbeitnehmer wünschen sich flexible Arbeitszeiten. Laut einer aktuellen Umfrage würden über 70 Prozent der Befragten gerne mindestens zwei Tage pro Woche im Home-Office arbeiten. Experten betonen jedoch, dass dies eine klare Trennung zwischen Beruf und Privatleben voraussetzt.",
        question: "Die Mehrheit der befragten Arbeitnehmer befürwortet Home-Office-Regelungen.",
        options: ["Richtig", "Falsch"],
        correct: "Richtig",
        explanation: "Richtig, because 70 percent (a clear majority) would like to work from home at least two days a week."
      },
      {
        id: "l2",
        text: "Studie zur Work-Life-Balance:\nImmer mehr deutsche Arbeitnehmer wünschen sich flexible Arbeitszeiten. Laut einer aktuellen Umfrage würden über 70 Prozent der Befragten gerne mindestens zwei Tage pro Woche im Home-Office arbeiten. Experten betonen jedoch, dass dies eine klare Trennung zwischen Beruf und Privatleben voraussetzt.",
        question: "Experten sagen, dass Home-Office keine Herausforderungen für das Privatleben darstellt.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because experts emphasize that it requires a clear division between professional and private life, implying challenges."
      },
      {
        id: "l3",
        text: "Mitteilung der Berliner Verkehrsbetriebe (BVG):\nSehr geehrte Fahrgäste, wegen Bauarbeiten an den Gleisen ist die U-Bahn-Linie U2 vom 15. Juni bis zum 30. Juni zwischen Alexanderplatz und Zoologischer Garten unterbrochen. Bitte nutzen Sie unseren Schienenersatzverkehr mit Bussen (SEV) oder weichen Sie auf die S-Bahnen aus.",
        question: "Die U2 fährt im gesamten Monat Juni wie gewohnt.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because it is suspended ('unterbrochen') from June 15 to June 30 due to track works."
      },
      {
        id: "l4",
        text: "Mitteilung der Berliner Verkehrsbetriebe (BVG):\nSehr geehrte Fahrgäste, wegen Bauarbeiten an den Gleisen ist die U-Bahn-Linie U2 vom 15. Juni bis zum 30. Juni zwischen Alexanderplatz und Zoologischer Garten unterbrochen. Bitte nutzen Sie unseren Schienenersatzverkehr mit Bussen (SEV) oder weichen Sie auf die S-Bahnen aus.",
        question: "Fahrgäste können Busse als Schienenersatzverkehr nutzen.",
        options: ["Richtig", "Falsch"],
        correct: "Richtig",
        explanation: "Richtig, because they suggest using 'Schienenersatzverkehr mit Bussen (SEV)'."
      },
      {
        id: "l5",
        text: "Mitteilung der Berliner Verkehrsbetriebe (BVG):\nSehr geehrte Fahrgäste, wegen Bauarbeiten an den Gleisen ist die U-Bahn-Linie U2 vom 15. Juni bis zum 30. Juni zwischen Alexanderplatz und Zoologischer Garten unterbrochen. Bitte nutzen Sie unseren Schienenersatzverkehr mit Bussen (SEV) oder weichen Sie auf die S-Bahnen aus.",
        question: "Die S-Bahnen sind von den Bauarbeiten ebenfalls betroffen.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because S-Bahnen are suggested as an alternative bypass, meaning they are active and unaffected."
      }
    ],
    letterPrompt: "Ihre Vermieterin, Frau Weber, hat angekündigt, dass die Heizung in Ihrem Haus für eine Woche im Winter abgestellt wird, um Reparaturen durchzuführen. Das finden Sie inakzeptabel. Schreiben Sie einen formellen Brief/E-Mail an Frau Weber: 1. Beschweren Sie sich über den Zeitpunkt der Reparatur. 2. Beschreiben Sie Ihre Situation (Kälte, Familie, Gesundheit). 3. Bitten Sie um eine finanzielle Mietminderung oder eine Alternative (z.B. Heizgeräte). (Schreiben Sie ca. 80 Wörter)"
  },
  B2: {
    hoeren: [
      {
        id: "h1",
        question: "Welchen Hauptgrund nennt der Professor für das Scheitern von Start-ups?",
        options: ["Mangelndes Kapital", "Unzureichende Marktanalyse", "Konflikte im Gründerteam"],
        correct: "Unzureichende Marktanalyse",
        transcript: "Professor: Es wird oft behauptet, der Hauptgrund für das Scheitern junger Unternehmen sei fehlende Liquidität. Das ist jedoch meist nur ein Symptom. Die wahre Ursache liegt in weit über 60 Prozent der Fälle in einer mangelhaften oder unrealistischen vorherigen Marktanalyse, da am tatsächlichen Bedarf der Verbraucher vorbeientwickelt wird.",
        translation: "Professor: It is often claimed that the main reason for startups failing is a lack of liquidity. However, this is usually just a symptom. The real cause in over 60 percent of cases lies in an inadequate or unrealistic prior market analysis, as products are developed ignoring the actual needs of consumers."
      },
      {
        id: "h2",
        question: "Wie steht der Experte zur Einführung Künstlicher Intelligenz in Schulen?",
        options: ["Er befürwortet sie uneingeschränkt", "Er fordert erst gründliche Lehrerschulungen und Richtlinien", "Er lehnt sie aus datenschutzrechtlichen Gründen ab"],
        correct: "Er fordert erst gründliche Lehrerschulungen und Richtlinien",
        transcript: "Experte: Künstliche Intelligenz bietet zweifellos didaktische Chancen. Es wäre jedoch fatal, diese Tools flächendeckend einzuführen, bevor wir nicht verbindliche ethische Richtlinien etabliert und vor allem die Lehrkräfte intensiv in Medienkompetenz geschult haben. Technologie ohne pädagogisches Konzept verpufft.",
        translation: "Expert: Artificial intelligence undoubtedly offers didactic opportunities. However, it would be fatal to introduce these tools nationwide until we establish binding ethical guidelines and, above all, intensively train teachers in media literacy. Technology without a pedagogical concept is useless."
      },
      {
        id: "h3",
        question: "Warum lehnen Kritiker den Ausbau des neuen Stadtteils ab?",
        options: ["Wegen der immensen Verschuldung der Stadt", "Wegen der Zerstörung eines wichtigen Naherholungsgebiets", "Wegen mangelnder Anbindung an den Nahverkehr"],
        correct: "Wegen der Zerstörung eines wichtigen Naherholungsgebiets",
        transcript: "Sprecherin: Der Stadtrat argumentiert mit dringend benötigtem Wohnraum. Doch das geplante Areal grenzt an den Stadtwald, ein Naturschutzgebiet, das seit Jahrzehnten als unverzichtbare grüne Lunge und Naherholungsgebiet für Tausende Bürger dient. Dieser Eingriff in das ökologische Gleichgewicht ist unverantwortlich.",
        translation: "Speaker: The city council argues with urgently needed housing. But the planned area borders the city forest, a nature reserve that has served for decades as an indispensable green lung and recreational area for thousands of citizens. This intervention in the ecological balance is irresponsible."
      },
      {
        id: "h4",
        question: "Welche Veränderung beobachtet die Soziologin im Konsumverhalten?",
        options: ["Einen Trend hin zu billigen Discount-Produkten", "Einen zunehmenden Fokus auf Langlebigkeit und Nachhaltigkeit", "Eine vollständige Abkehr vom Online-Handel"],
        correct: "Einen zunehmenden Fokus auf Langlebigkeit und Nachhaltigkeit",
        transcript: "Soziologin: Wir beobachten in den letzten Jahren einen deutlichen Wertewandel bei den 20- bis 40-Jährigen. Der Statuswert schneller Trends nimmt ab. Konsumenten hinterfragen zunehmend Lieferketten und entscheiden sich für qualitativ hochwertige Produkte, die reparierbar sind. Nachhaltigkeit schlägt Bequemlichkeit.",
        translation: "Sociologist: We have observed a significant shift in values among 20- to 40-year-olds in recent years. The status value of fast trends is decreasing. Consumers are increasingly questioning supply chains and choosing high-quality, repairable products. Sustainability beats convenience."
      },
      {
        id: "h5",
        question: "Was empfiehlt der Karriereberater für Gehaltsverhandlungen?",
        options: ["Den eigenen Marktwert mit konkreten Erfolgen zu untermauern", "Gleich zu Beginn ein finales Ultimatum zu stellen", "Das aktuelle Angebot der Konkurrenz zu erwähnen"],
        correct: "Den eigenen Marktwert mit konkreten Erfolgen zu untermauern",
        transcript: "Karriereberater: Betreten Sie Verhandlungen niemals mit vagen Phrasen wie 'Ich arbeite hart'. Sie müssen Ihren Marktwert messbar machen. Bereiten Sie eine Liste Ihrer konkreten Erfolge des letzten Jahres vor — sei es Umsatzsteigerung oder Prozessoptimierung. Fakten lassen sich schwer wegdiskutieren.",
        translation: "Career Advisor: Never enter negotiations with vague phrases like 'Ich arbeite hart'. You must make your market value measurable. Prepare a list of your concrete achievements from the past year — whether it's sales growth or process optimization. Facts are hard to argue with."
      }
    ],
    lesen: [
      {
        id: "l1",
        text: "Klimawandel und Stadtarchitektur:\nModerne Metropolen müssen sich den steigenden Temperaturen anpassen. 'Urban Heat Islands' entstehen durch Betonflächen, die Giga-Mengen an Sonnenstrahlung speichern. Lösungsansätze wie Fassadenbegrünungen und helle Reflexionsanstriche auf Dächern können die Durchschnittstemperatur in dichten Quartieren um bis zu 3 Grad senken.",
        question: "Dachbegrünungen und helle Farben können helfen, städtische Hitzeinseln zu mildern.",
        options: ["Richtig", "Falsch"],
        correct: "Richtig",
        explanation: "Richtig, because Fassadenbegrünung (facade greening) and bright reflective coatings (Reflexionsanstriche) on roofs can reduce temperature by up to 3 degrees."
      },
      {
        id: "l2",
        text: "Klimawandel und Stadtarchitektur:\nModerne Metropolen müssen sich den steigenden Temperaturen anpassen. 'Urban Heat Islands' entstehen durch Betonflächen, die Giga-Mengen an Sonnenstrahlung speichern. Lösungsansätze wie Fassadenbegrünungen und helle Reflexionsanstriche auf Dächern können die Durchschnittstemperatur in dichten Quartieren um bis zu 3 Grad senken.",
        question: "Betonflächen reflektieren die Sonnenstrahlung vollständig und kühlen die Stadt ab.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because concrete surfaces absorb and store massive amounts of solar radiation ('speichern Sonnenstrahlung'), creating heat islands."
      },
      {
        id: "l3",
        text: "Debatte über das bedingungslose Grundeinkommen:\nDie Idee, jedem Bürger monatlich einen festen Geldbetrag ohne Gegenleistung auszuzahlen, polarisiert. Befürworter betonen die Steigerung der individuellen Freiheit und die Verringerung existentieller Sorgen. Gegner warnen vor einer massiven Inflation und dem schwindenden Leistungsanreiz in systemrelevanten Berufen.",
        question: "Gegner befürchten, dass ein Grundeinkommen den Arbeitsanreiz verringern könnte.",
        options: ["Richtig", "Falsch"],
        correct: "Richtig",
        explanation: "Richtig, because opponents ('Gegner') warn about declining performance incentive ('schwindender Leistungsanreiz') in system-relevant jobs."
      },
      {
        id: "l4",
        text: "Debatte über das bedingungslose Grundeinkommen:\nDie Idee, jedem Bürger monatlich einen festen Geldbetrag ohne Gegenleistung auszuzahlen, polarisiert. Befürworter betonen die Steigerung der individuellen Freiheit und die Verringerung existentieller Sorgen. Gegner warnen vor einer massiven Inflation und dem schwindenden Leistungsanreiz in systemrelevanten Berufen.",
        question: "Befürworter des Modells befürchten eine unkontrollierbare Geldentwertung.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because fear of high inflation ('Geldentwertung') is an argument raised by the opponents ('Gegner'), whereas supporters ('Befürworter') focus on freedom and reduction of worries."
      },
      {
        id: "l5",
        text: "Debatte über das bedingungslose Grundeinkommen:\nDie Idee, jedem Bürger monatlich einen festen Geldbetrag ohne Gegenleistung auszuzahlen, polarisiert. Befürworter betonen die Steigerung der individuellen Freiheit und die Verringerung existentieller Sorgen. Gegner warnen vor einer massiven Inflation und dem schwindenden Leistungsanreiz in systemrelevanten Berufen.",
        question: "Das bedingungslose Grundeinkommen wird bereits in ganz Deutschland verpflichtend ausgezahlt.",
        options: ["Richtig", "Falsch"],
        correct: "Falsch",
        explanation: "Falsch, because the text introduces the concept as an idea in a polarizing debate ('Die Idee... polarisiert'), not a reality."
      }
    ],
    letterPrompt: "Ihre Abteilung in der Firma hat in letzter Zeit eine extrem hohe Arbeitsbelastung aufgrund von personellen Engpässen. Schreiben Sie eine formelle Beschwerde an den Abteilungsleiter, Herrn Dr. Neumann: 1. Beschreiben Sie die aktuelle Überlastungssituation und deren Auswirkungen auf die Qualität der Arbeit. 2. Kritisieren Sie den Mangel an rechtzeitiger Unterstützung oder offener Kommunikation. 3. Schlagen Sie konstruktive, sofortige Abhilfemaßnahmen vor (z.B. temporäre Aushilfen, Umverteilung). (Schreiben Sie ca. 120 Wörter)"
  }
};

export default function GermanTutorPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "vocab" | "exercises" | "goethe">("chat");

  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hallo! I am your AI German Tutor from Language World Karachi Success Center. " +
            "How can I assist your German language learning journey today? " +
            "You can ask me about grammar rules, request vocabulary breakdowns, or click the **Exercises** tab to take personalized practice quizzes!"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Vocabulary States
  const [vocabInput, setVocabInput] = useState("");
  const [vocabResult, setVocabResult] = useState<string | null>(null);
  const [isVocabLoading, setIsVocabLoading] = useState(false);

  // Exercise States
  const [selectedTopic, setSelectedTopic] = useState("Present Tense Verb Conjugation (A1)");
  const [customTopic, setCustomTopic] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [generatedSheet, setGeneratedSheet] = useState<ExerciseSheet | null>(null);
  const [isExercisesLoading, setIsExercisesLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Goethe Trainer States
  const [goetheMode, setGoetheMode] = useState<"writing" | "speaking" | "mockexam">("writing");
  const [goetheLevel, setGoetheLevel] = useState<string>("A1");
  
  // Writing trainer states
  const [writingPromptIndex, setWritingPromptIndex] = useState<number>(0);
  const [studentDraftLetter, setStudentDraftLetter] = useState<string>("");
  const [isWritingLoading, setIsWritingLoading] = useState<boolean>(false);
  const [writingEvaluation, setWritingEvaluation] = useState<any | null>(null);

  // Speaking trainer states
  const [speakingCueCardIndex, setSpeakingCueCardIndex] = useState<number>(0);
  const [studentOralUtterance, setStudentOralUtterance] = useState<string>("");
  const [isSpeakingLoading, setIsSpeakingLoading] = useState<boolean>(false);
  const [speakingEvaluation, setSpeakingEvaluation] = useState<any | null>(null);

  // Goethe A1 Mock Exam States
  const [mockExamSection, setMockExamSection] = useState<"instructions" | "hoeren" | "lesen" | "schreiben" | "results" | "review">("instructions");
  const [mockSelectedAnswers, setMockSelectedAnswers] = useState<Record<string, string>>({});
  const [mockFormAnswers, setMockFormAnswers] = useState({
    surname: "",
    firstname: "",
    persons: "",
    date: "",
    duration: "",
    childSeats: "",
  });
  const [mockDraftLetter, setMockDraftLetter] = useState<string>("");
  const [isMockSubmitting, setIsMockSubmitting] = useState<boolean>(false);
  const [mockExamResult, setMockExamResult] = useState<any | null>(null);
  const [mockShowTranscripts, setMockShowTranscripts] = useState<Record<string, boolean>>({});
  const [mockAudioPlaying, setMockAudioPlaying] = useState<Record<string, boolean>>({});

  const currentMockExam = GOETHE_MOCK_EXAMS[goetheLevel] || GOETHE_MOCK_EXAMS.A1;
  const currentFormMetadata = MOCK_FORM_METADATA[goetheLevel] || MOCK_FORM_METADATA.A1;

  const presetTopics = [
    "Present Tense Verb Conjugation (A1)",
    "Definite and Indefinite Articles (A1)",
    "Accusative vs Dative Prepositions (A2)",
    "Subordinate Clauses with 'weil' and 'dass' (A2)",
    "Modal Verbs (können, müssen, wollen) in past/present (A1-B1)",
    "Two-way Prepositions (Wechselpräpositionen) (B1)",
    "Subjunctive II (Konjunktiv II) polite requests (B2)",
    "Relative Clauses (Relativsätze) (B1/B2)",
  ];

  // Auto scroll chat container only (preventing full-page viewport shifting)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [chatMessages, isChatLoading]);

  // Handle Tutor Chat Call
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsChatLoading(true);
    setErrorState(null);

    try {
      // Exclude greeting to conserve token space, keep last 6 messages
      const recentHistory = chatMessages.slice(-6);

      const response = await fetch("/api/german-tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: recentHistory
        })
      });

      let errorMessage = "Tutor was unable to respond. Please check your system settings.";
      if (!response.ok) {
        try {
          const errData = await response.json();
          errorMessage = errData.error || errData.message || errorMessage;
        } catch (_) {
          try {
            errorMessage = await response.text();
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data || typeof data.text !== "string") {
        throw new Error("Unexpected response format: The AI tutor core returned a payload without a valid 'text' field. Please retry.");
      }
      setChatMessages(prev => [...prev, { role: "assistant", text: data.text }]);
    } catch (err: any) {
      console.error("AI German Tutor Chat Error:", err);
      setErrorState(err.message || "Failed to reach AI Tutor.");
      
      let troubleshootingGuide = "⚠️ **Entschuldigung (Sorry), I had trouble reaching my AI Brain.**\n\n";
      if (err.message && (err.message.includes("GEMINI_API_KEY") || err.message.includes("api_key") || err.message.includes("key"))) {
        troubleshootingGuide += `**Reason:** The Gemini API key seems to be missing or invalid.\n\n` +
          `**How to Proceed:**\n` +
          `1. Go to the **Settings** menu at the top-right of the screen.\n` +
          `2. Navigate to **Secrets / Environment Variables**.\n` +
          `3. Save your API key with the name **\`GEMINI_API_KEY\`**.\n` +
          `4. Refresh the page and try sending your message again!`;
      } else if (err.message && (err.message.includes("429") || err.message.includes("QUOTA") || err.message.includes("limit") || err.message.includes("exhausted"))) {
        troubleshootingGuide += `**Reason:** We have hit some temporary Google API rate limits or quota boundaries.\n\n` +
          `**How to Proceed:**\n` +
          `1. Please wait **10-15 seconds** before trying again.\n` +
          `2. Try using the **Clear Chat** button to refresh the conversation length and reduce cognitive token load.\n` +
          `3. If issues persist, try reloading the browser tab.`;
      } else {
        troubleshootingGuide += `**Reason:** ${err.message || "Network interruption or unstable connection."}\n\n` +
          `**How to Proceed:**\n` +
          `1. Verify your network connection and retry your question.\n` +
          `2. If you are a developer, confirm that the server process is responsive and running on port 3000.\n` +
          `3. Click the **Clear Chat** button in the top-right of this chat box to launch a fresh prompt context.`;
      }
      
      setChatMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          text: troubleshootingGuide 
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Helper template prompt executor
  const runTemplatePrompt = (prompt: string) => {
    setChatInput(prompt);
    // Submit on next tick
    setTimeout(() => {
      handleTemplatePost(prompt);
    }, 50);
  };

  const handleTemplatePost = async (prompt: string) => {
    setChatMessages(prev => [...prev, { role: "user", text: prompt }]);
    setIsChatLoading(true);
    setErrorState(null);
    try {
      const recentHistory = chatMessages.slice(-6);
      const response = await fetch("/api/german-tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          history: recentHistory
        })
      });
      
      let errorMessage = "Server connection lost.";
      if (!response.ok) {
        try {
          const errData = await response.json();
          errorMessage = errData.error || errData.message || errorMessage;
        } catch (_) {
          try {
            errorMessage = await response.text();
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      if (!data || typeof data.text !== "string") {
        throw new Error("Unexpected response format from the tutor core: missing 'text' parameter.");
      }
      setChatMessages(prev => [...prev, { role: "assistant", text: data.text }]);
    } catch (err: any) {
      console.error("AI German Tutor Template Error:", err);
      setErrorState(err.message || "Failed to reach AI Tutor.");
      
      let troubleshootingGuide = "⚠️ **Entschuldigung (Sorry), I had trouble reaching my AI Brain.**\n\n";
      if (err.message && (err.message.includes("GEMINI_API_KEY") || err.message.includes("api_key") || err.message.includes("key"))) {
        troubleshootingGuide += `**Reason:** The Gemini API key seems to be missing or invalid.\n\n` +
          `**How to Proceed:**\n` +
          `1. Go to the **Settings** menu at the top-right of the screen.\n` +
          `2. Navigate to **Secrets / Environment Variables**.\n` +
          `3. Save your API key with the name **\`GEMINI_API_KEY\`**.\n` +
          `4. Refresh the page and try sending your message again!`;
      } else if (err.message && (err.message.includes("429") || err.message.includes("QUOTA") || err.message.includes("limit") || err.message.includes("exhausted"))) {
        troubleshootingGuide += `**Reason:** We have hit some temporary Google API rate limits or quota boundaries.\n\n` +
          `**How to Proceed:**\n` +
          `1. Please wait **10-15 seconds** before trying again.\n` +
          `2. Try using the **Clear Chat** button to refresh the conversation length and reduce cognitive token load.\n` +
          `3. If issues persist, try reloading the browser tab.`;
      } else {
        troubleshootingGuide += `**Reason:** ${err.message || "Network interruption or unstable connection."}\n\n` +
          `**How to Proceed:**\n` +
          `1. Verify your network connection and retry your question.\n` +
          `2. If you are a developer, confirm that the server process is responsive and running on port 3000.\n` +
          `3. Click the **Clear Chat** button in the top-right of this chat box to launch a fresh prompt context.`;
      }

      setChatMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          text: troubleshootingGuide
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle Vocabulary Context Trigger
  const handleExploreVocabulary = async (wordToExplore?: string) => {
    const targetWord = wordToExplore || vocabInput;
    if (!targetWord.trim() || isVocabLoading) return;

    setIsVocabLoading(true);
    setVocabResult(null);
    setErrorState(null);

    const promptMessage = 
      `Explain the German word/phrase: "${targetWord}" in context for a learner at levels A1-B2. ` +
      `Break down:\n` +
      `1. Exact word type (Verb, Noun, Adjective) and gender/plural if it's a noun.\n` +
      `2. Accurate English translations.\n` +
      `3. Important conjugations or preposition partnerships.\n` +
      `4. Provide 2 highly relevant real-world example sentences with English translations to understand the context clearly.`;

    try {
      const response = await fetch("/api/german-tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptMessage })
      });

      let errorMessage = "Could not process vocabulary exploration request.";
      if (!response.ok) {
        try {
          const errData = await response.json();
          errorMessage = errData.error || errData.message || errorMessage;
        } catch (_) {
          try {
            errorMessage = await response.text();
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data || typeof data.text !== "string") {
        throw new Error("Unexpected vocabulary response format from the tutor core: missing 'text' field.");
      }
      setVocabResult(data.text);
    } catch (err: any) {
      console.error("AI German Tutor Vocab Error:", err);
      setErrorState(err.message || "Something went wrong.");
    } finally {
      setIsVocabLoading(false);
    }
  };

  // Generate Practice exercises
  const generateExercises = async () => {
    const topicText = customTopic.trim() ? customTopic : selectedTopic;
    setIsExercisesLoading(true);
    setGeneratedSheet(null);
    setUserAnswers({});
    setCheckedAnswers(false);
    setErrorState(null);

    try {
      const response = await fetch("/api/german-tutor/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicText,
          level: selectedLevel
        })
      });

      let errorMessage = "Unable to build exercises. Please check your tutor config settings.";
      if (!response.ok) {
        try {
          const errData = await response.json();
          errorMessage = errData.error || errData.message || errorMessage;
        } catch (_) {
          try {
            errorMessage = await response.text();
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.questions)) {
        throw new Error("Unexpected exercises structure: The exercises core returned a payload without questions list.");
      }
      setGeneratedSheet(data);
    } catch (err: any) {
      console.error("AI German Tutor Exercises Error:", err);
      setErrorState(err.message || "Failed to generate exercises worksheet.");
    } finally {
      setIsExercisesLoading(false);
    }
  };

  // Submit Letter for Evaluation
  const handleEvaluateLetter = async () => {
    if (!studentDraftLetter.trim() || isWritingLoading) return;
    setIsWritingLoading(true);
    setWritingEvaluation(null);
    setErrorState(null);

    const prompts = goetheWritingPrompts[goetheLevel] || [];
    const activePrompt = prompts[writingPromptIndex] || { prompt: "Custom response prompt" };

    try {
      const response = await fetch("/api/german-tutor/evaluate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: goetheLevel,
          prompt: activePrompt.prompt,
          letter: studentDraftLetter
        })
      });

      let errorMessage = "Unable to grade writing draft. Please check connection.";
      if (!response.ok) {
        try {
          const errData = await response.json();
          errorMessage = errData.error || errData.message || errorMessage;
        } catch (_) {
          try {
            errorMessage = await response.text();
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setWritingEvaluation(data);
    } catch (err: any) {
      console.error("German Letter Evaluation Error:", err);
      setErrorState(err.message || "Something went wrong while grading the letter.");
    } finally {
      setIsWritingLoading(false);
    }
  };

  // Submit Speaking Utterance for Evaluation
  const handleEvaluateSpeaking = async () => {
    if (!studentOralUtterance.trim() || isSpeakingLoading) return;
    setIsSpeakingLoading(true);
    setSpeakingEvaluation(null);
    setErrorState(null);

    const cards = goetheSpeakingCueCards[goetheLevel] || [];
    const activeCard = cards[speakingCueCardIndex] || { topic: "General", cueWord: "General", task: "General formulation" };

    try {
      const response = await fetch("/api/german-tutor/evaluate-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: goetheLevel,
          cueTopic: activeCard.topic,
          cueWord: activeCard.cueWord,
          expectedPrompt: activeCard.task,
          userUtterance: studentOralUtterance
        })
      });

      let errorMessage = "Unable to evaluate speaking attempt.";
      if (!response.ok) {
        try {
          const errData = await response.json();
          errorMessage = errData.error || errData.message || errorMessage;
        } catch (_) {
          try {
            errorMessage = await response.text();
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSpeakingEvaluation(data);
    } catch (err: any) {
      console.error("German Speaking Evaluation Error:", err);
      setErrorState(err.message || "Failed to grade speaking response.");
    } finally {
      setIsSpeakingLoading(false);
    }
  };

  // Submit and grade the interactive Goethe Mock Exam (A1, A2, B1, B2)
  const handleEvaluateMockExam = async () => {
    if (!mockDraftLetter.trim() || isMockSubmitting) return;
    
    setIsMockSubmitting(true);
    setMockExamResult(null);
    setErrorState(null);

    const examData = GOETHE_MOCK_EXAMS[goetheLevel] || GOETHE_MOCK_EXAMS.A1;

    // 1. Calculate Listening (Hören) Points
    let listeningPoints = 0;
    examData.hoeren.forEach((q) => {
      if (mockSelectedAnswers[q.id] === q.correct) {
        listeningPoints += 1;
      }
    });

    // 2. Calculate Reading (Lesen) Points
    let readingPoints = 0;
    examData.lesen.forEach((q) => {
      if (mockSelectedAnswers[q.id] === q.correct) {
        readingPoints += 1;
      }
    });

    // 3. Calculate Form Filling Points (Schreiben Part 1)
    let isSurnameCorrect = false;
    let isFirstnameCorrect = false;
    let isPersonsCorrect = false;
    let isDateCorrect = false;
    let isDurationCorrect = false;
    let isChildSeatsCorrect = false;

    if (goetheLevel === "A1") {
      isSurnameCorrect = ["meier", "maier"].includes(mockFormAnswers.surname.trim().toLowerCase());
      isFirstnameCorrect = mockFormAnswers.firstname.trim().toLowerCase() === "eva";
      isPersonsCorrect = ["3", "drei"].includes(mockFormAnswers.persons.trim().toLowerCase());
      isDateCorrect = /15/i.test(mockFormAnswers.date) && /aug/i.test(mockFormAnswers.date);
      isDurationCorrect = /1 woche|7 tage|7/i.test(mockFormAnswers.duration);
      isChildSeatsCorrect = /ja/i.test(mockFormAnswers.childSeats);
    } else if (goetheLevel === "A2") {
      isSurnameCorrect = ["schmidt", "schmit"].includes(mockFormAnswers.surname.trim().toLowerCase());
      isFirstnameCorrect = mockFormAnswers.firstname.trim().toLowerCase() === "thomas";
      isPersonsCorrect = ["a2", "a-2"].some(v => mockFormAnswers.persons.trim().toLowerCase().includes(v));
      isDateCorrect = /sept/i.test(mockFormAnswers.date) || /01.09/i.test(mockFormAnswers.date);
      isDurationCorrect = /2 monate|zwei monate|2/i.test(mockFormAnswers.duration);
      isChildSeatsCorrect = /ja/i.test(mockFormAnswers.childSeats);
    } else if (goetheLevel === "B1") {
      isSurnameCorrect = ["müller", "muller", "mueller"].includes(mockFormAnswers.surname.trim().toLowerCase());
      isFirstnameCorrect = mockFormAnswers.firstname.trim().toLowerCase() === "sarah";
      isPersonsCorrect = /business|deutsch/i.test(mockFormAnswers.persons);
      isDateCorrect = /10/i.test(mockFormAnswers.date) && /okt/i.test(mockFormAnswers.date);
      isDurationCorrect = /3 tage|drei tage|3/i.test(mockFormAnswers.duration);
      isChildSeatsCorrect = /ja/i.test(mockFormAnswers.childSeats);
    } else { // B2
      isSurnameCorrect = ["fischer", "fisher"].includes(mockFormAnswers.surname.trim().toLowerCase());
      isFirstnameCorrect = mockFormAnswers.firstname.trim().toLowerCase() === "lukas";
      isPersonsCorrect = /informatik/i.test(mockFormAnswers.persons);
      isDateCorrect = /01/i.test(mockFormAnswers.date) && /okt/i.test(mockFormAnswers.date);
      isDurationCorrect = /1 semester|ein semester/i.test(mockFormAnswers.duration);
      isChildSeatsCorrect = /ja/i.test(mockFormAnswers.childSeats);
    }

    let formPoints = 0;
    if (isSurnameCorrect) formPoints += 1;
    if (isFirstnameCorrect) formPoints += 1;
    if (isPersonsCorrect) formPoints += 1;
    if (isDateCorrect) formPoints += 1;
    if (isDurationCorrect) formPoints += 1;
    if (isChildSeatsCorrect) formPoints += 1;

    // 4. Submit Schreiben Part 2 Letter to AI Evaluator
    const activeMockBriefPrompt = examData.letterPrompt;

    try {
      const response = await fetch("/api/german-tutor/evaluate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: goetheLevel,
          prompt: activeMockBriefPrompt,
          letter: mockDraftLetter
        })
      });

      let errorMessage = "Unable to evaluate mock brief writing. Please check your network and retry.";
      if (!response.ok) {
        try {
          const errData = await response.json();
          errorMessage = errData.error || errData.message || errorMessage;
        } catch (_) {
          try {
            errorMessage = await response.text();
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }

      const letterData = await response.json();

      // Combine individual Goethe scores
      // Listening: 5 questions total. Max 25 passing points
      const listeningScaled = listeningPoints * 5; 
      // Reading: 5 questions total. Max 25 passing points
      const readingScaled = readingPoints * 5;
      
      // Schreiben Part 1 (Formular) gives up to 10 scaled marks
      // Schreiben Part 2 (Brief) gives up to 15 scaled marks
      // For calculation, we use formPoints (out of 6) + AI graded Letter score (totalScore out of 25)
      // Letter score: totalScore is out of 25, let's scale it to 15 points
      const letterScaled = (letterData.totalScore / 25) * 15;
      const formScaled = (formPoints / 6) * 10;
      const totalSchreibenScaled = formScaled + letterScaled; // Max 25 points

      const examPercent = Math.round(listeningScaled + readingScaled + totalSchreibenScaled);

      setMockExamResult({
        listeningPoints,
        listeningScaled,
        readingPoints,
        readingScaled,
        formPoints,
        formScaled,
        letterScaled,
        totalSchreibenScaled,
        examPercent,
        formCheck: {
          surname: isSurnameCorrect,
          firstname: isFirstnameCorrect,
          persons: isPersonsCorrect,
          date: isDateCorrect,
          duration: isDurationCorrect,
          childSeats: isChildSeatsCorrect
        },
        letterEvaluation: letterData
      });

      setMockExamSection("results");
    } catch (err: any) {
      console.error("German Mock Exam Evaluation Error:", err);
      setErrorState(err.message || "Failed to submit exam. Please retry later.");
    } finally {
      setIsMockSubmitting(false);
    }
  };

  // Check how many questions were correct
  const getScoreInfo = () => {
    if (!generatedSheet) return { correct: 0, total: 0 };
    let correct = 0;
    generatedSheet.questions.forEach(q => {
      const uAns = (userAnswers[q.id] || "").trim().toLowerCase();
      const corAns = q.answer.trim().toLowerCase();
      if (uAns === corAns) correct++;
    });
    return { correct, total: generatedSheet.questions.length };
  };

  return (
    <div className="min-h-screen bg-soft-gray pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Course Header Banner */}
        <div className="bg-gradient-to-br from-accent to-accent-light text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-accent/20 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-primary/25 border border-primary/20 text-primary-light px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles size={12} className="text-primary" /> Success AI Integration
              </span>
              <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-none text-white">
                PAKISTAN'S FIRST GERMAN AI TUTOR
              </h1>
              <p className="text-white/80 font-medium text-sm md:text-base">
                Interactive smart helper by Language World Karachi. Get immediate grammar solutions, vocabulary deep-dives, and custom real-time worksheets.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 self-stretch md:self-center flex flex-col items-center justify-center text-center">
              <GraduationCap size={44} className="text-primary mb-1" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/90">A1 to B2 Levels</span>
              <span className="text-[9px] font-bold text-primary italic">CEFR Alignment</span>
            </div>
          </div>
        </div>

        {/* Dynamic Mode Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white p-2.5 rounded-3xl shadow-sm border border-gray-100 gap-1.5 mb-8">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTab === "chat" ? "bg-accent text-white shadow-lg shadow-accent/15" : "text-gray-500 hover:text-accent hover:bg-soft-gray"}`}
          >
            <Compass size={16} />
            Ask Grammar Chat
          </button>
          <button
            onClick={() => setActiveTab("vocab")}
            className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTab === "vocab" ? "bg-accent text-white shadow-lg shadow-accent/15" : "text-gray-500 hover:text-accent hover:bg-soft-gray"}`}
          >
            <BookOpen size={16} />
            Vocabulary Deep-Dive
          </button>
          <button
            onClick={() => setActiveTab("exercises")}
            className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTab === "exercises" ? "bg-accent text-white shadow-lg shadow-accent/15" : "text-gray-500 hover:text-accent hover:bg-soft-gray"}`}
          >
            <GraduationCap size={16} />
            Practice Exercises
          </button>
          <button
            onClick={() => {
              setActiveTab("goethe");
              setErrorState(null);
            }}
            className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTab === "goethe" ? "bg-accent text-white shadow-lg shadow-accent/15" : "text-gray-500 hover:text-accent hover:bg-soft-gray"}`}
          >
            <Award size={16} />
            Goethe / ÖSD Prep
          </button>
        </div>

        {errorState && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold leading-relaxed">
            <AlertCircle className="text-red-500 shrink-0" size={18} />
            <div>
              <p className="font-extrabold uppercase tracking-wide text-red-700">Service Configuration Note</p>
              <p className="text-red-500/90">{errorState}</p>
            </div>
          </div>
        )}

        {/* Tab Contents */}
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: GERMAN TUTOR CHAT */}
            {activeTab === "chat" && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Left Side Helper Prompts Column */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-black text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles className="text-primary" size={14} /> Recommended Quick Queries
                    </h3>
                    <p className="text-xs text-gray-400 font-bold mb-4 leading-relaxed">Click any common question to instantly ask Pakistan's first German AI tutor:</p>
                    <div className="flex flex-col gap-2.5">
                      <button
                        onClick={() => runTemplatePrompt("Explain the difference between 'kennen' and 'wissen' with examples.")}
                        className="text-left bg-soft-gray px-4 py-3 rounded-xl hover:bg-accent-light/10 text-xs font-bold text-accent transition border border-transparent hover:border-accent-light/20"
                      >
                        🇩🇪 Kennen vs. Wissen
                      </button>
                      <button
                        onClick={() => runTemplatePrompt("How do I use 'denn' and 'weil' to say 'because' in German?")}
                        className="text-left bg-soft-gray px-4 py-3 rounded-xl hover:bg-accent-light/10 text-xs font-bold text-accent transition border border-transparent hover:border-accent-light/20"
                      >
                        🇩🇪 Weil vs. Denn (Because)
                      </button>
                      <button
                        onClick={() => runTemplatePrompt("Correct my spelling and grammar: 'Ich habe gestern ein Hund gekauft und er ist sehr schön'. Explain any errors.")}
                        className="text-left bg-soft-gray px-4 py-3 rounded-xl hover:bg-accent-light/10 text-xs font-bold text-accent transition border border-transparent hover:border-accent-light/20"
                      >
                        📝 Practice: Correct my sentence
                      </button>
                      <button
                        onClick={() => runTemplatePrompt("Explain Wechselpräpositionen (accusative/dative two-way prepositions) based on motion and location.")}
                        className="text-left bg-soft-gray px-4 py-3 rounded-xl hover:bg-accent-light/10 text-xs font-bold text-accent transition border border-transparent hover:border-accent-light/20"
                      >
                        🔄 Wechselpräpositionen
                      </button>
                      <button
                        onClick={() => runTemplatePrompt("Give me a list of basic vocabulary we need to speak German in a supermarket.")}
                        className="text-left bg-soft-gray px-4 py-3 rounded-xl hover:bg-accent-light/10 text-xs font-bold text-accent transition border border-transparent hover:border-accent-light/20"
                      >
                        🛒 Supermarket Vocab A1
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-[2rem] border border-primary/10 text-center">
                    <CheckCircle2 className="text-primary mx-auto mb-2" size={28} />
                    <h4 className="text-[10px] font-black text-accent uppercase tracking-widest mb-1.5">Learning Progress Track</h4>
                    <p className="text-[10px] text-gray-500 font-bold italic">
                      Every prompt is powered by the newest Gemini cognitive engine to explain CEFR levels A1, A2, B1 & B2 requirements flawlessly.
                    </p>
                  </div>
                </div>

                {/* Right Side Chat Box Column */}
                <div className="lg:col-span-2 flex flex-col h-[520px] bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gray-50/70 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-display font-black text-sm">🇩🇪</div>
                      <div>
                        <h3 className="text-sm font-black text-accent uppercase tracking-wide">Language World Tutor</h3>
                        <span className="text-[10px] text-emerald-500 font-black flex items-center gap-1">🟢 AI Tutor Active</span>
                      </div>
                    </div>
                    {chatMessages.length > 2 && (
                      <button 
                        onClick={() => setChatMessages([{
                          role: "assistant",
                          text: "Conversation restarted. What would you like to learn next?"
                        }])}
                        className="text-[10px] font-black uppercase text-gray-400 hover:text-accent tracking-widest flex items-center gap-1 border border-gray-100 px-3 py-1.5 rounded-lg bg-white"
                      >
                        <RefreshCw size={10} /> Clear Chat
                      </button>
                    )}
                  </div>

                  {/* Message stream */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 font-sans bg-soft-gray/30">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-3.5 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                        {msg.role === "assistant" ? (
                          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shrink-0 text-xs font-black">AI</div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 text-xs font-black"><User size={12} /></div>
                        )}
                        <div className={`p-4 rounded-2xl text-xs sm:text-sm shadow-xs ${
                          msg.role === "user" 
                            ? "bg-accent text-white" 
                            : msg.text.startsWith("⚠️")
                            ? "bg-red-50/90 text-red-800 border border-red-200/60 shadow-xs"
                            : "bg-white text-gray-700 border border-gray-100"
                        }`}>
                          <div className="font-medium text-left">
                            {msg.role === "user" ? (
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            ) : (
                              <Markdown
                                components={{
                                  h1: ({node, ...props}) => <h1 className="text-sm font-black text-accent mt-3 mb-1 uppercase tracking-wide border-b pb-0.5 border-gray-100" {...props} />,
                                  h2: ({node, ...props}) => <h2 className="text-xs font-black text-accent mt-2 mb-1 uppercase tracking-wider" {...props} />,
                                  p: ({node, ...props}) => <p className="mb-1.5 leading-relaxed text-gray-700" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2.5 space-y-0.5" {...props} />,
                                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2.5 space-y-0.5" {...props} />,
                                  li: ({node, ...props}) => <li className="text-gray-600 font-bold" {...props} />,
                                  code: ({node, ...props}) => <code className="bg-slate-100 text-[#ea580c] px-1 py-0.5 rounded font-mono text-[11px] font-black" {...props} />,
                                  pre: ({node, ...props}) => <pre className="bg-slate-50 border border-slate-100 p-2 text-[11px] rounded-xl overflow-x-auto font-mono my-1" {...props} />,
                                  table: ({node, ...props}) => <table className="w-full border-collapse my-2 text-[11px]" {...props} />,
                                  th: ({node, ...props}) => <th className="bg-slate-100 border border-slate-200 px-2 py-1 font-black text-accent text-left" {...props} />,
                                  td: ({node, ...props}) => <td className="border border-slate-200 px-2 py-1 text-gray-700" {...props} />
                                }}
                              >
                                {msg.text}
                              </Markdown>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isChatLoading && (
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shrink-0 text-xs font-black">AI</div>
                        <div className="bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                            <span className="text-xs text-accent font-black ml-1">Tutor is writing...</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-semibold leading-relaxed max-w-sm">
                            Structuring professional German grammar card response. (If Google AI experiences peak traffic, custom safety retries execute automatically behind the scenes).
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendChatMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me a German grammar rule or paste sentence (e.g., Explain Akkusativ)..."
                      className="flex-1 bg-soft-gray px-6 py-4.5 rounded-2xl border-none focus:ring-2 focus:ring-accent/15 text-xs font-bold font-sans text-accent placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer ${chatInput.trim() ? "bg-accent hover:bg-black" : "bg-gray-200 cursor-not-allowed text-gray-400"}`}
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* TAB 2: VOCABULARY DEEP DIVE */}
            {activeTab === "vocab" && (
              <motion.div
                key="vocab-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-4xl mx-auto space-y-8"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <BookOpen size={28} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-accent uppercase tracking-tight">Contextual dictionary</h2>
                      <p className="text-xs text-gray-500 font-medium">Type any German word (noun, action verb, etc.) to view genders, translations, examples, and correct usage levels.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={vocabInput}
                    onChange={(e) => setVocabInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleExploreVocabulary();
                    }}
                    placeholder="e.g. Heißt, Verabredung, Mitnehmen, Entschuldigung..."
                    className="flex-1 px-6 py-4.5 bg-soft-gray border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-black text-accent uppercase text-xs tracking-wider"
                  />
                  <button
                    onClick={() => handleExploreVocabulary()}
                    disabled={isVocabLoading || !vocabInput.trim()}
                    className="bg-accent hover:bg-black disabled:bg-gray-200 text-white font-sans font-black uppercase text-xs tracking-widest px-8 py-4.5 rounded-2xl transition-all"
                  >
                    Analyze Context
                  </button>
                </div>

                {/* Popular Quick Vocabulary tags */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Popular vocabulary topics to explore:</span>
                  <div className="flex flex-wrap gap-2">
                    {["Verabredung", "Einladen", "Sich freuen auf", "Zufrieden", "Die Gelegenheit", "Überhaupt"].map((word) => (
                      <button
                        key={word}
                        onClick={() => {
                          setVocabInput(word);
                          handleExploreVocabulary(word);
                        }}
                        className="bg-soft-gray px-4 py-2 rounded-xl text-xs font-bold text-accent hover:bg-primary-dark hover:text-white transition"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explorer Response Output */}
                <div className="bg-soft-gray/30 rounded-[2rem] border border-gray-100 p-6 min-h-[140px] relative">
                  {isVocabLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <RefreshCw className="animate-spin text-accent mb-2" size={28} />
                      <span className="text-xs font-black uppercase text-accent tracking-widest">Translating & Building Context...</span>
                    </div>
                  ) : vocabResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100">
                        <GraduationCap size={16} className="text-primary font-bold" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">AI Grammar breakdown</span>
                      </div>
                      <div className="text-left font-sans text-xs sm:text-sm">
                        <Markdown
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-sm font-black text-accent mt-3 mb-1 uppercase tracking-wide border-b pb-0.5 border-gray-100" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xs font-black text-accent mt-2 mb-1 uppercase tracking-wider" {...props} />,
                            p: ({node, ...props}) => <p className="mb-1.5 leading-relaxed text-gray-700" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2.5 space-y-0.5" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2.5 space-y-0.5" {...props} />,
                            li: ({node, ...props}) => <li className="text-gray-600 font-bold" {...props} />,
                            code: ({node, ...props}) => <code className="bg-slate-100 text-[#ea580c] px-1 py-0.5 rounded font-mono text-[11px] font-black" {...props} />,
                            pre: ({node, ...props}) => <pre className="bg-slate-50 border border-slate-100 p-2 text-[11px] rounded-xl overflow-x-auto font-mono my-1" {...props} />,
                            table: ({node, ...props}) => <table className="w-full border-collapse my-2 text-[11px]" {...props} />,
                            th: ({node, ...props}) => <th className="bg-slate-100 border border-slate-200 px-2 py-1 font-black text-accent text-left" {...props} />,
                            td: ({node, ...props}) => <td className="border border-slate-200 px-2 py-1 text-gray-700" {...props} />
                          }}
                        >
                          {vocabResult}
                        </Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 flex flex-col items-center justify-center text-center text-gray-400">
                      <Compass size={28} className="text-gray-300 mb-1.5" />
                      <p className="text-xs font-bold leading-relaxed">No word searched yet.<br />Submit a German keyword to generate instantaneous learning analysis.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 3: PERSONALIZED PRACTICE EXERCISES */}
            {activeTab === "exercises" && (
              <motion.div
                key="exercises-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                
                {/* Generation control panel */}
                <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6 self-start">
                  <div>
                    <h3 className="text-xs font-black text-accent uppercase tracking-widest mb-1.5">1. Select Target Level</h3>
                    <p className="text-[10px] text-gray-400 font-medium mb-3">Align worksheets according to the official CEFR framework levels.</p>
                    <div className="grid grid-cols-4 gap-2">
                      {["A1", "A2", "B1", "B2"].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSelectedLevel(lvl)}
                          className={`py-2 rounded-xl text-center font-display font-black text-xs transition duration-200 ${selectedLevel === lvl ? "bg-accent text-white" : "bg-soft-gray text-gray-600 hover:bg-gray-100"}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-accent uppercase tracking-widest mb-1.5">2. Choose Grammar Topic</h3>
                    <p className="text-[10px] text-gray-400 font-medium mb-3">Select from preset syllabus, or write your own custom concept details below.</p>
                    
                    <select
                      value={selectedTopic}
                      onChange={(e) => {
                        setSelectedTopic(e.target.value);
                        setCustomTopic(""); // Reset custom
                      }}
                      className="w-full bg-soft-gray border-none px-4 py-3 text-xs font-bold text-accent rounded-xl focus:ring-1 focus:ring-accent-light/30"
                    >
                      {presetTopics.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Or write Custom Topic</label>
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="e.g. Accusative possessive pronouns"
                      className="w-full px-4 py-3 bg-soft-gray border-none rounded-xl text-xs font-bold text-accent placeholder-gray-400"
                    />
                  </div>

                  <button
                    onClick={generateExercises}
                    disabled={isExercisesLoading}
                    className="w-full bg-[#7BC043] hover:bg-[#6a3fb1] hover:bg-gradient-to-r hover:from-primary hover:to-accent text-white py-4.5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-300 shadow-lg shadow-primary/20 hover:shadow-accent/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isExercisesLoading ? (
                      <>
                        <RefreshCw className="animate-spin" size={14} /> Building...
                      </>
                    ) : (
                      <>
                        Generate Worksheet <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>

                {/* Active Interactive exercise worksheet view */}
                <div className="lg:col-span-2 space-y-6">
                  {isExercisesLoading && (
                    <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[350px]">
                      <RefreshCw className="animate-spin text-accent mb-4" size={44} />
                      <h4 className="text-base font-black text-accent uppercase tracking-wider mb-1">Formulating Custom Questions</h4>
                      <p className="text-xs text-gray-400 font-bold max-w-sm">Generating a custom syllabus test sheet dynamically using the Gemini tutor core. Please hold on!</p>
                      <p className="text-[10px] text-gray-400 font-semibold max-w-xs mt-2.5 leading-relaxed bg-[#f8fafc]/50 p-3 rounded-2xl border border-dotted border-gray-200">
                        *Note: To build curriculum-grade exercises, we query Gemini. If servers are busy, automated retry loops protect this load. This might take 4–8 seconds.*
                      </p>
                    </div>
                  )}

                  {!isExercisesLoading && !generatedSheet && (
                    <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[350px]">
                      <GraduationCap className="text-gray-300 mb-4" size={54} />
                      <h4 className="text-sm font-black text-accent uppercase tracking-widest mb-1.5">Worksheet is Empty</h4>
                      <p className="text-xs text-gray-400 font-bold max-w-sm">Select your targeting level and concept, then click **Generate Worksheet** in the controller to build custom quiz questions!</p>
                    </div>
                  )}

                  {!isExercisesLoading && generatedSheet && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                      
                      {/* Sheet Header info */}
                      <div className="pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2.5 mb-1 bg-[#FFFBEB] border border-amber-100 text-amber-800 self-start px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider w-fit">
                          <Sparkles size={11} className="text-amber-500" /> Topic Alignment Sheet
                        </div>
                        <h3 className="font-display font-extrabold text-[#4B3FBF] text-lg uppercase tracking-wider">
                          {generatedSheet.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium italic mt-1 leading-relaxed">
                          {generatedSheet.instructions}
                        </p>
                      </div>

                      {/* Lesson Questions Loop */}
                      <div className="space-y-6">
                        {generatedSheet.questions.map((q, qIndex) => {
                          const isCorrect = checkedAnswers && (userAnswers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase();
                          return (
                            <div key={q.id} className="p-5 border border-gray-100 bg-soft-gray/30 rounded-2xl relative space-y-4">
                              <span className="absolute top-4 right-4 bg-accent/5 px-2.5 py-1 rounded text-[9px] font-black uppercase text-accent/80">Question {qIndex + 1}</span>
                              
                              <p className="text-xs sm:text-sm font-black text-accent flex items-center gap-2 pr-12 text-left">
                                <QuestionIcon size={14} className="text-primary" /> {q.question}
                              </p>

                              {/* MCQ Options Rendering */}
                              {q.type === "multiple-choice" && q.options ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {q.options.map((opt) => {
                                    const isSelected = userAnswers[q.id] === opt;
                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        disabled={checkedAnswers}
                                        onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                        className={`px-5 py-3 rounded-xl text-left text-xs font-semibold transition flex items-center justify-between ${isSelected ? "bg-accent text-white shadow-md shadow-accent/15" : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-100"}`}
                                      >
                                        <span>{opt}</span>
                                        {isSelected && <Check size={12} className="text-white shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                /* Fill blank rendering */
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Type your answer word:</label>
                                  <input
                                    type="text"
                                    disabled={checkedAnswers}
                                    value={userAnswers[q.id] || ""}
                                    onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    className="w-full sm:max-w-xs px-5 py-3.5 bg-white border border-gray-200 focus:border-accent rounded-xl text-xs font-bold text-accent"
                                    placeholder="Enter word..."
                                  />
                                </div>
                              )}

                              {/* AI Explanation feedback visible after check */}
                              {checkedAnswers && (
                                <div className={`p-4 rounded-xl text-xs flex gap-3 leading-relaxed border ${isCorrect ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-red-50 text-red-800 border-red-100"}`}>
                                  <div className="shrink-0 mt-0.5">
                                    {isCorrect ? <CheckCircle2 size={16} className="text-emerald-500" /> : <X size={16} className="text-red-500" />}
                                  </div>
                                  <div>
                                    <p className="font-extrabold uppercase tracking-widest text-[10px]">
                                      {isCorrect ? "Correct answer!" : `Incorrect! Correct answer is: "${q.answer}"`}
                                    </p>
                                    <p className="text-[11px] font-medium text-black/70 mt-1">{q.explanation}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Sheet bottom actions */}
                      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {!checkedAnswers ? (
                          <>
                            <p className="text-[11px] text-gray-400 font-bold italic leading-relaxed">Fill out all questions to check your score.</p>
                            <button
                              type="button"
                              onClick={() => setCheckedAnswers(true)}
                              className="px-8 py-3.5 bg-accent hover:bg-black text-white font-sans font-black uppercase text-xs tracking-widest rounded-xl transition cursor-pointer self-stretch sm:self-auto text-center"
                            >
                              Check Answers
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-3.5">
                              <span className="font-display font-black text-lg text-accent uppercase tracking-tight">Your Score:</span>
                              <div className="px-5 py-2.5 bg-primary/20 text-[#6a3fb1] font-display font-black text-[#5ba11c] rounded-2xl text-sm border border-primary/10">
                                {getScoreInfo().correct} / {getScoreInfo().total}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={generateExercises}
                              className="px-6 py-3.5 bg-soft-gray hover:bg-gray-100 text-gray-600 font-sans font-black uppercase text-[10px] tracking-widest rounded-xl transition flex items-center justify-center gap-1.5"
                            >
                              <RefreshCw size={12} /> Retry / Build New
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  )}

                </div>

              </motion.div>
            )}

            {/* TAB 4: GOETHE-ZERTIFIKAT EXAM SIMULATOR */}
            {activeTab === "goethe" && (
              <motion.div
                key="goethe-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Controller Sidebar Column */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Mode & Level selection card */}
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5 text-left">
                    <div className="flex items-center gap-2">
                      <Award className="text-primary shrink-0 animate-pulse" size={20} />
                      <h3 className="font-display font-black text-accent text-sm uppercase tracking-wider">Exam Prep Hub</h3>
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                      Practice official Goethe-Zertifikat & Start Deutsch preparation material.
                    </p>
                    {/* Mode Toggles */}
                    <div className="space-y-1.5 font-sans">
                      <label className="block text-[10px] font-black uppercase text-[#6a3fb1] tracking-wider">Select Practice / Testing Mode</label>
                      <div className="grid grid-cols-3 gap-1.5 bg-[#f8fafc] p-1 rounded-2xl">
                        <button
                          type="button"
                          onClick={() => {
                            setGoetheMode("writing");
                            setWritingEvaluation(null);
                            setErrorState(null);
                          }}
                          className={`py-2 px-1 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition ${goetheMode === "writing" ? "bg-accent text-white shadow" : "text-gray-500 hover:text-accent hover:bg-gray-100"}`}
                        >
                          <FileText size={10} className="inline mr-0.5" /> Letter
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGoetheMode("speaking");
                            setSpeakingEvaluation(null);
                            setErrorState(null);
                          }}
                          className={`py-2 px-1 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition ${goetheMode === "speaking" ? "bg-accent text-white shadow" : "text-gray-500 hover:text-accent hover:bg-gray-100"}`}
                        >
                          <Volume2 size={10} className="inline mr-0.5" /> Speak
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGoetheMode("mockexam");
                            setErrorState(null);
                          }}
                          className={`py-2 px-1 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition ${goetheMode === "mockexam" ? "bg-accent text-white shadow font-black" : "text-gray-500 hover:text-accent hover:bg-gray-100"}`}
                        >
                          <Award size={10} className="inline mr-0.5" /> A1 Exam
                        </button>
                      </div>
                    </div>

                    {/* CEFR Level Selection */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-[#6a3fb1] tracking-wider">Select Target CEFR Level</label>
                      {goetheMode === "mockexam" ? (
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-left">
                          <span className="text-[10px] font-black text-blue-800 uppercase block">Start Deutsch 1</span>
                          <p className="text-[9.5px] font-semibold text-gray-500 leading-normal mt-0.5">
                            Exam simulation layout is hardcoded to the official Goethe A1 Modellsatz structure.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-1.5">
                          {["A1", "A2", "B1", "B2"].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => {
                                setGoetheLevel(level);
                                setWritingPromptIndex(0);
                                setSpeakingCueCardIndex(0);
                                setWritingEvaluation(null);
                                setSpeakingEvaluation(null);
                                setErrorState(null);
                              }}
                              className={`py-2 rounded-xl text-xs font-black transition ${goetheLevel === level ? "bg-primary text-slate-900 shadow-md shadow-primary/20" : "bg-soft-gray hover:bg-gray-200 text-gray-700"}`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Presets / Exam Progress Section */}
                  {goetheMode !== "mockexam" ? (
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-left animate-fade-in">
                      <h4 className="font-display font-extrabold text-[#4B3FBF] text-xs uppercase tracking-wider mb-3">
                        {goetheMode === "writing" ? "Goethe Writing Prompts" : "Sprechen Cue Cards"}
                      </h4>
                      
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {goetheMode === "writing" ? (
                          (goetheWritingPrompts[goetheLevel] || []).map((prompt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setWritingPromptIndex(idx);
                                setWritingEvaluation(null);
                                setStudentDraftLetter("");
                                setErrorState(null);
                              }}
                              className={`w-full p-3.5 rounded-2xl text-left transition select-none flex flex-col gap-1 border ${writingPromptIndex === idx ? "bg-[#ebe8ff]/40 border-primary text-slate-800 text-left" : "bg-[#f8fafc]/50 border-gray-100 hover:bg-gray-100 text-left"}`}
                            >
                              <span className="text-[11px] font-black leading-snug text-accent text-left">{prompt.title}</span>
                              <span className="text-[9px] text-gray-400 font-bold line-clamp-1 text-left">{prompt.prompt}</span>
                            </button>
                          ))
                        ) : (
                          (goetheSpeakingCueCards[goetheLevel] || []).map((card, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSpeakingCueCardIndex(idx);
                                setSpeakingEvaluation(null);
                                setStudentOralUtterance("");
                                setErrorState(null);
                              }}
                              className={`w-full p-3.5 rounded-2xl text-left transition select-none flex flex-col gap-1 border ${speakingCueCardIndex === idx ? "bg-[#ebe8ff]/40 border-primary text-slate-800 text-left" : "bg-[#f8fafc]/50 border-gray-100 hover:bg-gray-100 text-left"}`}
                            >
                              <span className="text-[11px] font-black leading-snug text-accent text-left">{card.topic} — {card.cueWord}</span>
                              <span className="text-[9px] text-gray-400 font-bold line-clamp-1 text-left">{card.task}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-left animate-fade-in space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-[#4B3FBF] text-xs uppercase tracking-wider">
                          A1 Mock Progression
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold leading-normal">
                          Move between simulated sections of the Goethe Start Deutsch Exam:
                        </p>
                      </div>

                      <div className="space-y-1.5 font-sans">
                        {[
                          { id: "instructions", label: "📋 Official Guide & Info" },
                          { id: "hoeren", label: "🎧 Hören (Listening)" },
                          { id: "lesen", label: "📖 Lesen (Reading)" },
                          { id: "schreiben", label: "✍️ Schreiben (Form & Brief)" },
                          { id: "results", label: "🎖️ Zeugnis (Cert Scores)" },
                        ].map((sec) => {
                          const isCompleted = sec.id === "results" ? !!mockExamResult : (
                            sec.id === "hoeren" ? Object.keys(mockSelectedAnswers).filter(k=>k.startsWith("h")).length >= 3 : (
                              sec.id === "lesen" ? Object.keys(mockSelectedAnswers).filter(k=>k.startsWith("l")).length >= 3 : (
                                sec.id === "schreiben" ? (!!mockDraftLetter.trim() && !!mockFormAnswers.surname) : true
                              )
                            )
                          );
                          const isActive = mockExamSection === sec.id;

                          return (
                            <button
                              key={sec.id}
                              type="button"
                              onClick={() => {
                                if (sec.id === "results" && !mockExamResult) return;
                                setMockExamSection(sec.id as any);
                              }}
                              className={`w-full p-3.5 rounded-2xl text-left transition select-none flex items-center justify-between border ${isActive ? "bg-accent text-white border-accent font-black shadow-md shadow-accent/15" : "bg-[#f8fafc]/50 border-gray-100 hover:bg-gray-100 font-semibold text-gray-600"} ${sec.id === "results" && !mockExamResult ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              <span className="text-[10.5px] uppercase tracking-wider">{sec.label}</span>
                              {isCompleted && <CheckCircle2 size={12} className={isActive ? "text-white" : "text-emerald-500"} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Content Workspace Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* 1. Writing Workspace Mode */}
                  {goetheMode === "writing" && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left">
                      {/* Active prompt detailed card */}
                      <div className="bg-[#f8fafc]/60 p-5 rounded-2xl border border-gray-100">
                        <span className="bg-[#eff6ff] text-blue-800 border border-blue-100 rounded-md px-2.5 py-1 text-[9px] font-black uppercase tracking-wider block w-fit mb-2">
                          Goethe-Zertifikat {goetheLevel} Schreiben Task
                        </span>
                        <h4 className="font-display font-black text-accent text-sm leading-snug text-left">
                          {(goetheWritingPrompts[goetheLevel]?.[writingPromptIndex]?.title) || "Custom Writing Task"}
                        </h4>
                        <p className="text-xs text-gray-700 font-medium leading-relaxed mt-2 p-3 bg-white rounded-xl border border-gray-150 text-left">
                          {(goetheWritingPrompts[goetheLevel]?.[writingPromptIndex]?.prompt) || "Enter custom text below."}
                        </p>
                      </div>

                      {/* Text Entry Field */}
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Type your German letter / email draft:</label>
                        <textarea
                          rows={6}
                          value={studentDraftLetter}
                          onChange={(e) => setStudentDraftLetter(e.target.value)}
                          placeholder="Sehr geehrte Frau Müller, ich schreibe Ihnen, weil... "
                          className="w-full p-5 bg-white border border-gray-200 focus:border-accent rounded-2xl text-xs font-bold text-accent leading-relaxed focus:outline-none"
                        />
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                          <span>Recommended Length: {goetheLevel === "A1" ? "~30" : goetheLevel === "A2" ? "~40" : "~80"} words</span>
                          <span>Word Count: {studentDraftLetter.trim() ? studentDraftLetter.trim().split(/\s+/).length : 0} words</span>
                        </div>
                      </div>

                      {/* Submit action */}
                      {!writingEvaluation && (
                        <button
                          type="button"
                          disabled={isWritingLoading || !studentDraftLetter.trim()}
                          onClick={handleEvaluateLetter}
                          className="w-full py-4 bg-accent hover:bg-black text-white font-sans font-black uppercase text-xs tracking-widest rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isWritingLoading ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" /> Analyzing under Goethe-Zertifikat Rubrics...
                            </>
                          ) : (
                            <>
                              <PenTool size={12} /> Evaluate & Grade Letter
                            </>
                          )}
                        </button>
                      )}

                      {/* Evaluation result */}
                      {writingEvaluation && !isWritingLoading && (
                        <div className="space-y-6 pt-6 border-t border-gray-100">
                          {/* Score dashboard header */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                            <div className="space-y-1 text-left">
                              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">Language World Certificate Grader</span>
                              <h4 className="font-display font-black text-slate-900 text-base">Letter Graded Successfully</h4>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-[10px] text-[#42643a] uppercase font-black tracking-widest">Score:</span>
                              <div className="px-5 py-2.5 bg-emerald-500 text-white font-display font-black rounded-xl text-lg shadow-sm">
                                {writingEvaluation.totalScore} <span className="text-xs font-medium opacity-80">/ 25</span>
                              </div>
                            </div>
                          </div>

                          {/* Criteria Score Breakdown Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 bg-white border border-gray-150 rounded-xl text-center space-y-1">
                              <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Fulfillment</span>
                              <p className="text-sm font-black text-accent">{writingEvaluation.scores?.content || 0} <span className="text-[10px] text-gray-400 font-normal">/10</span></p>
                            </div>
                            <div className="p-3 bg-white border border-gray-150 rounded-xl text-center space-y-1">
                              <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Formalities</span>
                              <p className="text-sm font-black text-accent">{writingEvaluation.scores?.formality || 0} <span className="text-[10px] text-gray-400 font-normal">/5</span></p>
                            </div>
                            <div className="p-3 bg-white border border-gray-150 rounded-xl text-center space-y-1">
                              <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Grammar</span>
                              <p className="text-sm font-black text-accent">{writingEvaluation.scores?.grammar || 0} <span className="text-[10px] text-gray-400 font-normal">/5</span></p>
                            </div>
                            <div className="p-3 bg-white border border-gray-150 rounded-xl text-center space-y-1">
                              <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Vocabulary</span>
                              <p className="text-sm font-black text-accent">{writingEvaluation.scores?.vocabulary || 0} <span className="text-[10px] text-gray-400 font-normal">/5</span></p>
                            </div>
                          </div>

                          {/* Feedback text */}
                          <div className="space-y-1.5 text-left">
                            <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Examiner Evaluation Insight</span>
                            <div className="p-4 bg-gray-50 rounded-xl text-xs font-semibold leading-relaxed text-gray-700">
                              {writingEvaluation.overallFeedback}
                            </div>
                          </div>

                          {/* Grammatical Mistakes Breakdown */}
                          {writingEvaluation.corrections && writingEvaluation.corrections.length > 0 && (
                            <div className="space-y-3 text-left">
                              <span className="block text-[10px] font-black uppercase text-[#6a3fb1] tracking-wider">Detected Errors & Corrections (Korrekturen)</span>
                              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                {writingEvaluation.corrections.map((corr: any, cIdx: number) => (
                                  <div key={cIdx} className="p-3 bg-red-50/40 border border-red-100 rounded-xl space-y-1.5 text-xs">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-[10px] font-black uppercase text-red-500 bg-red-100/30 px-2 py-0.5 rounded">Mistake</span>
                                      <span className="line-through text-gray-400 font-mono">"{corr.original}"</span>
                                      <ArrowRight size={10} className="text-gray-400" />
                                      <span className="text-emerald-700 font-extrabold bg-emerald-100/30 px-2 py-0.5 rounded font-mono">"{corr.corrected}"</span>
                                    </div>
                                    <p className="text-[11px] font-medium text-gray-600 pl-1">{corr.explanation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Improved Native Version */}
                          <div className="space-y-2 text-left">
                            <span className="block text-[10px] font-black uppercase text-emerald-800 tracking-wider">The Perfect Standard Letter (Musterlösung 100% Score)</span>
                            <div className="p-5 bg-emerald-50/20 border border-emerald-100 rounded-2xl relative">
                              <pre className="text-xs font-serif font-black whitespace-pre-wrap text-[#2d4d2d] leading-relaxed">
                                {writingEvaluation.improvedLetter}
                              </pre>
                            </div>
                          </div>

                          {/* Action to reset */}
                          <button
                            type="button"
                            onClick={() => {
                              setWritingEvaluation(null);
                              setStudentDraftLetter("");
                            }}
                            className="px-5 py-3.5 bg-soft-gray hover:bg-gray-150 text-gray-600 font-sans font-black uppercase text-[10px] tracking-widest rounded-xl transition"
                          >
                            Write New Draft
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Speaking Workspace Mode */}
                  {goetheMode === "speaking" && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left">
                      {/* Active cue card explanation */}
                      <div className="bg-[#f0fdfa]/60 p-5 rounded-2xl border border-teal-100 text-left">
                        <span className="bg-teal-50 text-teal-800 border border-teal-100 rounded-md px-2.5 py-1 text-[9px] font-black uppercase tracking-wider block w-fit mb-2">
                          Goethe-Zertifikat {goetheLevel} Sprechen Cue Card
                        </span>
                        
                        <div className="flex items-center gap-4 text-left">
                          <div className="p-3 bg-teal-500 text-white rounded-2xl shadow-sm">
                            <Volume2 size={24} />
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Active Thema/Card:</span>
                            <h4 className="font-display font-black text-accent text-base text-left">
                              {(goetheSpeakingCueCards[goetheLevel]?.[speakingCueCardIndex]?.topic) || "General Topic"}
                            </h4>
                          </div>
                        </div>

                        {/* Cue Card Frame */}
                        <div className="mt-4 border border-teal-100 bg-white p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden shadow-sm">
                          <span className="absolute top-2.5 right-2.5 bg-teal-500/10 text-teal-800 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                            Cue Card Word
                          </span>
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Use this word:</span>
                          <span className="text-xl sm:text-2xl font-display font-black text-teal-600 tracking-tight font-mono">
                            {(goetheSpeakingCueCards[goetheLevel]?.[speakingCueCardIndex]?.cueWord) || "Urlaub"}
                          </span>
                          <div className="w-full border-t border-dotted border-gray-150 pt-2.5 text-xs text-gray-500 font-bold max-w-sm">
                            {(goetheSpeakingCueCards[goetheLevel]?.[speakingCueCardIndex]?.task) || "Explain or ask a question."}
                          </div>
                        </div>
                      </div>

                      {/* Text Entry for Spoken Transcript */}
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center justify-between text-left">
                          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Type what you would speak out loud:</label>
                          <span className="text-[9px] text-primary font-black uppercase tracking-wider bg-primary/15 rounded px-2">Simulated Live Mic Transcript</span>
                        </div>
                        <input
                          type="text"
                          value={studentOralUtterance}
                          onChange={(e) => setStudentOralUtterance(e.target.value)}
                          placeholder="e.g., Wo ist die Küche? or Ich mag frischen Saft trinken..."
                          className="w-full px-5 py-4 bg-white border border-gray-200 focus:border-accent rounded-2xl text-xs font-bold text-accent leading-relaxed focus:outline-none"
                        />
                        <p className="text-[9.5px] text-slate-400 font-semibold p-1 leading-relaxed italic text-left">
                          *Hint helper: {goetheSpeakingCueCards[goetheLevel]?.[speakingCueCardIndex]?.hint}*
                        </p>
                      </div>

                      {/* Submit Grade */}
                      {!speakingEvaluation && (
                        <button
                          type="button"
                          disabled={isSpeakingLoading || !studentOralUtterance.trim()}
                          onClick={handleEvaluateSpeaking}
                          className="w-full py-4 bg-accent hover:bg-black text-white font-sans font-black uppercase text-xs tracking-widest rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isSpeakingLoading ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" /> Examining speech structures & word alignment...
                            </>
                          ) : (
                            <>
                              <MessageSquare size={12} /> Evaluate Speaking Attempt
                            </>
                          )}
                        </button>
                      )}

                      {/* Results display */}
                      {speakingEvaluation && !isSpeakingLoading && (
                        <div className="space-y-6 pt-6 border-t border-gray-150">
                          {/* Score dashboard header */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-teal-50/50 p-5 rounded-2xl border border-teal-100">
                            <div className="space-y-1 text-left">
                              <span className="text-[10px] font-black text-teal-800 uppercase tracking-widest block">Oral Performance Evaluator</span>
                              <h4 className="font-display font-black text-slate-900 text-base">Graded Speak Attempt</h4>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-teal-800/80 uppercase font-black tracking-widest bg-teal-100 px-3 py-1 rounded-md">
                                {speakingEvaluation.status}
                              </span>
                              <div className="px-4 py-2 bg-teal-500 text-white font-display font-black rounded-lg text-sm shadow-sm">
                                {speakingEvaluation.overallScore} <span className="text-xs font-medium opacity-80">/ 5</span>
                              </div>
                            </div>
                          </div>

                          {/* Feedback insights details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-white border border-gray-150 rounded-2xl space-y-1 text-left">
                              <span className="text-[9px] font-black uppercase text-[#6a3fb1] tracking-wider block">Grammar Review</span>
                              <p className="text-[11px] font-medium text-gray-700 leading-relaxed">{speakingEvaluation.grammarFeedback}</p>
                            </div>
                            <div className="p-4 bg-white border border-gray-150 rounded-2xl space-y-1 text-left">
                              <span className="text-[9px] font-black uppercase text-teal-600 tracking-wider block">Pronunciation & Accent Coach</span>
                              <p className="text-[11px] font-medium text-gray-700 leading-relaxed">{speakingEvaluation.pronunciationTips}</p>
                            </div>
                          </div>

                          {/* Script standard of high performance */}
                          <div className="p-5 bg-[#faf5ff] border border-purple-100 rounded-2xl space-y-2 text-left">
                            <div className="flex items-center gap-1.5 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                              <Sparkles size={11} className="text-purple-600" /> Perfect Speaking Template
                            </div>
                            <blockquote className="text-xs sm:text-sm font-sans font-black text-[#581c87] italic pl-3 border-l-2 border-purple-300">
                              "{speakingEvaluation.suggestedModelScript}"
                            </blockquote>
                          </div>

                          {/* Action to reset */}
                          <button
                            type="button"
                            onClick={() => {
                              setSpeakingEvaluation(null);
                              setStudentOralUtterance("");
                            }}
                            className="px-5 py-3.5 bg-soft-gray hover:bg-gray-150 text-gray-600 font-sans font-black uppercase text-[10px] tracking-widest rounded-xl transition"
                          >
                            Try Next Cue Card
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Goethe A1 Mock Exam Interactive Mode */}
                  {goetheMode === "mockexam" && (
                    <div className="space-y-6">
                      {/* Section 1: Instructions / Official Guide */}
                      {mockExamSection === "instructions" && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left animate-fade-in">
                          <div className="bg-gradient-to-r from-blue-500/10 to-[#4B3FBF]/10 p-6 rounded-2xl border border-blue-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2 text-left">
                              <span className="bg-blue-100 text-blue-800 rounded px-2.5 py-1 text-[9px] font-black uppercase tracking-wider block w-fit">
                                Start Deutsch 1 (CEFR A1)
                              </span>
                              <h3 className="font-display font-black text-slate-800 text-lg md:text-xl lg:text-2xl">
                                Goethe A1 Modellsatz Simulator
                              </h3>
                              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-lg">
                                This interactive mock exam matches the exact official Goethe-Institut A1 Start Deutsch exam structure. Test your real skills in Listening (Hören), Reading (Lesen), and Writing (Schreiben).
                              </p>
                            </div>
                            <div className="w-24 h-24 shrink-0 rounded-2xl bg-[#4B3FBF] text-white flex flex-col items-center justify-center p-3 text-center self-center shadow-lg shadow-[#4B3FBF]/25">
                              <span className="text-[10px] uppercase font-black tracking-widest leading-none opacity-80">A1 Level</span>
                              <span className="text-3xl font-display font-black mt-1">100</span>
                              <span className="text-[8px] uppercase font-black font-sans leading-none opacity-80 mt-1">Total Points</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-5 border border-gray-150 rounded-2xl text-left space-y-2 bg-[#f8fafc]/50">
                              <div className="text-blue-600 font-extrabold flex items-center gap-1.5 text-xs">
                                <Volume2 size={16} /> Hören — Listening
                              </div>
                              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                                5 questions based on real-world announcements, dates, and prices. Scaled value: <strong>25 Points</strong>.
                              </p>
                            </div>

                            <div className="p-5 border border-gray-150 rounded-2xl text-left space-y-2 bg-[#f8fafc]/50">
                              <div className="text-indigo-600 font-extrabold flex items-center gap-1.5 text-xs">
                                <BookOpen size={16} /> Lesen — Reading
                              </div>
                              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                                5 True/False questions based on emails, notifications, and adverts. Scaled value: <strong>25 Points</strong>.
                              </p>
                            </div>

                            <div className="p-5 border border-gray-150 rounded-2xl text-left space-y-2 bg-[#f8fafc]/50">
                              <div className="text-teal-600 font-extrabold flex items-center gap-1.5 text-xs">
                                <PenTool size={16} /> Schreiben — Writing
                              </div>
                              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                                1. Form fill on booking (<strong>10 Points</strong>)<br />
                                2. AI-evaluated letter draft (~30 words) (<strong>15 Points</strong>).
                              </p>
                            </div>
                          </div>

                          <div className="bg-[#fef9c3]/50 p-5 rounded-2xl border border-yellow-200">
                            <h4 className="text-amber-800 font-black text-xs uppercase tracking-wider mb-2">💡 Tips for Success</h4>
                            <ul className="list-disc pl-5 text-[11px] text-amber-900 font-semibold space-y-1.5">
                              <li>Achieving at least <strong>60% (60/100 points)</strong> is required to pass the official Goethe-Zertifikat A1.</li>
                              <li>Use the "Play" feature beside each Hören question to simulate the auditory assessment. You can view the transcript and translation if you need help!</li>
                            </ul>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setMockExamSection("hoeren");
                              setMockSelectedAnswers({});
                              setMockDraftLetter("");
                              setMockFormAnswers({
                                surname: "",
                                firstname: "",
                                persons: "",
                                date: "",
                                duration: "",
                                childSeats: "",
                              });
                              setMockExamResult(null);
                            }}
                            className="w-full py-4.5 bg-[#4B3FBF] hover:bg-black text-white font-sans font-black uppercase text-xs tracking-widest rounded-2xl transition shadow-lg shadow-[#4B3FBF]/15 text-center flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Begin Interactive German Mock Exam</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      )}

                      {/* Section 2: Hören (Listening) */}
                      {mockExamSection === "hoeren" && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left animate-fade-in">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 text-left">
                            <div className="text-left">
                              <span className="text-[10px] font-black tracking-widest text-[#4B3FBF] uppercase">Teil 1 of 3</span>
                              <h3 className="font-display font-black text-slate-800 text-lg">Modellsatz Hören (Listening Comprehension)</h3>
                            </div>
                            <span className="bg-blue-50 border border-blue-100 text-blue-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                              5 Questions • Max 25 Escalated Points
                            </span>
                          </div>

                          <div className="space-y-6">
                            {currentMockExam.hoeren.map((q, index) => {
                              const isPlaying = !!mockAudioPlaying[q.id];
                              const showTranscript = !!mockShowTranscripts[q.id];
                              return (
                                <div key={q.id} className="p-5 border border-gray-150 rounded-2xl space-y-4 text-left">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                                    <h4 className="font-display font-black text-accent text-sm text-left">
                                      Frage {index + 1}: {q.question}
                                    </h4>
                                    
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isPlaying) {
                                            setMockAudioPlaying(prev => ({ ...prev, [q.id]: false }));
                                          } else {
                                            setMockAudioPlaying(prev => ({ ...prev, [q.id]: true }));
                                            setTimeout(() => {
                                              setMockAudioPlaying(prev => ({ ...prev, [q.id]: false }));
                                            }, 8000);
                                          }
                                        }}
                                        className={`px-3 py-1.5 rounded-xl font-sans text-[10px] tracking-wider uppercase font-black transition flex items-center gap-1.5 cursor-pointer ${isPlaying ? "bg-red-500 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"}`}
                                      >
                                        <Volume2 size={12} className={isPlaying ? "animate-bounce" : ""} />
                                        {isPlaying ? "Stop Listening" : "Play Audio"}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setMockShowTranscripts(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-sans text-[10px] tracking-wider uppercase font-black transition"
                                      >
                                        {showTranscript ? "Hide Text" : "View Transcript"}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Simulated Playing Status Bar */}
                                  {isPlaying && (
                                    <div className="p-3 bg-red-50 rounded-xl border border-red-100/50 space-y-1.5 animate-pulse">
                                      <div className="flex items-center justify-between text-[9px] font-black text-red-600 uppercase tracking-widest">
                                        <span>Simulated Playing A1 Audio Cassette...</span>
                                        <span>Track {index + 1}</span>
                                      </div>
                                      <div className="w-full bg-red-100 h-1 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full w-[60%] animate-[slide_5s_linear_infinite]" style={{ animationDuration: "5s" }}></div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Audio Transcript and English translation */}
                                  {showTranscript && (
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-150 space-y-2 text-left font-sans text-xs">
                                      <div>
                                        <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider mb-1">German Audio Script:</span>
                                        <p className="text-[11px] font-bold text-accent whitespace-pre-line leading-relaxed italic">"{q.transcript}"</p>
                                      </div>
                                      <div className="border-t border-dashed border-gray-200 pt-2">
                                        <span className="text-[9px] font-black uppercase text-blue-600 block tracking-wider mb-1">English Translation:</span>
                                        <p className="text-[11px] font-semibold text-gray-600 whitespace-pre-line leading-relaxed italic">"{q.translation}"</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Selection of options */}
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {q.options.map((opt) => {
                                      const isSelected = mockSelectedAnswers[q.id] === opt;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => setMockSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                          className={`py-3 px-4 rounded-xl text-left font-sans text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between border ${isSelected ? "bg-[#4B3FBF] text-white border-[#4B3FBF] shadow" : "bg-white border-gray-150 hover:bg-gray-50 text-gray-700"}`}
                                        >
                                          <span>{opt}</span>
                                          {isSelected && <CheckCircle2 size={12} className="text-white bg-[#4b3fbf] rounded-full" />}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                              {Object.keys(mockSelectedAnswers).filter(k => k.startsWith("h")).length} of 5 answered
                            </span>
                            <button
                              type="button"
                              onClick={() => setMockExamSection("lesen")}
                              className="px-6 py-3 bg-[#4B3FBF] hover:bg-black text-white font-sans font-black uppercase text-[10px] tracking-widest rounded-xl transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>Next Section: Lesen (Reading)</span>
                              <ArrowRight size={11} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Section 3: Lesen (Reading) */}
                      {mockExamSection === "lesen" && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left animate-fade-in">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 text-left">
                            <div className="text-left">
                              <span className="text-[10px] font-black tracking-widest text-[#4B3FBF] uppercase">Teil 2 of 3</span>
                              <h3 className="font-display font-black text-slate-800 text-lg">Modellsatz Lesen (Reading Comprehension)</h3>
                            </div>
                            <span className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                              5 Questions • Max 25 Escalated Points
                            </span>
                          </div>

                          {/* Reading Passage Group 1 */}
                          <div className="space-y-4">
                            <div className="p-5 bg-gradient-to-br from-indigo-50/20 to-blue-50/20 border border-indigo-100/50 rounded-2xl text-left space-y-2">
                              <span className="bg-indigo-100 text-indigo-800 text-[8.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider block w-fit">
                                Passage 1: {goetheLevel === "A1" ? "E-Mail from Maria" : goetheLevel === "A2" ? "Library Rules Update" : goetheLevel === "B1" ? "Work-Life-Balance Study" : "Climate Change & Urban Architecture"}
                              </span>
                              <p className="text-xs text-gray-700 font-semibold leading-relaxed border-l-4 border-indigo-300 pl-4 py-1 whitespace-pre-line bg-white p-4 rounded-xl">
                                {currentMockExam.lesen[0].text}
                              </p>
                              {goetheLevel === "A1" && (
                                <p className="text-[9.5px] text-gray-400 font-semibold italic">
                                  English translation: "Dear Eva, I am now in Berlin. The weather is super. Yesterday I was in the famous museum. Tomorrow I will buy gifts for my family and on Sunday I will fly back to Karachi. Love, Maria."
                                </p>
                              )}
                            </div>

                            <div className="space-y-3 pl-2">
                              {currentMockExam.lesen.slice(0, 2).map((q, idx) => {
                                return (
                                  <div key={q.id} className="p-4 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left font-sans">
                                    <div className="space-y-1">
                                      <h4 className="font-display font-black text-accent text-xs">
                                        Question {idx + 1}: Decide if the statement is <strong>Richtig (True)</strong> or <strong>Falsch (False)</strong>:
                                      </h4>
                                      <p className="text-xs text-gray-600 font-bold bg-[#f8fafc] px-3 py-2 rounded-lg inline-block">
                                        "{q.question}"
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {["Richtig", "Falsch"].map((opt) => {
                                        const isOptSelected = mockSelectedAnswers[q.id] === opt;
                                        return (
                                          <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setMockSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition ${isOptSelected ? (opt === "Richtig" ? "bg-emerald-600 text-white" : "bg-red-600 text-white") : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-150"}`}
                                          >
                                            {opt}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <hr className="border-gray-100" />

                          {/* Reading Passage Group 2 */}
                          <div className="space-y-4 pt-2">
                            <div className="p-5 bg-gradient-to-br from-indigo-50/20 to-blue-50/20 border border-indigo-100/50 rounded-2xl text-left space-y-2">
                              <span className="bg-indigo-100 text-indigo-800 text-[8.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider block w-fit">
                                Passage 2: {goetheLevel === "A1" ? "VHS Sommer-Intensivkurs Advertisement" : goetheLevel === "A2" ? "Gym & Pool Facility Announcement" : goetheLevel === "B1" ? "BVG Transit Construction Alert" : "Bedingungsloses Grundeinkommen Debate"}
                              </span>
                              <p className="text-xs text-slate-800 font-semibold leading-relaxed border-l-4 border-indigo-300 pl-4 py-1 whitespace-pre-line bg-white p-4 rounded-xl">
                                {currentMockExam.lesen[2].text}
                              </p>
                              {goetheLevel === "A1" && (
                                <p className="text-[9.5px] text-gray-400 font-semibold italic">
                                  English translation: "German Adult Education Association: Intensive summer courses for German as a foreign language! German A1 and A2 in August for only 250 Euros including books and accommodation in the student residence. Register now at www.vhs-sommer.de!"
                                </p>
                              )}
                            </div>

                            <div className="space-y-3 pl-2 max-w-full">
                              {currentMockExam.lesen.slice(2, 5).map((q, idx) => {
                                return (
                                  <div key={q.id} className="p-4 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left font-sans">
                                    <div className="space-y-1">
                                      <h4 className="font-display font-black text-accent text-xs">
                                        Question {idx + 3}: Decide if statement is <strong>Richtig</strong> or <strong>Falsch</strong>:
                                      </h4>
                                      <p className="text-xs text-gray-600 font-bold bg-[#f8fafc] px-3 py-2 rounded-lg inline-block">
                                        "{q.question}"
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {["Richtig", "Falsch"].map((opt) => {
                                        const isOptSelected = mockSelectedAnswers[q.id] === opt;
                                        return (
                                          <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setMockSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition ${isOptSelected ? (opt === "Richtig" ? "bg-emerald-600 text-white" : "bg-red-600 text-white") : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-150"}`}
                                          >
                                            {opt}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => setMockExamSection("hoeren")}
                              className="px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-sans font-black uppercase text-[10px] tracking-widest rounded-xl transition cursor-pointer"
                            >
                              ⬅️ Hören Section
                            </button>
                            <button
                              type="button"
                              onClick={() => setMockExamSection("schreiben")}
                              className="px-6 py-3 bg-[#4B3FBF] hover:bg-black text-white font-sans font-black uppercase text-[10px] tracking-widest rounded-xl transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>Next Section: Schreiben</span>
                              <ArrowRight size={11} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Section 4: Schreiben (Form & Brief) */}
                      {mockExamSection === "schreiben" && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left animate-fade-in">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 text-left">
                            <div className="text-left">
                              <span className="text-[10px] font-black tracking-widest text-[#4B3FBF] uppercase">Teil 3 of 3</span>
                              <h3 className="font-display font-black text-slate-800 text-lg">Modellsatz Schreiben</h3>
                            </div>
                            <span className="bg-teal-50 border border-teal-100 text-teal-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                              Fill Formular & Write brief letter
                            </span>
                          </div>

                          {/* Part 1: Formular filling */}
                          <div className="space-y-4 text-left">
                            <div className="p-5 bg-teal-50/30 border border-teal-100/50 rounded-2xl text-left space-y-3">
                              <span className="bg-teal-100 text-teal-800 text-[8.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider block w-fit">
                                Part 1: Registration Form fill (Anmeldeformular) — Max 10.0 scaled Points
                              </span>
                              <h4 className="font-display font-black text-accent text-xs">Read the situation carefully to complete the form:</h4>
                              <p className="text-xs text-gray-700 font-bold leading-normal p-4 bg-white rounded-xl border border-gray-150">
                                "Ihr Freund Eva Meier möchte im August eine Woche Urlaub in Hamburg machen und ein Zimmer im Jugendgästehaus buchen. Sie reist mit 3 Personen (ihr Ehemann und ein 5-jähriges Kind, das einen Kindersitz braucht) am 15. August an. Füllen Sie das folgende Formular aus!"
                              </p>
                              <p className="text-[10px] text-gray-400 font-semibold italic">
                                Advice: Use details from above. The traveler's surname is Meier (or Maier), first name is Eva, total persons including herself is 3, stays for 1 week starting 15 August, and a child seat is needed (Ja).
                              </p>
                            </div>

                            <div className="p-6 bg-[#f8fafc]/60 rounded-2xl border border-gray-100 space-y-4 font-sans max-w-xl mx-auto">
                              <div className="text-center font-black text-[#6a3fb1] uppercase tracking-widest text-[11px] border-b border-dashed border-gray-200 pb-2">
                                Jugendgästehaus Hamburg — Anmeldung
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block text-[8.5px] font-black uppercase text-gray-400">Familienname (Surname)</label>
                                  <input
                                    type="text"
                                    value={mockFormAnswers.surname}
                                    onChange={(e) => setMockFormAnswers(prev => ({ ...prev, surname: e.target.value }))}
                                    placeholder="Friend's surname e.g., Meier"
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:border-accent focus:outline-none text-[#4B3FBF]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[8.5px] font-black uppercase text-gray-400">Vorname (First Name)</label>
                                  <input
                                    type="text"
                                    value={mockFormAnswers.firstname}
                                    onChange={(e) => setMockFormAnswers(prev => ({ ...prev, firstname: e.target.value }))}
                                    placeholder="Friend's first name e.g., Eva"
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:border-accent focus:outline-none text-[#4B3FBF]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[8.5px] font-black uppercase text-gray-400">Anzahl der Personen (No. of Persons)</label>
                                  <input
                                    type="text"
                                    value={mockFormAnswers.persons}
                                    onChange={(e) => setMockFormAnswers(prev => ({ ...prev, persons: e.target.value }))}
                                    placeholder="e.g., 3 or drei"
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:border-accent focus:outline-none text-[#4B3FBF]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[8.5px] font-black uppercase text-gray-400">Anreisedatum (Date of arrival)</label>
                                  <input
                                    type="text"
                                    value={mockFormAnswers.date}
                                    onChange={(e) => setMockFormAnswers(prev => ({ ...prev, date: e.target.value }))}
                                    placeholder="e.g., 15. August"
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:border-accent focus:outline-none text-[#4B3FBF]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[8.5px] font-black uppercase text-gray-400">Aufenthaltsdauer (Duration of Stay)</label>
                                  <input
                                    type="text"
                                    value={mockFormAnswers.duration}
                                    onChange={(e) => setMockFormAnswers(prev => ({ ...prev, duration: e.target.value }))}
                                    placeholder="e.g., 1 Woche or 7 Tage"
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:border-accent focus:outline-none text-[#4B3FBF]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[8.5px] font-black uppercase text-gray-400">Kindersitz benötigt? (Ja/Nein)</label>
                                  <input
                                    type="text"
                                    value={mockFormAnswers.childSeats}
                                    onChange={(e) => setMockFormAnswers(prev => ({ ...prev, childSeats: e.target.value }))}
                                    placeholder="Ja / Nein"
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:border-accent focus:outline-none text-[#4B3FBF]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <hr className="border-gray-100" />

                          {/* Part 2: Brief writing */}
                          <div className="space-y-4 pt-2">
                            <span className="bg-[#eff6ff] text-blue-800 border border-blue-100 rounded px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider block w-fit">
                              Part 2: Interactive Letter Writing — Max 15.0 scaled Points (AI Evaluated)
                            </span>
                            <div className="p-5 bg-blue-50/20 border border-blue-100/50 rounded-2xl text-left space-y-2">
                              <h4 className="font-display font-black text-accent text-xs">Write an Email to Garmisch Sporthotel:</h4>
                              <p className="text-xs text-gray-700 font-bold leading-normal p-4 bg-white rounded-xl border border-gray-150">
                                "Sie möchten im Sommer ein Zimmer im Sporthotel 'Alpenblick' in Garmisch reservieren. Schreiben Sie eine E-Mail. 1. Warum schreiben Sie? 2. Wann möchten Sie kommen und für wie lange? 3. Bitten Sie um eine Antwort. (Schreiben Sie ca. 30 Wörter)"
                              </p>
                              <p className="text-[10px] text-gray-400 font-semibold italic">
                                Prompt constraints: Include polite salutation, detail your room reservation dates for summer, request a reply, and close appropriately. Word count should be around 30 words.
                              </p>
                            </div>

                            {/* Textarea Input */}
                            <div className="space-y-1.5 text-left">
                              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Draft Your Booking Email:</label>
                              <textarea
                                rows={6}
                                value={mockDraftLetter}
                                onChange={(e) => setMockDraftLetter(e.target.value)}
                                placeholder="Sehr geehrte Damen und Herren, ich möchte im Sommer ein Zimmer für eine Woche reservieren..."
                                className="w-full p-5 bg-white border border-gray-200 focus:border-accent rounded-2xl text-xs font-bold text-accent leading-relaxed focus:outline-none"
                              />
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                <span>Target: ~30-40 words</span>
                                <span>Word Count: {mockDraftLetter.trim() ? mockDraftLetter.trim().split(/\s+/).length : 0} words</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 font-sans">
                            <button
                              type="button"
                              onClick={() => setMockExamSection("lesen")}
                              className="px-5 py-3.5 bg-soft-gray hover:bg-gray-150 text-gray-700 font-black uppercase text-[10px] tracking-widest rounded-xl transition cursor-pointer"
                            >
                              ⬅️ Lesen Section
                            </button>

                            <button
                              type="button"
                              disabled={isMockSubmitting || !mockDraftLetter.trim()}
                              onClick={handleEvaluateMockExam}
                              className="px-6 py-4 bg-[#4B3FBF] hover:bg-black text-white font-black uppercase text-xs tracking-widest rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              {isMockSubmitting ? (
                                <>
                                  <RefreshCw size={12} className="animate-spin" /> grading mock exam papers...
                                </>
                              ) : (
                                <>
                                  <Award size={13} /> Finish & Submit Exam
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Section 5: Results & Report Card */}
                      {mockExamSection === "results" && mockExamResult && (
                        <div className="space-y-6 pt-2 animate-fade-in text-left">
                          <div className="bg-white p-8 rounded-[3rem] border-2 border-primary/20 bg-gradient-to-br from-[#ebe8ff]/15 to-white shadow-xl relative overflow-hidden">
                            <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="border-[3px] border-double border-primary/40 p-8 rounded-[2rem] space-y-8 relative">
                              <div className="text-center space-y-2">
                                <span className="bg-[#4B3FBF] text-white rounded-full px-5 py-1 text-[9px] font-black uppercase tracking-widest inline-block">
                                  Goethe A1 Modellsatz Evaluation
                                </span>
                                <h3 className="font-display font-black text-slate-800 text-xl tracking-tight uppercase mt-2">
                                  Start Deutsch 1 Zeugnis
                                </h3>
                                <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">
                                  Official Simulation Score Report
                                </p>
                              </div>

                              <hr className="border-t-2 border-dotted border-primary/20" />

                              {/* Student info and Status */}
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-sans">
                                <div className="space-y-2 text-left">
                                  <div className="text-[11px] text-gray-400 font-extrabold uppercase tracking-wider">Candidate Name:</div>
                                  <div className="text-base font-black text-accent uppercase">
                                    {mockFormAnswers.firstname || mockFormAnswers.surname ? (
                                      `${mockFormAnswers.firstname} ${mockFormAnswers.surname}`
                                    ) : (
                                      "A1 Student Candidate"
                                    )}
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-semibold uppercase">
                                    Exam Code: SD-{Math.floor(Math.random() * 89999 + 10000)} • Goethe-Zertifikat Simulator
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-150 shrink-0">
                                  <div className="space-y-0.5 text-left">
                                    <span className="text-[9px] text-gray-400 tracking-wider uppercase block font-black">Overall Score:</span>
                                    <span className="font-display font-black text-slate-800 text-lg">{mockExamResult.examPercent} / 100</span>
                                  </div>
                                  <span className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl ${mockExamResult.examPercent >= 60 ? "bg-emerald-50 border border-emerald-100 text-emerald-600 animate-pulse" : "bg-red-50 border border-red-100 text-red-600"}`}>
                                    {mockExamResult.examPercent >= 60 ? "Bestanden (Passed)" : "Nicht Bestanden"}
                                  </span>
                                </div>
                              </div>

                              {/* Progress metrics breakdown */}
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase text-[#6a3fb1] tracking-wider text-left">CEFR Scaled Module Marks</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                                  <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-150 text-left">
                                    <div className="text-blue-800 text-[10px] font-black uppercase tracking-wider mb-1">
                                      Hören (Listening)
                                    </div>
                                    <div className="text-lg font-black text-slate-800">
                                      {mockExamResult.listeningScaled.toFixed(1)} <span className="text-xs text-gray-400">/ 25.0</span>
                                    </div>
                                    <div className="text-[9.5px] font-semibold text-gray-500 mt-1">
                                      {mockExamResult.listeningPoints} of 5 correct answers
                                    </div>
                                  </div>

                                  <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-150 text-left">
                                    <div className="text-indigo-800 text-[10px] font-black uppercase tracking-wider mb-1">
                                      Lesen (Reading)
                                    </div>
                                    <div className="text-lg font-black text-slate-800">
                                      {mockExamResult.readingScaled.toFixed(1)} <span className="text-xs text-gray-400">/ 25.0</span>
                                    </div>
                                    <div className="text-[9.5px] font-semibold text-gray-500 mt-1">
                                      {mockExamResult.readingPoints} of 5 correct answers
                                    </div>
                                  </div>

                                  <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-150 text-left">
                                    <div className="text-teal-800 text-[10px] font-black uppercase tracking-wider mb-1">
                                      Schreiben (Form & Brief)
                                    </div>
                                    <div className="text-lg font-black text-slate-800">
                                      {mockExamResult.totalSchreibenScaled.toFixed(1)} <span className="text-xs text-gray-400">/ 25.0</span>
                                    </div>
                                    <div className="text-[9.5px] font-semibold text-gray-500 mt-1">
                                      Form {mockExamResult.formPoints}/6 • AI Letter graded
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* AI Letter Grader Feedback */}
                              {mockExamResult.letterEvaluation && (
                                <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                                  <h4 className="text-[10px] font-black uppercase text-[#6a3fb1] tracking-wider text-left flex items-center gap-1.5">
                                    <Sparkles size={11} className="text-[#6a3fb1]" /> {goetheLevel} Brief Writer Feedback & Analysis
                                  </h4>

                                  <div className="p-5 bg-[#faf5ff] rounded-2xl border border-purple-100 text-left space-y-4 font-sans">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div>
                                        <span className="text-[9px] font-black text-purple-800 uppercase block tracking-wider mb-1">AI Language Score:</span>
                                        <div className="font-display font-black text-purple-900 text-base">
                                          {mockExamResult.letterEvaluation.totalScore} / 25 <span className="text-xs font-semibold text-[#581c87]">points</span>
                                        </div>
                                      </div>
                                      <span className="text-[10.5px] font-black uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-md text-[#581c87]">
                                        {mockExamResult.letterEvaluation.totalScore >= 20 ? "Sehr Gut (Excellent)" : mockExamResult.letterEvaluation.totalScore >= 15 ? "Gut (Good)" : "Bestehensgrenze (Passing)"}
                                      </span>
                                    </div>

                                    {/* Sub-criteria scores */}
                                    {mockExamResult.letterEvaluation.scores && (
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white/70 p-3 rounded-xl border border-purple-100 text-[10px]">
                                        <div>
                                          <span className="text-gray-400 font-extrabold uppercase">Content:</span>
                                          <div className="font-black text-slate-800">{mockExamResult.letterEvaluation.scores.content}/10</div>
                                        </div>
                                        <div>
                                          <span className="text-gray-400 font-extrabold uppercase">Formality:</span>
                                          <div className="font-black text-slate-800">{mockExamResult.letterEvaluation.scores.formality}/5</div>
                                        </div>
                                        <div>
                                          <span className="text-gray-400 font-extrabold uppercase">Grammar:</span>
                                          <div className="font-black text-slate-800">{mockExamResult.letterEvaluation.scores.grammar}/5</div>
                                        </div>
                                        <div>
                                          <span className="text-gray-400 font-extrabold uppercase">Vocabulary:</span>
                                          <div className="font-black text-slate-800">{mockExamResult.letterEvaluation.scores.vocabulary}/5</div>
                                        </div>
                                      </div>
                                    )}

                                    <div className="space-y-3">
                                      {mockExamResult.letterEvaluation.overallFeedback && (
                                        <div>
                                          <span className="text-[9.5px] font-black uppercase text-purple-700 block tracking-wider mb-1">Overall Feedback:</span>
                                          <p className="text-xs text-[#581c87] leading-relaxed font-semibold">
                                            {mockExamResult.letterEvaluation.overallFeedback}
                                          </p>
                                        </div>
                                      )}

                                      <div>
                                        <span className="text-[9.5px] font-black uppercase text-purple-700 block tracking-wider mb-1">Grammar & Spelling Corrections:</span>
                                        {Array.isArray(mockExamResult.letterEvaluation.corrections) && mockExamResult.letterEvaluation.corrections.length > 0 ? (
                                          <div className="space-y-2 mt-2">
                                            {mockExamResult.letterEvaluation.corrections.map((corr: any, cidx: number) => (
                                              <div key={cidx} className="p-3 bg-red-50/50 border border-red-100/40 rounded-xl text-left text-xs font-semibold">
                                                <div className="flex flex-wrap items-center gap-2">
                                                  <span className="line-through text-red-600 font-bold bg-red-100/50 px-1.5 py-0.5 rounded">
                                                    "{corr.original}"
                                                  </span>
                                                  <span className="text-gray-400">➔</span>
                                                  <span className="text-emerald-700 font-bold bg-emerald-100/50 px-1.5 py-0.5 rounded">
                                                    "{corr.corrected}"
                                                  </span>
                                                </div>
                                                {corr.explanation && (
                                                  <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed">
                                                    {corr.explanation}
                                                  </p>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="text-xs text-purple-900 leading-relaxed font-semibold">
                                            No spelling or grammar errors caught! Perfect {goetheLevel} German!
                                          </p>
                                        )}
                                      </div>

                                      <div className="border-t-2 border-[#f3e8ff] pt-2">
                                        <span className="text-[9.5px] font-black uppercase text-purple-700 block tracking-wider mb-1">Standard Model Answer:</span>
                                        <blockquote className="text-xs text-[#581c87] font-bold italic border-l-2 border-purple-300 pl-3 whitespace-pre-wrap leading-relaxed">
                                          "{mockExamResult.letterEvaluation.improvedLetter}"
                                        </blockquote>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-3 pt-4 justify-center font-sans">
                                <button
                                  type="button"
                                  onClick={() => setMockExamSection("review")}
                                  className="px-5 py-3.5 bg-[#4B3FBF] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition cursor-pointer"
                                >
                                  🔍 Review Worksheet Answers
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMockExamSection("instructions");
                                    setMockSelectedAnswers({});
                                    setMockFormAnswers({
                                      surname: "",
                                      firstname: "",
                                      persons: "",
                                      date: "",
                                      duration: "",
                                      childSeats: "",
                                    });
                                    setMockDraftLetter("");
                                    setMockExamResult(null);
                                  }}
                                  className="px-5 py-3.5 bg-soft-gray hover:bg-gray-200 text-gray-700 font-black uppercase text-[10px] tracking-widest rounded-xl transition cursor-pointer"
                                >
                                  🔄 Rewrite Exam
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section 6: Review Sheet Mode */}
                      {mockExamSection === "review" && mockExamResult && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left animate-fade-in font-sans">
                          <div className="pb-4 border-b border-gray-100 text-left">
                            <h3 className="font-display font-black text-slate-800 text-lg">Modellsatz Review Sheet</h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">
                              Compare your submitted answers to the correct official answers.
                            </p>
                          </div>

                          <div className="space-y-6">
                            {/* Listening Review */}
                            <div className="space-y-3">
                              <h4 className="font-display font-black text-blue-800 text-xs uppercase tracking-wider">🎧 Hören Module Review</h4>
                              {currentMockExam.hoeren.map((q, idx) => {
                                const selected = mockSelectedAnswers[q.id];
                                const isCorrect = selected === q.correct;
                                return (
                                  <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? "bg-emerald-50/20 border-emerald-100" : "bg-red-50/20 border-red-100"} text-left space-y-2`}>
                                    <div className="flex items-center justify-between gap-4">
                                      <span className="font-black text-xs text-slate-800">Q{idx + 1}: {q.question}</span>
                                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                        {isCorrect ? "Correct" : "Incorrect"}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-gray-650 space-y-1">
                                      <p>Your Selected: <strong className={isCorrect ? "text-emerald-700 font-black" : "text-red-700 font-black"}>{selected || "Unanswered"}</strong></p>
                                      <p>Correct Value: <strong className="text-emerald-700 font-black">{q.correct}</strong></p>
                                      <div className="p-3 bg-white border border-gray-100 rounded-lg mt-2 font-mono text-[10px] leading-relaxed text-gray-500 whitespace-pre-line">
                                        <strong>Transcript Script:</strong> {q.transcript}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <hr className="border-gray-100" />

                            {/* Reading Review */}
                            <div className="space-y-3">
                              <h4 className="font-display font-black text-indigo-800 text-xs uppercase tracking-wider">📖 Reading Module Review</h4>
                              {currentMockExam.lesen.map((q, idx) => {
                                const selected = mockSelectedAnswers[q.id];
                                const isCorrect = selected === q.correct;
                                return (
                                  <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? "bg-emerald-50/20 border-emerald-100" : "bg-red-50/20 border-red-100"} text-left space-y-2`}>
                                    <div className="flex items-center justify-between gap-4">
                                      <span className="font-black text-xs text-slate-800">Statement {idx + 1}: {q.question}</span>
                                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                        {isCorrect ? "Correct" : "Incorrect"}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-gray-650 space-y-1">
                                      <p>Your Selected: <strong className={isCorrect ? "text-emerald-700 font-black" : "text-red-700 font-black"}>{selected || "Unanswered"}</strong></p>
                                      <p>Correct Value: <strong className="text-emerald-700 font-black">{q.correct}</strong></p>
                                      <p className="text-[10px] text-gray-500 font-semibold italic mt-1 bg-white border border-gray-120 p-2 rounded">{q.explanation}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <hr className="border-gray-100" />

                            {/* Form Fill Review */}
                            <div className="space-y-3">
                              <h4 className="font-display font-black text-teal-800 text-xs uppercase tracking-wider">✍️ Phase 3: Booking Form Fields Review</h4>
                              <div className="p-5 bg-[#f8fafc] rounded-xl border border-gray-150 text-left space-y-3 text-xs leading-relaxed text-slate-705">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="flex items-center gap-1.5 justify-between p-2 bg-white border border-gray-100 rounded-lg">
                                    <span>Surname: <strong>{mockFormAnswers.surname || "None"}</strong> (Target: {currentFormMetadata.surnameTarget})</span>
                                    {mockExamResult.formCheck.surname ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-600" />}
                                  </div>

                                  <div className="flex items-center gap-1.5 justify-between p-2 bg-white border border-gray-100 rounded-lg">
                                    <span>Vorname: <strong>{mockFormAnswers.firstname || "None"}</strong> (Target: {currentFormMetadata.firstnameTarget})</span>
                                    {mockExamResult.formCheck.firstname ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-600" />}
                                  </div>

                                  <div className="flex items-center gap-1.5 justify-between p-2 bg-white border border-gray-100 rounded-lg">
                                    <span>Person/Type: <strong>{mockFormAnswers.persons || "None"}</strong> (Target: {currentFormMetadata.personsTarget})</span>
                                    {mockExamResult.formCheck.persons ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-600" />}
                                  </div>

                                  <div className="flex items-center gap-1.5 justify-between p-2 bg-white border border-gray-100 rounded-lg">
                                    <span>Arrival: <strong>{mockFormAnswers.date || "None"}</strong> (Target: {currentFormMetadata.dateTarget})</span>
                                    {mockExamResult.formCheck.date ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-600" />}
                                  </div>

                                  <div className="flex items-center gap-1.5 justify-between p-2 bg-white border border-gray-100 rounded-lg">
                                    <span>Duration: <strong>{mockFormAnswers.duration || "None"}</strong> (Target: {currentFormMetadata.durationTarget})</span>
                                    {mockExamResult.formCheck.duration ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-600" />}
                                  </div>

                                  <div className="flex items-center gap-1.5 justify-between p-2 bg-white border border-gray-100 rounded-lg">
                                    <span>Child seat: <strong>{mockFormAnswers.childSeats || "None"}</strong> (Target: {currentFormMetadata.childSeatsTarget})</span>
                                    {mockExamResult.formCheck.childSeats ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-600" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => setMockExamSection("results")}
                              className="px-6 py-3 bg-[#4B3FBF] hover:bg-black text-white font-sans font-black uppercase text-[10px] tracking-widest rounded-xl transition cursor-pointer"
                            >
                              Back to Zeugnis Results 🎖️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
