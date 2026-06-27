import { FormEvent, useEffect, useState } from "react";
import {
  Ban,
  Bell,
  Edit3,
  HeartHandshake,
  MessageCircle,
  Package,
  RotateCcw,
  Save,
  Store,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useCampusMarket } from "../context/CampusMarketContext";
import { universities } from "../data/constants";
import type { ChatMessage } from "../types/message";
import type { Product } from "../types/product";

export function MyPage() {
  const {
    currentUser,
    currentUserShop,
    cancelProduct,
    deleteProduct,
    interestedProductIds,
    markNotificationsRead,
    messages,
    notifications,
    products,
    relistProduct,
    updateProfile,
  } = useCampusMarket();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    universityName: "",
  });

  useEffect(() => {
    markNotificationsRead();
  }, [currentUser?.id]);

  if (!currentUser) {
    return (
      <main className="page-shell">
        <div className="card p-8 text-center">
          <UserRound className="mx-auto text-campus-blue" size={44} aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold text-campus-navy">ログインが必要です</h1>
          <p className="mt-2 text-campus-muted">
            出品中の商品や購入希望リストを見るにはログインしてください。
          </p>
          <Link to="/auth" className="primary-button mt-5">
            ログインへ
          </Link>
        </div>
      </main>
    );
  }

  const userNotifications = notifications
    .filter((notification) => notification.recipientId === currentUser.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const listedProducts = products.filter(
    (product) => product.sellerId === currentUser.id,
  );
  const interestedProducts = products.filter((product) =>
    interestedProductIds.includes(product.id),
  );
  const messagedProducts = products
    .map((product) => ({
      product,
      lastMessage: messages
        .filter((message) => message.productId === product.id)
        .slice(-1)[0],
    }))
    .filter(
      (item): item is { product: Product; lastMessage: ChatMessage } =>
        Boolean(item.lastMessage),
    );

  const handleStartEditing = () => {
    setProfileForm({
      name: currentUser.name,
      universityName: currentUser.universityName,
    });
    setIsEditing(true);
  };

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({
      name: profileForm.name.trim() || currentUser.name,
      universityName: profileForm.universityName,
    });
    setIsEditing(false);
  };

  const handleCancelListing = (product: Product) => {
    const shouldCancel = window.confirm(
      `${product.title} の出品を取り消しますか？商品一覧には表示されなくなります。`,
    );

    if (shouldCancel) {
      cancelProduct(product.id);
    }
  };

  const handleRelist = (product: Product) => {
    relistProduct(product.id);
  };

  const handleDeleteListing = (product: Product) => {
    const shouldDelete = window.confirm(
      `${product.title} をマイページから削除しますか？メッセージ履歴も削除されます。`,
    );

    if (shouldDelete) {
      deleteProduct(product.id);
    }
  };

  return (
    <main className="page-shell">
      <section className="mb-8 rounded-lg border border-campus-line bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-blue-50 text-campus-blue">
              <UserRound size={32} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-campus-navy">{currentUser.name}</h1>
              <p className="mt-1 text-sm font-semibold text-campus-muted">
                {currentUser.universityName}
              </p>
              <p className="mt-1 text-xs font-bold text-green-700">
                {currentUser.verifiedStudent ? "学生確認済み" : "学生確認待ち"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStartEditing}
            className="secondary-button self-start sm:self-auto"
          >
            <Edit3 size={18} aria-hidden="true" />
            プロフィール編集
          </button>
        </div>

        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 grid gap-4 border-t border-campus-line pt-5 sm:grid-cols-[1fr_1fr_auto]"
          >
            <label className="block">
              <span className="field-label">ユーザー名</span>
              <input
                value={profileForm.name}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="field-input"
                required
              />
            </label>

            <label className="block">
              <span className="field-label">大学名</span>
              <select
                value={profileForm.universityName}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    universityName: event.target.value,
                  }))
                }
                className="field-input"
              >
                {universities.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end gap-2">
              <button type="submit" className="primary-button">
                <Save size={17} aria-hidden="true" />
                保存
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="icon-button"
                aria-label="編集をキャンセル"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2">
          <Store className="text-campus-blue" size={22} aria-hidden="true" />
          <h2 className="section-title text-2xl">ショップ</h2>
        </div>

        {currentUserShop ? (
          <div className="mt-5 card overflow-hidden">
            <div className="relative aspect-[16/6] overflow-hidden bg-slate-100">
              <img
                src={currentUserShop.coverImageUrl}
                alt={currentUserShop.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-campus-navy/75 via-campus-navy/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  <img
                    src={currentUserShop.logoImageUrl}
                    alt=""
                    className="h-16 w-16 rounded-2xl border border-white/70 object-cover shadow-lg"
                    aria-hidden="true"
                  />
                  <div className="text-white">
                    <p className="text-xs font-bold text-blue-100">出店中のショップ</p>
                    <h3 className="mt-1 text-2xl font-extrabold">{currentUserShop.name}</h3>
                    <p className="mt-1 text-sm text-blue-50">{currentUserShop.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/shops/${currentUserShop.id}`} className="secondary-button border-white/30 bg-white/10 text-white hover:border-white hover:text-white">
                    ショップを見る
                  </Link>
                  <Link to="/shop/setup" className="primary-button">
                    ショップ設定
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3">
              <div className="rounded-lg bg-campus-soft p-4">
                <p className="text-xs font-bold text-campus-muted">出品中の商品</p>
                <p className="mt-1 text-2xl font-extrabold text-campus-navy">
                  {
                    listedProducts.filter((product) => product.status !== "cancelled").length
                  }
                </p>
              </div>
              <div className="rounded-lg bg-campus-soft p-4">
                <p className="text-xs font-bold text-campus-muted">メインカテゴリ</p>
                <p className="mt-1 text-lg font-extrabold text-campus-navy">
                  {currentUserShop.featuredCategory}
                </p>
              </div>
              <div className="rounded-lg bg-campus-soft p-4">
                <p className="text-xs font-bold text-campus-muted">受け渡し場所</p>
                <p className="mt-1 text-lg font-extrabold text-campus-navy">
                  {currentUserShop.pickupArea}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-campus-line bg-white p-6">
            <p className="text-lg font-bold text-campus-navy">まだショップを開設していません。</p>
            <p className="mt-2 text-sm leading-6 text-campus-muted">
              BASEみたいに、ショップをひとつ作ってから商品を出す流れにしています。
            </p>
            <Link to="/shop/setup" className="primary-button mt-5">
              <Store size={18} aria-hidden="true" />
              ショップを開設
            </Link>
          </div>
        )}
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2">
          <Bell className="text-campus-blue" size={22} aria-hidden="true" />
          <h2 className="section-title text-2xl">通知</h2>
        </div>
        {userNotifications.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {userNotifications.map((notification) => (
              <Link
                key={notification.id}
                to={`/products/${notification.productId}`}
                className="card flex flex-col gap-3 p-4 transition hover:border-campus-blue sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {!notification.read && (
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" aria-label="未読" />
                    )}
                    <p className="font-bold text-campus-navy">{notification.title}</p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-campus-muted">
                    {notification.body}
                  </p>
                </div>
                <time className="shrink-0 text-xs font-semibold text-campus-muted">
                  {new Date(notification.createdAt).toLocaleString("ja-JP", {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-campus-line bg-white p-6 text-campus-muted">
            まだ通知はありません。
          </div>
        )}
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2">
          <Package className="text-campus-blue" size={22} aria-hidden="true" />
          <h2 className="section-title text-2xl">出品した商品</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-campus-muted">
          取引が決まったものや一度下げたいものは、ここで整理。
        </p>
        {listedProducts.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {listedProducts.map((product) => (
              <div key={product.id} className="space-y-3">
                <ProductCard product={product} />
                {product.status === "cancelled" ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleRelist(product)}
                      className="secondary-button w-full"
                    >
                      <RotateCcw size={17} aria-hidden="true" />
                      再出品
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteListing(product)}
                      className="secondary-button w-full border-red-200 text-red-700 hover:border-red-300 hover:text-red-800"
                    >
                      <Trash2 size={17} aria-hidden="true" />
                      削除
                    </button>
                  </div>
                ) : product.status === "sold" ? (
                  <button type="button" disabled className="secondary-button w-full">
                    売約済み
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCancelListing(product)}
                    className="secondary-button w-full border-red-200 text-red-700 hover:border-red-300 hover:text-red-800"
                  >
                    <Ban size={17} aria-hidden="true" />
                    出品を取り消す
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-campus-line bg-white p-6 text-campus-muted">
            まだ出品中の商品はありません。
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2">
          <HeartHandshake className="text-campus-blue" size={22} aria-hidden="true" />
          <h2 className="section-title text-2xl">購入希望した商品</h2>
        </div>
        {interestedProducts.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {interestedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-campus-line bg-white p-6 text-campus-muted">
            購入希望した商品はまだありません。
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-campus-blue" size={22} aria-hidden="true" />
          <h2 className="section-title text-2xl">メッセージ履歴</h2>
        </div>
        {messagedProducts.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {messagedProducts.map(({ product, lastMessage }) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="card flex flex-col gap-3 p-4 transition hover:border-campus-blue sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-bold text-campus-navy">{product.title}</p>
                  <p className="mt-1 truncate text-sm text-campus-muted">
                    {lastMessage.body}
                  </p>
                </div>
                <time className="shrink-0 text-xs font-semibold text-campus-muted">
                  {new Date(lastMessage.createdAt).toLocaleString("ja-JP", {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-campus-line bg-white p-6 text-campus-muted">
            まだメッセージはありません。
          </div>
        )}
      </section>
    </main>
  );
}
