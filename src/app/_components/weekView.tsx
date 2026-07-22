"use client";

import { Plus } from "lucide-react";

import Item, { type ItemRecord } from "./item";
import { Button } from "./ui/button";
import { dateKey, isToday, weekDays } from "./week";

type WeekViewProps = {
  cursor: Date;
  itemsByDate: Map<string, ItemRecord[]>;
  onAdd: (date: Date) => void;
  onToggleDone: (id: string) => void;
};

export default function WeekView({
  cursor,
  itemsByDate,
  onAdd,
  onToggleDone,
}: WeekViewProps) {
  const days = weekDays(cursor);

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((day) => {
        const key = dateKey(day);
        const dayItems = itemsByDate.get(key) ?? [];
        const today = isToday(day);

        return (
          <div
            key={key}
            className={`flex min-h-40 flex-col gap-2 rounded-lg border p-2 ${
              today ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-muted-foreground">
                  {day.toLocaleDateString(undefined, { weekday: "short" })}
                </span>
                <span
                  className={`text-sm font-semibold ${today ? "text-primary" : ""}`}
                >
                  {day.getDate()}
                </span>
              </div>
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                className="hover:cursor-pointer"
                aria-label="Add note"
                onClick={() => onAdd(day)}
              >
                <Plus />
              </Button>
            </div>

            <div className="flex flex-col items-center gap-1">
              {dayItems.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  onToggleDone={onToggleDone}
                  compact
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
