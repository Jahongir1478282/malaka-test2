import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Umumiy Test Sahifasi",
  description: "Savollarga javob topish uchun test platformasi"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="h-full bg-slate-100">
      <body className={`${inter.className} min-h-full`}>{children}</body>
    </html>
  );
}
