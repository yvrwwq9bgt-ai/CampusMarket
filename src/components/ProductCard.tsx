import { MapPin, Store, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { formatPrice } from "../utils/format";
import { getProductMainImage } from "../utils/productImages";

type ProductCardProps = {
  product: Product;
};

const statusLabel = {
  available: "販売中",
  reserved: "相談中",
  sold: "売約済み",
  cancelled: "出品停止",
};

const statusClassName = {
  available: "bg-green-50 text-green-700",
  reserved: "bg-amber-50 text-amber-700",
  sold: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-700",
};

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = getProductMainImage(product);

  return (
    <Link
      to={`/products/${product.id}`}
      className="card group block overflow-hidden transition hover:-translate-y-0.5 hover:border-campus-blue"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={product.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-11 text-base font-bold leading-6 text-campus-navy">
            {product.title}
          </h3>
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${statusClassName[product.status]}`}
          >
            {statusLabel[product.status]}
          </span>
        </div>
        <p className="text-xl font-extrabold text-campus-blue">
          {formatPrice(product.price)}
        </p>
        <div className="flex items-center gap-1 text-sm font-semibold text-campus-navy">
          <Store size={15} aria-hidden="true" />
          <span className="truncate">{product.shopName}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="badge">
            <Tag size={14} aria-hidden="true" />
            {product.category}
          </span>
          <span className="badge">{product.condition}</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-campus-muted">
          <MapPin size={16} aria-hidden="true" />
          <span className="truncate">{product.universityName}</span>
        </div>
        <p className="text-sm text-campus-muted">{product.deliveryMethod}</p>
      </div>
    </Link>
  );
}
