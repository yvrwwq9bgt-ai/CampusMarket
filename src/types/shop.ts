import type { Category } from "./product";

export type Shop = {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  universityName: string;
  featuredCategory: Category;
  pickupArea: string;
  shippingPolicy: string;
  coverImageUrl: string;
  logoImageUrl: string;
  createdAt: string;
};

export type ShopFormInput = {
  name: string;
  tagline: string;
  description: string;
  universityName: string;
  featuredCategory: Category;
  pickupArea: string;
  shippingPolicy: string;
  coverImageUrl: string;
  logoImageUrl: string;
};
