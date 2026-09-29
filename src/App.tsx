import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ConfigPanel } from './components/ConfigPanel';
import { CardPreview } from './components/CardPreview';
import { EmbedView } from './components/EmbedView';
import { StudyDeckView } from './components/StudyDeckView';
import { INITIAL_CARDS, DEFAULT_WIDGET_CONFIG } from './constants/presets';
import { Flashcard, WidgetConfig, ActiveTab } from './types';
import { generateWidgetHtml } from './utils/widgetGenerator';
import { Eye, SlidersHorizontal, Sparkles, Check, Download, AlertCircle } from 'lucide-react';

const STORAGE_KEY_CARDS = 'figura_e_palavra_cards_v3';
const STORAGE_KEY_CONFIG = 'figura_e_palavra_config_v3';

export default function App() {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CARDS) || localStorage.getItem('figura_e_palavra_cards_v2');
      if (saved) {
        const parsed: Flashcard[] = JSON.parse(saved);
        // Clean any stale data:image strings or local paths with clean preset URLs
        const healed = parsed.map((card, idx) => {
          if (!card.imageUrl || card.imageUrl.startsWith('data:') || card.imageUrl.startsWith('/src/assets/images/')) {
            const fallback = INITIAL_CARDS[idx] || INITIAL_CARDS[0];
            return { ...card, imageUrl: fallback.imageUrl };
          }
          return card;
        });
        return healed;
      }
    } catch (e) {}
    return INITIAL_CARDS;
  });

  const [config, setConfig] = useState<WidgetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_WIDGET_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
    } catch (e) {}
  }, [cards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {}
  }, [config]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Update card helper
  const handleUpdateCard = (index: number, updated: Partial<Flashcard>) => {
    setCards((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], ...updated };
      }
      return next;
    });
  };

  // Add new card helper
  const handleAddCard = () => {
    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      imageUrl: '',
      imageAlt: '',
      targetWord: '',
      acceptableAnswers: [],
      translationPt: '',
      hint: '',
    };
    setCards((prev) => [...prev, newCard]);
    setActiveCardIndex(cards.length);
    showToast('Novo card adicionado. Insira a URL ou suba a imagem.');
  };

  // Delete card helper
  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) return;
    setCards((prev) => prev.filter((_, i) => i !== index));
    if (activeCardIndex >= index && activeCardIndex > 0) {
      setActiveCardIndex((prev) => prev - 1);
    }
    showToast('Card removido.');
  };

  // Update config helper
  const handleUpdateConfig = (updated: Partial<WidgetConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  // Copy HTML to clipboard
  const handleCopyHtml = async () => {
    try {
      const htmlCode = generateWidgetHtml(cards, config);
      await navigator.clipboard.writeText(htmlCode);
      setHasCopied(true);
      showToast('HTML do widget copiado para a área de transferência!');
      setTimeout(() => setHasCopied(false), 2500);
    } catch (err) {
      // Fallback
      showToast('Erro ao copiar automaticamente. Use a aba "Exportar Embed".');
    }
  };

  // Download standalone HTML file
  const handleDownloadHtml = () => {
    try {
      const htmlCode = generateWidgetHtml(cards, config);
      const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = config.language === 'en' ? 'image-and-word-widget.html' : 'figura-e-palavra-widget.html';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 2000);
      showToast(config.language === 'en' ? 'Downloaded "image-and-word-widget.html"!' : 'Download do arquivo "figura-e-palavra-widget.html" iniciado com sucesso!');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Erro ao gerar download. Use o botão "Copiar HTML" na aba Exportar.');
    }
  };

  const handleToggleLanguage = (lang: 'pt' | 'en') => {
    const update: Partial<WidgetConfig> = { language: lang };
    if (lang === 'en') {
      if (!config.title || config.title === 'Figura e Palavra') update.title = 'Image and Word';
      if (!config.subtitle || config.subtitle === 'Observe a imagem e escreva a palavra correspondente em inglês.') {
        update.subtitle = 'Look at the image and write the corresponding word in English.';
      }
      showToast('Switched to English (100% English)');
    } else {
      if (config.title === 'Image and Word') update.title = 'Figura e Palavra';
      if (config.subtitle === 'Look at the image and write the corresponding word in English.') {
        update.subtitle = 'Observe a imagem e escreva a palavra correspondente em inglês.';
      }
      showToast('Alterado para Português');
    }
    setConfig((prev) => ({ ...prev, ...update }));
  };

  const currentCard = cards[activeCardIndex] || cards[0];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* Top Bar Contract (3 zones) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cardsCount={cards.length}
        onCopyHtml={handleCopyHtml}
        onDownloadHtml={handleDownloadHtml}
        hasCopied={hasCopied}
        language={config.language || 'pt'}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Editor Mode: Two-zone split with Config on Left, Live Preview on Right */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Área de Configuração (7 cols) */}
            <div className="lg:col-span-7 h-full">
              <ConfigPanel
                cards={cards}
                activeCardIndex={activeCardIndex}
                onSelectCard={setActiveCardIndex}
                onUpdateCard={handleUpdateCard}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                config={config}
                onUpdateConfig={handleUpdateConfig}
              />
            </div>

            {/* Right Column: Área de Preview em Tempo Real (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Área de Preview em Tempo Real
                  </span>
                </div>
                <span className="text-xs text-stone-500">
                  Interativo · Teste digitando
                </span>
              </div>

              {/* Sticky live preview card */}
              <div className="sticky top-20">
                {currentCard ? (
                  <CardPreview
                    card={currentCard}
                    config={config}
                    allCards={cards}
                    currentIndex={activeCardIndex}
                    onNavigateCard={setActiveCardIndex}
                  />
                ) : (
                  <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
                    <p className="text-sm text-stone-500">Nenhum card selecionado.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Study Mode: Full immersion learner view */}
        {activeTab === 'study' && (
          <StudyDeckView
            cards={cards}
            config={config}
            onExitStudy={() => setActiveTab('editor')}
          />
        )}

        {/* Embed Mode: Code preview, copy, download, sandbox */}
        {activeTab === 'embed' && (
          <EmbedView
            cards={cards}
            config={config}
            onCopyHtml={handleCopyHtml}
            onDownloadHtml={handleDownloadHtml}
            hasCopied={hasCopied}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
