"use client";

import { useState } from "react";

import type { NoteTheme } from "./colors";
import DoneButton from "./doneButton";
import DoneGraphic from "./doneGraphic";
import ItemLook from "./itemLook";

export type ItemRecord = {
  id: string;
  title: string;
  description: string;
  theme: NoteTheme;
};

type ItemProps = {
  item: ItemRecord;
};

export default function Item({ item }: ItemProps) {
  const { title, description, theme } = item;
  const [isDone, setIsDone] = useState(false);

  return (
    <div
      className={`transform transition duration-200 hover:scale-110 hover:cursor-pointer ${isDone ? "opacity-50" : ""}`}
    >
      <ItemLook
        color={theme.bg}
        textColor={theme.text}
        borderColor={theme.border}
        shadow={theme.shadow}
      >
        {isDone ? <DoneGraphic /> : null}
        <div className="relative z-10 flex min-x-px2 min-y-px2 flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-2xl font-bold">{title}</span>
            <span>{description}</span>
          </div>
          <DoneButton
            color={theme.bg}
            textColor={theme.text}
            borderColor={theme.border}
            shadow={theme.shadow}
            done={isDone}
            onClick={() => setIsDone((d) => !d)}
          />
        </div>
      </ItemLook>
    </div>
  );
}
