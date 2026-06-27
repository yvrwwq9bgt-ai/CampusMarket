import type { Shop } from "../types/shop";

export const defaultShopCoverImage =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80";

export const defaultShopLogoImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80";

export const mockShops: Shop[] = [
  {
    id: "shop-haruka-books",
    ownerId: "u-1",
    ownerName: "Haruka",
    name: "Haruka Books",
    slug: "haruka-books",
    tagline: "経済とデザイン系の授業本を中心に出しています。",
    description:
      "履修が終わった教科書や授業メモ付きの本を中心に出品しています。受け渡しは早稲田キャンパス周辺が多めです。",
    universityName: "早稲田大学",
    featuredCategory: "教科書",
    pickupArea: "早稲田キャンパス正門付近",
    shippingPolicy: "平日は学内手渡し優先。タイミングが合えば大学周辺でも対応します。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-04-12T09:00:00.000Z",
  },
  {
    id: "shop-sota-study",
    ownerId: "u-2",
    ownerName: "Sota",
    name: "Sota Study",
    slug: "sota-study",
    tagline: "資格対策本と語学教材をまとめて出品。",
    description:
      "英語・資格勉強で使った参考書を中心に、まだ使える教材をまとめています。まとめ買いの相談も歓迎です。",
    universityName: "明治大学",
    featuredCategory: "参考書",
    pickupArea: "駿河台キャンパス周辺",
    shippingPolicy: "大学周辺での受け渡しが基本です。配送も相談できます。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-04-15T11:20:00.000Z",
  },
  {
    id: "shop-mina-gadget",
    ownerId: "u-3",
    ownerName: "Mina",
    name: "Mina Gadget Lab",
    slug: "mina-gadget-lab",
    tagline: "iPadまわりや学習ガジェットをきれいな状態で。",
    description:
      "授業用に使っていたタブレットアクセサリや小型デバイスを中心に出しています。写真多めで状態が分かるようにしています。",
    universityName: "慶應義塾大学",
    featuredCategory: "ガジェット",
    pickupArea: "日吉キャンパス駅側",
    shippingPolicy: "学内手渡し優先。週末は配送も可能です。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-04-18T08:50:00.000Z",
  },
  {
    id: "shop-ren-campus-tools",
    ownerId: "u-4",
    ownerName: "Ren",
    name: "Ren Campus Tools",
    slug: "ren-campus-tools",
    tagline: "理系授業で使う道具を中心に出品。",
    description:
      "関数電卓や実験用品など、理系学生向けの実用品が多めです。すぐ使える状態かを重視して整えています。",
    universityName: "東京理科大学",
    featuredCategory: "文房具",
    pickupArea: "神楽坂キャンパス内",
    shippingPolicy: "授業終わりの学内手渡しが基本です。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-04-19T13:10:00.000Z",
  },
  {
    id: "shop-yui-room",
    ownerId: "u-5",
    ownerName: "Yui",
    name: "Yui Room Market",
    slug: "yui-room-market",
    tagline: "一人暮らし用品を小回りよく整理。",
    description:
      "引っ越しや買い替えで使わなくなった家電や生活用品を出しています。近場で受け取れる方を優先しています。",
    universityName: "中央大学",
    featuredCategory: "家具・家電",
    pickupArea: "多摩キャンパス近辺",
    shippingPolicy: "サイズによっては大学周辺手渡し。大型は要相談。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-04-22T10:40:00.000Z",
  },
  {
    id: "shop-daichi-circle",
    ownerId: "u-6",
    ownerName: "Daichi",
    name: "Daichi Circle Supply",
    slug: "daichi-circle-supply",
    tagline: "イベントやサークル運営で使う備品を出品。",
    description:
      "新歓や練習で使っていた音響・備品など、まだ使えるものを出しています。まとまった相談にも対応します。",
    universityName: "法政大学",
    featuredCategory: "部活・サークル用品",
    pickupArea: "市ヶ谷キャンパス周辺",
    shippingPolicy: "相談して受け渡し場所を決めます。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-04-25T16:15:00.000Z",
  },
  {
    id: "shop-kaito-sports",
    ownerId: "u-7",
    ownerName: "Kaito",
    name: "Kaito Sports Locker",
    slug: "kaito-sports-locker",
    tagline: "サークルで使ったスポーツ用品を中心に。",
    description:
      "体育会やサークルで使っていた用品を中心に出しています。空気入れや備品の有無も説明に入れています。",
    universityName: "日本大学",
    featuredCategory: "部活・サークル用品",
    pickupArea: "文理学部キャンパス前",
    shippingPolicy: "学内手渡し優先です。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43f?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-04-27T09:30:00.000Z",
  },
  {
    id: "shop-nana-design",
    ownerId: "u-8",
    ownerName: "Nana",
    name: "Nana Design Shelf",
    slug: "nana-design-shelf",
    tagline: "デザイン・企画系の授業本を中心に。",
    description:
      "授業で使ったデザイン本や資料を出しています。状態がいいものを選んで整理しています。",
    universityName: "青山学院大学",
    featuredCategory: "教科書",
    pickupArea: "青山キャンパス正門前",
    shippingPolicy: "平日夕方の受け渡しが多めです。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-04-29T14:50:00.000Z",
  },
  {
    id: "shop-aoi-closet",
    ownerId: "u-9",
    ownerName: "Aoi",
    name: "Aoi Closet",
    slug: "aoi-closet",
    tagline: "通学で使いやすい服や小物を出品。",
    description:
      "通学服や軽めのアイテムを中心に出しています。着用感が伝わるように、状態は細かく書いています。",
    universityName: "立教大学",
    featuredCategory: "ファッション",
    pickupArea: "池袋キャンパス付近",
    shippingPolicy: "配送も対応できます。手渡しは大学周辺で相談します。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29331?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-05-01T10:15:00.000Z",
  },
  {
    id: "shop-taku-lab",
    ownerId: "u-10",
    ownerName: "Taku",
    name: "Taku Lab Room",
    slug: "taku-lab-room",
    tagline: "勉強机まわりの家電と学習環境づくり用品。",
    description:
      "一人暮らしで使っていた照明やデスク周りの用品を中心に出しています。受け取りやすさを優先して調整します。",
    universityName: "東京大学",
    featuredCategory: "家具・家電",
    pickupArea: "本郷キャンパス赤門前",
    shippingPolicy: "大学周辺での受け渡しが基本です。",
    coverImageUrl:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
    logoImageUrl:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-05-03T17:25:00.000Z",
  },
];
