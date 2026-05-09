export const colors = {
  yellow: {
    bg: "bg-yellow-200",
    text: "text-amber-950",
    border: "border-amber-300/50",
    shadow: "shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_14px_32px_rgba(0,0,0,0.22),3px_4px_0_rgba(217,119,6,0.22)]",
  },
  pink: {
    bg: "bg-pink-200",
    text: "text-pink-950",
    border: "border-pink-300/50",
    shadow: "shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_14px_32px_rgba(0,0,0,0.22),3px_4px_0_rgba(219,39,119,0.22)]",
  },
  blue: {
    bg: "bg-blue-200",
    text: "text-blue-950",
    border: "border-blue-300/50",
    shadow: "shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_14px_32px_rgba(0,0,0,0.22),3px_4px_0_rgba(39,119,219,0.22)]",
  },
  green: {
    bg: "bg-green-200",
    text: "text-green-950",
    border: "border-green-300/50",
    shadow: "shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_14px_32px_rgba(0,0,0,0.22),3px_4px_0_rgba(39,219,119,0.22)]",
  },
  purple: {
    bg: "bg-purple-200",
    text: "text-purple-950",
    border: "border-purple-300/50",
    shadow: "shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_14px_32px_rgba(0,0,0,0.22),3px_4px_0_rgba(119,39,219,0.22)]",
  },
  orange: {
    bg: "bg-orange-200",
    text: "text-orange-950",
    border: "border-orange-300/50",
    shadow: "shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_14px_32px_rgba(0,0,0,0.22),3px_4px_0_rgba(219,119,39,0.22)]",
},
} as const;

export type NoteTheme = (typeof colors)[keyof typeof colors];
