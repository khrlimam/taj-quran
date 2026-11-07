import React, { useState } from 'react';
import { 
  Moon, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  ExternalLink 
} from 'lucide-react';
import { LunarJuz } from '../data/lunarAjzaData';
import { HijriDateInfo } from '../hooks/useLunarRecitation';

interface LunarReminderBannerProps {
  hijriDate: HijriDateInfo;
  todayJuz: LunarJuz;
  isTodayRecited: boolean;
  completedCount: number;
  onJumpToPage: (page: number) => void;
  onToggleTodayRecited: () => void;
  onOpenMonthTracker: () => void;
  onDismiss?: () => void;
}

export const LunarReminderBanner: React.FC<LunarReminderBannerProps> = ({
  hijriDate,
  todayJuz,
  isTodayRecited,
  completedCount,
  onJumpToPage,
  onToggleTodayRecited,
  onOpenMonthTracker,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('taj_lunar_reminder_collapsed');
      return saved !== null ? saved === 'true' : false;
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('taj_lunar_reminder_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const [showReflection, setShowReflection] = useState(false);
  const surahsSummary = todayJuz.surahNames.join(', ');
  const hasNote = Boolean(todayJuz.scholarlyNote);

  return (
    <div className="w-full max-w-5xl mx-auto mb-2 sm:mb-3 transition-all duration-300">
      <div
        className={`relative overflow-hidden rounded-2xl border backdrop-blur-md shadow-xl transition-all ${
          isTodayRecited
            ? 'bg-gradient-to-r from-[#03291e]/95 via-[#043326]/95 to-[#022118]/95 border-emerald-500/50'
            : 'bg-gradient-to-r from-[#171e0c]/95 via-[#032e22]/95 to-[#121c10]/95 border-[#d4af37]/60'
        } ${isCollapsed ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'}`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

        {isCollapsed ? (
          /* ================= COLLAPSED: SIMPLER, INFORMATIVE & ACTIONABLE ================= */
          <div className="flex items-center justify-between gap-1.5 sm:gap-3">
            {/* Informative Summary (clickable to expand) */}
            <button
              onClick={toggleCollapsed}
              className="flex items-center gap-2 min-w-0 text-left hover:opacity-90 transition-opacity flex-1 py-0.5"
              title="Click to expand full reminder details & method"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                  isTodayRecited
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                }`}
              >
                <Moon size={15} className={isTodayRecited ? '' : 'animate-pulse'} />
              </div>

              <div className="min-w-0 flex flex-col xs:flex-row xs:items-center gap-0.5 xs:gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xs font-bold text-[#d4af37] whitespace-nowrap">
                    Day {hijriDate.day}
                  </span>
                  <span className="text-white font-semibold text-xs truncate">
                    • {todayJuz.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isTodayRecited ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium inline-flex items-center gap-0.5">
                      <CheckCircle2 size={10} />
                      <span>Recited</span>
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-medium">
                      Pending
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-300/70 hidden sm:inline">
                    ({completedCount}/30)
                  </span>
                </div>
              </div>
            </button>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Quick Recite Button */}
              <button
                onClick={() => onJumpToPage(todayJuz.startPdfPage)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all"
                title={`Jump to Page ${todayJuz.startPrintedPage} (${todayJuz.surahNames[0]})`}
              >
                <BookOpen size={13} />
                <span className="hidden xs:inline">{isTodayRecited ? 'Review' : 'Recite'}</span>
              </button>

              {/* Quick Done Toggle */}
              <button
                onClick={onToggleTodayRecited}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                  isTodayRecited
                    ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 hover:bg-emerald-600/50'
                    : 'bg-[#03241b] border-[#d4af37]/60 text-[#d4af37] hover:bg-[#064232]'
                }`}
                title={isTodayRecited ? 'Mark as not recited' : 'Mark as recited'}
              >
                {isTodayRecited ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span className="hidden sm:inline">Done</span>
                  </>
                ) : (
                  <>
                    <Circle size={13} />
                    <span className="hidden sm:inline">Done</span>
                  </>
                )}
              </button>

              {/* View Full Month Button */}
              <button
                onClick={onOpenMonthTracker}
                className="hidden sm:flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
                title="Open Running Month Progress"
              >
                <Calendar size={13} />
                <span>{completedCount}/30</span>
              </button>

              {/* Expand Toggle Button */}
              <button
                onClick={toggleCollapsed}
                className="p-1 sm:p-1.5 text-[#d4af37] hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Expand reminder details and method"
                aria-label="Expand reminder"
              >
                <ChevronDown size={17} />
              </button>
            </div>
          </div>
        ) : (
          /* ================= EXPANDED: FULL DETAILS & METHODOLOGY ================= */
          <div className="animate-fadeIn">
            {/* Top Header Row: Icon, Date, & Collapse Button */}
            <div className="flex items-center justify-between gap-2 mb-2 sm:mb-0">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                    isTodayRecited
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                  }`}
                >
                  <Moon size={16} className={isTodayRecited ? '' : 'animate-pulse'} />
                </div>

                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="text-xs font-bold text-[#d4af37]">
                    {hijriDate.formatted}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-emerald-200 border border-white/10 font-sans">
                    Day {hijriDate.day}
                  </span>
                  {isTodayRecited ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium flex items-center gap-0.5">
                      <CheckCircle2 size={10} />
                      Done
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-medium">
                      Today's Juz
                    </span>
                  )}
                </div>
              </div>

              {/* Collapse Button */}
              <button
                onClick={toggleCollapsed}
                className="flex items-center gap-1 px-2 py-1 text-emerald-300/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
                title="Collapse reminder to slim bar"
                aria-label="Collapse reminder"
              >
                <span className="hidden sm:inline text-[11px] font-medium">Collapse</span>
                <ChevronUp size={16} />
              </button>
            </div>

            {/* Content & Action Buttons */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-1 sm:mt-1.5">
              {/* Juz description */}
              <div className="flex-1 min-w-0 w-full space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {todayJuz.title}
                  </h3>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#043326] border border-emerald-500/30 text-emerald-300 font-mono">
                    Pages {todayJuz.startPrintedPage}–{todayJuz.endPrintedPage} • {todayJuz.totalVerses} verses
                  </span>
                </div>

                {/* Wrapped Surah Names */}
                <div className="text-xs sm:text-[13px] text-emerald-200/95 leading-relaxed break-words">
                  <span className="text-[#d4af37] font-semibold">Surahs: </span>
                  <span className="text-white/90 font-medium">{surahsSummary}</span>
                </div>

                <p className="text-[11px] text-emerald-300/70 leading-snug">
                  {isTodayRecited
                    ? `Alhamdulillah, recited for today! (${completedCount}/30 completed this month).`
                    : `Gentle reminder: Recite today's Juz to stay in harmony with the lunar month.`}
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full md:w-auto shrink-0 pt-1 md:pt-0">
                {/* Recite Now Button */}
                <button
                  onClick={() => onJumpToPage(todayJuz.startPdfPage)}
                  className="flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                  title={`Jump to Page ${todayJuz.startPrintedPage}`}
                >
                  <BookOpen size={14} />
                  <span>{isTodayRecited ? 'Review' : 'Recite'}</span>
                </button>

                {/* Mark as Recited Toggle */}
                <button
                  onClick={onToggleTodayRecited}
                  className={`flex items-center justify-center gap-1 px-2.5 py-2 sm:py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                    isTodayRecited
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 hover:bg-emerald-600/50'
                      : 'bg-[#03241b] border-[#d4af37]/60 text-[#d4af37] hover:bg-[#064232]'
                  }`}
                >
                  {isTodayRecited ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span>Done</span>
                    </>
                  ) : (
                    <>
                      <Circle size={14} />
                      <span>Mark Done</span>
                    </>
                  )}
                </button>

                {/* View Full Month Button */}
                <button
                  onClick={onOpenMonthTracker}
                  className="flex items-center justify-center gap-1 px-2.5 py-2 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
                  title="Open Running Month Progress"
                >
                  <Calendar size={14} />
                  <span>{completedCount}/30</span>
                </button>
              </div>
            </div>

            {/* Optional Scholarly Note Accordion (Days 15, 21, 23, 29, 30) */}
            {hasNote && todayJuz.scholarlyNote && (
              <div className="mt-2.5 pt-2 border-t border-[#d4af37]/20">
                <button
                  onClick={() => setShowReflection(!showReflection)}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-[#d4af37] hover:text-amber-200 transition-colors w-full text-left"
                >
                  <Sparkles size={12} className="shrink-0" />
                  <span className="break-words flex-1">
                    Reflection for Day {todayJuz.day}: {todayJuz.scholarlyNote.title}
                  </span>
                  {showReflection ? <ChevronUp size={12} className="shrink-0" /> : <ChevronDown size={12} className="shrink-0" />}
                </button>

                {showReflection && (
                  <div className="mt-2 p-2.5 sm:p-3 rounded-xl bg-black/40 border border-[#d4af37]/30 text-xs text-emerald-100/90 space-y-2 animate-fadeIn">
                    <p className="leading-relaxed italic text-[11px] sm:text-xs">
                      "{todayJuz.scholarlyNote.excerpt}"
                    </p>
                    {todayJuz.scholarlyNote.arabicQuote && (
                      <p className="font-serif text-right text-xs sm:text-sm text-[#d4af37] leading-relaxed">
                        {todayJuz.scholarlyNote.arabicQuote}
                      </p>
                    )}
                    {todayJuz.scholarlyNote.translationQuote && (
                      <p className="text-[10px] sm:text-[11px] text-emerald-200/80">
                        {todayJuz.scholarlyNote.translationQuote}
                      </p>
                    )}
                    <div className="text-[10px] text-[#d4af37]/80 text-right">
                      — Reference: {todayJuz.scholarlyNote.quranReference}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Attribution & Book Reference */}
            <div className="mt-2 pt-2 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-[10px] sm:text-[11px] text-emerald-300/70">
              <p className="leading-normal">
                The method presented on this recitation is the book by Syaikh Imran N. Hosein titled{' '}
                <span className="font-semibold text-emerald-200">
                  THE QUR’ĀN AND THE MOON - Divine Methodology for Monthly Recitation of the Qur’ān
                </span>.
              </p>
              <a
                href="https://imranhosein.org/o/wp-content/uploads/2021/04/Text-Final-The-Quran-and-the-Moon-Web.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#d4af37] hover:text-amber-200 underline underline-offset-2 shrink-0 transition-colors font-semibold"
                title="Read book: The Qur’ān and the Moon by Syaikh Imran N. Hosein"
              >
                <span>Read Book</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
