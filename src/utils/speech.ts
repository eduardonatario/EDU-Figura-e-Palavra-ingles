/**
 * Text-to-Speech pronunciation helper using Web Speech API.
 * Uses native en-US or en-GB voices.
 */
export function speakEnglishWord(word: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any prior queued utterances
  window.speechSynthesis.cancel();

  const cleanWord = word.trim();
  if (!cleanWord) return;

  const utterance = new SpeechSynthesisUtterance(cleanWord);
  utterance.lang = 'en-US';
  utterance.rate = 0.9; // Slightly slower for clear educational enunciations
  utterance.pitch = 1.0;

  // Attempt to select an authentic English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
}
