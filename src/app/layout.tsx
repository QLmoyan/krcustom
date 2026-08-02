import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "커스텀코리아 | KrCustom",
  description:
    "원하는 디자인과 조건에 맞는 맞춤 제작 서비스를 찾아보세요. 채팅, 견적, 시안 확인, 고객 소지품 커스텀까지.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F8FAFC] font-sans text-[#0F172A]">
        {children}
      </body>
    </html>
  );
}
