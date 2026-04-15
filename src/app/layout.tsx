import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageLoader from "@/components/PageLoader";
import ScrollProgress from "@/components/ScrollProgress";
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://webtera.ru"),
  title: "WEB TERA — Веб-студия полного цикла",
  description:
    "Разрабатываем, проектируем и запускаем цифровые продукты. Сайты, веб-приложения, UI/UX дизайн.",
  authors: [{ name: "WEB TERA" }],
  alternates: { canonical: "https://webtera.ru" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://webtera.ru",
    siteName: "WEB TERA",
    title: "WEB TERA — Веб-студия полного цикла",
    description: "Создаём цифровые продукты, которые работают и приносят результат.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WEB TERA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WEB TERA — Веб-студия",
    description: "Создаём цифровые продукты, которые работают и приносят результат.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body
        className={`${inter.className} grain`}
        style={{ background: "#0a0a0a", color: "#fff" }}
      >
        <StyledComponentsRegistry>
          <PageLoader />
          <ScrollProgress />
          <CustomCursor />
          <SmoothScroll>{children}</SmoothScroll>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
