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
  X,
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
  onDismiss: () => void;
}

export const LunarReminderBanner: React.FC<LunarReminderBannerProps> = ({
  hijriDate,
  todayJuz,
  isTodayRecited,
  completedCount,
  onJumpToPage,
  onToggleTodayRecited,
  onOpenMonthTracker,
  onDismiss,
}) => {
  const [showReflection, setShowReflection] = useState(false);

  const surahsSummary = todayJuz.surahNames.join(', ');
  const hasNote = Boolean(todayJuz.scholarlyNote);

  return (
    <div className="w-full max-w-5xl mx-auto mb-3 transition-all duration-300">
      <div
        className={`relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 backdrop-blur-md shadow-xl transition-all ${
          isTodayRecited
            ? 'bg-gradient-to-r from-[#03291e]/90 via-[#043326]/90 to-[#022118]/90 border-emerald-500/50'
            : 'bg-gradient-to-r from-[#171e0c]/90 via-[#032e22]/90 to-[#121c10]/90 border-[#d4af37]/60'
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left section: Date & Juz details */}
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                isTodayRecited
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
              }`}
            >
              <Moon size={22} className="animate-pulse" />
            </div>

            <div>
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                  {hijriDate.formatted}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/10 font-sans">
                  Day {hijriDate.day} of {hijriDate.month}
                </span>
                {isTodayRecited ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Recited Today
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-medium">
                    Today's Recitation
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                <h3 className="text-base font-bold text-white tracking-wide">
                  {todayJuz.title}
                </h3>
                <span className="text-xs text-emerald-300/80">
                  ({surahsSummary} • {todayJuz.totalVerses} verses • Pages{' '}
                  {todayJuz.startPrintedPage}–{todayJuz.endPrintedPage})
                </span>
              </div>

              {/* Gentle encouragement note */}
              <p className="text-[12px] text-emerald-200/80 mt-0.5">
                {isTodayRecited
                  ? `Alhamdulillah, you have recited today's Juz! (${completedCount}/30 completed this month).`
                  : `Gentle reminder: Recite today's Juz (${todayJuz.title}) to stay in rhythm with the lunar month.`}
              </p>
            </div>
          </div>

          {/* Right section: Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end pt-1 sm:pt-0">
            {/* Recite Now Button */}
            <button
              onClick={() => onJumpToPage(todayJuz.startPdfPage)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
              title={`Jump to Page ${todayJuz.startPrintedPage} to start reading`}
            >
              <BookOpen size={14} />
              <span>{isTodayRecited ? 'Review Juz' : 'Recite Now'}</span>
            </button>

            {/* Mark as Recited Toggle */}
            <button
              onClick={onToggleTodayRecited}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
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
                  <span>Mark Recited</span>
                </>
              )}
            </button>

            {/* View Full Month Button */}
            <button
              onClick={onOpenMonthTracker}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
              title="Open Running Month Progress"
            >
              <Calendar size={14} />
              <span className="hidden sm:inline">Monthly</span>
              <span>({completedCount}/30)</span>
            </button>

            {/* Dismiss banner */}
            <button
              onClick={onDismiss}
              className="p-1.5 text-emerald-400/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Hide reminder for this session"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Optional Scholarly Note Accordion (Days 15, 21, 23, 29, 30) */}
        {hasNote && todayJuz.scholarlyNote && (
          <div className="mt-2.5 pt-2 border-t border-[#d4af37]/20">
            <button
              onClick={() => setShowReflection(!showReflection)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[#d4af37] hover:text-amber-200 transition-colors"
            >
              <Sparkles size={13} />
              <span>
                Reflection for Day {todayJuz.day}: {todayJuz.scholarlyNote.title}
              </span>
              {showReflection ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {showReflection && (
              <div className="mt-2 p-3 rounded-xl bg-black/40 border border-[#d4af37]/30 text-xs text-emerald-100/90 space-y-2 animate-fadeIn">
                <p className="leading-relaxed italic">
                  "{todayJuz.scholarlyNote.excerpt}"
                </p>
                {todayJuz.scholarlyNote.arabicQuote && (
                  <p className="font-serif text-right text-sm text-[#d4af37] leading-relaxed">
                    {todayJuz.scholarlyNote.arabicQuote}
                  </p>
                )}
                {todayJuz.scholarlyNote.translationQuote && (
                  <p className="text-[11px] text-emerald-200/80">
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
        <div className="mt-2.5 pt-2 border-t border-[#d4af37]/20 flex items-center justify-between flex-wrap gap-2 text-[11px] text-emerald-300/70">
          <p className="flex-1 min-w-[240px]">
            The method presented on this recitation is the book by Syaikh Imran N. Hosein titled{' '}
            <span className="font-semibold text-emerald-200">
              THE QUR’ĀN AND THE MOON - Divine Methodology for Monthly Recitation of the Qur’ān
            </span>.
          </p>
          <a
            href="https://imranhosein.org/o/wp-content/uploads/2021/04/Text-Final-The-Quran-and-the-Moon-Web.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#d4af37] hover:text-amber-200 underline underline-offset-2 shrink-0 transition-colors font-medium"
            title="Read book: The Qur’ān and the Moon by Syaikh Imran N. Hosein"
          >
            <span>Read Book</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
