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
  Palette
} from 'lucide-react';
import { IslamicBorder } from './IslamicBorder';
import { MushafSpine } from './MushafSpine';
import { PageCanvas } from './PageCanvas';
import { getMetadataForPdfPage, getVersesForPdfPage, Bookmark } from '../data/quranMetadata';
import { AudioPlayRequest } from './AudioPlayerBar';

interface QuranReaderProps {
  currentPdfPage: number;
  onPageChange: (newPage: number) => void;
  isBookmarked: (pdfPage: number) => boolean;
  onToggleBookmark: (pdfPage: number) => void;
  onOpenNavigator: () => void;
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

  // Auto detect screen size on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - (isFullscreen ? 60 : 160);
        setDimensions({
          width: Math.max(320, rect.width - 32),
          height: Math.max(400, availableHeight)
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
  // Spread 0: Page 1 (Cover) or Page 1 & 2
  // Spread 1: Page 3 (Right) + Page 4 (Left)
  // Spread K: Right = 2*K + 1, Left = 2*K + 2
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

  // Navigation handlers
  // In RTL reading:
  // "Next" (advancing forward into Quran) moves forward: left arrow in visual layout or Next button
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        // RTL forward
        handleNextSpread();
      } else if (e.key === 'ArrowRight') {
        // RTL backward
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
  const paddingH = 32;
  const availableW = dimensions.width - spineWidth - paddingH;
  const singlePageMaxWidth = isTwoPageMode ? Math.floor(availableW / 2) : Math.min(650, dimensions.width - 24);
  const pageMaxHeight = dimensions.height;

  const isCurrentSpreadBookmarked = isBookmarked(rightPage) || (isTwoPageMode && isBookmarked(leftPage));

  return (
    <div 
      ref={containerRef} 
      className={`w-full flex flex-col items-center select-none ${isFullscreen ? 'fixed inset-0 z-50 bg-[#021812] p-2 sm:p-4 overflow-y-auto' : ''}`}
    >
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-5xl mb-3 px-3 py-2 bg-[#03241b]/95 backdrop-blur-md rounded-2xl border border-[#d4af37]/60 shadow-xl flex items-center justify-between text-white flex-wrap gap-2">
        {/* Left: Active Surah & Para Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenNavigator}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#064e3b] border border-[#d4af37]/70 text-[#d4af37] hover:bg-[#08674e] hover:border-[#fde047] transition-all font-medium text-xs sm:text-sm shadow-sm group"
          >
            <Search size={15} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Pick Surah / Ayat</span>
          </button>

          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-arabic font-bold text-sm text-[#d4af37]">
                {rightMeta.surah.name}
              </span>
              <span className="text-xs text-emerald-200">
                ({rightMeta.surah.transliteration})
              </span>
            </div>
            <span className="text-[10px] text-emerald-300/70">
              Para {rightMeta.juz.id} • {rightMeta.juz.nameArabic}
            </span>
          </div>
        </div>

        {/* Center: Reading Spread indicator */}
        <div className="flex items-center gap-2 bg-[#021812] px-3 py-1 rounded-xl border border-[#d4af37]/40 text-xs font-mono">
          <span className="text-emerald-300">
            {isTwoPageMode ? `Pages ${rightMeta.printedPage} - ${leftMeta.printedPage}` : `Page ${rightMeta.printedPage}`}
          </span>
          <span className="text-emerald-500/60">|</span>
          <span className="text-gray-400">
            PDF {rightPage}{isTwoPageMode ? `-${leftPage}` : ''} / 489
          </span>
        </div>

        {/* Right: Actions (Theme, View mode, Bookmark, Audio, Fullscreen) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Play Current Page Audio Button */}
          <button
            onClick={handlePlayPageAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              activeAudioRequest?.pageNumber === (isTwoPageMode ? rightPage : currentPdfPage)
                ? 'bg-[#d4af37] text-gray-950 border-[#fde047] shadow-lg animate-pulse'
                : 'bg-[#064e3b] text-[#d4af37] border-[#d4af37]/60 hover:bg-[#08674e] hover:border-[#fde047]'
            }`}
            title={`Start Quran audio at current page (Printed Pg ${isTwoPageMode ? rightMeta.printedPage : rightMeta.printedPage})`}
          >
            <Volume2 size={16} />
            <span className="hidden sm:inline">Play Page Audio</span>
          </button>

          {/* Theme Cycler */}
          <button
            onClick={() => {
              const themes: ('emerald' | 'lapis' | 'night' | 'sepia')[] = ['emerald', 'lapis', 'night', 'sepia'];
              const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
              setTheme(themes[nextIndex]);
            }}
            className="p-2 rounded-lg bg-[#064e3b] text-emerald-200 border border-[#d4af37]/40 hover:bg-[#08674e] transition-all capitalize"
            title={`Current theme: ${theme}. Click to switch theme`}
          >
            <Palette size={16} />
          </button>

          {/* Single / Two-Page Mode Toggle */}
          <button
            onClick={() => setIsTwoPageMode(prev => !prev)}
            className="p-2 rounded-lg bg-[#064e3b] text-emerald-200 border border-[#d4af37]/40 hover:bg-[#08674e] transition-all"
            title={isTwoPageMode ? 'Switch to Single Page Mode' : 'Switch to Two-Page Book Spread Mode'}
          >
            {isTwoPageMode ? <BookCopy size={16} /> : <FileText size={16} />}
          </button>

          {/* Bookmark Ribbon */}
          <button
            onClick={() => onToggleBookmark(isTwoPageMode ? rightPage : currentPdfPage)}
            className={`p-2 rounded-lg border transition-all ${
              isCurrentSpreadBookmarked
                ? 'bg-[#d4af37] text-gray-950 border-[#fde047]'
                : 'bg-[#064e3b] text-emerald-200 border-[#d4af37]/40 hover:bg-[#08674e]'
            }`}
            title={isCurrentSpreadBookmarked ? 'Bookmarked' : 'Bookmark this spread'}
          >
            <BookmarkIcon size={16} className={isCurrentSpreadBookmarked ? 'fill-current' : ''} />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#064e3b] text-emerald-200 border border-[#d4af37]/40 hover:bg-[#08674e] transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* Main Quran Book Spread Area with Islamic Mosaic Border */}
      <div className="relative w-full flex items-center justify-center">
        {/* Navigation Arrow: Forward (Left button in RTL reading) */}
        <button
          onClick={handleNextSpread}
          disabled={isTwoPageMode ? leftPage >= 489 : currentPdfPage >= 489}
          className="absolute -left-2 sm:-left-6 z-30 w-10 h-14 sm:w-12 sm:h-20 rounded-r-xl bg-[#03241b]/90 hover:bg-[#047857] text-[#d4af37] border-y border-r border-[#d4af37] shadow-2xl flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none group"
          title="Turn Page Forward (RTL: Left Arrow)"
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* The Quran Book Framed by Islamic Mosaic Border */}
        <IslamicBorder theme={theme} className="w-auto max-w-full">
          <div className="relative flex items-center justify-center p-1 sm:p-2 bg-gradient-to-b from-[#111827] via-[#0b1320] to-[#111827] rounded-lg shadow-book overflow-hidden">
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
          className="absolute -right-2 sm:-right-6 z-30 w-10 h-14 sm:w-12 sm:h-20 rounded-l-xl bg-[#03241b]/90 hover:bg-[#047857] text-[#d4af37] border-y border-l border-[#d4af37] shadow-2xl flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none group"
          title="Turn Page Backward (RTL: Right Arrow)"
        >
          <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Spread Quick Navigation Bar */}
      <footer className="w-full max-w-xl mt-3 px-4 py-2 bg-[#03241b]/90 backdrop-blur-md rounded-xl border border-[#d4af37]/40 shadow-lg flex items-center justify-between text-xs text-white">
        <button
          onClick={handleNextSpread}
          disabled={isTwoPageMode ? leftPage >= 489 : currentPdfPage >= 489}
          className="flex items-center gap-1 text-[#d4af37] hover:text-[#fde047] disabled:opacity-30 disabled:pointer-events-none font-semibold"
        >
          <ChevronLeft size={16} />
          <span>Next Spread</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            className="px-2 py-0.5 rounded bg-[#064e3b] text-emerald-200 hover:text-white border border-[#d4af37]/30 text-[11px]"
            title="Go to Cover"
          >
            Cover
          </button>
          <button
            onClick={() => onPageChange(3)}
            className="px-2 py-0.5 rounded bg-[#064e3b] text-emerald-200 hover:text-white border border-[#d4af37]/30 text-[11px]"
            title="Go to Surah Al-Fatihah"
          >
            Al-Fatihah (Pg 2)
          </button>
          <button
            onClick={() => onPageChange(486)}
            className="px-2 py-0.5 rounded bg-[#064e3b] text-emerald-200 hover:text-white border border-[#d4af37]/30 text-[11px]"
            title="Go to Surah An-Nas"
          >
            An-Nas (Pg 485)
          </button>
        </div>

        <button
          onClick={handlePrevSpread}
          disabled={isTwoPageMode ? rightPage <= 1 : currentPdfPage <= 1}
          className="flex items-center gap-1 text-[#d4af37] hover:text-[#fde047] disabled:opacity-30 disabled:pointer-events-none font-semibold"
        >
          <span>Prev Spread</span>
          <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
};
