import React, { useState } from 'react';
import { QuranReader } from './components/QuranReader';
import { SurahAyatPicker } from './components/SurahAyatPicker';
import { AudioPlayerBar, AudioPlayRequest } from './components/AudioPlayerBar';
import { useBookmarks } from './hooks/useBookmarks';
import { getMetadataForPdfPage } from './data/quranMetadata';
import { Compass, Bookmark as BookmarkIcon, BookOpen, RotateCcw, X } from 'lucide-react';

export const App: React.FC = () => {
  const {
    bookmarks,
    lastReadPage,
    saveLastRead,
    toggleBookmark,
    isPageBookmarked,
    removeBookmark,
    updateBookmarkNote
  } = useBookmarks();

  // Initial page: default to Surah Al-Fatihah (page 3, printed page 2)
  const [currentPage, setCurrentPage] = useState<number>(() => {
    return lastReadPage || 3;
  });

  const [isNavigatorOpen, setIsNavigatorOpen] = useState<boolean>(false);
  const [activeAudioRequest, setActiveAudioRequest] = useState<AudioPlayRequest | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState<boolean>(() => {
    return lastReadPage !== null && lastReadPage !== 3;
  });

  const handlePageChange = (newPage: number) => {
    const safePage = Math.min(489, Math.max(1, newPage));
    setCurrentPage(safePage);
    saveLastRead(safePage);
    setShowResumeBanner(false);
  };


  return (
    <div className="min-h-screen bg-[#02140e] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#053224] via-[#021812] to-[#010b08] text-white flex flex-col justify-between p-2 sm:p-4">
      {/* Top Header Bar */}
      <nav className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 px-4 mb-2 bg-[#03241b]/80 border border-[#d4af37]/40 rounded-2xl backdrop-blur-md shadow-lg">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b45309] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#03241b] rounded-[10px] flex items-center justify-center text-[#d4af37]">
              <BookOpen size={18} />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#d4af37] tracking-wider flex items-center gap-2">
              <span>الْقُرْآنُ الْحَكِيمُ</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-emerald-200 font-sans font-normal">
                18 Lines
              </span>
            </h1>
            <p className="text-[11px] text-emerald-300/70 font-sans">
              Taj Company Limited • Two-Page RTL Spread Mushaf
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNavigatorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <Compass size={16} />
            <span>Surah & Ayat</span>
          </button>

          <button
            onClick={() => setIsNavigatorOpen(true)}
            className="relative p-2 rounded-xl bg-[#064e3b] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#08674e] transition-all"
            title="Saved Bookmarks"
          >
            <BookmarkIcon size={16} />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4af37] text-gray-900 text-[10px] font-bold flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Resume Reading Alert Banner */}
      {showResumeBanner && lastReadPage && (
        <div className="w-full max-w-xl mx-auto mb-3 p-3 rounded-xl bg-[#03241b] border border-[#d4af37] shadow-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <RotateCcw size={18} className="text-[#d4af37]" />
            <div className="text-xs">
              <span className="text-emerald-200">Resume your last session at </span>
              <span className="font-bold text-[#d4af37]">
                Page {getMetadataForPdfPage(lastReadPage).printedPage} ({getMetadataForPdfPage(lastReadPage).surah.transliteration})
              </span>
              ?
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handlePageChange(lastReadPage);
                setShowResumeBanner(false);
              }}
              className="px-3 py-1 rounded-lg bg-[#d4af37] text-gray-950 font-bold text-xs hover:bg-[#fde047] transition-colors"
            >
              Resume
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className="p-1 text-emerald-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Quran Reader Component */}
      <main className="flex-1 w-full flex flex-col items-center justify-center">
        <QuranReader
          currentPdfPage={currentPage}
          onPageChange={handlePageChange}
          isBookmarked={isPageBookmarked}
          onToggleBookmark={toggleBookmark}
          onOpenNavigator={() => setIsNavigatorOpen(true)}
          bookmarks={bookmarks}
          onPlayAudioRequest={setActiveAudioRequest}
          activeAudioRequest={activeAudioRequest}
        />
      </main>

      {/* Floating Quran Ayat Audio Player */}
      <AudioPlayerBar
        request={activeAudioRequest}
        onClose={() => setActiveAudioRequest(null)}
        onPageChange={handlePageChange}
      />

      {/* Footer Info & Shortcuts */}
      <footer className="w-full max-w-4xl mx-auto mt-4 text-center text-[11px] text-emerald-300/60 pb-2">
        <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1">
          <span>Keyboard Shortcuts:</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-emerald-200">←</kbd> Next Spread</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-emerald-200">→</kbd> Prev Spread</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-emerald-200">S</kbd> Pick Surah/Ayat</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-emerald-200">B</kbd> Bookmark</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-emerald-200">F</kbd> Fullscreen</span>
        </div>
      </footer>

      {/* Surah, Ayat, Juz & Bookmark Navigation Modal */}
      <SurahAyatPicker
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
        onJumpToPage={handlePageChange}
        onPlayAyat={(surahId, ayatNumber, mode) => {
          setActiveAudioRequest({
            surahId,
            ayatNumber,
            mode
          });
        }}
        bookmarks={bookmarks}
        onRemoveBookmark={removeBookmark}
        onUpdateBookmarkNote={updateBookmarkNote}
        currentPdfPage={currentPage}
      />
    </div>
  );
};

export default App;
