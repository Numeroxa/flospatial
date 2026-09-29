import { supabase } from "./supabaseClient";

export const LEARNER_SYNC_SCHEMA_VERSION = "0.37";
export type LearnerSyncResult<T> = { journey: T; remoteUpdatedAt: string | null; action: "uploaded" | "merged" };

type AnyRecord = Record<string, any>;
const ARRAY_ID_KEYS = ["sessionId","responseId","competencyEvidenceId","observationId","constraintId","recommendationId","whyExplanationId","readinessSnapshotId","milestoneId","moduleProgressId","moduleCompletionId","practiceSummaryId","debriefId"];
function requireClient() { if (!supabase) throw new Error("Supabase is not configured on this deployment."); return supabase; }
function itemKey(item: any, index: number) { if (item && typeof item === "object") for (const key of ARRAY_ID_KEYS) if (item[key]) return `${key}:${item[key]}`; return `json:${JSON.stringify(item)}:${index}`; }
function unionArray(local: any[] = [], remote: any[] = []) { const map = new Map<string, any>(); remote.forEach((v,i)=>map.set(itemKey(v,i),v)); local.forEach((v,i)=>map.set(itemKey(v,i),v)); return [...map.values()]; }
function cleanJourney<T extends AnyRecord>(journey: T): T { const copy = { ...journey }; delete copy.prototypeAccount; return copy as T; }
export function mergeLearnerJourneys<T extends AnyRecord>(localInput: T, remoteInput: T): T {
  const local = cleanJourney(localInput); const remote = cleanJourney(remoteInput);
  const localNewer = String(local.updatedAt || "") >= String(remote.updatedAt || "");
  const newer = localNewer ? local : remote; const older = localNewer ? remote : local;
  const merged: AnyRecord = { ...older, ...newer };
  for (const key of Object.keys({ ...local, ...remote })) if (Array.isArray(local[key]) || Array.isArray(remote[key])) merged[key] = unionArray(local[key], remote[key]);
  merged.version = local.version || remote.version || "mvp_v1";
  merged.updatedAt = new Date().toISOString();
  return merged as T;
}
export async function syncLearnerJourney<T extends AnyRecord>(localJourney: T): Promise<LearnerSyncResult<T>> {
  const client = requireClient(); const { data: auth } = await client.auth.getUser(); const user = auth.user; if (!user) throw new Error("Sign in before synchronising progress.");
  const { data: existing, error: readError } = await client.from("learner_sync_state").select("journey,updated_at").eq("user_id", user.id).maybeSingle();
  if (readError) throw readError;
  const localClean = cleanJourney(localJourney);
  const merged = existing?.journey ? mergeLearnerJourneys(localClean, existing.journey as T) : localClean;
  const { error: writeError } = await client.from("learner_sync_state").upsert({ user_id: user.id, schema_version: LEARNER_SYNC_SCHEMA_VERSION, journey: merged, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (writeError) throw writeError;
  return { journey: merged, remoteUpdatedAt: existing?.updated_at ?? null, action: existing?.journey ? "merged" : "uploaded" };
}
