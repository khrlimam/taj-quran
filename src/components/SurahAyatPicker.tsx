import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Layers, 
  Compass, 
  Bookmark as BookmarkIcon, 
  Check, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Play,
  Moon,
  Sparkles,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { SURAHS, JUZ_LIST, getPdfPageForAyat, Surah, Bookmark } from '../data/quranMetadata';
import { LUNAR_AJZA } from '../data/lunarAjzaData';
import { HijriDateInfo } from '../hooks/useLunarRecitation';

interface SurahAyatPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToPage: (pdfPage: number) => void;
  onPlayAyat?: (surahId: number, ayatNumber: number, mode: 'single-ayat' | 'continuous') => void;
  bookmarks: Bookmark[];
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmarkNote: (id: string, note: string) => void;
  currentPdfPage: number;
  isJuzRecited?: (day: number) => boolean;
  onToggleJuzRecited?: (day: number) => void;
  effectiveDay?: number;
  hijriDate?: HijriDateInfo;
}

export const SurahAyatPicker: React.FC<SurahAyatPickerProps> = ({
  isOpen,
  onClose,
  onJumpToPage,
  onPlayAyat,
  bookmarks,
  onRemoveBookmark,
  onUpdateBookmarkNote,
  currentPdfPage,
  isJuzRecited,
  onToggleJuzRecited,
  effectiveDay,
  hijriDate
}) => {
  const [activeTab, setActiveTab] = useState<'surah' | 'lunar' | 'juz' | 'page' | 'bookmarks'>('surah');
  const [expandedLunarNote, setExpandedLunarNote] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayatAction, setAyatAction] = useState<'jump' | 'single-audio' | 'continuous-audio'>('jump');
  const [customPageInput, setCustomPageInput] = useState(currentPdfPage.toString());
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Filtered surahs
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return SURAHS;
    const query = searchQuery.toLowerCase().trim();
    return SURAHS.filter(s => 
      s.id.toString() === query ||
      s.name.includes(query) ||
      s.transliteration.toLowerCase().includes(query) ||
      s.translation.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSelectSurah = (surah: Surah) => {
    setSelectedSurah(selectedSurah?.id === surah.id ? null : surah);
  };

  const handleJumpToAyat = (surahId: number, verse: number) => {
    const targetPage = getPdfPageForAyat(surahId, verse);
    onJumpToPage(targetPage);
    onClose();
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(customPageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= 489) {
      onJumpToPage(page);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#06382b] text-white rounded-2xl shadow-2xl border-2 border-[#d4af37] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#03241b] border-b border-[#d4af37]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
              <Compass size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#d4af37] tracking-wide">
                Quran Navigator
              </h2>
              <p className="text-[11px] text-emerald-200/70">
                18-Line Taj Company Quran (489 Pages)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs - Horizontally scrollable on mobile */}
        <div className="flex border-b border-[#d4af37]/30 bg-[#042d22] px-2 pt-1 gap-1 overflow-x-auto no-scrollbar flex-nowrap">
          <button
            onClick={() => setActiveTab('surah')}
            className={`shrink-0 whitespace-nowrap py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'surah'
                ? 'bg-[#06382b] text-[#d4af37] border-t-2 border-[#d4af37]'
                : 'text-emerald-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen size={15} />
            <span>Surahs (114)</span>
          </button>

          <button
            onClick={() => setActiveTab('lunar')}
            className={`shrink-0 whitespace-nowrap py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'lunar'
                ? 'bg-[#06382b] text-[#d4af37] border-t-2 border-[#d4af37]'
                : 'text-emerald-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Moon size={15} />
            <span>Lunar Ajza</span>
          </button>

          <button
            onClick={() => setActiveTab('juz')}
            className={`shrink-0 whitespace-nowrap py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'juz'
                ? 'bg-[#06382b] text-[#d4af37] border-t-2 border-[#d4af37]'
                : 'text-emerald-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={15} />
            <span>Paras (30)</span>
          </button>

          <button
            onClick={() => setActiveTab('page')}
            className={`shrink-0 whitespace-nowrap py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'page'
                ? 'bg-[#06382b] text-[#d4af37] border-t-2 border-[#d4af37]'
                : 'text-emerald-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <ExternalLink size={15} />
            <span>Jump Page</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`shrink-0 whitespace-nowrap py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-[#06382b] text-[#d4af37] border-t-2 border-[#d4af37]'
                : 'text-emerald-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookmarkIcon size={15} />
            <span>Bookmarks ({bookmarks.length})</span>
          </button>
        </div>

        {/* Tab 1: Surah & Ayat Picker */}
        {activeTab === 'surah' && (
          <div className="flex flex-col flex-1 overflow-hidden p-3 sm:p-4">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
              <input
                type="text"
                placeholder="Search Surah by name (e.g. Yasin, Kahf, البقرة) or number (1-114)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#021d15] border border-[#d4af37]/40 rounded-xl text-sm text-white placeholder-emerald-400/50 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-300 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Surah List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[55vh]">
              {filteredSurahs.map((surah) => {
                const isSelected = selectedSurah?.id === surah.id;

                return (
                  <div
                    key={surah.id}
                    className={`rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-[#03241b] border-[#d4af37] shadow-md' 
                        : 'bg-[#042d22] border-emerald-800/60 hover:border-[#d4af37]/50'
                    }`}
                  >
                    {/* Surah Summary Card */}
                    <div 
                      onClick={() => handleSelectSurah(surah)}
                      className="p-3 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        {/* Number Badge */}
                        <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/70 flex items-center justify-center font-bold text-xs text-[#d4af37]">
                          {surah.id}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">
                              {surah.transliteration}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-mono">
                              {surah.type}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-300/70">
                            {surah.translation} • {surah.totalVerses} Ayats • Para {surah.para}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-arabic text-xl font-bold text-[#d4af37]">
                          {surah.name}
                        </span>
                        <ChevronRight
                          size={18}
                          className={`text-emerald-400 transition-transform ${isSelected ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Expanded Ayat Selector */}
                    {isSelected && (
                      <div className="px-3 pb-3 pt-2 border-t border-emerald-800/80 bg-[#021d15] rounded-b-xl animate-fadeIn">
                        {/* Action buttons & mode switcher */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-emerald-900/60">
                          {/* Mode selector */}
                          <div className="flex items-center gap-1 bg-[#01140e] p-1 rounded-lg border border-emerald-800/60 text-[11px]">
                            <span className="text-emerald-400/80 px-1 font-medium">Click Ayat:</span>
                            <button
                              onClick={() => setAyatAction('jump')}
                              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                                ayatAction === 'jump' 
                                  ? 'bg-[#d4af37] text-gray-950 font-bold' 
                                  : 'text-emerald-200 hover:text-white'
                              }`}
                            >
                              📖 Jump Page
                            </button>
                            <button
                              onClick={() => setAyatAction('single-audio')}
                              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                                ayatAction === 'single-audio' 
                                  ? 'bg-[#d4af37] text-gray-950 font-bold' 
                                  : 'text-emerald-200 hover:text-white'
                              }`}
                            >
                              🔊 Play Single Ayat
                            </button>
                            <button
                              onClick={() => setAyatAction('continuous-audio')}
                              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                                ayatAction === 'continuous-audio' 
                                  ? 'bg-[#d4af37] text-gray-950 font-bold' 
                                  : 'text-emerald-200 hover:text-white'
                              }`}
                            >
                              ▶ Continuous
                            </button>
                          </div>

                          {/* Quick Surah actions */}
                          <div className="flex items-center gap-1.5">
                            {onPlayAyat && (
                              <button
                                onClick={() => {
                                  onPlayAyat(surah.id, 1, 'continuous');
                                  onClose();
                                }}
                                className="px-2.5 py-1 text-xs rounded-md bg-[#064e3b] text-[#d4af37] border border-[#d4af37]/60 font-semibold hover:bg-[#08674e] transition-colors flex items-center gap-1"
                              >
                                <Play size={12} />
                                <span>Play Surah</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                onJumpToPage(surah.startPdfPage);
                                onClose();
                              }}
                              className="px-2.5 py-1 text-xs rounded-md bg-[#d4af37] text-gray-900 font-bold hover:bg-[#fde047] transition-colors"
                            >
                              Read (Pg {surah.startPrintedPage})
                            </button>
                          </div>
                        </div>

                        {/* Ayat Grid */}
                        <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 sm:gap-2 max-h-48 overflow-y-auto p-1.5 bg-[#01140e] rounded-lg custom-scrollbar">
                          {Array.from({ length: surah.totalVerses }, (_, i) => i + 1).map((verse) => (
                            <button
                              key={verse}
                              onClick={() => {
                                if (ayatAction === 'jump') {
                                  handleJumpToAyat(surah.id, verse);
                                } else if (ayatAction === 'single-audio') {
                                  onPlayAyat?.(surah.id, verse, 'single-ayat');
                                  onClose();
                                } else {
                                  onPlayAyat?.(surah.id, verse, 'continuous');
                                  onClose();
                                }
                              }}
                              className={`h-8 sm:h-9 flex items-center justify-center text-center text-xs font-mono font-bold rounded-lg transition-all active:scale-90 ${
                                ayatAction === 'single-audio'
                                  ? 'bg-amber-950/60 text-amber-200 hover:bg-[#d4af37] hover:text-gray-900 border border-amber-800/40'
                                  : ayatAction === 'continuous-audio'
                                  ? 'bg-blue-950/60 text-blue-200 hover:bg-[#d4af37] hover:text-gray-900 border border-blue-800/40'
                                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-[#d4af37] hover:text-gray-900 border border-emerald-800/40'
                              }`}
                              title={
                                ayatAction === 'single-audio' 
                                  ? `Play audio for Ayat ${verse}` 
                                  : ayatAction === 'continuous-audio'
                                  ? `Play audio continuously starting from Ayat ${verse}`
                                  : `Jump to page with Ayat ${verse}`
                              }
                            >
                              {verse}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Lunar Ajza (from ajza.pdf) */}
        {activeTab === 'lunar' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 max-h-[60vh] space-y-3 custom-scrollbar">
            <div className="p-3 rounded-xl bg-[#032018] border border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#d4af37] flex items-center gap-1.5">
                    <Moon size={14} /> 30 Lunar Ajza (Monthly Recitation)
                  </span>
                  {hijriDate && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-emerald-200">
                      {hijriDate.formatted}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-300/70 mt-0.5">
                  Recite one complete Juz per lunar date. Each Juz consists of complete unbroken Surahs.
                </p>
              </div>

              {effectiveDay && (
                <button
                  onClick={() => {
                    const today = LUNAR_AJZA[effectiveDay - 1];
                    if (today) {
                      onJumpToPage(today.startPdfPage);
                      onClose();
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold text-xs shadow hover:brightness-110 transition-all self-start sm:self-auto"
                >
                  Go to Today's Juz (Day {effectiveDay})
                </button>
              )}
            </div>

            <div className="space-y-2">
              {LUNAR_AJZA.map((juz) => {
                const isToday = juz.day === effectiveDay;
                const recited = isJuzRecited ? isJuzRecited(juz.day) : false;
                const isExpandedNote = expandedLunarNote === juz.day;
                const hasNote = Boolean(juz.scholarlyNote);

                return (
                  <div
                    key={juz.day}
                    className={`rounded-xl border transition-all ${
                      isToday
                        ? 'bg-gradient-to-r from-[#074735] to-[#043326] border-[#d4af37] shadow-lg ring-1 ring-[#d4af37]/40'
                        : recited
                        ? 'bg-[#032a20]/80 border-emerald-500/40'
                        : 'bg-[#042d22] border-emerald-800/60 hover:border-[#d4af37]/40'
                    }`}
                  >
                    <div className="p-2.5 sm:p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-1">
                        {onToggleJuzRecited && (
                          <button
                            onClick={() => onToggleJuzRecited(juz.day)}
                            className="p-1 text-gray-400 hover:text-[#d4af37] transition-colors"
                            title={recited ? 'Mark as Pending' : 'Mark as Recited'}
                          >
                            {recited ? (
                              <CheckCircle2 size={18} className="text-emerald-400" />
                            ) : (
                              <Circle size={18} />
                            )}
                          </button>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span className="text-xs font-bold text-[#d4af37]">
                              Day {juz.day}
                            </span>
                            {isToday && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#d4af37] text-gray-950 uppercase">
                                Today
                              </span>
                            )}
                            {recited && (
                              <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300">
                                Recited
                              </span>
                            )}
                            <span className="text-xs text-white font-medium">
                              • {juz.title}
                            </span>
                          </div>

                          <div className="text-[11px] text-emerald-200 mt-0.5">
                            {juz.surahNames.join(', ')} ({juz.totalVerses} verses • Pages {juz.startPrintedPage}–{juz.endPrintedPage})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {hasNote && (
                          <button
                            onClick={() => setExpandedLunarNote(isExpandedNote ? null : juz.day)}
                            className="p-1 text-[#d4af37] hover:text-white transition-colors"
                            title="View Scholar Reflection"
                          >
                            <Sparkles size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onJumpToPage(juz.startPdfPage);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs rounded-md bg-[#d4af37] text-gray-900 font-bold hover:bg-[#fde047] transition-colors"
                        >
                          Read
                        </button>
                      </div>
                    </div>

                    {hasNote && isExpandedNote && juz.scholarlyNote && (
                      <div className="px-3 pb-2.5 pt-1 border-t border-[#d4af37]/20 bg-black/30 rounded-b-xl text-xs space-y-1.5 animate-fadeIn">
                        <div className="font-semibold text-[#d4af37] text-[11px] flex items-center gap-1">
                          <Sparkles size={12} /> {juz.scholarlyNote.title}
                        </div>
                        <p className="text-emerald-100/90 text-[11px] italic leading-relaxed">
                          "{juz.scholarlyNote.excerpt}"
                        </p>
                        <div className="text-[10px] text-right text-[#d4af37]/80">
                          — {juz.scholarlyNote.quranReference}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Juz / Para Picker */}
        {activeTab === 'juz' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 max-h-[60vh]">
            <p className="text-xs text-emerald-300/80 mb-3">
              Select any of the 30 Paras (Juz) to open its starting page:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {JUZ_LIST.map((juz) => (
                <button
                  key={juz.id}
                  onClick={() => {
                    onJumpToPage(juz.startPdfPage);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#042d22] border border-emerald-800/60 hover:border-[#d4af37] hover:bg-[#03241b] transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center font-bold text-xs text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-gray-900 transition-colors">
                      {juz.id}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white group-hover:text-[#d4af37] transition-colors">
                        Para {juz.id}: {juz.nameTransliteration}
                      </span>
                      <p className="text-[10px] text-emerald-300/60 font-mono">
                        Page {juz.startPrintedPage} (PDF {juz.startPdfPage})
                      </p>
                    </div>
                  </div>

                  <span className="font-arabic text-base font-bold text-[#d4af37]">
                    {juz.nameArabic}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Direct Page Jump */}
        {activeTab === 'page' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center max-h-[60vh]">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] mb-4">
              <ExternalLink size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Direct Page Jump
            </h3>
            <p className="text-xs text-emerald-300/70 max-w-sm mb-6">
              Enter any printed Quran page (1 - 485) or PDF page (1 - 489) to jump directly into the reading spread.
            </p>

            <form onSubmit={handlePageSubmit} className="w-full max-w-xs space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="489"
                  value={customPageInput}
                  onChange={(e) => setCustomPageInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#021d15] border-2 border-[#d4af37] rounded-xl text-center text-xl font-bold font-mono text-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#fde047]"
                  placeholder="Page #"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Jump
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1"
                max="489"
                value={customPageInput || '1'}
                onChange={(e) => setCustomPageInput(e.target.value)}
                className="w-full accent-[#d4af37] cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-emerald-300/60 font-mono">
                <span>Start (Pg 1)</span>
                <span>Current: {currentPdfPage}</span>
                <span>End (Pg 489)</span>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 max-h-[60vh]">
            {bookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-emerald-300/60">
                <BookmarkIcon size={40} className="mb-2 opacity-40 text-[#d4af37]" />
                <p className="text-sm font-semibold text-white">No Bookmarks Saved Yet</p>
                <p className="text-xs max-w-xs mt-1">
                  While reading, click the bookmark ribbon on any page header or toolbar to save it here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-3 rounded-xl bg-[#042d22] border border-emerald-800/80 hover:border-[#d4af37] transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        onClick={() => {
                          onJumpToPage(bm.pdfPage);
                          onClose();
                        }}
                        className="cursor-pointer flex-1"
                      >
                        <h4 className="font-semibold text-sm text-white hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                          <BookmarkIcon size={14} className="fill-[#d4af37] text-[#d4af37]" />
                          {bm.title}
                        </h4>
                        <p className="text-[11px] text-emerald-300/60">
                          {bm.surahName} • Para {bm.para} • {new Date(bm.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onJumpToPage(bm.pdfPage);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs rounded-md bg-[#d4af37] text-gray-900 font-bold hover:bg-[#fde047] transition-colors"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => onRemoveBookmark(bm.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
                          title="Delete bookmark"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Note section */}
                    {editingNoteId === bm.id ? (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add note (e.g. Daily Tilawah)..."
                          className="flex-1 px-2.5 py-1 bg-[#021d15] border border-emerald-700 rounded text-xs text-white focus:outline-none focus:border-[#d4af37]"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            onUpdateBookmarkNote(bm.id, noteText);
                            setEditingNoteId(null);
                          }}
                          className="p-1 rounded bg-[#d4af37] text-gray-900"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          setEditingNoteId(bm.id);
                          setNoteText(bm.note || '');
                        }}
                        className="text-xs text-emerald-200/80 bg-[#021d15] px-2 py-1 rounded cursor-pointer hover:bg-black/30"
                      >
                        {bm.note ? `Note: "${bm.note}"` : '+ Click to add note / label'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
