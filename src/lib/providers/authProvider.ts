import {
  mockDemoCustomer,
  mockDemoSeller,
  mockCustomerProfile,
} from "@/data/mockAuth";
import * as authRepository from "@/repositories/auth";
import * as profileRepository from "@/repositories/profile";
import type {
  AuthActionResult,
  AuthSessionResult,
  AuthUser,
  AppProfile,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
} from "@/types/Auth";
import type { UserRole } from "@/types/Role";

export type AuthDataSource = "supabase" | "mock";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

/**
 * Current signed-in user + profile.
 * Unauthenticated / misconfigured → null (callers keep Demo data paths).
 * Does not invent a logged-in mock user by default.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    return await authRepository.getCurrentAuthUser();
  } catch {
    return null;
  }
}

/** Alias for getCurrentUser().profile */
export async function getCurrentProfile(): Promise<AppProfile | null> {
  const user = await getCurrentUser();
  return user?.profile ?? null;
}

/**
 * Session + raw auth user. Falls back to empty mock session when unavailable.
 */
export async function getSession(): Promise<AuthSessionResult> {
  if (!isSupabaseConfigured()) {
    return { session: null, user: null, source: "mock" };
  }

  try {
    const result = await authRepository.getSession();
    return { ...result, source: "supabase" };
  } catch {
    return { session: null, user: null, source: "mock" };
  }
}

export async function signIn(input: SignInInput): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }
  try {
    return await authRepository.signInWithPassword(input);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Sign-in failed",
    };
  }
}

export async function signUp(input: SignUpInput): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }
  try {
    return await authRepository.signUp(input);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Sign-up failed",
    };
  }
}

export async function signOut(): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: true };
  }
  try {
    return await authRepository.signOut();
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Sign-out failed",
    };
  }
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }
  try {
    return await authRepository.resetPasswordForEmail(input);
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Password reset failed",
    };
  }
}

/**
 * Demo fallback identity helpers (explicit). Used when UI needs a demo
 * actor without a real session — not returned by getCurrentUser().
 */
export function getDemoUser(role: UserRole = "CUSTOMER"): AuthUser {
  if (role === "SELLER") {
    return mockDemoSeller;
  }
  return mockDemoCustomer;
}

export function getDemoProfile(role: UserRole = "CUSTOMER"): AppProfile {
  if (role === "SELLER") {
    return mockDemoSeller.profile;
  }
  return mockCustomerProfile;
}

/**
 * Resolve profile by id for server contexts; mock fallback on failure.
 */
export async function getProfileById(
  id: string,
): Promise<{ profile: AppProfile | null; source: AuthDataSource }> {
  if (!isSupabaseConfigured()) {
    if (id === mockDemoCustomer.profile.id) {
      return { profile: mockCustomerProfile, source: "mock" };
    }
    if (id === mockDemoSeller.profile.id) {
      return { profile: mockDemoSeller.profile, source: "mock" };
    }
    return { profile: null, source: "mock" };
  }

  try {
    const profile = await profileRepository.getById(id);
    if (profile) {
      return { profile, source: "supabase" };
    }
  } catch {
    // fall through
  }

  if (id === mockDemoCustomer.profile.id) {
    return { profile: mockCustomerProfile, source: "mock" };
  }
  if (id === mockDemoSeller.profile.id) {
    return { profile: mockDemoSeller.profile, source: "mock" };
  }
  return { profile: null, source: "mock" };
}

/** Current actor context for provider filtering (null = anonymous Demo). */
export type CurrentActorContext = {
  profileId: string;
  role: UserRole;
  source: AuthDataSource;
} | null;

export async function getCurrentActorContext(): Promise<CurrentActorContext> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return {
    profileId: user.profile.id,
    role: user.profile.role,
    source: user.source,
  };
}
