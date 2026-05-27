import jsPDF from 'jspdf';

export interface CertificateData {
  candidateName: string;
  testType: 'IELTS' | 'PTE' | 'German';
  score: string | number;
  dateString?: string;
  correctAnswers?: number;
  totalQuestions?: number;
}

/**
 * Generates an ultra-crisp, elegant, formal PDF Certificate of Achievement
 * utilizing vector lines, shapes, text, branding assets, and digital signatures.
 */
export function generateCertificatePDF(data: CertificateData): jsPDF {
  const { candidateName, testType, score, dateString, correctAnswers, totalQuestions } = data;

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = pdf.internal.pageSize.getWidth(); // 297 mm
  const height = pdf.internal.pageSize.getHeight(); // 210 mm
  const centerX = width / 2; // 148.5 mm

  // 1. Solid off-white fine linen cream background
  pdf.setFillColor(254, 254, 252);
  pdf.rect(0, 0, width, height, "F");

  // 2. Custom Deep Slate Outer Border (#0f172a, matching brand colors)
  pdf.setDrawColor(15, 23, 42);
  pdf.setLineWidth(1.5);
  pdf.rect(10, 10, width - 20, height - 20);

  // 3. Graceful Gold Inner Accent Border (#D4AF37)
  pdf.setDrawColor(212, 175, 55);
  pdf.setLineWidth(0.6);
  pdf.rect(13, 13, width - 26, height - 26);

  // 4. Anchor Corner Crest Accessories (Classic intersection shapes)
  pdf.setDrawColor(15, 23, 42);
  pdf.setLineWidth(1.2);
  // Top-Left Accent Corner
  pdf.line(8, 18, 18, 18);
  pdf.line(18, 8, 18, 18);
  // Top-Right Accent Corner
  pdf.line(width - 8, 18, width - 18, 18);
  pdf.line(width - 18, 8, width - 18, 18);
  // Bottom-Left Accent Corner
  pdf.line(8, height - 18, 18, height - 18);
  pdf.line(18, height - 8, 18, height - 18);
  // Bottom-Right Accent Corner
  pdf.line(width - 8, height - 18, width - 18, height - 18);
  pdf.line(width - 18, height - 8, width - 18, height - 18);

  // 5. Header Branding Details
  // Gold horizontal accent strip
  pdf.setFillColor(212, 175, 55);
  pdf.rect(centerX - 35, 20, 70, 1, "F");

  // Branded typography logo
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(23);
  pdf.setTextColor(15, 23, 42);
  pdf.text("LANGUAGE WORLD", centerX, 29, { align: "center" });

  // Institution definition subtitle
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text("PREMIER GERMAN LANGUAGE INSTITUTE & TEST PREPARATION CENTER", centerX, 34, { align: "center" });

  // Dividing header line
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.5);
  pdf.line(centerX - 120, 39, centerX + 120, 39);

  // 6. Certificate Heading
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(15, 23, 42);
  pdf.text("CERTIFICATE OF ACHIEVEMENT", centerX, 55, { align: "center" });

  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(11);
  pdf.setTextColor(100, 116, 139);
  pdf.text("This credential formally certifies and warrants core linguistic competence following evaluation.", centerX, 61, { align: "center" });

  // 7. Proud Presentation Segment
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(100, 116, 139);
  pdf.text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", centerX, 76, { align: "center" });

  // Candidate Name
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(30);
  pdf.setTextColor(37, 99, 235); // True blue accent
  const formattedName = candidateName
    .trim()
    .split(" ")
    .map(word => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
  pdf.text(formattedName, centerX, 92, { align: "center" });

  // Classic name baseline signature line
  pdf.setDrawColor(212, 175, 55); // gold accent
  pdf.setLineWidth(0.8);
  pdf.line(centerX - 60, 97, centerX + 60, 97);

  // 8. Dynamic Test-specific Achievements
  let testTitle = "";
  let overallScoreText = "";
  let evaluationContext = "";

  if (testType === 'IELTS') {
    testTitle = "IELTS ACADEMIC MOCK SIMULATION EXAMINATION";
    overallScoreText = `Overall Estimated Band Score: ${score} / 9.0`;
    evaluationContext = "Validated via live interactive listening, academic reading and writing core modular assessments.";
  } else if (testType === 'PTE') {
    testTitle = "PTE ACADEMIC MOCK SIMULATION EXAMINATION";
    overallScoreText = `Overall Estimated Score: ${score} / 90`;
    evaluationContext = "Validated via structured AI scoring of simulated speaking, listening, reading, and writing skills.";
  } else {
    testTitle = "GOETHE GERMAN MOCK SIMULATION EXAMINATION";
    const scoreStr = score.toString().trim();
    const isLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(scoreStr.toUpperCase()) || scoreStr.length <= 4;
    
    if (isLevel) {
      overallScoreText = `Certified CEFR Placement: Level ${scoreStr.toUpperCase()}`;
      let grade = "Bestanden (Passed)";
      if (scoreStr.toUpperCase().startsWith('B2')) grade = "Fortgeschrittene Sprachverwendung (Vantage)";
      else if (scoreStr.toUpperCase().startsWith('B1')) grade = "Selbstständige Sprachverwendung (Threshold)";
      else if (scoreStr.toUpperCase().startsWith('A2')) grade = "Elementare Sprachverwendung (Waystage)";
      else if (scoreStr.toUpperCase().startsWith('A1')) grade = "Elementare Sprachverwendung (Breakthrough)";
      evaluationContext = `Proficiency Band: ${grade}. Standardized to Common European Framework (CEFR).`;
    } else {
      overallScoreText = `Overall Estimated Score: ${scoreStr} / 100`;
      const numScore = parseInt(scoreStr) || 0;
      
      let grade = "Ausreichend (Sufficient)";
      if (numScore >= 90) grade = "Sehr Gut (Excellent)";
      else if (numScore >= 80) grade = "Gut (Good)";
      else if (numScore >= 70) grade = "Befriedigend (Satisfactory)";
      
      evaluationContext = `Achieved Proficiency Category: ${grade}. Standardized to CEFR German linguistic frameworks.`;
    }
  }

  // Affirmation
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(71, 85, 105);
  pdf.text("for outstanding dedication and validated competence in successfully completing the", centerX, 107, { align: "center" });

  // Examination title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(15, 23, 42);
  pdf.text(testTitle, centerX, 114, { align: "center" });

  // Band / Point Outcome
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.setTextColor(5, 150, 105); // emerald green
  pdf.text(overallScoreText, centerX, 124, { align: "center" });

  // Methodology subtitle details
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text(evaluationContext, centerX, 130, { align: "center" });

  // 9. Date and Verification Details block
  const dateToUse = dateString || new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const uniqueHash = Math.abs(candidateName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + Date.now()).toString(16).toUpperCase().substring(0, 4);
  const certId = `LW-${testType === 'German' ? 'GER' : testType}-${uniqueHash}-${Math.floor(1000 + Math.random() * 9000)}`;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text(`Awarded on: ${dateToUse}`, centerX - 60, 144, { align: "center" });
  pdf.text(`Credential ID Verification No: ${certId}`, centerX + 60, 144, { align: "center" });

  // 10. Center Medallion Seal (Graphic Gold Stamp Design)
  pdf.setFillColor(212, 175, 55);
  pdf.circle(centerX, 169, 13, "F");

  pdf.setDrawColor(15, 23, 42); // slate outline
  pdf.setLineWidth(0.4);
  pdf.circle(centerX, 169, 11, "S");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(15, 23, 42);
  pdf.text("VERIFIED", centerX, 168, { align: "center" });
  pdf.text("LW PORTAL", centerX, 172, { align: "center" });

  // 11. Left Signature Line (Hanif Khan)
  pdf.setDrawColor(148, 163, 184);
  pdf.setLineWidth(0.5);
  pdf.line(40, 172, 95, 172);

  // Handwritten dynamic ink flourishes for Hanif Khan
  pdf.setDrawColor(30, 41, 59);
  pdf.setLineWidth(0.65);
  pdf.line(45, 166, 52, 160);
  pdf.line(52, 160, 58, 168);
  pdf.line(58, 168, 64, 156);
  pdf.line(64, 156, 70, 169);
  pdf.line(70, 169, 85, 162);
  pdf.line(85, 162, 42, 170); // swooshing flare back

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);
  pdf.text("Hanif Khan", 67.5, 177, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Founder & Academic Director", 67.5, 181, { align: "center" });
  pdf.text("Language World Prep, Karachi", 67.5, 185, { align: "center" });

  // 12. Right Signature Line (Examinations Board)
  pdf.setDrawColor(148, 163, 184);
  pdf.setLineWidth(0.5);
  pdf.line(width - 95, 172, width - 40, 172);

  // Assessor cursive flourishes
  pdf.setDrawColor(30, 58, 138);
  pdf.setLineWidth(0.65);
  pdf.line(width - 80, 166, width - 72, 158);
  pdf.line(width - 72, 158, width - 68, 167);
  pdf.line(width - 68, 167, width - 62, 155);
  pdf.line(width - 62, 155, width - 55, 169);
  pdf.line(width - 55, 169, width - 42, 160);
  pdf.line(width - 42, 160, width - 82, 171); // swirl tail

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);
  pdf.text("Examinations Council", width - 67.5, 177, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Lead Assessor & Verifier", width - 67.5, 181, { align: "center" });
  pdf.text("Standards Assurance Board", width - 67.5, 185, { align: "center" });

  return pdf;
}
