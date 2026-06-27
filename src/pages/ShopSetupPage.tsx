import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  ImagePlus,
  MapPin,
  Palette,
  ShieldCheck,
  Sparkles,
  Store,
  UploadCloud,
} from "lucide-react";
import { useCampusMarket } from "../context/CampusMarketContext";
import { categories, universities } from "../data/constants";
import {
  defaultShopCoverImage,
  defaultShopLogoImage,
} from "../data/mockShops";
import type { ShopFormInput } from "../types/shop";
import { readProductImage } from "../utils/imageUpload";

const initialForm: ShopFormInput = {
  name: "",
  tagline: "",
  description: "",
  universityName: "早稲田大学",
  featuredCategory: "教科書",
  pickupArea: "",
  shippingPolicy: "",
  coverImageUrl: defaultShopCoverImage,
  logoImageUrl: defaultShopLogoImage,
};

export function ShopSetupPage() {
  const { currentUser, currentUserShop, upsertShop } = useCampusMarket();
  const [form, setForm] = useState<ShopFormInput>(initialForm);
  const [error, setError] = useState("");
  const [coverFileName, setCoverFileName] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (currentUserShop) {
      setForm({
        name: currentUserShop.name,
        tagline: currentUserShop.tagline,
        description: currentUserShop.description,
        universityName: currentUserShop.universityName,
        featuredCategory: currentUserShop.featuredCategory,
        pickupArea: currentUserShop.pickupArea,
        shippingPolicy: currentUserShop.shippingPolicy,
        coverImageUrl: currentUserShop.coverImageUrl,
        logoImageUrl: currentUserShop.logoImageUrl,
      });
      setCoverFileName("");
      setLogoFileName("");
      return;
    }

    setForm({
      ...initialForm,
      name: `${currentUser.name} Shop`,
      tagline: `${currentUser.universityName}で受け渡ししやすい学生ショップ`,
      universityName: currentUser.universityName,
      pickupArea: `${currentUser.universityName}周辺`,
      shippingPolicy: "授業前後の学内手渡しを優先します。",
    });
  }, [currentUser, currentUserShop]);

  if (!currentUser) {
    return (
      <main className="page-shell">
        <div className="card p-8 text-center">
          <Store className="mx-auto text-campus-blue" size={44} aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold text-campus-navy">ショップ開設にはログインが必要です</h1>
          <p className="mt-2 text-campus-muted">
            大学メールでログインすると、CampusMarket内に自分のショップを作れます。
          </p>
          <Link to="/auth" className="primary-button mt-5">
            ログインへ
          </Link>
        </div>
      </main>
    );
  }

  const handleTextField =
    (key: keyof ShopFormInput) =>
    (
      event:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLTextAreaElement>
        | ChangeEvent<HTMLSelectElement>,
    ) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const handleImageUpload =
    (key: "coverImageUrl" | "logoImageUrl", fileNameSetter: (value: string) => void) =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const image = await readProductImage(file);
        setForm((current) => ({ ...current, [key]: image.dataUrl }));
        fileNameSetter(image.fileName);
        setError("");
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "画像をアップロードできませんでした。",
        );
      } finally {
        event.target.value = "";
      }
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.tagline.trim() || !form.description.trim()) {
      setError("ショップ名、ひとこと、説明文を入力してください。");
      return;
    }

    const shop = upsertShop({
      ...form,
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      pickupArea: form.pickupArea.trim(),
      shippingPolicy: form.shippingPolicy.trim(),
    });

    if (shop) {
      navigate(`/shops/${shop.id}`);
    }
  };

  return (
    <main className="page-shell">
      <div className="mb-7 max-w-3xl">
        <h1 className="section-title">{currentUserShop ? "ショップ設定" : "ショップを開設"}</h1>
        <p className="section-lead">
          BASEみたいに、まずは自分のショップを作ってから商品を並べられる形にしています。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="form-panel">
            <div className="mb-5">
              <h2 className="form-panel-title">
                <Store size={18} aria-hidden="true" />
                ショップの基本
              </h2>
              <p className="form-panel-lead">名前と一言で、どんなショップかを最初に伝えます。</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="field-label">
                  <Store size={16} aria-hidden="true" />
                  ショップ名
                </span>
                <input
                  value={form.name}
                  onChange={handleTextField("name")}
                  className="field-input"
                  placeholder="例: Haruka Books"
                  required
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="field-label">
                  <Sparkles size={16} aria-hidden="true" />
                  ひとこと
                </span>
                <input
                  value={form.tagline}
                  onChange={handleTextField("tagline")}
                  className="field-input"
                  placeholder="例: 教科書と授業ノート中心"
                  required
                />
              </label>

              <label className="block">
                <span className="field-label">
                  <MapPin size={16} aria-hidden="true" />
                  大学名
                </span>
                <select
                  value={form.universityName}
                  onChange={handleTextField("universityName")}
                  className="field-input"
                >
                  {universities.map((university) => (
                    <option key={university} value={university}>
                      {university}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="field-label">
                  <Palette size={16} aria-hidden="true" />
                  メインカテゴリ
                </span>
                <select
                  value={form.featuredCategory}
                  onChange={handleTextField("featuredCategory")}
                  className="field-input"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="form-panel">
            <div className="mb-5">
              <h2 className="form-panel-title">
                <FileText size={18} aria-hidden="true" />
                紹介文
              </h2>
              <p className="form-panel-lead">何を扱っていて、どう受け渡すかを見せます。</p>
            </div>

            <div className="grid gap-5">
              <label className="block">
                <span className="field-label">
                  <FileText size={16} aria-hidden="true" />
                  ショップ説明
                </span>
                <textarea
                  value={form.description}
                  onChange={handleTextField("description")}
                  className="field-input min-h-36 resize-y"
                  placeholder="どんな商品をよく出しているか、まとめ買い可否など"
                  required
                />
              </label>

              <label className="block">
                <span className="field-label">
                  <MapPin size={16} aria-hidden="true" />
                  主な受け渡し場所
                </span>
                <input
                  value={form.pickupArea}
                  onChange={handleTextField("pickupArea")}
                  className="field-input"
                  placeholder="例: 早稲田キャンパス南門"
                  required
                />
              </label>

              <label className="block">
                <span className="field-label">
                  <ShieldCheck size={16} aria-hidden="true" />
                  受け渡しルール
                </span>
                <textarea
                  value={form.shippingPolicy}
                  onChange={handleTextField("shippingPolicy")}
                  className="field-input min-h-28 resize-y"
                  placeholder="例: 平日昼休み中心、配送は相談"
                  required
                />
              </label>
            </div>
          </div>

          <div className="form-panel">
            <div className="mb-5">
              <h2 className="form-panel-title">
                <ImagePlus size={18} aria-hidden="true" />
                ショップ画像
              </h2>
              <p className="form-panel-lead">カバー画像とロゴで、ショップらしさを出せます。</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <label className="upload-dropzone min-h-56">
                <UploadCloud className="text-campus-blue" size={32} aria-hidden="true" />
                <span className="mt-3 text-sm font-bold text-campus-navy">カバー画像を選択</span>
                <span className="mt-1 text-xs font-semibold text-campus-muted">
                  横長の画像がおすすめです
                </span>
                {coverFileName && (
                  <span className="mt-3 text-xs font-bold text-campus-blue">{coverFileName}</span>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload("coverImageUrl", setCoverFileName)}
                  className="sr-only"
                />
              </label>

              <label className="upload-dropzone min-h-56">
                <UploadCloud className="text-campus-blue" size={32} aria-hidden="true" />
                <span className="mt-3 text-sm font-bold text-campus-navy">ロゴ画像を選択</span>
                <span className="mt-1 text-xs font-semibold text-campus-muted">
                  正方形に近い画像がおすすめです
                </span>
                {logoFileName && (
                  <span className="mt-3 text-xs font-bold text-campus-blue">{logoFileName}</span>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload("logoImageUrl", setLogoFileName)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <button type="submit" className="primary-button w-full sm:w-auto">
            <Store size={18} aria-hidden="true" />
            {currentUserShop ? "ショップを更新" : "ショップを開設"}
          </button>
        </section>

        <aside className="space-y-4">
          <div className="card overflow-hidden">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src={form.coverImageUrl}
                alt="ショップカバー"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-campus-navy/70 via-campus-navy/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                <img
                  src={form.logoImageUrl}
                  alt=""
                  className="h-16 w-16 rounded-2xl border border-white/70 object-cover shadow-lg"
                  aria-hidden="true"
                />
                <div className="min-w-0 text-white">
                  <p className="truncate text-xl font-extrabold">
                    {form.name || "ショップ名"}
                  </p>
                  <p className="truncate text-sm text-blue-50">
                    {form.tagline || "ひとことが入ります"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                <span className="badge bg-blue-50 text-campus-blue">{form.featuredCategory}</span>
                <span className="badge">{form.universityName}</span>
              </div>
              <p className="text-sm leading-6 text-campus-muted">
                {form.description || "ショップ説明がここに表示されます。"}
              </p>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}
