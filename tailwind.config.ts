import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: "#172033",
          blue: "#2563eb",
          violet: "#7c3aed",
          cyan: "#0891b2",
          mint: "#16a34a",
          ink: "#1f2937",
          muted: "#667085",
          line: "#e4e7ec",
          soft: "#f7f9fc",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(31, 41, 55, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
