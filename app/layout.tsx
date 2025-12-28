import type { Metadata } from "next";
import { Geist, Geist_Mono, Bai_Jamjuree, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fewpz | Developer & Designer",
  description: "Portfolio of Fewpz - Full-stack Developer based in Bangkok, Thailand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${baiJamjuree.variable} ${inter.variable} antialiased font-bai-jamjuree`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
