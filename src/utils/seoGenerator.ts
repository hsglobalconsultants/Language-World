/**
 * SEO Metadata Generator Utility
 * Generates high-quality Meta Descriptions and Keywords for blog posts dynamically.
 * Standardizes sizes to maximize Google and social search rankings.
 */

// Common English and German stopwords to filter out for keyword extraction
const STOP_WORDS = new Set([
  "the", "and", "a", "an", "of", "to", "in", "is", "that", "it", "on", "for", "with", "this", "by", "as", "at", "from",
  "are", "be", "was", "were", "or", "but", "not", "your", "our", "their", "will", "can", "has", "have", "had", "would",
  "should", "how", "why", "what", "where", "who", "which", "about", "more", "some", "any", "other", "into", "than",
  "der", "die", "das", "und", "ist", "in", "für", "mit", "von", "ein", "eine", "einen", "einem", "einer", "zu", "auf",
  "dem", "den", "des", "im", "als", "auch", "sich", "nach", "aus", "um", "wir", "sie", "ihr", "es", "das"
]);

// Map of standard local-focused and CEFR-focused keywords based on blog category tags
const TAG_KEYWORD_MAP: Record<string, string[]> = {
  "German": [
    "German language course in Karachi",
    "German language institute in Karachi",
    "Learn German Karachi",
    "German A1 course Karachi",
    "German A2 course Karachi",
    "German B1 course Karachi",
    "German visa Pakistan",
    "Goethe exam preparation Karachi",
    "Ausbildung Germany Pakistan",
    "Learn German in Gulshan-e-Iqbal",
    "Language World Karachi German"
  ],
  "IELTS": [
    "IELTS preparation Karachi",
    "IELTS course Karachi",
    "IELTS reading tips",
    "IELTS speaking Karachi",
    "IELTS 8.0 score",
    "Language World IELTS",
    "Best IELTS center Karachi",
    "IELTS coaching Pakistan"
  ],
  "PTE": [
    "PTE preparation Karachi",
    "PTE exam center Karachi",
    "PTE vs IELTS guidance",
    "Pearson Test of English Pakistan",
    "Language World PTE"
  ],
  "Visa": [
    "German visa Pakistan",
    "Study visa Germany",
    "Germany visa guide Karachi",
    "Blocked account Germany Pakistan",
    "Ausbildung visa Pakistan",
    "Family reunion visa Germany"
  ],
  "Study Abroad": [
    "Study abroad consultants Karachi",
    "Study in UK Pakistan",
    "Study in Australia Pakistan",
    "Student visa counseling Karachi",
    "Language World study abroad"
  ],
  "Business": [
    "Business communication skills",
    "Professional English Karachi",
    "Corporate training classes",
    "Business English Pakistan",
    "Soft skills Karachi"
  ],
  "English": [
    "English speaking course Karachi",
    "Spoken English Karachi",
    "English grammar classes",
    "Learn English Karachi",
    "Best English language institute Karachi"
  ]
};

/**
 * Strips all HTML tags and formats whitespace to return clean plain text.
 */
export function stripHtml(htmlStr: string): string {
  if (!htmlStr) return "";
  // Simple regex to strip HTML tags safely
  const clean = htmlStr.replace(/<[^>]*>/g, " ");
  // Replace multiple spaces/newlines with single space
  return clean.replace(/\s+/g, " ").trim();
}

/**
 * Generates a clean meta description under Google's 160-character recommended limit.
 * Tries to extract the first complete sentence, then appends a call to action if there is space.
 */
export function generateMetaDescription(title: string, content: string, excerpt?: string): string {
  const cleanExcerpt = excerpt ? stripHtml(excerpt) : "";
  const cleanContent = stripHtml(content);

  // Preference order: 1. Clean Excerpt, 2. Clean Content start, 3. Title fallback
  let baseText = cleanExcerpt || cleanContent || title;

  if (baseText.length < 50 && cleanContent) {
    baseText = cleanContent;
  }

  // Trim to around 135 characters to leave room for brand
  let desc = baseText.substring(0, 135).trim();
  
  // Try to cut at a complete word boundary
  const lastSpace = desc.lastIndexOf(" ");
  if (lastSpace > 100) {
    desc = desc.substring(0, lastSpace);
  }

  // Ensure it has punctuation or ends cleanly
  if (!desc.endsWith(".") && !desc.endsWith("!") && !desc.endsWith("?")) {
    desc += "...";
  }

  // Append context-rich brand suffix with remaining space
  const branding = " Learn at Language World Karachi.";
  if (desc.length + branding.length <= 160) {
    desc += branding;
  } else {
    const backupBranding = " | Language World";
    if (desc.length + backupBranding.length <= 160) {
      desc += backupBranding;
    }
  }

  return desc;
}

/**
 * Extracts key themes and nouns from content and merges with tailored preset keywords
 */
export function generateKeywords(title: string, content: string, tag: string): string {
  const keywordsSet = new Set<string>();

  // 1. Add preset category keywords first (they are heavily optimized)
  const normalizedTag = Object.keys(TAG_KEYWORD_MAP).find(
    k => k.toLowerCase() === tag.toLowerCase()
  ) || tag;

  const presetKeywords = TAG_KEYWORD_MAP[normalizedTag] || [
    "Language World Pakistan",
    "Language World Karachi",
    "Learn languages Karachi",
    "Best language institute Karachi"
  ];

  presetKeywords.forEach(k => keywordsSet.add(k));

  // 2. Add brand-critical keywords
  keywordsSet.add("Language World Pakistan");
  keywordsSet.add("Language World Karachi");
  keywordsSet.add("Language World Gulshan");

  // 3. Extract words from Title
  const cleanTitle = title.replace(/[^\w\s-]/g, "").toLowerCase();
  const titleWords = cleanTitle.split(/\s+/);
  
  // Extract custom chunks from Title (e.g. 2-3 word phrases if possible, or high quality nouns)
  titleWords.forEach(word => {
    if (word.length > 3 && !STOP_WORDS.has(word)) {
      keywordsSet.add(word);
    }
  });

  // 4. Extract candidates from content
  const cleanContentText = stripHtml(content).toLowerCase().replace(/[^\w\s-]/g, " ");
  const contentWords = cleanContentText.split(/\s+/);
  
  const wordCounts: Record<string, number> = {};
  contentWords.forEach(word => {
    if (word.length > 4 && !STOP_WORDS.has(word) && isNaN(Number(word))) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  // Sort words by count to find key topics
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);

  // Merge top relevant extracted content words
  sortedWords.forEach(word => {
    // Only add if we don't exceed a healthy keyword count
    if (keywordsSet.size < 18) {
      keywordsSet.add(word);
    }
  });

  // Convert set to comma separated list
  return Array.from(keywordsSet).join(", ");
}
