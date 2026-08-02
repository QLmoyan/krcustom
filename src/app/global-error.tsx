"use client";

import Link from "next/link";
import { ko } from "@/messages";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8FAFC",
          color: "#0F172A",
          fontFamily:
            '"Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif',
        }}
      >
        <main style={{ padding: 24, textAlign: "center", maxWidth: 420 }}>
          <title>{ko.system.errorTitle}</title>
          <p style={{ color: "#0F766E", fontWeight: 600, fontSize: 13 }}>
            {ko.brand.name}
          </p>
          <h1 style={{ marginTop: 8, fontSize: 22 }}>{ko.system.errorTitle}</h1>
          <p
            style={{
              marginTop: 12,
              color: "#64748B",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {ko.system.errorDescription}
          </p>
          {error.digest ? (
            <p style={{ marginTop: 8, color: "#94A3B8", fontSize: 11 }}>
              {error.digest}
            </p>
          ) : null}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 8,
                border: "none",
                background: "#0F766E",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {ko.system.errorRetry}
            </button>
            <Link
              href="/"
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 8,
                border: "1px solid #CBD5E1",
                background: "#fff",
                color: "#0F172A",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              {ko.system.errorHome}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
