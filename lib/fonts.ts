import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Restrained editorial serif — modern quiet luxury */
export const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  sourceSerif.variable,
].join(" ");
