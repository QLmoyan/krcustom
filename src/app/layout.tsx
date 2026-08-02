import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import { ko } from "@/messages";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const titleDefault = `${ko.brand.name} | ${ko.brand.nameEn}`;
const description =
  "원하는 디자인과 조건에 맞는 맞춤 제작 서비스를 찾아보세요. 채팅, 견적, 시안 확인, 고객 소지품 커스텀까지.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleDefault,
    template: `%s | ${ko.brand.name}`,
  },
  description,
  applicationName: ko.brand.name,
  keywords: [
    "커스텀",
    "맞춤 제작",
    "견적",
    "시안",
    "자수",
    "인쇄",
    "커스텀코리아",
    "KrCustom",
  ],
  authors: [{ name: ko.brand.nameEn }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: ko.brand.name,
    title: titleDefault,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
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
