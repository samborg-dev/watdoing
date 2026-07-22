"use client";

import type { NoteTheme } from "./colors";
import DoneButton from "./doneButton";
import DoneGraphic from "./doneGraphic";
import ItemLook from "./itemLook";

export type ItemRecord = {
  id: string;
  title: string;
  description: string;
  theme: NoteTheme;
  date: string; // local YYYY-MM-DD, see week.ts
  done: boolean;
};

type ItemProps = {
  item: ItemRecord;
  onToggleDone: (id: string) => void;
  compact?: boolean;
};

export default function Item({ item, onToggleDone, compact = false }: ItemProps) {
  const { id, title, description, theme, done } = item;

  return (
    <div
      className={`transform transition duration-200 hover:scale-110 hover:cursor-pointer ${done ? "opacity-50" : ""}`}
    >
      <ItemLook
        color={theme.bg}
        textColor={theme.text}
        borderColor={theme.border}
        shadow={theme.shadow}
        compact={compact}
      >
        {done ? <DoneGraphic /> : null}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className={compact ? "font-bold" : "text-2xl font-bold"}>
              {title}
            </span>
            {compact ? null : <span>{description}</span>}
          </div>
          <DoneButton
            color={theme.bg}
            textColor={theme.text}
            borderColor={theme.border}
            shadow={theme.shadow}
            done={done}
            size={compact ? "icon-sm" : "icon"}
            onClick={() => onToggleDone(id)}
          />
        </div>
      </ItemLook>
    </div>
  );
}
