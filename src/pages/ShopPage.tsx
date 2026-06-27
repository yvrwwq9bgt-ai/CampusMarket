import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  Plus,
  ShieldCheck,
  Store,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useCampusMarket } from "../context/CampusMarketContext";

export function ShopPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { currentUser, products, shops } = useCampusMarket();
  const shop = shops.find((item) => item.id === shopId);

  const shopProducts = useMemo(
    () =>
      products
        .filter((product) => product.shopId === shopId && product.status !== "cancelled")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [products, shopId],
  );

  if (!shop) {
    return (
      <main className="page-shell">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold text-campus-navy">ショップが見つかりません</h1>
          <p className="mt-2 text-campus-muted">
            URLが違うか、ショップ情報がまだ作成されていない可能性があります。
          </p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="primary-button mt-5"
          >
            商品一覧へ戻る
          </button>
        </div>
      </main>
    );
  }

  const isOwner = currentUser?.id === shop.ownerId;
  const availableCount = shopProducts.filter((product) => product.status === "available").length;

  return (
    <main>
      <div className="page-shell pb-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-campus-blue"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          商品一覧へ戻る
        </Link>
      </div>

      <section className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-campus-line bg-white shadow-soft">
        <div className="relative min-h-[360px] overflow-hidden">
          <img
            src={shop.coverImageUrl}
            alt={shop.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-campus-navy via-campus-navy/40 to-campus-navy/10" />
          <div className="relative flex min-h-[360px] flex-col justify-end px-5 py-8 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-end gap-4">
                <img
                  src={shop.logoImageUrl}
                  alt=""
                  className="h-24 w-24 rounded-[26px] border border-white/70 object-cover shadow-xl"
                  aria-hidden="true"
                />
                <div className="text-white">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/25">
                      {shop.featuredCategory}
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/25">
                      {shop.universityName}
                    </span>
                  </div>
                  <h1 className="text-3xl font-extrabold sm:text-5xl">{shop.name}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
                    {shop.tagline}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {isOwner ? (
                  <>
                    <Link to="/shop/setup" className="secondary-button border-white/30 bg-white/10 text-white hover:border-white hover:text-white">
                      <Store size={18} aria-hidden="true" />
                      ショップを編集
                    </Link>
                    <Link to="/sell" className="primary-button">
                      <Plus size={18} aria-hidden="true" />
                      このショップで出品
                    </Link>
                  </>
                ) : (
                  <Link to="/products" className="secondary-button border-white/30 bg-white/10 text-white hover:border-white hover:text-white">
                    商品一覧を見る
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_340px]">
          <div className="space-y-6">
            <section className="card p-5">
              <h2 className="text-xl font-extrabold text-campus-navy">ショップについて</h2>
              <p className="mt-3 text-sm leading-7 text-campus-muted">{shop.description}</p>
            </section>

            <section className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-campus-navy">出品中の商品</h2>
                  <p className="mt-1 text-sm text-campus-muted">
                    {shopProducts.length}件の商品があります。
                  </p>
                </div>
                {isOwner && (
                  <Link to="/sell" className="secondary-button">
                    <Plus size={17} aria-hidden="true" />
                    商品を追加
                  </Link>
                )}
              </div>

              {shopProducts.length > 0 ? (
                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {shopProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-lg border border-dashed border-campus-line bg-campus-soft p-6 text-campus-muted">
                  まだ商品はありません。
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <div className="card p-5">
              <h2 className="text-lg font-extrabold text-campus-navy">ショップ情報</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-0.5 text-campus-blue" size={18} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-campus-muted">商品数</p>
                    <p className="font-bold text-campus-navy">{availableCount}件販売中</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 text-campus-blue" size={18} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-campus-muted">受け渡し場所</p>
                    <p className="font-bold text-campus-navy">{shop.pickupArea}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 text-campus-blue" size={18} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-campus-muted">受け渡しルール</p>
                    <p className="font-bold leading-7 text-campus-navy">{shop.shippingPolicy}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <p className="text-sm font-semibold text-campus-muted">オーナー</p>
              <p className="mt-1 text-xl font-extrabold text-campus-navy">{shop.ownerName}</p>
              <p className="mt-2 text-sm text-campus-muted">{shop.universityName}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
