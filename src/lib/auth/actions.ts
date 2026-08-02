"use server";

import {
  signIn as providerSignIn,
  signUp as providerSignUp,
} from "@/lib/providers/authProvider";
import type {
  AuthActionResult,
  SignInInput,
  SignUpInput,
} from "@/types/Auth";

/** Server Action: real Supabase email/password sign-in via Provider → Repository. */
export async function signInAction(
  input: SignInInput,
): Promise<AuthActionResult> {
  return providerSignIn(input);
}

/** Server Action: real Supabase email/password sign-up via Provider → Repository. */
export async function signUpAction(
  input: SignUpInput,
): Promise<AuthActionResult> {
  return providerSignUp(input);
}
