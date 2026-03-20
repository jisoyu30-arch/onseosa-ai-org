import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "온서사 AI 에이전트",
  description: "온서사 4개 본부 22명 AI 직원 11개 파이프라인 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
