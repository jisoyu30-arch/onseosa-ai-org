import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "온서사 AI 조직 시스템",
  description: "온서사 AI 직원 자동화 시스템 — 문장에서 세계관까지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;700&family=Noto+Sans+KR:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
