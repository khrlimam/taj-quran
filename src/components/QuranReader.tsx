import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  BookCopy, 
  FileText, 
  Bookmark as BookmarkIcon,
  Search,
  Volume2,
  Palette,
  Moon
} from 'lucide-react';
import { IslamicBorder } from './IslamicBorder';
import { MushafSpine } from './MushafSpine';
import { PageCanvas } from './PageCanvas';
import { getMetadataForPdfPage, getVersesForPdfPage, Bookmark } from '../data/quranMetadata';
import { getLunarJuzForPdfPage } from '../data/lunarAjzaData';
import { AudioPlayRequest } from './AudioPlayerBar';

interface QuranReaderProps {
  currentPdfPage: number;
  onPageChange: (newPage: number) => void;
  isBookmarked: (pdfPage: number) => boolean;
  onToggleBookmark: (pdfPage: number) => void;
  onOpenNavigator: () => void;
  onOpenLunarTracker?: () => void;
  bookmarks: Bookmark[];
  onPlayAudioRequest: (req: AudioPlayRequest) => void;
  activeAudioRequest: AudioPlayRequest | null;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  currentPdfPage,
  onPageChange,
  isBookmarked,
  onToggleBookmark,
  onOpenNavigator,
  onOpenLunarTracker,
  onPlayAudioRequest,
  activeAudioRequest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 750 });
  const [isTwoPageMode, setIsTwoPageMode] = useState<boolean>(() => {
    return window.innerWidth >= 768;
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'emerald' | 'lapis' | 'night' | 'sepia'>('emerald');

  // Touch swipe tracking refs
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Auto detect screen size on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - (isFullscreen ? 60 : 160);
        setDimensions({
          width: Math.max(320, rect.width - 16),
          height: Math.max(380, availableHeight)
        });
      }
      if (window.innerWidth < 768) {
        setIsTwoPageMode(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // Determine current spread
  const currentSpread = Math.max(0, Math.floor((currentPdfPage - 1) / 2));

  let rightPage: number;
  let leftPage: number;

  if (currentSpread === 0) {
    rightPage = 1;
    leftPage = 2;
  } else {
    rightPage = currentSpread * 2 + 1;
    leftPage = currentSpread * 2 + 2;
  }

  // Ensure within total 489 pages
  rightPage = Math.min(489, Math.max(1, rightPage));
  leftPage = Math.min(489, Math.max(1, leftPage));

  const rightMeta = getMetadataForPdfPage(rightPage);
  const leftMeta = getMetadataForPdfPage(leftPage);
  const activeSingleMeta = getMetadataForPdfPage(currentPdfPage);
  const activeMoonJuz = getLunarJuzForPdfPage(isTwoPageMode ? rightPage : currentPdfPage);

  // Navigation handlers
  // In RTL reading:
  // "Next" (advancing forward into Quran) moves forward: left arrow in visual layout
  const handleNextSpread = useCallback(() => {
    if (isTwoPageMode) {
      if (currentSpread === 0) {
        onPageChange(3);
      } else {
        const nextRight = rightPage + 2;
        if (nextRight <= 489) {
          onPageChange(nextRight);
        }
      }
    } else {
      if (currentPdfPage < 489) {
        onPageChange(currentPdfPage + 1);
      }
    }
  }, [isTwoPageMode, currentSpread, rightPage, currentPdfPage, onPageChange]);

  const handlePrevSpread = useCallback(() => {
    if (isTwoPageMode) {
      if (currentSpread <= 1) {
        onPageChange(1);
      } else {
        const prevRight = rightPage - 2;
        if (prevRight >= 1) {
          onPageChange(prevRight);
        }
      }
    } else {
      if (currentPdfPage > 1) {
        onPageChange(currentPdfPage - 1);
      }
    }
  }, [isTwoPageMode, currentSpread, rightPage, currentPdfPage, onPageChange]);

  // Page turn transition effect
  const [transitionAnim, setTransitionAnim] = useState<string>('');
  const prevPageRef = useRef<number>(currentPdfPage);

  useEffect(() => {
    if (currentPdfPage !== prevPageRef.current) {
      const isNext = currentPdfPage > prevPageRef.current;
      setTransitionAnim(isNext ? 'animate-page-turn-next' : 'animate-page-turn-prev');
      prevPageRef.current = currentPdfPage;
      const timer = setTimeout(() => {
        setTransitionAnim('');
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [currentPdfPage]);

  // Touch swipe handling for mobile
  // User specification: "swipe right should open the next page, swipe left open previous page"
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Minimum swipe distance 40px and predominantly horizontal
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX > 0) {
        // Swipe right: open next page (natural RTL layout)
        handleNextSpread();
      } else {
        // Swipe left: open previous page
        handlePrevSpread();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        handleNextSpread();
      } else if (e.key === 'ArrowRight') {
        handlePrevSpread();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'b' || e.key === 'B') {
        onToggleBookmark(isTwoPageMode ? rightPage : currentPdfPage);
      } else if (e.key === 's' || e.key === 'S') {
        onOpenNavigator();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSpread, handlePrevSpread, isTwoPageMode, rightPage, currentPdfPage, onToggleBookmark, onOpenNavigator]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Play Quran audio at the current page
  const handlePlayPageAudio = () => {
    const targetPage = isTwoPageMode ? rightPage : currentPdfPage;
    const span = getVersesForPdfPage(targetPage);
    onPlayAudioRequest({
      surahId: span.surah.id,
      ayatNumber: span.startVerse,
      endVerse: span.endVerse,
      mode: 'page',
      pageNumber: targetPage
    });
  };

  // Compute page sizes
  const spineWidth = isTwoPageMode ? 24 : 0;
  const paddingH = window.innerWidth < 640 ? 12 : 32;
  const availableW = dimensions.width - spineWidth - paddingH;
  const singlePageMaxWidth = isTwoPageMode 
    ? Math.floor(availableW / 2) 
    : Math.min(650, dimensions.width - (window.innerWidth < 640 ? 8 : 24));
  const pageMaxHeight = dimensions.height;

  const isCurrentSpreadBookmarked = isTwoPageMode 
    ? (isBookmarked(rightPage) || isBookmarked(leftPage))
    : isBookmarked(currentPdfPage);

  const displaySurah = isTwoPageMode ? rightMeta.surah : activeSingleMeta.surah;
  const displayPrintedPage = isTwoPageMode 
    ? `Pages ${rightMeta.printedPage} - ${leftMeta.printedPage}` 
    : `Page ${activeSingleMeta.printedPage}`;

  return (
    <div 
      ref={containerRef} 
      className={`w-full flex flex-col items-center select-none ${isFullscreen ? 'fixed inset-0 z-50 bg-[#021812] p-2 sm:p-4 overflow-y-auto' : ''}`}
    >
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-5xl mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#03241b]/95 backdrop-blur-md rounded-2xl border border-[#d4af37]/60 shadow-xl flex items-center justify-between text-white gap-1.5 sm:gap-2">
        {/* Left: Active Surah & Pick Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onOpenNavigator}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#064e3b] border border-[#d4af37]/70 text-[#d4af37] hover:bg-[#08674e] hover:border-[#fde047] transition-all font-semibold text-xs sm:text-sm shadow-sm group active:scale-95"
            title="Open Quran Navigator (Surahs, Lunar Ajza, Paras)"
          >
            <Search size={14} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Pick Surah / Ayat</span>
            <span className="sm:hidden font-medium">Index</span>
          </button>

          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-arabic font-bold text-sm text-[#d4af37]">
                {displaySurah.name}
              </span>
              <span className="text-xs text-emerald-200">
                ({displaySurah.transliteration})
              </span>
            </div>
            <span className="text-[10px] text-emerald-300/70">
              Para {rightMeta.juz.id} • {rightMeta.juz.nameArabic}
            </span>
          </div>
        </div>

        {/* Center: Reading Spread indicator (clickable to jump) */}
        <button
          onClick={onOpenNavigator}
          className="flex items-center gap-1 sm:gap-2 bg-[#021812] px-2 sm:px-3 py-1 rounded-xl border border-[#d4af37]/40 text-xs font-mono hover:border-[#d4af37] transition-colors"
          title="Click to jump to another page"
        >
          <span className="text-[#d4af37] font-semibold text-[11px] sm:text-xs">
            {displayPrintedPage}
          </span>
          <span className="text-emerald-500/60 hidden sm:inline">|</span>
          <span className="text-gray-400 text-[10px] sm:text-xs hidden sm:inline">
            PDF {isTwoPageMode ? `${rightPage}-${leftPage}` : currentPdfPage} / 489
          </span>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Play Page Audio */}
          <button
            onClick={handlePlayPageAudio}
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
              activeAudioRequest?.pageNumber === (isTwoPageMode ? rightPage : currentPdfPage)
                ? 'bg-[#d4af37] text-gray-950 border-[#fde047] shadow-lg animate-pulse'
                : 'bg-[#064e3b] text-[#d4af37] border-[#d4af37]/60 hover:bg-[#08674e]'
            }`}
            title="Play Quran Audio for this page"
          >
            <Volume2 size={15} />
            <span className="hidden lg:inline">Play Audio</span>
          </button>

          {/* Theme Cycler */}
          <button
            onClick={() => {
              const themes: ('emerald' | 'lapis' | 'night' | 'sepia')[] = ['emerald', 'lapis', 'night', 'sepia'];
              const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
              setTheme(themes[nextIndex]);
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-[#064e3b] text-emerald-200 border border-[#d4af37]/40 hover:bg-[#08674e] transition-all"
            title={`Current theme: ${theme}. Click to switch theme`}
          >
            <Palette size={15} />
          </button>

          {/* Single / Two-Page Mode (Hidden on mobile <768px) */}
          <button
            onClick={() => setIsTwoPageMode(prev => !prev)}
            className="hidden md:flex p-2 rounded-xl bg-[#064e3b] text-emerald-200 border border-[#d4af37]/40 hover:bg-[#08674e] transition-all"
            title={isTwoPageMode ? 'Switch to Single Page Mode' : 'Switch to Two-Page Book Spread Mode'}
          >
            {isTwoPageMode ? <BookCopy size={15} /> : <FileText size={15} />}
          </button>

          {/* Bookmark Ribbon */}
          <button
            onClick={() => onToggleBookmark(isTwoPageMode ? rightPage : currentPdfPage)}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 ${
              isCurrentSpreadBookmarked
                ? 'bg-[#d4af37] text-gray-950 border-[#fde047]'
                : 'bg-[#064e3b] text-emerald-200 border-[#d4af37]/40 hover:bg-[#08674e]'
            }`}
            title={isCurrentSpreadBookmarked ? 'Bookmarked' : 'Bookmark this page'}
          >
            <BookmarkIcon size={15} className={isCurrentSpreadBookmarked ? 'fill-current' : ''} />
          </button>

          {/* Fullscreen Button (Hidden on small mobile) */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 rounded-xl bg-[#064e3b] text-emerald-200 border border-[#d4af37]/40 hover:bg-[#08674e] transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      {/* Main Quran Book Spread Area with Touch Swipe */}
      <div 
        className="relative w-full flex items-center justify-center touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrow: Forward (Left button in RTL reading) */}
        <button
          onClick={handleNextSpread}
          disabled={isTwoPageMode ? leftPage >= 489 : currentPdfPage >= 489}
          className="absolute -left-1 sm:-left-6 z-30 w-8 h-12 sm:w-12 sm:h-20 rounded-r-xl bg-[#03241b]/90 hover:bg-[#047857] text-[#d4af37] border-y border-r border-[#d4af37] shadow-2xl flex items-center justify-center transition-all disabled:opacity-20 disabled:pointer-events-none group"
          title="Turn Page Forward (RTL: Left Arrow / Swipe Right)"
        >
          <ChevronLeft size={22} className="sm:hidden" />
          <ChevronLeft size={28} className="hidden sm:block group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* The Quran Book Framed by Islamic Mosaic Border */}
        <IslamicBorder theme={theme} className="w-auto max-w-full">
          <div className={`relative flex items-center justify-center p-0.5 sm:p-2 bg-gradient-to-b from-[#111827] via-[#0b1320] to-[#111827] rounded-lg shadow-book overflow-hidden ${transitionAnim}`}>
            {isTwoPageMode ? (
              /* Two-Page Spread (Starts from Right in RTL) */
              <div className="flex items-center justify-center">
                {/* Left Page (Second page of the spread in RTL reading) */}
                <PageCanvas
                  pageNumber={leftPage}
                  isRightPage={false}
                  maxWidth={singlePageMaxWidth}
                  maxHeight={pageMaxHeight}
                  theme={theme}
                  isBookmarked={isBookmarked(leftPage)}
                  onToggleBookmark={onToggleBookmark}
                />

                {/* 3D Mushaf Center Binding Spine */}
                <MushafSpine />

                {/* Right Page (First page of the spread in RTL reading) */}
                <PageCanvas
                  pageNumber={rightPage}
                  isRightPage={true}
                  maxWidth={singlePageMaxWidth}
                  maxHeight={pageMaxHeight}
                  theme={theme}
                  isBookmarked={isBookmarked(rightPage)}
                  onToggleBookmark={onToggleBookmark}
                />
              </div>
            ) : (
              /* Single-Page Mode */
              <div className="flex items-center justify-center">
                <PageCanvas
                  pageNumber={currentPdfPage}
                  isRightPage={currentPdfPage % 2 === 1}
                  maxWidth={singlePageMaxWidth}
                  maxHeight={pageMaxHeight}
                  theme={theme}
                  isBookmarked={isBookmarked(currentPdfPage)}
                  onToggleBookmark={onToggleBookmark}
                />
              </div>
            )}
          </div>
        </IslamicBorder>

        {/* Navigation Arrow: Backward (Right button in RTL reading) */}
        <button
          onClick={handlePrevSpread}
          disabled={isTwoPageMode ? rightPage <= 1 : currentPdfPage <= 1}
          className="absolute -right-1 sm:-right-6 z-30 w-8 h-12 sm:w-12 sm:h-20 rounded-l-xl bg-[#03241b]/90 hover:bg-[#047857] text-[#d4af37] border-y border-l border-[#d4af37] shadow-2xl flex items-center justify-center transition-all disabled:opacity-20 disabled:pointer-events-none group"
          title="Turn Page Backward (RTL: Right Arrow / Swipe Left)"
        >
          <ChevronRight size={22} className="sm:hidden" />
          <ChevronRight size={28} className="hidden sm:block group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Mobile-Friendly Bottom Navigation Bar with Current Page's Moon Juz */}
      <footer className="w-full max-w-xl mt-2 sm:mt-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#03241b]/95 backdrop-blur-md rounded-xl border border-[#d4af37]/40 shadow-lg flex items-center justify-between text-xs text-white gap-1 sm:gap-2">
        <button
          onClick={handleNextSpread}
          disabled={isTwoPageMode ? leftPage >= 489 : currentPdfPage >= 489}
          className="flex items-center gap-1 text-[#d4af37] hover:text-[#fde047] disabled:opacity-30 disabled:pointer-events-none font-bold py-1 px-2 rounded-lg active:bg-white/10 shrink-0"
          title="Next Page (Swipe Right or Left Arrow)"
        >
          <ChevronLeft size={16} />
          <span className="text-xs">Next</span>
        </button>

        {/* Current Opening Page Moon Juz Badge */}
        <button
          onClick={onOpenLunarTracker}
          className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-xl bg-[#043326] hover:bg-[#064232] border border-[#d4af37]/60 text-[#d4af37] transition-all shadow-md group active:scale-95 text-left truncate max-w-[210px] sm:max-w-xs"
          title={`Moon Juz ${activeMoonJuz.day} (${activeMoonJuz.title}) • Surahs: ${activeMoonJuz.surahNames.join(', ')} • Day ${activeMoonJuz.day} Recitation`}
        >
          <Moon size={13} className="text-[#d4af37] shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 leading-tight truncate">
            <span className="font-bold text-[11px] sm:text-xs text-[#d4af37] whitespace-nowrap">
              Moon Juz {activeMoonJuz.day}
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-200 truncate hidden xs:inline">
              • {activeMoonJuz.surahNames[0]}{activeMoonJuz.surahNames.length > 1 ? '...' : ''}
            </span>
          </div>
        </button>

        <button
          onClick={handlePrevSpread}
          disabled={isTwoPageMode ? rightPage <= 1 : currentPdfPage <= 1}
          className="flex items-center gap-1 text-[#d4af37] hover:text-[#fde047] disabled:opacity-30 disabled:pointer-events-none font-bold py-1 px-2 rounded-lg active:bg-white/10 shrink-0"
          title="Previous Page (Swipe Left or Right Arrow)"
        >
          <span className="text-xs">Prev</span>
          <ChevronRight size={16} />
        </button>
      </footer>

      {/* Quick Jump Shortcuts & Monthly Method Note Link */}
      <div className="w-full max-w-xl mt-1.5 flex items-center justify-between px-1 text-[11px] text-emerald-300/70">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-emerald-400/60 hidden sm:inline">Jump:</span>
          <button
            onClick={() => onPageChange(1)}
            className="px-2 py-0.5 rounded bg-[#03241b]/80 hover:bg-[#064e3b] text-emerald-300 hover:text-white border border-[#d4af37]/20 text-[10px]"
          >
            Cover
          </button>
          <button
            onClick={() => onPageChange(3)}
            className="px-2 py-0.5 rounded bg-[#03241b]/80 hover:bg-[#064e3b] text-emerald-300 hover:text-white border border-[#d4af37]/20 text-[10px]"
          >
            Al-Fatihah
          </button>
          <button
            onClick={() => onPageChange(486)}
            className="px-2 py-0.5 rounded bg-[#03241b]/80 hover:bg-[#064e3b] text-emerald-300 hover:text-white border border-[#d4af37]/20 text-[10px]"
          >
            An-Nas
          </button>
        </div>

        {onOpenLunarTracker && (
          <button
            onClick={onOpenLunarTracker}
            className="text-[10px] text-[#d4af37]/90 hover:text-[#fde047] flex items-center gap-1 hover:underline underline-offset-2"
          >
            <span>Monthly Recitation (Day {activeMoonJuz.day})</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
};
