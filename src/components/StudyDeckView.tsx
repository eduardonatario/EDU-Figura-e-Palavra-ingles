import React, { useState } from 'react';
import { Sparkles, Trophy, RotateCcw, ArrowLeft, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { Flashcard, WidgetConfig } from '../types';
import { CardPreview } from './CardPreview';

interface StudyDeckViewProps {
  cards: Flashcard[];
  config: WidgetConfig;
  onExitStudy: () => void;
}

export const StudyDeckView: React.FC<StudyDeckViewProps> = ({
  cards,
  config,
  onExitStudy,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeCard = cards[currentIndex] || cards[0];

  const isEn = config.language === 'en';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner / Progress overview */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onExitStudy}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back to Settings' : 'Voltar para Configurações'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-stone-500 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
            {isEn ? `Card: ${currentIndex + 1} of ${cards.length}` : `Progresso: ${currentIndex + 1} de ${cards.length}`}
          </span>
        </div>
      </div>

      {/* Main Focus Card Stage */}
      <div className="py-2 flex justify-center">
        {activeCard ? (
          <CardPreview
            card={activeCard}
            config={config}
            allCards={cards}
            currentIndex={currentIndex}
            onNavigateCard={setCurrentIndex}
          />
        ) : (
          <div className="text-center p-8 bg-white rounded-2xl border border-stone-200">
            <p className="text-sm text-stone-600">{isEn ? 'No cards available at the moment.' : 'Nenhum card cadastrado no momento.'}</p>
          </div>
        )}
      </div>

      {/* Quick Keyboard shortcuts hint */}
      <div className="text-center text-xs text-stone-400 flex items-center justify-center gap-4">
        <span>{isEn ? 'Tip: Press ' : 'Dica: Pressione '}<kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-stone-600 font-mono text-[10px]">Enter</kbd>{isEn ? ' to check the answer' : ' para verificar a resposta'}</span>
      </div>
    </div>
  );
};
