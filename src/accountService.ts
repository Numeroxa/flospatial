import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

export type AptestaAccount = { user: User; session: Session | null; username: string; firstName: string | null };

// v0.35 prototype: Supabase password auth requires an email or phone identity.
// Aptesta therefore derives a non-routable internal auth identifier from the username.
// The learner never supplies an email address. This is an implementation identifier,
// not a contact address, and must not be used for messaging or recovery.
const INTERNAL_AUTH_DOMAIN = "aptesta.local";

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}
function internalIdentifier(username: string) { return `${normalizeUsername(username)}@${INTERNAL_AUTH_DOMAIN}`; }
function requireClient() { if (!supabase) throw new Error("Supabase is not configured on this deployment."); return supabase; }

export async function createAptestaAccount(firstName: string, username: string, password: string): Promise<AptestaAccount> {
  const cleanUsername = normalizeUsername(username);
  if (cleanUsername.length < 3) throw new Error("Username must contain at least 3 letters or numbers.");
  if (password.length < 8) throw new Error("Password must contain at least 8 characters.");
  const client = requireClient();
  const { data, error } = await client.auth.signUp({
    email: internalIdentifier(cleanUsername), password,
    options: { data: { aptesta_username: cleanUsername, first_name: firstName.trim() || null, account_schema_version: "0.35" } },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Account creation did not return a user.");
  return { user: data.user, session: data.session, username: cleanUsername, firstName: firstName.trim() || null };
}

export async function signInAptesta(username: string, password: string): Promise<AptestaAccount> {
  const cleanUsername = normalizeUsername(username);
  const client = requireClient();
  const { data, error } = await client.auth.signInWithPassword({ email: internalIdentifier(cleanUsername), password });
  if (error) throw error;
  return { user: data.user, session: data.session, username: cleanUsername, firstName: (data.user.user_metadata?.first_name as string | undefined) ?? null };
}

export async function signOutAptesta() { const client = requireClient(); const { error } = await client.auth.signOut(); if (error) throw error; }
export async function getAptestaSession() { if (!supabase) return null; const { data } = await supabase.auth.getSession(); return data.session; }
export { isSupabaseConfigured };
