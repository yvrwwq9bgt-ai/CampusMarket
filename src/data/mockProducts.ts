import type { Product } from "../types/product";

const baseProducts: Product[] = [
  {
    id: "p-eco-textbook",
    title: "経済学入門 教科書 第3版",
    price: 1800,
    category: "教科書",
    condition: "目立った傷なし",
    universityName: "早稲田大学",
    deliveryMethod: "学内手渡し",
    description:
      "ミクロ・マクロ経済学の基礎講義で使いました。マーカーは数ページのみで、授業ノートのメモも残っています。",
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-1",
    sellerName: "Haruka",
    shopId: "shop-haruka-books",
    shopName: "Haruka Books",
    createdAt: "2026-05-22T09:00:00.000Z",
    status: "available",
  },
  {
    id: "p-eiken-book",
    title: "英検準1級 参考書セット",
    price: 1200,
    category: "参考書",
    condition: "やや傷や汚れあり",
    universityName: "明治大学",
    deliveryMethod: "大学周辺で手渡し",
    description:
      "単語帳と過去問の2冊セットです。書き込みがありますが、演習用としてまだ十分使えます。",
    imageUrl:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-2",
    sellerName: "Sota",
    shopId: "shop-sota-study",
    shopName: "Sota Study",
    createdAt: "2026-05-24T12:30:00.000Z",
    status: "available",
  },
  {
    id: "p-ipad-case",
    title: "iPad Air 11インチ ケース",
    price: 2200,
    category: "ガジェット",
    condition: "新品に近い",
    universityName: "慶應義塾大学",
    deliveryMethod: "学内手渡し",
    description:
      "キーボードなしの薄型ケースです。色はライトブルー。別モデルに買い替えたため出品します。",
    imageUrl:
      "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-3",
    sellerName: "Mina",
    shopId: "shop-mina-gadget",
    shopName: "Mina Gadget Lab",
    createdAt: "2026-05-27T15:10:00.000Z",
    status: "available",
  },
  {
    id: "p-calculator",
    title: "CASIO 関数電卓 fx-JP900",
    price: 1500,
    category: "文房具",
    condition: "目立った傷なし",
    universityName: "東京理科大学",
    deliveryMethod: "学内手渡し",
    description:
      "理系基礎科目で使用。動作確認済みで、電池もまだ残っています。箱はありません。",
    imageUrl:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-4",
    sellerName: "Ren",
    shopId: "shop-ren-campus-tools",
    shopName: "Ren Campus Tools",
    createdAt: "2026-05-28T08:40:00.000Z",
    status: "available",
  },
  {
    id: "p-kettle",
    title: "一人暮らし用 電気ケトル 0.8L",
    price: 900,
    category: "家具・家電",
    condition: "使用感あり",
    universityName: "中央大学",
    deliveryMethod: "大学周辺で手渡し",
    description:
      "引っ越しのため出品します。内部洗浄済み。外側に小さな擦れがあります。",
    imageUrl:
      "https://images.unsplash.com/photo-1571552879083-e93b6ea70d1d?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-5",
    sellerName: "Yui",
    shopId: "shop-yui-room",
    shopName: "Yui Room Market",
    createdAt: "2026-05-29T17:20:00.000Z",
    status: "reserved",
  },
  {
    id: "p-speaker",
    title: "サークル用 Bluetooth スピーカー",
    price: 3200,
    category: "部活・サークル用品",
    condition: "やや傷や汚れあり",
    universityName: "法政大学",
    deliveryMethod: "相談して決定",
    description:
      "屋外練習や新歓で使っていました。低音がしっかり出ます。充電ケーブル付きです。",
    imageUrl:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-6",
    sellerName: "Daichi",
    shopId: "shop-daichi-circle",
    shopName: "Daichi Circle Supply",
    createdAt: "2026-05-30T11:10:00.000Z",
    status: "available",
  },
  {
    id: "p-basketball",
    title: "molten バスケットボール 7号",
    price: 1700,
    category: "部活・サークル用品",
    condition: "目立った傷なし",
    universityName: "日本大学",
    deliveryMethod: "学内手渡し",
    description:
      "体育館で数回使ったのみです。空気も入っています。サークル練習用にどうぞ。",
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-7",
    sellerName: "Kaito",
    shopId: "shop-kaito-sports",
    shopName: "Kaito Sports Locker",
    createdAt: "2026-06-01T10:00:00.000Z",
    status: "available",
  },
  {
    id: "p-design-book",
    title: "デザイン思考の授業 教科書",
    price: 1300,
    category: "教科書",
    condition: "目立った傷なし",
    universityName: "青山学院大学",
    deliveryMethod: "学内手渡し",
    description:
      "プロジェクト型授業で使用。付箋跡はありますが、本文への書き込みは少なめです。",
    imageUrl:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-8",
    sellerName: "Nana",
    shopId: "shop-nana-design",
    shopName: "Nana Design Shelf",
    createdAt: "2026-06-02T13:45:00.000Z",
    status: "available",
  },
  {
    id: "p-cardigan",
    title: "通学用 ネイビーカーディガン",
    price: 1100,
    category: "ファッション",
    condition: "目立った傷なし",
    universityName: "立教大学",
    deliveryMethod: "配送対応",
    description:
      "Mサイズ。春秋の通学にちょうどいい厚さです。クリーニング後に保管しています。",
    imageUrl:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-9",
    sellerName: "Aoi",
    shopId: "shop-aoi-closet",
    shopName: "Aoi Closet",
    createdAt: "2026-06-03T09:25:00.000Z",
    status: "available",
  },
  {
    id: "p-desk-light",
    title: "USB充電式 デスクライト",
    price: 1400,
    category: "家具・家電",
    condition: "新品に近い",
    universityName: "東京大学",
    deliveryMethod: "大学周辺で手渡し",
    description:
      "オンライン授業用に購入しました。明るさ調整ができ、折りたたんで持ち運べます。",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-10",
    sellerName: "Taku",
    shopId: "shop-taku-lab",
    shopName: "Taku Lab Room",
    createdAt: "2026-06-05T18:05:00.000Z",
    status: "available",
  },
  {
    id: "p-lab-coat",
    title: "実験用 白衣 Mサイズ",
    price: 1000,
    category: "その他",
    condition: "やや傷や汚れあり",
    universityName: "東京理科大学",
    deliveryMethod: "学内手渡し",
    description:
      "化学実験で使っていました。袖口に少し使用感があります。予備の白衣としておすすめです。",
    imageUrl:
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=900&q=80",
    sellerId: "u-4",
    sellerName: "Ren",
    shopId: "shop-ren-campus-tools",
    shopName: "Ren Campus Tools",
    createdAt: "2026-06-06T14:00:00.000Z",
    status: "available",
  },
];

type GeneratedProductTemplate = {
  title: string;
  price: number;
  category: Product["category"];
  condition: Product["condition"];
  description: string;
  imageUrl: string;
};

const shopProfiles = [
  {
    sellerId: "u-1",
    sellerName: "Haruka",
    shopId: "shop-haruka-books",
    shopName: "Haruka Books",
    universityName: "早稲田大学",
    deliveryMethod: "学内手渡し",
  },
  {
    sellerId: "u-2",
    sellerName: "Sota",
    shopId: "shop-sota-study",
    shopName: "Sota Study",
    universityName: "明治大学",
    deliveryMethod: "大学周辺で手渡し",
  },
  {
    sellerId: "u-3",
    sellerName: "Mina",
    shopId: "shop-mina-gadget",
    shopName: "Mina Gadget Lab",
    universityName: "慶應義塾大学",
    deliveryMethod: "学内手渡し",
  },
  {
    sellerId: "u-4",
    sellerName: "Ren",
    shopId: "shop-ren-campus-tools",
    shopName: "Ren Campus Tools",
    universityName: "東京理科大学",
    deliveryMethod: "学内手渡し",
  },
  {
    sellerId: "u-5",
    sellerName: "Yui",
    shopId: "shop-yui-room",
    shopName: "Yui Room Market",
    universityName: "中央大学",
    deliveryMethod: "大学周辺で手渡し",
  },
  {
    sellerId: "u-6",
    sellerName: "Daichi",
    shopId: "shop-daichi-circle",
    shopName: "Daichi Circle Supply",
    universityName: "法政大学",
    deliveryMethod: "相談して決定",
  },
  {
    sellerId: "u-7",
    sellerName: "Kaito",
    shopId: "shop-kaito-sports",
    shopName: "Kaito Sports Locker",
    universityName: "日本大学",
    deliveryMethod: "学内手渡し",
  },
  {
    sellerId: "u-8",
    sellerName: "Nana",
    shopId: "shop-nana-design",
    shopName: "Nana Design Shelf",
    universityName: "青山学院大学",
    deliveryMethod: "学内手渡し",
  },
  {
    sellerId: "u-9",
    sellerName: "Aoi",
    shopId: "shop-aoi-closet",
    shopName: "Aoi Closet",
    universityName: "立教大学",
    deliveryMethod: "配送対応",
  },
  {
    sellerId: "u-10",
    sellerName: "Taku",
    shopId: "shop-taku-lab",
    shopName: "Taku Lab Room",
    universityName: "東京大学",
    deliveryMethod: "大学周辺で手渡し",
  },
] satisfies Array<
  Pick<
    Product,
    | "sellerId"
    | "sellerName"
    | "shopId"
    | "shopName"
    | "universityName"
    | "deliveryMethod"
  >
>;

const generatedProductTemplates: GeneratedProductTemplate[] = [
  {
    title: "心理学概論 テキスト",
    price: 1600,
    category: "教科書",
    condition: "目立った傷なし",
    description:
      "基礎心理学の講義で使いました。重要語句に数か所だけマーカーがあります。",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "統計学入門 ワークブック",
    price: 1400,
    category: "教科書",
    condition: "やや傷や汚れあり",
    description:
      "演習問題の一部に鉛筆メモがあります。授業の復習用として使いやすいです。",
    imageUrl:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "TOEIC 公式問題集",
    price: 1300,
    category: "参考書",
    condition: "目立った傷なし",
    description:
      "リスニング音源付き。解答冊子はそろっていて、書き込みは少なめです。",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "簿記2級 仕訳問題集",
    price: 900,
    category: "参考書",
    condition: "使用感あり",
    description:
      "試験対策で使いました。角に折れがありますが、問題演習には問題ありません。",
    imageUrl:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "製図用シャープペンセット",
    price: 800,
    category: "文房具",
    condition: "目立った傷なし",
    description:
      "0.3mmと0.5mmのセットです。替芯も少し残っているので一緒に渡します。",
    imageUrl:
      "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "A4ルーズリーフ まとめ売り",
    price: 500,
    category: "文房具",
    condition: "新品に近い",
    description:
      "未使用分が多く残っています。講義ノート用にまとめて使えます。",
    imageUrl:
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "USB-C ハブ 7in1",
    price: 2400,
    category: "ガジェット",
    condition: "目立った傷なし",
    description:
      "HDMI、USB-A、SDカードに対応。授業発表や作業用に便利です。",
    imageUrl:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ワイヤレスマウス 静音タイプ",
    price: 1000,
    category: "ガジェット",
    condition: "やや傷や汚れあり",
    description:
      "クリック音が小さいタイプです。自習室や図書館でも使いやすいです。",
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "折りたたみローテーブル",
    price: 2200,
    category: "家具・家電",
    condition: "使用感あり",
    description:
      "一人暮らしの部屋で使っていました。天板に小さな擦れがあります。",
    imageUrl:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "小型アイロン",
    price: 1800,
    category: "家具・家電",
    condition: "目立った傷なし",
    description:
      "シャツやスラックス用に使っていました。動作確認済みです。",
    imageUrl:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "イベント用延長コード 5m",
    price: 700,
    category: "部活・サークル用品",
    condition: "目立った傷なし",
    description:
      "学園祭やサークルイベントで使っていました。屋内利用のみです。",
    imageUrl:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "テニスラケット 初心者向け",
    price: 2600,
    category: "部活・サークル用品",
    condition: "やや傷や汚れあり",
    description:
      "サークル体験で数回使用。グリップテープは交換するとさらに使いやすいです。",
    imageUrl:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "通学用トートバッグ",
    price: 1200,
    category: "ファッション",
    condition: "目立った傷なし",
    description:
      "A4ファイルとPCが入るサイズです。持ち手に少しだけ使用感があります。",
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "就活用ネクタイ",
    price: 900,
    category: "ファッション",
    condition: "新品に近い",
    description:
      "面接で一度だけ使いました。落ち着いたネイビー系で合わせやすいです。",
    imageUrl:
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "折りたたみ傘 軽量タイプ",
    price: 600,
    category: "その他",
    condition: "目立った傷なし",
    description:
      "通学バッグに入る軽い傘です。雨の日の予備としてどうぞ。",
    imageUrl:
      "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "学生証ケース リール付き",
    price: 400,
    category: "その他",
    condition: "新品に近い",
    description:
      "予備で買っていたケースです。ICカードや学生証を入れられます。",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "民法入門 ケースブック",
    price: 1900,
    category: "教科書",
    condition: "目立った傷なし",
    description:
      "法学部の基礎科目で使用。判例部分に付箋跡があります。",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Python演習ノート",
    price: 1500,
    category: "参考書",
    condition: "やや傷や汚れあり",
    description:
      "プログラミング演習で使いました。サンプルコードのメモがあります。",
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  },
];

const additionalProducts = Array.from({ length: 99 }, (_, index): Product => {
  const template = generatedProductTemplates[index % generatedProductTemplates.length];
  const shop = shopProfiles[index % shopProfiles.length];
  const variation = Math.floor(index / generatedProductTemplates.length) + 1;
  const createdDay = 7 + index;
  const status: Product["status"] =
    index % 23 === 0 ? "reserved" : index % 41 === 0 ? "sold" : "available";

  return {
    id: `p-extra-${String(index + 1).padStart(3, "0")}`,
    title:
      variation === 1
        ? template.title
        : `${template.title} ${variation}`,
    price: template.price + (index % 5) * 100,
    category: template.category,
    condition: template.condition,
    universityName: shop.universityName,
    deliveryMethod: shop.deliveryMethod,
    description: template.description,
    imageUrl: template.imageUrl,
    sellerId: shop.sellerId,
    sellerName: shop.sellerName,
    shopId: shop.shopId,
    shopName: shop.shopName,
    createdAt: `2026-06-${String(((createdDay - 1) % 20) + 7).padStart(2, "0")}T${String(
      9 + (index % 10),
    ).padStart(2, "0")}:00:00.000Z`,
    status,
  };
});

export const mockProducts: Product[] = [...additionalProducts, ...baseProducts];
