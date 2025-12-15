/**
 * Utility functions for parsing and extracting information from text
 */

export function splitIntoSentences(text: string): string[] {
  const cleaned = text.trim().replace(/\s+/g, " ");
  let sentences = cleaned.split(/[.!?]\s+/);
  
  if (sentences.length === 1) {
    sentences = cleaned.split(/,\s+/);
  }
  
  if (sentences.length === 1) {
    sentences = cleaned.split(/\n+/);
  }
  
  return sentences
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function extractListAfterKeyword(
  text: string
): { keyword: string; items: string[] } | null {
  const keywords = [
    "layers:", "types:", "components:", "includes:", "contains:",
    "entities:", "attributes:", "relationships:", "classes:", "methods:",
    "use cases:", "scenarios:", "devices:", "processes:", "steps:",
    "items:", "elements:", "parts:", "features:", "functions:",
    "nodes:", "servers:", "hosts:", "routers:", "switches:",
  ];
  const lowerText = text.toLowerCase();

  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      const afterKeyword = text.substring(index + keyword.length).trim();
      let items = afterKeyword.split(/[,;]/).map((item) => item.trim());
      
      if (items.length === 1 && /^\d+[\.\)]\s/.test(items[0])) {
        items = afterKeyword.split(/\d+[\.\)]\s+/).filter(item => item.trim().length > 0);
      }
      
      items = items
        .map(item => item.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter((item) => item.length > 0 && item.length < 100)
        .slice(0, 20);
      
      if (items.length > 0) {
        return { keyword: keyword.replace(":", ""), items };
      }
    }
  }

  const hasPattern = /(\w+)\s+has\s+([^\.]+)/i;
  const hasMatch = text.match(hasPattern);
  if (hasMatch && hasMatch[2]) {
    const items = hasMatch[2].split(/[,;]/).map(item => item.trim()).filter(item => item.length > 0);
    if (items.length > 0) {
      return { keyword: "has", items };
    }
  }

  const consistsPattern = /(\w+)\s+consists\s+of\s+([^\.]+)/i;
  const consistsMatch = text.match(consistsPattern);
  if (consistsMatch && consistsMatch[2]) {
    const items = consistsMatch[2].split(/[,;]/).map(item => item.trim()).filter(item => item.length > 0);
    if (items.length > 0) {
      return { keyword: "consists of", items };
    }
  }

  return null;
}

export function extractMainConcept(text: string): string {
  const firstSentence = splitIntoSentences(text)[0] || text;
  const colonIndex = firstSentence.indexOf(":");
  if (colonIndex !== -1) {
    return firstSentence.substring(0, colonIndex).trim();
  }
  const words = firstSentence.split(/\s+/);
  return words.slice(0, 5).join(" ");
}

export function extractMinimalLabel(text: string, maxWords: number = 4): string {
  const fillerWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "should",
    "could", "may", "might", "must", "can", "this", "that", "these", "those",
    "it", "its", "they", "them", "their", "there", "here", "where", "when",
    "what", "which", "who", "how", "why", "to", "of", "in", "on", "at", "by",
    "for", "with", "from", "as", "and", "or", "but", "if", "then", "so",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !fillerWords.has(word));

  const importantWords = words
    .filter((word, index) => {
      const originalWords = text.split(/\s+/);
      const originalWord = originalWords[index] || "";
      return originalWord[0] === originalWord[0]?.toUpperCase() || index < 3;
    })
    .slice(0, maxWords);

  const result = importantWords.length > 0
    ? importantWords
    : words.slice(0, maxWords);

  return result
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || text.substring(0, 30);
}

export function hasDecisionKeywords(text: string): boolean {
  const decisionKeywords = ["if", "else", "condition", "decision", "check", "verify", "whether"];
  const lowerText = text.toLowerCase();
  return decisionKeywords.some((keyword) => lowerText.includes(keyword));
}

