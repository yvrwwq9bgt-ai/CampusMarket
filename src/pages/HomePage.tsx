import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Handshake,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { ShopCard } from "../components/ShopCard";
import { useCampusMarket } from "../context/CampusMarketContext";
import { categories } from "../data/constants";
import type { Category } from "../types/product";

const categoryDescriptions: Record<Category, string> = {
  教科書: "授業指定本や専門書",
  参考書: "資格・語学・院試対策",
  文房具: "電卓やノート用品",
  ガジェット: "ケースや周辺機器",
  "家具・家電": "一人暮らし用品",
  "部活・サークル用品": "練習・イベント備品",
  ファッション: "通学服や小物",
  その他: "白衣や実習用品など",
};

const trustCards = [
  {
    title: "学生限定で安心",
    description: "大学メールで登録。相手の大学も見えるから、取引前の不安が少なめ。",
    icon: ShieldCheck,
  },
  {
    title: "学内・周辺で受け渡し",
    description: "授業前後やキャンパス近くで受け渡し。送料なしで身軽に。",
    icon: Handshake,
  },
  {
    title: "教科書代を節約",
    description: "先輩が使い終えた本を、次の履修者へつなげます。",
    icon: BookOpen,
  },
];

export function HomePage() {
  const { products, shops } = useCampusMarket();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const popularProducts = useMemo(
    () =>
      [...products]
        .filter((product) => product.status === "available")
        .sort((a, b) => b.price - a.price)
        .slice(0, 4),
    [products],
  );

  const featuredShops = useMemo(
    () =>
      shops
        .map((shop) => ({
          shop,
          productCount: products.filter(
            (product) =>
              product.shopId === shop.id && product.status !== "cancelled",
          ).length,
        }))
        .filter((item) => item.productCount > 0)
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, 3),
    [products, shops],
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = query.trim();
    navigate(search ? `/products?q=${encodeURIComponent(search)}` : "/products");
  };

  return (
    <main>
      <section className="relative min-h-[560px] overflow-hidden bg-campus-navy text-white">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2000&q=80"
          alt="大学生が本を読むキャンパスの風景"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-campus-navy/92 via-campus-navy/72 to-campus-violet/40" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/25">
              <Sparkles size={17} aria-hidden="true" />
              大学生限定フリマ
            </div>
            <h1 className="text-5xl font-extrabold leading-none sm:text-6xl lg:text-7xl">
              CampusMarket
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50 sm:text-xl">
              同じ大学の先輩・後輩と、教科書や学生用品をかんたん売買
            </p>
            <form
              onSubmit={handleSearch}
              className="mt-8 grid gap-3 rounded-lg bg-white p-2 shadow-soft sm:grid-cols-[1fr_auto]"
            >
              <label className="relative block">
                <span className="sr-only">商品を検索</span>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-campus-muted"
                  size={20}
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-12 w-full rounded-lg border border-transparent bg-white pl-12 pr-3 text-campus-navy placeholder:text-slate-400"
                  placeholder="教科書、iPadケース、関数電卓..."
                />
              </label>
              <button type="submit" className="primary-button h-12 px-6">
                検索する
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/sell" className="primary-button bg-campus-violet hover:bg-violet-700">
                <Plus size={18} aria-hidden="true" />
                出品する
              </Link>
              <Link
                to="/shop/setup"
                className="secondary-button border-white/30 bg-white/10 text-white hover:border-white hover:text-white"
              >
                <Store size={18} aria-hidden="true" />
                ショップを開設
              </Link>
              <Link
                to="/products"
                className="secondary-button border-white/30 bg-white/10 text-white hover:border-white hover:text-white"
              >
                商品一覧を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-title">カテゴリから探す</h2>
            <p className="section-lead">
              授業・サークル・一人暮らしに必要なものを、キャンパス単位で見つけられます。
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="card p-4 transition hover:-translate-y-0.5 hover:border-campus-blue"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-campus-navy">{category}</h3>
                  <p className="mt-1 text-sm text-campus-muted">
                    {categoryDescriptions[category]}
                  </p>
                </div>
                <ArrowRight className="shrink-0 text-campus-blue" size={18} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="page-shell">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="section-title">人気商品</h2>
              <p className="section-lead">
                教科書・ガジェット・一人暮らし用品など、今見られている商品です。
              </p>
            </div>
            <Link to="/products" className="secondary-button self-start sm:self-auto">
              もっと見る
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-title">学生ショップ</h2>
            <p className="section-lead">
              教科書だけの棚、ガジェット中心の棚みたいに、ショップ単位でまとめて見られます。
            </p>
          </div>
          <Link to="/shop/setup" className="secondary-button self-start sm:self-auto">
            ショップを作る
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {featuredShops.map(({ shop, productCount }) => (
            <ShopCard key={shop.id} shop={shop} productCount={productCount} />
          ))}
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-4 lg:grid-cols-3">
          {trustCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="card p-5">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-campus-blue">
                  <Icon size={23} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-campus-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-campus-muted">{card.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
