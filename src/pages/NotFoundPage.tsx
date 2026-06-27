import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="page-shell">
      <div className="card p-8 text-center">
        <h1 className="text-3xl font-extrabold text-campus-navy">ページが見つかりません</h1>
        <p className="mt-2 text-campus-muted">
          URLを確認するか、トップページから探してください。
        </p>
        <Link to="/" className="primary-button mt-5">
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
