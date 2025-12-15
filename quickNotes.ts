/**
 * Quick Notes Generator
 * Converts paragraphs into simple, concise notes without changing meaning
 */

export function generateQuickNotes(paragraph: string): string {
  if (!paragraph || paragraph.trim().length === 0) {
    return "";
  }

  // Remove extra whitespace
  let text = paragraph.trim().replace(/\s+/g, " ");

  // Split into sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Process each sentence into bullet points
  const notes: string[] = [];

  sentences.forEach((sentence) => {
    const trimmed = sentence.trim();
    if (trimmed.length === 0) return;

    // Remove filler phrases
    let note = trimmed
      .replace(/^(it is|this is|that is|there is|there are|we have|we can|you can|one can)\s+/gi, "")
      .replace(/\s+(is|are|was|were|be|been|being)\s+/gi, " ")
      .replace(/\s+(the|a|an)\s+/gi, " ")
      .replace(/\s+(and|or|but|so|then|also|too|as well)\s+/gi, " ")
      .trim();

    // Capitalize first letter
    note = note.charAt(0).toUpperCase() + note.slice(1);

    // Extract key points (remove redundant words)
    const keyWords = extractKeyWords(note);
    
    // Create bullet point
    if (keyWords.length > 0) {
      notes.push(`• ${keyWords.join(" ")}`);
    } else if (note.length > 0) {
      notes.push(`• ${note}`);
    }
  });

  // If no notes generated, create a simplified version
  if (notes.length === 0) {
    const simplified = simplifyText(paragraph);
    return `• ${simplified}`;
  }

  return notes.join("\n");
}

function extractKeyWords(text: string): string[] {
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
    .filter(word => word.length > 0 && !fillerWords.has(word))
    .slice(0, 8); // Limit to 8 key words

  return words;
}

function simplifyText(text: string): string {
  // Remove redundant phrases
  let simplified = text
    .replace(/\s+/g, " ")
    .replace(/(\w+)\s+\1/gi, "$1") // Remove duplicate words
    .trim();

  // Limit length
  if (simplified.length > 100) {
    simplified = simplified.substring(0, 97) + "...";
  }

  return simplified;
}

