import type { ComponentProps } from "react";
import { CircleCheckBig, RefreshCw } from "lucide-react";

import { Button } from "./ui/button";

type DoneButtonProps = {
  color: string;
  textColor: string;
  shadow: string;
  borderColor: string;
  done: boolean;
  onClick?: ComponentProps<"button">["onClick"];
};

export default function DoneButton({
  color,
  textColor,
  shadow,
  borderColor,
  done,
  onClick,
}: DoneButtonProps) {
  const hoverColor = color.startsWith("bg-")
    ? `${color.replace(/^bg-/, "hover:bg-")}/20`
    : "";

  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      className={`${borderColor} ${shadow} ${color} ${textColor} ${hoverColor} transition-transform duration-200 hover:scale-110 hover:cursor-pointer`}
      onClick={onClick}
      aria-label={done ? "Mark not done" : "Mark done"}
    >
      {done ? <RefreshCw /> : <CircleCheckBig />}
    </Button>
  );
}
