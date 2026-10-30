import { useState, useEffect } from 'react';
import { Bookmark, getMetadataForPdfPage } from '../data/quranMetadata';

const STORAGE_KEY = 'taj_quran_bookmarks_v1';
const LAST_READ_KEY = 'taj_quran_last_read_v1';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [lastReadPage, setLastReadPage] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem(LAST_READ_KEY);
      return stored ? parseInt(stored, 10) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  const saveLastRead = (pageNumber: number) => {
    setLastReadPage(pageNumber);
    try {
      localStorage.setItem(LAST_READ_KEY, pageNumber.toString());
    } catch (e) {
      console.error('Failed to save last read:', e);
    }
  };

  const toggleBookmark = (pdfPage: number, note?: string) => {
    const existing = bookmarks.find(b => b.pdfPage === pdfPage);
    if (existing) {
      setBookmarks(prev => prev.filter(b => b.id !== existing.id));
    } else {
      const meta = getMetadataForPdfPage(pdfPage);
      const newBookmark: Bookmark = {
        id: `bm_${Date.now()}_${pdfPage}`,
        pdfPage,
        printedPage: meta.printedPage,
        surahId: meta.surah.id,
        surahName: `${meta.surah.name} (${meta.surah.transliteration})`,
        para: meta.juz.id,
        title: `Surah ${meta.surah.transliteration} - Pg ${meta.printedPage}`,
        note: note || '',
        createdAt: Date.now()
      };
      setBookmarks(prev => [newBookmark, ...prev]);
    }
  };

  const isPageBookmarked = (pdfPage: number): boolean => {
    return bookmarks.some(b => b.pdfPage === pdfPage);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const updateBookmarkNote = (id: string, note: string) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, note } : b));
  };

  return {
    bookmarks,
    lastReadPage,
    saveLastRead,
    toggleBookmark,
    isPageBookmarked,
    removeBookmark,
    updateBookmarkNote
  };
}
