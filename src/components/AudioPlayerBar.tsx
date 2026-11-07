import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  X, 
  Volume2, 
  Loader2,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';
import { 
  SURAHS, 
  RECITERS, 
  Reciter, 
  getAyahAudioUrl 
} from '../data/quranMetadata';

export interface AudioPlayRequest {
  surahId: number;
  ayatNumber: number;
  mode: 'single-ayat' | 'page' | 'continuous';
  endVerse?: number;
  pageNumber?: number;
}

interface AudioPlayerBarProps {
  request: AudioPlayRequest | null;
  onClose: () => void;
  onPageChange?: (newPage: number) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  request,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSurahId, setCurrentSurahId] = useState<number>(1);
  const [currentAyat, setCurrentAyat] = useState<number>(1);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]);
  const [loopAyat, setLoopAyat] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReciterMenuOpen, setIsReciterMenuOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-minimize on mobile so Mushaf reading is unobstructed
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    return window.innerWidth < 640;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentModeRef = useRef<'single-ayat' | 'page' | 'continuous'>('continuous');
  const endVerseRef = useRef<number | undefined>(undefined);

  const activeSurah = SURAHS.find(s => s.id === currentSurahId) || SURAHS[0];

  // Initialize or update request
  useEffect(() => {
    if (!request) return;

    setCurrentSurahId(request.surahId);
    setCurrentAyat(request.ayatNumber);
    currentModeRef.current = request.mode;
    endVerseRef.current = request.endVerse;

    // Auto play on new request
    playAyat(request.surahId, request.ayatNumber, selectedReciter.folder);
  }, [request]);

  const playAyat = (surahId: number, ayat: number, reciterFolder: string) => {
    setIsLoading(true);
    setError(null);

    const url = getAyahAudioUrl(surahId, ayat, reciterFolder);

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    } else {
      audioRef.current.pause();
      audioRef.current.src = url;
    }

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Audio play error:', err);
        setError('Audio playback failed or network blocked');
        setIsLoading(false);
        setIsPlaying(false);
      });
  };

  const handleNextAyat = useCallback(() => {
    const surah = SURAHS.find(s => s.id === currentSurahId);
    if (!surah) return;

    // Check if in page mode and reached end verse
    if (currentModeRef.current === 'page' && endVerseRef.current && currentAyat >= endVerseRef.current) {
      setIsPlaying(false);
      return;
    }

    if (currentAyat < surah.totalVerses) {
      const nextAyat = currentAyat + 1;
      setCurrentAyat(nextAyat);
      playAyat(currentSurahId, nextAyat, selectedReciter.folder);
    } else if (currentSurahId < 114 && currentModeRef.current === 'continuous') {
      // Advance to next Surah
      const nextSurah = currentSurahId + 1;
      setCurrentSurahId(nextSurah);
      setCurrentAyat(1);
      playAyat(nextSurah, 1, selectedReciter.folder);
    } else {
      setIsPlaying(false);
    }
  }, [currentSurahId, currentAyat, selectedReciter]);

  const handlePrevAyat = () => {
    if (currentAyat > 1) {
      const prevAyat = currentAyat - 1;
      setCurrentAyat(prevAyat);
      playAyat(currentSurahId, prevAyat, selectedReciter.folder);
    } else if (currentSurahId > 1 && currentModeRef.current === 'continuous') {
      const prevSurahId = currentSurahId - 1;
      const prevSurah = SURAHS.find(s => s.id === prevSurahId);
      if (prevSurah) {
        setCurrentSurahId(prevSurahId);
        setCurrentAyat(prevSurah.totalVerses);
        playAyat(prevSurahId, prevSurah.totalVerses, selectedReciter.folder);
      }
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) {
      playAyat(currentSurahId, currentAyat, selectedReciter.folder);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          playAyat(currentSurahId, currentAyat, selectedReciter.folder);
        });
    }
  };

  // Wire up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (loopAyat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (currentModeRef.current === 'single-ayat') {
        setIsPlaying(false);
      } else {
        handleNextAyat();
      }
    };

    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [loopAyat, handleNextAyat]);

  // Handle reciter change
  const handleReciterChange = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    setIsReciterMenuOpen(false);
    if (isPlaying) {
      playAyat(currentSurahId, currentAyat, reciter.folder);
    }
  };

  // Cleanup on unmount or close
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    onClose();
  };

  if (!request) return null;

  return (
    <>
      {/* Mobile Reciter Selection Bottom Sheet Backdrop */}
      {isReciterMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsReciterMenuOpen(false)}
        >
          <div 
            className="w-full sm:max-w-md bg-[#03241b] border-t-2 sm:border-2 border-[#d4af37] rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl max-h-[75vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/30">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#d4af37]" />
                <h3 className="font-bold text-sm text-[#d4af37]">Choose Reciter (القراء)</h3>
              </div>
              <button 
                onClick={() => setIsReciterMenuOpen(false)}
                className="p-1 rounded-lg text-emerald-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto py-2 space-y-1.5 custom-scrollbar">
              {RECITERS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleReciterChange(r)}
                  className={`w-full p-3 rounded-xl text-left text-xs sm:text-sm flex items-center justify-between transition-all ${
                    selectedReciter.id === r.id
                      ? 'bg-[#d4af37] text-gray-950 font-bold shadow-md'
                      : 'bg-white/5 text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="font-arabic text-sm opacity-80" dir="rtl">{r.arabicName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Audio Player */}
      <div 
        className={`fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-out ${
          isMinimized 
            ? 'w-[94%] max-w-lg' 
            : 'w-[95%] max-w-2xl'
        }`}
      >
        <div className="bg-[#03241b]/95 backdrop-blur-md rounded-2xl border-2 border-[#d4af37] shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-2.5 sm:p-3 text-white">
          {/* ===================== MINI MODE (COMPACT MOBILE BAR) ===================== */}
          {isMinimized ? (
            <div className="flex items-center justify-between gap-2">
              {/* Left: Info & Tap to expand */}
              <button
                onClick={() => setIsMinimized(false)}
                className="flex items-center gap-2 text-left flex-1 min-w-0 group"
                title="Tap to expand full audio controls"
              >
                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] shrink-0">
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin text-[#d4af37]" />
                  ) : (
                    <Volume2 size={16} className={isPlaying ? 'animate-pulse text-[#d4af37]' : 'text-gray-400'} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-arabic text-xs sm:text-sm text-[#d4af37] font-bold">
                      {activeSurah.name}
                    </span>
                    <span className="text-xs font-semibold text-white truncate">
                      {activeSurah.transliteration}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-300/80 font-mono flex items-center gap-1">
                    <span>Ayat {currentAyat}/{activeSurah.totalVerses}</span>
                    <span className="hidden sm:inline">• {selectedReciter.name.split(' ')[0]}</span>
                  </div>
                </div>
              </button>

              {/* Right: Compact Playback Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handlePrevAyat}
                  disabled={currentAyat <= 1 && currentSurahId <= 1}
                  className="p-1.5 rounded-lg text-emerald-300 hover:text-white disabled:opacity-30 transition-colors"
                  title="Previous Ayat"
                >
                  <SkipBack size={16} />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} className="ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNextAyat}
                  disabled={currentAyat >= activeSurah.totalVerses && currentSurahId >= 114}
                  className="p-1.5 rounded-lg text-emerald-300 hover:text-white disabled:opacity-30 transition-colors"
                  title="Next Ayat"
                >
                  <SkipForward size={16} />
                </button>

                {/* Expand Button */}
                <button
                  onClick={() => setIsMinimized(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d4af37] transition-colors ml-0.5"
                  title="Expand audio controls"
                >
                  <ChevronUp size={16} />
                </button>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-1.5 text-emerald-400/80 hover:text-white transition-colors"
                  title="Close Audio Player"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* ===================== EXPANDED MODE (FULL CONTROLS) ===================== */
            <div className="flex flex-col gap-2.5">
              {/* Header Row: Title, Mode & Collapse */}
              <div className="flex items-center justify-between text-xs border-b border-[#d4af37]/30 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] shrink-0">
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin text-[#d4af37]" />
                    ) : (
                      <Volume2 size={16} className={isPlaying ? 'animate-pulse text-[#d4af37]' : 'text-gray-400'} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-1 font-semibold">
                      <span className="font-arabic text-sm text-[#d4af37]">{activeSurah.name}</span>
                      <span className="text-white text-xs sm:text-sm">({activeSurah.transliteration})</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-900 border border-emerald-700 text-[#d4af37] font-mono text-[10px] sm:text-[11px]">
                        Ayat {currentAyat} / {activeSurah.totalVerses}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-300/70 truncate">
                      {currentModeRef.current === 'page' && endVerseRef.current
                        ? `Playing Page mode (Ayats ${request.ayatNumber}–${endVerseRef.current})`
                        : currentModeRef.current === 'single-ayat'
                        ? `Single Ayat • ${loopAyat ? 'Repeating' : 'Plays Once'}`
                        : `Continuous Recitation • ${selectedReciter.name}`}
                    </div>
                  </div>
                </div>

                {/* Actions: Collapse & Close */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d4af37] transition-colors"
                    title="Collapse to mini player"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Close Audio Player"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Middle Row: Reciter Button, Loop Toggle, & Ayat Dropdown */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Reciter trigger */}
                <button
                  onClick={() => setIsReciterMenuOpen(true)}
                  className="flex-1 sm:flex-initial min-w-[140px] px-2.5 py-1.5 rounded-xl bg-[#064e3b] border border-[#d4af37]/60 text-emerald-100 text-xs font-medium flex items-center justify-between gap-1.5 hover:bg-[#08674e] transition-colors"
                  title="Change Reciter"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <User size={13} className="text-[#d4af37] shrink-0" />
                    <span className="truncate">{selectedReciter.name}</span>
                  </div>
                  <ChevronDown size={13} className="text-emerald-400 shrink-0" />
                </button>

                <div className="flex items-center gap-2">
                  {/* Loop / Repeat Toggle */}
                  <button
                    onClick={() => setLoopAyat(!loopAyat)}
                    className={`px-2.5 py-1.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 active:scale-95 ${
                      loopAyat 
                        ? 'bg-[#d4af37] text-gray-950 border-[#fde047] font-bold shadow-md' 
                        : 'bg-[#064e3b] text-emerald-300 border-[#d4af37]/40 hover:bg-[#08674e]'
                    }`}
                    title={loopAyat ? 'Repeat enabled: Repeating current Ayat' : 'Click to repeat current Ayat'}
                  >
                    {loopAyat ? <Repeat1 size={14} /> : <Repeat size={14} />}
                    <span className="text-[11px] font-medium">{loopAyat ? 'Loop On' : 'Loop'}</span>
                  </button>

                  {/* Ayat Jumper Dropdown */}
                  <div className="flex items-center gap-1">
                    <select
                      value={currentAyat}
                      onChange={(e) => {
                        const newAyat = parseInt(e.target.value, 10);
                        setCurrentAyat(newAyat);
                        playAyat(currentSurahId, newAyat, selectedReciter.folder);
                      }}
                      className="px-2.5 py-1.5 bg-[#021d15] border border-[#d4af37]/60 rounded-xl text-xs font-mono font-bold text-[#d4af37] focus:outline-none"
                    >
                      {Array.from({ length: activeSurah.totalVerses }, (_, i) => i + 1).map((v) => (
                        <option key={v} value={v} className="bg-[#021d15] text-white">
                          Ayat {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Ergonomic Big Playback Controls */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  onClick={handlePrevAyat}
                  disabled={currentAyat <= 1 && currentSurahId <= 1}
                  className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center hover:bg-[#08674e] active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="Previous Ayat"
                >
                  <SkipBack size={18} />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isLoading ? (
                    <Loader2 size={22} className="animate-spin text-gray-950" />
                  ) : isPlaying ? (
                    <Pause size={22} />
                  ) : (
                    <Play size={22} className="ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNextAyat}
                  disabled={currentAyat >= activeSurah.totalVerses && currentSurahId >= 114}
                  className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center hover:bg-[#08674e] active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="Next Ayat"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {error && (
                <p className="text-[10px] text-red-400 text-center">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
