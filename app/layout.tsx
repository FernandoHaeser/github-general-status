import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt",
});

export const metadata: Metadata = {
  title: "FernandoHaeser // STATS.EXE",
  description: "GitHub stats dashboard – 8-bit edition",
  openGraph: {
    title: "FernandoHaeser // STATS.EXE",
    description: "GitHub stats dashboard – 8-bit edition",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${vt323.variable}`}>
        {children}
      </body>
    </html>
  );
}
