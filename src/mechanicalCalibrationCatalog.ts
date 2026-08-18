export type MechanicalCalibrationArchetype =
  | "gear_speed_ratio"
  | "compound_gear_speed"
  | "open_belt_direction"
  | "crossed_belt_direction"
  | "pulley_supporting_strands"
  | "pulley_distance_tradeoff"
  | "lever_moment_balance"
  | "lever_fulcrum_shift"
  | "hydraulic_force_area"
  | "hydraulic_volume_displacement"
  | "linked_bar_motion"
  | "bell_crank_direction"
  | "inclined_plane_force"
  | "wheel_axle_advantage"
  | "friction_start_force"
  | "stability_base_height"
  | "trolley_inertia"
  | "mechanical_view_rotation"
  | "integrated_machine_motion";

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
    }
  | {
      kind: "pulley_system";
      supportingStrands: 2 | 4;
      loadN: number;
      loadTravelM?: number;
    }
  | {
      kind: "lever_balance";
      loadN: number;
      loadArmM: number;
      effortArmM: number;
    }
  | {
      kind: "lever_shift";
      shift: "toward_load" | "toward_effort";
    }
  | {
      kind: "hydraulic";
      smallAreaCm2: number;
      largeAreaCm2: number;
      inputForceN?: number;
      inputMoveCm?: number;
    }
  | { kind: "linked_bars"; inputDirection: "right" | "left" }
  | { kind: "bell_crank"; inputDirection: "down" | "up" }
  | { kind: "inclined_planes"; heightM: number; shortLengthM: number; longLengthM: number }
  | { kind: "wheel_axle_compare"; aWheelRadiusCm: number; aAxleRadiusCm: number; bWheelRadiusCm: number; bAxleRadiusCm: number }
  | { kind: "friction_compare"; loadN: number }
  | { kind: "stability_compare" }
  | { kind: "trolley_inertia"; accelerationDirection: "right" | "left" }
  | { kind: "shaft_view"; endADirection: "clockwise" | "anticlockwise" }
  | { kind: "integrated_gear_belt"; aTeeth: number; bTeeth: number; driverDirection: "clockwise" | "anticlockwise"; crossed: boolean };

export type MechanicalCalibrationPilotItem = {
  questionId: string;
  blueprintId: `MECHANICAL-${string}`;
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

export const MECHANICAL_CALIBRATION_PILOT_VERSION = "APTESTA_MECH_CAL_PILOT_2026_08_V0_8";

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
  {
    questionId: "MECH-CAL-PS-01",
    blueprintId: "MECHANICAL-06",
    familyId: "pulley_supporting_strands_v1",
    archetype: "pulley_supporting_strands",
    difficulty: "foundation",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 40 },
    rapidRecognition: true,
    stem: "Ignoring friction, a 200 N load is supported by the two rope strands shown. What downward effort is needed to support its weight?",
    options: [
      { optionId: "A", text: "50 N" },
      { optionId: "B", text: "100 N" },
      { optionId: "C", text: "200 N" },
      { optionId: "D", text: "400 N" },
    ],
    correctOptionId: "B",
    explanation: "Two rope strands support the moving load, so the ideal mechanical advantage is 2. The required effort is 200 ÷ 2 = 100 N.",
    misconceptionTags: { A: "counted_four_supports", B: "correct", C: "ignored_mechanical_advantage", D: "multiplied_instead_of_dividing" },
    diagram: { kind: "pulley_system", supportingStrands: 2, loadN: 200 },
  },
  {
    questionId: "MECH-CAL-PS-02",
    blueprintId: "MECHANICAL-06",
    familyId: "pulley_supporting_strands_v1",
    archetype: "pulley_supporting_strands",
    difficulty: "foundation",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 40 },
    rapidRecognition: true,
    stem: "Ignoring friction, a 400 N load is supported by four rope strands. What effort is needed to support its weight?",
    options: [
      { optionId: "A", text: "50 N" },
      { optionId: "B", text: "100 N" },
      { optionId: "C", text: "200 N" },
      { optionId: "D", text: "400 N" },
    ],
    correctOptionId: "B",
    explanation: "Four supporting strands give an ideal mechanical advantage of 4. The effort is 400 ÷ 4 = 100 N.",
    misconceptionTags: { A: "overcounted_supports", B: "correct", C: "counted_two_supports", D: "ignored_mechanical_advantage" },
    diagram: { kind: "pulley_system", supportingStrands: 4, loadN: 400 },
  },
  {
    questionId: "MECH-CAL-PD-01",
    blueprintId: "MECHANICAL-07",
    familyId: "pulley_distance_tradeoff_v1",
    archetype: "pulley_distance_tradeoff",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 40, maxSec: 45 },
    rapidRecognition: false,
    stem: "A four-strand pulley system raises its load by 0.5 m. Ignoring losses, how far must the free end of the rope be pulled?",
    options: [
      { optionId: "A", text: "0.125 m" },
      { optionId: "B", text: "0.5 m" },
      { optionId: "C", text: "2.0 m" },
      { optionId: "D", text: "4.0 m" },
    ],
    correctOptionId: "C",
    explanation: "A four-strand system trades distance for force. To raise the load 0.5 m, each of four supporting rope segments shortens by 0.5 m, so 4 × 0.5 = 2.0 m of rope must be pulled.",
    misconceptionTags: { A: "divided_distance", B: "ignored_tradeoff", C: "correct", D: "double_counted_distance" },
    diagram: { kind: "pulley_system", supportingStrands: 4, loadN: 320, loadTravelM: 0.5 },
  },
  {
    questionId: "MECH-CAL-PD-02",
    blueprintId: "MECHANICAL-07",
    familyId: "pulley_distance_tradeoff_v1",
    archetype: "pulley_distance_tradeoff",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 40, maxSec: 45 },
    rapidRecognition: false,
    stem: "A two-strand moving-pulley system raises its load by 0.75 m. Ignoring losses, how far must the rope end be pulled?",
    options: [
      { optionId: "A", text: "0.375 m" },
      { optionId: "B", text: "0.75 m" },
      { optionId: "C", text: "1.5 m" },
      { optionId: "D", text: "3.0 m" },
    ],
    correctOptionId: "C",
    explanation: "With two supporting strands, the rope must move twice the load distance: 2 × 0.75 = 1.5 m.",
    misconceptionTags: { A: "divided_distance", B: "ignored_tradeoff", C: "correct", D: "used_four_strands" },
    diagram: { kind: "pulley_system", supportingStrands: 2, loadN: 240, loadTravelM: 0.75 },
  },
  {
    questionId: "MECH-CAL-LM-01",
    blueprintId: "MECHANICAL-08",
    familyId: "lever_moment_balance_v1",
    archetype: "lever_moment_balance",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 40, maxSec: 50 },
    rapidRecognition: false,
    stem: "A 300 N load acts 0.4 m from the fulcrum. The effort is applied 1.2 m from the fulcrum on the other side. What effort balances the lever?",
    options: [
      { optionId: "A", text: "75 N" },
      { optionId: "B", text: "100 N" },
      { optionId: "C", text: "300 N" },
      { optionId: "D", text: "900 N" },
    ],
    correctOptionId: "B",
    explanation: "Balance moments about the fulcrum: 300 × 0.4 = effort × 1.2. The effort is 120 ÷ 1.2 = 100 N.",
    misconceptionTags: { A: "arm_ratio_arithmetic_error", B: "correct", C: "ignored_arm_lengths", D: "multiplied_arm_ratio" },
    diagram: { kind: "lever_balance", loadN: 300, loadArmM: 0.4, effortArmM: 1.2 },
  },
  {
    questionId: "MECH-CAL-LM-02",
    blueprintId: "MECHANICAL-08",
    familyId: "lever_moment_balance_v1",
    archetype: "lever_moment_balance",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 40, maxSec: 50 },
    rapidRecognition: false,
    stem: "A 240 N load is 0.5 m from a fulcrum. An effort is applied 1.0 m from the fulcrum on the opposite side. What effort is required for balance?",
    options: [
      { optionId: "A", text: "60 N" },
      { optionId: "B", text: "120 N" },
      { optionId: "C", text: "240 N" },
      { optionId: "D", text: "480 N" },
    ],
    correctOptionId: "B",
    explanation: "The load moment is 240 × 0.5 = 120 N·m. At a 1.0 m effort arm, the balancing effort is 120 N.",
    misconceptionTags: { A: "halved_twice", B: "correct", C: "ignored_arm_lengths", D: "ratio_inverted" },
    diagram: { kind: "lever_balance", loadN: 240, loadArmM: 0.5, effortArmM: 1.0 },
  },
  {
    questionId: "MECH-CAL-LF-01",
    blueprintId: "MECHANICAL-09",
    familyId: "lever_fulcrum_shift_v1",
    archetype: "lever_fulcrum_shift",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 40 },
    rapidRecognition: true,
    stem: "The load and effort positions stay fixed, but the fulcrum is moved closer to the load. What happens to the effort needed to balance the same load?",
    options: [
      { optionId: "A", text: "Less effort is needed" },
      { optionId: "B", text: "More effort is needed" },
      { optionId: "C", text: "The effort is unchanged" },
      { optionId: "D", text: "The lever can no longer balance" },
    ],
    correctOptionId: "A",
    explanation: "Moving the fulcrum toward the load shortens the load arm and lengthens the effort arm. Both changes increase mechanical advantage, so less effort is required.",
    misconceptionTags: { A: "correct", B: "fulcrum_effect_reversed", C: "ignored_arm_change", D: "balance_impossibility" },
    diagram: { kind: "lever_shift", shift: "toward_load" },
  },
  {
    questionId: "MECH-CAL-LF-02",
    blueprintId: "MECHANICAL-09",
    familyId: "lever_fulcrum_shift_v1",
    archetype: "lever_fulcrum_shift",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 40 },
    rapidRecognition: true,
    stem: "The load and effort positions stay fixed, but the fulcrum is moved closer to the effort. What happens to the effort needed to balance the same load?",
    options: [
      { optionId: "A", text: "Less effort is needed" },
      { optionId: "B", text: "More effort is needed" },
      { optionId: "C", text: "The effort is unchanged" },
      { optionId: "D", text: "The load becomes weightless" },
    ],
    correctOptionId: "B",
    explanation: "Moving the fulcrum toward the effort shortens the effort arm and lengthens the load arm. Mechanical advantage falls, so more effort is required.",
    misconceptionTags: { A: "fulcrum_effect_reversed", B: "correct", C: "ignored_arm_change", D: "weight_misconception" },
    diagram: { kind: "lever_shift", shift: "toward_effort" },
  },
  {
    questionId: "MECH-CAL-HF-01",
    blueprintId: "MECHANICAL-10",
    familyId: "hydraulic_force_area_v1",
    archetype: "hydraulic_force_area",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 45, maxSec: 55 },
    rapidRecognition: false,
    stem: "A 100 N force is applied to a 2 cm² piston. It is connected to an 8 cm² output piston. Ignoring losses, what output force is produced?",
    options: [
      { optionId: "A", text: "25 N" },
      { optionId: "B", text: "100 N" },
      { optionId: "C", text: "400 N" },
      { optionId: "D", text: "800 N" },
    ],
    correctOptionId: "C",
    explanation: "Pressure is transmitted equally: 100/2 = 50 N/cm². On 8 cm², output force = 50 × 8 = 400 N.",
    misconceptionTags: { A: "area_ratio_inverted", B: "ignored_area_ratio", C: "correct", D: "multiplied_by_output_area_only" },
    diagram: { kind: "hydraulic", smallAreaCm2: 2, largeAreaCm2: 8, inputForceN: 100 },
  },
  {
    questionId: "MECH-CAL-HF-02",
    blueprintId: "MECHANICAL-10",
    familyId: "hydraulic_force_area_v1",
    archetype: "hydraulic_force_area",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 45, maxSec: 55 },
    rapidRecognition: false,
    stem: "A 90 N force is applied to a 3 cm² piston. The output piston has an area of 12 cm². Ignoring losses, what output force is produced?",
    options: [
      { optionId: "A", text: "22.5 N" },
      { optionId: "B", text: "90 N" },
      { optionId: "C", text: "270 N" },
      { optionId: "D", text: "360 N" },
    ],
    correctOptionId: "D",
    explanation: "Input pressure is 90/3 = 30 N/cm². The same pressure acts on 12 cm², producing 30 × 12 = 360 N.",
    misconceptionTags: { A: "area_ratio_inverted", B: "ignored_area_ratio", C: "used_area_difference", D: "correct" },
    diagram: { kind: "hydraulic", smallAreaCm2: 3, largeAreaCm2: 12, inputForceN: 90 },
  },
  {
    questionId: "MECH-CAL-HM-01",
    blueprintId: "MECHANICAL-11",
    familyId: "hydraulic_volume_displacement_v1",
    archetype: "hydraulic_volume_displacement",
    difficulty: "stretch",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 45, maxSec: 55 },
    rapidRecognition: false,
    stem: "A 2 cm² input piston moves downward 12 cm. The connected output piston has an area of 8 cm². Ignoring fluid compression, how far does the output piston move upward?",
    options: [
      { optionId: "A", text: "3 cm" },
      { optionId: "B", text: "6 cm" },
      { optionId: "C", text: "12 cm" },
      { optionId: "D", text: "48 cm" },
    ],
    correctOptionId: "A",
    explanation: "Displaced volumes are equal: 2 × 12 = 24 cm³. The 8 cm² output piston therefore moves 24/8 = 3 cm.",
    misconceptionTags: { A: "correct", B: "used_area_difference", C: "assumed_equal_distance", D: "area_ratio_inverted" },
    diagram: { kind: "hydraulic", smallAreaCm2: 2, largeAreaCm2: 8, inputMoveCm: 12 },
  },
  {
    questionId: "MECH-CAL-HM-02",
    blueprintId: "MECHANICAL-11",
    familyId: "hydraulic_volume_displacement_v1",
    archetype: "hydraulic_volume_displacement",
    difficulty: "stretch",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 45, maxSec: 55 },
    rapidRecognition: false,
    stem: "A 3 cm² input piston moves downward 15 cm. The output piston has an area of 9 cm². How far does the output piston move upward?",
    options: [
      { optionId: "A", text: "3 cm" },
      { optionId: "B", text: "5 cm" },
      { optionId: "C", text: "15 cm" },
      { optionId: "D", text: "45 cm" },
    ],
    correctOptionId: "B",
    explanation: "Input volume is 3 × 15 = 45 cm³. Dividing by the 9 cm² output area gives 5 cm of movement.",
    misconceptionTags: { A: "used_area_ratio_as_distance", B: "correct", C: "assumed_equal_distance", D: "multiplied_instead_of_dividing" },
    diagram: { kind: "hydraulic", smallAreaCm2: 3, largeAreaCm2: 9, inputMoveCm: 15 },
  },

  {
    questionId: "MECH-CAL-LB-01",
    blueprintId: "MECHANICAL-12",
    familyId: "linked_bar_motion_v1",
    archetype: "linked_bar_motion",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 45 },
    rapidRecognition: false,
    stem: "Two upright bars pivot at their lower ends and are joined by a rigid horizontal link. If the top of the left bar is pushed to the right, which way does the top of the right bar initially move?",
    options: [
      { optionId: "A", text: "Left" },
      { optionId: "B", text: "Right" },
      { optionId: "C", text: "Up" },
      { optionId: "D", text: "It does not move" },
    ],
    correctOptionId: "B",
    explanation: "The left bar rotates clockwise and pushes the rigid link to the right. That pushes the connection point on the right bar to the right, so the right bar also initially rotates clockwise and its top moves right.",
    misconceptionTags: { A: "assumed_link_reverses_motion", B: "correct", C: "ignored_pivots", D: "assumed_locked_system" },
    diagram: { kind: "linked_bars", inputDirection: "right" },
  },
  {
    questionId: "MECH-CAL-BC-01",
    blueprintId: "MECHANICAL-13",
    familyId: "bell_crank_direction_v1",
    archetype: "bell_crank_direction",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 45 },
    rapidRecognition: true,
    stem: "The bell crank pivots at its corner. If the left end is pushed downward, which way does the top end initially move?",
    options: [
      { optionId: "A", text: "Left" },
      { optionId: "B", text: "Right" },
      { optionId: "C", text: "Up" },
      { optionId: "D", text: "Down" },
    ],
    correctOptionId: "A",
    explanation: "Pushing the left arm downward rotates the bell crank anticlockwise about the pivot. The vertical arm therefore swings to the left.",
    misconceptionTags: { A: "correct", B: "rotation_direction_reversed", C: "assumed_same_direction", D: "treated_arms_as_independent" },
    diagram: { kind: "bell_crank", inputDirection: "down" },
  },
  {
    questionId: "MECH-CAL-IP-01",
    blueprintId: "MECHANICAL-14",
    familyId: "inclined_plane_force_v1",
    archetype: "inclined_plane_force",
    difficulty: "foundation",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 45 },
    rapidRecognition: false,
    stem: "Both ramps raise the same load through the same height. Ignoring friction, which ramp requires the smaller force parallel to the ramp?",
    options: [
      { optionId: "A", text: "The 2 m ramp" },
      { optionId: "B", text: "The 4 m ramp" },
      { optionId: "C", text: "They require the same force" },
      { optionId: "D", text: "It depends on the speed" },
    ],
    correctOptionId: "B",
    explanation: "For the same height gain, the longer ramp trades distance for force. Ignoring friction, the 4 m ramp requires less force than the 2 m ramp.",
    misconceptionTags: { A: "shorter_distance_assumed_easier", B: "correct", C: "ignored_mechanical_advantage", D: "confused_force_with_power" },
    diagram: { kind: "inclined_planes", heightM: 1, shortLengthM: 2, longLengthM: 4 },
  },
  {
    questionId: "MECH-CAL-WA-01",
    blueprintId: "MECHANICAL-15",
    familyId: "wheel_axle_advantage_v1",
    archetype: "wheel_axle_advantage",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 45 },
    rapidRecognition: false,
    stem: "Which wheel-and-axle arrangement gives the greater ideal mechanical advantage when effort is applied at the wheel rim?",
    options: [
      { optionId: "A", text: "Arrangement A" },
      { optionId: "B", text: "Arrangement B" },
      { optionId: "C", text: "They are equal" },
      { optionId: "D", text: "Cannot be determined" },
    ],
    correctOptionId: "A",
    explanation: "Mechanical advantage is wheel radius divided by axle radius. A gives 30/5 = 6, while B gives 20/10 = 2, so A has the greater advantage.",
    misconceptionTags: { A: "correct", B: "favoured_larger_axle", C: "ignored_radius_ratio", D: "did_not_use_dimensions" },
    diagram: { kind: "wheel_axle_compare", aWheelRadiusCm: 30, aAxleRadiusCm: 5, bWheelRadiusCm: 20, bAxleRadiusCm: 10 },
  },
  {
    questionId: "MECH-CAL-FR-01",
    blueprintId: "MECHANICAL-16",
    familyId: "friction_start_force_v1",
    archetype: "friction_start_force",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 30, maxSec: 40 },
    rapidRecognition: true,
    stem: "The blocks are identical. Which block requires the larger horizontal force to start moving?",
    options: [
      { optionId: "A", text: "Block A on the smooth surface" },
      { optionId: "B", text: "Block B on the rough surface" },
      { optionId: "C", text: "They require the same force" },
      { optionId: "D", text: "Neither requires a force" },
    ],
    correctOptionId: "B",
    explanation: "The rough surface provides greater static friction, so a larger applied force is required before Block B starts to move.",
    misconceptionTags: { A: "reversed_friction_effect", B: "correct", C: "ignored_surface_effect", D: "ignored_static_friction" },
    diagram: { kind: "friction_compare", loadN: 100 },
  },
  {
    questionId: "MECH-CAL-ST-01",
    blueprintId: "MECHANICAL-17",
    familyId: "stability_base_height_v1",
    archetype: "stability_base_height",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 30, maxSec: 40 },
    rapidRecognition: true,
    stem: "Assuming all three objects have similar mass distribution, which is the most resistant to tipping?",
    options: [
      { optionId: "A", text: "Object A" },
      { optionId: "B", text: "Object B" },
      { optionId: "C", text: "Object C" },
      { optionId: "D", text: "All are equally stable" },
    ],
    correctOptionId: "B",
    explanation: "Object B has the widest base and the lowest centre of mass. Both features make it more resistant to tipping.",
    misconceptionTags: { A: "favoured_height", B: "correct", C: "considered_base_only", D: "ignored_geometry" },
    diagram: { kind: "stability_compare" },
  },
  {
    questionId: "MECH-CAL-IN-01",
    blueprintId: "MECHANICAL-18",
    familyId: "trolley_inertia_v1",
    archetype: "trolley_inertia",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 45 },
    rapidRecognition: false,
    stem: "The trolley suddenly accelerates to the right. Relative to the trolley, which way does the loose block initially appear to move?",
    options: [
      { optionId: "A", text: "Left" },
      { optionId: "B", text: "Right" },
      { optionId: "C", text: "Straight up" },
      { optionId: "D", text: "It cannot move relative to the trolley" },
    ],
    correctOptionId: "A",
    explanation: "The block tends to retain its original state of motion while the trolley accelerates underneath it. Relative to the trolley, the block therefore initially lags to the left.",
    misconceptionTags: { A: "correct", B: "assumed_block_follows_acceleration", C: "wrong_axis", D: "ignored_inertia" },
    diagram: { kind: "trolley_inertia", accelerationDirection: "right" },
  },
  {
    questionId: "MECH-CAL-3D-01",
    blueprintId: "MECHANICAL-19",
    familyId: "mechanical_view_rotation_v1",
    archetype: "mechanical_view_rotation",
    difficulty: "stretch",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    rapidRecognition: false,
    stem: "A shaft appears to rotate clockwise when viewed from end A. If you move to the opposite end B and look back along the same shaft, how does the rotation appear?",
    options: [
      { optionId: "A", text: "Clockwise" },
      { optionId: "B", text: "Anticlockwise" },
      { optionId: "C", text: "It stops" },
      { optionId: "D", text: "The apparent direction depends on shaft speed" },
    ],
    correctOptionId: "B",
    explanation: "Looking along the same rotating shaft from the opposite end reverses the apparent direction. Clockwise from end A appears anticlockwise from end B.",
    misconceptionTags: { A: "ignored_viewpoint_reversal", B: "correct", C: "confused_view_with_motion", D: "confused_direction_with_speed" },
    diagram: { kind: "shaft_view", endADirection: "clockwise" },
  },
  {
    questionId: "MECH-CAL-IM-01",
    blueprintId: "MECHANICAL-20",
    familyId: "integrated_machine_motion_v1",
    archetype: "integrated_machine_motion",
    difficulty: "stretch",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 50, maxSec: 60 },
    rapidRecognition: false,
    stem: "Gear A turns clockwise and drives Gear B. Gear B shares a shaft with pulley C, which drives pulley D through an open belt. Which way does pulley D turn?",
    options: [
      { optionId: "A", text: "Clockwise" },
      { optionId: "B", text: "Anticlockwise" },
      { optionId: "C", text: "It alternates direction" },
      { optionId: "D", text: "It does not turn" },
    ],
    correctOptionId: "B",
    explanation: "Meshed gears reverse direction, so B turns anticlockwise. C shares B's shaft and is also anticlockwise. An open belt preserves pulley direction, so D remains anticlockwise.",
    misconceptionTags: { A: "missed_gear_reversal", B: "correct", C: "assumed_repeated_reversal", D: "treated_shared_shaft_as_lock" },
    diagram: { kind: "integrated_gear_belt", aTeeth: 24, bTeeth: 36, driverDirection: "clockwise", crossed: false },
  },

];

export const mechanicalCalibrationRotationItems = mechanicalCalibrationPilotItems.filter((item) => ["MECHANICAL-02", "MECHANICAL-03", "MECHANICAL-04", "MECHANICAL-05"].includes(item.blueprintId));

export const mechanicalCalibrationForceSystemsItems = mechanicalCalibrationPilotItems.filter((item) => ["MECHANICAL-06", "MECHANICAL-07", "MECHANICAL-08", "MECHANICAL-09", "MECHANICAL-10", "MECHANICAL-11"].includes(item.blueprintId));

export const mechanicalCalibrationExtensionItems = mechanicalCalibrationPilotItems.filter((item) => ["MECHANICAL-12", "MECHANICAL-13", "MECHANICAL-14", "MECHANICAL-15", "MECHANICAL-16", "MECHANICAL-17", "MECHANICAL-18", "MECHANICAL-19", "MECHANICAL-20"].includes(item.blueprintId));

export const mechanicalCalibrationPilotById = Object.fromEntries(
  mechanicalCalibrationPilotItems.map((item) => [item.questionId, item]),
) as Record<string, MechanicalCalibrationPilotItem>;
