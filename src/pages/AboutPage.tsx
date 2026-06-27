import { type CSSProperties, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Handshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";

const wayItems = [
  {
    number: "01",
    title: ["Find", "Campus", "Needs"],
    body: "授業、サークル、一人暮らし。学生の生活の中にある小さな困りごとから、売買のきっかけを見つけます。",
    icon: BookOpen,
  },
  {
    number: "02",
    title: ["Make", "Local", "Trust"],
    body: "大学名、受け渡し方法、学生確認を見える形にして、知らない相手との取引を少し近くします。",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: ["Lead", "Easy", "Trade"],
    body: "ショップ、出品、購入希望、メッセージまでをひとつの流れにして、迷わず動ける体験を作ります。",
    icon: Handshake,
  },
];

const capabilityItems = [
  {
    number: "01",
    title: "Student Market",
    description:
      "教科書、参考書、ガジェット、生活用品を、大学生同士で見つけやすくします。",
    tags: ["検索", "カテゴリ", "大学フィルター"],
  },
  {
    number: "02",
    title: "Campus Shops",
    description:
      "個人の出品をショップとしてまとめ、誰が何を扱っているかを見やすくします。",
    tags: ["ショップ開設", "ショップページ", "商品管理"],
  },
  {
    number: "03",
    title: "Safe Handoff",
    description:
      "購入希望、通知、メッセージで、受け渡し前に状態や場所を確認できるようにします。",
    tags: ["購入希望", "通知", "メッセージ"],
  },
  {
    number: "04",
    title: "Next Platform",
    description:
      "本人確認、決済、チャット、配送連携をあとから足せる構造で育てます。",
    tags: ["Supabase", "本人確認", "決済"],
  },
];

const stats = [
  { value: "110", label: "mock listings" },
  { value: "10", label: "campus shops" },
  { value: "8", label: "categories" },
];

const tickerItems = [
  "TEXTBOOK",
  "GADGET",
  "SHOP",
  "CAMPUS",
  "MESSAGE",
  "HANDOFF",
  "MARKET",
  "STUDENT",
];

const floatLabels = [
  { text: "SELL", className: "left-[8%] top-[22%] about-float-delay-1" },
  { text: "BUY", className: "right-[12%] top-[18%] about-float-delay-2" },
  { text: "DM", className: "bottom-[22%] left-[14%] about-float-delay-3" },
  { text: "SHOP", className: "bottom-[18%] right-[8%] about-float-delay-4" },
];

const pinnedScenes = [
  {
    label: "01 / LIST",
    title: "出品が並ぶ",
    description:
      "使い終えた教科書やガジェットが、大学ごとのマーケットに集まります。",
    imageUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    label: "02 / SHOP",
    title: "ショップになる",
    description:
      "個人の出品をショップとして見せることで、誰が何を扱っているかが伝わります。",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    label: "03 / TALK",
    title: "先に確認する",
    description:
      "購入希望とメッセージで、状態や受け渡し場所を決めてから動けます。",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    label: "04 / HANDOFF",
    title: "キャンパスで受け渡す",
    description:
      "授業前後や大学周辺で、必要なものが次の学生へ渡っていきます。",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
  },
];

export function AboutPage() {
  useEffect(() => {
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(".about-scroll-reveal"),
    );

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-[#080b12] text-white">
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=80"
          alt="キャンパスで話す学生たち"
          className="about-hero-image absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,11,18,0.98),rgba(8,11,18,0.72),rgba(37,99,235,0.24))]" />
        <div className="about-grid-lines absolute inset-0" aria-hidden="true" />
        <div className="about-scanline absolute inset-x-0 top-0 h-px bg-campus-blue/70" aria-hidden="true" />
        {floatLabels.map((label) => (
          <div
            key={label.text}
            className={`about-float-card absolute hidden rounded-none border border-white/24 bg-white/8 px-4 py-3 text-xs font-black uppercase tracking-[0.28em] text-white backdrop-blur md:block ${label.className}`}
            aria-hidden="true"
          >
            {label.text}
          </div>
        ))}
        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
          <div className="about-fade-in flex items-center justify-between text-xs font-bold uppercase tracking-[0.24em] text-white/70">
            <span>ABOUT</span>
            <span>CampusMarket</span>
          </div>

          <div className="py-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
              <div className="space-y-3 font-extrabold leading-none">
                <div className="flex items-center gap-4 text-[clamp(4rem,16vw,13rem)]">
                  <span className="about-kinetic-letter">C</span>
                  <span className="about-kinetic-kanji text-campus-blue">学</span>
                </div>
                <div className="flex items-center gap-4 text-[clamp(4rem,16vw,13rem)]">
                  <span className="about-kinetic-letter about-float-delay-2">M</span>
                  <span className="about-kinetic-kanji about-float-delay-3 text-campus-mint">市</span>
                </div>
              </div>

              <div>
                <p className="about-word-stack max-w-3xl text-[clamp(2.5rem,7vw,6.8rem)] font-black uppercase leading-[0.9]">
                  {["Student", "market", "based in", "campus"].map((word, index) => (
                    <span
                      key={word}
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
                <p className="about-fade-in about-float-delay-2 mt-8 max-w-2xl text-base font-semibold leading-8 text-white/76 sm:text-lg">
                  CampusMarketは、同じ大学の先輩・後輩と、教科書や学生用品をかんたんに売買するための学生向けマーケットです。
                </p>
                <div className="about-fade-in about-float-delay-3 mt-8 flex flex-wrap gap-3">
                  <Link to="/products" className="primary-button">
                    商品を見る
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <Link
                    to="/shop/setup"
                    className="secondary-button border-white/25 bg-white/5 text-white hover:border-white hover:text-white"
                  >
                    出店する
                    <Store size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="about-fade-in about-float-delay-4 grid gap-3 border-t border-white/16 pt-5 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="about-stat-tile">
                <p className="text-4xl font-black leading-none text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/52">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-pin-section">
        {pinnedScenes.map((scene, index) => (
          <article
            key={scene.label}
            className="about-pin-frame"
            style={
              {
                "--pin-progress": `${(index + 1) / pinnedScenes.length}`,
                zIndex: 20 + index,
              } as CSSProperties
            }
          >
            <div className="about-pin-progress" aria-hidden="true">
              <span />
            </div>

            <div className="mx-auto grid h-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
              <div className="about-pin-copy flex min-h-0 flex-col justify-between py-8">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
                    (Pinned scroll)
                  </p>
                  <h2 className="about-pin-title mt-5 text-[clamp(3.2rem,8vw,7rem)] font-black uppercase leading-none">
                    Scroll
                    <br />
                    but stay
                    <br />
                    inside
                  </h2>
                  <p className="mt-6 max-w-md text-sm font-semibold leading-7 text-blue-50">
                    この区間はページが止まっているように見せながら、スクロールに合わせて画像とストーリーが切り替わります。
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  {pinnedScenes.map((stepScene, stepIndex) => (
                    <div
                      key={stepScene.label}
                      className={`about-pin-step ${
                        stepIndex === index ? "is-active" : ""
                      }`}
                    >
                      <span>{stepScene.label}</span>
                      <strong>{stepScene.title}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="about-pin-stage">
                <img
                  src={scene.imageUrl}
                  alt={scene.title}
                  className="about-pin-image"
                />
                <div className="about-pin-panel">
                  <p>{scene.label}</p>
                  <h3>{scene.title}</h3>
                  <span>{scene.description}</span>
                </div>
                <div className="about-pin-counter">
                  {String(index + 1).padStart(2, "0")}
                  <span>/ {String(pinnedScenes.length).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="about-scroll-reveal about-reveal-wipe overflow-hidden border-y border-white/12 bg-campus-blue py-4 text-white">
        <div className="about-marquee-track flex min-w-max gap-8 text-5xl font-black uppercase leading-none sm:text-7xl">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-8">
              {item}
              <span className="text-white/30">/</span>
            </span>
          ))}
        </div>
      </section>

      <section className="border-t border-white/12 bg-white text-campus-navy">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-24">
          <p className="about-scroll-reveal about-section-label text-sm font-black uppercase tracking-[0.2em] text-campus-blue">
            (Who we are)
          </p>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr]">
            <h1 className="about-scroll-reveal about-reveal-left text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.9]">
              Built for
              <br />
              campus life
            </h1>
            <div className="about-scroll-reveal about-reveal-right space-y-5 text-base font-semibold leading-8 text-campus-muted">
              <p>
                新品で買うには高い教科書、少しだけ使ったガジェット、引っ越しで余った家電。
                学生生活には、誰かには不要でも、別の誰かにはすぐ必要なものがあります。
              </p>
              <p>
                CampusMarketは、その距離を大学単位まで近づけます。売る人は自分のショップに並べ、
                買う人は大学名やカテゴリから探し、受け渡し前にメッセージで確認できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f7fb] text-campus-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="about-scroll-reveal text-sm font-black uppercase tracking-[0.2em] text-campus-blue">
                (Our way)
              </p>
              <h2 className="about-scroll-reveal about-reveal-left mt-4 text-[clamp(2.8rem,7vw,6rem)] font-black uppercase leading-none">
                Why
                <br />
                What
                <br />
                How
              </h2>
            </div>
            <p className="about-scroll-reveal about-reveal-right max-w-xl text-sm font-semibold leading-7 text-campus-muted">
              ただ商品を並べるだけではなく、学生同士が安心して動ける順番を設計します。
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {wayItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.number}
                  className="about-scroll-reveal about-reveal-up about-way-card group border border-campus-line bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-campus-blue"
                  style={{ "--reveal-delay": `${index * 140}ms` } as CSSProperties}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-black text-campus-blue">{item.number}</p>
                    <Icon className="about-icon-spin text-campus-muted group-hover:text-campus-blue" size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mt-16 text-4xl font-black uppercase leading-none sm:text-5xl">
                    {item.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="mt-6 text-sm font-semibold leading-7 text-campus-muted">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white text-campus-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div>
              <p className="about-scroll-reveal text-sm font-black uppercase tracking-[0.2em] text-campus-blue">
                (What we do)
              </p>
              <p className="about-scroll-reveal mt-5 text-sm font-semibold leading-7 text-campus-muted">
                CampusMarketがMVPで担うこと。ここから本人確認、決済、チャットへ広げます。
              </p>
            </div>

            <div className="divide-y divide-campus-line border-y border-campus-line">
              {capabilityItems.map((item, index) => (
                <article
                  key={item.number}
                  className="about-scroll-reveal about-row group grid gap-5 py-8 lg:grid-cols-[80px_260px_minmax(0,1fr)]"
                  style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
                >
                  <p className="text-lg font-black text-campus-blue">{item.number}</p>
                  <h3 className="text-3xl font-black uppercase leading-none transition group-hover:translate-x-2 group-hover:text-campus-blue">
                    {item.title}
                  </h3>
                  <div>
                    <p className="text-sm font-semibold leading-7 text-campus-muted">
                      {item.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="badge about-tag-pop">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-scroll-reveal about-reveal-wipe overflow-hidden bg-white py-4 text-campus-navy">
        <div className="about-marquee-track about-marquee-reverse flex min-w-max gap-8 text-4xl font-black uppercase leading-none text-transparent [-webkit-text-stroke:1px_#172033] sm:text-6xl">
          {[...tickerItems.slice().reverse(), ...tickerItems.slice().reverse()].map((item, index) => (
            <span key={`${item}-reverse-${index}`} className="inline-flex items-center gap-8">
              {item}
              <span>/</span>
            </span>
          ))}
        </div>
      </section>

      <section className="bg-campus-navy text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-24">
          <div className="about-scroll-reveal about-reveal-left">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
              (Our promise)
            </p>
            <h2 className="mt-5 text-[clamp(2.8rem,7vw,6rem)] font-black uppercase leading-none">
              Small trade,
              <br />
              better campus.
            </h2>
          </div>
          <div className="about-scroll-reveal about-reveal-right space-y-5 text-base font-semibold leading-8 text-blue-50">
            <p>
              必要なものが近くにある。使い終えたものが、次の学生の役に立つ。
              それだけで、学生生活は少し軽くなります。
            </p>
            <div className="grid gap-3 pt-4">
              <div className="about-scroll-reveal about-reveal-left flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-campus-mint" size={20} aria-hidden="true" />
                <p>大学や周辺エリアで受け渡しやすいこと。</p>
              </div>
              <div
                className="about-scroll-reveal about-reveal-left flex items-start gap-3"
                style={{ "--reveal-delay": "120ms" } as CSSProperties}
              >
                <ShieldCheck className="mt-1 shrink-0 text-campus-mint" size={20} aria-hidden="true" />
                <p>学生確認やメッセージで不安を減らすこと。</p>
              </div>
              <div
                className="about-scroll-reveal about-reveal-left flex items-start gap-3"
                style={{ "--reveal-delay": "240ms" } as CSSProperties}
              >
                <Sparkles className="mt-1 shrink-0 text-campus-mint" size={20} aria-hidden="true" />
                <p>出品も購入も、面倒に感じないくらい軽いこと。</p>
              </div>
            </div>
            <Link to="/sell" className="primary-button mt-5">
              自分のショップで出品する
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
