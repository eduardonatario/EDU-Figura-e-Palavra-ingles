import { Flashcard, WidgetConfig } from '../types';
import { resolveImageUrl } from './imageHelper';

export function generateWidgetHtml(cards: Flashcard[], config: WidgetConfig): string {
  const isEn = config.language === 'en';

  // Ensure every card has a resolved absolute URL and preserves custom audio
  const processedCards = cards.map((c) => ({
    id: c.id,
    imageUrl: resolveImageUrl(c.imageUrl),
    imageAlt: c.imageAlt || c.targetWord || (isEn ? 'Study image' : 'Figura para estudo'),
    targetWord: c.targetWord || '',
    audioUrl: c.audioUrl || '',
    acceptableAnswers: c.acceptableAnswers || [],
    translationPt: c.translationPt || '',
    phonetic: c.phonetic || '',
    hint: c.hint || '',
    exampleSentence: c.exampleSentence || '',
  }));

  const firstCard = processedCards[0] || {
    id: 'card-1',
    imageUrl: '',
    imageAlt: '',
    targetWord: '',
    audioUrl: '',
    acceptableAnswers: [],
    translationPt: '',
    phonetic: '',
    hint: '',
    exampleSentence: '',
  };

  const initialImageSrc = firstCard.imageUrl || '';
  const displayTitle = config.title || (isEn ? 'Image and Word' : 'Figura e Palavra');
  const displaySubtitle = config.subtitle || (isEn ? 'Look at the image and write the corresponding word in English.' : 'Observe a imagem e escreva a palavra correspondente em inglês.');

  // Theme styling definitions
  const themes = {
    'minimal-light': {
      bg: '#fcfbf9',
      cardBg: '#ffffff',
      border: '#e7e5e4',
      text: '#1c1917',
      mutedText: '#78716c',
      accent: '#2563eb',
      accentHover: '#1d4ed8',
      accentText: '#ffffff',
      inputBorder: '#d6d3d1',
      inputFocusBorder: '#2563eb',
      successBg: '#f0fdf4',
      successBorder: '#bbf7d0',
      successText: '#15803d',
      errorBg: '#fef2f2',
      errorBorder: '#fecaca',
      errorText: '#b91c1c',
      shadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    },
    'clean-dark': {
      bg: '#0f172a',
      cardBg: '#1e293b',
      border: '#334155',
      text: '#f8fafc',
      mutedText: '#94a3b8',
      accent: '#38bdf8',
      accentHover: '#0284c7',
      accentText: '#0f172a',
      inputBorder: '#475569',
      inputFocusBorder: '#38bdf8',
      successBg: '#052e16',
      successBorder: '#166534',
      successText: '#4ade80',
      errorBg: '#450a0a',
      errorBorder: '#991b1b',
      errorText: '#f87171',
      shadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    },
    'warm-paper': {
      bg: '#f5f0e6',
      cardBg: '#faf7f2',
      border: '#e3dbce',
      text: '#2c2523',
      mutedText: '#877c75',
      accent: '#854d0e',
      accentHover: '#713f12',
      accentText: '#ffffff',
      inputBorder: '#d5cbbd',
      inputFocusBorder: '#854d0e',
      successBg: '#f2f8f3',
      successBorder: '#c4e3cb',
      successText: '#2e6b3b',
      errorBg: '#fdf2f2',
      errorBorder: '#e8c4c4',
      errorText: '#943333',
      shadow: '0 4px 24px -4px rgba(60, 40, 20, 0.08)',
    },
    'modern-slate': {
      bg: '#f1f5f9',
      cardBg: '#ffffff',
      border: '#cbd5e1',
      text: '#0f172a',
      mutedText: '#64748b',
      accent: '#2563eb',
      accentHover: '#1d4ed8',
      accentText: '#ffffff',
      inputBorder: '#cbd5e1',
      inputFocusBorder: '#2563eb',
      successBg: '#ecfdf5',
      successBorder: '#a7f3d0',
      successText: '#047857',
      errorBg: '#fef2f2',
      errorBorder: '#fecaca',
      errorText: '#b91c1c',
      shadow: '0 6px 25px -4px rgba(15, 23, 42, 0.07)',
    },
  };

  const theme = themes[config.theme] || themes['minimal-light'];
  const serializedCards = JSON.stringify(processedCards);
  const serializedConfig = JSON.stringify(config);

  return `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'pt-BR'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(displayTitle)}</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --fep-bg: ${theme.bg};
      --fep-card-bg: ${theme.cardBg};
      --fep-border: ${theme.border};
      --fep-text: ${theme.text};
      --fep-muted: ${theme.mutedText};
      --fep-accent: ${theme.accent};
      --fep-accent-hover: ${theme.accentHover};
      --fep-accent-text: ${theme.accentText};
      --fep-input-border: ${theme.inputBorder};
      --fep-input-focus: ${theme.inputFocusBorder};
      --fep-success-bg: ${theme.successBg};
      --fep-success-border: ${theme.successBorder};
      --fep-success-text: ${theme.successText};
      --fep-error-bg: ${theme.errorBg};
      --fep-error-border: ${theme.errorBorder};
      --fep-error-text: ${theme.errorText};
      --fep-shadow: ${theme.shadow};
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background: var(--fep-bg);
      color: var(--fep-text);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px 16px;
      -webkit-font-smoothing: antialiased;
    }

    .fep-widget {
      width: 100%;
      max-width: 480px;
      background: var(--fep-card-bg);
      border: 1px solid var(--fep-border);
      border-radius: 20px;
      box-shadow: var(--fep-shadow);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      overflow: hidden;
      transition: all 0.25s ease;
    }

    .fep-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding-bottom: 8px;
    }

    .fep-title-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .fep-title {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: var(--fep-text);
    }

    .fep-subtitle {
      font-size: 12px;
      color: var(--fep-muted);
    }

    .fep-counter {
      font-size: 12px;
      font-weight: 600;
      color: var(--fep-muted);
      font-variant-numeric: tabular-nums;
      background: rgba(120, 113, 108, 0.08);
      padding: 4px 10px;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .fep-progress-bar {
      height: 4px;
      background: rgba(120, 113, 108, 0.12);
      border-radius: 999px;
      overflow: hidden;
      width: 100%;
    }

    .fep-progress-fill {
      height: 100%;
      background: var(--fep-accent);
      border-radius: 999px;
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .fep-image-container {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      border-radius: 14px;
      overflow: hidden;
      background: rgba(120, 113, 108, 0.05);
      border: 1px solid var(--fep-border);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fep-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }

    .fep-image:hover {
      transform: scale(1.02);
    }

    .fep-image-fallback {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--fep-muted);
      font-size: 13px;
      text-align: center;
      padding: 16px;
    }

    .fep-audio-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1c1917;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      transition: transform 0.15s ease, background 0.15s ease;
      z-index: 10;
    }

    .fep-audio-btn:hover {
      transform: scale(1.08);
      background: #ffffff;
    }

    .fep-audio-btn:active {
      transform: scale(0.95);
    }

    .fep-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .fep-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .fep-input {
      width: 100%;
      font-family: inherit;
      font-size: 16px;
      font-weight: 500;
      color: var(--fep-text);
      background: var(--fep-card-bg);
      border: 1.5px solid var(--fep-input-border);
      border-radius: 12px;
      padding: 12px 14px;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .fep-input:focus {
      border-color: var(--fep-input-focus);
      box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
    }

    .fep-input.fep-shake {
      animation: fepShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    @keyframes fepShake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }

    .fep-actions {
      display: flex;
      gap: 8px;
    }

    .fep-btn {
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      border-radius: 12px;
      padding: 12px 18px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease;
      border: none;
      white-space: nowrap;
      user-select: none;
    }

    .fep-btn-primary {
      flex: 1;
      background: var(--fep-accent);
      color: var(--fep-accent-text);
    }

    .fep-btn-primary:hover {
      background: var(--fep-accent-hover);
    }

    .fep-btn-primary:active {
      transform: scale(0.98);
    }

    .fep-btn-secondary {
      background: transparent;
      border: 1px solid var(--fep-border);
      color: var(--fep-text);
    }

    .fep-btn-secondary:hover {
      background: rgba(120, 113, 108, 0.07);
    }

    .fep-feedback {
      display: none;
      padding: 12px 14px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.4;
      animation: fepFadeIn 0.2s ease forwards;
    }

    .fep-feedback.fep-success {
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: var(--fep-success-bg);
      border: 1px solid var(--fep-success-border);
      color: var(--fep-success-text);
    }

    .fep-feedback.fep-error {
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: var(--fep-error-bg);
      border: 1px solid var(--fep-error-border);
      color: var(--fep-error-text);
    }

    .fep-feedback-title {
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .fep-feedback-detail {
      font-size: 12px;
      opacity: 0.9;
    }

    .fep-hint-box {
      display: none;
      padding: 10px 14px;
      border-radius: 10px;
      background: rgba(120, 113, 108, 0.06);
      border: 1px dashed var(--fep-border);
      font-size: 12px;
      color: var(--fep-muted);
      line-height: 1.4;
    }

    .fep-nav-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid rgba(120, 113, 108, 0.1);
    }

    .fep-nav-btn {
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      color: var(--fep-muted);
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 8px;
      border-radius: 8px;
      transition: color 0.15s ease, background 0.15s ease;
    }

    .fep-nav-btn:hover:not(:disabled) {
      color: var(--fep-text);
      background: rgba(120, 113, 108, 0.08);
    }

    .fep-nav-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .fep-completion {
      display: none;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
      padding: 24px 8px;
    }

    .fep-completion-badge {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--fep-success-bg);
      border: 2px solid var(--fep-success-border);
      color: var(--fep-success-text);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fep-completion-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--fep-text);
    }

    .fep-completion-desc {
      font-size: 14px;
      color: var(--fep-muted);
      max-width: 320px;
    }

    .fep-stats {
      display: flex;
      gap: 16px;
      font-size: 13px;
      margin: 8px 0;
    }

    .fep-stat-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .fep-stat-num {
      font-size: 20px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--fep-text);
    }

    .fep-stat-label {
      font-size: 11px;
      color: var(--fep-muted);
    }

    @keyframes fepFadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

  <div class="fep-widget" id="fepWidget">
    <!-- Header -->
    ${(config.showHeaderTexts !== false || config.showSlideCounter !== false) ? `
    <div class="fep-header" id="fepHeader">
      <div class="fep-title-wrap">
        ${config.showHeaderTexts !== false ? `
          <h2 class="fep-title">${escapeHtml(displayTitle)}</h2>
          ${displaySubtitle ? `<span class="fep-subtitle">${escapeHtml(displaySubtitle)}</span>` : ''}
        ` : ''}
      </div>
      ${config.showSlideCounter !== false ? `<div class="fep-counter" id="fepCounter">1 / ${cards.length}</div>` : ''}
    </div>
    ` : ''}

    <!-- Progress Bar -->
    ${config.showProgressBar ? `
    <div class="fep-progress-bar">
      <div class="fep-progress-fill" id="fepProgressFill" style="width: ${Math.round((1 / cards.length) * 100)}%;"></div>
    </div>
    ` : ''}

    <!-- Active Card View -->
    <div id="fepCardView" style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Image Container -->
      <div class="fep-image-container">
        <img
          class="fep-image"
          id="fepImage"
          src="${escapeHtml(initialImageSrc)}"
          alt="${escapeHtml(firstCard.imageAlt || firstCard.targetWord || (isEn ? 'Study image' : 'Figura para estudo'))}"
          style="${initialImageSrc ? 'display: block;' : 'display: none;'}"
        >
        <div class="fep-image-fallback" id="fepFallback" style="${initialImageSrc ? 'display: none;' : 'display: flex;'}">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <span>${isEn ? 'Study image' : 'Imagem de estudo'}</span>
        </div>

        ${config.showAudio ? `
        <button type="button" class="fep-audio-btn" id="fepAudioBtn" title="${isEn ? 'Listen to English pronunciation' : 'Ouvir pronúncia em inglês'}" aria-label="Audio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </button>
        ` : ''}
      </div>

      <!-- Hint Box -->
      <div class="fep-hint-box" id="fepHintBox"></div>

      <!-- Input Form -->
      <form class="fep-form" id="fepForm">
        <div class="fep-input-wrap">
          <input
            type="text"
            class="fep-input"
            id="fepInput"
            placeholder="${isEn ? 'What is the name in English?' : 'Qual é o nome em inglês?'}"
            autocomplete="off"
            spellcheck="false"
          />
        </div>

        <!-- Feedback Alert -->
        <div class="fep-feedback" id="fepFeedback">
          <div class="fep-feedback-title" id="fepFeedbackTitle"></div>
          <div class="fep-feedback-detail" id="fepFeedbackDetail"></div>
        </div>

        <div class="fep-actions">
          <button type="submit" class="fep-btn fep-btn-primary" id="fepSubmitBtn">
            ${isEn ? 'Check Answer' : 'Verificar Resposta'}
          </button>
          ${config.showHintButton ? `
          <button type="button" class="fep-btn fep-btn-secondary" id="fepHintBtn" title="${isEn ? 'Tip' : 'Ver dica'}">
            ${isEn ? 'Tip' : 'Dica'}
          </button>
          ` : ''}
        </div>
      </form>

      <!-- Navigation & Skip -->
      <div class="fep-nav-controls">
        <button type="button" class="fep-nav-btn" id="fepPrevBtn">
          ${isEn ? 'Previous' : 'Anterior'}
        </button>
        <button type="button" class="fep-nav-btn" id="fepNextBtn">
          ${isEn ? 'Next' : 'Próximo'}
        </button>
      </div>
    </div>

    <!-- Completion Screen -->
    <div class="fep-completion" id="fepCompletion">
      <div class="fep-completion-badge">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 class="fep-completion-title">${isEn ? 'Great Job!' : 'Excelente Trabalho!'}</h3>
      <p class="fep-completion-desc">${isEn ? 'You have completed all cards in this vocabulary exercise.' : 'Você completou todos os cards deste exercício de vocabulário em inglês.'}</p>
      
      <div class="fep-stats">
        <div class="fep-stat-item">
          <span class="fep-stat-num" id="fepScoreCorrect">0</span>
          <span class="fep-stat-label">${isEn ? 'Correct' : 'Acertos'}</span>
        </div>
        <div class="fep-stat-item">
          <span class="fep-stat-num" id="fepScoreAccuracy">100%</span>
          <span class="fep-stat-label">${isEn ? 'Accuracy' : 'Precisão'}</span>
        </div>
      </div>

      <button type="button" class="fep-btn fep-btn-primary" id="fepRestartBtn">
        ${isEn ? 'Practice Again' : 'Praticar Novamente'}
      </button>
    </div>
  </div>

  <script>
    (function() {
      try {
        var cards = ${serializedCards};
        var config = ${serializedConfig};
        var isEn = (config && config.language === 'en');

        var texts = {
          checkAnswer: isEn ? 'Check Answer' : 'Verificar Resposta',
          nextCard: isEn ? 'Next' : 'Avançar para o Próximo',
          viewResult: isEn ? 'View Final Result' : 'Ver Resultado Final',
          correct: isEn ? '✓ Correct! Great job!' : '✓ Correto! Parabéns!',
          mistake: isEn ? '✕ Almost there! Try again' : '✕ Quase lá! Tente novamente',
          translation: isEn ? 'Translation:' : 'Tradução:',
          lookImage: isEn ? 'Look closely at the image.' : 'Observe bem a imagem.',
          lettersCount: isEn ? 'The word has ' : 'A palavra tem ',
          lettersSuffix: isEn ? ' letters.' : ' letras.',
          tipPrefix: isEn ? '💡 Tip: ' : '💡 Dica: ',
          tipStarts: isEn ? '💡 Tip: Starts with letter "' : '💡 Dica: Começa com a letra "',
          andHas: isEn ? '" and has ' : '" e tem ',
          revealedPrefix: isEn ? '💡 Revealed letters: <strong>' : '💡 Letras reveladas: <strong>',
          meaningLabel: isEn ? '<br>Portuguese meaning: <em>' : '<br>Significado em português: <em>'
        };

        var currentIndex = 0;
        var solvedCards = {};
        var attemptsCount = 0;
        var correctCount = 0;
        var hintLevel = 0;
        var isAnsweredCorrectly = false;
        var activeAudio = null;

        // DOM Elements
        var imgEl = document.getElementById('fepImage');
        var fallbackEl = document.getElementById('fepFallback');
        var formEl = document.getElementById('fepForm');
        var inputEl = document.getElementById('fepInput');
        var counterEl = document.getElementById('fepCounter');
        var progressFill = document.getElementById('fepProgressFill');
        var feedbackEl = document.getElementById('fepFeedback');
        var feedbackTitle = document.getElementById('fepFeedbackTitle');
        var feedbackDetail = document.getElementById('fepFeedbackDetail');
        var hintBox = document.getElementById('fepHintBox');
        var hintBtn = document.getElementById('fepHintBtn');
        var prevBtn = document.getElementById('fepPrevBtn');
        var nextBtn = document.getElementById('fepNextBtn');
        var cardView = document.getElementById('fepCardView');
        var completionView = document.getElementById('fepCompletion');
        var submitBtn = document.getElementById('fepSubmitBtn');
        var audioBtn = document.getElementById('fepAudioBtn');
        var restartBtn = document.getElementById('fepRestartBtn');

        // Web Audio sound synth
        function playTone(freqs, duration) {
          if (!config || !config.enableSoundEffects) return;
          try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            var ctx = new AudioCtx();
            if (ctx.state === 'suspended') ctx.resume();
            var now = ctx.currentTime;
            freqs.forEach(function(freq, idx) {
              var osc = ctx.createOscillator();
              var gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.08);
              gain.gain.setValueAtTime(0, now + idx * 0.08);
              gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + duration);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.08);
              osc.stop(now + idx * 0.08 + duration + 0.05);
            });
          } catch(e) {}
        }

        // Voice Engine
        function speak(text) {
          if (!text) return;
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
              if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
              }
              window.speechSynthesis.cancel();
              var utter = new SpeechSynthesisUtterance(text);
              utter.lang = 'en-US';
              utter.rate = 0.85;
              
              var voices = window.speechSynthesis.getVoices();
              if (voices && voices.length) {
                for (var i = 0; i < voices.length; i++) {
                  if (voices[i].lang && voices[i].lang.toLowerCase().indexOf('en') === 0) {
                    utter.voice = voices[i];
                    break;
                  }
                }
              }
              window.__fepUtter = utter;
              window.speechSynthesis.speak(utter);
            } catch(e) {}
          }
        }

        // Comprehensive Pronunciation Player: Custom MP3/Base64 audio with SpeechSynthesis fallback
        function playCardPronunciation(card) {
          if (!card) return;
          if (activeAudio) {
            try { activeAudio.pause(); activeAudio.currentTime = 0; } catch(e) {}
            activeAudio = null;
          }

          if (card.audioUrl && card.audioUrl.trim()) {
            try {
              var audio = new Audio(card.audioUrl.trim());
              activeAudio = audio;
              audio.onended = function() { activeAudio = null; };
              audio.onerror = function() {
                activeAudio = null;
                speak(card.targetWord);
              };
              var playPromise = audio.play();
              if (playPromise && playPromise.catch) {
                playPromise.catch(function() {
                  speak(card.targetWord);
                });
              }
              return;
            } catch(err) {
              speak(card.targetWord);
              return;
            }
          }

          speak(card.targetWord);
        }

        function normalize(str) {
          if (!str) return '';
          var s = str.trim();
          if (!config || !config.caseSensitive) {
            s = s.toLowerCase();
          }
          return s.normalize ? s.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "") : s;
        }

        function loadCard(index) {
          if (index < 0 || index >= cards.length) return;
          currentIndex = index;
          isAnsweredCorrectly = false;
          var card = cards[currentIndex] || {};

          hintLevel = 0;
          if (hintBox) {
            hintBox.style.display = 'none';
            hintBox.innerHTML = '';
          }
          if (feedbackEl) {
            feedbackEl.className = 'fep-feedback';
            feedbackEl.style.display = 'none';
          }

          // Image Handling
          if (imgEl && fallbackEl) {
            if (card.imageUrl) {
              imgEl.style.display = 'block';
              fallbackEl.style.display = 'none';
              imgEl.src = card.imageUrl;
              imgEl.alt = card.imageAlt || card.targetWord || (isEn ? 'Study image' : 'Figura para estudo');
            } else {
              imgEl.style.display = 'none';
              fallbackEl.style.display = 'flex';
            }

            imgEl.onerror = function() {
              imgEl.style.display = 'none';
              fallbackEl.style.display = 'flex';
            };
          }

          // Reset Input & Submit Button
          if (inputEl) {
            inputEl.value = '';
            inputEl.disabled = false;
          }
          if (submitBtn) {
            submitBtn.textContent = texts.checkAnswer;
          }

          setTimeout(function() {
            try { if (inputEl) inputEl.focus(); } catch(e) {}
          }, 50);

          // Update Counter & Progress
          if (counterEl) {
            counterEl.textContent = (currentIndex + 1) + ' / ' + cards.length;
          }
          if (progressFill) {
            var pct = Math.round(((currentIndex + 1) / cards.length) * 100);
            progressFill.style.width = pct + '%';
          }

          // Navigation buttons state
          if (prevBtn) prevBtn.disabled = (currentIndex === 0);
          if (nextBtn) nextBtn.disabled = (currentIndex === cards.length - 1);

          if (cardView) cardView.style.display = 'flex';
          if (completionView) completionView.style.display = 'none';
        }

        function handleSubmit() {
          if (isAnsweredCorrectly) {
            if (currentIndex < cards.length - 1) {
              loadCard(currentIndex + 1);
            } else {
              showCompletion();
            }
            return;
          }

          var card = cards[currentIndex] || {};
          var val = normalize(inputEl ? inputEl.value : '');
          if (!val) {
            if (inputEl) inputEl.focus();
            return;
          }

          attemptsCount++;

          var target = normalize(card.targetWord || '');
          var acceptable = (card.acceptableAnswers || []).map(normalize);
          var isCorrect = (val === target) || (acceptable.indexOf(val) !== -1);

          if (isCorrect) {
            // SUCCESS
            correctCount++;
            solvedCards[currentIndex] = true;
            isAnsweredCorrectly = true;
            playTone([523, 659, 783], 0.35);

            if (feedbackEl) {
              feedbackEl.className = 'fep-feedback fep-success';
              feedbackEl.style.display = 'flex';
            }
            if (feedbackTitle) {
              feedbackTitle.innerHTML = texts.correct;
            }

            var detail = '<strong>' + (card.targetWord || '') + '</strong>';
            if (card.phonetic) detail += ' · <em>' + card.phonetic + '</em>';
            if (config && config.showTranslationOnSuccess && card.translationPt) {
              detail += '<br>' + texts.translation + ' ' + card.translationPt;
            }
            if (card.exampleSentence) {
              detail += '<br><em>"' + card.exampleSentence + '"</em>';
            }
            if (feedbackDetail) {
              feedbackDetail.innerHTML = detail;
            }

            // Play Pronunciation Audio
            playCardPronunciation(card);

            // Change button to advance
            if (inputEl) inputEl.disabled = true;
            if (submitBtn) {
              submitBtn.textContent = (currentIndex < cards.length - 1) ? texts.nextCard : texts.viewResult;
              submitBtn.focus();
            }
          } else {
            // MISTAKE
            playTone([240, 180], 0.25);
            if (inputEl) {
              inputEl.classList.add('fep-shake');
              setTimeout(function() { inputEl.classList.remove('fep-shake'); }, 450);
            }

            if (feedbackEl) {
              feedbackEl.className = 'fep-feedback fep-error';
              feedbackEl.style.display = 'flex';
            }
            if (feedbackTitle) {
              feedbackTitle.innerHTML = texts.mistake;
            }
            
            var tip = texts.lookImage;
            if (card.hint) {
              tip = card.hint;
            } else if (card.targetWord && card.targetWord.length) {
              tip = texts.lettersCount + card.targetWord.length + texts.lettersSuffix;
            }
            if (feedbackDetail) {
              feedbackDetail.textContent = tip;
            }
            if (inputEl) inputEl.select();
          }
        }

        function toggleHint() {
          var card = cards[currentIndex] || {};
          if (!hintBox) return;

          hintLevel++;
          hintBox.style.display = 'block';

          if (hintLevel === 1) {
            if (card.hint) {
              hintBox.textContent = texts.tipPrefix + card.hint;
            } else if (card.targetWord) {
              hintBox.textContent = texts.tipStarts + card.targetWord.charAt(0).toUpperCase() + texts.andHas + card.targetWord.length + texts.lettersSuffix;
            }
          } else {
            var word = card.targetWord || '';
            var revealed = '';
            for (var i = 0; i < word.length; i++) {
              if (i <= hintLevel || word[i] === ' ') {
                revealed += word[i];
              } else {
                revealed += ' _';
              }
            }
            hintBox.innerHTML = texts.revealedPrefix + revealed + '</strong>' + 
              (card.translationPt ? (texts.meaningLabel + card.translationPt + '</em>') : '');
          }
        }

        function showCompletion() {
          if (cardView) cardView.style.display = 'none';
          if (completionView) completionView.style.display = 'flex';
          playTone([523, 659, 783, 1046], 0.5);

          var correctEl = document.getElementById('fepScoreCorrect');
          var accuracyEl = document.getElementById('fepScoreAccuracy');

          if (correctEl) correctEl.textContent = cards.length;
          if (accuracyEl) {
            var acc = attemptsCount > 0 ? Math.round((cards.length / attemptsCount) * 100) : 100;
            accuracyEl.textContent = Math.min(100, Math.max(10, acc)) + '%';
          }
        }

        // Attach event listeners
        if (formEl) {
          formEl.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSubmit();
          });
        }

        if (hintBtn) {
          hintBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleHint();
          });
        }

        if (prevBtn) {
          prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentIndex > 0) loadCard(currentIndex - 1);
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentIndex < cards.length - 1) loadCard(currentIndex + 1);
          });
        }

        if (audioBtn) {
          audioBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var card = cards[currentIndex];
            if (card) playCardPronunciation(card);
          });
        }

        if (restartBtn) {
          restartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            solvedCards = {};
            attemptsCount = 0;
            correctCount = 0;
            loadCard(0);
          });
        }

        // Initial card load
        loadCard(0);
      } catch(err) {
        console.error('Widget load error:', err);
      }
    })();
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
