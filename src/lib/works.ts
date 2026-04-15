export type WorkProject = {
  slug: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  /** цвет узла и линий (#rrggbb) */
  accent: string;
};

/** Добавляй сюда работы — чем больше точек, тем плотнее «шар» из линий */
export const WORKS: WorkProject[] = [
  {
    slug: "corporate",
    title: "Corporate Platform",
    category: "Web",
    year: "2026",
    desc: "Корпоративная платформа и личный кабинет.",
    accent: "#a78bfa",
  },
  {
    slug: "mobile",
    title: "Mobile Suite",
    category: "iOS / Android",
    year: "2026",
    desc: "Кроссплатформенные клиенты под бизнес-процессы.",
    accent: "#34d399",
  },
  {
    slug: "miniapp",
    title: "Telegram Mini App",
    category: "Mini App",
    year: "2026",
    desc: "Mini App с оплатой и интеграциями.",
    accent: "#fbbf24",
  },
  {
    slug: "webapp",
    title: "SaaS Web App",
    category: "SaaS",
    year: "2025",
    desc: "Веб-приложение с ролями и аналитикой.",
    accent: "#38bdf8",
  },
  {
    slug: "design",
    title: "Design System",
    category: "UI / UX",
    year: "2025",
    desc: "Дизайн-система и прототипы.",
    accent: "#f472b6",
  },
];
