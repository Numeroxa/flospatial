# Aptesta v0.44.20 — Starting Point amendment completion report

**Prepared on `pilot-2-instrumentation` for product-owner review. Exactly 13 Starting Point questions changed. The reviewed Pilot 2 instrumentation remains intact. No commit, push, merge or deployment was performed.**

## Baseline, scope and working state

Repository `Numeroxa/flospatial`; production ancestor v0.44.19 commit `2065282637d1407a1b41f16b6b73aa33884b5b72`. Work continued in the existing uncommitted v0.44.20 feature branch and checkout; it was not recreated, reset or replaced. Package version remains 0.44.20. Before amendment, the existing application and runtime hashes were recorded so this amendment could be tested separately from the earlier instrumentation diff.

`DEVELOPMENT_HANDOVER.md` applies throughout. The new user amendment authorizes only the listed Starting Point substitutions plus validation/reporting. All downstream curriculum, diagrams, instrumentation and account/progress code remain frozen.

## Files changed by this amendment

- `src/App.tsx`: exactly 13 `makeStartingQuestion` calls, within the existing Starting Point array. No surrounding logic or other runtime code changed.
- `tests/pilot2.cjs`: retain all existing tests; narrowly exempt the authorized Starting Point declaration from the original v0.44.19 equality assertion and invoke the more specific replacement/retention and v0.44.20 preservation tests instead.
- `tests/starting-point-amendment.cjs`: replacement scope, classification, keys/solvers, Starting Point scoring/recommendation and reviewed-runtime checks.
- `tests/fixtures/pilot2-reviewed-runtime-hashes.json`: fingerprints of the reviewed instrumentation state, with only the Starting Point declaration excluded in App.tsx; every other runtime file is checked byte-for-byte.
- `reports/pilot2-starting-point-amendment-audit.md`: updated complete cross-domain audit with full current 108-record question evidence.
- `reports/pilot2-starting-point-comparison-matrix.csv`: all 584 within-domain Starting Point ↔ Check comparisons.
- `reports/pilot2-starting-point-amendment-review.md`: this completion report.

The older instrumentation review and pre-amendment audit are preserved as historical reports. This review and the updated audit supersede their Starting Point-content statements for the current working tree. Temporary dependencies, browser fixtures/screenshots and build output are not proposed source changes.

## Exact 13 replacements and preserved constructs

All 13 existing question IDs, domain/subcompetency/concept metadata, foundational difficulty labels, pathway/session metadata, positions and the 26-question count are retained. All 13 unlisted Starting Point questions remain logically identical to the baseline, including `START-NUM-006`.

| Question ID | Old problem | New problem | Preserved skill / material novelty | New displayed key |
|---|---|---|---|---|
| START-MECH-003 | Known clockwise driver → name other gear direction | Judge a possible pair of directions for a direct external mesh, viewed from the same side | Direct gear-mesh direction; inverse consistency task rather than named-output prediction | C — One clockwise and the other anticlockwise |
| START-MECH-005 | State the main effect of a fixed pulley | Find the holding effort for a 75 N load on one fixed pulley | Fixed-pulley principle; force equality rather than main-effect recognition | D — 75 N |
| START-MECH-006 | Three supporting sections → MA=3 | Compare required effort after re-rigging four supporting sections to two | Supporting strands / ideal MA; change across two configurations rather than a repeated static count | D — It doubles |
| START-MECH-007 | Select long-effort/short-load arrangement for maximum force advantage | Move only effort point 30→60 cm, fixed pivot/load; determine effort change | Lever force advantage; one changing arm rather than same arrangement-choice distractors | A — Half as much |
| START-MECH-008 | 300 N at 0.5 m, effort at 1.5 m → 100 N | 90 N at 1.6 m, effort opposite at 0.8 m → 180 N | Moment balance; effort arm now shorter than load arm, reversing advantage rather than rescaling old geometry | B — 180 N |
| START-NUM-005 | 240 km / 4 h → average speed 60 km/h | Given conveyor speed 3 m/s, find distance in 5 s → 15 m | Rate/speed reasoning; given rate, solve distance by multiplication, not another average-speed quotient | B — 15 metres |
| START-ABS-001 | Clockwise quarter-turn arrow cycle | Repeated half-turn arrow cycle ↑↓↑↓? | Rotation; genuinely different constant angle/rule, not a shifted quarter-turn cycle | C — ↑ |
| START-ABS-002 | Alternating shapes with count +1 every term | Interleaved numeric sequences 2,9,4,8,6,? | Two-rule sequence; odd positions +2 and even positions −1, not shape substitutions | A — 7 |
| START-ABS-003 | Concatenate/union first two cells | Retain only symbol common to first two cells | Combination rule / matrices; intersection instead of union | B — ■ |
| START-ABS-005 | All helmets equipment; no equipment living → exclusion | All upper-shelf items labelled; some batteries upper-shelf → some batteries labelled | Syllogism; universal-positive plus existential-positive structure, not nouns changed in the old all/no proposition | C — Some spare batteries are labelled |
| START-VER-002 | Concise means brief but complete in instructions passage | Cover means work another crew’s shift in roster message | Meaning in context; new polysemous word, text, situation and option meanings | A — Work the shift in place of another crew |
| START-VER-003 | 18:20 arrival triggers west-entrance instruction | Unattended desk triggers secured key-return-box instruction | Conditional instruction; new condition/action/prohibition, no entrance or time threshold reused | C — Place the keys in the secured return box |
| START-VER-005 | Failed gauge replaced before training → failed gauge not used | All chairs occupied, stand until vacancy → no chair initially available | Supported inference; new waiting-room evidence and inference, no replacement-equipment paraphrase | C — No chair was available when Talia first arrived |

These remain short, foundational tasks with four distinct options and one keyed answer. No new diagram code was introduced: Mechanical replacements are text-based; Abstract uses the existing sequence/matrix renderer. Mechanical gear directions explicitly use a common viewing side. The lever balance reverses the old arm relationship. Numeric arithmetic remains small; Abstract two-rule inference uses short independent number strands rather than longer Check integration. Difficulty equivalence is a reasoned design judgment, not an empirical calibration claim.

## Complete replacement content and answer review

Displayed options and keys below are after the unchanged ID-based rotation. Option order must not be inferred from the authored A/B/C/D argument. Each explanation was checked against the physical relation, pattern/logical model or passage.

### START-MECH-003

Metadata: `mechanical` / `gears` / `direct_mesh_direction`.

**Question:** Two external gears mesh directly without slipping. Viewed from the same side, which pair of rotation directions is possible?

- A (`START-MECH-003-A`): Both clockwise
- B (`START-MECH-003-B`): Both anticlockwise
- C (`START-MECH-003-C`): One clockwise and the other anticlockwise
- D (`START-MECH-003-D`): One rotating while the other remains stationary

**Correct:** C — One clockwise and the other anticlockwise

**Explanation:** At the contact, the teeth must move together. Directly meshed external gears therefore rotate in opposite directions; neither same-direction pair nor one turning against a stationary gear is possible.

**Why alternatives are not correct:** Same-direction pairs violate external mesh reversal. One rotating against a stationary meshed gear is incompatible with no slipping.

### START-MECH-005

Metadata: `mechanical` / `pulleys` / `fixed_pulley`.

**Question:** A single ideal pulley is fixed to the ceiling. A 75 N load hangs from one end of its rope and is held still by a downward pull on the other end. What pull is needed?

- A (`START-MECH-005-A`): 150 N
- B (`START-MECH-005-B`): 0 N
- C (`START-MECH-005-C`): 37.5 N
- D (`START-MECH-005-D`): 75 N

**Correct:** D — 75 N

**Explanation:** A fixed pulley redirects the pull but provides no ideal force advantage. One rope section supports the load, so holding a 75 N load requires a 75 N pull.

**Why alternatives are not correct:** 37.5 N incorrectly gives a fixed pulley a 2:1 force advantage; 150 N doubles rather than balances the load; 0 N ignores the load.

### START-MECH-006

Metadata: `mechanical` / `pulleys` / `supporting_strands`.

**Question:** An ideal hoist is re-rigged so that two rope sections support the moving load instead of four. To lift the same load, what happens to the required effort?

- A (`START-MECH-006-A`): It becomes four times as large
- B (`START-MECH-006-B`): It halves
- C (`START-MECH-006-C`): It stays the same
- D (`START-MECH-006-D`): It doubles

**Correct:** D — It doubles

**Explanation:** Ideal mechanical advantage equals the number of supporting rope sections. Reducing it from four to two halves the advantage, so the effort needed for the same load doubles.

**Why alternatives are not correct:** Halving effort reverses the support/effort relationship; unchanged effort ignores reduced MA; quadrupling mistakes the 4→2 change for a factor of four.

### START-MECH-007

Metadata: `mechanical` / `levers` / `easiest_setup`.

**Question:** A lever has a fixed pivot and a fixed load position. The effort is applied at right angles to the bar. If the effort point is moved from 30 cm to 60 cm from the pivot, what effort is needed to lift the same load ideally?

- A (`START-MECH-007-A`): Half as much
- B (`START-MECH-007-B`): The same amount
- C (`START-MECH-007-C`): Twice as much
- D (`START-MECH-007-D`): Four times as much

**Correct:** A — Half as much

**Explanation:** Doubling the effort arm doubles the turning effect of each unit of effort. With the load arm unchanged, half the effort produces the same load-balancing moment.

**Why alternatives are not correct:** Unchanged effort ignores the doubled arm; doubling or quadrupling effort applies the relationship in the wrong direction.

### START-MECH-008

Metadata: `mechanical` / `levers` / `moment_balance`.

**Question:** A 90 N load acts 1.6 m to the right of a pivot. A downward effort acts 0.8 m to the left. What effort balances the lever?

- A (`START-MECH-008-A`): 90 N
- B (`START-MECH-008-B`): 180 N
- C (`START-MECH-008-C`): 72 N
- D (`START-MECH-008-D`): 45 N

**Correct:** B — 180 N

**Explanation:** The load moment is 90 N × 1.6 m = 144 N·m. Balance requires effort × 0.8 m = 144 N·m, so the effort is 180 N. Its arm is half as long as the load arm, so twice the force is sensible.

**Why alternatives are not correct:** 45 N reverses the arm ratio; 90 N ignores unequal arms; 72 N uses load×effort-arm without balancing/dividing by the other arm. Only 180×0.8 equals 90×1.6.

### START-NUM-005

Metadata: `numerical` / `rates_proportion` / `unit_rate`.

**Question:** A conveyor moves parcels at a constant speed of 3 metres per second. How far does a parcel move in 5 seconds?

- A (`START-NUM-005-A`): 8 metres
- B (`START-NUM-005-B`): 15 metres
- C (`START-NUM-005-C`): 5 metres
- D (`START-NUM-005-D`): 0.6 metres

**Correct:** B — 15 metres

**Explanation:** Distance equals speed × time. At 3 metres each second for 5 seconds, the parcel moves 3 × 5 = 15 metres.

**Why alternatives are not correct:** 0.6 divides speed by time; 8 adds unlike quantities; 5 repeats the time as a distance. Only 3×5 gives the distance in metres.

### START-ABS-001

Metadata: `abstract_logical` / `pattern_sequences` / `rotation`.

**Stimulus:**

```json
{
  "kind": "sequence",
  "rows": [
    [
      "↑",
      "↓",
      "↑",
      "↓",
      "?"
    ]
  ]
}
```

**Question:** Which arrow completes the sequence?

- A (`START-ABS-001-A`): ↓
- B (`START-ABS-001-B`): →
- C (`START-ABS-001-C`): ↑
- D (`START-ABS-001-D`): ←

**Correct:** C — ↑

**Explanation:** The arrow makes a half-turn (180°) each step: up, down, up, down, then up again.

**Why alternatives are not correct:** Left/right arrows would introduce a quarter-turn inconsistent with the displayed half-turns; down repeats the preceding arrow.

### START-ABS-002

Metadata: `abstract_logical` / `pattern_sequences` / `two_rule_sequence`.

**Stimulus:**

```json
{
  "kind": "sequence",
  "rows": [
    [
      "2",
      "9",
      "4",
      "8",
      "6",
      "?"
    ]
  ]
}
```

**Question:** What number comes next?

- A (`START-ABS-002-A`): 7
- B (`START-ABS-002-B`): 8
- C (`START-ABS-002-C`): 10
- D (`START-ABS-002-D`): 6

**Correct:** A — 7

**Explanation:** Read alternate positions as two separate sequences. The first, third and fifth numbers are 2, 4, 6, increasing by 2. The second and fourth are 9, 8, decreasing by 1, so the sixth number is 7.

**Why alternatives are not correct:** 8 repeats the previous even-position value or follows the wrong strand; 10 continues neither decreasing-even rule; 6 repeats the last odd-position term. The even strand uniquely continues 9,8,7 under the displayed pair of simple rules.

### START-ABS-003

Metadata: `abstract_logical` / `matrices_rules` / `combination_rule`.

**Stimulus:**

```json
{
  "kind": "matrix",
  "rows": [
    [
      "▲●",
      "●■",
      "●"
    ],
    [
      "◆■",
      "■▲",
      "?"
    ]
  ]
}
```

**Question:** Each row uses the same rule. What belongs in the missing cell?

- A (`START-ABS-003-A`): ◆
- B (`START-ABS-003-B`): ■
- C (`START-ABS-003-C`): ▲
- D (`START-ABS-003-D`): ◆■▲

**Correct:** B — ■

**Explanation:** The third cell keeps only the symbol shared by the first two cells. The first row shares ●; the second row shares ■. Combining all symbols would include symbols that are not shared.

**Why alternatives are not correct:** The all-symbol option uses union rather than the demonstrated intersection. Diamond and triangle each occur in only one of the two second-row input cells.

### START-ABS-005

Metadata: `abstract_logical` / `deductive_reasoning` / `syllogism`.

**Question:** Every item on the upper shelf is labelled. Some spare batteries are on the upper shelf. Which statement must be true?

- A (`START-ABS-005-A`): All labelled items are spare batteries
- B (`START-ABS-005-B`): All spare batteries are labelled
- C (`START-ABS-005-C`): Some spare batteries are labelled
- D (`START-ABS-005-D`): No labelled items are on the upper shelf

**Correct:** C — Some spare batteries are labelled

**Explanation:** The spare batteries on the upper shelf are among the items that must be labelled. Therefore some spare batteries are labelled. The statements do not place every spare battery there or say that all labelled items are batteries.

**Why alternatives are not correct:** All batteries labelled is not guaranteed; no labelled upper-shelf items contradicts the premises; all labelled items batteries reverses/overgeneralizes the relation. Finite-model tests identify only the existential conclusion as guaranteed.

### START-VER-002

Metadata: `verbal` / `inference_context` / `meaning_in_context`.

**Roster message:** The reserve team will cover the afternoon shift so that the morning crew can attend a training session.

**Question:** What does cover mean in this message?

- A (`START-VER-002-A`): Work the shift in place of another crew
- B (`START-VER-002-B`): Keep the shift times secret
- C (`START-VER-002-C`): Shorten the afternoon shift
- D (`START-VER-002-D`): Put a roof over the workplace

**Correct:** A — Work the shift in place of another crew

**Explanation:** The reserve team is taking over the afternoon work while the morning crew attends training. In this context, cover means work the shift in place of another crew.

**Why alternatives are not correct:** Keeping times secret, shortening the shift or physically roofing the workplace does not describe the reserve team replacing working crew while they train.

### START-VER-003

Metadata: `verbal` / `instructions_sequence` / `conditional_instruction`.

**Key return instructions:** Hand borrowed keys to a staff member at the desk. If the desk is unattended, place the keys in the secured return box beside it. Never use the outside mail slot.

**Question:** A candidate returns borrowed keys while the desk is unattended. What should they do?

- A (`START-VER-003-A`): Leave the keys on the desk
- B (`START-VER-003-B`): Put the keys through the outside mail slot
- C (`START-VER-003-C`): Place the keys in the secured return box
- D (`START-VER-003-D`): Keep the keys until the next day

**Correct:** C — Place the keys in the secured return box

**Explanation:** The desk is unattended, so the instruction to use the secured return box applies. Leaving keys on the desk, using the outside mail slot or keeping them is not the stated procedure.

**Why alternatives are not correct:** Leaving keys on the desk has no unattended-case authorization; the mail slot is expressly prohibited; keeping keys until tomorrow invents a delay.

### START-VER-005

Metadata: `verbal` / `inference_context` / `supported_inference`.

**Waiting room:** Every chair in the waiting room was occupied when Talia arrived. She stood by the wall until another person left, then sat in the vacated chair.

**Question:** Which conclusion is best supported?

- A (`START-VER-005-A`): Talia was the last person to arrive that day
- B (`START-VER-005-B`): Everyone in the room was applying for the same role
- C (`START-VER-005-C`): No chair was available when Talia first arrived
- D (`START-VER-005-D`): The person who left had been refused an interview

**Correct:** C — No chair was available when Talia first arrived

**Explanation:** Every chair was occupied on arrival, and Talia sat only after someone left. This supports the conclusion that no chair was initially available. The passage gives no evidence about interviews, other arrival times or why people were there.

**Why alternatives are not correct:** Interview refusal, last arrival of the day and shared application role all introduce information absent from the passage. Only initial lack of a free chair follows from every chair being occupied.

## Updated duplication findings and acceptance qualification

See [the updated audit](pilot2-starting-point-amendment-audit.md) and [full comparison matrix](pilot2-starting-point-comparison-matrix.csv). All 26 Starting Point items were compared with 82 active Checks across all four domains; all 108 current source records are included for independent review. No identical complete problems were found following the 13 substitutions. Replaced items now use different questions/tasks, conditions, numerical geometry, generative rules or logical propositions; they retain their intended competencies.

**Retained unresolved case:** `START-NUM-006` ↔ `NUM-A-001` still shares its exact question stem and table presentation. Values and winning station differ, so the later item requires fresh percentage ranking; nevertheless the earlier audit’s conservative near-identical-template flag remains plausible. The user expressly required this Starting Point item unchanged and the Check frozen. It was retained. No fourteenth item was changed, and the prior concern was not silently relabelled solely to claim acceptance. The global no-material-near-duplicate criterion therefore remains qualified pending product-owner judgment of this case.

Additional retained same-archetype/borderline findings: `START-MECH-002` ↔ `MMA-HYD-001` (area-force proposition; why versus explicit force ratio), and `START-NUM-004` ↔ `NUM-A-010` (ratio-share template with different inputs). The audit also explains the necessary shared direct-gear-mesh principle in new `START-MECH-003`; later output-direction questions still require fresh application. No repeated rewrite cycle or scope expansion was undertaken.

## Validation and regressions

- Existing v0.44.20 Pilot 2 suite passes: all 21 Independent/Check/Guided component-stage scenarios, seven parent handlers with normal/final routes, telemetry transitions/counts/timing, final-answer scoring, legacy persistence, CSV, Verbal 10/12 shortcut and response-ID sync preservation.
- New scope assertions pass: exactly the authorized 13 records changed, all IDs/order/count and domain/subcompetency/concept/difficulty/session/pathway metadata preserved, retained items unchanged, four unique options and one key each.
- Replacement validity checks pass: physical/numeric calculations, half-turn sequence, interleaved numeric strands, common-symbol matrix, finite-model syllogism enumeration and explicitly reviewed passage keys/distractors.
- Starting Point scoring/recommendations pass for all-correct and four domain-specific single-error patterns; current and baseline implementations produce equivalent domain results and next-step recommendations for equivalent correctness patterns.
- Frozen downstream content and the previously reviewed instrumentation are preserved by hashes of the pre-amendment v0.44.20 runtime: App.tsx normalized only for EOL and excluding the Starting Point declaration; all other runtime files compared raw. All downstream data, Fundamentals, scoring/recommendation functions, review, CSV, response behaviour, diagram code, account/progress logic, sync correction, Supabase configuration/dependency pin and 10/12 demo remain intact.
- TypeScript check passes; production Vite build passes. The existing large-JavaScript-bundle warning remains; no unrelated code splitting/refactor was attempted.
- Isolated Edge end-to-end Starting Point completion passes at 390×844 mobile/touch emulation and 1280×900 desktop: all 26 answers saved once, 26/26 scored correctly, domain evidence/recommendation generated, no immediate answer feedback, no horizontal page overflow or browser JavaScript errors. Revised Abstract sequence/matrix and text items were rendered and screenshots recorded. Phone numeric-strand and intersection-matrix screenshots were inspected for readable symbols/options.
- These are local synthetic and emulated-browser checks. No physical-device validation, live authenticated cloud round trip, real participant measurement or empirical difficulty calibration is claimed. The prior instrumented browser Independent/Check flows were unchanged; their current logic was rerun in the Pilot 2 suite.

## Compatibility and concerns

Retaining IDs avoids pathway/scoring/navigation migrations, as requested. It also means old Starting Point responses refer to the previous content under those IDs. Existing stored correctness and progress are not rewritten. In the unchanged CSV architecture, legacy option text is looked up from the current question bank; thus old Starting Point option IDs may now display new wording, and old Starting Point rows must not be pooled with amended first-exposure pilot rows as if they were the same item content. The unchanged `legacy_or_uninstrumented` capture marker does not distinguish pre-/post-amendment Starting Point content. Maintain release/exposure provenance externally for Pilot 2; no migration, destructive reset or extra telemetry feature was introduced by this content-only amendment. This historical-data limitation is explicitly reported for review.

The authoring choices remain proposed educational content for product-owner acceptance. The required retained table case prevents an unconditional global duplication clearance; no unauthorized action was taken to resolve that tension.

## Stop record

Working branch remains `pilot-2-instrumentation`, with the earlier instrumentation and this amendment uncommitted. Only authorized Starting Point content plus tests/reports changed during the amendment. Version remains v0.44.20. No downstream learner content, runtime instrumentation, account/progress behaviour, dependencies, Supabase schema/configuration or thresholds were changed by the amendment. No commit, push, merge or deployment occurred. Work is stopped for product-owner review.
