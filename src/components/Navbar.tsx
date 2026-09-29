import React from 'react';
import { Copy, Download, Sparkles, BookOpen, SlidersHorizontal, Code2, Check, Globe } from 'lucide-react';
import { ActiveTab, WidgetLanguage } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cardsCount: number;
  onCopyHtml: () => void;
  onDownloadHtml: () => void;
  hasCopied: boolean;
  language: WidgetLanguage;
  onToggleLanguage: (lang: WidgetLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cardsCount,
  onCopyHtml,
  onDownloadHtml,
  hasCopied,
  language,
  onToggleLanguage,
}) => {
  const isEn = language === 'en';

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('editor');
            }}
            className="text-lg font-bold tracking-tight text-stone-900 flex items-center gap-2 hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-500/20">
              {isEn ? 'IW' : 'FP'}
            </div>
            <span className="hidden sm:inline">{isEn ? 'Image and Word' : 'Figura e Palavra'}</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links / Modes */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isEn ? 'Settings' : 'Configurações'}</span>
          </button>

          <button
            onClick={() => setActiveTab('study')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'study'
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Preview</span>
            <span className="text-[11px] font-mono tabular-nums text-stone-400">
              ({cardsCount})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('embed')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'embed'
                ? 'bg-white text-stone-950 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isEn ? 'Export Embed' : 'Exportar Embed'}</span>
          </button>
        </nav>

        {/* Zone 3: Language Toggle & Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-stone-200/70 p-0.5 rounded-lg border border-stone-300/60">
            <button
              type="button"
              onClick={() => onToggleLanguage('pt')}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                !isEn
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Mudar para Português"
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => onToggleLanguage('en')}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                isEn
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          <button
            onClick={onCopyHtml}
            className="px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 hover:text-stone-900 active:scale-98 transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
            title={isEn ? 'Copy widget HTML code to clipboard' : 'Copiar código HTML do widget para a área de transferência'}
          >
            {hasCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{isEn ? 'Copied!' : 'Copiado!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span className="hidden sm:inline">{isEn ? 'Copy HTML' : 'Copiar HTML'}</span>
                <span className="sm:hidden">{isEn ? 'Copy' : 'Copiar'}</span>
              </>
            )}
          </button>

          <button
            onClick={onDownloadHtml}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-98 transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20 whitespace-nowrap"
            title={isEn ? 'Download standalone HTML file (.html)' : 'Baixar arquivo HTML autocontido (.html)'}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{isEn ? 'Download HTML' : 'Baixar HTML'}</span>
            <span className="sm:hidden">{isEn ? 'Download' : 'Baixar'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
