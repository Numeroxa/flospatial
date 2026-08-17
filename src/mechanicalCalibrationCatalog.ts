export type MechanicalCalibrationArchetype =
  | "gear_speed_ratio"
  | "compound_gear_speed"
  | "open_belt_direction"
  | "crossed_belt_direction";

export type MechanicalCalibrationDiagram =
  | {
      kind: "gear_pair";
      driverTeeth: number;
      drivenTeeth: number;
      driverRpm: number;
      driverDirection: "clockwise" | "anticlockwise";
    }
  | {
      kind: "compound_gears";
      aTeeth: number;
      bTeeth: number;
      cTeeth: number;
      dTeeth: number;
      driverRpm: number;
      driverDirection: "clockwise" | "anticlockwise";
    }
  | {
      kind: "belt_drive";
      crossed: boolean;
      driverDirection: "clockwise" | "anticlockwise";
      driverDiameter: number;
      drivenDiameter: number;
    };

export type MechanicalCalibrationPilotItem = {
  questionId: string;
  blueprintId: "MECHANICAL-02" | "MECHANICAL-03" | "MECHANICAL-04" | "MECHANICAL-05";
  familyId: string;
  archetype: MechanicalCalibrationArchetype;
  difficulty: "foundation" | "applied" | "stretch";
  reasoningSteps: number;
  targetTimeRangeSec: { minSec: number; maxSec: number };
  rapidRecognition: boolean;
  stem: string;
  options: { optionId: "A" | "B" | "C" | "D"; text: string }[];
  correctOptionId: "A" | "B" | "C" | "D";
  explanation: string;
  misconceptionTags: Record<"A" | "B" | "C" | "D", string>;
  diagram: MechanicalCalibrationDiagram;
};

export const MECHANICAL_CALIBRATION_PILOT_VERSION = "APTESTA_MECH_CAL_PILOT_2026_08_V0_6";

export const mechanicalCalibrationPilotItems: MechanicalCalibrationPilotItem[] = [
  {
    questionId: "MECH-CAL-GR-01",
    blueprintId: "MECHANICAL-02",
    familyId: "gear_speed_ratio_v1",
    archetype: "gear_speed_ratio",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 40, maxSec: 50 },
    rapidRecognition: false,
    stem: "Gear A has 20 teeth and turns at 120 rpm. It directly drives Gear B, which has 40 teeth. What is Gear B's speed?",
    options: [
      { optionId: "A", text: "60 rpm" },
      { optionId: "B", text: "120 rpm" },
      { optionId: "C", text: "240 rpm" },
      { optionId: "D", text: "80 rpm" },
    ],
    correctOptionId: "A",
    explanation: "Speed is inversely proportional to tooth count. Gear B has twice as many teeth, so it turns at half the speed: 120 × 20/40 = 60 rpm.",
    misconceptionTags: { A: "correct", B: "ignored_ratio", C: "ratio_inverted", D: "arithmetic_error" },
    diagram: { kind: "gear_pair", driverTeeth: 20, drivenTeeth: 40, driverRpm: 120, driverDirection: "clockwise" },
  },
  {
    questionId: "MECH-CAL-GR-02",
    blueprintId: "MECHANICAL-02",
    familyId: "gear_speed_ratio_v1",
    archetype: "gear_speed_ratio",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 40, maxSec: 50 },
    rapidRecognition: false,
    stem: "Gear A has 36 teeth and turns at 90 rpm. It drives Gear B, which has 18 teeth. What is Gear B's speed?",
    options: [
      { optionId: "A", text: "45 rpm" },
      { optionId: "B", text: "90 rpm" },
      { optionId: "C", text: "180 rpm" },
      { optionId: "D", text: "270 rpm" },
    ],
    correctOptionId: "C",
    explanation: "The driven gear has half as many teeth, so it turns twice as fast: 90 × 36/18 = 180 rpm.",
    misconceptionTags: { A: "ratio_inverted", B: "ignored_ratio", C: "correct", D: "added_ratio_instead_of_multiplying" },
    diagram: { kind: "gear_pair", driverTeeth: 36, drivenTeeth: 18, driverRpm: 90, driverDirection: "anticlockwise" },
  },
  {
    questionId: "MECH-CAL-CG-01",
    blueprintId: "MECHANICAL-03",
    familyId: "compound_gear_speed_v1",
    archetype: "compound_gear_speed",
    difficulty: "stretch",
    reasoningSteps: 4,
    targetTimeRangeSec: { minSec: 45, maxSec: 55 },
    rapidRecognition: false,
    stem: "Gear A (20 teeth) turns at 120 rpm and drives Gear B (40 teeth). Gear B shares a shaft with Gear C (15 teeth), which drives Gear D (30 teeth). What is Gear D's speed?",
    options: [
      { optionId: "A", text: "30 rpm" },
      { optionId: "B", text: "60 rpm" },
      { optionId: "C", text: "120 rpm" },
      { optionId: "D", text: "240 rpm" },
    ],
    correctOptionId: "A",
    explanation: "A→B halves the speed to 60 rpm. B and C share a shaft, so C is also 60 rpm. C→D halves it again: 60 × 15/30 = 30 rpm.",
    misconceptionTags: { A: "correct", B: "stopped_after_first_stage", C: "ignored_both_ratios", D: "ratios_inverted" },
    diagram: { kind: "compound_gears", aTeeth: 20, bTeeth: 40, cTeeth: 15, dTeeth: 30, driverRpm: 120, driverDirection: "clockwise" },
  },
  {
    questionId: "MECH-CAL-CG-02",
    blueprintId: "MECHANICAL-03",
    familyId: "compound_gear_speed_v1",
    archetype: "compound_gear_speed",
    difficulty: "stretch",
    reasoningSteps: 4,
    targetTimeRangeSec: { minSec: 45, maxSec: 55 },
    rapidRecognition: false,
    stem: "Gear A (24 teeth) turns at 150 rpm and drives Gear B (48 teeth). Gear B shares a shaft with Gear C (20 teeth), which drives Gear D (10 teeth). What is Gear D's speed?",
    options: [
      { optionId: "A", text: "37.5 rpm" },
      { optionId: "B", text: "75 rpm" },
      { optionId: "C", text: "150 rpm" },
      { optionId: "D", text: "300 rpm" },
    ],
    correctOptionId: "C",
    explanation: "A→B halves 150 rpm to 75 rpm. C shares B's shaft, so C is 75 rpm. C has twice as many teeth as D, so D turns twice as fast: 150 rpm.",
    misconceptionTags: { A: "applied_first_ratio_twice", B: "stopped_after_first_stage", C: "correct", D: "ignored_first_stage" },
    diagram: { kind: "compound_gears", aTeeth: 24, bTeeth: 48, cTeeth: 20, dTeeth: 10, driverRpm: 150, driverDirection: "anticlockwise" },
  },
  {
    questionId: "MECH-CAL-OB-01",
    blueprintId: "MECHANICAL-04",
    familyId: "open_belt_direction_v1",
    archetype: "open_belt_direction",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 30, maxSec: 35 },
    rapidRecognition: true,
    stem: "Pulley A turns clockwise and drives Pulley B with an open belt. Which way does Pulley B turn?",
    options: [
      { optionId: "A", text: "Clockwise" },
      { optionId: "B", text: "Anticlockwise" },
      { optionId: "C", text: "It does not turn" },
      { optionId: "D", text: "Direction depends on pulley size" },
    ],
    correctOptionId: "A",
    explanation: "An open belt makes the driven pulley turn in the same direction as the driver.",
    misconceptionTags: { A: "correct", B: "confused_with_crossed_belt", C: "motion_transfer_error", D: "size_direction_confusion" },
    diagram: { kind: "belt_drive", crossed: false, driverDirection: "clockwise", driverDiameter: 70, drivenDiameter: 100 },
  },
  {
    questionId: "MECH-CAL-OB-02",
    blueprintId: "MECHANICAL-04",
    familyId: "open_belt_direction_v1",
    archetype: "open_belt_direction",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 30, maxSec: 35 },
    rapidRecognition: true,
    stem: "Pulley A turns anticlockwise and drives a smaller Pulley B with an open belt. Which way does Pulley B turn?",
    options: [
      { optionId: "A", text: "Clockwise" },
      { optionId: "B", text: "Anticlockwise" },
      { optionId: "C", text: "It alternates direction" },
      { optionId: "D", text: "Direction cannot be known" },
    ],
    correctOptionId: "B",
    explanation: "Open-belt pulleys turn in the same direction. Pulley size changes speed, not the direction relationship.",
    misconceptionTags: { A: "confused_with_crossed_belt", B: "correct", C: "oscillation_misconception", D: "size_direction_confusion" },
    diagram: { kind: "belt_drive", crossed: false, driverDirection: "anticlockwise", driverDiameter: 100, drivenDiameter: 60 },
  },
  {
    questionId: "MECH-CAL-XB-01",
    blueprintId: "MECHANICAL-05",
    familyId: "crossed_belt_direction_v1",
    archetype: "crossed_belt_direction",
    difficulty: "applied",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 30, maxSec: 35 },
    rapidRecognition: true,
    stem: "Pulley A turns clockwise and drives Pulley B with a crossed belt. Which way does Pulley B turn?",
    options: [
      { optionId: "A", text: "Clockwise" },
      { optionId: "B", text: "Anticlockwise" },
      { optionId: "C", text: "It does not turn" },
      { optionId: "D", text: "Direction depends on pulley diameter" },
    ],
    correctOptionId: "B",
    explanation: "A crossed belt reverses the direction relationship, so the driven pulley turns opposite to the driver.",
    misconceptionTags: { A: "confused_with_open_belt", B: "correct", C: "motion_transfer_error", D: "size_direction_confusion" },
    diagram: { kind: "belt_drive", crossed: true, driverDirection: "clockwise", driverDiameter: 75, drivenDiameter: 95 },
  },
  {
    questionId: "MECH-CAL-XB-02",
    blueprintId: "MECHANICAL-05",
    familyId: "crossed_belt_direction_v1",
    archetype: "crossed_belt_direction",
    difficulty: "applied",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 30, maxSec: 35 },
    rapidRecognition: true,
    stem: "Pulley A turns anticlockwise and drives Pulley B with a crossed belt. Which way does Pulley B turn?",
    options: [
      { optionId: "A", text: "Clockwise" },
      { optionId: "B", text: "Anticlockwise" },
      { optionId: "C", text: "It alternates direction" },
      { optionId: "D", text: "Direction cannot be known" },
    ],
    correctOptionId: "A",
    explanation: "A crossed belt makes the driven pulley turn opposite to the driver, so B turns clockwise.",
    misconceptionTags: { A: "correct", B: "confused_with_open_belt", C: "oscillation_misconception", D: "crossed_belt_uncertainty" },
    diagram: { kind: "belt_drive", crossed: true, driverDirection: "anticlockwise", driverDiameter: 95, drivenDiameter: 70 },
  },
];

export const mechanicalCalibrationPilotById = Object.fromEntries(
  mechanicalCalibrationPilotItems.map((item) => [item.questionId, item]),
) as Record<string, MechanicalCalibrationPilotItem>;
