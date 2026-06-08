import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FernandoHaeser · GitHub Stats",
  description: "GitHub stats and activity for FernandoHaeser",
  openGraph: {
    title: "FernandoHaeser · GitHub Stats",
    description: "GitHub stats and activity for FernandoHaeser",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
