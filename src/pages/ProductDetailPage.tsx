import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  HeartHandshake,
  Inbox,
  MapPin,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Send,
  Store,
  Trash2,
  Users,
  UserRound,
} from "lucide-react";
import { useCampusMarket } from "../context/CampusMarketContext";
import { formatPrice } from "../utils/format";
import { getProductImages } from "../utils/productImages";

const statusText = {
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

export function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    cancelProduct,
    currentUser,
    deleteProduct,
    isInterested,
    markInterested,
    messages,
    products,
    purchaseInterests,
    relistProduct,
    sendMessage,
    shops,
  } = useCampusMarket();
  const [isMessagePanelOpen, setIsMessagePanelOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const product = products.find((item) => item.id === productId);
  const productMessages = useMemo(
    () => messages.filter((message) => message.productId === productId),
    [messages, productId],
  );
  const productInterests = useMemo(
    () => purchaseInterests.filter((interest) => interest.productId === productId),
    [purchaseInterests, productId],
  );

  if (!product) {
    return (
      <main className="page-shell">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold text-campus-navy">商品が見つかりません</h1>
          <p className="mt-2 text-campus-muted">
            削除されたか、URLが間違っている可能性があります。
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

  const interested = isInterested(product.id);
  const productImages = getProductImages(product);
  const selectedImage = productImages[selectedImageIndex] ?? productImages[0];
  const isOwnProduct = Boolean(currentUser && currentUser.id === product.sellerId);
  const showMessagePanel = isMessagePanelOpen || productMessages.length > 0;
  const canRequestPurchase = product.status === "available";
  const canSendNewMessage = product.status !== "cancelled" && !isOwnProduct;
  const shop = shops.find((item) => item.id === product.shopId);

  const handleCancelOwnListing = () => {
    const shouldCancel = window.confirm(
      `${product.title} の出品を取り消しますか？`,
    );

    if (shouldCancel) {
      cancelProduct(product.id);
    }
  };

  const handleRelistOwnListing = () => {
    relistProduct(product.id);
  };

  const handleDeleteOwnListing = () => {
    const shouldDelete = window.confirm(
      `${product.title} を削除しますか？購入希望とメッセージ履歴も削除されます。`,
    );

    if (shouldDelete) {
      deleteProduct(product.id);
      navigate("/mypage");
    }
  };

  const handlePurchaseInterest = () => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    if (!canRequestPurchase) {
      return;
    }

    markInterested(product.id);
  };

  const handleOpenMessagePanel = () => {
    if (!canSendNewMessage) {
      return;
    }

    if (!currentUser) {
      navigate("/auth");
      return;
    }

    setIsMessagePanelOpen(true);
  };

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = sendMessage(product.id, messageBody);

    if (message) {
      setMessageBody("");
    }
  };

  return (
    <main className="page-shell">
      <Link
        to="/products"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-campus-blue"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        商品一覧へ戻る
      </Link>

      <section className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-campus-line bg-white shadow-soft">
            <img
              src={selectedImage}
              alt={product.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {productImages.map((imageUrl, index) => (
                <button
                  key={`${imageUrl.slice(0, 24)}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`overflow-hidden rounded-lg border bg-white transition ${
                    selectedImageIndex === index
                      ? "border-campus-blue ring-4 ring-blue-100"
                      : "border-campus-line hover:border-campus-blue"
                  }`}
                  aria-label={`${index + 1}枚目の画像を見る`}
                >
                  <img
                    src={imageUrl}
                    alt=""
                    className="aspect-square w-full object-cover"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <span className="badge">{product.category}</span>
              <span className="badge">{product.condition}</span>
              <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusClassName[product.status]}`}>
                {statusText[product.status]}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-campus-navy sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-4 text-4xl font-extrabold text-campus-blue">
              {formatPrice(product.price)}
            </p>
            <p className="mt-5 leading-7 text-campus-muted">{product.description}</p>

            {product.status === "cancelled" && (
              <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">
                この商品は出品者が取り消しました。商品一覧には表示されません。
              </div>
            )}

            {isOwnProduct ? (
              <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Inbox className="mt-0.5 text-campus-blue" size={21} aria-hidden="true" />
                  <div>
                    <h2 className="font-extrabold text-campus-navy">出品者画面</h2>
                    <p className="mt-1 text-sm leading-6 text-campus-muted">
                      自分の出品なので、購入希望は送れません。
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs font-bold text-campus-muted">購入希望</p>
                    <p className="mt-1 text-2xl font-extrabold text-campus-navy">
                      {productInterests.length}
                    </p>
                  </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs font-bold text-campus-muted">メッセージ</p>
                      <p className="mt-1 text-2xl font-extrabold text-campus-navy">
                        {productMessages.length}
                      </p>
                    </div>
                </div>
                {shop && (
                  <Link to={`/shops/${shop.id}`} className="secondary-button mt-4 w-full">
                    <Store size={17} aria-hidden="true" />
                    ショップページを見る
                  </Link>
                )}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {product.status === "cancelled" ? (
                    <>
                      <button
                        type="button"
                        onClick={handleRelistOwnListing}
                        className="secondary-button"
                      >
                        <RotateCcw size={17} aria-hidden="true" />
                        再出品する
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteOwnListing}
                        className="secondary-button border-red-200 text-red-700 hover:border-red-300 hover:text-red-800"
                      >
                        <Trash2 size={17} aria-hidden="true" />
                        削除
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCancelOwnListing}
                      className="secondary-button border-red-200 text-red-700 hover:border-red-300 hover:text-red-800 sm:col-span-2"
                    >
                      <Ban size={17} aria-hidden="true" />
                      出品を取り消す
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handlePurchaseInterest}
                  disabled={Boolean(!canRequestPurchase || (currentUser && interested))}
                  className="primary-button"
                >
                  <HeartHandshake size={18} aria-hidden="true" />
                  {!canRequestPurchase
                    ? "受付停止中"
                    : !currentUser
                      ? "ログインして購入希望"
                      : interested
                        ? "購入希望済み"
                        : "購入希望"}
                </button>
                <button
                  type="button"
                  onClick={handleOpenMessagePanel}
                  disabled={!canSendNewMessage}
                  className="secondary-button"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  {!canSendNewMessage
                    ? "メッセージ停止中"
                    : currentUser
                      ? "出品者にメッセージ"
                      : "ログインしてメッセージ"}
                </button>
              </div>
            )}
          </div>

          {isOwnProduct && (
            <section className="card p-5" aria-labelledby="sellerInterestTitle">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="sellerInterestTitle" className="text-lg font-bold text-campus-navy">
                    購入希望者
                  </h2>
                  <p className="mt-1 text-sm text-campus-muted">
                    購入希望が入ると、ここに相手の名前と大学が表示されます。
                  </p>
                </div>
                <Users className="shrink-0 text-campus-blue" size={22} aria-hidden="true" />
              </div>

              {productInterests.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  {productInterests.map((interest) => (
                    <div
                      key={interest.id}
                      className="rounded-lg border border-campus-line bg-campus-soft p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-bold text-campus-navy">{interest.buyerName}</p>
                          <p className="mt-1 text-sm text-campus-muted">
                            {interest.buyerUniversityName}
                          </p>
                        </div>
                        <time className="text-xs font-semibold text-campus-muted">
                          {new Date(interest.createdAt).toLocaleString("ja-JP", {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-campus-line bg-white p-5 text-sm text-campus-muted">
                  まだ購入希望はありません。
                </div>
              )}
            </section>
          )}

          {isOwnProduct && (
            <section className="card p-5" aria-labelledby="sellerMessageTitle">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="sellerMessageTitle" className="text-lg font-bold text-campus-navy">
                    メッセージ
                  </h2>
                  <p className="mt-1 text-sm text-campus-muted">
                    購入を考えている人から届いた内容を確認できます。
                  </p>
                </div>
                <MessageCircle className="shrink-0 text-campus-blue" size={22} aria-hidden="true" />
              </div>

              <div className="mt-4 max-h-72 space-y-3 overflow-y-auto rounded-lg border border-campus-line bg-campus-soft p-3">
                {productMessages.length > 0 ? (
                  productMessages.map((message) => (
                    <div key={message.id} className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-campus-navy">
                          {message.senderName}
                          {message.senderId === currentUser?.id && (
                            <span className="ml-2 rounded-md bg-blue-50 px-2 py-0.5 text-xs text-campus-blue">
                              自分
                            </span>
                          )}
                        </span>
                        <time className="text-xs font-semibold text-campus-muted">
                          {new Date(message.createdAt).toLocaleString("ja-JP", {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-campus-ink">
                        {message.body}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-lg bg-white p-4 text-sm text-campus-muted">
                    まだメッセージはありません。
                  </p>
                )}
              </div>

              {product.status !== "cancelled" && (
                <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
                  <label className="block">
                    <span className="field-label">返信</span>
                    <textarea
                      value={messageBody}
                      onChange={(event) => setMessageBody(event.target.value)}
                      className="field-input min-h-28 resize-y"
                      placeholder="例: 明日の昼休みなら受け渡しできます。"
                      required
                    />
                  </label>
                  <button type="submit" className="primary-button w-full sm:w-auto">
                    <Send size={17} aria-hidden="true" />
                    返信する
                  </button>
                </form>
              )}
            </section>
          )}

          {!isOwnProduct && showMessagePanel && (
            <section className="card p-5" aria-labelledby="messageTitle">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="messageTitle" className="text-lg font-bold text-campus-navy">
                    出品者へのメッセージ
                  </h2>
                  <p className="mt-1 text-sm text-campus-muted">
                    受け渡し場所や商品の状態を、先に確認。
                  </p>
                </div>
                <MessageCircle className="shrink-0 text-campus-blue" size={22} aria-hidden="true" />
              </div>

              <div className="mt-4 max-h-72 space-y-3 overflow-y-auto rounded-lg border border-campus-line bg-campus-soft p-3">
                {productMessages.length > 0 ? (
                  productMessages.map((message) => (
                    <div key={message.id} className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-campus-navy">
                          {message.senderName}
                        </span>
                        <time className="text-xs font-semibold text-campus-muted">
                          {new Date(message.createdAt).toLocaleString("ja-JP", {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-campus-ink">
                        {message.body}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-lg bg-white p-4 text-sm text-campus-muted">
                    まだメッセージはありません。商品の状態や受け渡し希望日時を送ってみてください。
                  </p>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
                <label className="block">
                  <span className="field-label">メッセージ本文</span>
                  <textarea
                    value={messageBody}
                    onChange={(event) => setMessageBody(event.target.value)}
                    className="field-input min-h-28 resize-y"
                    placeholder="例: 明日の3限後、キャンパスで受け渡し希望です。"
                    required
                  />
                </label>
                <button type="submit" className="primary-button w-full sm:w-auto">
                  <Send size={17} aria-hidden="true" />
                  送信する
                </button>
              </form>
            </section>
          )}

          <div className="card divide-y divide-campus-line">
            <div className="flex items-start gap-3 p-4">
              <Store className="mt-0.5 text-campus-blue" size={20} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-campus-muted">ショップ</p>
                {shop ? (
                  <Link to={`/shops/${shop.id}`} className="font-bold text-campus-blue hover:underline">
                    {product.shopName}
                  </Link>
                ) : (
                  <p className="font-bold text-campus-navy">{product.shopName}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <UserRound className="mt-0.5 text-campus-blue" size={20} aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-campus-muted">出品者</p>
                <p className="font-bold text-campus-navy">{product.sellerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <MapPin className="mt-0.5 text-campus-blue" size={20} aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-campus-muted">大学・受け渡し</p>
                <p className="font-bold text-campus-navy">{product.universityName}</p>
                <p className="mt-1 text-sm text-campus-muted">{product.deliveryMethod}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <ShieldCheck className="mt-0.5 text-campus-blue" size={20} aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-campus-muted">学生確認</p>
                <p className="font-bold text-campus-navy">大学メールで確認済み</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
              <p className="text-sm font-semibold leading-6">
                個人間取引のため、受け渡し前に商品の状態を確認してください。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
