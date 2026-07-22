import "~/styles/globals.css";

import { type Metadata } from "next";
import { Kalam } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "watdoing",
  description: "this is the watdoing app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// The handwriting font the sticky notes use — now the whole app's font.
const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${kalam.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
