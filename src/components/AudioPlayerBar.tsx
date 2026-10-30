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
  ChevronDown
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
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-[#03241b]/95 backdrop-blur-md rounded-2xl border-2 border-[#d4af37] shadow-2xl p-3 text-white flex flex-col gap-2 animate-fadeIn">
      {/* Upper row: Reciter selector & Surah/Ayat Info */}
      <div className="flex items-center justify-between text-xs border-b border-[#d4af37]/30 pb-2">
        <div className="flex items-center gap-2">
          {/* Animated sound icon */}
          <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            {isLoading ? (
              <Loader2 size={15} className="animate-spin text-[#d4af37]" />
            ) : (
              <Volume2 size={15} className={isPlaying ? 'animate-pulse text-[#d4af37]' : 'text-gray-400'} />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="font-arabic text-sm text-[#d4af37]">{activeSurah.name}</span>
              <span className="text-white">({activeSurah.transliteration})</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-900 border border-emerald-700 text-[#d4af37] font-mono text-[11px]">
                Ayat {currentAyat} / {activeSurah.totalVerses}
              </span>
            </div>
            {currentModeRef.current === 'page' && endVerseRef.current && (
              <span className="text-[10px] text-emerald-300/70">
                Playing Page mode (Ayats {request.ayatNumber} - {endVerseRef.current})
              </span>
            )}
            {currentModeRef.current === 'single-ayat' && (
              <span className="text-[10px] text-emerald-300/70">
                Playing Single Ayat {loopAyat ? '• Repeated' : '• Once'}
              </span>
            )}
          </div>
        </div>

        {/* Reciter dropdown toggle & Close */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsReciterMenuOpen(!isReciterMenuOpen)}
              className="px-2.5 py-1 rounded-lg bg-[#064e3b] border border-[#d4af37]/60 text-emerald-100 text-[11px] font-medium flex items-center gap-1 hover:bg-[#08674e] transition-colors"
            >
              <span className="max-w-[120px] truncate">{selectedReciter.name}</span>
              <ChevronDown size={12} />
            </button>

            {/* Reciters Menu */}
            {isReciterMenuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-52 bg-[#021d15] border border-[#d4af37] rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] text-emerald-400/80 font-semibold border-b border-emerald-900">
                  Select Reciter (القراء):
                </div>
                {RECITERS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleReciterChange(r)}
                    className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-emerald-900/60 transition-colors ${
                      selectedReciter.id === r.id ? 'text-[#d4af37] font-bold bg-[#042d22]' : 'text-emerald-100'
                    }`}
                  >
                    <span>{r.name}</span>
                    <span className="font-arabic text-xs opacity-75">{r.arabicName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Audio Player"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Lower row: Controls (Prev, Play/Pause, Next, Loop, Ayat Selector) */}
      <div className="flex items-center justify-between px-1">
        {/* Loop / Repeat Toggle */}
        <button
          onClick={() => setLoopAyat(!loopAyat)}
          className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1 ${
            loopAyat 
              ? 'bg-[#d4af37] text-gray-950 border-[#fde047] font-bold' 
              : 'bg-[#064e3b] text-emerald-300 border-[#d4af37]/40 hover:bg-[#08674e]'
          }`}
          title={loopAyat ? 'Loop enabled: Repeating this Ayat' : 'Loop disabled: Click to repeat this Ayat'}
        >
          {loopAyat ? <Repeat1 size={15} /> : <Repeat size={15} />}
          <span className="text-[10px] hidden sm:inline">{loopAyat ? 'Loop On' : 'Loop Ayat'}</span>
        </button>

        {/* Center Main Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevAyat}
            disabled={currentAyat <= 1 && currentSurahId <= 1}
            className="p-2 rounded-xl bg-[#064e3b] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#08674e] disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Previous Ayat"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-gray-950" />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNextAyat}
            disabled={currentAyat >= activeSurah.totalVerses && currentSurahId >= 114}
            className="p-2 rounded-xl bg-[#064e3b] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#08674e] disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Next Ayat"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Quick Ayat jumper dropdown */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-emerald-300/80 text-[11px] hidden sm:inline">Ayat:</span>
          <select
            value={currentAyat}
            onChange={(e) => {
              const newAyat = parseInt(e.target.value, 10);
              setCurrentAyat(newAyat);
              playAyat(currentSurahId, newAyat, selectedReciter.folder);
            }}
            className="px-2 py-1 bg-[#021d15] border border-[#d4af37]/60 rounded-lg text-xs font-mono text-[#d4af37] focus:outline-none"
          >
            {Array.from({ length: activeSurah.totalVerses }, (_, i) => i + 1).map((v) => (
              <option key={v} value={v} className="bg-[#021d15] text-white">
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-[10px] text-red-400 text-center">{error}</p>
      )}
    </div>
  );
};
