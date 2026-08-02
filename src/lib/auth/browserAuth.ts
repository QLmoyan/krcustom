/**
 * Browser-only auth helpers for Client Components.
 * Avoid importing authProvider / server repositories from the client bundle.
 */

"use client";

import { createClient } from "@/lib/supabase/client";
import {
  isSupabaseConfigured,
  SUPABASE_NOT_CONFIGURED,
} from "@/lib/supabase/env";
import type {
  AuthActionResult,
  SignInInput,
  SignUpInput,
} from "@/types/Auth";
import type { UserRole } from "@/types/Role";

function toMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Auth request failed";
}

function isMissingEnvMessage(message: string): boolean {
  return (
    message === SUPABASE_NOT_CONFIGURED ||
    message.includes("Missing environment variable: NEXT_PUBLIC_SUPABASE")
  );
}

export async function browserSignIn(
  input: SignInInput,
): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: SUPABASE_NOT_CONFIGURED };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    if (!data.user) {
      return { ok: false, error: "No user returned" };
    }

    return { ok: true };
  } catch (error) {
    const message = toMessage(error);
    return {
      ok: false,
      error: isMissingEnvMessage(message)
        ? SUPABASE_NOT_CONFIGURED
        : message,
    };
  }
}

export type BrowserSignUpResult = AuthActionResult & {
  sessionCreated?: boolean;
};

export async function browserSignUp(
  input: SignUpInput,
): Promise<BrowserSignUpResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: SUPABASE_NOT_CONFIGURED };
  }

  try {
    const supabase = createClient();
    const role: UserRole = input.role ?? "CUSTOMER";

    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          nickname: input.nickname ?? "",
          language: "ko",
          role,
        },
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    if (!data.user) {
      return { ok: false, error: "No user returned" };
    }

    return {
      ok: true,
      sessionCreated: Boolean(data.session),
    };
  } catch (error) {
    const message = toMessage(error);
    return {
      ok: false,
      error: isMissingEnvMessage(message)
        ? SUPABASE_NOT_CONFIGURED
        : message,
    };
  }
}

export async function browserSignOut(): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: true };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (error) {
    const message = toMessage(error);
    return {
      ok: false,
      error: isMissingEnvMessage(message)
        ? SUPABASE_NOT_CONFIGURED
        : message,
    };
  }
}
