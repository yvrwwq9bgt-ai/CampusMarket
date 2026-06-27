import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useCampusMarket } from "../context/CampusMarketContext";
import { universities } from "../data/constants";

export function AuthPage() {
  const { login } = useCampusMarket();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("student@example.ac.jp");
  const [password, setPassword] = useState("");
  const [universityName, setUniversityName] = useState(universities[0]);
  const [introDone, setIntroDone] = useState(false);
  const navigate = useNavigate();
  const normalizedEmail = email.trim().toLowerCase();
  const emailDomain = normalizedEmail.includes("@")
    ? normalizedEmail.split("@").pop() ?? ""
    : "";
  const isStudentEmail =
    normalizedEmail.endsWith(".ac.jp") || normalizedEmail.includes(".edu");
  const passwordScore = Math.min(
    3,
    Number(password.length >= 6) +
      Number(/[a-zA-Z]/.test(password)) +
      Number(/\d/.test(password)),
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => setIntroDone(true), 2850);

    return () => window.clearTimeout(timerId);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ email, universityName });
    navigate("/mypage");
  };

  return (
    <main className="page-shell relative min-h-[calc(100vh-88px)]">
      {!introDone && (
        <section className="auth-intro" aria-hidden="true">
          <div className="auth-intro-grid" />
          <div className="auth-intro-line auth-intro-line-top">
            CAMPUS MARKET / STUDENT ONLY / TEXTBOOKS / GADGETS /
          </div>
          <div className="auth-intro-line auth-intro-line-bottom">
            SHOP / MESSAGE / HANDOFF / VERIFIED / CAMPUS MARKET /
          </div>
          <div className="auth-intro-core">
            <img src="/campusmarket-icon.png" alt="" />
            <span>CampusMarket</span>
            <strong>STUDENT ACCESS</strong>
          </div>
          <div className="auth-intro-card auth-intro-card-one">
            <span>TEXTBOOK</span>
            <strong>¥1,800</strong>
          </div>
          <div className="auth-intro-card auth-intro-card-two">
            <span>SHOP</span>
            <strong>OPEN</strong>
          </div>
          <div className="auth-intro-card auth-intro-card-three">
            <span>VERIFY</span>
            <strong>OK</strong>
          </div>
        </section>
      )}

      <div
        className={`auth-login-stage mx-auto max-w-xl overflow-hidden rounded-lg border border-campus-line bg-white shadow-soft ${
          introDone ? "is-open" : ""
        }`}
      >
        <section className="p-6 sm:p-8">
          <div className="mb-6 flex rounded-lg border border-campus-line bg-campus-soft p-1">
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`min-h-10 flex-1 rounded-lg text-sm font-bold ${
                mode === "register" ? "bg-white text-campus-blue shadow-sm" : "text-campus-muted"
              }`}
            >
              登録
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`min-h-10 flex-1 rounded-lg text-sm font-bold ${
                mode === "login" ? "bg-white text-campus-blue shadow-sm" : "text-campus-muted"
              }`}
            >
              ログイン
            </button>
          </div>

          <h2 className="text-2xl font-bold text-campus-navy">
            {mode === "register" ? "アカウント登録" : "ログイン"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-campus-muted">
            大学名とメールアドレスを入力。
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="field-label">メールアドレス</span>
              <div className="relative mt-2">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-campus-muted"
                  size={18}
                  aria-hidden="true"
                />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="field-input mt-0 pl-10"
                  type="email"
                  required
                />
              </div>
              <div
                className={`mt-2 inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-bold ${
                  isStudentEmail
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-100 text-campus-muted"
                }`}
              >
                <ShieldCheck size={14} aria-hidden="true" />
                {isStudentEmail
                  ? `${emailDomain} を学生メールとして検出`
                  : "大学メールを入れるとゲートが開きます"}
              </div>
            </label>

            <label className="block">
              <span className="field-label">パスワード</span>
              <div className="relative mt-2">
                <LockKeyhole
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-campus-muted"
                  size={18}
                  aria-hidden="true"
                />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="field-input mt-0 pl-10"
                  type="password"
                  minLength={6}
                  required
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${
                      index < passwordScore ? "bg-campus-blue" : "bg-slate-200"
                    }`}
                    aria-hidden="true"
                  />
                ))}
                <span className="inline-flex items-center gap-1 text-xs font-bold text-campus-muted">
                  <KeyRound size={13} aria-hidden="true" />
                  {passwordScore >= 3 ? "OK" : "CHECK"}
                </span>
              </div>
            </label>

            <label className="block">
              <span className="field-label">大学名</span>
              <select
                value={universityName}
                onChange={(event) => setUniversityName(event.target.value)}
                className="field-input"
              >
                {universities.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-900">
              大学メールアドレスは学生確認に使います。
            </div>

            <button type="submit" className="primary-button w-full">
              {mode === "register" ? "登録してはじめる" : "ログインする"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
