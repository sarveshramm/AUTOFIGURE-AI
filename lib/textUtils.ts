/**
 * Utility functions for parsing and extracting information from text
 */

/**
 * Split text into sentences, handling periods, commas, and newlines
 */
export function splitIntoSentences(text: string): string[] {
  // Remove extra whitespace and split by common delimiters
  const cleaned = text.trim().replace(/\s+/g, " ");
  
  // Split by periods, exclamation marks, or question marks followed by space
  let sentences = cleaned.split(/[.!?]\s+/);
  
  // If no sentences found, try splitting by commas
  if (sentences.length === 1) {
    sentences = cleaned.split(/,\s+/);
  }
  
  // If still only one item, try splitting by newlines
  if (sentences.length === 1) {
    sentences = cleaned.split(/\n+/);
  }
  
  // Filter out empty strings and trim each sentence
  return sentences
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Extract list items after keywords like "layers:", "types:", "components:"
 * Returns the keyword and the list items
 */
export function extractListAfterKeyword(
  text: string
): { keyword: string; items: string[] } | null {
  const keywords = ["layers:", "types:", "components:", "includes:", "contains:"];
  const lowerText = text.toLowerCase();

  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      // Get text after the keyword
      const afterKeyword = text.substring(index + keyword.length).trim();
      
      // Try to extract a list (comma-separated or semicolon-separated)
      let items = afterKeyword.split(/[,;]/).map((item) => item.trim());
      
      // Filter out empty items and limit to reasonable number
      items = items.filter((item) => item.length > 0).slice(0, 20);
      
      if (items.length > 0) {
        return { keyword: keyword.replace(":", ""), items };
      }
    }
  }

  return null;
}

/**
 * Extract the main concept/title from the first sentence
 * Usually the first few words before a colon or before list keywords
 */
export function extractMainConcept(text: string): string {
  const firstSentence = splitIntoSentences(text)[0] || text;
  
  // If there's a colon, take the part before it
  const colonIndex = firstSentence.indexOf(":");
  if (colonIndex !== -1) {
    return firstSentence.substring(0, colonIndex).trim();
  }
  
  // Otherwise, take first few words (up to 5 words)
  const words = firstSentence.split(/\s+/);
  return words.slice(0, 5).join(" ");
}

/**
 * Minimal wording filter - extracts key words/phrases from text
 * Removes filler words and keeps only important nouns and verbs
 * Returns a short, concise label for diagram nodes
 */
export function extractMinimalLabel(text: string, maxWords: number = 4): string {
  // Common filler words to remove
  const fillerWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "should",
    "could", "may", "might", "must", "can", "this", "that", "these", "those",
    "it", "its", "they", "them", "their", "there", "here", "where", "when",
    "what", "which", "who", "how", "why", "to", "of", "in", "on", "at", "by",
    "for", "with", "from", "as", "and", "or", "but", "if", "then", "so",
  ]);

  // Split into words and filter
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length > 0 && !fillerWords.has(word));

  // Take important words (prioritize capitalized words, then first words)
  const importantWords = words
    .filter((word, index) => {
      // Keep capitalized words from original text
      const originalWords = text.split(/\s+/);
      const originalWord = originalWords[index] || "";
      return originalWord[0] === originalWord[0]?.toUpperCase() || index < 3;
    })
    .slice(0, maxWords);

  // If we have important words, use them; otherwise use first non-filler words
  const result = importantWords.length > 0
    ? importantWords
    : words.slice(0, maxWords);

  // Capitalize first letter of each word and join
  return result
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || text.substring(0, 30);
}

/**
 * Detect if text contains decision/conditional keywords
 */
export function hasDecisionKeywords(text: string): boolean {
  const decisionKeywords = ["if", "else", "condition", "decision", "check", "verify", "whether"];
  const lowerText = text.toLowerCase();
  return decisionKeywords.some((keyword) => lowerText.includes(keyword));
}


