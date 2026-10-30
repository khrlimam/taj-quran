import React, { useEffect, useRef, useState } from 'react';
import { Bookmark as BookmarkIcon, Loader2 } from 'lucide-react';
import { pdfService } from '../services/pdfService';
import { getMetadataForPdfPage } from '../data/quranMetadata';

interface PageCanvasProps {
  pageNumber: number;
  isRightPage?: boolean;
  maxWidth: number;
  maxHeight: number;
  theme?: 'emerald' | 'lapis' | 'night' | 'sepia';
  isBookmarked?: boolean;
  onToggleBookmark?: (pageNumber: number) => void;
  className?: string;
}

export const PageCanvas: React.FC<PageCanvasProps> = ({
  pageNumber,
  isRightPage = false,
  maxWidth,
  maxHeight,
  theme = 'emerald',
  isBookmarked = false,
  onToggleBookmark,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const metadata = getMetadataForPdfPage(pageNumber);

  useEffect(() => {
    let isCurrent = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    setError(null);

    const isNight = theme === 'night';

    pdfService.renderPageToCanvas(pageNumber, canvas, maxWidth, maxHeight, isNight)
      .then(() => {
        if (isCurrent) {
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isCurrent && err?.name !== 'RenderingCancelledException') {
          console.error(`Error rendering page ${pageNumber}:`, err);
          setError('Failed to load page');
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [pageNumber, maxWidth, maxHeight, theme]);

  // Page filter styles for Night and Sepia modes
  const pageFilterStyle = {
    night: 'invert-[0.9] hue-rotate-180 brightness-[0.85] contrast-[1.1]',
    sepia: 'sepia-[0.35] brightness-[0.98] contrast-[1.05]',
    emerald: '',
    lapis: ''
  }[theme];

  return (
    <div className={`relative flex flex-col items-center bg-[#fdfbf7] rounded-sm shadow-page overflow-hidden transition-all duration-300 ${className}`}>
      {/* Page Header / Ribbon Bar */}
      <div className="w-full flex items-center justify-between px-3 py-1 bg-gradient-to-r from-[#f4ede0] via-[#fdfbf7] to-[#f4ede0] border-b border-[#e8dcbe]/70 text-[11px] text-gray-700 select-none">
        <span className="font-arabic font-semibold text-xs text-[#064e3b]">
          {metadata.surah.name} ({metadata.surah.transliteration})
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 font-mono">
            {isRightPage ? 'Right' : 'Left'} • Pg {metadata.printedPage}
          </span>
          {onToggleBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(pageNumber);
              }}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this page'}
              className="p-0.5 rounded hover:bg-[#e8dcbe] transition-colors"
            >
              <BookmarkIcon
                size={14}
                className={isBookmarked ? 'fill-[#d4af37] text-[#d4af37]' : 'text-gray-400 hover:text-[#d4af37]'}
              />
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex items-center justify-center min-h-[300px] w-full p-1 bg-white">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 backdrop-blur-xs">
            <Loader2 className="animate-spin text-[#d4af37] mb-2" size={32} />
            <span className="text-xs text-gray-600 font-medium">Loading Page {metadata.printedPage}...</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 p-4 text-center z-10">
            <p className="text-sm font-semibold">{error}</p>
            <p className="text-xs mt-1 text-gray-500">Page {pageNumber}</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`block max-w-full h-auto transition-all duration-200 ${pageFilterStyle}`}
          style={{
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        />
      </div>

      {/* Page Footer Info */}
      <div className="w-full flex items-center justify-between px-3 py-0.5 bg-[#fbf8f2] border-t border-[#e8dcbe]/50 text-[10px] text-gray-400 select-none">
        <span className="font-arabic text-gray-500">
          {metadata.juz.nameArabic} (Para {metadata.juz.id})
        </span>
        <span className="font-mono">
          PDF {pageNumber} / 489
        </span>
      </div>
    </div>
  );
};
