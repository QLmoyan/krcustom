"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { signUpAction } from "@/lib/auth/actions";
import { SUPABASE_NOT_CONFIGURED } from "@/lib/supabase/env";
import { ko } from "@/messages";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim() || !password || !passwordConfirm) {
      setError(ko.auth.requiredFields);
      return;
    }
    if (password.length < 6) {
      setError(ko.auth.passwordTooShort);
      return;
    }
    if (password !== passwordConfirm) {
      setError(ko.auth.passwordMismatch);
      return;
    }

    setPending(true);
    try {
      const result = await signUpAction({
        email: email.trim(),
        password,
        nickname: nickname.trim() || undefined,
        role: "CUSTOMER",
      });

      if (!result.ok) {
        setError(
          result.error === SUPABASE_NOT_CONFIGURED
            ? ko.auth.supabaseMissing
            : result.error || ko.auth.signupFailed,
        );
        return;
      }

      if (!result.sessionCreated) {
        setInfo(ko.auth.signupCheckEmail);
        return;
      }

      router.replace(nextPath.startsWith("/") ? nextPath : "/");
      router.refresh();
    } catch {
      setError(ko.auth.signupFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      <div>
        <label
          htmlFor="signup-email"
          className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
        >
          {ko.auth.email}
        </label>
        <input
          id="signup-email"
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
          htmlFor="signup-nickname"
          className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
        >
          {ko.auth.nickname}
        </label>
        <input
          id="signup-nickname"
          name="nickname"
          type="text"
          autoComplete="nickname"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder={ko.auth.nicknamePlaceholder}
          className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15"
        />
      </div>

      <div>
        <label
          htmlFor="signup-password"
          className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
        >
          {ko.auth.password}
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={ko.auth.passwordPlaceholder}
          className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15"
        />
      </div>

      <div>
        <label
          htmlFor="signup-password-confirm"
          className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
        >
          {ko.auth.passwordConfirm}
        </label>
        <input
          id="signup-password-confirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          placeholder={ko.auth.passwordPlaceholder}
          className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15"
        />
      </div>

      {error ? (
        <p className="break-keep text-[13px] text-[#DC2626]" role="alert">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="break-keep text-[13px] text-[#0F766E]" role="status">
          {info}
        </p>
      ) : null}

      <Button type="submit" size="lg" fullWidth disabled={pending}>
        {pending ? ko.auth.signingUp : ko.auth.submitSignup}
      </Button>

      <p className="text-center text-[13px] text-[#64748B]">
        {ko.auth.hasAccount}{" "}
        <Link
          href={`/login${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
          className="font-semibold text-[#0F766E] hover:underline"
        >
          {ko.auth.goLogin}
        </Link>
      </p>
    </form>
  );
}
