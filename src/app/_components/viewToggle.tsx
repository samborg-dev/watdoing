"use client";

import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export type View = "day" | "week" | "month";

const VIEWS: { value: View; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

type ViewToggleProps = {
  view: View;
  onChange: (view: View) => void;
};

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <Tabs value={view} onValueChange={(v) => onChange(v as View)}>
      <TabsList>
        {VIEWS.map(({ value, label }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
