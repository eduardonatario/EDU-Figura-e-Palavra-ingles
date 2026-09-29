import { speakEnglishWord } from './speech';

let currentAudio: HTMLAudioElement | null = null;

/**
 * Plays custom MP3 audio URL if provided, with automatic fallback to Web Speech API.
 */
export async function playPronunciationAudio(
  audioUrl?: string,
  targetWord?: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }

  if (audioUrl && audioUrl.trim()) {
    try {
      const audio = new Audio(audioUrl.trim());
      currentAudio = audio;
      if (onStart) onStart();

      audio.onended = () => {
        if (currentAudio === audio) currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        if (currentAudio === audio) currentAudio = null;
        // Fallback to speech synthesis if audio file fails to load
        if (targetWord) {
          speakEnglishWord(targetWord);
        }
        if (onEnd) onEnd();
      };

      await audio.play();
      return;
    } catch (err) {
      console.warn('Custom audio playback failed, falling back to speech synthesis:', err);
    }
  }

  // Fallback: SpeechSynthesis (Native TTS)
  if (targetWord) {
    if (onStart) onStart();
    speakEnglishWord(targetWord);
    setTimeout(() => {
      if (onEnd) onEnd();
    }, 1200);
  }
}

/**
 * Stops any actively playing custom audio.
 */
export function stopPronunciationAudio(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
}

/**
 * Converts a local audio file (MP3, WAV, OGG, AAC) into a Base64 Data URL for embedding into HTML.
 */
export function convertAudioFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('audio/')) {
      return reject(new Error('Selected file is not an audio format.'));
    }

    // Limit audio file size to 3MB to avoid bloat
    if (file.size > 3 * 1024 * 1024) {
      return reject(new Error('Audio file exceeds 3MB limit. Please choose a smaller MP3 clip.'));
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert audio file to Base64.'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Fetches an external audio URL and converts it into a Base64 Data URL.
 */
export async function fetchAudioUrlToDataUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert fetched audio to Base64.'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    throw new Error('Could not fetch audio directly (CORS restricted). You can upload the MP3 file directly.');
  }
}
