# Aptesta v0.44.20 — Starting Point ↔ Check duplication audit

Read-only audit baseline: **v0.44.19**, `Numeroxa/flospatial`, authoritative `main` commit `2065282637d1407a1b41f16b6b73aa33884b5b72`. These findings are for product-owner review; no item substitutions or rewrites were made. Recommendations below are audit judgments, not implementation authorisation.

## Coverage and interpretation

The active 26-question cross-domain Starting Point was compared with all 82 active Check/Assessment items: Gear 10, Pulley 10, Lever 10, Mixed Mechanical 16, Numerical 12, Abstract/Logical 12 and Verbal 12. Mechanical includes topic checks as well as its final 16-item mixed check so earlier Check exposure risks remain visible. There is no separate Hydraulic Check array; hydraulic assessment content is in Mixed Mechanical. All Starting Point items have an entry below. No Guided, Independent, inactive pool or VB-CAL item was substituted for a Check item. The full 108-record evidence set is included below.

“Identical” refers to the learner problem, ignoring IDs and deterministic option rotation. “Near-identical” means recognising the prior item, its data/passage, or a minimally altered problem could materially substitute for fresh reasoning. “Same archetype” identifies expected skill transfer without claiming duplication merely because a method recurs. Numerical-template boundaries are judgment calls; the exact evidence allows independent review. Risk describes possible recognition contamination, not measured pilot effects.

## Findings across all four domains

| Starting Point ID | Check ID(s) | Classification | Prior-exposure effect | Recommendation | Evidence |
|---|---|---|---|---|---|
| START-MECH-001 | MMA-HYD-001 / MMA-HYD-003 | Same underlying principle | Low recognition risk | Retain | Starting asks pressure transmission; checks apply area/force or calculate force from pressure and area. New operations and quantitative information, not a repeated item. |
| START-MECH-002 | MMA-HYD-001 | Near-identical foundation proposition | Moderate | Revise later | Both test equal fluid pressure producing more force at a larger output piston; Check adds the explicit twice-area ratio and a diagram. Limited new demand, though the answer is not a verbatim repeat. |
| START-MECH-003 | GEAR-AS-001 | Near-identical | Moderate–high | Replace before Pilot 2 | Same two directly meshing gears, A→B direction. Starting input clockwise, Check anticlockwise; labels/diagram and reversed answer add little transfer. |
| START-MECH-003 | MMA-GEAR-001 / MMA-GEAR-006 | Same archetype, added steps | Low–moderate | Retain | Mixed checks require multiple contacts, with ratio integration in MMA-GEAR-006. Not the same two-gear item. |
| START-MECH-004 | GEAR-AS-005 / GEAR-AS-007 / MMA-GEAR-005 | Same archetype | Moderate familiarity, limited recognition | Retain | Starting uses 12:36 and asks relative speed. Topic checks use 15:45 and either identify faster gear or compute rpm; mixed item adds an idler and direction to 20:60. Shared 1:3 ratio is not alone sufficient to call them duplicate items. |
| START-MECH-005 | PULL-AS-001 | Near-identical | High | Replace before Pilot 2 | Both ask the main effect of a single fixed pulley and key change in pull direction. Check adds a diagram; little additional reasoning. |
| START-MECH-006 | PULL-AS-003 | Near-identical | High | Replace before Pilot 2 | Same three-support ideal-MA problem, same answer 3 and option values. Starting states strand count; Check depicts it. Count is specified by pulleyQuestionStrands for PULL-AS-003. |
| START-MECH-006 | PULL-AS-008 / MMA-PULL-006 | Same archetype | Moderate | Retain | Both retain three-support content, but PULL-AS-008 requires integrating moving-block anchor plus two other supports; MMA-PULL-006 asks which diagram feature determines MA rather than the numerical MA. Flag shared answer cue, not identical item. |
| START-MECH-006 | PULL-AS-002 / PULL-AS-004 | Same archetype | Low–moderate | Retain | Counting supports with changed counts and/or a different question target; no matching three-strand answer. |
| START-MECH-007 | LEV-AS-002 | Near-identical | High | Replace before Pilot 2 | Same greatest-force-advantage question and the same long-effort/short-load answer and distractor relationships. Check diagram does not materially change that verbal task. |
| START-MECH-007 | LEV-AS-003 | Same archetype | Low–moderate | Retain | Moves fulcrum toward load and asks the consequence rather than selecting the arrangement. |
| START-MECH-008 | LEV-AS-004 | Near-identical numerical template | Moderate–high | Replace before Pilot 2 | Same 0.5 m load arm and 1.5 m effort arm; only load changes from 300 N to 360 N, answer 100 N to 120 N. |
| START-MECH-008 | LEV-AS-005 / MMA-LEV-001 | Same archetype | Moderate | Retain | Moment-balance force problems use different geometry and loads (250×1.2/3; 600×0.5/2). Shared equation is expected transfer; no repeated numerical problem. |
| START-MECH-008 | LEV-AS-010 / MMA-LEV-004 / MMA-LEV-006 | Same archetype, changed unknown | Low–moderate | Retain | Moment balance remains but the unknown arm or load and inputs differ. |
| START-NUM-001 | None | No direct counterpart | Low | Retain | 438+276 is not repeated. Average/missing-value items elsewhere are not the same addition item. |
| START-NUM-002 | None | No direct counterpart | Low | Retain | 39.6×5.2 estimation is not repeated in the active Numerical Check. |
| START-NUM-003 | NUM-A-007 / NUM-A-013 | Same percentage family | Low | Retain | 15% of 320 differs from a 20% reduction of 150 and sequential discount/GST on $240. Different question target or multiple operations. |
| START-NUM-004 | NUM-A-010 | Same archetype / closely matched one-step template | Moderate | Revise later | Both divide a total into ratio parts and ask the smaller share: 3:5 of 64 versus 4:7 of 99. Distinct quantities/answers and no repeated passage, but minimal presentation transfer. |
| START-NUM-005 | NUM-A-003 | Near-identical | Moderate–high | Replace before Pilot 2 | Same vehicle average-speed problem, 240/4 versus 270/4.5. Both answer 60 km/h; proportional rescaling leaves essentially the same item. |
| START-NUM-005 | NUM-A-016 | Same unit-rate archetype | Low–moderate | Retain | 840 litres/7 minutes changes context, units and answer to 120 L/min. |
| START-NUM-006 | NUM-A-001 | Near-identical table template | Moderate–high | Replace before Pilot 2 | Exact same question stem and Assigned/Completed station table layout. Station labels and values differ; screen best South=45/50=90%, Check C=38/40=95%. Could rehearse the exact compare-proportions routine; not identical data. |
| START-NUM-006 | NUM-A-015 / NUM-A-017 | Same broad data-percentage family | Low | Retain | Conditional denominator in a two-way shift table and percentage-more comparison differ from finding the maximum completion rate. |
| START-ABS-001 | ABS-A-001 | Near-identical | High | Replace before Pilot 2 | Identical stem and clockwise quarter-turn cycle. Starting ↑→↓←?; Check →↓←↑?. Only the starting position/next arrow changes. |
| START-ABS-001 | ABS-A-013 | Same rotation family, changed rule | Low–moderate | Retain | Alternating rotation is a different generative rule from fixed clockwise quarter-turns. |
| START-ABS-002 | ABS-A-009 | Near-identical continuation | High | Replace before Pilot 2 | Check extends the very same ▲,○○,▲▲▲,○○○○ sequence with ▲▲▲▲▲ before the missing term. Same alternating shapes and increasing counts. |
| START-ABS-003 | ABS-A-002 | Near-identical | High | Replace before Pilot 2 | Same combine-left-and-middle matrix and exact stem. Only symbols/counts are substituted. |
| START-ABS-003 | ABS-A-014 / ABS-A-018 | Same matrix family, changed demand | Low | Retain | Dual-feature matrices integrate cyclic rotation/count rules rather than simple concatenation. |
| START-ABS-004 | ABS-A-003 | Same classification family | Low | Retain | Starting classifies closed shapes vs an angle; Check compares transformations between pairs. Different target relationship. |
| START-ABS-004 | ABS-A-015 | Same broad relationships family | Low | Retain | Analogy transformation is not the odd-open-shape item. |
| START-ABS-005 | ABS-A-004 | Near-identical logical form and context | High | Replace before Pilot 2 | All rescue helmets are equipment; no equipment living → all BA units equipment; no equipment person. Same inclusion/exclusion syllogism, equipment theme and keyed deduction with nouns replaced. |
| START-ABS-005 | ABS-A-012 / ABS-A-017 | Same deductive domain, different demand | Low | Retain | Contrapositive conditional and must/could restrictions differ from the screening exclusion syllogism. |
| START-ABS-006 | ABS-A-016 | Same archetype, expanded constraints | Moderate | Retain | Three-name chain and last finisher becomes four-name ordering with reordered statements. Same chain skill but added integration; no repeated names or complete problem. |
| START-VER-001 | VER-A-005 / VER-A-017 / VER-A-018 | Same explicit-information category only | Low | Retain | Arrival-time detail differs from main purpose of an outage, restocking detail in a long passage, and comparing two notices. No repeated passage/problem. |
| START-VER-002 | VER-A-002 | Near-identical | High | Replace before Pilot 2 | Same concise definition, exact stem and same four option meanings. Starting adds “revised” to instructions; no substantive transfer. |
| START-VER-003 | VER-A-003 | Identical learner problem | High | Replace before Pilot 2 | Same entrance passage, arrival time, question, answer and distractors. ID-based option rotation may change displayed letters but not the item. |
| START-VER-004 | VER-A-003 / VER-A-011 / VER-A-014 | Same instruction family only | Low | Retain | Sample label→collect→seal→record procedure is not repeated in Check. Entrance, smoke response and loading-yard policy are different instruction tasks. |
| START-VER-005 | VER-A-006 | Near-identical; same passage/stem | High | Replace before Pilot 2 | Passage, stem, correct inference and most options are identical; one distractor says “replacement gauge” versus “second gauge”. Materially the same item even though not byte-identical. |
| START-VER-006 | VER-A-012 / VER-A-013 / VER-A-016 | Same evidence-limits family only | Low–moderate | Retain | Starting limits a claim about 18/24 pilot candidates. Checks test causality, before/after claims and multi-paragraph synthesis with different evidence. No repeated passage or complete inference problem. |

## Scope of the recommendation

The strongest direct repeats are the entrance notice and the gauge/concise Verbal items, the Abstract rotation/continuation/combination/syllogism items, and Mechanical fixed-pulley/force-advantage templates. Recommended replacements include topic Checks that precede the final Mixed Mechanical Check; do not interpret that as a finding that all final Mixed Mechanical items are duplicates. Shared basic principles by themselves are expected and retained. No replacement has been carried out. Product-owner review of these rows is required before any content substitution.

## Source evidence (exact baseline, displayed options)

### startingAssessmentQuestions

#### START-MECH-001

Source: [src/App.tsx:2607](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2607).

```json
{
  "questionId": "START-MECH-001",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "hydraulics",
  "concept": "pressure_transfer",
  "difficulty": "foundational",
  "stem": "In a sealed hydraulic system, force is applied to the input piston. What happens to the pressure created in the fluid?",
  "options": [
    {
      "optionId": "START-MECH-001-A",
      "label": "A",
      "text": "It is destroyed by the fluid"
    },
    {
      "optionId": "START-MECH-001-B",
      "label": "B",
      "text": "It can act only if the system is open"
    },
    {
      "optionId": "START-MECH-001-C",
      "label": "C",
      "text": "It is transmitted through the fluid"
    },
    {
      "optionId": "START-MECH-001-D",
      "label": "D",
      "text": "It stays only behind the input piston"
    }
  ],
  "correctOptionId": "START-MECH-001-C",
  "explanation": "Pressure applied to a sealed fluid is transmitted through the system."
}
```

#### START-MECH-002

Source: [src/App.tsx:2608](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2608).

```json
{
  "questionId": "START-MECH-002",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "hydraulics",
  "concept": "piston_area_force",
  "difficulty": "foundational",
  "stem": "Why can a larger output piston produce more force than a smaller input piston in an ideal hydraulic system?",
  "options": [
    {
      "optionId": "START-MECH-002-A",
      "label": "A",
      "text": "The fluid makes the load lighter"
    },
    {
      "optionId": "START-MECH-002-B",
      "label": "B",
      "text": "The same pressure acts over a larger area"
    },
    {
      "optionId": "START-MECH-002-C",
      "label": "C",
      "text": "The larger piston creates pressure from nothing"
    },
    {
      "optionId": "START-MECH-002-D",
      "label": "D",
      "text": "The output piston always moves farther"
    }
  ],
  "correctOptionId": "START-MECH-002-B",
  "explanation": "At the same pressure, a larger piston area produces greater force."
}
```

#### START-MECH-003

Source: [src/App.tsx:2609](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2609).

```json
{
  "questionId": "START-MECH-003",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "direct_mesh_direction",
  "difficulty": "foundational",
  "stem": "Gear A turns clockwise and directly meshes with Gear B. Which way does Gear B turn?",
  "options": [
    {
      "optionId": "START-MECH-003-A",
      "label": "A",
      "text": "Anticlockwise"
    },
    {
      "optionId": "START-MECH-003-B",
      "label": "B",
      "text": "Clockwise"
    },
    {
      "optionId": "START-MECH-003-C",
      "label": "C",
      "text": "It does not turn"
    },
    {
      "optionId": "START-MECH-003-D",
      "label": "D",
      "text": "Direction depends only on gear size"
    }
  ],
  "correctOptionId": "START-MECH-003-A",
  "explanation": "Directly meshed gears rotate in opposite directions."
}
```

#### START-MECH-004

Source: [src/App.tsx:2610](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2610).

```json
{
  "questionId": "START-MECH-004",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "gear_ratio",
  "difficulty": "foundational",
  "stem": "A 12-tooth gear drives a 36-tooth gear. Compared with the 12-tooth gear, the 36-tooth gear turns:",
  "options": [
    {
      "optionId": "START-MECH-004-A",
      "label": "A",
      "text": "Three times faster"
    },
    {
      "optionId": "START-MECH-004-B",
      "label": "B",
      "text": "At the same speed"
    },
    {
      "optionId": "START-MECH-004-C",
      "label": "C",
      "text": "In no predictable relationship"
    },
    {
      "optionId": "START-MECH-004-D",
      "label": "D",
      "text": "At one-third the speed"
    }
  ],
  "correctOptionId": "START-MECH-004-D",
  "explanation": "The driven gear has three times as many teeth, so it turns at one-third the speed."
}
```

#### START-MECH-005

Source: [src/App.tsx:2611](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2611).

```json
{
  "questionId": "START-MECH-005",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "fixed_pulley",
  "difficulty": "foundational",
  "stem": "What is the main effect of a single fixed pulley?",
  "options": [
    {
      "optionId": "START-MECH-005-A",
      "label": "A",
      "text": "It doubles the load"
    },
    {
      "optionId": "START-MECH-005-B",
      "label": "B",
      "text": "It prevents the rope from moving"
    },
    {
      "optionId": "START-MECH-005-C",
      "label": "C",
      "text": "It changes the direction of the pulling force"
    },
    {
      "optionId": "START-MECH-005-D",
      "label": "D",
      "text": "It halves the required force"
    }
  ],
  "correctOptionId": "START-MECH-005-C",
  "explanation": "A single fixed pulley mainly changes the direction of effort."
}
```

#### START-MECH-006

Source: [src/App.tsx:2612](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2612).

```json
{
  "questionId": "START-MECH-006",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "supporting_strands",
  "difficulty": "foundational",
  "stem": "A moving load is directly supported by three rope sections in an ideal pulley system. What is the ideal mechanical advantage?",
  "options": [
    {
      "optionId": "START-MECH-006-A",
      "label": "A",
      "text": "6"
    },
    {
      "optionId": "START-MECH-006-B",
      "label": "B",
      "text": "3"
    },
    {
      "optionId": "START-MECH-006-C",
      "label": "C",
      "text": "1"
    },
    {
      "optionId": "START-MECH-006-D",
      "label": "D",
      "text": "2"
    }
  ],
  "correctOptionId": "START-MECH-006-B",
  "explanation": "Three supporting rope sections give an ideal mechanical advantage of three."
}
```

#### START-MECH-007

Source: [src/App.tsx:2613](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2613).

```json
{
  "questionId": "START-MECH-007",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "easiest_setup",
  "difficulty": "foundational",
  "stem": "Which lever arrangement gives the greatest ideal force advantage?",
  "options": [
    {
      "optionId": "START-MECH-007-A",
      "label": "A",
      "text": "A long effort arm and a short load arm"
    },
    {
      "optionId": "START-MECH-007-B",
      "label": "B",
      "text": "A short effort arm and a long load arm"
    },
    {
      "optionId": "START-MECH-007-C",
      "label": "C",
      "text": "Equal arms with the effort at the fulcrum"
    },
    {
      "optionId": "START-MECH-007-D",
      "label": "D",
      "text": "No fulcrum"
    }
  ],
  "correctOptionId": "START-MECH-007-A",
  "explanation": "A long effort arm and short load arm give the greatest force advantage."
}
```

#### START-MECH-008

Source: [src/App.tsx:2614](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2614).

```json
{
  "questionId": "START-MECH-008",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "moment_balance",
  "difficulty": "foundational",
  "stem": "A 300 N load acts 0.5 m from a fulcrum. An effort is applied 1.5 m from the fulcrum. What effort balances the load?",
  "options": [
    {
      "optionId": "START-MECH-008-A",
      "label": "A",
      "text": "300 N"
    },
    {
      "optionId": "START-MECH-008-B",
      "label": "B",
      "text": "450 N"
    },
    {
      "optionId": "START-MECH-008-C",
      "label": "C",
      "text": "900 N"
    },
    {
      "optionId": "START-MECH-008-D",
      "label": "D",
      "text": "100 N"
    }
  ],
  "correctOptionId": "START-MECH-008-D",
  "explanation": "The load moment is 300 × 0.5 = 150 N·m. Dividing by the 1.5 m effort arm gives 100 N."
}
```

#### START-NUM-001

Source: [src/App.tsx:2617](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2617).

```json
{
  "questionId": "START-NUM-001",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "arithmetic_estimation",
  "concept": "basic_arithmetic",
  "difficulty": "foundational",
  "stem": "What is 438 + 276?",
  "options": [
    {
      "optionId": "START-NUM-001-A",
      "label": "A",
      "text": "704"
    },
    {
      "optionId": "START-NUM-001-B",
      "label": "B",
      "text": "724"
    },
    {
      "optionId": "START-NUM-001-C",
      "label": "C",
      "text": "614"
    },
    {
      "optionId": "START-NUM-001-D",
      "label": "D",
      "text": "714"
    }
  ],
  "correctOptionId": "START-NUM-001-D",
  "explanation": "438 + 276 = 714."
}
```

#### START-NUM-002

Source: [src/App.tsx:2618](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2618).

```json
{
  "questionId": "START-NUM-002",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "arithmetic_estimation",
  "concept": "estimation",
  "difficulty": "foundational",
  "stem": "Which is the closest estimate for 39.6 × 5.2?",
  "options": [
    {
      "optionId": "START-NUM-002-A",
      "label": "A",
      "text": "300"
    },
    {
      "optionId": "START-NUM-002-B",
      "label": "B",
      "text": "40"
    },
    {
      "optionId": "START-NUM-002-C",
      "label": "C",
      "text": "200"
    },
    {
      "optionId": "START-NUM-002-D",
      "label": "D",
      "text": "100"
    }
  ],
  "correctOptionId": "START-NUM-002-C",
  "explanation": "40 × 5 is about 200."
}
```

#### START-NUM-003

Source: [src/App.tsx:2619](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2619).

```json
{
  "questionId": "START-NUM-003",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "percentages_ratios",
  "concept": "percentage_of_amount",
  "difficulty": "foundational",
  "stem": "What is 15% of 320?",
  "options": [
    {
      "optionId": "START-NUM-003-A",
      "label": "A",
      "text": "45"
    },
    {
      "optionId": "START-NUM-003-B",
      "label": "B",
      "text": "48"
    },
    {
      "optionId": "START-NUM-003-C",
      "label": "C",
      "text": "32"
    },
    {
      "optionId": "START-NUM-003-D",
      "label": "D",
      "text": "64"
    }
  ],
  "correctOptionId": "START-NUM-003-B",
  "explanation": "10% of 320 is 32 and 5% is 16, giving 48."
}
```

#### START-NUM-004

Source: [src/App.tsx:2620](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2620).

```json
{
  "questionId": "START-NUM-004",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "percentages_ratios",
  "concept": "ratio_sharing",
  "difficulty": "foundational",
  "stem": "Red and blue markers are in the ratio 3:5. There are 64 markers altogether. How many are red?",
  "options": [
    {
      "optionId": "START-NUM-004-A",
      "label": "A",
      "text": "24"
    },
    {
      "optionId": "START-NUM-004-B",
      "label": "B",
      "text": "40"
    },
    {
      "optionId": "START-NUM-004-C",
      "label": "C",
      "text": "18"
    },
    {
      "optionId": "START-NUM-004-D",
      "label": "D",
      "text": "32"
    }
  ],
  "correctOptionId": "START-NUM-004-A",
  "explanation": "There are eight ratio parts. Each part is 8, so red = 3 × 8 = 24."
}
```

#### START-NUM-005

Source: [src/App.tsx:2621](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2621).

```json
{
  "questionId": "START-NUM-005",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "rates_proportion",
  "concept": "unit_rate",
  "difficulty": "foundational",
  "stem": "A vehicle travels 240 km in 4 hours. What is its average speed?",
  "options": [
    {
      "optionId": "START-NUM-005-A",
      "label": "A",
      "text": "80 km/h"
    },
    {
      "optionId": "START-NUM-005-B",
      "label": "B",
      "text": "40 km/h"
    },
    {
      "optionId": "START-NUM-005-C",
      "label": "C",
      "text": "960 km/h"
    },
    {
      "optionId": "START-NUM-005-D",
      "label": "D",
      "text": "60 km/h"
    }
  ],
  "correctOptionId": "START-NUM-005-D",
  "explanation": "240 ÷ 4 = 60 km/h."
}
```

#### START-NUM-006

Source: [src/App.tsx:2622](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2622).

```json
{
  "questionId": "START-NUM-006",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "tables_data",
  "concept": "table_percentage",
  "difficulty": "foundational",
  "stem": "Which station had the highest completion rate?",
  "options": [
    {
      "optionId": "START-NUM-006-A",
      "label": "A",
      "text": "East"
    },
    {
      "optionId": "START-NUM-006-B",
      "label": "B",
      "text": "West"
    },
    {
      "optionId": "START-NUM-006-C",
      "label": "C",
      "text": "South"
    },
    {
      "optionId": "START-NUM-006-D",
      "label": "D",
      "text": "North"
    }
  ],
  "correctOptionId": "START-NUM-006-C",
  "explanation": "South completed 45 of 50 tasks, a 90% completion rate, which is the highest.",
  "dataTable": {
    "headers": [
      "Station",
      "Assigned",
      "Completed"
    ],
    "rows": [
      [
        "North",
        "45",
        "36"
      ],
      [
        "South",
        "50",
        "45"
      ],
      [
        "East",
        "40",
        "34"
      ],
      [
        "West",
        "60",
        "48"
      ]
    ]
  }
}
```

#### START-ABS-001

Source: [src/App.tsx:2625](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2625).

```json
{
  "questionId": "START-ABS-001",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "pattern_sequences",
  "concept": "rotation",
  "difficulty": "foundational",
  "stem": "Which symbol comes next?",
  "options": [
    {
      "optionId": "START-ABS-001-A",
      "label": "A",
      "text": "←"
    },
    {
      "optionId": "START-ABS-001-B",
      "label": "B",
      "text": "↑"
    },
    {
      "optionId": "START-ABS-001-C",
      "label": "C",
      "text": "→"
    },
    {
      "optionId": "START-ABS-001-D",
      "label": "D",
      "text": "↓"
    }
  ],
  "correctOptionId": "START-ABS-001-B",
  "explanation": "The arrow rotates 90° clockwise each step.",
  "abstractVisual": {
    "kind": "sequence",
    "rows": [
      [
        "↑",
        "→",
        "↓",
        "←",
        "?"
      ]
    ]
  }
}
```

#### START-ABS-002

Source: [src/App.tsx:2626](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2626).

```json
{
  "questionId": "START-ABS-002",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "pattern_sequences",
  "concept": "two_rule_sequence",
  "difficulty": "foundational",
  "stem": "What comes next?",
  "options": [
    {
      "optionId": "START-ABS-002-A",
      "label": "A",
      "text": "▲▲▲▲▲"
    },
    {
      "optionId": "START-ABS-002-B",
      "label": "B",
      "text": "○○○○○"
    },
    {
      "optionId": "START-ABS-002-C",
      "label": "C",
      "text": "▲▲▲▲"
    },
    {
      "optionId": "START-ABS-002-D",
      "label": "D",
      "text": "○○○○○○"
    }
  ],
  "correctOptionId": "START-ABS-002-A",
  "explanation": "Shape alternates while the count increases by one. The fifth term is five triangles.",
  "abstractVisual": {
    "kind": "sequence",
    "rows": [
      [
        "▲",
        "○○",
        "▲▲▲",
        "○○○○",
        "?"
      ]
    ]
  }
}
```

#### START-ABS-003

Source: [src/App.tsx:2627](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2627).

```json
{
  "questionId": "START-ABS-003",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "matrices_rules",
  "concept": "combination_rule",
  "difficulty": "foundational",
  "stem": "What belongs in the missing cell?",
  "options": [
    {
      "optionId": "START-ABS-003-A",
      "label": "A",
      "text": "■◆"
    },
    {
      "optionId": "START-ABS-003-B",
      "label": "B",
      "text": "■■"
    },
    {
      "optionId": "START-ABS-003-C",
      "label": "C",
      "text": "◆◆"
    },
    {
      "optionId": "START-ABS-003-D",
      "label": "D",
      "text": "■■◆"
    }
  ],
  "correctOptionId": "START-ABS-003-D",
  "explanation": "The third cell combines the symbols in the first two cells of each row.",
  "abstractVisual": {
    "kind": "matrix",
    "rows": [
      [
        "▲",
        "○○",
        "▲○○"
      ],
      [
        "■■",
        "◆",
        "?"
      ]
    ]
  }
}
```

#### START-ABS-004

Source: [src/App.tsx:2628](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2628).

```json
{
  "questionId": "START-ABS-004",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "classification_relationships",
  "concept": "odd_one_out",
  "difficulty": "foundational",
  "stem": "Which item is the odd one out?",
  "options": [
    {
      "optionId": "START-ABS-004-A",
      "label": "A",
      "text": "□"
    },
    {
      "optionId": "START-ABS-004-B",
      "label": "B",
      "text": "∠"
    },
    {
      "optionId": "START-ABS-004-C",
      "label": "C",
      "text": "○"
    },
    {
      "optionId": "START-ABS-004-D",
      "label": "D",
      "text": "△"
    }
  ],
  "correctOptionId": "START-ABS-004-B",
  "explanation": "The angle is the only item that is not a closed shape.",
  "abstractVisual": {
    "kind": "set",
    "rows": [
      [
        "○",
        "△",
        "□",
        "∠"
      ]
    ]
  }
}
```

#### START-ABS-005

Source: [src/App.tsx:2629](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2629).

```json
{
  "questionId": "START-ABS-005",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "deductive_reasoning",
  "concept": "syllogism",
  "difficulty": "foundational",
  "stem": "All rescue helmets are equipment. No equipment is a living thing. What must follow?",
  "options": [
    {
      "optionId": "START-ABS-005-A",
      "label": "A",
      "text": "All equipment is a rescue helmet"
    },
    {
      "optionId": "START-ABS-005-B",
      "label": "B",
      "text": "No rescue helmet is a living thing"
    },
    {
      "optionId": "START-ABS-005-C",
      "label": "C",
      "text": "All living things are rescue helmets"
    },
    {
      "optionId": "START-ABS-005-D",
      "label": "D",
      "text": "Some equipment is a living thing"
    }
  ],
  "correctOptionId": "START-ABS-005-B",
  "explanation": "Every rescue helmet is equipment, and no equipment is a living thing."
}
```

#### START-ABS-006

Source: [src/App.tsx:2630](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2630).

```json
{
  "questionId": "START-ABS-006",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "deductive_reasoning",
  "concept": "ordering",
  "difficulty": "foundational",
  "stem": "Maya finishes before Noah. Noah finishes before Omar. Who must finish last?",
  "options": [
    {
      "optionId": "START-ABS-006-A",
      "label": "A",
      "text": "Omar"
    },
    {
      "optionId": "START-ABS-006-B",
      "label": "B",
      "text": "Noah"
    },
    {
      "optionId": "START-ABS-006-C",
      "label": "C",
      "text": "Maya"
    },
    {
      "optionId": "START-ABS-006-D",
      "label": "D",
      "text": "Cannot be known"
    }
  ],
  "correctOptionId": "START-ABS-006-A",
  "explanation": "The required order is Maya, then Noah, then Omar."
}
```

#### START-VER-001

Source: [src/App.tsx:2633](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2633).

```json
{
  "questionId": "START-VER-001",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "explicit_information",
  "concept": "stated_detail",
  "difficulty": "foundational",
  "stem": "What time must candidates arrive by?",
  "options": [
    {
      "optionId": "START-VER-001-A",
      "label": "A",
      "text": "07:20"
    },
    {
      "optionId": "START-VER-001-B",
      "label": "B",
      "text": "08:30"
    },
    {
      "optionId": "START-VER-001-C",
      "label": "C",
      "text": "07:40"
    },
    {
      "optionId": "START-VER-001-D",
      "label": "D",
      "text": "08:00"
    }
  ],
  "correctOptionId": "START-VER-001-C",
  "explanation": "The notice explicitly states an arrival time of 07:40.",
  "verbalPassage": {
    "title": "Assessment notice",
    "text": "Candidates must bring photo identification and arrive by 07:40. Lockers are available for phones and bags. The written assessment begins at 08:00."
  }
}
```

#### START-VER-002

Source: [src/App.tsx:2634](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2634).

```json
{
  "questionId": "START-VER-002",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "inference_context",
  "concept": "meaning_in_context",
  "difficulty": "foundational",
  "stem": "What does concise most nearly mean?",
  "options": [
    {
      "optionId": "START-VER-002-A",
      "label": "A",
      "text": "Repeated several times"
    },
    {
      "optionId": "START-VER-002-B",
      "label": "B",
      "text": "Brief but complete"
    },
    {
      "optionId": "START-VER-002-C",
      "label": "C",
      "text": "Confusing and incomplete"
    },
    {
      "optionId": "START-VER-002-D",
      "label": "D",
      "text": "Highly technical"
    }
  ],
  "correctOptionId": "START-VER-002-B",
  "explanation": "The context defines concise as covering what matters without unnecessary detail.",
  "verbalPassage": {
    "title": "Review",
    "text": "The revised instructions were concise: they covered every essential step without unnecessary detail."
  }
}
```

#### START-VER-003

Source: [src/App.tsx:2635](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2635).

```json
{
  "questionId": "START-VER-003",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "instructions_sequence",
  "concept": "conditional_instruction",
  "difficulty": "foundational",
  "stem": "A visitor arrives at 18:20. Which entrance should they use?",
  "options": [
    {
      "optionId": "START-VER-003-A",
      "label": "A",
      "text": "The west entrance"
    },
    {
      "optionId": "START-VER-003-B",
      "label": "B",
      "text": "The east entrance"
    },
    {
      "optionId": "START-VER-003-C",
      "label": "C",
      "text": "Either entrance"
    },
    {
      "optionId": "START-VER-003-D",
      "label": "D",
      "text": "No entrance is available"
    }
  ],
  "correctOptionId": "START-VER-003-A",
  "explanation": "After 18:00 all visitors must use the staffed west entrance.",
  "verbalPassage": {
    "title": "Entry procedure",
    "text": "Use the east entrance before 18:00. After 18:00, the east entrance is locked and all visitors must use the staffed west entrance."
  }
}
```

#### START-VER-004

Source: [src/App.tsx:2636](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2636).

```json
{
  "questionId": "START-VER-004",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "instructions_sequence",
  "concept": "ordered_steps",
  "difficulty": "foundational",
  "stem": "What should happen immediately after the sample is collected?",
  "options": [
    {
      "optionId": "START-VER-004-A",
      "label": "A",
      "text": "Label the container"
    },
    {
      "optionId": "START-VER-004-B",
      "label": "B",
      "text": "Record the time before sealing"
    },
    {
      "optionId": "START-VER-004-C",
      "label": "C",
      "text": "Discard the form"
    },
    {
      "optionId": "START-VER-004-D",
      "label": "D",
      "text": "Seal the container"
    }
  ],
  "correctOptionId": "START-VER-004-D",
  "explanation": "The instruction says to seal the container immediately after collection.",
  "verbalPassage": {
    "title": "Sample procedure",
    "text": "Label the container before collecting the sample. Seal it immediately after collection. Then record the time on the form."
  }
}
```

#### START-VER-005

Source: [src/App.tsx:2637](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2637).

```json
{
  "questionId": "START-VER-005",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "inference_context",
  "concept": "supported_inference",
  "difficulty": "foundational",
  "stem": "What can reasonably be inferred?",
  "options": [
    {
      "optionId": "START-VER-005-A",
      "label": "A",
      "text": "Training began before any gauge was fitted"
    },
    {
      "optionId": "START-VER-005-B",
      "label": "B",
      "text": "The replacement gauge was also marked out of service"
    },
    {
      "optionId": "START-VER-005-C",
      "label": "C",
      "text": "The failed gauge was not used for the training session"
    },
    {
      "optionId": "START-VER-005-D",
      "label": "D",
      "text": "Both gauges failed the check"
    }
  ],
  "correctOptionId": "START-VER-005-C",
  "explanation": "A passing replacement was fitted before training, supporting that the failed gauge was not used.",
  "verbalPassage": {
    "title": "Equipment record",
    "text": "A pressure gauge failed its morning check and was marked out of service. A second gauge passed the same check and was fitted to the unit before training began."
  }
}
```

#### START-VER-006

Source: [src/App.tsx:2638](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2638).

```json
{
  "questionId": "START-VER-006",
  "sessionType": "mechanical_starting_point",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "assumptions_conclusions",
  "concept": "scope_limit",
  "difficulty": "foundational",
  "stem": "Which conclusion is best supported?",
  "options": [
    {
      "optionId": "START-VER-006-A",
      "label": "A",
      "text": "All candidates in the pilot improved"
    },
    {
      "optionId": "START-VER-006-B",
      "label": "B",
      "text": "Most candidates in the pilot completed more questions after the change"
    },
    {
      "optionId": "START-VER-006-C",
      "label": "C",
      "text": "The change will help every future candidate"
    },
    {
      "optionId": "START-VER-006-D",
      "label": "D",
      "text": "The interface was the only factor affecting performance"
    }
  ],
  "correctOptionId": "START-VER-006-B",
  "explanation": "The evidence supports a statement about most participants in this pilot only.",
  "verbalPassage": {
    "title": "Pilot study",
    "text": "In a pilot involving 24 candidates, 18 completed more questions after the interface was simplified."
  }
}
```

### gearAssessmentQuestions

#### GEAR-AS-001

Source: [src/App.tsx:1953](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1953).

```json
{
  "questionId": "GEAR-AS-001",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "direct_mesh_direction",
  "difficulty": "applied",
  "stem": "Gear A turns anticlockwise. Which way does Gear B turn?",
  "options": [
    {
      "optionId": "GEAR-AS-001-A",
      "label": "A",
      "text": "It does not turn"
    },
    {
      "optionId": "GEAR-AS-001-B",
      "label": "B",
      "text": "Direction cannot be known"
    },
    {
      "optionId": "GEAR-AS-001-C",
      "label": "C",
      "text": "Clockwise"
    },
    {
      "optionId": "GEAR-AS-001-D",
      "label": "D",
      "text": "Anticlockwise"
    }
  ],
  "correctOptionId": "GEAR-AS-001-C",
  "explanation": "Directly meshed gears rotate in opposite directions."
}
```

#### GEAR-AS-002

Source: [src/App.tsx:1954](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1954).

```json
{
  "questionId": "GEAR-AS-002",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "three_gear_direction",
  "difficulty": "applied",
  "stem": "Gear A turns clockwise. Which way does Gear C turn?",
  "options": [
    {
      "optionId": "GEAR-AS-002-A",
      "label": "A",
      "text": "It depends on gear size"
    },
    {
      "optionId": "GEAR-AS-002-B",
      "label": "B",
      "text": "Clockwise"
    },
    {
      "optionId": "GEAR-AS-002-C",
      "label": "C",
      "text": "Anticlockwise"
    },
    {
      "optionId": "GEAR-AS-002-D",
      "label": "D",
      "text": "It cannot turn"
    }
  ],
  "correctOptionId": "GEAR-AS-002-B",
  "explanation": "Two gear contacts create two reversals, so Gear C turns the same way as Gear A."
}
```

#### GEAR-AS-003

Source: [src/App.tsx:1955](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1955).

```json
{
  "questionId": "GEAR-AS-003",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "four_gear_direction",
  "difficulty": "applied",
  "stem": "Gear A turns anticlockwise. Which way does Gear D turn?",
  "options": [
    {
      "optionId": "GEAR-AS-003-A",
      "label": "A",
      "text": "Clockwise"
    },
    {
      "optionId": "GEAR-AS-003-B",
      "label": "B",
      "text": "Anticlockwise"
    },
    {
      "optionId": "GEAR-AS-003-C",
      "label": "C",
      "text": "It cannot turn"
    },
    {
      "optionId": "GEAR-AS-003-D",
      "label": "D",
      "text": "It depends only on the largest gear"
    }
  ],
  "correctOptionId": "GEAR-AS-003-A",
  "explanation": "Three contacts create an odd number of reversals, so Gear D turns opposite to Gear A."
}
```

#### GEAR-AS-004

Source: [src/App.tsx:1956](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1956).

```json
{
  "questionId": "GEAR-AS-004",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "idler_effect",
  "difficulty": "applied",
  "stem": "An extra gear is inserted between Gear A and Gear C without changing A or C. What is the main effect on Gear C?",
  "options": [
    {
      "optionId": "GEAR-AS-004-A",
      "label": "A",
      "text": "Its speed always doubles"
    },
    {
      "optionId": "GEAR-AS-004-B",
      "label": "B",
      "text": "It stops turning"
    },
    {
      "optionId": "GEAR-AS-004-C",
      "label": "C",
      "text": "Its tooth count changes"
    },
    {
      "optionId": "GEAR-AS-004-D",
      "label": "D",
      "text": "Its rotation direction reverses"
    }
  ],
  "correctOptionId": "GEAR-AS-004-D",
  "explanation": "Adding one idler adds one extra direction reversal. With the first and last gear unchanged, it does not set the overall speed ratio."
}
```

#### GEAR-AS-005

Source: [src/App.tsx:1957](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1957).

```json
{
  "questionId": "GEAR-AS-005",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "small_to_large_speed",
  "difficulty": "applied",
  "stem": "A 15-tooth gear drives a 45-tooth gear. Which gear turns faster?",
  "options": [
    {
      "optionId": "GEAR-AS-005-A",
      "label": "A",
      "text": "They turn at the same speed"
    },
    {
      "optionId": "GEAR-AS-005-B",
      "label": "B",
      "text": "Speed cannot be compared"
    },
    {
      "optionId": "GEAR-AS-005-C",
      "label": "C",
      "text": "The 15-tooth gear"
    },
    {
      "optionId": "GEAR-AS-005-D",
      "label": "D",
      "text": "The 45-tooth gear"
    }
  ],
  "correctOptionId": "GEAR-AS-005-C",
  "explanation": "The smaller gear turns faster; the larger gear turns more slowly."
}
```

#### GEAR-AS-006

Source: [src/App.tsx:1958](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1958).

```json
{
  "questionId": "GEAR-AS-006",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "large_to_small_speed",
  "difficulty": "applied",
  "stem": "A 40-tooth gear drives a 10-tooth gear. Compared with the driver, the 10-tooth gear turns:",
  "options": [
    {
      "optionId": "GEAR-AS-006-A",
      "label": "A",
      "text": "Twice as fast"
    },
    {
      "optionId": "GEAR-AS-006-B",
      "label": "B",
      "text": "Four times faster"
    },
    {
      "optionId": "GEAR-AS-006-C",
      "label": "C",
      "text": "Four times slower"
    },
    {
      "optionId": "GEAR-AS-006-D",
      "label": "D",
      "text": "At the same speed"
    }
  ],
  "correctOptionId": "GEAR-AS-006-B",
  "explanation": "The driven gear has one quarter as many teeth, so it turns four times faster."
}
```

#### GEAR-AS-007

Source: [src/App.tsx:1959](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1959).

```json
{
  "questionId": "GEAR-AS-007",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "simple_ratio",
  "difficulty": "applied",
  "stem": "A 15-tooth driver turns at 120 rpm and drives a 45-tooth gear. What is the output speed?",
  "options": [
    {
      "optionId": "GEAR-AS-007-A",
      "label": "A",
      "text": "40 rpm"
    },
    {
      "optionId": "GEAR-AS-007-B",
      "label": "B",
      "text": "120 rpm"
    },
    {
      "optionId": "GEAR-AS-007-C",
      "label": "C",
      "text": "240 rpm"
    },
    {
      "optionId": "GEAR-AS-007-D",
      "label": "D",
      "text": "360 rpm"
    }
  ],
  "correctOptionId": "GEAR-AS-007-A",
  "explanation": "The driven gear has three times as many teeth, so it turns at one-third the speed: 40 rpm."
}
```

#### GEAR-AS-008

Source: [src/App.tsx:1960](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1960).

```json
{
  "questionId": "GEAR-AS-008",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "simple_ratio",
  "difficulty": "applied",
  "stem": "A 40-tooth driver turns at 50 rpm and drives a 10-tooth gear. What is the output speed?",
  "options": [
    {
      "optionId": "GEAR-AS-008-A",
      "label": "A",
      "text": "100 rpm"
    },
    {
      "optionId": "GEAR-AS-008-B",
      "label": "B",
      "text": "50 rpm"
    },
    {
      "optionId": "GEAR-AS-008-C",
      "label": "C",
      "text": "12.5 rpm"
    },
    {
      "optionId": "GEAR-AS-008-D",
      "label": "D",
      "text": "200 rpm"
    }
  ],
  "correctOptionId": "GEAR-AS-008-D",
  "explanation": "The driven gear has one quarter as many teeth, so it turns four times faster: 200 rpm."
}
```

#### GEAR-AS-009

Source: [src/App.tsx:1961](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1961).

```json
{
  "questionId": "GEAR-AS-009",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "direction_and_speed",
  "difficulty": "applied",
  "stem": "Gear A has 20 teeth and turns clockwise at 100 rpm. It directly drives 40-tooth Gear B. Which statement is correct?",
  "options": [
    {
      "optionId": "GEAR-AS-009-A",
      "label": "A",
      "text": "Gear B turns anticlockwise at 200 rpm"
    },
    {
      "optionId": "GEAR-AS-009-B",
      "label": "B",
      "text": "Gear B turns clockwise at 200 rpm"
    },
    {
      "optionId": "GEAR-AS-009-C",
      "label": "C",
      "text": "Gear B turns anticlockwise at 50 rpm"
    },
    {
      "optionId": "GEAR-AS-009-D",
      "label": "D",
      "text": "Gear B turns clockwise at 50 rpm"
    }
  ],
  "correctOptionId": "GEAR-AS-009-C",
  "explanation": "Direct contact reverses direction, and the 40-tooth driven gear turns at half the speed."
}
```

#### GEAR-AS-010

Source: [src/App.tsx:1962](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L1962).

```json
{
  "questionId": "GEAR-AS-010",
  "sessionType": "gear_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "idler_ratio",
  "difficulty": "applied",
  "stem": "Gear A has 20 teeth and turns clockwise at 120 rpm. It drives 10-tooth Gear B, which drives 40-tooth Gear C. Which statement about Gear C is correct?",
  "options": [
    {
      "optionId": "GEAR-AS-010-A",
      "label": "A",
      "text": "It turns clockwise at 240 rpm"
    },
    {
      "optionId": "GEAR-AS-010-B",
      "label": "B",
      "text": "It turns anticlockwise at 240 rpm"
    },
    {
      "optionId": "GEAR-AS-010-C",
      "label": "C",
      "text": "It turns clockwise at 60 rpm"
    },
    {
      "optionId": "GEAR-AS-010-D",
      "label": "D",
      "text": "It turns anticlockwise at 60 rpm"
    }
  ],
  "correctOptionId": "GEAR-AS-010-C",
  "explanation": "Two contacts mean Gear C turns the same way as Gear A. The overall ratio depends on A and C: 20 to 40 gives 60 rpm."
}
```

### pulleyAssessmentQuestions

#### PULL-AS-001

Source: [src/App.tsx:2040](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2040).

```json
{
  "questionId": "PULL-AS-001",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "system_recognition",
  "difficulty": "applied",
  "stem": "What is the main effect of the fixed pulley shown?",
  "options": [
    {
      "optionId": "PULL-AS-001-A",
      "label": "A",
      "text": "It changes the direction of effort"
    },
    {
      "optionId": "PULL-AS-001-B",
      "label": "B",
      "text": "It halves the required force"
    },
    {
      "optionId": "PULL-AS-001-C",
      "label": "C",
      "text": "It doubles the load"
    },
    {
      "optionId": "PULL-AS-001-D",
      "label": "D",
      "text": "It prevents rope movement"
    }
  ],
  "correctOptionId": "PULL-AS-001-A",
  "explanation": "A single fixed pulley mainly changes effort direction."
}
```

#### PULL-AS-002

Source: [src/App.tsx:2041](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2041).

```json
{
  "questionId": "PULL-AS-002",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "supporting_strands",
  "difficulty": "applied",
  "stem": "How many rope sections directly support the moving block?",
  "options": [
    {
      "optionId": "PULL-AS-002-A",
      "label": "A",
      "text": "1"
    },
    {
      "optionId": "PULL-AS-002-B",
      "label": "B",
      "text": "3"
    },
    {
      "optionId": "PULL-AS-002-C",
      "label": "C",
      "text": "4"
    },
    {
      "optionId": "PULL-AS-002-D",
      "label": "D",
      "text": "2"
    }
  ],
  "correctOptionId": "PULL-AS-002-D",
  "explanation": "Two rope sections support the moving block."
}
```

#### PULL-AS-003

Source: [src/App.tsx:2042](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2042).

```json
{
  "questionId": "PULL-AS-003",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "supporting_strands",
  "difficulty": "applied",
  "stem": "What is the ideal mechanical advantage of the pulley arrangement shown?",
  "options": [
    {
      "optionId": "PULL-AS-003-A",
      "label": "A",
      "text": "2"
    },
    {
      "optionId": "PULL-AS-003-B",
      "label": "B",
      "text": "6"
    },
    {
      "optionId": "PULL-AS-003-C",
      "label": "C",
      "text": "3"
    },
    {
      "optionId": "PULL-AS-003-D",
      "label": "D",
      "text": "1"
    }
  ],
  "correctOptionId": "PULL-AS-003-C",
  "explanation": "Three supporting strands give an ideal mechanical advantage of three."
}
```

#### PULL-AS-004

Source: [src/App.tsx:2043](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2043).

```json
{
  "questionId": "PULL-AS-004",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "supporting_strands",
  "difficulty": "applied",
  "stem": "What is the ideal mechanical advantage of this block-and-tackle?",
  "options": [
    {
      "optionId": "PULL-AS-004-A",
      "label": "A",
      "text": "8"
    },
    {
      "optionId": "PULL-AS-004-B",
      "label": "B",
      "text": "4"
    },
    {
      "optionId": "PULL-AS-004-C",
      "label": "C",
      "text": "2"
    },
    {
      "optionId": "PULL-AS-004-D",
      "label": "D",
      "text": "6"
    }
  ],
  "correctOptionId": "PULL-AS-004-B",
  "explanation": "Four rope sections support the moving block."
}
```

#### PULL-AS-005

Source: [src/App.tsx:2044](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2044).

```json
{
  "questionId": "PULL-AS-005",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "force",
  "difficulty": "applied",
  "stem": "A 360 N load is supported by three rope sections. What ideal effort is required?",
  "options": [
    {
      "optionId": "PULL-AS-005-A",
      "label": "A",
      "text": "120 N"
    },
    {
      "optionId": "PULL-AS-005-B",
      "label": "B",
      "text": "180 N"
    },
    {
      "optionId": "PULL-AS-005-C",
      "label": "C",
      "text": "360 N"
    },
    {
      "optionId": "PULL-AS-005-D",
      "label": "D",
      "text": "1080 N"
    }
  ],
  "correctOptionId": "PULL-AS-005-A",
  "explanation": "360 ÷ 3 = 120 N."
}
```

#### PULL-AS-006

Source: [src/App.tsx:2045](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2045).

```json
{
  "questionId": "PULL-AS-006",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "force",
  "difficulty": "applied",
  "stem": "A 500 N load is supported by four rope sections. What ideal effort is required?",
  "options": [
    {
      "optionId": "PULL-AS-006-A",
      "label": "A",
      "text": "250 N"
    },
    {
      "optionId": "PULL-AS-006-B",
      "label": "B",
      "text": "500 N"
    },
    {
      "optionId": "PULL-AS-006-C",
      "label": "C",
      "text": "2000 N"
    },
    {
      "optionId": "PULL-AS-006-D",
      "label": "D",
      "text": "125 N"
    }
  ],
  "correctOptionId": "PULL-AS-006-D",
  "explanation": "500 ÷ 4 = 125 N."
}
```

#### PULL-AS-007

Source: [src/App.tsx:2046](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2046).

```json
{
  "questionId": "PULL-AS-007",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "distance",
  "difficulty": "applied",
  "stem": "A four-strand system raises a load by 1.5 m. Approximately how much rope is pulled ideally?",
  "options": [
    {
      "optionId": "PULL-AS-007-A",
      "label": "A",
      "text": "3 m"
    },
    {
      "optionId": "PULL-AS-007-B",
      "label": "B",
      "text": "0.375 m"
    },
    {
      "optionId": "PULL-AS-007-C",
      "label": "C",
      "text": "6 m"
    },
    {
      "optionId": "PULL-AS-007-D",
      "label": "D",
      "text": "1.5 m"
    }
  ],
  "correctOptionId": "PULL-AS-007-C",
  "explanation": "1.5 × 4 = 6 m of rope movement."
}
```

#### PULL-AS-008

Source: [src/App.tsx:2047](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2047).

```json
{
  "questionId": "PULL-AS-008",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "anchor_point",
  "difficulty": "applied",
  "stem": "One rope end is attached to the moving block and two other sections support it. What is the ideal mechanical advantage?",
  "options": [
    {
      "optionId": "PULL-AS-008-A",
      "label": "A",
      "text": "4"
    },
    {
      "optionId": "PULL-AS-008-B",
      "label": "B",
      "text": "3"
    },
    {
      "optionId": "PULL-AS-008-C",
      "label": "C",
      "text": "2"
    },
    {
      "optionId": "PULL-AS-008-D",
      "label": "D",
      "text": "1"
    }
  ],
  "correctOptionId": "PULL-AS-008-B",
  "explanation": "The anchored end counts because it directly supports the moving block."
}
```

#### PULL-AS-009

Source: [src/App.tsx:2048](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2048).

```json
{
  "questionId": "PULL-AS-009",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "fixed_vs_movable",
  "difficulty": "applied",
  "stem": "A fixed pulley is added only to redirect the free end of a two-strand movable-pulley system. What is the ideal mechanical advantage?",
  "options": [
    {
      "optionId": "PULL-AS-009-A",
      "label": "A",
      "text": "2"
    },
    {
      "optionId": "PULL-AS-009-B",
      "label": "B",
      "text": "3"
    },
    {
      "optionId": "PULL-AS-009-C",
      "label": "C",
      "text": "1"
    },
    {
      "optionId": "PULL-AS-009-D",
      "label": "D",
      "text": "4"
    }
  ],
  "correctOptionId": "PULL-AS-009-A",
  "explanation": "The fixed pulley changes direction but adds no extra supporting strand."
}
```

#### PULL-AS-010

Source: [src/App.tsx:2049](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2049).

```json
{
  "questionId": "PULL-AS-010",
  "sessionType": "pulley_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "integrated",
  "difficulty": "applied",
  "stem": "A person pulls 4 m of rope to raise a 400 N load by 1 m in an ideal system. Which statement best fits?",
  "options": [
    {
      "optionId": "PULL-AS-010-A",
      "label": "A",
      "text": "The system has mechanical advantage 4 and needs about 100 N effort"
    },
    {
      "optionId": "PULL-AS-010-B",
      "label": "B",
      "text": "The system has mechanical advantage 1 and needs 400 N effort"
    },
    {
      "optionId": "PULL-AS-010-C",
      "label": "C",
      "text": "The system has mechanical advantage 2 and needs 200 N effort"
    },
    {
      "optionId": "PULL-AS-010-D",
      "label": "D",
      "text": "The system has mechanical advantage 8 and needs 50 N effort"
    }
  ],
  "correctOptionId": "PULL-AS-010-A",
  "explanation": "A 4:1 distance ratio indicates mechanical advantage 4, so ideal effort is 400 ÷ 4 = 100 N."
}
```

### leverAssessmentQuestions

#### LEV-AS-001

Source: [src/App.tsx:2127](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2127).

```json
{
  "questionId": "LEV-AS-001",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "system_recognition",
  "difficulty": "applied",
  "stem": "Which point in a lever is the pivot?",
  "options": [
    {
      "optionId": "LEV-AS-001-A",
      "label": "A",
      "text": "The effort"
    },
    {
      "optionId": "LEV-AS-001-B",
      "label": "B",
      "text": "The longest arm"
    },
    {
      "optionId": "LEV-AS-001-C",
      "label": "C",
      "text": "The fulcrum"
    },
    {
      "optionId": "LEV-AS-001-D",
      "label": "D",
      "text": "The load"
    }
  ],
  "correctOptionId": "LEV-AS-001-C",
  "explanation": "The fulcrum is the pivot point."
}
```

#### LEV-AS-002

Source: [src/App.tsx:2128](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2128).

```json
{
  "questionId": "LEV-AS-002",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "easiest_setup",
  "difficulty": "applied",
  "stem": "Which setup gives the greatest ideal force advantage?",
  "options": [
    {
      "optionId": "LEV-AS-002-A",
      "label": "A",
      "text": "No fulcrum"
    },
    {
      "optionId": "LEV-AS-002-B",
      "label": "B",
      "text": "Longest effort arm with shortest load arm"
    },
    {
      "optionId": "LEV-AS-002-C",
      "label": "C",
      "text": "Shortest effort arm with longest load arm"
    },
    {
      "optionId": "LEV-AS-002-D",
      "label": "D",
      "text": "Equal arms with effort at the fulcrum"
    }
  ],
  "correctOptionId": "LEV-AS-002-B",
  "explanation": "The greatest force advantage comes from a long effort arm and short load arm."
}
```

#### LEV-AS-003

Source: [src/App.tsx:2129](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2129).

```json
{
  "questionId": "LEV-AS-003",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "fulcrum_position",
  "difficulty": "applied",
  "stem": "What happens when the fulcrum is moved closer to the load?",
  "options": [
    {
      "optionId": "LEV-AS-003-A",
      "label": "A",
      "text": "The effort needed usually decreases"
    },
    {
      "optionId": "LEV-AS-003-B",
      "label": "B",
      "text": "The effort needed always increases"
    },
    {
      "optionId": "LEV-AS-003-C",
      "label": "C",
      "text": "Mechanical advantage becomes zero"
    },
    {
      "optionId": "LEV-AS-003-D",
      "label": "D",
      "text": "The load must move farther than the effort"
    }
  ],
  "correctOptionId": "LEV-AS-003-A",
  "explanation": "A shorter load arm increases mechanical advantage."
}
```

#### LEV-AS-004

Source: [src/App.tsx:2130](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2130).

```json
{
  "questionId": "LEV-AS-004",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "force",
  "difficulty": "applied",
  "stem": "A 360 N load is 0.5 m from the fulcrum. Effort is applied 1.5 m away. What effort is needed?",
  "options": [
    {
      "optionId": "LEV-AS-004-A",
      "label": "A",
      "text": "180 N"
    },
    {
      "optionId": "LEV-AS-004-B",
      "label": "B",
      "text": "360 N"
    },
    {
      "optionId": "LEV-AS-004-C",
      "label": "C",
      "text": "1080 N"
    },
    {
      "optionId": "LEV-AS-004-D",
      "label": "D",
      "text": "120 N"
    }
  ],
  "correctOptionId": "LEV-AS-004-D",
  "explanation": "360 × 0.5 = 180 N·m. 180 ÷ 1.5 = 120 N."
}
```

#### LEV-AS-005

Source: [src/App.tsx:2131](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2131).

```json
{
  "questionId": "LEV-AS-005",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "balance",
  "difficulty": "applied",
  "stem": "A 250 N load acts 1.2 m from the fulcrum. What force 3 m away balances it?",
  "options": [
    {
      "optionId": "LEV-AS-005-A",
      "label": "A",
      "text": "625 N"
    },
    {
      "optionId": "LEV-AS-005-B",
      "label": "B",
      "text": "60 N"
    },
    {
      "optionId": "LEV-AS-005-C",
      "label": "C",
      "text": "100 N"
    },
    {
      "optionId": "LEV-AS-005-D",
      "label": "D",
      "text": "250 N"
    }
  ],
  "correctOptionId": "LEV-AS-005-C",
  "explanation": "250 × 1.2 = 300 N·m. 300 ÷ 3 = 100 N."
}
```

#### LEV-AS-006

Source: [src/App.tsx:2132](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2132).

```json
{
  "questionId": "LEV-AS-006",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "arm_ratio",
  "difficulty": "applied",
  "stem": "The effort arm is 4 m and the load arm is 1 m. What is the ideal mechanical advantage?",
  "options": [
    {
      "optionId": "LEV-AS-006-A",
      "label": "A",
      "text": "8"
    },
    {
      "optionId": "LEV-AS-006-B",
      "label": "B",
      "text": "4"
    },
    {
      "optionId": "LEV-AS-006-C",
      "label": "C",
      "text": "2"
    },
    {
      "optionId": "LEV-AS-006-D",
      "label": "D",
      "text": "1"
    }
  ],
  "correctOptionId": "LEV-AS-006-B",
  "explanation": "4 ÷ 1 = 4."
}
```

#### LEV-AS-007

Source: [src/App.tsx:2133](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2133).

```json
{
  "questionId": "LEV-AS-007",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "lever_class",
  "difficulty": "applied",
  "stem": "Which arrangement is a second-class lever?",
  "options": [
    {
      "optionId": "LEV-AS-007-A",
      "label": "A",
      "text": "The load lies between fulcrum and effort"
    },
    {
      "optionId": "LEV-AS-007-B",
      "label": "B",
      "text": "The fulcrum lies between load and effort"
    },
    {
      "optionId": "LEV-AS-007-C",
      "label": "C",
      "text": "The effort lies between fulcrum and load"
    },
    {
      "optionId": "LEV-AS-007-D",
      "label": "D",
      "text": "The lever has two fulcrums"
    }
  ],
  "correctOptionId": "LEV-AS-007-A",
  "explanation": "A second-class lever has the load between fulcrum and effort."
}
```

#### LEV-AS-008

Source: [src/App.tsx:2134](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2134).

```json
{
  "questionId": "LEV-AS-008",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "movement_direction",
  "difficulty": "applied",
  "stem": "The effort end of a first-class lever moves downward. What happens to the load end?",
  "options": [
    {
      "optionId": "LEV-AS-008-A",
      "label": "A",
      "text": "It also moves downward"
    },
    {
      "optionId": "LEV-AS-008-B",
      "label": "B",
      "text": "It stays fixed"
    },
    {
      "optionId": "LEV-AS-008-C",
      "label": "C",
      "text": "It moves only toward the fulcrum"
    },
    {
      "optionId": "LEV-AS-008-D",
      "label": "D",
      "text": "It moves upward"
    }
  ],
  "correctOptionId": "LEV-AS-008-D",
  "explanation": "Rotation about the fulcrum moves the opposite end upward."
}
```

#### LEV-AS-009

Source: [src/App.tsx:2135](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2135).

```json
{
  "questionId": "LEV-AS-009",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "distance",
  "difficulty": "applied",
  "stem": "An ideal lever has mechanical advantage 3. If the load rises 0.4 m, about how far does the effort end move?",
  "options": [
    {
      "optionId": "LEV-AS-009-A",
      "label": "A",
      "text": "0.13 m"
    },
    {
      "optionId": "LEV-AS-009-B",
      "label": "B",
      "text": "3.4 m"
    },
    {
      "optionId": "LEV-AS-009-C",
      "label": "C",
      "text": "1.2 m"
    },
    {
      "optionId": "LEV-AS-009-D",
      "label": "D",
      "text": "0.4 m"
    }
  ],
  "correctOptionId": "LEV-AS-009-C",
  "explanation": "A three-to-one force advantage requires about three times the effort movement distance: 1.2 m."
}
```

#### LEV-AS-010

Source: [src/App.tsx:2136](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2136).

```json
{
  "questionId": "LEV-AS-010",
  "sessionType": "lever_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "integrated",
  "difficulty": "applied",
  "stem": "A 600 N load is 0.5 m from the fulcrum. A 100 N effort is applied on the other side. How far from the fulcrum must the effort act to balance?",
  "options": [
    {
      "optionId": "LEV-AS-010-A",
      "label": "A",
      "text": "1 m"
    },
    {
      "optionId": "LEV-AS-010-B",
      "label": "B",
      "text": "0.3 m"
    },
    {
      "optionId": "LEV-AS-010-C",
      "label": "C",
      "text": "3 m"
    },
    {
      "optionId": "LEV-AS-010-D",
      "label": "D",
      "text": "6 m"
    }
  ],
  "correctOptionId": "LEV-AS-010-C",
  "explanation": "The load moment is 300 N·m. 300 ÷ 100 = 3 m."
}
```

### mixedMechanicalAssessmentQuestions

#### MMA-GEAR-001

Source: [src/App.tsx:2186](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2186).

```json
{
  "questionId": "MMA-GEAR-001",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "direction",
  "difficulty": "applied",
  "stem": "Gear A turns clockwise. Which way does Gear D turn?",
  "options": [
    {
      "optionId": "MMA-GEAR-001-A",
      "label": "A",
      "text": "Anticlockwise"
    },
    {
      "optionId": "MMA-GEAR-001-B",
      "label": "B",
      "text": "It does not turn"
    },
    {
      "optionId": "MMA-GEAR-001-C",
      "label": "C",
      "text": "Direction cannot be known"
    },
    {
      "optionId": "MMA-GEAR-001-D",
      "label": "D",
      "text": "Clockwise"
    }
  ],
  "correctOptionId": "MMA-GEAR-001-A",
  "explanation": "Four gears create three direct contacts, so the final gear turns opposite to the driver."
}
```

#### MMA-HYD-001

Source: [src/App.tsx:2187](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2187).

```json
{
  "questionId": "MMA-HYD-001",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "hydraulics",
  "concept": "area_force",
  "difficulty": "applied",
  "stem": "The same fluid pressure acts on both pistons. The output piston has twice the area of the input piston. Compared with the input force, the output force is ideally:",
  "options": [
    {
      "optionId": "MMA-HYD-001-A",
      "label": "A",
      "text": "Zero"
    },
    {
      "optionId": "MMA-HYD-001-B",
      "label": "B",
      "text": "Twice as large"
    },
    {
      "optionId": "MMA-HYD-001-C",
      "label": "C",
      "text": "Half as large"
    },
    {
      "optionId": "MMA-HYD-001-D",
      "label": "D",
      "text": "The same"
    }
  ],
  "correctOptionId": "MMA-HYD-001-B",
  "explanation": "In an ideal sealed hydraulic system, the same pressure is transmitted through the fluid. Force equals pressure × piston area, so doubling the output area doubles the force. The output force is therefore twice as large."
}
```

#### MMA-LEV-001

Source: [src/App.tsx:2189](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2189).

```json
{
  "questionId": "MMA-LEV-001",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "balance_force",
  "difficulty": "applied",
  "stem": "A 600 N load acts 0.5 m from the fulcrum. The effort is applied 2 m from the fulcrum. What effort balances the load?",
  "options": [
    {
      "optionId": "MMA-LEV-001-A",
      "label": "A",
      "text": "300 N"
    },
    {
      "optionId": "MMA-LEV-001-B",
      "label": "B",
      "text": "600 N"
    },
    {
      "optionId": "MMA-LEV-001-C",
      "label": "C",
      "text": "1200 N"
    },
    {
      "optionId": "MMA-LEV-001-D",
      "label": "D",
      "text": "150 N"
    }
  ],
  "correctOptionId": "MMA-LEV-001-D",
  "explanation": "A balanced lever has equal moments about the fulcrum. The load moment is 600 N × 0.5 m = 300 N·m. The effort acts 2 m away, so 300 ÷ 2 = 150 N."
}
```

#### MMA-HYD-003

Source: [src/App.tsx:2194](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2194).

```json
{
  "questionId": "MMA-HYD-003",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "hydraulics",
  "concept": "pressure_force",
  "difficulty": "applied",
  "stem": "The fluid pressure is 50 kPa and the piston area is 0.02 m². What force is produced?",
  "options": [
    {
      "optionId": "MMA-HYD-003-A",
      "label": "A",
      "text": "2500 N"
    },
    {
      "optionId": "MMA-HYD-003-B",
      "label": "B",
      "text": "100 N"
    },
    {
      "optionId": "MMA-HYD-003-C",
      "label": "C",
      "text": "25 N"
    },
    {
      "optionId": "MMA-HYD-003-D",
      "label": "D",
      "text": "1000 N"
    }
  ],
  "correctOptionId": "MMA-HYD-003-D",
  "explanation": "Pressure × area = force. First convert 50 kPa to 50,000 Pa. Then F = P × A = 50,000 × 0.02 = 1000 N. When pressure is in pascals and area is in m², the result is force in newtons."
}
```

#### MMA-PULL-003

Source: [src/App.tsx:2197](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2197).

```json
{
  "questionId": "MMA-PULL-003",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "force",
  "difficulty": "applied",
  "stem": "Study the pulley arrangement shown. Approximately what effort is needed to support the 600 N load ideally?",
  "options": [
    {
      "optionId": "MMA-PULL-003-A",
      "label": "A",
      "text": "300 N"
    },
    {
      "optionId": "MMA-PULL-003-B",
      "label": "B",
      "text": "600 N"
    },
    {
      "optionId": "MMA-PULL-003-C",
      "label": "C",
      "text": "1800 N"
    },
    {
      "optionId": "MMA-PULL-003-D",
      "label": "D",
      "text": "200 N"
    }
  ],
  "correctOptionId": "MMA-PULL-003-D",
  "explanation": "The diagram shows three rope sections directly supporting the moving load. In an ideal system they share the load, giving a mechanical advantage of 3. Therefore 600 N ÷ 3 = 200 N effort."
}
```

#### MMA-GEAR-004

Source: [src/App.tsx:2198](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2198).

```json
{
  "questionId": "MMA-GEAR-004",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "direction_speed",
  "difficulty": "applied",
  "stem": "A 40-tooth gear drives a 10-tooth gear. Compared with the driver, the output gear turns:",
  "options": [
    {
      "optionId": "MMA-GEAR-004-A",
      "label": "A",
      "text": "Four times faster in the opposite direction"
    },
    {
      "optionId": "MMA-GEAR-004-B",
      "label": "B",
      "text": "Four times slower in the same direction"
    },
    {
      "optionId": "MMA-GEAR-004-C",
      "label": "C",
      "text": "At the same speed in the opposite direction"
    },
    {
      "optionId": "MMA-GEAR-004-D",
      "label": "D",
      "text": "Twice as fast in the same direction"
    }
  ],
  "correctOptionId": "MMA-GEAR-004-A",
  "explanation": "Directly meshed gears rotate in opposite directions. The driven gear has one-quarter as many teeth, so it must turn four times for each driver revolution. It therefore turns four times faster in the opposite direction."
}
```

#### MMA-PULL-004

Source: [src/App.tsx:2199](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2199).

```json
{
  "questionId": "MMA-PULL-004",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "load_capacity",
  "difficulty": "applied",
  "stem": "A person pulls with 100 N in an ideal system with four supporting rope sections. What load can be supported?",
  "options": [
    {
      "optionId": "MMA-PULL-004-A",
      "label": "A",
      "text": "25 N"
    },
    {
      "optionId": "MMA-PULL-004-B",
      "label": "B",
      "text": "800 N"
    },
    {
      "optionId": "MMA-PULL-004-C",
      "label": "C",
      "text": "400 N"
    },
    {
      "optionId": "MMA-PULL-004-D",
      "label": "D",
      "text": "100 N"
    }
  ],
  "correctOptionId": "MMA-PULL-004-C",
  "explanation": "Four supporting sections provide an ideal mechanical advantage of four: 100 × 4 = 400 N."
}
```

#### MMA-HYD-004

Source: [src/App.tsx:2200](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2200).

```json
{
  "questionId": "MMA-HYD-004",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "hydraulics",
  "concept": "force_ratio",
  "difficulty": "applied",
  "stem": "A 100 N force acts on a 2 cm² input piston. The output piston area is 10 cm². What is the ideal output force?",
  "options": [
    {
      "optionId": "MMA-HYD-004-A",
      "label": "A",
      "text": "1000 N"
    },
    {
      "optionId": "MMA-HYD-004-B",
      "label": "B",
      "text": "20 N"
    },
    {
      "optionId": "MMA-HYD-004-C",
      "label": "C",
      "text": "500 N"
    },
    {
      "optionId": "MMA-HYD-004-D",
      "label": "D",
      "text": "200 N"
    }
  ],
  "correctOptionId": "MMA-HYD-004-C",
  "explanation": "The input pressure is 100 N ÷ 2 cm² = 50 N/cm². The same pressure reaches the output piston. Applying 50 N/cm² across 10 cm² gives 500 N, so the ideal output force is 500 N."
}
```

#### MMA-LEV-004

Source: [src/App.tsx:2201](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2201).

```json
{
  "questionId": "MMA-LEV-004",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "balance",
  "difficulty": "applied",
  "stem": "A 100 N effort acts 3 m from the fulcrum. What load can be balanced 1 m from the fulcrum?",
  "options": [
    {
      "optionId": "MMA-LEV-004-A",
      "label": "A",
      "text": "300 N"
    },
    {
      "optionId": "MMA-LEV-004-B",
      "label": "B",
      "text": "100 N"
    },
    {
      "optionId": "MMA-LEV-004-C",
      "label": "C",
      "text": "33 N"
    },
    {
      "optionId": "MMA-LEV-004-D",
      "label": "D",
      "text": "600 N"
    }
  ],
  "correctOptionId": "MMA-LEV-004-A",
  "explanation": "For balance, the moments on the two sides of the fulcrum must be equal. The effort produces 100 N × 3 m = 300 N·m. At a 1 m load arm, that balances a 300 N load."
}
```

#### MMA-LEV-005

Source: [src/App.tsx:2202](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2202).

```json
{
  "questionId": "MMA-LEV-005",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "arm_ratio",
  "difficulty": "applied",
  "stem": "The effort arm is 4 m and the load arm is 1 m. What is the ideal mechanical advantage?",
  "options": [
    {
      "optionId": "MMA-LEV-005-A",
      "label": "A",
      "text": "2"
    },
    {
      "optionId": "MMA-LEV-005-B",
      "label": "B",
      "text": "1"
    },
    {
      "optionId": "MMA-LEV-005-C",
      "label": "C",
      "text": "8"
    },
    {
      "optionId": "MMA-LEV-005-D",
      "label": "D",
      "text": "4"
    }
  ],
  "correctOptionId": "MMA-LEV-005-D",
  "explanation": "Ideal mechanical advantage equals effort-arm length divided by load-arm length: 4 ÷ 1 = 4."
}
```

#### MMA-GEAR-005

Source: [src/App.tsx:2203](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2203).

```json
{
  "questionId": "MMA-GEAR-005",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "idler_ratio",
  "difficulty": "applied",
  "stem": "A 20-tooth driver turns through an idler and drives a 60-tooth output gear. Compared with the driver, the output turns:",
  "options": [
    {
      "optionId": "MMA-GEAR-005-A",
      "label": "A",
      "text": "In the opposite direction at three times the speed"
    },
    {
      "optionId": "MMA-GEAR-005-B",
      "label": "B",
      "text": "In the same direction at three times the speed"
    },
    {
      "optionId": "MMA-GEAR-005-C",
      "label": "C",
      "text": "In the opposite direction at the same speed"
    },
    {
      "optionId": "MMA-GEAR-005-D",
      "label": "D",
      "text": "In the same direction at one-third the speed"
    }
  ],
  "correctOptionId": "MMA-GEAR-005-D",
  "explanation": "There are two gear contacts, so direction reverses twice and the output turns in the same direction as the driver. The idler does not change the overall ratio: 20 teeth driving 60 gives one-third the speed."
}
```

#### MMA-PULL-005

Source: [src/App.tsx:2204](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2204).

```json
{
  "questionId": "MMA-PULL-005",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "distance_tradeoff",
  "difficulty": "applied",
  "stem": "Study the pulley arrangement shown. If the load rises 0.5 m, how much rope must be pulled ideally?",
  "options": [
    {
      "optionId": "MMA-PULL-005-A",
      "label": "A",
      "text": "4 m"
    },
    {
      "optionId": "MMA-PULL-005-B",
      "label": "B",
      "text": "2 m"
    },
    {
      "optionId": "MMA-PULL-005-C",
      "label": "C",
      "text": "0.5 m"
    },
    {
      "optionId": "MMA-PULL-005-D",
      "label": "D",
      "text": "0.125 m"
    }
  ],
  "correctOptionId": "MMA-PULL-005-B",
  "explanation": "The diagram shows four rope sections supporting the moving load, so the ideal mechanical advantage is 4. Force advantage is exchanged for distance: the rope must move four times the load distance. 4 × 0.5 m = 2 m."
}
```

#### MMA-HYD-005

Source: [src/App.tsx:2205](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2205).

```json
{
  "questionId": "MMA-HYD-005",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "hydraulics",
  "concept": "distance_tradeoff",
  "difficulty": "applied",
  "stem": "A hydraulic system provides a four-to-one force advantage. Ideally, how far must the input piston move compared with the output piston?",
  "options": [
    {
      "optionId": "MMA-HYD-005-A",
      "label": "A",
      "text": "Distance is unrelated to force advantage"
    },
    {
      "optionId": "MMA-HYD-005-B",
      "label": "B",
      "text": "Four times as far"
    },
    {
      "optionId": "MMA-HYD-005-C",
      "label": "C",
      "text": "One-quarter as far"
    },
    {
      "optionId": "MMA-HYD-005-D",
      "label": "D",
      "text": "The same distance"
    }
  ],
  "correctOptionId": "MMA-HYD-005-B",
  "explanation": "A four-to-one force advantage requires the input side to move about four times the output distance."
}
```

#### MMA-PULL-006

Source: [src/App.tsx:2206](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2206).

```json
{
  "questionId": "MMA-PULL-006",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "pulleys",
  "concept": "support_relationship",
  "difficulty": "applied",
  "stem": "Study the pulley arrangement shown. What determines the ideal mechanical advantage of this system?",
  "options": [
    {
      "optionId": "MMA-PULL-006-A",
      "label": "A",
      "text": "The three supporting rope sections"
    },
    {
      "optionId": "MMA-PULL-006-B",
      "label": "B",
      "text": "The angle of the drawing"
    },
    {
      "optionId": "MMA-PULL-006-C",
      "label": "C",
      "text": "The colour of the rope"
    },
    {
      "optionId": "MMA-PULL-006-D",
      "label": "D",
      "text": "The number of fixed supports above"
    }
  ],
  "correctOptionId": "MMA-PULL-006-A",
  "explanation": "Ideal mechanical advantage depends on the rope sections directly supporting the moving load, not the diagram orientation."
}
```

#### MMA-LEV-006

Source: [src/App.tsx:2207](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2207).

```json
{
  "questionId": "MMA-LEV-006",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "levers",
  "concept": "integrated",
  "difficulty": "applied",
  "stem": "A 400 N load acts 0.75 m from the fulcrum. A 100 N effort is used on the other side. How far from the fulcrum must the effort act to balance?",
  "options": [
    {
      "optionId": "MMA-LEV-006-A",
      "label": "A",
      "text": "0.75 m"
    },
    {
      "optionId": "MMA-LEV-006-B",
      "label": "B",
      "text": "4 m"
    },
    {
      "optionId": "MMA-LEV-006-C",
      "label": "C",
      "text": "3 m"
    },
    {
      "optionId": "MMA-LEV-006-D",
      "label": "D",
      "text": "1.5 m"
    }
  ],
  "correctOptionId": "MMA-LEV-006-C",
  "explanation": "The load moment is 400 × 0.75 = 300 N·m. A 100 N effort therefore needs a 3 m arm."
}
```

#### MMA-GEAR-006

Source: [src/App.tsx:2209](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2209).

```json
{
  "questionId": "MMA-GEAR-006",
  "sessionType": "mixed_mechanical_assessment",
  "pathwayId": "fire_service",
  "domain": "mechanical",
  "subcompetency": "gears",
  "concept": "integrated",
  "difficulty": "applied",
  "stem": "A 15-tooth gear drives two idlers and then a 45-tooth output gear. Compared with the driver, the output turns:",
  "options": [
    {
      "optionId": "MMA-GEAR-006-A",
      "label": "A",
      "text": "In the same direction at one-third the speed"
    },
    {
      "optionId": "MMA-GEAR-006-B",
      "label": "B",
      "text": "In the opposite direction at three times the speed"
    },
    {
      "optionId": "MMA-GEAR-006-C",
      "label": "C",
      "text": "In the opposite direction at one-third the speed"
    },
    {
      "optionId": "MMA-GEAR-006-D",
      "label": "D",
      "text": "In the same direction at three times the speed"
    }
  ],
  "correctOptionId": "MMA-GEAR-006-C",
  "explanation": "Three direct contacts reverse the final direction. The 45-tooth output turns at one-third the speed of the 15-tooth driver."
}
```

### numericalAssessmentQuestions

#### NUM-A-001

Source: [src/App.tsx:2342](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2342).

```json
{
  "questionId": "NUM-A-001",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "tables_data",
  "concept": "table_percentage",
  "difficulty": "applied",
  "stem": "Which station had the highest completion rate?",
  "options": [
    {
      "optionId": "NUM-A-001-A",
      "label": "A",
      "text": "Station C"
    },
    {
      "optionId": "NUM-A-001-B",
      "label": "B",
      "text": "Station A"
    },
    {
      "optionId": "NUM-A-001-C",
      "label": "C",
      "text": "Station B"
    },
    {
      "optionId": "NUM-A-001-D",
      "label": "D",
      "text": "Station D"
    }
  ],
  "correctOptionId": "NUM-A-001-A",
  "explanation": "A = 42/50 = 84%; B = 54/72 = 75%; C = 38/40 = 95%; D = 63/75 = 84%.",
  "dataTable": {
    "headers": [
      "Station",
      "Assigned",
      "Completed"
    ],
    "rows": [
      [
        "A",
        "50",
        "42"
      ],
      [
        "B",
        "72",
        "54"
      ],
      [
        "C",
        "40",
        "38"
      ],
      [
        "D",
        "75",
        "63"
      ]
    ]
  }
}
```

#### NUM-A-003

Source: [src/App.tsx:2343](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2343).

```json
{
  "questionId": "NUM-A-003",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "rates_proportion",
  "concept": "unit_rate",
  "difficulty": "applied",
  "stem": "A vehicle travels 270 km in 4.5 hours. What is its average speed?",
  "options": [
    {
      "optionId": "NUM-A-003-A",
      "label": "A",
      "text": "65 km/h"
    },
    {
      "optionId": "NUM-A-003-B",
      "label": "B",
      "text": "75 km/h"
    },
    {
      "optionId": "NUM-A-003-C",
      "label": "C",
      "text": "60 km/h"
    },
    {
      "optionId": "NUM-A-003-D",
      "label": "D",
      "text": "55 km/h"
    }
  ],
  "correctOptionId": "NUM-A-003-C",
  "explanation": "270 ÷ 4.5 = 60 km/h."
}
```

#### NUM-A-007

Source: [src/App.tsx:2344](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2344).

```json
{
  "questionId": "NUM-A-007",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "percentages_ratios",
  "concept": "percentage_decrease",
  "difficulty": "applied",
  "stem": "A value of 150 is reduced by 20%. What remains?",
  "options": [
    {
      "optionId": "NUM-A-007-A",
      "label": "A",
      "text": "125"
    },
    {
      "optionId": "NUM-A-007-B",
      "label": "B",
      "text": "100"
    },
    {
      "optionId": "NUM-A-007-C",
      "label": "C",
      "text": "120"
    },
    {
      "optionId": "NUM-A-007-D",
      "label": "D",
      "text": "130"
    }
  ],
  "correctOptionId": "NUM-A-007-C",
  "explanation": "20% of 150 is 30, leaving 120."
}
```

#### NUM-A-010

Source: [src/App.tsx:2345](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2345).

```json
{
  "questionId": "NUM-A-010",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "percentages_ratios",
  "concept": "ratio_sharing",
  "difficulty": "applied",
  "stem": "Two quantities are in the ratio 4:7 and total 99. What is the smaller quantity?",
  "options": [
    {
      "optionId": "NUM-A-010-A",
      "label": "A",
      "text": "36"
    },
    {
      "optionId": "NUM-A-010-B",
      "label": "B",
      "text": "63"
    },
    {
      "optionId": "NUM-A-010-C",
      "label": "C",
      "text": "44"
    },
    {
      "optionId": "NUM-A-010-D",
      "label": "D",
      "text": "55"
    }
  ],
  "correctOptionId": "NUM-A-010-A",
  "explanation": "There are 11 parts, each worth 9. The smaller quantity is 4 × 9 = 36."
}
```

#### NUM-A-011

Source: [src/App.tsx:2346](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2346).

```json
{
  "questionId": "NUM-A-011",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "rates_proportion",
  "concept": "work_rate",
  "difficulty": "applied",
  "stem": "Three workers complete a job in 10 hours. At the same productivity, how long would five workers take?",
  "options": [
    {
      "optionId": "NUM-A-011-A",
      "label": "A",
      "text": "5 hours"
    },
    {
      "optionId": "NUM-A-011-B",
      "label": "B",
      "text": "8 hours"
    },
    {
      "optionId": "NUM-A-011-C",
      "label": "C",
      "text": "15 hours"
    },
    {
      "optionId": "NUM-A-011-D",
      "label": "D",
      "text": "6 hours"
    }
  ],
  "correctOptionId": "NUM-A-011-D",
  "explanation": "The job is 30 worker-hours. 30 ÷ 5 = 6 hours."
}
```

#### NUM-A-012

Source: [src/App.tsx:2347](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2347).

```json
{
  "questionId": "NUM-A-012",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "tables_data",
  "concept": "table_average",
  "difficulty": "applied",
  "stem": "What is the average of the four recorded values?",
  "options": [
    {
      "optionId": "NUM-A-012-A",
      "label": "A",
      "text": "25"
    },
    {
      "optionId": "NUM-A-012-B",
      "label": "B",
      "text": "26"
    },
    {
      "optionId": "NUM-A-012-C",
      "label": "C",
      "text": "24"
    },
    {
      "optionId": "NUM-A-012-D",
      "label": "D",
      "text": "23"
    }
  ],
  "correctOptionId": "NUM-A-012-C",
  "explanation": "(18 + 22 + 26 + 30) ÷ 4 = 24.",
  "dataTable": {
    "headers": [
      "Record",
      "Value"
    ],
    "rows": [
      [
        "1",
        "18"
      ],
      [
        "2",
        "22"
      ],
      [
        "3",
        "26"
      ],
      [
        "4",
        "30"
      ]
    ]
  }
}
```

#### NUM-A-013

Source: [src/App.tsx:2348](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2348).

```json
{
  "questionId": "NUM-A-013",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "percentages_ratios",
  "concept": "discount_then_tax",
  "difficulty": "applied",
  "stem": "A tool is marked at $240. It is discounted by 15%, then 10% GST is added to the discounted price. What is the final price?",
  "options": [
    {
      "optionId": "NUM-A-013-A",
      "label": "A",
      "text": "$249.60"
    },
    {
      "optionId": "NUM-A-013-B",
      "label": "B",
      "text": "$224.40"
    },
    {
      "optionId": "NUM-A-013-C",
      "label": "C",
      "text": "$204.00"
    },
    {
      "optionId": "NUM-A-013-D",
      "label": "D",
      "text": "$228.00"
    }
  ],
  "correctOptionId": "NUM-A-013-B",
  "explanation": "After the discount: $240 × 0.85 = $204. Then $204 × 1.10 = $224.40."
}
```

#### NUM-A-014

Source: [src/App.tsx:2349](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2349).

```json
{
  "questionId": "NUM-A-014",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "arithmetic_estimation",
  "concept": "missing_value_average",
  "difficulty": "applied",
  "stem": "Five inspection times have an average of 18 minutes. Four times are 14, 16, 19 and 19 minutes. What is the fifth time?",
  "options": [
    {
      "optionId": "NUM-A-014-A",
      "label": "A",
      "text": "22 min"
    },
    {
      "optionId": "NUM-A-014-B",
      "label": "B",
      "text": "18 min"
    },
    {
      "optionId": "NUM-A-014-C",
      "label": "C",
      "text": "20 min"
    },
    {
      "optionId": "NUM-A-014-D",
      "label": "D",
      "text": "24 min"
    }
  ],
  "correctOptionId": "NUM-A-014-A",
  "explanation": "Five values averaging 18 total 90. The known four total 68, leaving 22."
}
```

#### NUM-A-015

Source: [src/App.tsx:2350](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2350).

```json
{
  "questionId": "NUM-A-015",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "tables_data",
  "concept": "two_way_table",
  "difficulty": "applied",
  "stem": "Of all staff who have NOT completed the training, what percentage work the night shift?",
  "options": [
    {
      "optionId": "NUM-A-015-A",
      "label": "A",
      "text": "20%"
    },
    {
      "optionId": "NUM-A-015-B",
      "label": "B",
      "text": "30%"
    },
    {
      "optionId": "NUM-A-015-C",
      "label": "C",
      "text": "60%"
    },
    {
      "optionId": "NUM-A-015-D",
      "label": "D",
      "text": "40%"
    }
  ],
  "correctOptionId": "NUM-A-015-D",
  "explanation": "There are 15 staff who have not completed training; 6 are night shift. 6 ÷ 15 = 40%.",
  "dataTable": {
    "headers": [
      "Shift",
      "Completed",
      "Not completed"
    ],
    "rows": [
      [
        "Day",
        "36",
        "9"
      ],
      [
        "Night",
        "24",
        "6"
      ]
    ]
  }
}
```

#### NUM-A-016

Source: [src/App.tsx:2351](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2351).

```json
{
  "questionId": "NUM-A-016",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "rates_proportion",
  "concept": "flow_rate",
  "difficulty": "applied",
  "stem": "A pump transfers 840 litres in 7 minutes at a constant rate. What is the average flow rate?",
  "options": [
    {
      "optionId": "NUM-A-016-A",
      "label": "A",
      "text": "117 L/min"
    },
    {
      "optionId": "NUM-A-016-B",
      "label": "B",
      "text": "6,720 L/min"
    },
    {
      "optionId": "NUM-A-016-C",
      "label": "C",
      "text": "120 L/min"
    },
    {
      "optionId": "NUM-A-016-D",
      "label": "D",
      "text": "140 L/min"
    }
  ],
  "correctOptionId": "NUM-A-016-C",
  "explanation": "840 ÷ 7 = 120 L/min."
}
```

#### NUM-A-017

Source: [src/App.tsx:2352](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2352).

```json
{
  "questionId": "NUM-A-017",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "tables_data",
  "concept": "comparative_percentage",
  "difficulty": "applied",
  "stem": "Team B completed what percentage more inspections than Team C?",
  "options": [
    {
      "optionId": "NUM-A-017-A",
      "label": "A",
      "text": "80%"
    },
    {
      "optionId": "NUM-A-017-B",
      "label": "B",
      "text": "25%"
    },
    {
      "optionId": "NUM-A-017-C",
      "label": "C",
      "text": "12%"
    },
    {
      "optionId": "NUM-A-017-D",
      "label": "D",
      "text": "20%"
    }
  ],
  "correctOptionId": "NUM-A-017-B",
  "explanation": "The difference is 12. Relative to Team C, 12 ÷ 48 = 25%.",
  "dataTable": {
    "headers": [
      "Team",
      "Inspections"
    ],
    "rows": [
      [
        "A",
        "40"
      ],
      [
        "B",
        "60"
      ],
      [
        "C",
        "48"
      ]
    ]
  }
}
```

#### NUM-A-018

Source: [src/App.tsx:2353](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2353).

```json
{
  "questionId": "NUM-A-018",
  "sessionType": "numerical_assessment",
  "pathwayId": "fire_service",
  "domain": "numerical",
  "subcompetency": "percentages_ratios",
  "concept": "measurement_conversion",
  "difficulty": "applied",
  "stem": "A hose is 2.4 m long and an extension adds 65 cm. What is the total length in centimetres?",
  "options": [
    {
      "optionId": "NUM-A-018-A",
      "label": "A",
      "text": "305 cm"
    },
    {
      "optionId": "NUM-A-018-B",
      "label": "B",
      "text": "89 cm"
    },
    {
      "optionId": "NUM-A-018-C",
      "label": "C",
      "text": "240 cm"
    },
    {
      "optionId": "NUM-A-018-D",
      "label": "D",
      "text": "6,500 cm"
    }
  ],
  "correctOptionId": "NUM-A-018-A",
  "explanation": "2.4 m = 240 cm; 240 + 65 = 305 cm."
}
```

### abstractLogicalAssessmentQuestions

#### ABS-A-001

Source: [src/App.tsx:2447](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2447).

```json
{
  "questionId": "ABS-A-001",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "pattern_sequences",
  "concept": "rotation",
  "difficulty": "developing",
  "stem": "Which symbol comes next?",
  "options": [
    {
      "optionId": "ABS-A-001-A",
      "label": "A",
      "text": "←"
    },
    {
      "optionId": "ABS-A-001-B",
      "label": "B",
      "text": "↑"
    },
    {
      "optionId": "ABS-A-001-C",
      "label": "C",
      "text": "→"
    },
    {
      "optionId": "ABS-A-001-D",
      "label": "D",
      "text": "↓"
    }
  ],
  "correctOptionId": "ABS-A-001-C",
  "explanation": "The arrow rotates 90° clockwise each step.",
  "abstractVisual": {
    "kind": "sequence",
    "rows": [
      [
        "→",
        "↓",
        "←",
        "↑",
        "?"
      ]
    ]
  }
}
```

#### ABS-A-002

Source: [src/App.tsx:2448](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2448).

```json
{
  "questionId": "ABS-A-002",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "matrices_rules",
  "concept": "combination_rule",
  "difficulty": "developing",
  "stem": "What belongs in the missing cell?",
  "options": [
    {
      "optionId": "ABS-A-002-A",
      "label": "A",
      "text": "■"
    },
    {
      "optionId": "ABS-A-002-B",
      "label": "B",
      "text": "■○"
    },
    {
      "optionId": "ABS-A-002-C",
      "label": "C",
      "text": "■■"
    },
    {
      "optionId": "ABS-A-002-D",
      "label": "D",
      "text": "○○"
    }
  ],
  "correctOptionId": "ABS-A-002-B",
  "explanation": "The third cell combines the first two cells in each row.",
  "abstractVisual": {
    "kind": "matrix",
    "rows": [
      [
        "▲",
        "◆",
        "▲◆"
      ],
      [
        "■",
        "○",
        "?"
      ]
    ]
  }
}
```

#### ABS-A-003

Source: [src/App.tsx:2449](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2449).

```json
{
  "questionId": "ABS-A-003",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "classification_relationships",
  "concept": "relationship_exception",
  "difficulty": "developing",
  "stem": "Which pair follows a different transformation from the other three?",
  "options": [
    {
      "optionId": "ABS-A-003-A",
      "label": "A",
      "text": "▲ becomes △"
    },
    {
      "optionId": "ABS-A-003-B",
      "label": "B",
      "text": "■ becomes □"
    },
    {
      "optionId": "ABS-A-003-C",
      "label": "C",
      "text": "● becomes ○"
    },
    {
      "optionId": "ABS-A-003-D",
      "label": "D",
      "text": "◆ becomes ◆"
    }
  ],
  "correctOptionId": "ABS-A-003-D",
  "explanation": "In the first three pairs a filled shape becomes its outline; the fourth remains filled."
}
```

#### ABS-A-004

Source: [src/App.tsx:2450](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2450).

```json
{
  "questionId": "ABS-A-004",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "deductive_reasoning",
  "concept": "syllogism",
  "difficulty": "developing",
  "stem": "All breathing apparatus units are equipment. No equipment is a person. What must follow?",
  "options": [
    {
      "optionId": "ABS-A-004-A",
      "label": "A",
      "text": "All people are equipment"
    },
    {
      "optionId": "ABS-A-004-B",
      "label": "B",
      "text": "Some equipment is a person"
    },
    {
      "optionId": "ABS-A-004-C",
      "label": "C",
      "text": "All equipment is breathing apparatus"
    },
    {
      "optionId": "ABS-A-004-D",
      "label": "D",
      "text": "No breathing apparatus unit is a person"
    }
  ],
  "correctOptionId": "ABS-A-004-D",
  "explanation": "Every breathing apparatus unit is equipment, and no equipment is a person."
}
```

#### ABS-A-009

Source: [src/App.tsx:2451](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2451).

```json
{
  "questionId": "ABS-A-009",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "pattern_sequences",
  "concept": "two_rule_sequence",
  "difficulty": "developing",
  "stem": "What comes next?",
  "options": [
    {
      "optionId": "ABS-A-009-A",
      "label": "A",
      "text": "○○○○○"
    },
    {
      "optionId": "ABS-A-009-B",
      "label": "B",
      "text": "▲▲▲▲▲"
    },
    {
      "optionId": "ABS-A-009-C",
      "label": "C",
      "text": "○○○○○○"
    },
    {
      "optionId": "ABS-A-009-D",
      "label": "D",
      "text": "▲▲▲▲▲▲"
    }
  ],
  "correctOptionId": "ABS-A-009-C",
  "explanation": "Shape alternates and count increases by one, so the sixth term is six circles.",
  "abstractVisual": {
    "kind": "sequence",
    "rows": [
      [
        "▲",
        "○○",
        "▲▲▲",
        "○○○○",
        "▲▲▲▲▲",
        "?"
      ]
    ]
  }
}
```

#### ABS-A-012

Source: [src/App.tsx:2452](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2452).

```json
{
  "questionId": "ABS-A-012",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "deductive_reasoning",
  "concept": "conditional",
  "difficulty": "developing",
  "stem": "If a test is complete, a result is recorded. No result has been recorded. What must follow?",
  "options": [
    {
      "optionId": "ABS-A-012-A",
      "label": "A",
      "text": "The test is not complete"
    },
    {
      "optionId": "ABS-A-012-B",
      "label": "B",
      "text": "The test is complete"
    },
    {
      "optionId": "ABS-A-012-C",
      "label": "C",
      "text": "The result was deleted"
    },
    {
      "optionId": "ABS-A-012-D",
      "label": "D",
      "text": "Nothing can be concluded"
    }
  ],
  "correctOptionId": "ABS-A-012-A",
  "explanation": "A completed test would produce a result; no result means the test is not complete."
}
```

#### ABS-A-013

Source: [src/App.tsx:2453](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2453).

```json
{
  "questionId": "ABS-A-013",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "pattern_sequences",
  "concept": "alternating_rotation",
  "difficulty": "developing",
  "stem": "Which symbol comes next?",
  "options": [
    {
      "optionId": "ABS-A-013-A",
      "label": "A",
      "text": "↑"
    },
    {
      "optionId": "ABS-A-013-B",
      "label": "B",
      "text": "↓"
    },
    {
      "optionId": "ABS-A-013-C",
      "label": "C",
      "text": "→"
    },
    {
      "optionId": "ABS-A-013-D",
      "label": "D",
      "text": "←"
    }
  ],
  "correctOptionId": "ABS-A-013-D",
  "explanation": "The direction changes by +90°, then +180°, repeating. Starting at ↑ gives ↑, →, ←, ↑, ↓, so the next direction is ←.",
  "abstractVisual": {
    "kind": "sequence",
    "rows": [
      [
        "↑",
        "→",
        "←",
        "↑",
        "↓",
        "?"
      ]
    ]
  }
}
```

#### ABS-A-014

Source: [src/App.tsx:2454](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2454).

```json
{
  "questionId": "ABS-A-014",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "matrices_rules",
  "concept": "dual_feature_matrix",
  "difficulty": "developing",
  "stem": "Each row follows the same two rules. What belongs in the missing cell?",
  "options": [
    {
      "optionId": "ABS-A-014-A",
      "label": "A",
      "text": "↑ ●●●"
    },
    {
      "optionId": "ABS-A-014-B",
      "label": "B",
      "text": "← ●●"
    },
    {
      "optionId": "ABS-A-014-C",
      "label": "C",
      "text": "↑ ●●"
    },
    {
      "optionId": "ABS-A-014-D",
      "label": "D",
      "text": "→ ●●"
    }
  ],
  "correctOptionId": "ABS-A-014-C",
  "explanation": "Across each row the arrow rotates 90° clockwise while the dot count increases by one.",
  "abstractVisual": {
    "kind": "matrix",
    "rows": [
      [
        "→ ●",
        "↓ ●●",
        "← ●●●"
      ],
      [
        "↓ ●●●",
        "← ●",
        "↑ ●●"
      ],
      [
        "← ●",
        "↑ ●●",
        "?"
      ]
    ]
  }
}
```

#### ABS-A-015

Source: [src/App.tsx:2455](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2455).

```json
{
  "questionId": "ABS-A-015",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "classification_relationships",
  "concept": "analogy_discovery",
  "difficulty": "developing",
  "stem": "A changes to B. Apply the same relationship to C.",
  "options": [
    {
      "optionId": "ABS-A-015-A",
      "label": "A",
      "text": "◆"
    },
    {
      "optionId": "ABS-A-015-B",
      "label": "B",
      "text": "◇"
    },
    {
      "optionId": "ABS-A-015-C",
      "label": "C",
      "text": "■"
    },
    {
      "optionId": "ABS-A-015-D",
      "label": "D",
      "text": "▲"
    }
  ],
  "correctOptionId": "ABS-A-015-B",
  "explanation": "The relationship changes a filled shape to the outline version of the same shape.",
  "abstractVisual": {
    "kind": "matrix",
    "rows": [
      [
        "●",
        "→",
        "○"
      ],
      [
        "◆",
        "→",
        "?"
      ]
    ]
  }
}
```

#### ABS-A-016

Source: [src/App.tsx:2456](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2456).

```json
{
  "questionId": "ABS-A-016",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "deductive_reasoning",
  "concept": "multi_constraint_ordering",
  "difficulty": "developing",
  "stem": "Four candidates—J, K, L and M—finish in different positions. J is before K. L is after K. M is before J. Who must finish last?",
  "options": [
    {
      "optionId": "ABS-A-016-A",
      "label": "A",
      "text": "L"
    },
    {
      "optionId": "ABS-A-016-B",
      "label": "B",
      "text": "K"
    },
    {
      "optionId": "ABS-A-016-C",
      "label": "C",
      "text": "J"
    },
    {
      "optionId": "ABS-A-016-D",
      "label": "D",
      "text": "M"
    }
  ],
  "correctOptionId": "ABS-A-016-A",
  "explanation": "The constraints force M before J before K before L."
}
```

#### ABS-A-017

Source: [src/App.tsx:2457](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2457).

```json
{
  "questionId": "ABS-A-017",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "deductive_reasoning",
  "concept": "must_could_cannot",
  "difficulty": "developing",
  "stem": "Every red token is square. Some square tokens are large. Which statement must be true?",
  "options": [
    {
      "optionId": "ABS-A-017-A",
      "label": "A",
      "text": "Some red tokens are large"
    },
    {
      "optionId": "ABS-A-017-B",
      "label": "B",
      "text": "Every large token is red"
    },
    {
      "optionId": "ABS-A-017-C",
      "label": "C",
      "text": "No square token is small"
    },
    {
      "optionId": "ABS-A-017-D",
      "label": "D",
      "text": "Every red token is square"
    }
  ],
  "correctOptionId": "ABS-A-017-D",
  "explanation": "Only the first statement is guaranteed by the information given."
}
```

#### ABS-A-018

Source: [src/App.tsx:2458](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2458).

```json
{
  "questionId": "ABS-A-018",
  "sessionType": "abstract_logical_assessment",
  "pathwayId": "fire_service",
  "domain": "abstract_logical",
  "subcompetency": "matrices_rules",
  "concept": "integrated_matrix",
  "difficulty": "developing",
  "stem": "Two features change across the matrix. What belongs in the missing cell?",
  "options": [
    {
      "optionId": "ABS-A-018-A",
      "label": "A",
      "text": "↑ ●●●"
    },
    {
      "optionId": "ABS-A-018-B",
      "label": "B",
      "text": "↓ ●"
    },
    {
      "optionId": "ABS-A-018-C",
      "label": "C",
      "text": "↑ ●●"
    },
    {
      "optionId": "ABS-A-018-D",
      "label": "D",
      "text": "→ ●●"
    }
  ],
  "correctOptionId": "ABS-A-018-C",
  "explanation": "Across rows and columns the arrow advances 90° and the dot count cycles 1, 2, 3.",
  "abstractVisual": {
    "kind": "matrix",
    "rows": [
      [
        "→ ●",
        "↓ ●●",
        "← ●●●"
      ],
      [
        "↓ ●●",
        "← ●●●",
        "↑ ●"
      ],
      [
        "← ●●●",
        "↑ ●",
        "?"
      ]
    ]
  }
}
```

### verbalAssessmentQuestions

#### VER-A-005

Source: [src/App.tsx:2556](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2556).

```json
{
  "questionId": "VER-A-005",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "explicit_information",
  "concept": "main_point",
  "difficulty": "applied",
  "stem": "What is the main purpose of the update?",
  "options": [
    {
      "optionId": "VER-A-005-A",
      "label": "A",
      "text": "To say all progress will be deleted"
    },
    {
      "optionId": "VER-A-005-B",
      "label": "B",
      "text": "To announce a new assessment"
    },
    {
      "optionId": "VER-A-005-C",
      "label": "C",
      "text": "To change candidate passwords"
    },
    {
      "optionId": "VER-A-005-D",
      "label": "D",
      "text": "To warn of a temporary service interruption"
    }
  ],
  "correctOptionId": "VER-A-005-D",
  "explanation": "The update mainly announces a temporary maintenance outage.",
  "verbalPassage": {
    "title": "Service update",
    "text": "The online practice system will be unavailable from 22:00 Saturday until 02:00 Sunday for maintenance. Saved progress will not be affected."
  }
}
```

#### VER-A-017

Source: [src/App.tsx:2557](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2557).

```json
{
  "questionId": "VER-A-017",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "explicit_information",
  "concept": "long_passage_explicit",
  "difficulty": "applied",
  "stem": "What happened when a crate seal was broken or an item from the crate was used?",
  "options": [
    {
      "optionId": "VER-A-017-A",
      "label": "A",
      "text": "The crate was returned to central logistics and a reserve crate was issued"
    },
    {
      "optionId": "VER-A-017-B",
      "label": "B",
      "text": "The crate stayed at the station until the trial ended"
    },
    {
      "optionId": "VER-A-017-C",
      "label": "C",
      "text": "The crew restocked the crate from the usual storerooms"
    },
    {
      "optionId": "VER-A-017-D",
      "label": "D",
      "text": "The station stopped taking part in the trial"
    }
  ],
  "correctOptionId": "VER-A-017-A",
  "explanation": "The passage states that a used or unsealed crate went back to central logistics for restocking and was replaced by a reserve crate.",
  "verbalPassage": {
    "title": "Pre-packed flood-response crates",
    "text": "During July, North District ran a four-week trial of pre-packed flood-response crates. Four stations each received two sealed crates containing equipment normally collected from several storerooms after an alert. Crews checked each crate's seal and expiry dates weekly without opening it, and the crates were not to be opened for routine training.\n\nIf a seal was broken or an item was used, the crate was returned to central logistics for restocking and a reserve crate was issued. The trial aimed to reduce the time between an alert and vehicle departure; it did not change crew numbers or response procedures. Across 12 exercises, median departure time fell from 11 minutes before the trial to 8 minutes during it.\n\nStaff generally liked having equipment in one place, although several noted that the crates occupied useful bay space. The district plans a further trial at two stations with different building layouts before deciding whether to use the system permanently."
  }
}
```

#### VER-A-018

Source: [src/App.tsx:2558](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2558).

```json
{
  "questionId": "VER-A-018",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "explicit_information",
  "concept": "dual_text_compare",
  "difficulty": "applied",
  "stem": "Which statement is true of both notices?",
  "options": [
    {
      "optionId": "VER-A-018-A",
      "label": "A",
      "text": "They prevent all equipment collection while the restricted area is unavailable"
    },
    {
      "optionId": "VER-A-018-B",
      "label": "B",
      "text": "They state that normal access resumes at 15:00"
    },
    {
      "optionId": "VER-A-018-C",
      "label": "C",
      "text": "They describe restrictions lasting exactly one hour"
    },
    {
      "optionId": "VER-A-018-D",
      "label": "D",
      "text": "They require users to take an action before a temporary restriction begins"
    }
  ],
  "correctOptionId": "VER-A-018-D",
  "explanation": "Both notices require action before a temporary restriction starts: vehicles must be moved before 13:45 and servicing equipment must be left on the rack before 14:20. The other details differ.",
  "verbalPassage": {
    "title": "Two Tuesday notices",
    "text": "Vehicle bay cleaning\nBay 2 will be unavailable from 14:00 to 15:00 while the floor is cleaned. Vehicles due to leave during that hour should be moved to Bay 1 before 13:45. Normal access to Bay 2 resumes at 15:00.\n\nBreathing-apparatus servicing\nThe service bench will be unavailable from 14:30 to 16:00. Cylinders may still be collected from the adjacent store. Equipment due for servicing should be left on the marked rack before 14:20."
  }
}
```

#### VER-A-002

Source: [src/App.tsx:2559](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2559).

```json
{
  "questionId": "VER-A-002",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "inference_context",
  "concept": "meaning_in_context",
  "difficulty": "applied",
  "stem": "What does concise most nearly mean?",
  "options": [
    {
      "optionId": "VER-A-002-A",
      "label": "A",
      "text": "Highly technical"
    },
    {
      "optionId": "VER-A-002-B",
      "label": "B",
      "text": "Repeated several times"
    },
    {
      "optionId": "VER-A-002-C",
      "label": "C",
      "text": "Brief but complete"
    },
    {
      "optionId": "VER-A-002-D",
      "label": "D",
      "text": "Confusing and incomplete"
    }
  ],
  "correctOptionId": "VER-A-002-C",
  "explanation": "The context defines concise as covering what matters without unnecessary detail.",
  "verbalPassage": {
    "title": "Review",
    "text": "The instructions were concise: they covered every essential step without unnecessary detail."
  }
}
```

#### VER-A-006

Source: [src/App.tsx:2560](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2560).

```json
{
  "questionId": "VER-A-006",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "inference_context",
  "concept": "supported_inference",
  "difficulty": "applied",
  "stem": "What can reasonably be inferred?",
  "options": [
    {
      "optionId": "VER-A-006-A",
      "label": "A",
      "text": "Training began before any gauge was fitted"
    },
    {
      "optionId": "VER-A-006-B",
      "label": "B",
      "text": "The second gauge was also marked out of service"
    },
    {
      "optionId": "VER-A-006-C",
      "label": "C",
      "text": "The failed gauge was not used for the training session"
    },
    {
      "optionId": "VER-A-006-D",
      "label": "D",
      "text": "Both gauges failed the check"
    }
  ],
  "correctOptionId": "VER-A-006-C",
  "explanation": "A passing replacement was fitted before training, supporting that the failed gauge was not used.",
  "verbalPassage": {
    "title": "Equipment record",
    "text": "A pressure gauge failed its morning check and was marked out of service. A second gauge passed the same check and was fitted to the unit before training began."
  }
}
```

#### VER-A-015

Source: [src/App.tsx:2561](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2561).

```json
{
  "questionId": "VER-A-015",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "inference_context",
  "concept": "reference_resolution",
  "difficulty": "applied",
  "stem": "What does ‘This action’ refer to?",
  "options": [
    {
      "optionId": "VER-A-015-A",
      "label": "A",
      "text": "The generator failing to start"
    },
    {
      "optionId": "VER-A-015-B",
      "label": "B",
      "text": "Fitting the replacement fuel line"
    },
    {
      "optionId": "VER-A-015-C",
      "label": "C",
      "text": "Tagging the generator out of service"
    },
    {
      "optionId": "VER-A-015-D",
      "label": "D",
      "text": "Inspecting the generator"
    }
  ],
  "correctOptionId": "VER-A-015-C",
  "explanation": "The phrase refers to the immediately preceding action: tagging the generator out of service.",
  "verbalPassage": {
    "title": "Incident note",
    "text": "The mechanic inspected the portable generator after it failed to start. The generator was then tagged out of service until a replacement fuel line could be fitted. This action prevented crews from using the generator during the afternoon exercise."
  }
}
```

#### VER-A-003

Source: [src/App.tsx:2562](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2562).

```json
{
  "questionId": "VER-A-003",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "instructions_sequence",
  "concept": "conditional_instruction",
  "difficulty": "applied",
  "stem": "A visitor arrives at 18:20. Which entrance should they use?",
  "options": [
    {
      "optionId": "VER-A-003-A",
      "label": "A",
      "text": "No entrance is available"
    },
    {
      "optionId": "VER-A-003-B",
      "label": "B",
      "text": "The west entrance"
    },
    {
      "optionId": "VER-A-003-C",
      "label": "C",
      "text": "The east entrance"
    },
    {
      "optionId": "VER-A-003-D",
      "label": "D",
      "text": "Either entrance"
    }
  ],
  "correctOptionId": "VER-A-003-B",
  "explanation": "After 18:00 all visitors must use the staffed west entrance.",
  "verbalPassage": {
    "title": "Entry procedure",
    "text": "Use the east entrance before 18:00. After 18:00, the east entrance is locked and all visitors must use the staffed west entrance."
  }
}
```

#### VER-A-011

Source: [src/App.tsx:2563](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2563).

```json
{
  "questionId": "VER-A-011",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "instructions_sequence",
  "concept": "priority_rule",
  "difficulty": "applied",
  "stem": "The warning light appears and smoke is visible. What should the operator do?",
  "options": [
    {
      "optionId": "VER-A-011-A",
      "label": "A",
      "text": "Ignore the smoke and continue"
    },
    {
      "optionId": "VER-A-011-B",
      "label": "B",
      "text": "Wait beside the machine for ten minutes"
    },
    {
      "optionId": "VER-A-011-C",
      "label": "C",
      "text": "Move away and raise the alarm"
    },
    {
      "optionId": "VER-A-011-D",
      "label": "D",
      "text": "Restart the machine immediately"
    }
  ],
  "correctOptionId": "VER-A-011-C",
  "explanation": "The smoke condition triggers the stronger instruction to move away and raise the alarm.",
  "verbalPassage": {
    "title": "Fault response",
    "text": "If the warning light appears, stop the machine. If there is also smoke or a burning smell, move away and raise the alarm rather than attempting a restart."
  }
}
```

#### VER-A-014

Source: [src/App.tsx:2564](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2564).

```json
{
  "questionId": "VER-A-014",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "instructions_sequence",
  "concept": "policy_interpretation",
  "difficulty": "applied",
  "stem": "Which action is permitted?",
  "options": [
    {
      "optionId": "VER-A-014-A",
      "label": "A",
      "text": "At 08:15, collect equipment for five minutes while remaining with the vehicle"
    },
    {
      "optionId": "VER-A-014-B",
      "label": "B",
      "text": "At 14:00, park for eight minutes while attending a meeting inside"
    },
    {
      "optionId": "VER-A-014-C",
      "label": "C",
      "text": "At 16:00, unload equipment and remain for 15 minutes"
    },
    {
      "optionId": "VER-A-014-D",
      "label": "D",
      "text": "At 13:30, collect work equipment, remain with the vehicle and leave after seven minutes"
    }
  ],
  "correctOptionId": "VER-A-014-D",
  "explanation": "Only the first option satisfies purpose, time-of-day, driver-presence and duration requirements.",
  "verbalPassage": {
    "title": "Private vehicles in the loading yard",
    "text": "Private vehicles may enter only to load or unload work equipment. The driver must remain with the vehicle. The stay may not exceed 10 minutes. Between 07:00 and 09:00 the yard is restricted to fleet vehicles only."
  }
}
```

#### VER-A-012

Source: [src/App.tsx:2565](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2565).

```json
{
  "questionId": "VER-A-012",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "assumptions_conclusions",
  "concept": "unsupported_assumption",
  "difficulty": "applied",
  "stem": "Which conclusion is not justified by this information alone?",
  "options": [
    {
      "optionId": "VER-A-012-A",
      "label": "A",
      "text": "Attendance was optional"
    },
    {
      "optionId": "VER-A-012-B",
      "label": "B",
      "text": "The workshop caused the higher scores"
    },
    {
      "optionId": "VER-A-012-C",
      "label": "C",
      "text": "The workshop group had a higher average score"
    },
    {
      "optionId": "VER-A-012-D",
      "label": "D",
      "text": "The two groups had different average scores"
    }
  ],
  "correctOptionId": "VER-A-012-B",
  "explanation": "An observed difference does not by itself prove that the workshop caused it.",
  "verbalPassage": {
    "title": "Result summary",
    "text": "Candidates who attended the optional workshop had a higher average score than candidates who did not attend."
  }
}
```

#### VER-A-013

Source: [src/App.tsx:2566](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2566).

```json
{
  "questionId": "VER-A-013",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "assumptions_conclusions",
  "concept": "claim_vs_evidence",
  "difficulty": "applied",
  "stem": "Which claim is supported by the information?",
  "options": [
    {
      "optionId": "VER-A-013-A",
      "label": "A",
      "text": "Late inspections were less common during the trial than in the preceding four weeks"
    },
    {
      "optionId": "VER-A-013-B",
      "label": "B",
      "text": "The reminder caused the reduction"
    },
    {
      "optionId": "VER-A-013-C",
      "label": "C",
      "text": "The reminder will work at every depot"
    },
    {
      "optionId": "VER-A-013-D",
      "label": "D",
      "text": "No other factor could have affected the result"
    }
  ],
  "correctOptionId": "VER-A-013-A",
  "explanation": "The observed periods can be compared, but the information does not establish causation or generalisability.",
  "verbalPassage": {
    "title": "Daily inspection reminders",
    "text": "A depot introduced an automated reminder for four weeks. In the four weeks before the reminder, 46 daily vehicle inspections were recorded as late. During the four-week trial, 29 were late. Vehicle and inspection numbers were similar, but no other changes were formally tracked."
  }
}
```

#### VER-A-016

Source: [src/App.tsx:2567](https://github.com/Numeroxa/flospatial/blob/2065282637d1407a1b41f16b6b73aa33884b5b72/src/App.tsx#L2567).

```json
{
  "questionId": "VER-A-016",
  "sessionType": "verbal_assessment",
  "pathwayId": "fire_service",
  "domain": "verbal",
  "subcompetency": "assumptions_conclusions",
  "concept": "multi_paragraph_synthesis",
  "difficulty": "applied",
  "stem": "Which conclusion is best supported?",
  "options": [
    {
      "optionId": "VER-A-016-A",
      "label": "A",
      "text": "Station 4 should stop using shift overlap for all training"
    },
    {
      "optionId": "VER-A-016-B",
      "label": "B",
      "text": "The overlap-time approach was associated with higher district attendance, but Station 4 may need timing better suited to its roster"
    },
    {
      "optionId": "VER-A-016-C",
      "label": "C",
      "text": "The change improved attendance at every station"
    },
    {
      "optionId": "VER-A-016-D",
      "label": "D",
      "text": "Station 4 staff are less interested in safety briefings"
    }
  ],
  "correctOptionId": "VER-A-016-B",
  "explanation": "The evidence supports overall improvement plus a specific roster-related limitation at Station 4, not the broader claims.",
  "verbalPassage": {
    "title": "Training attendance review",
    "text": "District attendance rose from 68% to 86% after monthly safety briefings moved to the 15-minute overlap between day and night shifts. Most stations exceeded 80%, but Station 4 remained at 61%. Station 4's roster provides day/night overlap on only two days each week, so it will trial a different briefing time next month."
  }
}
```

Mechanical diagrams are keyed by ID in GearQuestionDiagram, pulleyQuestionStrands/PulleyDiagram, LeverQuestionDiagram and MixedMechanicalAssessmentDiagram in the same baseline file. The audit read their source specifications; it did not change or visually redraw diagrams.
