import { CircleCheckBig } from "lucide-react";

export default function DoneGraphic() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-50">
      <CircleCheckBig className="size-96" aria-hidden />
    </div>
  );
}
