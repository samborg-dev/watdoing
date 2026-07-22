"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./ui/button";

type PeriodNavProps = {
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function PeriodNav({
  title,
  onPrev,
  onNext,
  onToday,
}: PeriodNavProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        className="hover:cursor-pointer"
        aria-label="Previous"
        onClick={onPrev}
      >
        <ChevronLeft />
      </Button>

      <button
        type="button"
        onClick={onToday}
        className="min-w-[11rem] text-center text-lg font-semibold hover:cursor-pointer hover:underline"
        title="Jump to today"
      >
        {title}
      </button>

      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        className="hover:cursor-pointer"
        aria-label="Next"
        onClick={onNext}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
