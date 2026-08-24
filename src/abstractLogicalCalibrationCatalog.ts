export type AbstractLogicalCalibrationDifficulty = "foundation" | "applied" | "stretch";
export type AbstractLogicalCalibrationOptionId = "A" | "B" | "C" | "D";

export type AbstractLogicalMark =
  | { kind: "circle"; x: number; y: number; size?: number; filled?: boolean }
  | { kind: "square"; x: number; y: number; size?: number; filled?: boolean; rotation?: number }
  | { kind: "diamond"; x: number; y: number; size?: number; filled?: boolean }
  | { kind: "triangle"; x: number; y: number; size?: number; filled?: boolean; rotation?: number }
  | { kind: "arrow"; x: number; y: number; size?: number; rotation?: number; filled?: boolean }
  | { kind: "line"; x: number; y: number; length?: number; rotation?: number };

export type AbstractLogicalCell = {
  marks: AbstractLogicalMark[];
};

export type AbstractLogicalCalibrationDiagram =
  | { kind: "sequence"; cells: AbstractLogicalCell[]; showMissingCell?: boolean }
  | { kind: "matrix"; rows: (AbstractLogicalCell | null)[][] };

export type AbstractLogicalCalibrationOption = {
  optionId: AbstractLogicalCalibrationOptionId;
  visual: AbstractLogicalCell;
  misconceptionTag: string;
};

export type AbstractLogicalCalibrationPilotItem = {
  questionId: string;
  blueprintId: string;
  familyId: string;
  archetype: string;
  difficulty: AbstractLogicalCalibrationDifficulty;
  reasoningSteps: number;
  targetTimeRangeSec: { minSec: number; maxSec: number };
  stem: string;
  diagram: AbstractLogicalCalibrationDiagram;
  options: AbstractLogicalCalibrationOption[];
  correctOptionId: AbstractLogicalCalibrationOptionId;
  explanation: string;
  misconceptionTags: Partial<Record<AbstractLogicalCalibrationOptionId, string>>;
};

export const ABSTRACT_LOGICAL_CALIBRATION_PILOT_VERSION = "APTESTA_ABSTRACT_LOGICAL_CAL_V0_12";

const circle = (x: number, y: number, filled = true, size = 13): AbstractLogicalMark => ({ kind: "circle", x, y, filled, size });
const square = (x: number, y: number, filled = true, size = 24, rotation = 0): AbstractLogicalMark => ({ kind: "square", x, y, filled, size, rotation });
const diamond = (x: number, y: number, filled = true, size = 24): AbstractLogicalMark => ({ kind: "diamond", x, y, filled, size });
const triangle = (x: number, y: number, rotation = 0, filled = true, size = 28): AbstractLogicalMark => ({ kind: "triangle", x, y, rotation, filled, size });
const arrow = (rotation: number): AbstractLogicalMark => ({ kind: "arrow", x: 50, y: 50, rotation, filled: true, size: 30 });
const line = (rotation: number): AbstractLogicalMark => ({ kind: "line", x: 50, y: 50, rotation, length: 54 });
const cell = (...marks: AbstractLogicalMark[]): AbstractLogicalCell => ({ marks });
const dots = (count: number): AbstractLogicalCell => {
  const positions: [number, number][] = [
    [50, 50], [32, 50], [68, 50], [32, 32], [68, 32], [32, 68], [68, 68], [50, 28], [50, 72],
  ];
  return cell(...positions.slice(0, count).map(([x, y]) => circle(x, y, true, 10)));
};
const repeated = (shape: "circle" | "triangle", count: number): AbstractLogicalCell => {
  const layouts: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[36, 50], [64, 50]],
    3: [[24, 50], [50, 50], [76, 50]],
    4: [[34, 34], [66, 34], [34, 66], [66, 66]],
    5: [[34, 32], [66, 32], [34, 68], [66, 68], [50, 50]],
  };
  const positions = layouts[count] ?? layouts[5];
  return cell(...positions.map(([x, y]) => shape === "circle" ? circle(x, y, true, 9) : triangle(x, y, 0, true, 16)));
};

export const abstractLogicalCalibrationSequenceMatrixItems: AbstractLogicalCalibrationPilotItem[] = [
  {
    questionId: "AL-CAL-001",
    blueprintId: "ABSTRACT_LOGICAL-01",
    familyId: "sequence_rotation_v1",
    archetype: "sequence_rotation",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 40, maxSec: 55 },
    stem: "Which figure comes next in the sequence?",
    diagram: { kind: "sequence", cells: [cell(arrow(0)), cell(arrow(90)), cell(arrow(180)), cell(arrow(270))], showMissingCell: true },
    options: [
      { optionId: "A", visual: cell(arrow(0)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(arrow(90)), misconceptionTag: "repeats_previous_rotation" },
      { optionId: "C", visual: cell(arrow(180)), misconceptionTag: "reverses_rotation_rule" },
      { optionId: "D", visual: cell(arrow(270)), misconceptionTag: "holds_last_orientation" },
    ],
    correctOptionId: "A",
    explanation: "The arrow turns 90° clockwise at each step. After left, the next orientation is up.",
    misconceptionTags: { A: "correct", B: "repeats_previous_rotation", C: "reverses_rotation_rule", D: "holds_last_orientation" },
  },
  {
    questionId: "AL-CAL-002",
    blueprintId: "ABSTRACT_LOGICAL-02",
    familyId: "sequence_count_v1",
    archetype: "sequence_count",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 40, maxSec: 55 },
    stem: "Which figure comes next in the sequence?",
    diagram: { kind: "sequence", cells: [dots(1), dots(2), dots(3), dots(4)], showMissingCell: true },
    options: [
      { optionId: "A", visual: dots(3), misconceptionTag: "count_reverses" },
      { optionId: "B", visual: dots(4), misconceptionTag: "repeats_previous_count" },
      { optionId: "C", visual: dots(5), misconceptionTag: "correct" },
      { optionId: "D", visual: dots(6), misconceptionTag: "increments_by_two" },
    ],
    correctOptionId: "C",
    explanation: "One dot is added at every step: 1, 2, 3, 4, then 5.",
    misconceptionTags: { A: "count_reverses", B: "repeats_previous_count", C: "correct", D: "increments_by_two" },
  },
  {
    questionId: "AL-CAL-003",
    blueprintId: "ABSTRACT_LOGICAL-03",
    familyId: "sequence_alternation_v1",
    archetype: "sequence_alternation",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    stem: "Two features change across this sequence. Which figure comes next?",
    diagram: { kind: "sequence", cells: [repeated("triangle", 1), repeated("circle", 2), repeated("triangle", 3), repeated("circle", 4)], showMissingCell: true },
    options: [
      { optionId: "A", visual: repeated("triangle", 4), misconceptionTag: "shape_rule_only" },
      { optionId: "B", visual: repeated("triangle", 5), misconceptionTag: "correct" },
      { optionId: "C", visual: repeated("circle", 5), misconceptionTag: "count_rule_only" },
      { optionId: "D", visual: repeated("circle", 3), misconceptionTag: "reverses_both_rules" },
    ],
    correctOptionId: "B",
    explanation: "The shape alternates triangle, circle, triangle, circle while the number of symbols increases by one. The next cell is five triangles.",
    misconceptionTags: { A: "shape_rule_only", B: "correct", C: "count_rule_only", D: "reverses_both_rules" },
  },
  {
    questionId: "AL-CAL-004",
    blueprintId: "ABSTRACT_LOGICAL-04",
    familyId: "sequence_dual_feature_v1",
    archetype: "sequence_dual_feature",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 55, maxSec: 70 },
    stem: "Which figure comes next?",
    diagram: { kind: "sequence", cells: [cell(triangle(50, 50, 0, true)), cell(triangle(50, 50, 90, false)), cell(triangle(50, 50, 180, true)), cell(triangle(50, 50, 270, false))], showMissingCell: true },
    options: [
      { optionId: "A", visual: cell(triangle(50, 50, 0, true)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(triangle(50, 50, 0, false)), misconceptionTag: "fill_rule_missed" },
      { optionId: "C", visual: cell(triangle(50, 50, 90, true)), misconceptionTag: "rotation_rule_missed" },
      { optionId: "D", visual: cell(triangle(50, 50, 270, true)), misconceptionTag: "holds_last_rotation" },
    ],
    correctOptionId: "A",
    explanation: "The triangle rotates 90° clockwise each step while alternating filled and outline. The next triangle points up and is filled.",
    misconceptionTags: { A: "correct", B: "fill_rule_missed", C: "rotation_rule_missed", D: "holds_last_rotation" },
  },
  {
    questionId: "AL-CAL-005",
    blueprintId: "ABSTRACT_LOGICAL-05",
    familyId: "matrix_addition_v1",
    archetype: "matrix_addition",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    stem: "In each row, the third box combines the symbols in the first two boxes. Which box completes the second row?",
    diagram: { kind: "matrix", rows: [
      [cell(circle(50, 50)), cell(triangle(50, 50)), cell(circle(34, 50), triangle(66, 50))],
      [cell(square(50, 50)), cell(diamond(50, 50)), null],
    ] },
    options: [
      { optionId: "A", visual: cell(square(34, 50), diamond(66, 50)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(square(50, 50)), misconceptionTag: "keeps_first_only" },
      { optionId: "C", visual: cell(diamond(50, 50)), misconceptionTag: "keeps_second_only" },
      { optionId: "D", visual: cell(circle(34, 50), diamond(66, 50)), misconceptionTag: "carries_symbol_from_previous_row" },
    ],
    correctOptionId: "A",
    explanation: "The third box contains both symbols from the first two boxes. Therefore the missing box must contain a square and a diamond.",
    misconceptionTags: { A: "correct", B: "keeps_first_only", C: "keeps_second_only", D: "carries_symbol_from_previous_row" },
  },
  {
    questionId: "AL-CAL-006",
    blueprintId: "ABSTRACT_LOGICAL-06",
    familyId: "matrix_subtraction_v1",
    archetype: "matrix_subtraction",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    stem: "In each row, the symbol in the middle box is removed from the first box. Which box completes the second row?",
    diagram: { kind: "matrix", rows: [
      [cell(circle(24, 50, true, 10), triangle(50, 50, 0, true, 18), square(76, 50, true, 18)), cell(triangle(50, 50)), cell(circle(36, 50), square(64, 50))],
      [cell(diamond(24, 50, true, 18), circle(50, 50, true, 10), square(76, 50, true, 18)), cell(circle(50, 50)), null],
    ] },
    options: [
      { optionId: "A", visual: cell(diamond(36, 50), square(64, 50)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(circle(50, 50)), misconceptionTag: "returns_removed_symbol" },
      { optionId: "C", visual: cell(diamond(24, 50, true, 18), circle(50, 50, true, 10), square(76, 50, true, 18)), misconceptionTag: "no_subtraction" },
      { optionId: "D", visual: cell(circle(36, 50), square(64, 50)), misconceptionTag: "copies_first_row_result" },
    ],
    correctOptionId: "A",
    explanation: "Remove the middle-box symbol from the set in the first box. Removing the circle leaves the diamond and square.",
    misconceptionTags: { A: "correct", B: "returns_removed_symbol", C: "no_subtraction", D: "copies_first_row_result" },
  },
  {
    questionId: "AL-CAL-007",
    blueprintId: "ABSTRACT_LOGICAL-07",
    familyId: "matrix_rotation_v1",
    archetype: "matrix_rotation",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 55, maxSec: 70 },
    stem: "Across each row, the arrow turns 90° clockwise from one box to the next. Which arrow completes the matrix?",
    diagram: { kind: "matrix", rows: [
      [cell(arrow(0)), cell(arrow(90)), cell(arrow(180))],
      [cell(arrow(270)), cell(arrow(0)), null],
    ] },
    options: [
      { optionId: "A", visual: cell(arrow(0)), misconceptionTag: "holds_previous" },
      { optionId: "B", visual: cell(arrow(90)), misconceptionTag: "correct" },
      { optionId: "C", visual: cell(arrow(180)), misconceptionTag: "skips_rotation" },
      { optionId: "D", visual: cell(arrow(270)), misconceptionTag: "reverses_rotation" },
    ],
    correctOptionId: "B",
    explanation: "Each move to the right turns the arrow 90° clockwise. Up therefore becomes right in the missing cell.",
    misconceptionTags: { A: "holds_previous", B: "correct", C: "skips_rotation", D: "reverses_rotation" },
  },
  {
    questionId: "AL-CAL-008",
    blueprintId: "ABSTRACT_LOGICAL-08",
    familyId: "matrix_overlay_v1",
    archetype: "matrix_overlay",
    difficulty: "stretch",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 55, maxSec: 70 },
    stem: "In each row, the third box overlays the line from the first box with the line from the second. Which box completes the second row?",
    diagram: { kind: "matrix", rows: [
      [cell(line(0)), cell(line(90)), cell(line(0), line(90))],
      [cell(line(45)), cell(line(-45)), null],
    ] },
    options: [
      { optionId: "A", visual: cell(line(45), line(-45)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(line(0), line(90)), misconceptionTag: "copies_first_row_overlay" },
      { optionId: "C", visual: cell(line(45)), misconceptionTag: "keeps_first_only" },
      { optionId: "D", visual: cell(line(-45)), misconceptionTag: "keeps_second_only" },
    ],
    correctOptionId: "A",
    explanation: "The result contains both input lines. Overlaying the two diagonals produces an X.",
    misconceptionTags: { A: "correct", B: "copies_first_row_overlay", C: "keeps_first_only", D: "keeps_second_only" },
  },
];

export const abstractLogicalCalibrationAllItems = [...abstractLogicalCalibrationSequenceMatrixItems];
