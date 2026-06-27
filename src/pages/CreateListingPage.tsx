import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  Coins,
  FileText,
  Handshake,
  ImagePlus,
  Layers3,
  MapPin,
  Plus,
  Sparkles,
  Store,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCampusMarket } from "../context/CampusMarketContext";
import {
  categories,
  conditions,
  deliveryMethods,
  universities,
} from "../data/constants";
import type { ProductFormInput } from "../types/product";
import { readProductImage } from "../utils/imageUpload";

const placeholderImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";
const maxImages = 5;

const initialForm: ProductFormInput = {
  title: "",
  price: 0,
  category: "教科書",
  condition: "目立った傷なし",
  universityName: "早稲田大学",
  deliveryMethod: "学内手渡し",
  description: "",
  imageUrl: "",
  imageUrls: [],
};

export function CreateListingPage() {
  const { addProduct, currentUser, currentUserShop } = useCampusMarket();
  const [form, setForm] = useState<ProductFormInput>({
    ...initialForm,
    universityName:
      currentUserShop?.universityName ??
      currentUser?.universityName ??
      initialForm.universityName,
  });
  const [error, setError] = useState("");
  const [imageFileNames, setImageFileNames] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <main className="page-shell">
        <div className="card p-8 text-center">
          <Store className="mx-auto text-campus-blue" size={44} aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold text-campus-navy">出品にはログインが必要です</h1>
          <p className="mt-2 text-campus-muted">
            まず大学メールでログインすると、ショップ開設と出品ができます。
          </p>
          <Link to="/auth" className="primary-button mt-5">
            ログインへ
          </Link>
        </div>
      </main>
    );
  }

  if (!currentUserShop) {
    return (
      <main className="page-shell">
        <div className="card p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-campus-blue">
                <Store size={24} aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-extrabold text-campus-navy">先にショップを開設してください</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-campus-muted">
                CampusMarketをBASEっぽく、ショップ単位で出店できる形にしたので、
                商品を出す前に自分のショップ名や受け渡し方をひとつ作る流れにしています。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/shop/setup" className="primary-button">
                  <Store size={18} aria-hidden="true" />
                  ショップを開設
                </Link>
                <Link to="/products" className="secondary-button">
                  商品一覧を見る
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-campus-line bg-campus-soft p-5">
              <p className="text-sm font-bold text-campus-blue">出店フロー</p>
              <div className="mt-4 space-y-4">
                {[
                  "ショップ名と紹介文を登録",
                  "受け渡し場所やカテゴリを設定",
                  "そのショップで商品を出品",
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-extrabold text-campus-blue shadow-sm">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm font-semibold text-campus-navy">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const updateTextField =
    (key: Exclude<keyof ProductFormInput, "price" | "imageUrl">) =>
    (
      event:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLSelectElement>
        | ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const updatePrice = (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/[^\d]/g, "");
    setForm((current) => ({
      ...current,
      price: numericValue ? Number(numericValue) : 0,
    }));
  };

  const updateImageFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setImageError("");
    setIsImageLoading(true);

    try {
      const currentCount = form.imageUrls?.length ?? 0;
      const remainingSlots = maxImages - currentCount;

      if (remainingSlots <= 0) {
        setImageError(`画像は最大${maxImages}枚までです。`);
        return;
      }

      const selectedFiles = files.slice(0, remainingSlots);
      const uploadedImages = await Promise.all(selectedFiles.map(readProductImage));
      const nextImageUrls = [
        ...(form.imageUrls ?? []),
        ...uploadedImages.map((image) => image.dataUrl),
      ];
      const nextFileNames = [
        ...imageFileNames,
        ...uploadedImages.map((image) => image.fileName),
      ];

      setForm((current) => ({
        ...current,
        imageUrl: nextImageUrls[0] ?? "",
        imageUrls: nextImageUrls,
      }));
      setImageFileNames(nextFileNames);

      if (files.length > remainingSlots) {
        setImageError(`追加できるのはあと${remainingSlots}枚までです。`);
      }
    } catch (uploadError) {
      setImageError(
        uploadError instanceof Error
          ? uploadError.message
          : "画像をアップロードできませんでした。",
      );
    } finally {
      setIsImageLoading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const nextImageUrls = (form.imageUrls ?? []).filter((_, itemIndex) => itemIndex !== index);
    const nextFileNames = imageFileNames.filter((_, itemIndex) => itemIndex !== index);
    setForm((current) => ({
      ...current,
      imageUrl: nextImageUrls[0] ?? "",
      imageUrls: nextImageUrls,
    }));
    setImageFileNames(nextFileNames);
    setImageError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("商品名と説明文を入力してください。");
      return;
    }

    if (!Number.isFinite(form.price) || form.price <= 0) {
      setError("価格は1円以上で入力してください。");
      return;
    }

    const product = addProduct({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrls?.[0] || placeholderImage,
      imageUrls: form.imageUrls?.length ? form.imageUrls : [placeholderImage],
    });

    navigate(`/products/${product.id}`);
  };

  return (
    <main className="page-shell">
      <div className="mb-7 max-w-3xl">
        <h1 className="section-title">出品する</h1>
        <p className="section-lead">
          {currentUserShop.name} から出品します。写真と説明があると、買う人が決めやすくなります。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="form-panel">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={currentUserShop.logoImageUrl}
                  alt=""
                  className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-bold text-campus-blue">出品先ショップ</p>
                  <h2 className="mt-1 text-xl font-extrabold text-campus-navy">
                    {currentUserShop.name}
                  </h2>
                  <p className="mt-1 text-sm text-campus-muted">
                    {currentUserShop.tagline}
                  </p>
                </div>
              </div>
              <Link to="/shop/setup" className="secondary-button">
                ショップ設定
              </Link>
            </div>
          </div>

          <div className="form-panel">
            <div className="mb-5">
              <h2 className="form-panel-title">
                <Sparkles size={18} aria-hidden="true" />
                基本情報
              </h2>
              <p className="form-panel-lead">商品名と価格は、あとから見ても伝わるように。</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="field-label">
                  <BookOpen size={16} aria-hidden="true" />
                  商品名
                </span>
                <div className="field-shell">
                  <BookOpen className="field-icon mt-1" size={18} aria-hidden="true" />
                  <input
                    value={form.title}
                    onChange={updateTextField("title")}
                    className="field-input field-input-with-icon"
                    placeholder="経済学入門 教科書"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="field-label">
                  <Coins size={16} aria-hidden="true" />
                  価格
                </span>
                <div className="field-shell">
                  <Coins className="field-icon mt-1" size={18} aria-hidden="true" />
                  <input
                    value={form.price || ""}
                    onChange={updatePrice}
                    className="field-input field-input-with-icon"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="1800"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="field-label">
                  <Layers3 size={16} aria-hidden="true" />
                  カテゴリ
                </span>
                <div className="choice-select-shell">
                  <select
                    value={form.category}
                    onChange={updateTextField("category")}
                    className="choice-select"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="choice-select-chevron" size={28} aria-hidden="true" />
                </div>
              </label>

              <label className="block">
                <span className="field-label">
                  <Sparkles size={16} aria-hidden="true" />
                  商品状態
                </span>
                <div className="choice-select-shell">
                  <select
                    value={form.condition}
                    onChange={updateTextField("condition")}
                    className="choice-select"
                  >
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="choice-select-chevron" size={28} aria-hidden="true" />
                </div>
              </label>
            </div>
          </div>

          <div className="form-panel">
            <div className="mb-5">
              <h2 className="form-panel-title">
                <MapPin size={18} aria-hidden="true" />
                受け渡し
              </h2>
              <p className="form-panel-lead">買う人が動きやすい場所を選びます。</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">
                  <MapPin size={16} aria-hidden="true" />
                  大学名
                </span>
                <div className="choice-select-shell">
                  <select
                    value={form.universityName}
                    onChange={updateTextField("universityName")}
                    className="choice-select"
                  >
                    {universities.map((university) => (
                      <option key={university} value={university}>
                        {university}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="choice-select-chevron" size={28} aria-hidden="true" />
                </div>
              </label>

              <label className="block">
                <span className="field-label">
                  <Handshake size={16} aria-hidden="true" />
                  受け渡し方法
                </span>
                <div className="choice-select-shell">
                  <select
                    value={form.deliveryMethod}
                    onChange={updateTextField("deliveryMethod")}
                    className="choice-select"
                  >
                    {deliveryMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="choice-select-chevron" size={28} aria-hidden="true" />
                </div>
              </label>
            </div>
          </div>

          <div className="form-panel">
            <div className="mb-5">
              <h2 className="form-panel-title">
                <FileText size={18} aria-hidden="true" />
                説明と写真
              </h2>
              <p className="form-panel-lead">書き込み、傷、付属品、受け渡し希望をまとめます。</p>
            </div>

            <div className="grid gap-5">
              <label className="block sm:col-span-2">
                <span className="field-label">
                  <FileText size={16} aria-hidden="true" />
                  説明文
                </span>
                <textarea
                  value={form.description}
                  onChange={updateTextField("description")}
                  className="field-input min-h-40 resize-y"
                  placeholder="授業で使った期間、書き込みの有無、受け渡し希望場所など"
                  required
                />
              </label>

              <div className="sm:col-span-2">
                <span className="field-label">
                  <ImagePlus size={16} aria-hidden="true" />
                  商品画像
                </span>
                <label className="upload-dropzone">
                  <UploadCloud className="text-campus-blue" size={32} aria-hidden="true" />
                  <span className="mt-3 text-sm font-bold text-campus-navy">
                    画像を選択
                  </span>
                  <span className="mt-1 text-xs font-semibold text-campus-muted">
                  最大5枚まで。JPEG / PNG / WebP、8MBまで。
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={updateImageFile}
                  className="sr-only"
                />
                </label>
                {isImageLoading && (
                  <p className="mt-2 text-sm font-semibold text-campus-muted">
                    画像を読み込み中です...
                  </p>
                )}
                {(form.imageUrls?.length ?? 0) > 0 && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(form.imageUrls ?? []).map((imageUrl, index) => (
                      <div
                        key={`${imageUrl.slice(0, 24)}-${index}`}
                        className="overflow-hidden rounded-lg border border-campus-line bg-white"
                      >
                        <img
                          src={imageUrl}
                          alt={`商品画像 ${index + 1}`}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <div className="flex items-center justify-between gap-2 p-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-campus-blue">
                              {index === 0 ? "メイン画像" : `${index + 1}枚目`}
                            </p>
                            <p className="truncate text-sm font-semibold text-campus-navy">
                              {imageFileNames[index] ?? `画像 ${index + 1}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="icon-button h-9 w-9 text-red-700 hover:border-red-300 hover:text-red-800"
                            aria-label={`${index + 1}枚目の画像を削除`}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {imageError && (
                  <p className="mt-2 text-sm font-semibold text-red-700">{imageError}</p>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="primary-button w-full sm:w-auto">
            <Plus size={18} aria-hidden="true" />
            出品する
          </button>
        </section>

        <aside className="space-y-4">
          <div className="card overflow-hidden">
            <div className="aspect-[4/3] bg-slate-100">
              {form.imageUrls?.[0] ? (
                <img
                  src={form.imageUrls[0]}
                  alt="出品画像プレビュー"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-campus-muted">
                  <div className="text-center">
                    <ImagePlus className="mx-auto" size={38} aria-hidden="true" />
                    <p className="mt-2 text-sm font-semibold">画像を選択</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-bold text-campus-navy">{form.title || "商品名が入ります"}</p>
              <p className="mt-1 text-sm font-semibold text-campus-blue">
                {currentUserShop.name}
              </p>
              <p className="mt-1 text-sm text-campus-muted">{form.universityName}</p>
              {(form.imageUrls?.length ?? 0) > 1 && (
                <p className="mt-2 text-xs font-bold text-campus-blue">
                  写真 {form.imageUrls?.length}枚
                </p>
              )}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden bg-slate-100">
              <img
                src={currentUserShop.coverImageUrl}
                alt={currentUserShop.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="font-bold text-campus-navy">{currentUserShop.name}</p>
              <p className="mt-1 text-sm leading-6 text-campus-muted">
                {currentUserShop.shippingPolicy}
              </p>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}
