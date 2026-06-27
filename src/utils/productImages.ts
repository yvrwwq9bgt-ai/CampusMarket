import type { Product } from "../types/product";

export const getProductImages = (product: Product) => {
  const images = product.imageUrls?.length ? product.imageUrls : [product.imageUrl];
  return images.filter(Boolean);
};

export const getProductMainImage = (product: Product) =>
  getProductImages(product)[0] || product.imageUrl;
