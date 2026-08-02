"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { browserSignIn } from "@/lib/auth/browserAuth";
import { ko } from "@/messages";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError(ko.auth.requiredFields);
      return;
    }

    setPending(true);
    try {
      const result = await browserSignIn({
        email: email.trim(),
        password,
      });

      if (!result.ok) {
        setError(
          result.error === "Supabase is not configured"
            ? ko.auth.supabaseMissing
            : ko.auth.loginFailed,
        );
        return;
      }

      router.replace(nextPath.startsWith("/") ? nextPath : "/");
      router.refresh();
    } catch {
      setError(ko.auth.loginFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
        >
          {ko.auth.email}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={ko.auth.emailPlaceholder}
          className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
        >
          {ko.auth.password}
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={ko.auth.passwordPlaceholder}
          className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15"
        />
      </div>

      {error ? (
        <p className="break-keep text-[13px] text-[#DC2626]" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" fullWidth disabled={pending}>
        {pending ? ko.auth.loggingIn : ko.auth.submitLogin}
      </Button>

      <p className="text-center text-[13px] text-[#64748B]">
        {ko.auth.noAccount}{" "}
        <Link
          href={`/signup${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
          className="font-semibold text-[#0F766E] hover:underline"
        >
          {ko.auth.goSignup}
        </Link>
      </p>
    </form>
  );
}
