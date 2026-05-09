"use client";

import { useState } from "react";

import AddButton from "./addButton";
import { colors } from "./colors";
import Item, { type ItemRecord } from "./item";

const themes = Object.values(colors);

function makeItem(): ItemRecord {
  return {
    id: crypto.randomUUID(),
    title: "Did you watch a movie this week?",
    description: "Watch a new movie this week.",
    theme: themes[Math.floor(Math.random() * themes.length)]!,
  };
}

export default function ItemsBoard() {
  const [items, setItems] = useState<ItemRecord[]>(() => [makeItem()]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 py-2">
      <AddButton onClick={() => setItems((prev) => [...prev, makeItem()])} />
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
}
