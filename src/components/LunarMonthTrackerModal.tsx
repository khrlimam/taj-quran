import React, { useState, useMemo } from 'react';
import { 
  X, 
  Moon, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Sparkles, 
  RotateCcw, 
  ChevronDown,
  ChevronUp,
  Sliders,
  Award,
  ExternalLink
} from 'lucide-react';
import { LUNAR_AJZA, LunarJuz } from '../data/lunarAjzaData';
import { HijriDateInfo } from '../hooks/useLunarRecitation';

interface LunarMonthTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  hijriDate: HijriDateInfo;
  effectiveDay: number;
  dayOffset: number;
  onSetDayOffset: (offset: number) => void;
  isJuzRecited: (day: number) => boolean;
  onToggleJuzRecited: (day: number) => void;
  completedCount: number;
  progressPercentage: number;
  onResetMonth: () => void;
  onJumpToPage: (page: number) => void;
}

export const LunarMonthTrackerModal: React.FC<LunarMonthTrackerModalProps> = ({
  isOpen,
  onClose,
  hijriDate,
  effectiveDay,
  dayOffset,
  onSetDayOffset,
  isJuzRecited,
  onToggleJuzRecited,
  completedCount,
  progressPercentage,
  onResetMonth,
  onJumpToPage
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedDayNote, setExpandedDayNote] = useState<number | null>(null);
  const [showOffsetControls, setShowOffsetControls] = useState<boolean>(false);

  const filteredAjza = useMemo(() => {
    return LUNAR_AJZA.filter(juz => {
      const recited = isJuzRecited(juz.day);
      if (filter === 'completed') return recited;
      if (filter === 'pending') return !recited;
      return true;
    });
  }, [filter, isJuzRecited]);

  if (!isOpen) return null;

  const handleReciteJuz = (juz: LunarJuz) => {
    onJumpToPage(juz.startPdfPage);
    onClose();
  };

  const handleResetConfirm = () => {
    if (window.confirm('Are you sure you want to reset recitation records for this lunar month?')) {
      onResetMonth();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-[#052c21] text-white rounded-2xl shadow-2xl border-2 border-[#d4af37] flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#032018] border-b border-[#d4af37]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b45309] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#032018] rounded-[10px] flex items-center justify-center text-[#d4af37]">
                <Moon size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#d4af37] tracking-wide">
                Lunar Month Recitation Tracker
              </h2>
              <p className="text-xs text-emerald-200/80">
                {hijriDate.formatted} • 1 Juz per Lunar Day Schedule
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Month Progress & Controls Card */}
        <div className="bg-[#04241b] border-b border-[#d4af37]/20 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-200">Running Month Progress:</span>
                <span className="text-sm font-bold text-[#d4af37]">
                  {completedCount} of 30 Juz Recited ({progressPercentage}%)
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mt-0.5">
                Today is Day {effectiveDay} ({LUNAR_AJZA[effectiveDay - 1]?.title}) •{' '}
                {isJuzRecited(effectiveDay) ? 'Recited ✓' : 'Pending'}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Moon sighting offset toggle */}
              <button
                onClick={() => setShowOffsetControls(!showOffsetControls)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
                  dayOffset !== 0
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                    : 'bg-white/5 border-white/10 text-emerald-300 hover:bg-white/10'
                }`}
                title="Adjust for local moon sighting differences"
              >
                <Sliders size={13} />
                <span>Offset: {dayOffset > 0 ? `+${dayOffset}` : dayOffset}d</span>
              </button>

              <button
                onClick={handleResetConfirm}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/40 transition-colors"
                title="Reset this month's checkmarks"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-[#d4af37]/30">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-[#d4af37] to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Moon Sighting Offset Settings drawer */}
          {showOffsetControls && (
            <div className="mt-3 p-3 rounded-xl bg-black/40 border border-[#d4af37]/30 text-xs animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#d4af37] flex items-center gap-1.5">
                  <Moon size={14} /> Regional Moon Sighting Offset
                </span>
                <span className="text-[11px] text-emerald-300/70">
                  Current Day: {effectiveDay}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 mb-2">
                Depending on your country or regional sighting, your lunar calendar may be $\pm 1$ or $\pm 2$ days relative to standard Umm al-Qura.
              </p>
              <div className="flex items-center gap-1.5">
                {[-2, -1, 0, 1, 2].map((offset) => (
                  <button
                    key={offset}
                    onClick={() => onSetDayOffset(offset)}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      dayOffset === offset
                        ? 'bg-[#d4af37] text-gray-950 border-[#d4af37] shadow-md'
                        : 'bg-white/5 text-emerald-200 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {offset === 0 ? 'Standard (0)' : offset > 0 ? `+${offset} day` : `${offset} day`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#d4af37] text-gray-950 font-bold'
                    : 'text-emerald-200 hover:text-white hover:bg-white/5'
                }`}
              >
                All 30 Days
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filter === 'pending'
                    ? 'bg-[#d4af37] text-gray-950 font-bold'
                    : 'text-emerald-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Pending ({30 - completedCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filter === 'completed'
                    ? 'bg-[#d4af37] text-gray-950 font-bold'
                    : 'text-emerald-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Recited ({completedCount})
              </button>
            </div>

            {completedCount === 30 && (
              <span className="flex items-center gap-1 text-xs text-amber-300 font-bold animate-pulse">
                <Award size={14} /> Khatam Completed!
              </span>
            )}
          </div>
        </div>

        {/* 30 Days List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar">
          {filteredAjza.map((juz) => {
            const isToday = juz.day === effectiveDay;
            const recited = isJuzRecited(juz.day);
            const isExpandedNote = expandedDayNote === juz.day;
            const hasNote = Boolean(juz.scholarlyNote);

            return (
              <div
                key={juz.day}
                className={`rounded-xl border transition-all duration-200 ${
                  isToday
                    ? 'bg-gradient-to-r from-[#074735] via-[#053d2e] to-[#043326] border-[#d4af37] shadow-lg ring-2 ring-[#d4af37]/30'
                    : recited
                    ? 'bg-[#032a20]/70 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-[#04241b]/70 border-white/10 hover:border-[#d4af37]/40'
                }`}
              >
                <div className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Checkbox + Day info */}
                  <div className="flex items-start gap-3 flex-1">
                    {/* Checkbox button */}
                    <button
                      onClick={() => onToggleJuzRecited(juz.day)}
                      className={`mt-0.5 p-1 rounded-lg transition-transform active:scale-90 ${
                        recited
                          ? 'text-emerald-400 hover:text-emerald-300'
                          : 'text-gray-400 hover:text-[#d4af37]'
                      }`}
                      title={recited ? 'Mark as Pending' : 'Mark as Recited'}
                    >
                      {recited ? (
                        <CheckCircle2 size={22} className="text-emerald-400" />
                      ) : (
                        <Circle size={22} />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="text-xs font-bold text-[#d4af37]">
                          Day {juz.day}
                        </span>
                        {isToday && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 uppercase tracking-wider">
                            Today
                          </span>
                        )}
                        {recited && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Recited
                          </span>
                        )}
                        <span className="text-xs text-white/90 font-medium">
                          • {juz.title}
                        </span>
                      </div>

                      {/* Surahs and Verses */}
                      <div className="mt-1 flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                        <span className="text-xs text-emerald-200">
                          {juz.surahNames.join(', ')}
                        </span>
                        <span className="text-[11px] text-emerald-300/60 font-serif" dir="rtl">
                          {juz.surahArabicNames.join('، ')}
                        </span>
                      </div>

                      {/* Page and Verses specs */}
                      <div className="text-[11px] text-emerald-300/60 mt-0.5 flex items-center gap-3">
                        <span>{juz.totalVerses} verses</span>
                        <span>•</span>
                        <span>
                          Pages {juz.startPrintedPage}–{juz.endPrintedPage} (PDF {juz.startPdfPage}–{juz.endPdfPage})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Scholar note button */}
                    {hasNote && (
                      <button
                        onClick={() => setExpandedDayNote(isExpandedNote ? null : juz.day)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                          isExpandedNote
                            ? 'bg-[#d4af37]/30 border-[#d4af37] text-amber-200'
                            : 'bg-white/5 border-amber-500/30 text-[#d4af37] hover:bg-white/10'
                        }`}
                        title="Read celestial and eschatological reflection"
                      >
                        <Sparkles size={13} />
                        <span className="hidden md:inline">Reflection</span>
                        {isExpandedNote ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    )}

                    {/* Recite Now Button */}
                    <button
                      onClick={() => handleReciteJuz(juz)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-gray-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                    >
                      <BookOpen size={14} />
                      <span>Recite</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Scholar Reflection note */}
                {hasNote && isExpandedNote && juz.scholarlyNote && (
                  <div className="px-4 pb-3 pt-1 border-t border-[#d4af37]/20 bg-black/30 rounded-b-xl text-xs space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] pt-2">
                      <Sparkles size={14} />
                      <span>{juz.scholarlyNote.title}</span>
                    </div>
                    <p className="text-emerald-100/90 leading-relaxed italic">
                      "{juz.scholarlyNote.excerpt}"
                    </p>
                    {juz.scholarlyNote.arabicQuote && (
                      <p className="font-serif text-right text-sm text-[#d4af37] leading-relaxed pt-1">
                        {juz.scholarlyNote.arabicQuote}
                      </p>
                    )}
                    {juz.scholarlyNote.translationQuote && (
                      <p className="text-[11px] text-emerald-200/80">
                        {juz.scholarlyNote.translationQuote}
                      </p>
                    )}
                    <div className="text-[10px] text-[#d4af37]/80 text-right">
                      — {juz.scholarlyNote.quranReference}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#032018] border-t border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-emerald-300/70">
          <p className="flex-1">
            Methodology from the book by Syaikh Imran N. Hosein:{' '}
            <a
              href="https://imranhosein.org/o/wp-content/uploads/2021/04/Text-Final-The-Quran-and-the-Moon-Web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37] hover:text-amber-200 underline underline-offset-2 font-medium inline-flex items-center gap-1"
            >
              <span>THE QUR’ĀN AND THE MOON</span>
              <ExternalLink size={11} />
            </a>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
