import React, { useState, useRef } from 'react';
import {
  Link as LinkIcon,
  Plus,
  Trash2,
  Copy,
  Sliders,
  Sparkles,
  Check,
  HelpCircle,
  Eye,
  FileImage,
  CheckCircle2,
  X,
  ExternalLink,
  Volume2,
  VolumeX,
  Upload,
  Music,
  Play,
  Square,
  Type,
  Hash,
} from 'lucide-react';
import { Flashcard, WidgetConfig, WidgetTheme } from '../types';
import { INITIAL_CARDS } from '../constants/presets';
import { isValidImageUrl } from '../utils/imageHelper';
import {
  convertAudioFileToDataUrl,
  fetchAudioUrlToDataUrl,
  playPronunciationAudio,
  stopPronunciationAudio,
} from '../utils/audioHelper';

interface ConfigPanelProps {
  cards: Flashcard[];
  activeCardIndex: number;
  onSelectCard: (index: number) => void;
  onUpdateCard: (index: number, updated: Partial<Flashcard>) => void;
  onAddCard: () => void;
  onDeleteCard: (index: number) => void;
  config: WidgetConfig;
  onUpdateConfig: (updated: Partial<WidgetConfig>) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  cards,
  activeCardIndex,
  onSelectCard,
  onUpdateCard,
  onAddCard,
  onDeleteCard,
  config,
  onUpdateConfig,
}) => {
  const safeIndex = activeCardIndex >= 0 && activeCardIndex < cards.length ? activeCardIndex : 0;
  const currentCard = cards[safeIndex] || cards[0];
  const [activeTab, setActiveTab] = useState<'card' | 'deck' | 'settings'>('card');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isConvertingAudio, setIsConvertingAudio] = useState<boolean>(false);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const isEn = config.language === 'en';

  const handleApplyPreset = (preset: Flashcard) => {
    onUpdateCard(safeIndex, {
      imageUrl: preset.imageUrl,
      imageAlt: preset.imageAlt,
      targetWord: preset.targetWord,
      audioUrl: preset.audioUrl,
      acceptableAnswers: preset.acceptableAnswers,
      translationPt: preset.translationPt,
      phonetic: preset.phonetic,
      hint: preset.hint,
      exampleSentence: preset.exampleSentence,
    });
    setStatusMsg(isEn ? `✓ Preset "${preset.targetWord}" applied!` : `✓ Exemplo "${preset.targetWord}" aplicado com sucesso!`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Handle local MP3 file upload -> Base64 Data URL
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsConvertingAudio(true);
      setStatusMsg(isEn ? 'Embedding MP3 audio into HTML...' : 'Incorporando áudio MP3 no código HTML...');
      const dataUrl = await convertAudioFileToDataUrl(file);
      onUpdateCard(safeIndex, { audioUrl: dataUrl });
      setStatusMsg(isEn ? '✓ Audio file embedded into HTML (Base64)!' : '✓ Arquivo de áudio incorporado ao HTML (Base64)!');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading audio';
      setStatusMsg(`Erro: ${msg}`);
      setTimeout(() => setStatusMsg(null), 4000);
    } finally {
      setIsConvertingAudio(false);
      if (audioFileInputRef.current) audioFileInputRef.current.value = '';
    }
  };

  // Embed external audio URL to Base64
  const handleEmbedAudioUrl = async () => {
    if (!currentCard.audioUrl || currentCard.audioUrl.startsWith('data:')) return;
    try {
      setIsConvertingAudio(true);
      setStatusMsg(isEn ? 'Downloading and embedding MP3 into HTML...' : 'Baixando e incorporando áudio MP3 no HTML...');
      const dataUrl = await fetchAudioUrlToDataUrl(currentCard.audioUrl);
      onUpdateCard(safeIndex, { audioUrl: dataUrl });
      setStatusMsg(isEn ? '✓ Audio embedded directly in HTML!' : '✓ Áudio incorporado diretamente no HTML!');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'CORS restriction';
      setStatusMsg(isEn ? `Notice: URL saved. ${msg}` : `Aviso: URL salva. O widget tentará carregá-la via link.`);
      setTimeout(() => setStatusMsg(null), 4000);
    } finally {
      setIsConvertingAudio(false);
    }
  };

  // Test play audio
  const handleTestAudio = () => {
    if (isPlayingAudio) {
      stopPronunciationAudio();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    playPronunciationAudio(
      currentCard.audioUrl,
      currentCard.targetWord,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const themeOptions: { id: WidgetTheme; name: string; preview: string }[] = [
    { id: 'minimal-light', name: 'Minimal Claro (Azul)', preview: 'bg-white border-blue-200 text-blue-900' },
    { id: 'clean-dark', name: 'Escuro Elegante', preview: 'bg-slate-900 border-slate-700 text-white' },
    { id: 'warm-paper', name: 'Papel Quente', preview: 'bg-[#faf7f2] border-[#e4dcce] text-[#2d2624]' },
    { id: 'modern-slate', name: 'Slate Moderno', preview: 'bg-slate-50 border-blue-200 text-blue-950' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col h-full">
      {/* Configuration Header with Section Tabs */}
      <div className="px-5 pt-4 pb-3 border-b border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span>{isEn ? 'Configuration Area' : 'Área de Configuração'}</span>
            <span className="text-xs font-normal text-stone-500">
              · {isEn ? `Card ${activeCardIndex + 1} of ${cards.length}` : `Card ${activeCardIndex + 1} de ${cards.length}`}
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isEn
              ? 'Set the image URL, target English word, optional MP3 pronunciation, and hints.'
              : 'Defina a URL da imagem, a palavra em inglês, áudio MP3 e detalhes pedagógicos do widget.'}
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'card'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {isEn ? 'Edit Card' : 'Editar Card'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deck')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'deck'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {isEn ? `Card List (${cards.length})` : `Lista de Cards (${cards.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {isEn ? 'Appearance' : 'Aparência'}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
        {activeTab === 'card' && currentCard && (
          <div className="space-y-6">
            {/* 1. Imagem: URL Direta */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  {isEn ? '1. Image URL' : '1. URL da Imagem'}
                </label>
                <span className="text-xs text-stone-500">
                  {isEn ? 'Direct link (HTTPS)' : 'Insira um link direto (HTTPS)'}
                </span>
              </div>

              {/* URL Input Row */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    value={currentCard.imageUrl.startsWith('data:') ? '' : currentCard.imageUrl}
                    onChange={(e) => onUpdateCard(safeIndex, { imageUrl: e.target.value.trim() })}
                    placeholder="https://images.unsplash.com/photo-...?w=600"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                {statusMsg && (
                  <p className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{statusMsg}</span>
                  </p>
                )}

                {/* Active Image Status Indicator */}
                {currentCard.imageUrl && !currentCard.imageUrl.startsWith('data:') ? (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-11 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0 shadow-2xs">
                        <img
                          src={currentCard.imageUrl}
                          alt="Preview da figura"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Image Linked' : 'URL Válida e Vinculada'}</span>
                        </div>
                        <p className="text-[11px] font-mono text-stone-500 truncate mt-0.5" title={currentCard.imageUrl}>
                          {currentCard.imageUrl}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpdateCard(safeIndex, { imageUrl: '' })}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-stone-200/50 transition-colors shrink-0"
                      title={isEn ? 'Remove image' : 'Remover URL'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg border border-dashed border-stone-300 bg-stone-50/50 text-stone-500 text-xs flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>
                      {isEn
                        ? 'No image linked yet. Paste a direct image link above (e.g. Unsplash, Wikimedia).'
                        : 'Nenhuma URL de imagem vinculada. Cole uma URL direta acima (ex: Unsplash, Wikimedia).'}
                    </span>
                  </div>
                )}

                {/* Preset Fast Picker */}
                <div className="pt-1">
                  <span className="text-[11px] font-medium text-stone-400 block mb-1.5">
                    {isEn ? 'Or pick an example preset:' : 'Ou escolha uma imagem de exemplo:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {INITIAL_CARDS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1.5 ${
                          currentCard.targetWord.toLowerCase() === preset.targetWord.toLowerCase()
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                        }`}
                      >
                        <span className="font-semibold">{preset.targetWord}</span>
                        <span className="opacity-70">({preset.translationPt})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* 2. Áudio de Pronúncia (Opcional MP3 / Base64 Incorporado) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isEn ? '2. Pronunciation Audio (Optional MP3 / Embedded)' : '2. Áudio da Pronúncia (Opcional MP3 / Incorporado)'}</span>
                </label>
                <span className="text-[11px] text-stone-500">
                  {isEn ? 'URL or embedded MP3 in HTML' : 'URL direta ou MP3 incorporado'}
                </span>
              </div>

              {/* Hidden file input for local audio upload */}
              <input
                ref={audioFileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />

              <div className="space-y-2.5">
                {/* Audio URL Input + Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="url"
                      value={currentCard.audioUrl && currentCard.audioUrl.startsWith('data:') ? '' : (currentCard.audioUrl || '')}
                      onChange={(e) => onUpdateCard(safeIndex, { audioUrl: e.target.value.trim() })}
                      placeholder={isEn ? "https://exemplo.com/pronunciation.mp3" : "https://exemplo.com/pronuncia.mp3"}
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Upload Local MP3 Button */}
                  <button
                    type="button"
                    onClick={() => audioFileInputRef.current?.click()}
                    disabled={isConvertingAudio}
                    className="px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
                    title={isEn ? "Upload local MP3 file to embed in HTML" : "Subir arquivo MP3 do computador para incorporar no HTML"}
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isEn ? 'Upload MP3' : 'Subir MP3'}</span>
                  </button>

                  {/* Embed Audio URL Button */}
                  {currentCard.audioUrl && !currentCard.audioUrl.startsWith('data:') && (
                    <button
                      type="button"
                      onClick={handleEmbedAudioUrl}
                      disabled={isConvertingAudio}
                      className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm shadow-blue-500/20 disabled:opacity-50"
                      title={isEn ? "Download & embed MP3 directly in HTML code" : "Incorporar áudio MP3 permanentemente no código HTML"}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isEn ? 'Embed in HTML' : 'Incorporar no HTML'}</span>
                    </button>
                  )}
                </div>

                {/* Audio Status & Preview Controls */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={handleTestAudio}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        isPlayingAudio
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20'
                      }`}
                      title={isEn ? "Test pronunciation" : "Testar pronúncia"}
                    >
                      {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-stone-900">
                          {currentCard.audioUrl
                            ? (currentCard.audioUrl.startsWith('data:')
                                ? (isEn ? 'Embedded MP3 (Base64)' : 'Áudio MP3 Incorporado (Base64)')
                                : (isEn ? 'Custom Audio URL' : 'URL de Áudio Vinculada'))
                            : (isEn ? 'Native Speech Engine (TTS)' : 'Síntese de Voz Nativa (TTS)')}
                        </span>
                        {currentCard.audioUrl && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {currentCard.audioUrl.startsWith('data:') ? '100% Offline' : 'Online'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5 font-mono" title={currentCard.audioUrl || 'Default voice'}>
                        {currentCard.audioUrl
                          ? (currentCard.audioUrl.startsWith('data:')
                              ? `${Math.round(currentCard.audioUrl.length / 1024)} KB data:audio`
                              : currentCard.audioUrl)
                          : (isEn ? 'Automatic fallback: Web Speech API (en-US)' : 'Padrão: Web Speech API nativa em inglês')}
                      </p>
                    </div>
                  </div>

                  {currentCard.audioUrl && (
                    <button
                      type="button"
                      onClick={() => onUpdateCard(safeIndex, { audioUrl: undefined })}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-stone-200/50 transition-colors self-end sm:self-auto text-xs flex items-center gap-1"
                      title={isEn ? "Remove custom audio (revert to TTS)" : "Remover áudio (voltar para síntese de voz)"}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="sm:hidden">{isEn ? 'Remove' : 'Remover'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* 3. Palavra em Inglês e Respostas */}
            <div className="space-y-4">
              <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                {isEn ? '3. Target Word & Accepted Answers' : '3. Palavra e Respostas Aceitas'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isEn ? 'Correct English Word' : 'Palavra em Inglês (Correta)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentCard.targetWord}
                    onChange={(e) => onUpdateCard(safeIndex, { targetWord: e.target.value })}
                    placeholder="Ex: Apple, Bicycle, Guitar"
                    required
                    className="w-full px-3 py-2 text-sm font-semibold bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    {isEn ? 'Exact answer expected from student.' : 'O nome exato esperado do aluno.'}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isEn ? 'Portuguese Translation' : 'Tradução em Português'}
                  </label>
                  <input
                    type="text"
                    value={currentCard.translationPt || ''}
                    onChange={(e) => onUpdateCard(safeIndex, { translationPt: e.target.value })}
                    placeholder="Ex: Maçã, Bicicleta, Violão"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    {isEn ? 'Displayed on correct answer or hint.' : 'Exibida ao acertar ou na dica.'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isEn ? 'Accepted Alternate Answers (Comma separated)' : 'Respostas Alternativas Aceitas (Separadas por vírgula)'}
                </label>
                <input
                  type="text"
                  value={(currentCard.acceptableAnswers || []).join(', ')}
                  onChange={(e) =>
                    onUpdateCard(safeIndex, {
                      acceptableAnswers: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Ex: Bike, Vintage bicycle, Cycle"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  {isEn
                    ? 'Synonyms or accepted variations so the student is not penalized for valid alternatives.'
                    : 'Sinônimos aceitos para que o aluno não seja prejudicado por variações válidas.'}
                </p>
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* 4. Recursos Pedagógicos (Dica, Fonética e Frase de Exemplo) */}
            <div className="space-y-4">
              <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                {isEn ? '4. Pedagogical Support & Phonetics' : '4. Apoio Pedagógico & Fonética'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isEn ? 'Phonetic Guide' : 'Guia Fonético (Pronúncia)'}
                  </label>
                  <input
                    type="text"
                    value={currentCard.phonetic || ''}
                    onChange={(e) => onUpdateCard(safeIndex, { phonetic: e.target.value })}
                    placeholder="Ex: /ˈæp.əl/"
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isEn ? 'Text Hint' : 'Dica em Texto'}
                  </label>
                  <input
                    type="text"
                    value={currentCard.hint || ''}
                    onChange={(e) => onUpdateCard(safeIndex, { hint: e.target.value })}
                    placeholder="Ex: Uma fruta redonda vermelha ou verde."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isEn ? 'Example Sentence in Context' : 'Frase de Exemplo em Contexto'}
                </label>
                <input
                  type="text"
                  value={currentCard.exampleSentence || ''}
                  onChange={(e) => onUpdateCard(safeIndex, { exampleSentence: e.target.value })}
                  placeholder="Ex: She eats a red apple every morning."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Deck Management */}
        {activeTab === 'deck' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  {isEn ? `Widget Cards (${cards.length})` : `Cards do Widget (${cards.length})`}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isEn ? 'Add as many cards as you want. Students can navigate between them.' : 'Adicione quantos cards desejar. O widget permite navegar entre eles.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onAddCard}
                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? 'New Card' : 'Novo Card'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {cards.map((card, idx) => (
                <div
                  key={card.id}
                  onClick={() => {
                    onSelectCard(idx);
                    setActiveTab('card');
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    idx === activeCardIndex
                      ? 'border-blue-600 bg-blue-50/50 shadow-2xs ring-1 ring-blue-600/30'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.targetWord}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <FileImage className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {card.targetWord || 'Sem palavra'}
                        </span>
                        {card.translationPt && (
                          <span className="text-xs text-stone-500">· {card.translationPt}</span>
                        )}
                        {card.audioUrl && (
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-200">
                            MP3
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">
                        Card #{idx + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCard(idx);
                        setActiveTab('card');
                      }}
                      className="p-1.5 text-stone-500 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      title={isEn ? "Edit this card" : "Editar este card"}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {cards.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCard(idx);
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 transition-colors"
                        title={isEn ? "Delete card" : "Remover card"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Widget Appearance & Config */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Language Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                  {config.language === 'en' ? 'Widget UI Language' : 'Idioma da Interface do Widget'}
                </label>
                <span className="text-xs text-stone-500">
                  {config.language === 'en' ? 'All text in English or Portuguese' : 'Todo o texto em Inglês ou Português'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const update: Partial<WidgetConfig> = { language: 'pt' };
                    if (config.title === 'Image and Word') update.title = 'Figura e Palavra';
                    if (config.subtitle === 'Look at the image and write the corresponding word in English.') {
                      update.subtitle = 'Observe a imagem e escreva a palavra correspondente em inglês.';
                    }
                    onUpdateConfig(update);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    config.language !== 'en'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'
                  }`}
                >
                  <span className="text-lg">🇧🇷</span>
                  <div>
                    <span className="text-xs font-bold block">Português</span>
                    <span className="text-[10px] opacity-75">Figura e Palavra · Dica · Verificar</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const update: Partial<WidgetConfig> = { language: 'en' };
                    if (!config.title || config.title === 'Figura e Palavra') update.title = 'Image and Word';
                    if (!config.subtitle || config.subtitle === 'Observe a imagem e escreva a palavra correspondente em inglês.') {
                      update.subtitle = 'Look at the image and write the corresponding word in English.';
                    }
                    onUpdateConfig(update);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    config.language === 'en'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'
                  }`}
                >
                  <span className="text-lg">🇺🇸</span>
                  <div>
                    <span className="text-xs font-bold block">English (100% in English)</span>
                    <span className="text-[10px] opacity-75">Image and Word · Tip · Check Answer</span>
                  </div>
                </button>
              </div>
            </div>

            <hr className="border-stone-100" />

            <div>
              <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block mb-2">
                {config.language === 'en' ? 'Visual Theme' : 'Tema Visual do Widget'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {themeOptions.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdateConfig({ theme: t.id })}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      config.theme === t.id
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xs font-bold">{t.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-sm border inline-block ${t.preview}`}
                    >
                      {config.language === 'en' ? 'Preview' : 'Exemplo'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* Header Texts & Visibility Toggles */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                  {config.language === 'en' ? 'Header Texts & Display Options' : 'Textos e Exibição do Cabeçalho'}
                </label>
                <span className="text-xs text-stone-500">
                  {config.language === 'en' ? 'Toggle header visibility' : 'Personalize a exibição'}
                </span>
              </div>

              {/* Toggle 1: Show/Hide Header Texts (Title & Subtitle) */}
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-stone-900 block flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-blue-600" />
                    <span>{config.language === 'en' ? 'Show Header Title & Subtitle' : 'Exibir Título e Subtítulo do Cabeçalho'}</span>
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {config.language === 'en'
                      ? 'Display "Image and Word" and instructional text above the card.'
                      : 'Exibe "Image and Word / Look at the image..." no topo do card.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showHeaderTexts !== false}
                  onChange={(e) => onUpdateConfig({ showHeaderTexts: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
              </label>

              {/* Toggle 2: Show/Hide Slide Counter (1 / 4) */}
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-stone-900 block flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-blue-600" />
                    <span>{config.language === 'en' ? 'Show Slide Counter (1 / 4)' : 'Exibir Contador de Slides (1 / 4)'}</span>
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {config.language === 'en'
                      ? 'Displays the current slide status badge in the top-right corner.'
                      : 'Exibe a contagem de posição do card atual (ex: 1 / 4).'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showSlideCounter !== false}
                  onChange={(e) => onUpdateConfig({ showSlideCounter: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
              </label>

              {config.showHeaderTexts !== false && (
                <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {config.language === 'en' ? 'Widget Title' : 'Título do Widget'}
                    </label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => onUpdateConfig({ title: e.target.value })}
                      placeholder={config.language === 'en' ? 'Image and Word' : 'Figura e Palavra'}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {config.language === 'en' ? 'Subtitle / Instruction' : 'Subtítulo / Instrução'}
                    </label>
                    <input
                      type="text"
                      value={config.subtitle}
                      onChange={(e) => onUpdateConfig({ subtitle: e.target.value })}
                      placeholder={config.language === 'en' ? 'Look at the image and write the corresponding word in English.' : 'Observe a imagem e escreva a palavra correspondente em inglês.'}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            <hr className="border-stone-100" />

            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                {config.language === 'en' ? 'Behavior & Accessibility' : 'Comportamento & Acessibilidade'}
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-stone-900 block">
                    {config.language === 'en' ? 'Audio Pronunciation Button (TTS / MP3)' : 'Botão de Pronúncia em Áudio (TTS / MP3)'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {config.language === 'en' ? 'Plays custom MP3 audio or falls back to native Web Speech voice.' : 'Toca o MP3 personalizado do card ou usa síntese de voz nativa.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showAudio}
                  onChange={(e) => onUpdateConfig({ showAudio: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-stone-900 block">
                    {config.language === 'en' ? 'Progressive Tip / Hint Button' : 'Botão de Dica Progressiva'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {config.language === 'en' ? 'Reveals letter hints and translation to assist learning.' : 'Revela primeiras letras e significado para ajudar o aluno.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showHintButton}
                  onChange={(e) => onUpdateConfig({ showHintButton: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-stone-900 block">
                    {config.language === 'en' ? 'Progress Bar' : 'Barra de Progresso'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {config.language === 'en' ? 'Shows linear progress bar at the top of the card.' : 'Exibe barra de progresso linear no topo.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showProgressBar}
                  onChange={(e) => onUpdateConfig({ showProgressBar: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-stone-900 block">
                    {config.language === 'en' ? 'Sound Effects (Chimes)' : 'Efeitos Sonoros (Chimes)'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {config.language === 'en' ? 'Smooth synthesized tones on correct/mistake answers.' : 'Sons sintetizados suaves ao acertar ou errar.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableSoundEffects}
                  onChange={(e) => onUpdateConfig({ enableSoundEffects: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-stone-900 block">
                    {config.language === 'en' ? 'Show Translation on Success' : 'Mostrar Tradução ao Acertar'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {config.language === 'en' ? 'Reinforces cognitive retention of the vocabulary.' : 'Reforça a fixação cognitiva do vocabulário.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showTranslationOnSuccess}
                  onChange={(e) => onUpdateConfig({ showTranslationOnSuccess: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-stone-900 block">
                    {config.language === 'en' ? 'Case Sensitive Verification' : 'Diferenciar Maiúsculas e Minúsculas'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {config.language === 'en' ? 'Disabled by default for spelling tolerance.' : 'Desativado por padrão para maior tolerância ortográfica.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.caseSensitive}
                  onChange={(e) => onUpdateConfig({ caseSensitive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
