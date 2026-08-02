import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { mapProfileRow } from "@/repositories/profile/map";
import type {
  AuthActionResult,
  AuthUser,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
} from "@/types/Auth";
import type { ProfileRow } from "@/types/database";
import type { UserRole } from "@/types/Role";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function toMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Auth request failed";
}

async function fetchProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProfileRow(data as ProfileRow) : null;
}

async function toAuthUser(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<AuthUser | null> {
  const profile = await fetchProfile(supabase, user.id);
  if (!profile) {
    return null;
  }

  return {
    authUserId: user.id,
    email: user.email ?? null,
    profile,
    source: "supabase",
  };
}

/** Cookie session (may be stale); prefer getUser for identity checks. */
export async function getSession(): Promise<{
  session: Session | null;
  user: User | null;
}> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return {
    session: data.session,
    user: data.session?.user ?? null,
  };
}

/** Server-validated auth user. */
export async function getUser(): Promise<User | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return data.user;
}

export async function getCurrentProfile() {
  const user = await getUser();
  if (!user) {
    return null;
  }
  const supabase = await createServerClient();
  return fetchProfile(supabase, user.id);
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const user = await getUser();
  if (!user) {
    return null;
  }
  const supabase = await createServerClient();
  return toAuthUser(supabase, user);
}

/** Browser: email/password sign-in. */
export async function signInWithPassword(
  input: SignInInput,
): Promise<AuthActionResult> {
  try {
    const supabase = createBrowserClient();
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

    return {
      ok: true,
      user: await toAuthUser(supabase, data.user),
    };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

/** Browser: email/password register (profile via auth trigger). */
export async function signUp(input: SignUpInput): Promise<AuthActionResult> {
  try {
    const supabase = createBrowserClient();
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
      user: await toAuthUser(supabase, data.user),
    };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

/** Browser: sign out and clear auth cookies. */
export async function signOut(): Promise<AuthActionResult> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

/** Browser: send password-reset email. */
export async function resetPasswordForEmail(
  input: ResetPasswordInput,
): Promise<AuthActionResult> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: input.redirectTo,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}
