export type AbstractLogicalCalibrationDifficulty = "foundation" | "applied" | "stretch";
export type AbstractLogicalCalibrationOptionId = "A" | "B" | "C" | "D" | "E";

export type AbstractLogicalMark =
  | { kind: "circle"; x: number; y: number; size?: number; filled?: boolean }
  | { kind: "square"; x: number; y: number; size?: number; filled?: boolean; rotation?: number }
  | { kind: "diamond"; x: number; y: number; size?: number; filled?: boolean }
  | { kind: "triangle"; x: number; y: number; size?: number; filled?: boolean; rotation?: number }
  | { kind: "arrow"; x: number; y: number; size?: number; rotation?: number; filled?: boolean }
  | { kind: "line"; x: number; y: number; length?: number; rotation?: number }
  | { kind: "grid"; x: number; y: number; size?: number };

export type AbstractLogicalCell = {
  marks: AbstractLogicalMark[];
};

export type AbstractLogicalCalibrationDiagram =
  | { kind: "sequence"; cells: AbstractLogicalCell[]; showMissingCell?: boolean }
  | { kind: "matrix"; rows: (AbstractLogicalCell | null)[][] }
  | { kind: "analogy"; a: AbstractLogicalCell; b: AbstractLogicalCell; c: AbstractLogicalCell }
  | { kind: "rule_machine"; examples: { input: AbstractLogicalCell; output: AbstractLogicalCell }[]; target: AbstractLogicalCell };

export type AbstractLogicalCalibrationOption = {
  optionId: AbstractLogicalCalibrationOptionId;
  visual?: AbstractLogicalCell;
  label?: string;
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
  diagram?: AbstractLogicalCalibrationDiagram;
  options: AbstractLogicalCalibrationOption[];
  correctOptionId: AbstractLogicalCalibrationOptionId;
  explanation: string;
  misconceptionTags: Partial<Record<AbstractLogicalCalibrationOptionId, string>>;
};

export const ABSTRACT_LOGICAL_CALIBRATION_PILOT_VERSION = "APTESTA_ABSTRACT_LOGICAL_CAL_V0_14";

const circle = (x: number, y: number, filled = true, size = 13): AbstractLogicalMark => ({ kind: "circle", x, y, filled, size });
const square = (x: number, y: number, filled = true, size = 24, rotation = 0): AbstractLogicalMark => ({ kind: "square", x, y, filled, size, rotation });
const diamond = (x: number, y: number, filled = true, size = 24): AbstractLogicalMark => ({ kind: "diamond", x, y, filled, size });
const triangle = (x: number, y: number, rotation = 0, filled = true, size = 28): AbstractLogicalMark => ({ kind: "triangle", x, y, rotation, filled, size });
const arrow = (rotation: number): AbstractLogicalMark => ({ kind: "arrow", x: 50, y: 50, rotation, filled: true, size: 30 });
const arrowAt = (x: number, y: number, rotation: number, size = 26): AbstractLogicalMark => ({ kind: "arrow", x, y, rotation, filled: true, size });
const line = (rotation: number): AbstractLogicalMark => ({ kind: "line", x: 50, y: 50, rotation, length: 54 });
const grid = (): AbstractLogicalMark => ({ kind: "grid", x: 50, y: 50, size: 70 });
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


export const abstractLogicalCalibrationClassificationDeductionItems: AbstractLogicalCalibrationPilotItem[] = [
  {
    questionId: "AL-CAL-009",
    blueprintId: "ABSTRACT_LOGICAL-09",
    familyId: "classification_outlier_v1",
    archetype: "classification_outlier",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 40, maxSec: 55 },
    stem: "Four figures contain the same three component shapes. Which figure is the odd one out?",
    options: [
      { optionId: "A", visual: cell(circle(28, 50, true, 12), triangle(50, 50, 0, true, 18), square(72, 50, true, 16)), misconceptionTag: "same_component_set" },
      { optionId: "B", visual: cell(square(28, 50, true, 16), circle(50, 50, true, 12), triangle(72, 50, 0, true, 18)), misconceptionTag: "same_component_set" },
      { optionId: "C", visual: cell(triangle(28, 50, 0, true, 18), square(50, 50, true, 16), circle(72, 50, true, 12)), misconceptionTag: "same_component_set" },
      { optionId: "D", visual: cell(circle(28, 50, true, 12), square(50, 50, true, 16), triangle(72, 50, 0, true, 18)), misconceptionTag: "same_component_set" },
      { optionId: "E", visual: cell(circle(28, 50, true, 12), line(0), triangle(72, 50, 0, true, 18)), misconceptionTag: "correct" },
    ],
    correctOptionId: "E",
    explanation: "A–D each contain a circle, triangle and square. E replaces the square with a line, so it is the outlier.",
    misconceptionTags: { A: "same_component_set", B: "same_component_set", C: "same_component_set", D: "same_component_set", E: "correct" },
  },
  {
    questionId: "AL-CAL-010",
    blueprintId: "ABSTRACT_LOGICAL-10",
    familyId: "classification_symmetry_v1",
    archetype: "classification_symmetry",
    difficulty: "applied",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    stem: "Four figures have a vertical line of symmetry. Which figure does not?",
    options: [
      { optionId: "A", visual: cell(circle(50, 50, false, 42)), misconceptionTag: "has_vertical_symmetry" },
      { optionId: "B", visual: cell(square(50, 50, false, 42)), misconceptionTag: "has_vertical_symmetry" },
      { optionId: "C", visual: cell(diamond(50, 50, false, 38)), misconceptionTag: "has_vertical_symmetry" },
      { optionId: "D", visual: cell(triangle(50, 50, 0, false, 44)), misconceptionTag: "has_vertical_symmetry" },
      { optionId: "E", visual: cell(arrow(90)), misconceptionTag: "correct" },
    ],
    correctOptionId: "E",
    explanation: "The circle, square, diamond and upright triangle are all symmetric about a vertical line through their centre. The right-pointing arrow is not vertically symmetric.",
    misconceptionTags: { A: "has_vertical_symmetry", B: "has_vertical_symmetry", C: "has_vertical_symmetry", D: "has_vertical_symmetry", E: "correct" },
  },
  {
    questionId: "AL-CAL-011",
    blueprintId: "ABSTRACT_LOGICAL-11",
    familyId: "analogy_rotation_v1",
    archetype: "analogy_rotation",
    difficulty: "applied",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    stem: "A changes to B by turning 90° clockwise. Apply the same change to C. Which figure should replace the question mark?",
    diagram: { kind: "analogy", a: cell(arrow(0)), b: cell(arrow(90)), c: cell(triangle(50, 50, 270, true, 32)) },
    options: [
      { optionId: "A", visual: cell(triangle(50, 50, 0, true, 32)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(triangle(50, 50, 90, true, 32)), misconceptionTag: "turns_too_far" },
      { optionId: "C", visual: cell(triangle(50, 50, 180, true, 32)), misconceptionTag: "reverses_rule" },
      { optionId: "D", visual: cell(triangle(50, 50, 270, true, 32)), misconceptionTag: "no_transformation" },
    ],
    correctOptionId: "A",
    explanation: "The first figure turns 90° clockwise. Turning the left-pointing triangle 90° clockwise makes it point up.",
    misconceptionTags: { A: "correct", B: "turns_too_far", C: "reverses_rule", D: "no_transformation" },
  },
  {
    questionId: "AL-CAL-012",
    blueprintId: "ABSTRACT_LOGICAL-12",
    familyId: "analogy_fill_change_v1",
    archetype: "analogy_fill_change",
    difficulty: "foundation",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 40, maxSec: 55 },
    stem: "A changes to B by keeping the shape but changing it from filled to outline. Apply the same change to C.",
    diagram: { kind: "analogy", a: cell(square(50, 50, true, 38)), b: cell(square(50, 50, false, 38)), c: cell(triangle(50, 50, 0, true, 42)) },
    options: [
      { optionId: "A", visual: cell(triangle(50, 50, 0, false, 42)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(triangle(50, 50, 0, true, 42)), misconceptionTag: "fill_unchanged" },
      { optionId: "C", visual: cell(square(50, 50, false, 38)), misconceptionTag: "copies_example_output" },
      { optionId: "D", visual: cell(triangle(50, 50, 180, false, 42)), misconceptionTag: "adds_rotation" },
    ],
    correctOptionId: "A",
    explanation: "Only the fill changes. The triangle keeps its orientation and becomes outline.",
    misconceptionTags: { A: "correct", B: "fill_unchanged", C: "copies_example_output", D: "adds_rotation" },
  },
  {
    questionId: "AL-CAL-013",
    blueprintId: "ABSTRACT_LOGICAL-13",
    familyId: "deduction_ordering_v1",
    archetype: "deduction_ordering",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    stem: "Mia arrives before Noah. Noah arrives before Priya. Liam arrives after Priya. Which statement MUST be true?",
    options: [
      { optionId: "A", label: "Priya arrives before Noah.", misconceptionTag: "reverses_middle_relation" },
      { optionId: "B", label: "Mia arrives before Priya.", misconceptionTag: "correct" },
      { optionId: "C", label: "Liam arrives before Noah.", misconceptionTag: "reverses_end_relation" },
      { optionId: "D", label: "Noah arrives after Liam.", misconceptionTag: "reverses_chain" },
    ],
    correctOptionId: "B",
    explanation: "Mia is before Noah, and Noah is before Priya, so Mia must also be before Priya.",
    misconceptionTags: { A: "reverses_middle_relation", B: "correct", C: "reverses_end_relation", D: "reverses_chain" },
  },
  {
    questionId: "AL-CAL-014",
    blueprintId: "ABSTRACT_LOGICAL-14",
    familyId: "deduction_conditional_v1",
    archetype: "deduction_conditional",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    stem: "If Pump A fails, the backup pump starts. If the backup pump starts, the warning light comes on. Pump A has failed. Which statement MUST be true?",
    options: [
      { optionId: "A", label: "The warning light comes on.", misconceptionTag: "correct" },
      { optionId: "B", label: "Pump A starts again.", misconceptionTag: "unsupported_recovery" },
      { optionId: "C", label: "The warning light stays off.", misconceptionTag: "contradicts_chain" },
      { optionId: "D", label: "The backup pump does not start.", misconceptionTag: "contradicts_first_condition" },
    ],
    correctOptionId: "A",
    explanation: "Pump A failing guarantees the backup starts; that in turn guarantees the warning light comes on.",
    misconceptionTags: { A: "correct", B: "unsupported_recovery", C: "contradicts_chain", D: "contradicts_first_condition" },
  },
  {
    questionId: "AL-CAL-015",
    blueprintId: "ABSTRACT_LOGICAL-15",
    familyId: "deduction_set_logic_v1",
    archetype: "deduction_set_logic",
    difficulty: "stretch",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    stem: "All engineers are trained. No trained workers are visitors. Which statement MUST be true?",
    options: [
      { optionId: "A", label: "No engineers are visitors.", misconceptionTag: "correct" },
      { optionId: "B", label: "All trained workers are engineers.", misconceptionTag: "reverses_all_statement" },
      { optionId: "C", label: "Some visitors are engineers.", misconceptionTag: "contradicts_sets" },
      { optionId: "D", label: "All visitors are untrained engineers.", misconceptionTag: "unsupported_subset" },
    ],
    correctOptionId: "A",
    explanation: "Every engineer belongs to the trained group, and trained workers cannot be visitors. Therefore engineers cannot be visitors.",
    misconceptionTags: { A: "correct", B: "reverses_all_statement", C: "contradicts_sets", D: "unsupported_subset" },
  },
  {
    questionId: "AL-CAL-016",
    blueprintId: "ABSTRACT_LOGICAL-16",
    familyId: "pattern_movement_grid_v1",
    archetype: "pattern_movement_grid",
    difficulty: "applied",
    reasoningSteps: 1,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    stem: "The dot moves clockwise around the four corner positions of the grid. Which grid comes next?",
    diagram: { kind: "sequence", cells: [
      cell(grid(), circle(27, 27, true, 12)),
      cell(grid(), circle(73, 27, true, 12)),
      cell(grid(), circle(73, 73, true, 12)),
      cell(grid(), circle(27, 73, true, 12)),
    ], showMissingCell: true },
    options: [
      { optionId: "A", visual: cell(grid(), circle(27, 27, true, 12)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(grid(), circle(73, 27, true, 12)), misconceptionTag: "skips_cycle_reset" },
      { optionId: "C", visual: cell(grid(), circle(73, 73, true, 12)), misconceptionTag: "repeats_third_position" },
      { optionId: "D", visual: cell(grid(), circle(50, 50, true, 12)), misconceptionTag: "moves_to_centre" },
    ],
    correctOptionId: "A",
    explanation: "The dot moves top-left, top-right, bottom-right, bottom-left, then returns to top-left.",
    misconceptionTags: { A: "correct", B: "skips_cycle_reset", C: "repeats_third_position", D: "moves_to_centre" },
  },
];

export const abstractLogicalCalibrationCompletionItems: AbstractLogicalCalibrationPilotItem[] = [
  {
    questionId: "AL-CAL-017",
    blueprintId: "ABSTRACT_LOGICAL-17",
    familyId: "pattern_reflection_rotation_v1",
    archetype: "pattern_reflection_rotation",
    difficulty: "stretch",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 55, maxSec: 70 },
    stem: "The figure changes by alternating two transformations. Which figure comes next?",
    diagram: { kind: "sequence", cells: [
      cell(arrowAt(30, 30, 0), circle(70, 70, true, 10)),
      cell(arrowAt(70, 30, 0), circle(30, 70, true, 10)),
      cell(arrowAt(70, 70, 90), circle(30, 30, true, 10)),
      cell(arrowAt(30, 70, 270), circle(70, 30, true, 10)),
    ], showMissingCell: true },
    options: [
      { optionId: "A", visual: cell(arrowAt(30, 30, 0), circle(70, 70, true, 10)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(arrowAt(30, 30, 180), circle(70, 70, true, 10)), misconceptionTag: "rotation_direction_error" },
      { optionId: "C", visual: cell(arrowAt(30, 70, 270), circle(70, 30, true, 10)), misconceptionTag: "repeats_previous_cell" },
      { optionId: "D", visual: cell(arrowAt(70, 70, 90), circle(30, 30, true, 10)), misconceptionTag: "applies_reflection_instead_of_rotation" },
    ],
    correctOptionId: "A",
    explanation: "The changes alternate: first mirror left-to-right, then rotate the entire figure 90° clockwise. The fourth figure therefore rotates 90° clockwise to return to the first arrangement.",
    misconceptionTags: { A: "correct", B: "rotation_direction_error", C: "repeats_previous_cell", D: "applies_reflection_instead_of_rotation" },
  },
  {
    questionId: "AL-CAL-018",
    blueprintId: "ABSTRACT_LOGICAL-18",
    familyId: "diagrammatic_rule_machine_v1",
    archetype: "diagrammatic_rule_machine",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 50, maxSec: 65 },
    stem: "The same rule machine is applied to every input. Which output should the final input produce?",
    diagram: { kind: "rule_machine", examples: [
      { input: cell(triangle(50, 50, 0, true, 40)), output: cell(triangle(50, 50, 90, false, 40)) },
      { input: cell(triangle(50, 50, 270, false, 40)), output: cell(triangle(50, 50, 0, true, 40)) },
    ], target: cell(triangle(50, 50, 180, true, 40)) },
    options: [
      { optionId: "A", visual: cell(triangle(50, 50, 270, false, 40)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(triangle(50, 50, 270, true, 40)), misconceptionTag: "rotation_only" },
      { optionId: "C", visual: cell(triangle(50, 50, 90, false, 40)), misconceptionTag: "rotates_counterclockwise" },
      { optionId: "D", visual: cell(triangle(50, 50, 180, false, 40)), misconceptionTag: "fill_change_only" },
    ],
    correctOptionId: "A",
    explanation: "The machine performs two changes: rotate 90° clockwise and switch filled to outline (or outline to filled). A filled downward triangle therefore becomes an outline left-pointing triangle.",
    misconceptionTags: { A: "correct", B: "rotation_only", C: "rotates_counterclockwise", D: "fill_change_only" },
  },
  {
    questionId: "AL-CAL-019",
    blueprintId: "ABSTRACT_LOGICAL-19",
    familyId: "spatial_outlier_v1",
    archetype: "spatial_outlier",
    difficulty: "applied",
    reasoningSteps: 2,
    targetTimeRangeSec: { minSec: 45, maxSec: 60 },
    stem: "Four figures are rotations of the same three-shape arrangement. One is a mirror image rather than a rotation. Which figure is the outlier?",
    options: [
      { optionId: "A", visual: cell(circle(28, 28, true, 11), square(72, 28, true, 18), diamond(28, 72, true, 18)), misconceptionTag: "valid_rotation" },
      { optionId: "B", visual: cell(diamond(28, 28, true, 18), circle(72, 28, true, 11), square(72, 72, true, 18)), misconceptionTag: "valid_rotation" },
      { optionId: "C", visual: cell(diamond(72, 28, true, 18), square(28, 72, true, 18), circle(72, 72, true, 11)), misconceptionTag: "valid_rotation" },
      { optionId: "D", visual: cell(square(28, 28, true, 18), circle(28, 72, true, 11), diamond(72, 72, true, 18)), misconceptionTag: "valid_rotation" },
      { optionId: "E", visual: cell(square(28, 28, true, 18), circle(72, 28, true, 11), diamond(72, 72, true, 18)), misconceptionTag: "correct" },
    ],
    correctOptionId: "E",
    explanation: "A–D preserve the clockwise order of circle, square and diamond and can be made identical by rotation. E reverses that order, so it is the mirror-image outlier.",
    misconceptionTags: { A: "valid_rotation", B: "valid_rotation", C: "valid_rotation", D: "valid_rotation", E: "correct" },
  },
  {
    questionId: "AL-CAL-020",
    blueprintId: "ABSTRACT_LOGICAL-20",
    familyId: "integrated_matrix_v1",
    archetype: "integrated_matrix",
    difficulty: "stretch",
    reasoningSteps: 3,
    targetTimeRangeSec: { minSec: 60, maxSec: 75 },
    stem: "Two features follow repeating rules across both rows and columns. Which box completes the matrix?",
    diagram: { kind: "matrix", rows: [
      [cell(arrowAt(50, 58, 0, 24), circle(50, 20, true, 8)), cell(arrowAt(50, 58, 90, 24), circle(38, 20, true, 8), circle(62, 20, true, 8)), cell(arrowAt(50, 58, 180, 24), circle(30, 20, true, 8), circle(50, 20, true, 8), circle(70, 20, true, 8))],
      [cell(arrowAt(50, 58, 90, 24), circle(38, 20, true, 8), circle(62, 20, true, 8)), cell(arrowAt(50, 58, 180, 24), circle(30, 20, true, 8), circle(50, 20, true, 8), circle(70, 20, true, 8)), cell(arrowAt(50, 58, 270, 24), circle(50, 20, true, 8))],
      [cell(arrowAt(50, 58, 180, 24), circle(30, 20, true, 8), circle(50, 20, true, 8), circle(70, 20, true, 8)), cell(arrowAt(50, 58, 270, 24), circle(50, 20, true, 8)), null],
    ] },
    options: [
      { optionId: "A", visual: cell(arrowAt(50, 58, 0, 24), circle(38, 20, true, 8), circle(62, 20, true, 8)), misconceptionTag: "correct" },
      { optionId: "B", visual: cell(arrowAt(50, 58, 0, 24), circle(30, 20, true, 8), circle(50, 20, true, 8), circle(70, 20, true, 8)), misconceptionTag: "count_cycle_error" },
      { optionId: "C", visual: cell(arrowAt(50, 58, 90, 24), circle(38, 20, true, 8), circle(62, 20, true, 8)), misconceptionTag: "orientation_cycle_error" },
      { optionId: "D", visual: cell(arrowAt(50, 58, 270, 24), circle(38, 20, true, 8), circle(62, 20, true, 8)), misconceptionTag: "repeats_previous_orientation" },
    ],
    correctOptionId: "A",
    explanation: "Across each row and down each column, the arrow turns 90° clockwise and the dot count cycles 1, 2, 3. The missing box therefore needs an upward arrow with two dots.",
    misconceptionTags: { A: "correct", B: "count_cycle_error", C: "orientation_cycle_error", D: "repeats_previous_orientation" },
  },
];

export const abstractLogicalCalibrationAllItems = [
  ...abstractLogicalCalibrationSequenceMatrixItems,
  ...abstractLogicalCalibrationClassificationDeductionItems,
  ...abstractLogicalCalibrationCompletionItems,
];

