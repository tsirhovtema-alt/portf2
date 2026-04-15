import type { Metadata } from "next";
import { Geist } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WEB TERA",
  description: "WEB TERA — веб-студия полного цикла",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} dark h-full antialiased`}>
      <head>
        {/* Дублируем keyframes здесь: экран загрузки гаснет даже если globals.css подгрузится с задержкой (ngrok / телефон) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@keyframes loading-screen-out{0%{opacity:1}69.2%{opacity:1}92.3%{opacity:0}100%{opacity:0;visibility:hidden;pointer-events:none}}`,
          }}
        />
      </head>
      <body className="grain min-h-full flex flex-col">
        <LoadingScreen />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
