import type { ComponentProps } from "react";
import { CircleFadingPlus } from "lucide-react";

import { Button } from "./ui/button";

type AddButtonProps = {
  onClick?: ComponentProps<"button">["onClick"];
};

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      className="transition-transform duration-200 hover:scale-110 hover:cursor-pointer"
      onClick={onClick}
    >
      <CircleFadingPlus />
    </Button>
  );
}
