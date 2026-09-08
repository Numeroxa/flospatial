export type VerbalCalibrationDifficulty = "foundation" | "applied" | "stretch";
export type VerbalCalibrationOptionId = "A" | "B" | "C" | "D";

export type VerbalCalibrationSource = {
  eyebrow?: string;
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type VerbalCalibrationOption = {
  optionId: VerbalCalibrationOptionId;
  text: string;
  misconceptionTag: string;
};

export type VerbalCalibrationPilotItem = {
  questionId: string;
  blueprintId: string;
  familyId: string;
  archetype: string;
  difficulty: VerbalCalibrationDifficulty;
  reasoningSteps: number;
  targetTimeRangeSec: { minSec: number; maxSec: number };
  source: VerbalCalibrationSource;
  stem: string;
  options: VerbalCalibrationOption[];
  correctOptionId: VerbalCalibrationOptionId;
  explanation: string;
  misconceptionTags: Partial<Record<VerbalCalibrationOptionId, string>>;
};

export const VERBAL_CALIBRATION_PILOT_VERSION = "APTESTA_VERBAL_CAL_V0_15";

const option = (optionId: VerbalCalibrationOptionId, text: string, misconceptionTag: string): VerbalCalibrationOption => ({ optionId, text, misconceptionTag });

export const verbalCalibrationCoreItems: VerbalCalibrationPilotItem[] = [
  {
    questionId: "VB-CAL-001",
    blueprintId: "VERBAL-01",
    familyId: "explicit_fact_v1",
    archetype: "explicit_fact",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 40, maxSec: 50 },
    source: {
      eyebrow: "Workshop notice",
      title: "Thursday access",
      paragraphs: [
        "On Thursday, the equipment workshop will close at 16:30 for an electrical inspection. Items for repair must be lodged by 15:45. Equipment that has already been repaired can be collected until 16:15. The workshop reopens at 07:30 on Friday.",
      ],
    },
    stem: "What is the latest time repaired equipment can be collected on Thursday?",
    options: [
      option("A", "15:45", "confuses_lodgement_deadline"),
      option("B", "16:15", "correct"),
      option("C", "16:30", "confuses_workshop_closure"),
      option("D", "07:30", "confuses_next_day_reopening"),
    ],
    correctOptionId: "B",
    explanation: "The notice states that equipment already repaired can be collected until 16:15. The other times refer to repair lodgement, workshop closure and Friday reopening.",
    misconceptionTags: { A: "confuses_lodgement_deadline", B: "correct", C: "confuses_workshop_closure", D: "confuses_next_day_reopening" },
  },
  {
    questionId: "VB-CAL-002",
    blueprintId: "VERBAL-02",
    familyId: "explicit_condition_v1",
    archetype: "explicit_condition",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 45, maxSec: 55 },
    source: {
      eyebrow: "Equipment instruction",
      title: "Portable lighting",
      bullets: [
        "Battery-powered portable lights may be used without an electrical permit.",
        "Mains-powered portable lights must have a current electrical inspection tag.",
        "In wet areas, a mains-powered portable light must also be connected through a portable RCD.",
      ],
    },
    stem: "When is a portable RCD additionally required?",
    options: [
      option("A", "Whenever any battery-powered light is used", "extends_condition_to_battery_lights"),
      option("B", "Whenever a mains-powered light is used, even in a dry area", "drops_wet_area_condition"),
      option("C", "When a mains-powered portable light is used in a wet area", "correct"),
      option("D", "Only when a light does not have an inspection tag", "substitutes_tag_rule"),
    ],
    correctOptionId: "C",
    explanation: "The extra RCD requirement applies only when both conditions are present: the light is mains-powered and it is being used in a wet area.",
    misconceptionTags: { A: "extends_condition_to_battery_lights", B: "drops_wet_area_condition", C: "correct", D: "substitutes_tag_rule" },
  },
  {
    questionId: "VB-CAL-003",
    blueprintId: "VERBAL-03",
    familyId: "main_point_v1",
    archetype: "main_point",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    source: {
      eyebrow: "Training review",
      paragraphs: [
        "A review of last quarter's drills found that recruits generally completed the individual equipment checks correctly, but teams often lost time when changing from one task to the next. The next training block will therefore keep the equipment checks and add short handover exercises between tasks. The aim is not to make drills longer; it is to make transitions more reliable.",
      ],
    },
    stem: "Which option best states the main point of the passage?",
    options: [
      option("A", "Equipment checks will be removed because recruits already know them.", "overstates_change_to_equipment_checks"),
      option("B", "Training will add handover practice to improve task transitions while retaining equipment checks.", "correct"),
      option("C", "Future drills will be made longer so teams have more time to change tasks.", "reverses_stated_aim"),
      option("D", "The review found that recruits were failing the individual equipment checks.", "focuses_on_contradicted_detail"),
    ],
    correctOptionId: "B",
    explanation: "The passage says the existing equipment checks will stay, while short handover exercises are added to improve transitions between tasks.",
    misconceptionTags: { A: "overstates_change_to_equipment_checks", B: "correct", C: "reverses_stated_aim", D: "focuses_on_contradicted_detail" },
  },
  {
    questionId: "VB-CAL-004",
    blueprintId: "VERBAL-04",
    familyId: "supported_inference_v1",
    archetype: "supported_inference",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    source: {
      eyebrow: "Six-week trial",
      title: "Labelled hose-rack positions",
      paragraphs: [
        "Station 4 trialled labelled positions on its hose racks for six weeks. Setup time was faster in five of the six trial drills than the station's median setup time across the previous six drills. Crew numbers and the drill route were unchanged during the trial. No other station used the labels during this period.",
      ],
    },
    stem: "Which conclusion is best supported by the information given?",
    options: [
      option("A", "The labels proved that they caused the faster setup times.", "claims_causation_from_association"),
      option("B", "Labelled rack positions are associated with faster setup at Station 4 during this trial.", "correct"),
      option("C", "Labelled rack positions will make setup faster at every station.", "generalises_beyond_sample"),
      option("D", "The faster times were caused by an increase in crew numbers.", "contradicts_controlled_detail"),
    ],
    correctOptionId: "B",
    explanation: "The trial shows an association at Station 4. It does not prove causation and cannot establish that the same result would occur at every station.",
    misconceptionTags: { A: "claims_causation_from_association", B: "correct", C: "generalises_beyond_sample", D: "contradicts_controlled_detail" },
  },
  {
    questionId: "VB-CAL-005",
    blueprintId: "VERBAL-05",
    familyId: "meaning_in_context_v1",
    archetype: "meaning_in_context",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    source: {
      eyebrow: "Movement instruction",
      paragraphs: [
        "Because the access road was narrow, the convoy used a staggered departure: vehicles left at two-minute intervals rather than leaving together.",
      ],
    },
    stem: "In this passage, what does “staggered” most nearly mean?",
    options: [
      option("A", "Delayed until another day", "chooses_delay_not_spacing"),
      option("B", "Spread out over time", "correct"),
      option("C", "Arranged in order of vehicle size", "imports_unstated_ordering"),
      option("D", "Moved at different speeds", "confuses_departure_spacing_with_speed"),
    ],
    correctOptionId: "B",
    explanation: "The colon immediately explains the word: the vehicles left at two-minute intervals instead of all leaving together. Here, “staggered” means spread out over time.",
    misconceptionTags: { A: "chooses_delay_not_spacing", B: "correct", C: "imports_unstated_ordering", D: "confuses_departure_spacing_with_speed" },
  },
  {
    questionId: "VB-CAL-006",
    blueprintId: "VERBAL-06",
    familyId: "instruction_sequence_v1",
    archetype: "instruction_sequence",
    difficulty: "applied",
    reasoningSteps: 4,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    source: {
      eyebrow: "Procedure",
      title: "Radio battery check",
      bullets: [
        "Before switching the radio on, confirm that the battery is fully latched.",
        "After switching on, wait for the self-test symbol to disappear.",
        "Then select channel 3.",
        "Only after channel 3 is displayed should the test call be made.",
      ],
    },
    stem: "Which sequence follows the procedure correctly?",
    options: [
      option("A", "Latch battery → switch on → wait for self-test → select channel 3 → make test call", "correct"),
      option("B", "Switch on → latch battery → select channel 3 → wait for self-test → make test call", "switches_on_before_battery_check"),
      option("C", "Latch battery → switch on → select channel 3 → make test call → wait for self-test", "skips_self_test_before_actions"),
      option("D", "Latch battery → select channel 3 → switch on → wait for self-test → make test call", "selects_channel_before_power_on"),
    ],
    correctOptionId: "A",
    explanation: "The procedure gives a strict order: latch the battery, switch on, wait for the self-test to finish, select channel 3, then make the test call.",
    misconceptionTags: { A: "correct", B: "switches_on_before_battery_check", C: "skips_self_test_before_actions", D: "selects_channel_before_power_on" },
  },
  {
    questionId: "VB-CAL-007",
    blueprintId: "VERBAL-07",
    familyId: "instruction_exception_v1",
    archetype: "instruction_exception",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    source: {
      eyebrow: "Yard-use policy",
      bullets: [
        "The training yard normally closes at 18:00.",
        "After 18:00, it may be used for a scheduled instructor-led training session.",
        "Crews responding to an operational call may pass through the yard at any time.",
        "Unsupervised personal practice is not permitted after 18:00.",
      ],
    },
    stem: "At 18:30, which activity is permitted by an explicit exception even if no training session is scheduled?",
    options: [
      option("A", "A recruit practises alone in the yard.", "ignores_unsupervised_prohibition"),
      option("B", "A crew passes through the yard while responding to an operational call.", "correct"),
      option("C", "A group starts an unscheduled training drill without an instructor.", "drops_scheduled_instructor_condition"),
      option("D", "A recruit remains in the yard to reorganise personal equipment.", "treats_non_training_use_as_exception"),
    ],
    correctOptionId: "B",
    explanation: "The policy explicitly allows crews responding to an operational call to pass through the yard at any time. The other activities do not meet an after-hours exception.",
    misconceptionTags: { A: "ignores_unsupervised_prohibition", B: "correct", C: "drops_scheduled_instructor_condition", D: "treats_non_training_use_as_exception" },
  },
  {
    questionId: "VB-CAL-008",
    blueprintId: "VERBAL-08",
    familyId: "evidence_scope_v1",
    archetype: "evidence_scope",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    source: {
      eyebrow: "Practice briefing survey",
      paragraphs: [
        "At one training centre, 64 volunteer candidates tried two versions of a practice briefing. Forty-one said they found the 5-minute version easier to follow, 17 preferred the 10-minute version, and 6 had no preference. No test scores were measured, and candidates from other centres were not included.",
      ],
    },
    stem: "Which conclusion is best supported by the survey?",
    options: [
      option("A", "The 5-minute briefing improves candidates' test scores.", "claims_unmeasured_outcome"),
      option("B", "Most candidates everywhere would prefer the 5-minute briefing.", "generalises_beyond_sample"),
      option("C", "Among the volunteers surveyed at this centre, more preferred the 5-minute briefing than the 10-minute briefing.", "correct"),
      option("D", "The 5-minute briefing is twice as effective as the 10-minute briefing.", "converts_preference_to_effectiveness"),
    ],
    correctOptionId: "C",
    explanation: "The data support a statement about preference among the volunteers who were actually surveyed. They do not measure test performance, effectiveness or candidates at other centres.",
    misconceptionTags: { A: "claims_unmeasured_outcome", B: "generalises_beyond_sample", C: "correct", D: "converts_preference_to_effectiveness" },
  },
];

export const verbalCalibrationAllItems: VerbalCalibrationPilotItem[] = [
  ...verbalCalibrationCoreItems,
];
