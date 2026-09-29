import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  ImageIcon,
} from 'lucide-react';
import { Flashcard, WidgetConfig } from '../types';
import { playPronunciationAudio } from '../utils/audioHelper';

interface CardPreviewProps {
  card?: Flashcard;
  config: WidgetConfig;
  allCards: Flashcard[];
  currentIndex?: number;
  onNavigateCard?: (index: number) => void;
  isStandaloneEmbed?: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  config,
  allCards,
  currentIndex = 0,
  onNavigateCard,
}) => {
  const isEn = config.language === 'en';

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [solvedCards, setSolvedCards] = useState<Set<number>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeIndex = currentIndex;
  const currentCard = card || allCards[activeIndex] || allCards[0];

  // Localization strings
  const strings = useMemo(() => {
    if (isEn) {
      return {
        defaultTitle: 'Image and Word',
        defaultSubtitle: 'Look at the image and write the corresponding word in English.',
        placeholder: 'What is the name in English?',
        checkAnswer: 'Check Answer',
        nextCard: 'Next →',
        viewResult: 'View Final Result',
        prev: 'Previous',
        next: 'Next',
        tip: 'Tip',
        listenAudio: 'Listen to English pronunciation',
        correctTitle: '✓ Correct! Great job!',
        mistakeTitle: '✕ Almost there! Try again',
        mistakeHelp: 'Look closely at the image or click Tip.',
        translationPrefix: 'Portuguese meaning:',
        imageFallback: 'Image not available',
        solved: '✓ Solved',
        pending: 'Pending',
        completionTitle: 'Great Job!',
        completionDesc: `You have completed all ${allCards.length} cards in this vocabulary exercise.`,
        statCorrect: 'Correct',
        statAccuracy: 'Accuracy',
        practiceAgain: 'Practice Again',
      };
    }
    return {
      defaultTitle: 'Figura e Palavra',
      defaultSubtitle: 'Observe a imagem e escreva a palavra correspondente em inglês.',
      placeholder: 'Qual é o nome em inglês?',
      checkAnswer: 'Verificar Resposta',
      nextCard: 'Avançar para o Próximo',
      viewResult: 'Ver Resultado Final',
      prev: 'Anterior',
      next: 'Próximo',
      tip: 'Dica',
      listenAudio: 'Ouvir pronúncia em inglês',
      correctTitle: '✓ Correto! Parabéns!',
      mistakeTitle: '✕ Quase lá! Tente novamente',
      mistakeHelp: 'Observe bem a imagem ou clique em Dica.',
      translationPrefix: 'Tradução:',
      imageFallback: 'Imagem não disponível',
      solved: '✓ Resolvido',
      pending: 'Pendente',
      completionTitle: 'Excelente Trabalho!',
      completionDesc: `Você completou todos os ${allCards.length} cards deste exercício de vocabulário em inglês.`,
      statCorrect: 'Acertos',
      statAccuracy: 'Precisão',
      practiceAgain: 'Praticar Novamente',
    };
  }, [isEn, allCards.length]);

  // Theme styling definitions
  const themeStyles = useMemo(() => {
    switch (config.theme) {
      case 'clean-dark':
        return {
          container: 'bg-slate-900 border-slate-700 text-slate-100 shadow-xl',
          card: 'bg-slate-800 border-slate-700',
          input: 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-sky-400 focus:ring-sky-400/20',
          btnPrimary: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold',
          btnSecondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          hint: 'bg-slate-800/80 text-amber-300 border-amber-500/30',
          progressBar: 'bg-slate-800',
          progressFill: 'bg-sky-400',
          successBox: 'bg-emerald-950/70 border-emerald-700 text-emerald-300',
          errorBox: 'bg-rose-950/70 border-rose-700 text-rose-300',
        };
      case 'warm-paper':
        return {
          container: 'bg-[#faf7f2] border-[#e3dbce] text-[#2c2523] shadow-md',
          card: 'bg-[#f5f0e6] border-[#e3dbce]',
          input: 'bg-white border-[#d5cbbd] text-[#2c2523] placeholder-[#877c75] focus:border-[#854d0e] focus:ring-[#854d0e]/20',
          btnPrimary: 'bg-[#854d0e] hover:bg-[#713f12] text-white font-semibold',
          btnSecondary: 'bg-[#f0e8db] hover:bg-[#e4dacb] text-[#2c2523] border-[#d5cbbd]',
          badge: 'bg-[#f5f0e6] text-[#877c75] border-[#e3dbce]',
          hint: 'bg-amber-50 text-amber-900 border-amber-200',
          progressBar: 'bg-[#e7decb]',
          progressFill: 'bg-[#854d0e]',
          successBox: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          errorBox: 'bg-rose-50 border-rose-300 text-rose-900',
        };
      case 'modern-slate':
        return {
          container: 'bg-white border-slate-200 text-slate-900 shadow-md',
          card: 'bg-slate-50 border-slate-200',
          input: 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/20',
          btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold',
          btnSecondary: 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300',
          badge: 'bg-slate-100 text-slate-600 border-slate-200',
          hint: 'bg-amber-50 text-amber-900 border-amber-200',
          progressBar: 'bg-slate-100',
          progressFill: 'bg-blue-600',
          successBox: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          errorBox: 'bg-rose-50 border-rose-200 text-rose-900',
        };
      case 'minimal-light':
      default:
        return {
          container: 'bg-white border-stone-200 text-stone-900 shadow-md',
          card: 'bg-stone-50/70 border-stone-200',
          input: 'bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-blue-600 focus:ring-blue-600/20',
          btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm shadow-blue-500/20',
          btnSecondary: 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          hint: 'bg-amber-50 text-amber-900 border-amber-200',
          progressBar: 'bg-stone-100',
          progressFill: 'bg-blue-600',
          successBox: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          errorBox: 'bg-rose-50 border-rose-200 text-rose-900',
        };
    }
  }, [config.theme]);

  // Reset state when changing card
  useEffect(() => {
    setUserInput('');
    setFeedback(null);
    setHintLevel(0);
    setImageError(false);
    setIsShaking(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [activeIndex, card]);

  // Audio effects synthesizer for correct/incorrect
  const playSoundEffect = (type: 'correct' | 'incorrect' | 'complete') => {
    if (!config.enableSoundEffects || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      if (type === 'correct') {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0, now + i * 0.08);
          gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.4);
        });
      } else if (type === 'incorrect') {
        [240, 180].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.1, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.3);
        });
      } else if (type === 'complete') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.15, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.5);
        });
      }
    } catch (e) {}
  };

  const normalizeString = (str: string) => {
    let s = (str || '').trim();
    if (!config.caseSensitive) {
      s = s.toLowerCase();
    }
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If already correct, clicking button advances to next card
    if (feedback === 'correct') {
      handleNextCard();
      return;
    }

    if (!currentCard || !userInput.trim()) return;

    setAttempts((prev) => prev + 1);

    const cleanInput = normalizeString(userInput);
    const cleanTarget = normalizeString(currentCard.targetWord);
    const acceptableAnswers = (currentCard.acceptableAnswers || []).map(normalizeString);

    const isMatch = cleanInput === cleanTarget || acceptableAnswers.includes(cleanInput);

    if (isMatch) {
      setFeedback('correct');
      setCorrectAttempts((prev) => prev + 1);
      setSolvedCards((prev) => new Set(prev).add(activeIndex));
      playSoundEffect('correct');

      if (config.showAudio && currentCard) {
        playPronunciationAudio(currentCard.audioUrl, currentCard.targetWord);
      }
    } else {
      setFeedback('incorrect');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      playSoundEffect('incorrect');
    }
  };

  const handleNextCard = () => {
    if (activeIndex < allCards.length - 1) {
      if (onNavigateCard) onNavigateCard(activeIndex + 1);
    } else {
      setIsCompleted(true);
      playSoundEffect('complete');
    }
  };

  const handlePrevCard = () => {
    if (activeIndex > 0 && onNavigateCard) {
      onNavigateCard(activeIndex - 1);
    }
  };

  const handleToggleHint = () => {
    setHintLevel((prev) => prev + 1);
  };

  const handleRestart = () => {
    setSolvedCards(new Set());
    setAttempts(0);
    setCorrectAttempts(0);
    setIsCompleted(false);
    if (onNavigateCard) onNavigateCard(0);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentCard) {
      playPronunciationAudio(currentCard.audioUrl, currentCard.targetWord);
    }
  };

  // Render Hint Text
  const renderHintText = () => {
    if (!currentCard || hintLevel === 0) return null;

    if (hintLevel === 1) {
      if (currentCard.hint) {
        return `💡 ${isEn ? 'Tip' : 'Dica'}: ${currentCard.hint}`;
      }
      return isEn
        ? `💡 Tip: Starts with letter "${currentCard.targetWord.charAt(0).toUpperCase()}" and has ${currentCard.targetWord.length} letters.`
        : `💡 Dica: Começa com a letra "${currentCard.targetWord.charAt(0).toUpperCase()}" e tem ${currentCard.targetWord.length} letras.`;
    }

    // Level 2+: Progressive reveal
    const word = currentCard.targetWord;
    let revealed = '';
    for (let i = 0; i < word.length; i++) {
      if (i <= hintLevel || word[i] === ' ') {
        revealed += word[i];
      } else {
        revealed += ' _';
      }
    }

    return (
      <span>
        💡 {isEn ? 'Revealed letters:' : 'Letras reveladas:'} <strong>{revealed}</strong>
        {currentCard.translationPt && (
          <span className="block mt-1 text-xs opacity-80">
            {strings.translationPrefix} <em>{currentCard.translationPt}</em>
          </span>
        )}
      </span>
    );
  };

  if (!currentCard) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
        <p className="text-sm text-stone-500">Nenhum card disponível.</p>
      </div>
    );
  }

  // Completion Screen View
  if (isCompleted) {
    const accuracy = attempts > 0 ? Math.round((allCards.length / attempts) * 100) : 100;
    return (
      <div className={`w-full max-w-md mx-auto rounded-2xl border p-8 text-center space-y-6 ${themeStyles.container}`}>
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
          <Trophy className="w-8 h-8 text-emerald-600" />
        </div>

        <div>
          <h3 className="text-xl font-bold">{strings.completionTitle}</h3>
          <p className="text-xs opacity-75 mt-1">
            {strings.completionDesc}
          </p>
        </div>

        <div className="flex justify-center gap-6 py-2">
          <div className="text-center">
            <span className="text-2xl font-bold font-mono">{allCards.length}</span>
            <span className="block text-xs opacity-60">{strings.statCorrect}</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold font-mono">{Math.min(100, Math.max(10, accuracy))}%</span>
            <span className="block text-xs opacity-60">{strings.statAccuracy}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all active:scale-98 flex items-center justify-center gap-2 shadow-xs ${themeStyles.btnPrimary}`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{strings.practiceAgain}</span>
        </button>
      </div>
    );
  }

  const progressPct = Math.round(((activeIndex + 1) / allCards.length) * 100);
  const displayTitle = config.title || strings.defaultTitle;
  const displaySubtitle = config.subtitle || strings.defaultSubtitle;
  const shouldShowHeader = (config.showHeaderTexts !== false) || (config.showSlideCounter !== false);

  return (
    <div className={`w-full max-w-md mx-auto rounded-2xl border p-5 sm:p-6 space-y-4 transition-colors ${themeStyles.container}`}>
      {/* Header */}
      {shouldShowHeader && (
        <div className="flex items-start justify-between gap-3">
          {config.showHeaderTexts !== false ? (
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {displayTitle}
              </h3>
              {displaySubtitle && (
                <p className="text-xs opacity-60 mt-0.5">{displaySubtitle}</p>
              )}
            </div>
          ) : (
            <div />
          )}

          {config.showSlideCounter !== false && (
            <div className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border shrink-0 ${themeStyles.badge}`}>
              {activeIndex + 1} / {allCards.length}
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {config.showProgressBar && (
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${themeStyles.progressBar}`}>
          <div
            className={`h-full transition-all duration-300 ${themeStyles.progressFill}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Card Image Container */}
      <div className={`relative aspect-4/3 rounded-xl overflow-hidden border flex items-center justify-center bg-stone-100 ${themeStyles.card}`}>
        {currentCard.imageUrl && !imageError ? (
          <img
            src={currentCard.imageUrl}
            alt={currentCard.imageAlt || currentCard.targetWord}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-stone-400 p-4 text-center">
            <ImageIcon className="w-8 h-8 stroke-1" />
            <span className="text-xs">{strings.imageFallback}</span>
          </div>
        )}

        {/* Audio Button Overlay */}
        {config.showAudio && (
          <button
            type="button"
            onClick={handlePlayAudio}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs transition-transform active:scale-90 hover:scale-105"
            title={strings.listenAudio}
            aria-label={strings.listenAudio}
          >
            <Volume2 className="w-4 h-4 text-stone-800" />
          </button>
        )}
      </div>

      {/* Hint Alert Box */}
      {hintLevel > 0 && (
        <div className={`p-3 rounded-xl text-xs border animate-in fade-in slide-in-from-top-1 duration-200 ${themeStyles.hint}`}>
          {renderHintText()}
        </div>
      )}

      {/* Form & Verification */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className={`relative ${isShaking ? 'animate-shake' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              if (feedback) setFeedback(null);
            }}
            disabled={feedback === 'correct'}
            placeholder={strings.placeholder}
            className={`w-full px-4 py-3 text-sm rounded-xl border transition-all outline-none ${themeStyles.input}`}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Feedback Message */}
        {feedback === 'correct' && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200 ${themeStyles.successBox}`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 min-w-0">
              <div className="font-bold text-emerald-800">{strings.correctTitle}</div>
              <div className="text-emerald-950 font-medium">
                <strong>{currentCard.targetWord}</strong>
                {currentCard.phonetic && <span className="font-mono text-[11px] opacity-75 ml-1">· {currentCard.phonetic}</span>}
              </div>
              {config.showTranslationOnSuccess && currentCard.translationPt && (
                <div className="text-emerald-900 text-[11px]">
                  {strings.translationPrefix} <em>{currentCard.translationPt}</em>
                </div>
              )}
              {currentCard.exampleSentence && (
                <div className="text-emerald-900 text-[11px] italic opacity-85">
                  "{currentCard.exampleSentence}"
                </div>
              )}
            </div>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200 ${themeStyles.errorBox}`}>
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              {strings.mistakeTitle}. {strings.mistakeHelp}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {feedback === 'correct' ? (
            <button
              type="button"
              onClick={handleNextCard}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-98 flex items-center justify-center gap-1.5 shadow-xs ${themeStyles.btnPrimary}`}
            >
              <span>{activeIndex < allCards.length - 1 ? strings.nextCard : strings.viewResult}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-98 flex items-center justify-center gap-1.5 shadow-xs ${themeStyles.btnPrimary}`}
            >
              <span>{strings.checkAnswer}</span>
            </button>
          )}

          {config.showHintButton && feedback !== 'correct' && (
            <button
              type="button"
              onClick={handleToggleHint}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors flex items-center gap-1.5 ${themeStyles.btnSecondary}`}
              title={strings.tip}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{strings.tip}</span>
            </button>
          )}
        </div>
      </form>

      {/* Navigation Controls */}
      {onNavigateCard && allCards.length > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={handlePrevCard}
            className="text-xs font-medium text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{strings.prev}</span>
          </button>

          <span className="text-[11px] text-stone-400 font-mono">
            {solvedCards.has(activeIndex) ? strings.solved : strings.pending}
          </span>

          <button
            type="button"
            disabled={activeIndex === allCards.length - 1}
            onClick={handleNextCard}
            className="text-xs font-medium text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <span>{strings.next}</span>
          </button>
        </div>
      )}
    </div>
  );
};
