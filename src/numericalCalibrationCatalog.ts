export type NumericalCalibrationOptionId = "A" | "B" | "C" | "D";

export type NumericalCalibrationPilotItem = {
  questionId: string;
  blueprintId: `NUMERICAL-${string}`;
  familyId: string;
  archetype: string;
  difficulty: "foundation" | "applied" | "stretch";
  reasoningSteps: number;
  targetTimeRangeSec: { minSec: number; maxSec: number };
  stem: string;
  options: { optionId: NumericalCalibrationOptionId; text: string }[];
  correctOptionId: NumericalCalibrationOptionId;
  explanation: string;
  misconceptionTags: Record<NumericalCalibrationOptionId, string>;
};

export const NUMERICAL_CALIBRATION_PILOT_VERSION = "APTESTA_NUMERICAL_CAL_V0_9_2026_08";

export const numericalCalibrationPilotItems: NumericalCalibrationPilotItem[] = [
  {
    questionId: "NUM-CAL-01",
    blueprintId: "NUMERICAL-01",
    familyId: "mental_arithmetic_two_step_v1",
    archetype: "mental_arithmetic_two_step",
    difficulty: "foundation",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 35, maxSec: 45 },
    stem: "What is 38 × 4 − 27?",
    options: [
      { optionId: "A", text: "98" },
      { optionId: "B", text: "125" },
      { optionId: "C", text: "145" },
      { optionId: "D", text: "179" },
    ],
    correctOptionId: "B",
    explanation: "38 × 4 = 152, then 152 − 27 = 125.",
    misconceptionTags: { A: "subtracted_before_multiplying", B: "correct", C: "subtraction_error", D: "added_instead_of_subtracted" },
  },
  {
    questionId: "NUM-CAL-02",
    blueprintId: "NUMERICAL-02",
    familyId: "numeric_estimation_v1",
    archetype: "numeric_estimation",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 30, maxSec: 40 },
    stem: "Which is the closest estimate for 398 × 21?",
    options: [
      { optionId: "A", text: "800" },
      { optionId: "B", text: "4,000" },
      { optionId: "C", text: "8,000" },
      { optionId: "D", text: "12,000" },
    ],
    correctOptionId: "C",
    explanation: "Round 398 to about 400 and 21 to about 20. Then 400 × 20 ≈ 8,000.",
    misconceptionTags: { A: "place_value_error", B: "halved_product", C: "correct", D: "overestimated_product" },
  },
  {
    questionId: "NUM-CAL-03",
    blueprintId: "NUMERICAL-03",
    familyId: "percentage_of_quantity_v1",
    archetype: "percentage_of_quantity",
    difficulty: "foundation",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 40, maxSec: 50 },
    stem: "A tank contains 240 L. What is 12.5% of this amount?",
    options: [
      { optionId: "A", text: "24 L" },
      { optionId: "B", text: "36 L" },
      { optionId: "C", text: "48 L" },
      { optionId: "D", text: "30 L" },
    ],
    correctOptionId: "D",
    explanation: "12.5% is one eighth. 240 ÷ 8 = 30 L.",
    misconceptionTags: { A: "used_ten_percent", B: "used_fifteen_percent", C: "used_twenty_percent", D: "correct" },
  },
  {
    questionId: "NUM-CAL-04",
    blueprintId: "NUMERICAL-04",
    familyId: "percentage_change_v1",
    archetype: "percentage_change",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    stem: "A reading increases from 80 to 92. What is the percentage increase?",
    options: [
      { optionId: "A", text: "15%" },
      { optionId: "B", text: "12%" },
      { optionId: "C", text: "13%" },
      { optionId: "D", text: "20%" },
    ],
    correctOptionId: "A",
    explanation: "The increase is 12. Divide by the original value: 12 ÷ 80 = 0.15 = 15%.",
    misconceptionTags: { A: "correct", B: "used_absolute_change_as_percent", C: "divided_by_final_value", D: "denominator_error" },
  },
  {
    questionId: "NUM-CAL-05",
    blueprintId: "NUMERICAL-05",
    familyId: "ratio_sharing_v1",
    archetype: "ratio_sharing",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    stem: "A total of 600 units is divided in the ratio 2 : 3 : 5. How many units are in the middle share?",
    options: [
      { optionId: "A", text: "120" },
      { optionId: "B", text: "200" },
      { optionId: "C", text: "180" },
      { optionId: "D", text: "300" },
    ],
    correctOptionId: "C",
    explanation: "There are 10 ratio parts in total. Each part is 600 ÷ 10 = 60. The middle share is 3 × 60 = 180.",
    misconceptionTags: { A: "selected_two_part_share", B: "divided_by_three", C: "correct", D: "selected_five_part_share" },
  },
  {
    questionId: "NUM-CAL-06",
    blueprintId: "NUMERICAL-06",
    familyId: "direct_rate_v1",
    archetype: "direct_rate",
    difficulty: "foundation",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 40, maxSec: 50 },
    stem: "A vehicle travels 150 km in 2.5 hours. What is its average speed?",
    options: [
      { optionId: "A", text: "60 km/h" },
      { optionId: "B", text: "50 km/h" },
      { optionId: "C", text: "75 km/h" },
      { optionId: "D", text: "375 km/h" },
    ],
    correctOptionId: "A",
    explanation: "Average speed = distance ÷ time = 150 ÷ 2.5 = 60 km/h.",
    misconceptionTags: { A: "correct", B: "division_error", C: "treated_2_5_as_2", D: "multiplied_instead_of_divided" },
  },
  {
    questionId: "NUM-CAL-07",
    blueprintId: "NUMERICAL-07",
    familyId: "inverse_work_rate_v1",
    archetype: "inverse_work_rate",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    stem: "Six identical pumps can empty a reservoir in 8 hours. At the same constant rate per pump, how long would 12 pumps take?",
    options: [
      { optionId: "A", text: "2 hours" },
      { optionId: "B", text: "8 hours" },
      { optionId: "C", text: "16 hours" },
      { optionId: "D", text: "4 hours" },
    ],
    correctOptionId: "D",
    explanation: "Doubling the number of identical pumps halves the time for the same fixed job: 8 ÷ 2 = 4 hours.",
    misconceptionTags: { A: "over_halved_time", B: "ignored_inverse_relationship", C: "used_direct_relationship", D: "correct" },
  },
  {
    questionId: "NUM-CAL-08",
    blueprintId: "NUMERICAL-08",
    familyId: "missing_value_average_v1",
    archetype: "missing_value_average",
    difficulty: "applied",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 45, maxSec: 55 },
    stem: "Five measurements have an average of 18. Four of the measurements are 12, 16, 19 and 21. What is the fifth measurement?",
    options: [
      { optionId: "A", text: "18" },
      { optionId: "B", text: "22" },
      { optionId: "C", text: "20" },
      { optionId: "D", text: "24" },
    ],
    correctOptionId: "B",
    explanation: "The five values must total 5 × 18 = 90. The four known values total 68, so the missing value is 90 − 68 = 22.",
    misconceptionTags: { A: "used_average_as_missing_value", B: "correct", C: "addition_error", D: "subtraction_error" },
  },
];
