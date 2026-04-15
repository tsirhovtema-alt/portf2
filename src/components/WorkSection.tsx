"use client";

type WorkItem = {
  id: string;
  title: string;
  category: string;
  year: string;
  desc: string;
};

const WORK_ITEMS: WorkItem[] = [
  {
    id: "01",
    title: "Corporate Platform",
    category: "Web Development",
    year: "2026",
    desc: "Корпоративная платформа с личным кабинетом, аналитикой и CMS.",
  },
  {
    id: "02",
    title: "iOS / Android App",
    category: "Mobile App",
    year: "2026",
    desc: "Кроссплатформенное приложение для бизнеса с push-уведомлениями.",
  },
  {
    id: "03",
    title: "Telegram Mini App",
    category: "Mini App",
    year: "2026",
    desc: "Интерактивный Mini App с оплатой и интеграцией API.",
  },
];

export default function WorkSection() {
  return (
    <section id="work" className="relative overflow-hidden bg-[#0d0d0d] px-6 py-24 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">02 - Работы</p>
          <h2 className="mt-3 text-4xl font-black leading-[0.92] tracking-[-0.03em] text-white md:text-6xl">
            Наши
            <br />
            <span className="text-white/45">проекты</span>
          </h2>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-white/35 via-white/18 to-white/8 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-10">
            {WORK_ITEMS.map((item, idx) => {
              const right = idx % 2 === 1;
              return (
                <div
                  key={item.id}
                  className={`relative grid grid-cols-1 md:grid-cols-2 ${right ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""}`}
                >
                  <div className={`${right ? "md:pl-10" : "md:pr-10"}`}>
                    <article className="glass-panel rounded-xl p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
                          {item.category}
                        </span>
                        <span className="font-mono text-xs text-white/24">{item.year}</span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-[-0.02em] text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/55">{item.desc}</p>
                    </article>
                  </div>

                  <div className="relative hidden md:block">
                    <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45 bg-[#0d0d0d] shadow-[0_0_20px_rgba(255,255,255,0.18)]" />
                    <div
                      className={`absolute top-1/2 h-px w-10 -translate-y-1/2 bg-white/18 ${
                        right ? "right-[50%]" : "left-[50%]"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
