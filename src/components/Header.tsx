import { Bell, LogIn, Plus, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useCampusMarket } from "../context/CampusMarketContext";

const navItems = [
  { to: "/about", label: "About us" },
  { to: "/products", label: "商品を探す" },
  { to: "/sell", label: "出品する" },
  { to: "/mypage", label: "マイページ" },
];

export function Header() {
  const { currentUser, logout, unreadNotificationCount } = useCampusMarket();

  return (
    <header className="sticky top-0 z-30 border-b border-campus-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2 font-extrabold text-campus-navy"
          aria-label="CampusMarket トップへ"
        >
          <img
            src="/campusmarket-icon.png"
            alt=""
            className="h-10 w-10 shrink-0 rounded-lg object-cover shadow-sm"
            aria-hidden="true"
          />
          <span className="truncate text-lg sm:text-xl">CampusMarket</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-campus-blue"
                    : "text-campus-muted hover:bg-campus-soft hover:text-campus-navy"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link to="/sell" className="hidden primary-button sm:inline-flex">
            <Plus size={18} aria-hidden="true" />
            出品する
          </Link>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to="/mypage"
                className="relative hidden h-11 w-11 place-items-center rounded-lg border border-campus-line bg-white text-campus-navy transition hover:border-campus-blue hover:text-campus-blue sm:grid"
                aria-label="通知を見る"
              >
                <Bell size={18} aria-hidden="true" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-extrabold leading-none text-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </Link>
              <Link
                to="/mypage"
                className="hidden items-center gap-2 rounded-lg border border-campus-line bg-white px-3 py-2 text-sm font-semibold text-campus-navy sm:flex"
              >
                <UserRound size={17} aria-hidden="true" />
                <span className="max-w-28 truncate">{currentUser.name}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="secondary-button hidden md:inline-flex"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <Link to="/auth" className="secondary-button">
              <LogIn size={18} aria-hidden="true" />
              ログイン
            </Link>
          )}
        </div>
      </div>
      <nav
        className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 md:hidden lg:px-8"
        aria-label="モバイルナビゲーション"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-50 text-campus-blue"
                  : "bg-campus-soft text-campus-muted"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
