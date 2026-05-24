import * as React from "react";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

interface CalendarProps {
  monthYear?: string;
  callDuration?: string;
  weekDays?: string[];
  selectedDay?: number;
  availableDays?: number[];
  unavailableDays?: number[];
  labels?: {
    today: string;
    available: string;
  };
  locale?: 'ar' | 'en' | 'tr';
}

export function Calendar({
  monthYear = "أبريل 2026",
  callDuration = "30 min call",
  weekDays = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
  selectedDay = 13,
  availableDays = [14, 15, 16, 17, 20, 21, 22, 23, 24, 27],
  unavailableDays = [18, 19, 25, 26, 28, 29, 30],
  labels = { today: "اليوم", available: "متاح" },
}: CalendarProps) {
  // Generate days 1-30
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // Empty cells for the start (first 3 days are empty in the original)
  const emptyStartCells = [null, null, null];

  const getDayClass = (day: number) => {
    const baseClass = "h-7 w-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors";

    if (day === selectedDay) {
      return `${baseClass} bg-violet text-white ring-2 ring-violet/30`;
    }
    if (availableDays.includes(day)) {
      return `${baseClass} bg-violet/20 text-violet-light hover:bg-violet/30 cursor-pointer`;
    }
    if (unavailableDays.includes(day)) {
      return `${baseClass} text-zinc-400`;
    }
    return `${baseClass} text-zinc-700`;
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-zinc-50 font-syne font-bold text-sm">{monthYear}</p>
          <p className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1">
            <Clock size={10} />
            {callDuration}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-violet/20 flex items-center justify-center">
          <CalendarIcon size={14} className="text-violet" />
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <div key={index} className="h-7 flex items-center justify-center">
            <span className="text-[10px] font-medium text-zinc-500">{day}</span>
          </div>
        ))}

        {/* Empty cells at start */}
        {emptyStartCells.map((_, index) => (
          <div key={`empty-${index}`} className="h-7" />
        ))}

        {/* Days */}
        {days.map((day) => (
          <div key={day} className={getDayClass(day)}>
            {day}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-violet" />
          <span className="text-[10px] text-zinc-500">{labels.today}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-violet/30" />
          <span className="text-[10px] text-zinc-500">{labels.available}</span>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
