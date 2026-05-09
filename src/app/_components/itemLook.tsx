import { Kalam } from "next/font/google";

const noteFont = Kalam({
    weight: "400",
    subsets: ["latin"],
});

type ItemLookProps = {
    color: string;
    textColor: string;
    shadow: string;
    borderColor: string;
    children: React.ReactNode;
};

export default function ItemLook({
    color,
    textColor,
    shadow,
    borderColor,
    children,
}: ItemLookProps) {
    return (
        <div className="flex justify-center py-6">
            <div
                className={`${noteFont.className} relative w-full max-w-xs rotate-[-2.5deg]`}
            >
                <div
                    className={`relative overflow-hidden rounded-[2px] border px-8 pb-10 pt-8 text-center text-[1.2rem] leading-snug ${borderColor} ${shadow} ${color} ${textColor}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
