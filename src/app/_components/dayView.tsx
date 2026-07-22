"use client";

import AddButton from "./addButton";
import Item, { type ItemRecord } from "./item";

type DayViewProps = {
  items: ItemRecord[];
  onAdd: () => void;
  onToggleDone: (id: string) => void;
};

export default function DayView({ items, onAdd, onToggleDone }: DayViewProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <AddButton onClick={onAdd} />

      {items.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          Nothing here yet. Add a note for this day.
        </p>
      ) : (
        items.map((item) => (
          <Item key={item.id} item={item} onToggleDone={onToggleDone} />
        ))
      )}
    </div>
  );
}
