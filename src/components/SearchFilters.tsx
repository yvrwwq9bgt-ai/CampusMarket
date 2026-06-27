import { Search, SlidersHorizontal } from "lucide-react";
import { categories, universities } from "../data/constants";
import type { Category } from "../types/product";

export type ProductFilters = {
  query: string;
  category: "all" | Category;
  universityName: string;
};

type SearchFiltersProps = {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
};

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const update = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="card p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
        <label className="block">
          <span className="field-label">キーワード</span>
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-campus-muted"
              size={18}
              aria-hidden="true"
            />
            <input
              value={filters.query}
              onChange={(event) => update("query", event.target.value)}
              className="field-input mt-0 pl-10"
              placeholder="商品名、説明、ショップ名、大学名で検索"
            />
          </div>
        </label>

        <label className="block">
          <span className="field-label">カテゴリ</span>
          <select
            value={filters.category}
            onChange={(event) =>
              update("category", event.target.value as ProductFilters["category"])
            }
            className="field-input"
          >
            <option value="all">すべて</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="field-label">大学名</span>
          <select
            value={filters.universityName}
            onChange={(event) => update("universityName", event.target.value)}
            className="field-input"
          >
            <option value="">すべての大学</option>
            {universities.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-campus-muted">
        <SlidersHorizontal size={16} aria-hidden="true" />
        同じ大学・近いキャンパスの商品を優先して探せます
      </div>
    </div>
  );
}
