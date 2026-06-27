import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { AuthPage } from "./pages/AuthPage";
import { CreateListingPage } from "./pages/CreateListingPage";
import { HomePage } from "./pages/HomePage";
import { MyPage } from "./pages/MyPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ShopPage } from "./pages/ShopPage";
import { ShopSetupPage } from "./pages/ShopSetupPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/shops/:shopId" element={<ShopPage />} />
        <Route path="/shop/setup" element={<ShopSetupPage />} />
        <Route path="/sell" element={<CreateListingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
