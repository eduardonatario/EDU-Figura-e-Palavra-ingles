import { Flashcard, WidgetConfig } from '../types';

export const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'card-1',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'A crisp red apple on a neutral surface',
    targetWord: 'Apple',
    acceptableAnswers: ['Red apple', 'An apple'],
    translationPt: 'Maçã',
    phonetic: '/ˈæp.əl/',
    hint: 'A round fruit with red or green skin and a firm white flesh.',
    exampleSentence: 'An apple a day keeps the doctor away.',
  },
  {
    id: 'card-2',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'A vintage commuter bicycle',
    targetWord: 'Bicycle',
    acceptableAnswers: ['Bike', 'Vintage bicycle'],
    translationPt: 'Bicicleta',
    phonetic: '/ˈbaɪ.sɪ.kəl/',
    hint: 'A vehicle with two wheels, pedals, and handlebars.',
    exampleSentence: 'He rides his bicycle to the park every morning.',
  },
  {
    id: 'card-3',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'A ceramic cup of coffee with latte art',
    targetWord: 'Coffee',
    acceptableAnswers: ['Cup of coffee', 'Latte', 'A cup of coffee'],
    translationPt: 'Café',
    phonetic: '/ˈkɒf.i/',
    hint: 'A popular hot brewed drink made from roasted beans.',
    exampleSentence: 'I enjoy drinking a hot cup of coffee with breakfast.',
  },
];

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  title: 'Image and Word',
  subtitle: 'Look at the image and write the corresponding word in English.',
  theme: 'minimal-light',
  language: 'en',
  showAudio: true,
  showHintButton: true,
  showTranslationOnSuccess: true,
  caseSensitive: false,
  enableSoundEffects: true,
  showProgressBar: true,
  showHeaderTexts: true,
  showSlideCounter: true,
};
