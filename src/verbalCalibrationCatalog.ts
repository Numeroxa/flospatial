export type VerbalCalibrationDifficulty = "foundation" | "applied" | "stretch";
export type VerbalCalibrationOptionId = "A" | "B" | "C" | "D";

export type VerbalCalibrationSourceSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type VerbalCalibrationSourceTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type VerbalCalibrationSource = {
  eyebrow?: string;
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  sections?: VerbalCalibrationSourceSection[];
  table?: VerbalCalibrationSourceTable;
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

export const VERBAL_CALIBRATION_PILOT_VERSION = "APTESTA_VERBAL_CAL_V0_17";

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

export const verbalCalibrationAppliedItems: VerbalCalibrationPilotItem[] = [
  {
    questionId: "VB-CAL-009",
    blueprintId: "VERBAL-09",
    familyId: "dual_text_compare_v1",
    archetype: "dual_text_compare",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 60, maxSec: 75 },
    source: {
      eyebrow: "Two Tuesday notices",
      sections: [
        {
          title: "Vehicle bay cleaning",
          paragraphs: [
            "Bay 2 will be unavailable from 14:00 to 15:00 while the floor is cleaned. Vehicles due to leave during that hour should be moved to Bay 1 before 13:45. Normal access to Bay 2 resumes at 15:00.",
          ],
        },
        {
          title: "Breathing-apparatus servicing",
          paragraphs: [
            "The service bench will be unavailable from 14:30 to 16:00. Cylinders may still be collected from the adjacent store. Equipment due for servicing should be left on the marked rack before 14:20.",
          ],
        },
      ],
    },
    stem: "Which statement is true of both notices?",
    options: [
      option("A", "They require users to take an action before a temporary restriction begins.", "correct"),
      option("B", "They prevent all equipment collection while the restricted area is unavailable.", "extends_restriction_beyond_text"),
      option("C", "They state that normal access resumes at 15:00.", "imports_time_from_first_notice"),
      option("D", "They describe restrictions lasting exactly one hour.", "assumes_same_duration"),
    ],
    correctOptionId: "A",
    explanation: "Both notices ask users to do something before a temporary restriction starts: move vehicles before 13:45 and leave servicing equipment before 14:20. The other details differ between the notices.",
    misconceptionTags: { A: "correct", B: "extends_restriction_beyond_text", C: "imports_time_from_first_notice", D: "assumes_same_duration" },
  },
  {
    questionId: "VB-CAL-010",
    blueprintId: "VERBAL-10",
    familyId: "long_passage_explicit_v1",
    archetype: "long_passage_explicit",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 60, maxSec: 75 },
    source: {
      eyebrow: "Operations trial",
      title: "Pre-packed flood-response crates",
      paragraphs: [
        "During July, North District ran a four-week trial of pre-packed flood-response crates. Four stations each received two sealed crates containing the equipment normally collected from several storerooms after an alert. Every crate carried an external checklist, and crews checked the seal and expiry dates each week without opening it. The crates were not to be opened for routine training.",
        "If a seal was broken or an item was used, the crate was returned to central logistics for restocking and a reserve crate was issued. The trial was intended to reduce the time between an alert and vehicle departure; it did not change crew numbers or the response procedure. Across 12 exercises, the median departure time fell from 11 minutes before the trial to 8 minutes during it. Two trial exercises still took longer than 11 minutes, and in both cases crew assembly was delayed.",
        "Staff generally liked having equipment in one place, although several noted that the crates occupied useful bay space. The district plans a further trial at two stations with different building layouts before deciding whether to use the system permanently.",
      ],
    },
    stem: "What happened when a crate seal was broken or an item from the crate was used?",
    options: [
      option("A", "The crate stayed at the station until the end of the four-week trial.", "confuses_trial_duration_with_restocking"),
      option("B", "The crew restocked the crate from its usual storerooms.", "substitutes_old_collection_process"),
      option("C", "The crate was returned to central logistics and a reserve crate was issued.", "correct"),
      option("D", "The station stopped taking part in the trial.", "invents_trial_withdrawal"),
    ],
    correctOptionId: "C",
    explanation: "The passage explicitly states that a used or unsealed crate went back to central logistics for restocking and was replaced by a reserve crate.",
    misconceptionTags: { A: "confuses_trial_duration_with_restocking", B: "substitutes_old_collection_process", C: "correct", D: "invents_trial_withdrawal" },
  },
  {
    questionId: "VB-CAL-011",
    blueprintId: "VERBAL-11",
    familyId: "long_passage_inference_v1",
    archetype: "long_passage_inference",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 60, maxSec: 75 },
    source: {
      eyebrow: "Operations trial",
      title: "Pre-packed flood-response crates",
      paragraphs: [
        "During July, North District ran a four-week trial of pre-packed flood-response crates. Four stations each received two sealed crates containing the equipment normally collected from several storerooms after an alert. Every crate carried an external checklist, and crews checked the seal and expiry dates each week without opening it. The crates were not to be opened for routine training.",
        "If a seal was broken or an item was used, the crate was returned to central logistics for restocking and a reserve crate was issued. The trial was intended to reduce the time between an alert and vehicle departure; it did not change crew numbers or the response procedure. Across 12 exercises, the median departure time fell from 11 minutes before the trial to 8 minutes during it. Two trial exercises still took longer than 11 minutes, and in both cases crew assembly was delayed.",
        "Staff generally liked having equipment in one place, although several noted that the crates occupied useful bay space. The district plans a further trial at two stations with different building layouts before deciding whether to use the system permanently.",
      ],
    },
    stem: "Which inference is best supported by the trial?",
    options: [
      option("A", "Pre-packed crates may reduce equipment-gathering delay, but they do not remove delays caused by late crew assembly.", "correct"),
      option("B", "Pre-packed crates have been proven to reduce departure time at every station regardless of layout.", "overgeneralises_and_claims_proof"),
      option("C", "All staff preferred the crates to the previous system.", "turns_general_feedback_into_unanimity"),
      option("D", "The district has already decided to introduce the crates permanently.", "ignores_planned_further_trial"),
    ],
    correctOptionId: "A",
    explanation: "Departure times were generally lower, while the two slower trial exercises were linked to delayed crew assembly. That supports a modest inference about equipment-gathering delay, not universal proof or a final rollout decision.",
    misconceptionTags: { A: "correct", B: "overgeneralises_and_claims_proof", C: "turns_general_feedback_into_unanimity", D: "ignores_planned_further_trial" },
  },
  {
    questionId: "VB-CAL-012",
    blueprintId: "VERBAL-12",
    familyId: "mixed_source_table_text_v1",
    archetype: "mixed_source_table_text",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 55, maxSec: 70 },
    source: {
      eyebrow: "Training roster",
      title: "Pump 2 assignment",
      paragraphs: [
        "The 10:00 Pump 2 exercise needs one operator. The operator must have a current Pump 2 authorisation and must be available by 10:00.",
      ],
      table: {
        caption: "Roster information",
        headers: ["Person", "Pump 2 auth.", "Available"],
        rows: [
          ["Ana", "Current", "10:20"],
          ["Ben", "Expired", "09:45"],
          ["Cara", "Current", "09:50"],
          ["Dev", "Current", "10:40"],
        ],
      },
    },
    stem: "Who can be assigned as the Pump 2 operator at 10:00?",
    options: [
      option("A", "Ana", "meets_authorisation_but_misses_time"),
      option("B", "Ben", "meets_time_but_authorisation_expired"),
      option("C", "Cara", "correct"),
      option("D", "Dev", "meets_authorisation_but_misses_time"),
    ],
    correctOptionId: "C",
    explanation: "Cara is the only person who meets both conditions: current Pump 2 authorisation and availability by 10:00.",
    misconceptionTags: { A: "meets_authorisation_but_misses_time", B: "meets_time_but_authorisation_expired", C: "correct", D: "meets_authorisation_but_misses_time" },
  },
  {
    questionId: "VB-CAL-013",
    blueprintId: "VERBAL-13",
    familyId: "vocabulary_antonym_v1",
    archetype: "vocabulary_antonym",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 20, maxSec: 30 },
    source: { eyebrow: "Vocabulary", title: "SCARCE" },
    stem: "Which word is opposite in meaning to “scarce”?",
    options: [
      option("A", "Abundant", "correct"),
      option("B", "Limited", "chooses_related_meaning"),
      option("C", "Rare", "chooses_synonym"),
      option("D", "Inadequate", "chooses_negative_association"),
    ],
    correctOptionId: "A",
    explanation: "“Scarce” means in short supply or hard to find. “Abundant” means plentiful, so it is the opposite.",
    misconceptionTags: { A: "correct", B: "chooses_related_meaning", C: "chooses_synonym", D: "chooses_negative_association" },
  },
  {
    questionId: "VB-CAL-014",
    blueprintId: "VERBAL-14",
    familyId: "vocabulary_synonym_v1",
    archetype: "vocabulary_synonym",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 20, maxSec: 30 },
    source: { eyebrow: "Vocabulary", title: "VERIFY" },
    stem: "Which word is closest in meaning to “verify”?",
    options: [
      option("A", "Confirm", "correct"),
      option("B", "Postpone", "chooses_unrelated_process_word"),
      option("C", "Estimate", "confuses_checking_with_approximation"),
      option("D", "Replace", "chooses_unrelated_action"),
    ],
    correctOptionId: "A",
    explanation: "To verify something is to check or confirm that it is true or correct.",
    misconceptionTags: { A: "correct", B: "chooses_unrelated_process_word", C: "confuses_checking_with_approximation", D: "chooses_unrelated_action" },
  },
  {
    questionId: "VB-CAL-015",
    blueprintId: "VERBAL-15",
    familyId: "word_relationship_v1",
    archetype: "word_relationship",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 25, maxSec: 35 },
    source: { eyebrow: "Word relationship", title: "THERMOMETER : TEMPERATURE" },
    stem: "Thermometer is to temperature as scale is to ____.",
    options: [
      option("A", "Weight", "correct"),
      option("B", "Distance", "chooses_measurement_but_wrong_instrument"),
      option("C", "Volume", "chooses_measurement_but_wrong_instrument"),
      option("D", "Speed", "chooses_measurement_but_wrong_instrument"),
    ],
    correctOptionId: "A",
    explanation: "A thermometer measures temperature; in the same relationship, a scale measures weight.",
    misconceptionTags: { A: "correct", B: "chooses_measurement_but_wrong_instrument", C: "chooses_measurement_but_wrong_instrument", D: "chooses_measurement_but_wrong_instrument" },
  },
  {
    questionId: "VB-CAL-016",
    blueprintId: "VERBAL-16",
    familyId: "sentence_completion_v1",
    archetype: "sentence_completion",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 25, maxSec: 35 },
    source: {
      eyebrow: "Sentence completion",
      paragraphs: [
        "Because the weather report was uncertain, the coordinator kept the departure time _____ until the final update.",
      ],
    },
    stem: "Which word best completes the sentence?",
    options: [
      option("A", "permanent", "contradicts_uncertainty"),
      option("B", "provisional", "correct"),
      option("C", "overdue", "imports_lateness"),
      option("D", "identical", "does_not_fit_context"),
    ],
    correctOptionId: "B",
    explanation: "“Provisional” means temporary or subject to later confirmation, which fits a departure time being held open until the final weather update.",
    misconceptionTags: { A: "contradicts_uncertainty", B: "correct", C: "imports_lateness", D: "does_not_fit_context" },
  },
];

export const verbalCalibrationCompletionItems: VerbalCalibrationPilotItem[] = [
  {
    questionId: "VB-CAL-017",
    blueprintId: "VERBAL-17",
    familyId: "claim_vs_evidence_v1",
    archetype: "claim_vs_evidence",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    source: {
      eyebrow: "Handover trial",
      title: "Night-shift checklist",
      paragraphs: [
        "A depot tested a one-page handover checklist on its night shift for six weeks. During the trial, 27 of 30 handovers contained all six required information items. In the previous six-week period, 21 of 30 handovers had contained all six items. Staffing levels were unchanged. The trial involved this depot only, and two of the three incomplete trial handovers concerned equipment that was still away for repair.",
      ],
    },
    stem: "Which claim is supported by the evidence given?",
    options: [
      option("A", "The checklist eliminated incomplete handovers at the depot.", "turns_improvement_into_elimination"),
      option("B", "Complete handovers were more common during the checklist trial than in the previous six-week period at this depot.", "correct"),
      option("C", "The checklist was proven to be the cause of the improvement.", "claims_causation_from_before_after_comparison"),
      option("D", "The same improvement will occur at every depot that adopts the checklist.", "generalises_beyond_single_depot"),
    ],
    correctOptionId: "B",
    explanation: "The report supports a limited comparison at this depot: 27 of 30 handovers were complete during the trial versus 21 of 30 previously. It does not show elimination, prove causation or justify generalising to every depot.",
    misconceptionTags: { A: "turns_improvement_into_elimination", B: "correct", C: "claims_causation_from_before_after_comparison", D: "generalises_beyond_single_depot" },
  },
  {
    questionId: "VB-CAL-018",
    blueprintId: "VERBAL-18",
    familyId: "reference_resolution_v1",
    archetype: "reference_resolution",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    source: {
      eyebrow: "Inspection note",
      paragraphs: [
        "During the morning inspection, the crew found that the portable pump's suction hose had split. They replaced the hose before starting the pump. This allowed the wet test to proceed without postponing the exercise.",
      ],
    },
    stem: "In the final sentence, what does “This” refer to?",
    options: [
      option("A", "Finding the split during the morning inspection", "selects_earlier_event_not_immediate_cause"),
      option("B", "Replacing the suction hose before starting the pump", "correct"),
      option("C", "Starting the pump before the hose was replaced", "reverses_sequence"),
      option("D", "Postponing the exercise", "selects_outcome_that_did_not_occur"),
    ],
    correctOptionId: "B",
    explanation: "“This” refers to the immediately preceding action: replacing the split suction hose before the pump was started. That replacement is what allowed the wet test to proceed.",
    misconceptionTags: { A: "selects_earlier_event_not_immediate_cause", B: "correct", C: "reverses_sequence", D: "selects_outcome_that_did_not_occur" },
  },
  {
    questionId: "VB-CAL-019",
    blueprintId: "VERBAL-19",
    familyId: "policy_interpretation_v1",
    archetype: "policy_interpretation",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 55, maxSec: 70 },
    source: {
      eyebrow: "Workshop access policy",
      bullets: [
        "Authorised technicians may collect standard hand tools during workshop opening hours without supervisor approval.",
        "Power tools may be collected only by technicians with a current power-tool endorsement.",
        "After-hours collection of any tool requires approval from the duty supervisor.",
        "A tool tagged OUT OF SERVICE must not be removed except by maintenance staff taking it for repair.",
      ],
    },
    stem: "Lena is an authorised technician but does not hold a power-tool endorsement. At 14:00, which action is permitted without supervisor approval?",
    options: [
      option("A", "Collect an available standard hand tool that is not tagged OUT OF SERVICE.", "correct"),
      option("B", "Collect a power drill because the workshop is open.", "ignores_power_tool_endorsement"),
      option("C", "Collect a standard hand tool tagged OUT OF SERVICE for normal use.", "ignores_out_of_service_restriction"),
      option("D", "Return at 22:00 and collect a standard hand tool without contacting the duty supervisor.", "ignores_after_hours_approval"),
    ],
    correctOptionId: "A",
    explanation: "During opening hours an authorised technician may collect an ordinary standard hand tool without supervisor approval. Lena cannot collect a power tool without the endorsement, cannot remove an OUT OF SERVICE tool for normal use, and needs duty-supervisor approval after hours.",
    misconceptionTags: { A: "correct", B: "ignores_power_tool_endorsement", C: "ignores_out_of_service_restriction", D: "ignores_after_hours_approval" },
  },
  {
    questionId: "VB-CAL-020",
    blueprintId: "VERBAL-20",
    familyId: "multi_paragraph_synthesis_v1",
    archetype: "multi_paragraph_synthesis",
    difficulty: "stretch",
    reasoningSteps: 4,
    targetTimeRangeSec: { minSec: 65, maxSec: 80 },
    source: {
      eyebrow: "Drill review",
      title: "Pre-start briefings",
      paragraphs: [
        "For six weeks, Station 6 used a 10-minute pre-start equipment briefing before routine drills. Compared with the previous six weeks, the average number of omitted equipment checks fell from 3.1 to 1.4 per drill. However, drills began an average of six minutes later.",
        "In three time-critical simulations, supervisors shortened the briefing to three minutes. Those simulations averaged 2.3 omitted checks. The review team concluded that the full briefing improved check completeness but may not suit every time-critical situation, and it recommended testing an intermediate five-minute format.",
      ],
    },
    stem: "Which conclusion is best supported by the passage as a whole?",
    options: [
      option("A", "Longer pre-start briefings were associated with fewer omitted checks, but the extra time creates a trade-off that warrants testing a shorter format.", "correct"),
      option("B", "The 10-minute briefing should be mandatory before every response because it removed all omitted checks.", "ignores_time_tradeoff_and_claims_elimination"),
      option("C", "Shortening the briefing to three minutes produced better check completeness than the 10-minute briefing.", "reverses_reported_pattern"),
      option("D", "The review showed that briefing length has no relationship to check completeness.", "ignores_observed_difference"),
    ],
    correctOptionId: "A",
    explanation: "Both paragraphs support a balanced conclusion: longer briefings coincided with more complete checks, but they also cost time. The three-minute simulations sat between the earlier and 10-minute results, supporting the plan to test a compromise rather than an absolute rule.",
    misconceptionTags: { A: "correct", B: "ignores_time_tradeoff_and_claims_elimination", C: "reverses_reported_pattern", D: "ignores_observed_difference" },
  },
];

export const verbalCalibrationAllItems: VerbalCalibrationPilotItem[] = [
  ...verbalCalibrationCoreItems,
  ...verbalCalibrationAppliedItems,
  ...verbalCalibrationCompletionItems,
];
