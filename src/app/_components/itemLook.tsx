import { Kalam } from "next/font/google";

// Notes load the handwriting font independently so they stay self-contained
// even if the app-wide font changes.
const noteFont = Kalam({
    weight: "400",
    subsets: ["latin"],
});

type ItemLookProps = {
    color: string;
    textColor: string;
    shadow: string;
    borderColor: string;
    compact?: boolean;
    children: React.ReactNode;
};

export default function ItemLook({
    color,
    textColor,
    shadow,
    borderColor,
    compact = false,
    children,
}: ItemLookProps) {
    return (
        <div className={compact ? "flex justify-center py-2" : "flex justify-center py-6"}>
            <div
                className={`${noteFont.className} relative w-full rotate-[-2.5deg] ${compact ? "max-w-[10rem]" : "max-w-xs"}`}
            >
                <div
                    className={`relative overflow-hidden rounded-[2px] border text-center leading-snug ${
                        compact
                            ? "px-4 pb-5 pt-4 text-[0.95rem]"
                            : "px-8 pb-10 pt-8 text-[1.2rem]"
                    } ${borderColor} ${shadow} ${color} ${textColor}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
