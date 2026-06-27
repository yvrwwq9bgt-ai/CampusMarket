import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import {
  type ProductFilters,
  SearchFilters,
} from "../components/SearchFilters";
import { useCampusMarket } from "../context/CampusMarketContext";
import { categories } from "../data/constants";
import type { Category } from "../types/product";

const normalize = (value: string) => value.trim().toLowerCase();

export function ProductsPage() {
  const { products } = useCampusMarket();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const validCategory = categories.includes(initialCategory as Category)
    ? (initialCategory as Category)
    : "all";

  const [filters, setFilters] = useState<ProductFilters>({
    query: searchParams.get("q") ?? "",
    category: validCategory,
    universityName: "",
  });

  const filteredProducts = useMemo(() => {
    const query = normalize(filters.query);

    return products.filter((product) => {
      if (product.status === "cancelled") {
        return false;
      }

      const matchesQuery =
        !query ||
        normalize(product.title).includes(query) ||
        normalize(product.description).includes(query) ||
        normalize(product.universityName).includes(query) ||
        normalize(product.category).includes(query) ||
        normalize(product.shopName).includes(query);
      const matchesCategory =
        filters.category === "all" || product.category === filters.category;
      const matchesUniversity =
        !filters.universityName ||
        product.universityName === filters.universityName;

      return matchesQuery && matchesCategory && matchesUniversity;
    });
  }, [products, filters]);

  return (
    <main className="page-shell">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="section-title">商品一覧</h1>
          <p className="section-lead">
            欲しいものを探して、受け取りやすい場所で選ぶ。
          </p>
        </div>
        <div className="rounded-lg border border-campus-line bg-white px-4 py-3 text-sm font-bold text-campus-navy">
          {filteredProducts.length} 件の商品
        </div>
      </div>

      <SearchFilters filters={filters} onChange={setFilters} />

      {filteredProducts.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid min-h-72 place-items-center rounded-lg border border-dashed border-campus-line bg-white p-8 text-center">
          <div>
            <PackageSearch className="mx-auto text-campus-blue" size={42} aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold text-campus-navy">
              条件に合う商品がありません
            </h2>
            <p className="mt-2 text-sm text-campus-muted">
              キーワードやカテゴリを変えてみてください。
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
