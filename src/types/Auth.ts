import type { UserRole } from "@/types/Role";
import type { Session, User } from "@supabase/supabase-js";

/** App-facing profile (maps from public.profiles). */
export type AppProfile = {
  id: string;
  role: UserRole;
  nickname: string;
  avatar: string | null;
  phone: string | null;
  language: string;
  demoKey: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Combined auth user + business profile. */
export type AuthUser = {
  authUserId: string;
  email: string | null;
  profile: AppProfile;
  source: "supabase" | "mock";
};

export type AuthSessionResult = {
  session: Session | null;
  user: User | null;
  source: "supabase" | "mock";
};

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  nickname?: string;
  role?: UserRole;
};

export type ResetPasswordInput = {
  email: string;
  redirectTo?: string;
};

export type AuthActionResult = {
  ok: boolean;
  error?: string;
  user?: AuthUser | null;
  /** Present after signUp when email confirmation may be required. */
  sessionCreated?: boolean;
};
