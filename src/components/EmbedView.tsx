import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  Code,
  ExternalLink,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { Flashcard, WidgetConfig } from '../types';
import { generateWidgetHtml } from '../utils/widgetGenerator';

interface EmbedViewProps {
  cards: Flashcard[];
  config: WidgetConfig;
  onCopyHtml: () => void;
  onDownloadHtml: () => void;
  hasCopied: boolean;
}

export const EmbedView: React.FC<EmbedViewProps> = ({
  cards,
  config,
  onCopyHtml,
  onDownloadHtml,
  hasCopied,
}) => {
  const isEn = config.language === 'en';
  const [embedMode, setEmbedMode] = useState<'standalone' | 'iframe'>('standalone');

  const generatedHtml = useMemo(() => {
    return generateWidgetHtml(cards, config);
  }, [cards, config]);

  const iframeSnippet = useMemo(() => {
    const escaped = generatedHtml.replace(/"/g, '&quot;');
    return `<iframe\n  srcdoc="${escaped}"\n  width="100%"\n  height="620"\n  style="border: none; border-radius: 20px; overflow: hidden; max-width: 520px; display: block; margin: 0 auto;"\n  title="${config.title || 'Image and Word - Vocabulary Practice'}"\n  loading="lazy"\n  allow="autoplay"\n></iframe>`;
  }, [generatedHtml, config.title]);

  const currentSnippet = embedMode === 'standalone' ? generatedHtml : iframeSnippet;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Verification of Image & Audio Resources */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <span>{isEn ? `Configured Flashcards & Audio (${cards.length})` : `Cards e Áudios Vinculados (${cards.length})`}</span>
          </h3>
          <span className="text-xs text-stone-500">
            {isEn ? 'All images and MP3 audio are bundled in the export' : 'Todas as imagens e áudios estão integrados na exportação'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-center gap-3"
            >
              <div className="w-12 h-10 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.targetWord}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
                    {isEn ? 'No img' : 'Sem img'}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-stone-900 truncate">
                    #{idx + 1} {card.targetWord || (isEn ? 'Untitled' : 'Sem palavra')}
                  </span>
                  {card.audioUrl ? (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-0.5">
                      <Volume2 className="w-2.5 h-2.5" />
                      <span>{card.audioUrl.startsWith('data:') ? (isEn ? 'MP3 Embedded' : 'MP3 Embutido') : 'MP3 Link'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                      TTS
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-mono text-stone-500 truncate mt-0.5" title={card.imageUrl}>
                  {card.imageUrl || (isEn ? 'No image defined' : 'URL não definida')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Code Panel and Live Iframe Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Code Snippet Box (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          {/* Code Header */}
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">{isEn ? 'Code Format' : 'Formato do Código'}</span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg">
              <button
                type="button"
                onClick={() => setEmbedMode('standalone')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  embedMode === 'standalone'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isEn ? 'Complete HTML' : 'HTML Completo'}
              </button>
              <button
                type="button"
                onClick={() => setEmbedMode('iframe')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  embedMode === 'iframe'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isEn ? '<iframe> Tag' : 'Tag <iframe>'}
              </button>
            </div>
          </div>

          {/* Code Viewer Area */}
          <div className="relative bg-stone-950 p-4 font-mono text-xs text-stone-300 overflow-x-auto max-h-[480px]">
            <pre className="leading-relaxed select-all">
              <code>{currentSnippet}</code>
            </pre>

            {/* Quick Floating Copy Button inside Code area */}
            <div className="sticky bottom-2 right-2 flex justify-end">
              <button
                type="button"
                onClick={onCopyHtml}
                className="px-3.5 py-1.5 rounded-lg bg-stone-800/90 hover:bg-stone-700 text-white text-xs font-medium backdrop-blur-sm border border-stone-700 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isEn ? 'Copied!' : 'Copiado!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-300" />
                    <span>{isEn ? 'Copy Code' : 'Copiar Código'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Action Info */}
          <div className="p-4 bg-stone-50/70 border-t border-stone-200 flex items-center justify-between gap-3 text-xs text-stone-500">
            <span>
              {embedMode === 'standalone'
                ? (isEn ? 'Use in Moodle, Canvas, WordPress, Notion or save as .html' : 'Compatível com Moodle, Canvas, WordPress, Notion ou abrindo direto o .html')
                : (isEn ? 'Paste into embed / HTML block in your LMS or site' : 'Cole no bloco de incorporação do seu site ou LMS')}
            </span>

            <button
              type="button"
              onClick={onDownloadHtml}
              className="text-stone-800 font-semibold hover:underline flex items-center gap-1 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? 'Download .html file' : 'Baixar arquivo .html'}</span>
            </button>
          </div>
        </div>

        {/* Live Standalone Iframe Sandbox (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                {isEn ? 'Standalone Sandbox' : 'Execução Real Isolada (Sandbox)'}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {isEn ? 'Live Iframe' : 'Live Iframe'}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-2 shadow-2xs overflow-hidden flex items-center justify-center">
            <iframe
              srcDoc={generatedHtml}
              title={isEn ? "Image and Word Preview" : "Figura e Palavra Preview"}
              className="w-full h-[580px] border-0 rounded-xl"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
