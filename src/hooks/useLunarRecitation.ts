import { useState, useEffect, useMemo, useCallback } from 'react';
import { LUNAR_AJZA, LunarJuz, getLunarJuzForDay } from '../data/lunarAjzaData';

export interface RecitationRecord {
  recited: boolean;
  completedAt?: string;
}

export interface HijriDateInfo {
  day: number;
  month: string;
  monthNumber: number;
  year: number;
  formatted: string;
}

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah'
];

/**
 * Calculates Hijri date using native Intl API
 */
export function getHijriDate(date: Date = new Date(), offsetDays: number = 0): HijriDateInfo {
  const adjustedDate = new Date(date.getTime() + offsetDays * 24 * 60 * 60 * 1000);

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(adjustedDate);

    const dayVal = parts.find(p => p.type === 'day')?.value;
    const monthVal = parts.find(p => p.type === 'month')?.value;
    const yearVal = parts.find(p => p.type === 'year')?.value;

    const rawDay = dayVal ? parseInt(dayVal, 10) : 1;
    const rawMonth = monthVal ? parseInt(monthVal, 10) : 1;
    const rawYear = yearVal ? parseInt(yearVal, 10) : 1448;

    const safeDay = Math.min(30, Math.max(1, isNaN(rawDay) ? 1 : rawDay));
    const safeMonthIdx = Math.min(12, Math.max(1, isNaN(rawMonth) ? 1 : rawMonth)) - 1;
    const monthName = HIJRI_MONTHS[safeMonthIdx] || 'Hijri Month';

    return {
      day: safeDay,
      month: monthName,
      monthNumber: safeMonthIdx + 1,
      year: isNaN(rawYear) ? 1448 : rawYear,
      formatted: `${safeDay} ${monthName}, ${rawYear} AH`
    };
  } catch (err) {
    // Fallback if islamic-umalqura is not supported in current JS runtime
    return {
      day: 1,
      month: 'Muharram',
      monthNumber: 1,
      year: 1448,
      formatted: '1 Muharram, 1448 AH'
    };
  }
}

export function useLunarRecitation() {
  // Moon sighting day offset (-2, -1, 0, +1, +2)
  const [dayOffset, setDayOffsetState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('taj_lunar_day_offset');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const hijriDate = useMemo(() => {
    return getHijriDate(new Date(), dayOffset);
  }, [dayOffset]);

  const effectiveDay = hijriDate.day;
  const storageKey = useMemo(() => {
    return `taj_lunar_recitation_${hijriDate.year}_${hijriDate.monthNumber}`;
  }, [hijriDate.year, hijriDate.monthNumber]);

  // Recitation records for the running month
  const [records, setRecords] = useState<Record<number, RecitationRecord>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Re-read records when storageKey changes (e.g. Month change)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setRecords(saved ? JSON.parse(saved) : {});
    } catch {
      setRecords({});
    }
  }, [storageKey]);

  // Sync to localStorage
  const saveRecords = useCallback((newRecords: Record<number, RecitationRecord>) => {
    setRecords(newRecords);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRecords));
    } catch (e) {
      console.warn('Failed to save lunar recitation records:', e);
    }
  }, [storageKey]);

  const setDayOffset = useCallback((offset: number) => {
    setDayOffsetState(offset);
    try {
      localStorage.setItem('taj_lunar_day_offset', offset.toString());
    } catch (e) {
      console.warn('Failed to save lunar day offset:', e);
    }
  }, []);

  const isJuzRecited = useCallback((day: number): boolean => {
    return Boolean(records[day]?.recited);
  }, [records]);

  const toggleJuzRecited = useCallback((day: number) => {
    const safeDay = Math.min(30, Math.max(1, day));
    const current = records[safeDay]?.recited;
    const updated: Record<number, RecitationRecord> = {
      ...records,
      [safeDay]: {
        recited: !current,
        completedAt: !current ? new Date().toISOString() : undefined
      }
    };
    saveRecords(updated);
  }, [records, saveRecords]);

  const markTodayRecited = useCallback(() => {
    if (!isJuzRecited(effectiveDay)) {
      toggleJuzRecited(effectiveDay);
    }
  }, [effectiveDay, isJuzRecited, toggleJuzRecited]);

  const resetRunningMonth = useCallback(() => {
    saveRecords({});
  }, [saveRecords]);

  // Calculate statistics
  const completedCount = useMemo(() => {
    let count = 0;
    for (let day = 1; day <= 30; day++) {
      if (records[day]?.recited) count++;
    }
    return count;
  }, [records]);

  const progressPercentage = Math.round((completedCount / 30) * 100);
  const isTodayRecited = Boolean(records[effectiveDay]?.recited);
  const todayJuz: LunarJuz = useMemo(() => getLunarJuzForDay(effectiveDay), [effectiveDay]);

  // Gentle reminder banner dismiss state
  const dismissKey = `taj_lunar_reminder_dismissed_${hijriDate.year}_${hijriDate.monthNumber}_${effectiveDay}`;
  const [isReminderDismissed, setIsReminderDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(dismissKey) === 'true';
    } catch {
      return false;
    }
  });

  const dismissReminder = useCallback(() => {
    setIsReminderDismissed(true);
    try {
      sessionStorage.setItem(dismissKey, 'true');
    } catch {
      // ignore
    }
  }, [dismissKey]);

  const restoreReminder = useCallback(() => {
    setIsReminderDismissed(false);
    try {
      sessionStorage.removeItem(dismissKey);
    } catch {
      // ignore
    }
  }, [dismissKey]);

  return {
    hijriDate,
    effectiveDay,
    dayOffset,
    setDayOffset,
    todayJuz,
    isTodayRecited,
    records,
    isJuzRecited,
    toggleJuzRecited,
    markTodayRecited,
    resetRunningMonth,
    completedCount,
    progressPercentage,
    allAjza: LUNAR_AJZA,
    isReminderDismissed,
    dismissReminder,
    restoreReminder
  };
}
