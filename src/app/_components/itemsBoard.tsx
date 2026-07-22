"use client";

import { useMemo, useState } from "react";

import { api, type RouterOutputs } from "~/trpc/react";
import { colors, type NoteTheme } from "./colors";
import DayView from "./dayView";
import { type ItemRecord } from "./item";
import MonthView from "./monthView";
import PeriodNav from "./periodNav";
import ViewToggle, { type View } from "./viewToggle";
import WeekView from "./weekView";
import {
  addDays,
  addMonths,
  dateKey,
  formatDayTitle,
  formatMonthTitle,
  formatWeekTitle,
  monthGridDays,
  weekDays,
} from "./week";

type ServerNote = RouterOutputs["note"]["list"][number];
const themeKeys = Object.keys(colors) as (keyof typeof colors)[];

function randomThemeKey() {
  return themeKeys[Math.floor(Math.random() * themeKeys.length)]!;
}

function themeFor(key: string): NoteTheme {
  return colors[key as keyof typeof colors] ?? colors.yellow;
}

function toItemRecord(n: ServerNote): ItemRecord {
  return {
    id: n.id,
    title: n.title,
    description: n.description ?? "",
    theme: themeFor(n.theme),
    date: n.date,
    done: n.done,
  };
}

// The [start, end] date range the current view needs to load.
function rangeFor(view: View, cursor: Date): { start: string; end: string } {
  if (view === "day") {
    const key = dateKey(cursor);
    return { start: key, end: key };
  }
  const days = view === "week" ? weekDays(cursor) : monthGridDays(cursor);
  return { start: dateKey(days[0]!), end: dateKey(days[days.length - 1]!) };
}

export default function ItemsBoard() {
  const [view, setView] = useState<View>("day");
  const [cursor, setCursor] = useState<Date>(() => new Date());

  const range = rangeFor(view, cursor);
  const utils = api.useUtils();
  const notesQuery = api.note.list.useQuery(range);
  const notes = notesQuery.data ?? [];

  const createNote = api.note.create.useMutation({
    onSuccess: () => utils.note.list.invalidate(),
  });
  const setDone = api.note.setDone.useMutation({
    onSuccess: () => utils.note.list.invalidate(),
  });

  const itemsByDate = useMemo(() => {
    const map = new Map<string, ItemRecord[]>();
    for (const n of notes) {
      const rec = toItemRecord(n);
      const bucket = map.get(rec.date) ?? [];
      bucket.push(rec);
      map.set(rec.date, bucket);
    }
    return map;
  }, [notes]);

  function addItem(date: Date) {
    createNote.mutate({
      title: "New note",
      description: "What are you doing?",
      theme: randomThemeKey(),
      date: dateKey(date),
    });
  }

  function toggleDone(id: string) {
    const current = notes.find((n) => n.id === id);
    if (!current) return;
    setDone.mutate({ id, done: !current.done });
  }

  const step = view === "day" ? 1 : view === "week" ? 7 : 0;
  function shift(direction: 1 | -1) {
    setCursor((prev) =>
      view === "month"
        ? addMonths(prev, direction)
        : addDays(prev, direction * step),
    );
  }

  const title =
    view === "day"
      ? formatDayTitle(cursor)
      : view === "week"
        ? formatWeekTitle(cursor)
        : formatMonthTitle(cursor);

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 py-8">
      <div className="flex w-full max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <PeriodNav
          title={title}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          onToday={() => setCursor(new Date())}
        />
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "day" ? (
        <DayView
          items={itemsByDate.get(dateKey(cursor)) ?? []}
          onAdd={() => addItem(cursor)}
          onToggleDone={toggleDone}
        />
      ) : view === "week" ? (
        <WeekView
          cursor={cursor}
          itemsByDate={itemsByDate}
          onAdd={addItem}
          onToggleDone={toggleDone}
        />
      ) : (
        <MonthView
          cursor={cursor}
          itemsByDate={itemsByDate}
          onSelectDay={(date) => {
            setCursor(date);
            setView("day");
          }}
        />
      )}
    </div>
  );
}
