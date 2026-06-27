import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createLocalProduct,
  createLocalShop,
  getInitialProducts,
  getInitialShops,
} from "../services/localMarketplace";
import type { ChatMessage } from "../types/message";
import type { Notification } from "../types/notification";
import type { Product, ProductFormInput } from "../types/product";
import type { PurchaseInterest } from "../types/purchaseInterest";
import type { Shop, ShopFormInput } from "../types/shop";
import type { User } from "../types/user";
import { createId } from "../utils/format";
import { slugify } from "../utils/slug";
import {
  defaultShopCoverImage,
  defaultShopLogoImage,
} from "../data/mockShops";

type CampusMarketContextValue = {
  products: Product[];
  shops: Shop[];
  currentUser: User | null;
  currentUserShop: Shop | null;
  interestedProductIds: string[];
  messages: ChatMessage[];
  notifications: Notification[];
  purchaseInterests: PurchaseInterest[];
  unreadNotificationCount: number;
  login: (payload: { email: string; universityName: string }) => void;
  logout: () => void;
  updateProfile: (payload: { name: string; universityName: string }) => void;
  addProduct: (input: ProductFormInput) => Product;
  upsertShop: (input: ShopFormInput) => Shop | null;
  cancelProduct: (productId: string) => void;
  deleteProduct: (productId: string) => void;
  relistProduct: (productId: string) => void;
  markInterested: (productId: string) => void;
  isInterested: (productId: string) => boolean;
  markNotificationsRead: () => void;
  sendMessage: (productId: string, body: string) => ChatMessage | null;
};

const CampusMarketContext = createContext<CampusMarketContextValue | null>(null);

const demoUser: User = {
  id: "u-current",
  name: "Campus Student",
  email: "student@example.ac.jp",
  universityName: "早稲田大学",
  verifiedStudent: true,
};

const STORAGE_KEY = "campus-market-state-v1";

type StoredCampusMarketState = {
  products: Product[];
  shops: Shop[];
  currentUser: User | null;
  interestedProductIds: string[];
  messages: ChatMessage[];
  notifications: Notification[];
  purchaseInterests: PurchaseInterest[];
};

const createUserIdFromEmail = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === "student@example.ac.jp") {
    return "u-current";
  }

  return `u-${normalizedEmail.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
};

const deriveShopId = (ownerId: string) =>
  `shop-${ownerId.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "")}`;

const normalizeShop = (shop: Shop): Shop => ({
  ...shop,
  slug: shop.slug || slugify(shop.name),
  coverImageUrl: shop.coverImageUrl || defaultShopCoverImage,
  logoImageUrl: shop.logoImageUrl || defaultShopLogoImage,
});

const deriveShopFromProduct = (product: Product): Shop => ({
  id: product.shopId || deriveShopId(product.sellerId),
  ownerId: product.sellerId,
  ownerName: product.sellerName,
  name: product.shopName || `${product.sellerName} Shop`,
  slug: slugify(product.shopName || `${product.sellerName} Shop`),
  tagline: `${product.universityName}の学生向けショップ`,
  description: `${product.sellerName}さんがCampusMarketで出店しているショップです。`,
  universityName: product.universityName,
  featuredCategory: product.category,
  pickupArea: product.deliveryMethod,
  shippingPolicy: "受け渡し方法は商品ごとに相談できます。",
  coverImageUrl: product.imageUrl || defaultShopCoverImage,
  logoImageUrl: product.imageUrl || defaultShopLogoImage,
  createdAt: product.createdAt,
});

const normalizeShopsForProducts = (products: Product[], shops: Shop[]) => {
  const normalizedShops = shops.map(normalizeShop);
  const shopById = new Map(normalizedShops.map((shop) => [shop.id, shop]));
  const shopByOwnerId = new Map(normalizedShops.map((shop) => [shop.ownerId, shop]));

  products.forEach((product) => {
    const hasKnownShop =
      Boolean(product.shopId && shopById.has(product.shopId)) ||
      shopByOwnerId.has(product.sellerId);

    if (!hasKnownShop) {
      const derivedShop = normalizeShop(deriveShopFromProduct(product));
      normalizedShops.push(derivedShop);
      shopById.set(derivedShop.id, derivedShop);
      shopByOwnerId.set(derivedShop.ownerId, derivedShop);
    }
  });

  return normalizedShops;
};

const normalizeProduct = (product: Product, shops: Shop[]): Product => {
  const shop =
    (product.shopId ? shops.find((item) => item.id === product.shopId) : null) ??
    shops.find((item) => item.ownerId === product.sellerId);

  return {
    ...product,
    imageUrls: product.imageUrls?.length ? product.imageUrls : [product.imageUrl],
    shopId: product.shopId || shop?.id || deriveShopId(product.sellerId),
    shopName: product.shopName || shop?.name || `${product.sellerName} Shop`,
  };
};

const mergeProductsWithSeed = (storedProducts: Product[] | undefined) => {
  const seedProducts = getInitialProducts();

  if (!storedProducts) {
    return seedProducts;
  }

  const productMap = new Map<string, Product>();
  seedProducts.forEach((product) => productMap.set(product.id, product));
  storedProducts.forEach((product) => productMap.set(product.id, product));

  return Array.from(productMap.values()).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

const readStoredState = (): Partial<StoredCampusMarketState> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);
    return rawState ? (JSON.parse(rawState) as Partial<StoredCampusMarketState>) : {};
  } catch {
    return {};
  }
};

export function CampusMarketProvider({ children }: { children: ReactNode }) {
  const [initialState] = useState(readStoredState);
  const initialProducts = mergeProductsWithSeed(initialState.products);
  const initialShops = normalizeShopsForProducts(
    initialProducts,
    initialState.shops ?? getInitialShops(),
  );

  const [shops, setShops] = useState<Shop[]>(() => initialShops);
  const [products, setProducts] = useState<Product[]>(
    () => initialProducts.map((product) => normalizeProduct(product, initialShops)),
  );
  const [currentUser, setCurrentUser] = useState<User | null>(
    () => initialState.currentUser ?? null,
  );
  const [interestedProductIds, setInterestedProductIds] = useState<string[]>(
    () => initialState.interestedProductIds ?? [],
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => initialState.messages ?? [],
  );
  const [notifications, setNotifications] = useState<Notification[]>(
    () => initialState.notifications ?? [],
  );
  const [purchaseInterests, setPurchaseInterests] = useState<PurchaseInterest[]>(
    () => initialState.purchaseInterests ?? [],
  );

  const currentUserShop = useMemo(
    () =>
      currentUser
        ? shops.find((shop) => shop.ownerId === currentUser.id) ?? null
        : null,
    [currentUser, shops],
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          products,
          shops,
          currentUser,
          interestedProductIds,
          messages,
          notifications,
          purchaseInterests,
        }),
      );
    } catch {
      // Persistence is helpful for the prototype, but the app still works without it.
    }
  }, [
    products,
    shops,
    currentUser,
    interestedProductIds,
    messages,
    notifications,
    purchaseInterests,
  ]);

  const login = ({
    email,
    universityName,
  }: {
    email: string;
    universityName: string;
  }) => {
    const userId = createUserIdFromEmail(email);

    setCurrentUser({
      id: userId,
      name: email.split("@")[0] || "Campus Student",
      email,
      universityName,
      verifiedStudent: email.endsWith(".ac.jp") || email.includes(".edu"),
    });
    setInterestedProductIds(
      purchaseInterests
        .filter((interest) => interest.buyerId === userId)
        .map((interest) => interest.productId),
    );
  };

  const logout = () => {
    setCurrentUser(null);
    setInterestedProductIds([]);
  };

  const updateProfile = ({
    name,
    universityName,
  }: {
    name: string;
    universityName: string;
  }) => {
    const userId = currentUser?.id;

    setCurrentUser((user) =>
      user
        ? {
            ...user,
            name,
            universityName,
          }
        : user,
    );
    setProducts((items) =>
      items.map((item) =>
        item.sellerId === userId ? { ...item, sellerName: name } : item,
      ),
    );
    setMessages((items) =>
      items.map((item) =>
        item.senderId === userId ? { ...item, senderName: name } : item,
      ),
    );
    setPurchaseInterests((items) =>
      items.map((item) =>
        item.buyerId === userId ? { ...item, buyerName: name } : item,
      ),
    );
    setShops((items) =>
      items.map((item) =>
        item.ownerId === userId
          ? {
              ...item,
              ownerName: name,
              universityName,
            }
          : item,
      ),
    );
  };

  const upsertShop = (input: ShopFormInput) => {
    const owner = currentUser ?? demoUser;
    const existingShop = shops.find((shop) => shop.ownerId === owner.id);
    const nextShop = createLocalShop(input, owner, existingShop);

    setShops((items) => {
      if (existingShop) {
        return items.map((item) => (item.id === existingShop.id ? nextShop : item));
      }

      return [nextShop, ...items];
    });
    setProducts((items) =>
      items.map((item) =>
        item.sellerId === owner.id
          ? { ...item, shopId: nextShop.id, shopName: nextShop.name }
          : item,
      ),
    );

    return nextShop;
  };

  const addProduct = (input: ProductFormInput) => {
    const seller = currentUser ?? demoUser;
    const product = createLocalProduct(input, seller, currentUserShop);

    setProducts((items) => [product, ...items]);
    return product;
  };

  const cancelProduct = (productId: string) => {
    setProducts((items) =>
      items.map((item) =>
        item.id === productId && item.sellerId === currentUser?.id
          ? { ...item, status: "cancelled" }
          : item,
      ),
    );
  };

  const deleteProduct = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (!product || product.sellerId !== currentUser?.id) {
      return;
    }

    setProducts((items) => items.filter((item) => item.id !== productId));
    setInterestedProductIds((ids) => ids.filter((id) => id !== productId));
    setMessages((items) => items.filter((item) => item.productId !== productId));
    setPurchaseInterests((items) =>
      items.filter((item) => item.productId !== productId),
    );
    setNotifications((items) =>
      items.filter((item) => item.productId !== productId),
    );
  };

  const relistProduct = (productId: string) => {
    setProducts((items) =>
      items.map((item) =>
        item.id === productId && item.sellerId === currentUser?.id
          ? { ...item, status: "available" }
          : item,
      ),
    );
  };

  const markInterested = (productId: string) => {
    if (!currentUser) {
      return;
    }

    const product = products.find((item) => item.id === productId);

    if (!product || product.sellerId === currentUser.id) {
      return;
    }

    const alreadyInterested = purchaseInterests.some(
      (interest) =>
        interest.productId === productId && interest.buyerId === currentUser.id,
    );

    if (!alreadyInterested) {
      const interest: PurchaseInterest = {
        id: createId("pi"),
        productId,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerUniversityName: currentUser.universityName,
        createdAt: new Date().toISOString(),
        status: "interested",
      };
      const notification: Notification = {
        id: createId("n"),
        recipientId: product.sellerId,
        productId,
        actorId: currentUser.id,
        actorName: currentUser.name,
        type: "purchase_interest",
        title: "購入希望が届きました",
        body: `${currentUser.name}さんが「${product.title}」に購入希望を送りました。`,
        createdAt: new Date().toISOString(),
        read: false,
      };

      setPurchaseInterests((items) => [interest, ...items]);
      setNotifications((items) => [notification, ...items]);
    }

    setInterestedProductIds((ids) =>
      ids.includes(productId) ? ids : [productId, ...ids],
    );
  };

  const isInterested = (productId: string) =>
    currentUser
      ? purchaseInterests.some(
          (interest) =>
            interest.productId === productId &&
            interest.buyerId === currentUser.id,
        )
      : interestedProductIds.includes(productId);

  const unreadNotificationCount = currentUser
    ? notifications.filter(
        (notification) =>
          notification.recipientId === currentUser.id && !notification.read,
      ).length
    : 0;

  const markNotificationsRead = () => {
    if (!currentUser) {
      return;
    }

    setNotifications((items) =>
      items.map((item) =>
        item.recipientId === currentUser.id ? { ...item, read: true } : item,
      ),
    );
  };

  const sendMessage = (productId: string, body: string) => {
    if (!currentUser || !body.trim()) {
      return null;
    }

    const message: ChatMessage = {
      id: createId("m"),
      productId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((items) => [...items, message]);
    return message;
  };

  const value = useMemo(
    () => ({
      products,
      shops,
      currentUser,
      currentUserShop,
      interestedProductIds,
      messages,
      notifications,
      purchaseInterests,
      unreadNotificationCount,
      login,
      logout,
      updateProfile,
      addProduct,
      upsertShop,
      cancelProduct,
      deleteProduct,
      relistProduct,
      markInterested,
      isInterested,
      markNotificationsRead,
      sendMessage,
    }),
    [
      products,
      shops,
      currentUser,
      currentUserShop,
      interestedProductIds,
      messages,
      notifications,
      purchaseInterests,
      unreadNotificationCount,
    ],
  );

  return (
    <CampusMarketContext.Provider value={value}>
      {children}
    </CampusMarketContext.Provider>
  );
}

export function useCampusMarket() {
  const context = useContext(CampusMarketContext);

  if (!context) {
    throw new Error("useCampusMarket must be used within CampusMarketProvider");
  }

  return context;
}
