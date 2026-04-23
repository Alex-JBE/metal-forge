import type { Metadata } from "next";
import { Metal_Mania, Cinzel, Crimson_Text, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const metalMania = Metal_Mania({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-metal-mania",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const crimsonText = Crimson_Text({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-crimson-text",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Metal Forge",
  description: "AI-powered metal content and music prompt generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${metalMania.variable} ${cinzel.variable} ${crimsonText.variable} ${shareTechMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
