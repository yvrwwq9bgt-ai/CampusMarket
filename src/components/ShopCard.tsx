import { BookOpen, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Shop } from "../types/shop";

type ShopCardProps = {
  shop: Shop;
  productCount: number;
};

export function ShopCard({ shop, productCount }: ShopCardProps) {
  return (
    <Link
      to={`/shops/${shop.id}`}
      className="card group block overflow-hidden transition hover:-translate-y-0.5 hover:border-campus-blue"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={shop.coverImageUrl}
          alt={shop.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-campus-navy/70 via-campus-navy/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
          <img
            src={shop.logoImageUrl}
            alt=""
            className="h-14 w-14 rounded-2xl border border-white/70 object-cover shadow-lg"
            aria-hidden="true"
          />
          <div className="min-w-0 text-white">
            <p className="truncate text-lg font-extrabold">{shop.name}</p>
            <p className="truncate text-sm text-blue-50">{shop.tagline}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          <span className="badge bg-blue-50 text-campus-blue">{shop.featuredCategory}</span>
          <span className="badge">{shop.universityName}</span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-campus-muted">{shop.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-campus-muted">
          <span className="inline-flex items-center gap-1">
            <BookOpen size={16} aria-hidden="true" />
            {productCount}件出品中
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={16} aria-hidden="true" />
            {shop.pickupArea}
          </span>
        </div>
        <div className="inline-flex items-center gap-1 text-sm font-bold text-campus-blue">
          ショップを見る
          <ChevronRight size={16} aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
