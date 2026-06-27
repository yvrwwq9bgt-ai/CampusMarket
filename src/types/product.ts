export type Category =
  | "教科書"
  | "参考書"
  | "文房具"
  | "ガジェット"
  | "家具・家電"
  | "部活・サークル用品"
  | "ファッション"
  | "その他";

export type ProductCondition =
  | "新品に近い"
  | "目立った傷なし"
  | "やや傷や汚れあり"
  | "使用感あり";

export type DeliveryMethod =
  | "学内手渡し"
  | "大学周辺で手渡し"
  | "配送対応"
  | "相談して決定";

export type ProductStatus = "available" | "reserved" | "sold" | "cancelled";

export type Product = {
  id: string;
  title: string;
  price: number;
  category: Category;
  condition: ProductCondition;
  universityName: string;
  deliveryMethod: DeliveryMethod;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
  sellerId: string;
  sellerName: string;
  shopId: string;
  shopName: string;
  createdAt: string;
  status: ProductStatus;
};

export type ProductFormInput = {
  title: string;
  price: number;
  category: Category;
  condition: ProductCondition;
  universityName: string;
  deliveryMethod: DeliveryMethod;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
};
