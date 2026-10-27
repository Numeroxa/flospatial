# Aptesta v0.44.20 — Pilot 2 implementation review

Prepared for product-owner review before merge or deployment. No content substitutions were made.

## Baseline and working state

- Repository: `Numeroxa/flospatial`.
- Authoritative baseline: `main`, v0.44.19, commit `2065282637d1407a1b41f16b6b73aa33884b5b72`.
- Read-only GitHub `ls-remote` verification matched this checkout before changes; initial Git status was clean.
- Feature branch: `pilot-2-instrumentation`, in the existing `audit-source` checkout. No separate worktree was necessary.
- Proposed working-tree version: **v0.44.20 — Pilot 2 Instrumentation**, reflected in package version and build label.
- `DEVELOPMENT_HANDOVER.md` was read and followed. Its recorded v0.44.18 creation baseline was treated as historical; implementation started from the verified v0.44.19 baseline.
- Changes remain uncommitted for review. Nothing was pushed, merged or deployed. No later release work was started.

## Files changed or added

| File | Purpose |
|---|---|
| `package.json` | Version 0.44.19 → 0.44.20 only; dependency declarations unchanged |
| `src/App.tsx` | Optional response telemetry, shared capture hook, Independent submission behaviour, Check capture, CSV download controls, release label, small interaction-copy updates and Verbal shortcut correction |
| `src/pilot2Telemetry.ts` | Typed optional telemetry additions, pure first/final capture and CSV generation |
| `src/learnerSyncService.ts` | Prefer response ID over session ID when merging response arrays; necessary to preserve multiple answers from one session |
| `tests/pilot2.cjs` | Interaction, telemetry, persistence, export, frozen-content and recommendation regression checks using the existing TypeScript dependency |
| `reports/pilot2-duplication-audit.md` | Complete cross-domain audit with 38 comparison rows and 108 baseline question records |
| `reports/pilot2-implementation-review.md` | This report |

No question arrays, Fundamentals teaching material, answer keys, explanations, diagrams, recommendation thresholds, Verbal selection IDs or 3×4 category balance were changed. The automated regression compares every pre-existing top-level authored data constant (except the release label), every active bank exported by the test, and all `complete*`, `calculate*` and `weakest*` functions against the baseline. The read-only duplication report gives recommendations only.

## Existing telemetry inspection and field mapping

The existing `AssessmentResponse` already provided response ID, question ID, session ID, final selected option (`selectedOptionId`), final correctness (`correct`), legacy response time (`responseTimeMs`), unsure flag and `answeredAt`. It also had optional timing-basis/version/device fields, and `firstActionTimeMs` in selected flows. Existing session records provide session type, question IDs and start/completion timestamps. Question objects provide domain, subcompetency, option text and correct option ID.

Pilot 2 reuses that response/session architecture; it does not introduce a parallel response database.

| Required measure | Stored field / derivation |
|---|---|
| Participant | Existing pseudonymous `guestJourneyId`, exported as `participant_journey_id` |
| Session ID/type | Existing response `sessionId`, joined to session `sessionType` |
| Domain | New optional response `domain`, with bank fallback for legacy CSV rows |
| Subcompetency | New optional response `subcompetency`, with bank fallback |
| Question ID | Existing `questionId` |
| Presentation timestamp | New optional `questionPresentedAt` (ISO timestamp) |
| First selected option | New optional `firstSelectedOptionId` |
| First-selection timestamp | New optional `firstSelectionAt` (ISO timestamp) |
| Final submitted option | Existing `selectedOptionId` |
| Submission timestamp | New optional `finalSubmissionAt` (ISO timestamp); `answeredAt` also remains |
| Answer-change count | New optional `answerChangeCount`; counts actual changes to a different option, not repeated taps on the same option |
| Time to first selection | New optional `firstSelectionTimeMs`; also copied into existing `firstActionTimeMs` |
| Total question time | New optional `totalQuestionTimeMs`; excludes post-submission teaching/review time |
| Final correctness | Existing `correct`, calculated from final submitted option |
| Whether changed | CSV derives `answerChangeCount > 0` |
| First correctness | CSV compares first option ID with the source question answer key |
| Correctness transition | CSV emits `incorrect_to_correct`, `correct_to_incorrect`, `correct_to_correct`, or `incorrect_to_incorrect` |
| Capture version | Existing optional `telemetryVersion` set to `pilot2-v0.44.20` |
| Timing basis/device | Existing `responseTimeBasis` and `deviceClass`; adds `submission_latency` to the timing-basis union |

Durations use a monotonic clock; timestamps use the wall clock. Capture resets on session/question index changes. The first answer/time remain fixed, changes accumulate, and submission freezes a single response. Time includes ordinary time with the question displayed, including background/idle time; no focus adjustment or speed interpretation was added.

`responseTimeMs` retains first-selection semantics for Hydraulic and Gear Independent, preserving existing selection-latency evidence. Other instrumented screens store total-to-submission time there. The explicit Pilot 2 fields are the consistent cross-domain analysis columns. Pilot 2 uses its own telemetry-version value, so it is not silently treated as the pre-existing versioned Gear fluency timing evidence. No timing-based behavioural recommendation or new speed scoring was introduced; existing recommendation/scoring functions are unchanged.

## Response behaviour and coverage

Instrumented Independent screens: Hydraulic, Gear, Pulley, Lever, Numerical, Abstract/Logical and Verbal. Instrumented Checks: Gear, Pulley, Lever, Numerical, Abstract/Logical, Verbal and Mixed Mechanical. There is no separate Hydraulic Check screen; hydraulics is included in Mixed Mechanical.

- **Guided:** selection still locks immediately; teaching feedback/explanation remains immediate; progression remains available.
- **Independent before submission:** all options remain available and editable. No correctness or explanation is revealed.
- **Independent Next/Complete:** commits and saves the final response immediately, freezes telemetry and reveals the existing per-question teaching feedback. Continuing from that feedback advances to the next question (or debrief on the final item). The same response ID is reused/deduplicated, so feedback does not create a second response or extend timing.
- **Check Next/Finish:** options remain editable beforehand. Next/Finish saves the final response and advances without revealing immediate correctness or explanation.
- **Review:** existing review shows the final `selectedOptionId`, correct answer and explanation. Optional incorrect/all review remains.

The existing mixed mechanical teaching-practice screen, Gear fluency prototype, Starting Point, Fundamentals and separate calibration/technical/empirical pilot laboratories were not reclassified as Independent or rewritten. The laboratories retain their existing instrumentation and separate exports. Pilot 2 here measures the normal learner-pathway Independent/Check sessions, not a new calibration-bank form.

No countdown, visible timing pressure, learner-facing answer-change coaching or analytics dashboard was added. Independent intro labels now say feedback follows submission so the interaction description matches the implementation; question/teaching content is unchanged.

## Persistence, compatibility and sync correction

All new response fields are optional. Older local journey JSON remains readable; no local migration or reset is required. Legacy answers remain in scoring/review. Their unavailable first-answer/timestamp fields are left blank on export rather than fabricated. The existing local storage key and journey version remain unchanged.

No Supabase schema, configuration, authentication API, credentials or exact `@supabase/supabase-js` **2.57.4** dependency pin was changed. The existing cloud sync stores the journey as JSON, so optional response fields do not require a database migration. The existing sync schema marker remains 0.38.

A storage regression check identified an existing issue in `learnerSyncService.ts`: `itemKey` checked `sessionId` before `responseId`. Since every answer carries the session ID, a sync merge could collapse many responses into one. This would directly compromise Pilot 2 data. The minimal correction moves `responseId` ahead of `sessionId`; other merge behaviour is retained. Tests confirm that 24 distinct answers from the same session survive an idempotent merge and preserve telemetry, and that a legacy response can coexist with a newly instrumented response.

This is the one necessary supporting account-storage change to the instrumentation scope. It is not a schema/authentication change. It cannot reconstruct answers already lost from both local and remote data by earlier merges. Live cloud round trips were not exercised because no pilot account/database operation was needed or performed; JSON merge behaviour was tested locally.

Unsubmitted edits remain temporary until Next/Complete, as specified. Local progress can still be cleared using existing product behaviour; export pilot data before clearing/replacing a journey. No additional persistent event log was introduced.

## Export and analysis use

Open **Tester tools → Export Pilot 2 journey CSV** from the landing page or dashboard. The browser downloads `aptesta-pilot2-<guestJourneyId>.csv` for the current locally loaded journey. Export again after later sessions; the stable `response_id` permits external deduplication.

The CSV includes participant journey ID; session ID/type and stage; session timestamps; response/question IDs; domain/subcompetency; first/final option IDs and their texts; presentation/selection/submission timestamps; first/final correctness; transition; change count/change flag; first-selection/total time; legacy response time; capture version and classification. It quotes fields, escapes quotes, uses CRLF and a UTF-8 BOM, and neutralises formula-like text for spreadsheet use.

All existing journey responses are included for traceability. `capture_kind=pilot2` identifies instrumented rows; `legacy_or_uninstrumented` identifies other rows. Starting Point and Guided responses therefore retain their original final-answer information but do not pretend to have Pilot 2 first/final capture. Unknown/removed question IDs still export a row with available stored data. First correctness/option text for such a missing question may be blank because the answer key is resolved from the current bank.

For Pilot 2 response analyses, filter to `capture_kind=pilot2` and the intended stage/session. The participant identifier is the existing device journey ID, not a new assigned human participant code. Maintain an external participant-code ↔ journey-ID mapping when study operations need it; clearing progress, changing device or loading a synthetic Tester journey may change that ID. Cross-device identity should not be inferred from different guest IDs without that mapping. Tester shortcuts contain synthetic evidence and must not be mixed into learner measurements. No new personal-data field was added.

## Verbal Tester Tool correction

`createVerbalIndependentStrongDemoJourney` now uses `index < 10` instead of the stale `index < 22`. The active 12-item set therefore simulates **10/12 (83.3%)**, a clear strong result, and recommends `begin_verbal_assessment`. The test asserts the score, item count and resulting recommendation. No other Tester Tool scenario or Verbal content was changed, apart from adding the requested general export control to existing Tester Tools.

## Duplication audit

See [the complete cross-domain audit](pilot2-duplication-audit.md). It covers every Starting Point item, distinguishes identical/near-identical items from expected shared archetypes, assesses exposure risk and provides retain / revise-later / replace-before-Pilot-2 recommendations. It includes the known Verbal overlaps:

- `START-VER-003` ↔ `VER-A-003`: identical learner problem.
- `START-VER-005` ↔ `VER-A-006`: same passage/stem and answer, one distractor wording difference; materially near-identical.
- `START-VER-002` ↔ `VER-A-002`: near-identical concise definition/item.

The report also identifies Mechanical, Numerical and Abstract/Logical candidates. All 108 baseline question records are attached within that report as source evidence. **No replacement or rewrite has been made.** Product-owner decisions are still required for those recommendations before any content work.

## Validation results and limits

- TypeScript type check: passed.
- Production Vite build: passed; existing large-bundle warning remains (approximately 1.27 MB minified JS; no unrelated splitting/refactor attempted).
- 21 actual component/stage interaction scenarios: seven Independent, seven Check and seven Guided. Verified first/final answer retention, repeated taps, real answer-change counts, monotonic first/submission time, final-answer scoring, feedback visibility and Guided locking.
- Seven actual parent Independent handlers: tested both ordinary and final-item paths; first Next persists without advancing, Continue advances/completes without duplicating the response.
- Pure capture/export checks: all four first/final correctness transitions; multiple changes; frozen submission; legacy export rows; no fabricated legacy telemetry.
- Legacy local persistence: passed. Legacy/new JSON merge and idempotent 24-answer same-session sync: passed.
- Frozen-content and logic regressions: all pre-existing top-level authored constants (except build label), active banks, and `complete*` / `calculate*` / `weakest*` functions match baseline. This covers Starting Point, Fundamentals data, all four pathways and recommendation thresholds. Mechanical diagram implementations were unchanged in the diff.
- Isolated Edge browser end-to-end tests at **390×844 with mobile/touch emulation** and **1280×900 desktop**: completed all 12 Independent Verbal questions and all 12 Verbal Check questions; changed answers; checked persistence before feedback continuation; reviewed the final incorrect answer; scored final answers; downloaded CSV. Each run produced 24 unique Pilot 2 responses, 23 correct in the deliberately configured test, with no browser JavaScript errors. CSV contained all 24 instrumented rows.
- Phone screenshot inspected before submission: readable options, no horizontal overflow, editable selected option and reachable Next. Post-submission screenshot recorded separately.
- Automated component/parent-handler checks cover all instrumented domains. Full browser completion was performed for Verbal, not every possible pathway/account route. Physical iPhone/Android Safari/Chrome testing and live authenticated cross-device round trips remain product-owner validation steps; they are not claimed as completed here.
- No database operation, production deployment or real learner-data collection was used for these checks. Browser fixtures/exports are synthetic validation artifacts only.

Run the repository regression test after installing its existing dependencies: `node tests/pilot2.cjs`. Build using the existing `build` script. No test framework or dependency declaration was added. Temporary installed dependencies and generated preview output were kept out of the proposed source changes.

## Review handoff

The requested implementation and audit are prepared for review on `pilot-2-instrumentation`. The sync identity correction is explicitly reported above as technically necessary to reliable capture. Remaining limitations are physical-device/live-cloud validation, participant-to-journey mapping for external analysis, legacy data gaps, and the unchanged Starting Point ↔ Check overlaps awaiting product-owner content decisions.

No content substitution, dependency upgrade, Supabase schema/configuration change, unrelated redesign, commit, push, merge or deployment was performed. Stop here for product-owner review; do not start the next release or implement duplication-audit recommendations without further instruction.
