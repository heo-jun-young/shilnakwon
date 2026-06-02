import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "쉴낙원 안양 장례식장 서비스 안내",
  description: "마지막 이별의 순간, 가족과 같은 마음으로 함께 하겠습니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
