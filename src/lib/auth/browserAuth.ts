/**
 * Browser-only auth helpers for Client Components.
 * Avoid importing authProvider / server repositories from the client bundle.
 */

import { createClient } from "@/lib/supabase/client";
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

function isConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export async function browserSignIn(
  input: SignInInput,
): Promise<AuthActionResult> {
  if (!isConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
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
    return { ok: false, error: toMessage(error) };
  }
}

export type BrowserSignUpResult = AuthActionResult & {
  sessionCreated?: boolean;
};

export async function browserSignUp(
  input: SignUpInput,
): Promise<BrowserSignUpResult> {
  if (!isConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
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
    return { ok: false, error: toMessage(error) };
  }
}

export async function browserSignOut(): Promise<AuthActionResult> {
  if (!isConfigured()) {
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
    return { ok: false, error: toMessage(error) };
  }
}
