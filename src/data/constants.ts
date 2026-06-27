import type { Category, DeliveryMethod, ProductCondition } from "../types/product";

export const categories: Category[] = [
  "教科書",
  "参考書",
  "文房具",
  "ガジェット",
  "家具・家電",
  "部活・サークル用品",
  "ファッション",
  "その他",
];

export const conditions: ProductCondition[] = [
  "新品に近い",
  "目立った傷なし",
  "やや傷や汚れあり",
  "使用感あり",
];

export const deliveryMethods: DeliveryMethod[] = [
  "学内手渡し",
  "大学周辺で手渡し",
  "配送対応",
  "相談して決定",
];

export const universities = [
  "青山学院大学",
  "慶應義塾大学",
  "早稲田大学",
  "明治大学",
  "立教大学",
  "中央大学",
  "法政大学",
  "東京大学",
  "東京理科大学",
  "日本大学",
];
