"use client";

import type { ItemRecord } from "./item";
import {
  dateKey,
  isSameMonth,
  isToday,
  monthGridDays,
  WEEKDAY_LABELS,
} from "./week";

type MonthViewProps = {
  cursor: Date;
  itemsByDate: Map<string, ItemRecord[]>;
  onSelectDay: (date: Date) => void;
};

export default function MonthView({
  cursor,
  itemsByDate,
  onSelectDay,
}: MonthViewProps) {
  const days = monthGridDays(cursor);

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="pb-2 text-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = dateKey(day);
          const dayItems = itemsByDate.get(key) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const today = isToday(day);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`flex min-h-24 flex-col gap-1 rounded-md border p-1.5 text-left transition-colors hover:cursor-pointer hover:bg-muted ${
                today ? "border-primary" : "border-border"
              } ${inMonth ? "" : "opacity-40"}`}
            >
              <span
                className={`text-xs font-semibold ${today ? "text-primary" : ""}`}
              >
                {day.getDate()}
              </span>

              <div className="flex flex-col gap-0.5 overflow-hidden">
                {dayItems.slice(0, 3).map((item) => (
                  <span
                    key={item.id}
                    className={`truncate rounded px-1 py-0.5 text-[0.65rem] leading-tight ${item.theme.bg} ${item.theme.text} ${item.done ? "line-through opacity-60" : ""}`}
                  >
                    {item.title}
                  </span>
                ))}
                {dayItems.length > 3 ? (
                  <span className="px-1 text-[0.65rem] text-muted-foreground">
                    +{dayItems.length - 3} more
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
