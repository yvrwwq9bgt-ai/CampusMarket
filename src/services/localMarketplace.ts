import { mockShops } from "../data/mockShops";
import { mockProducts } from "../data/mockProducts";
import type { Product, ProductFormInput } from "../types/product";
import type { Shop, ShopFormInput } from "../types/shop";
import type { User } from "../types/user";
import { createId } from "../utils/format";
import { slugify } from "../utils/slug";

export const getInitialProducts = () => [...mockProducts];
export const getInitialShops = () => [...mockShops];

export const createLocalProduct = (
  input: ProductFormInput,
  seller: User,
  shop: Shop | null,
): Product => ({
  ...input,
  imageUrls: input.imageUrls?.length ? input.imageUrls : [input.imageUrl],
  id: createId("p"),
  sellerId: seller.id,
  sellerName: seller.name,
  shopId: shop?.id ?? createId("shop"),
  shopName: shop?.name ?? `${seller.name} Shop`,
  createdAt: new Date().toISOString(),
  status: "available",
});

export const createLocalShop = (
  input: ShopFormInput,
  owner: User,
  currentShop?: Shop,
): Shop => ({
  id: currentShop?.id ?? createId("shop"),
  ownerId: owner.id,
  ownerName: owner.name,
  slug: slugify(input.name),
  createdAt: currentShop?.createdAt ?? new Date().toISOString(),
  ...input,
});
