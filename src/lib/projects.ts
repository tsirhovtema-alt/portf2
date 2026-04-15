export interface ProjectDef {
  id: number;
  slug: string;
  title: string;
  category: string;
  desc: string;
  tags: string[];
  year: string;
  accent: string;
}

export const PROJECTS: ProjectDef[] = [
  {
    id: 0, slug: 'neobank', title: 'NeoBank Dashboard', category: 'FinTech / SaaS',
    desc: 'Дашборд управления финансами с аналитикой реального времени, графиками и картами.',
    tags: ['Next.js', 'Node.js', 'Prisma'], year: '2024', accent: '#a78bfa',
  },
  {
    id: 1, slug: 'ai-content', title: 'AI Content Studio', category: 'AI / Platform',
    desc: 'Платформа генерации контента на базе GPT с умным редактором и экспортом.',
    tags: ['React', 'Python', 'NestJS'], year: '2024', accent: '#34d399',
  },
  {
    id: 2, slug: 'restaurant', title: 'Restaurant Chain', category: 'Corporate / Website',
    desc: 'Мультиязычный корпоративный сайт сети ресторанов с CMS и онлайн-бронью.',
    tags: ['Next.js', 'TailwindCSS', 'Docker'], year: '2024', accent: '#fbbf24',
  },
  {
    id: 3, slug: 'crypto', title: 'Crypto Tracker', category: 'Web3 / Finance',
    desc: 'Агрегатор криптопортфеля с live-данными, алертами и аналитикой.',
    tags: ['React', 'Node.js', 'Vite'], year: '2023', accent: '#38bdf8',
  },
  {
    id: 4, slug: 'fashion', title: 'Fashion E-Commerce', category: 'E-Commerce / Retail',
    desc: 'Интернет-магазин премиум-класса с 3D-примеркой и платёжными системами.',
    tags: ['Next.js', 'NestJS', 'Prisma'], year: '2023', accent: '#f472b6',
  },
];
