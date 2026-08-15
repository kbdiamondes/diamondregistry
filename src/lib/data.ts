/**
 * Redact a name: first character visible, rest replaced with *
 * Single-character names stay as-is.
 */
export function redactName(firstName: string, lastName: string): string {
  const redactWord = (word: string): string => {
    if (word.length <= 1) return word;
    return word[0] + "*".repeat(word.length - 1);
  };
  return `${redactWord(firstName)} ${redactWord(lastName)}`;
}
