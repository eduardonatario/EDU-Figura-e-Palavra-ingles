export interface Flashcard {
  id: string;
  imageUrl: string;
  imageAlt: string;
  targetWord: string;
  audioUrl?: string;
  acceptableAnswers?: string[];
  translationPt?: string;
  phonetic?: string;
  hint?: string;
  exampleSentence?: string;
}

export type WidgetTheme = 'minimal-light' | 'clean-dark' | 'warm-paper' | 'modern-slate';

export type WidgetLanguage = 'pt' | 'en';

export interface WidgetConfig {
  title: string;
  subtitle: string;
  theme: WidgetTheme;
  language: WidgetLanguage;
  showAudio: boolean;
  showHintButton: boolean;
  showTranslationOnSuccess: boolean;
  caseSensitive: boolean;
  enableSoundEffects: boolean;
  showProgressBar: boolean;
  showHeaderTexts?: boolean;
  showSlideCounter?: boolean;
}

export type ActiveTab = 'editor' | 'study' | 'embed';
