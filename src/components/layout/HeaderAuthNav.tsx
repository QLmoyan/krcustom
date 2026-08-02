"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { browserSignOut } from "@/lib/auth/browserAuth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ko } from "@/messages";

type AuthNavState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "signedIn"; nickname: string };

type HeaderAuthNavProps = {
  compact?: boolean;
  onNavigate?: () => void;
};

const supabaseConfigured = isSupabaseConfigured();

export function HeaderAuthNav({
  compact = false,
  onNavigate,
}: HeaderAuthNavProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthNavState>(() =>
    supabaseConfigured ? { status: "loading" } : { status: "anonymous" },
  );
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!supabaseConfigured) {
      return;
    }

    let cancelled = false;
    let subscription: { unsubscribe: () => void } | null = null;

    try {
      const supabase = createClient();

      async function load() {
        try {
          const { data: userData } = await supabase.auth.getUser();
          const user = userData.user;
          if (!user) {
            if (!cancelled) setState({ status: "anonymous" });
            return;
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("nickname")
            .eq("id", user.id)
            .maybeSingle();

          if (cancelled) return;
          setState({
            status: "signedIn",
            nickname:
              profile?.nickname ||
              user.email?.split("@")[0] ||
              ko.nav.myPage,
          });
        } catch {
          if (!cancelled) setState({ status: "anonymous" });
        }
      }

      void load();

      const { data } = supabase.auth.onAuthStateChange(() => {
        void load();
      });
      subscription = data.subscription;
    } catch {
      queueMicrotask(() => {
        if (!cancelled) setState({ status: "anonymous" });
      });
    }

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, []);

  function handleLogout() {
    startTransition(async () => {
      await browserSignOut();
      setState({ status: "anonymous" });
      onNavigate?.();
      router.refresh();
      router.push("/");
    });
  }

  if (state.status === "loading") {
    return (
      <span
        className={
          compact
            ? "rounded-lg px-3 py-2.5 text-[15px] text-[#94A3B8]"
            : "inline-flex h-8 items-center px-3 text-[13px] text-[#94A3B8]"
        }
      >
        …
      </span>
    );
  }

  if (state.status === "anonymous") {
    return (
      <>
        <Link
          href="/login"
          className={
            compact
              ? "rounded-lg px-3 py-2.5 text-[15px] font-semibold text-[#0F766E] hover:bg-[#F0FDFA]"
              : undefined
          }
          onClick={onNavigate}
        >
          {compact ? (
            ko.nav.login
          ) : (
            <span className="inline-flex h-8 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white px-3 text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC]">
              {ko.nav.login}
            </span>
          )}
        </Link>
        {!compact ? (
          <Link
            href="/signup"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-[#0F766E] px-3 text-[13px] font-semibold text-white hover:bg-[#0D5F59]"
            onClick={onNavigate}
          >
            {ko.nav.signup}
          </Link>
        ) : (
          <Link
            href="/signup"
            className="rounded-lg px-3 py-2.5 text-[15px] text-[#0F172A] hover:bg-[#F8FAFC]"
            onClick={onNavigate}
          >
            {ko.nav.signup}
          </Link>
        )}
      </>
    );
  }

  return (
    <>
      <Link
        href="/profile"
        className={
          compact
            ? "rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
            : "max-w-[8rem] truncate rounded-lg px-2 py-1.5 text-[13px] font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
        }
        onClick={onNavigate}
        title={state.nickname}
      >
        {state.nickname}
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={handleLogout}
        className={
          compact
            ? "rounded-lg px-3 py-2.5 text-left text-[15px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50"
            : "inline-flex h-8 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white px-3 text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-50"
        }
      >
        {ko.nav.logout}
      </button>
    </>
  );
}
