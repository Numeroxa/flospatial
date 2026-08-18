export type CalibrationDomain = "mechanical" | "numerical" | "abstract_logical" | "verbal";
export type CalibrationDifficulty = "foundation" | "applied" | "stretch";
export type CalibrationImplementationStatus = "blueprint_only" | "authoring" | "qa_review" | "pilot_live";
export type CalibrationQaStatus = "not_reviewed" | "in_review" | "cleared";
export type RapidRecognitionIntent = "yes" | "no" | "candidate";

export type GeneralCalibrationBlueprint = {
  blueprintId: string;
  domain: CalibrationDomain;
  sequence: number;
  subskill: string;
  archetype: string;
  itemBrief: string;
  responseFormat: string;
  targetTimeRangeSec: { minSec: number; maxSec: number };
  difficulty: CalibrationDifficulty;
  calibrationPurpose: string;
  rapidRecognitionIntent: RapidRecognitionIntent;
  implementationStatus: CalibrationImplementationStatus;
  qaStatus: CalibrationQaStatus;
  linkedLiveFamilyId?: string;
};

export const GENERAL_CALIBRATION_BLUEPRINT_VERSION = "APTESTA_GENERAL_CAL_BLUEPRINT_2026_08_V0_10";

function b(
  domain: CalibrationDomain,
  sequence: number,
  subskill: string,
  archetype: string,
  itemBrief: string,
  responseFormat: string,
  minSec: number,
  maxSec: number,
  difficulty: CalibrationDifficulty,
  calibrationPurpose: string,
  rapidRecognitionIntent: RapidRecognitionIntent = "no",
  implementationStatus: CalibrationImplementationStatus = "blueprint_only",
  qaStatus: CalibrationQaStatus = "not_reviewed",
  linkedLiveFamilyId?: string,
): GeneralCalibrationBlueprint {
  return {
    blueprintId: `${domain.toUpperCase()}-${String(sequence).padStart(2, "0")}`,
    domain,
    sequence,
    subskill,
    archetype,
    itemBrief,
    responseFormat,
    targetTimeRangeSec: { minSec, maxSec },
    difficulty,
    calibrationPurpose,
    rapidRecognitionIntent,
    implementationStatus,
    qaStatus,
    linkedLiveFamilyId,
  };
}

export const generalCalibrationBlueprints: GeneralCalibrationBlueprint[] = [
  // Mechanical — 20
  b("mechanical", 1, "Gear direction", "gear_direction_contact_parity", "Three meshed gears; driver direction given; ask final gear direction.", "Diagram MCQ", 35, 40, "foundation", "Retain current strength; test rapid mesh counting.", "yes", "pilot_live", "cleared", "gear_direction_contact_parity_v1"),
  b("mechanical", 2, "Gear speed ratio", "gear_speed_ratio", "Two gears, tooth counts shown; ask output rpm.", "Diagram MCQ", 40, 50, "applied", "Check concise ratio reasoning without instructional prose.", "candidate", "pilot_live", "cleared", "gear_speed_ratio_v1"),
  b("mechanical", 3, "Compound gears", "compound_gear_speed", "Two gears share a shaft within a four-gear train.", "Diagram MCQ", 45, 55, "stretch", "Add multi-stage speed reasoning.", "no", "pilot_live", "cleared", "compound_gear_speed_v1"),
  b("mechanical", 4, "Belt drive direction", "open_belt_direction", "Open belt between two pulleys; ask driven direction.", "Diagram MCQ", 30, 35, "foundation", "Fill FRV wheels/belts gap.", "yes", "pilot_live", "cleared", "open_belt_direction_v1"),
  b("mechanical", 5, "Crossed belt direction", "crossed_belt_direction", "Crossed belt; ask driven direction.", "Diagram MCQ", 30, 35, "applied", "Distinguish open vs crossed belt.", "yes", "pilot_live", "cleared", "crossed_belt_direction_v1"),
  b("mechanical", 6, "Pulley mechanical advantage", "pulley_supporting_strands", "Moving pulley block; count supporting strands.", "Diagram MCQ", 35, 40, "foundation", "Retain current strength; speed recognition.", "yes", "qa_review", "in_review", "pulley_supporting_strands_v1"),
  b("mechanical", 7, "Pulley distance trade-off", "pulley_distance_tradeoff", "Load rises 0.5 m with four supports; ask rope travel.", "Diagram MCQ", 40, 45, "applied", "Test force-distance relationship.", "no", "qa_review", "in_review", "pulley_distance_tradeoff_v1"),
  b("mechanical", 8, "Lever moments", "lever_moment_balance", "Load/effort arms labelled; ask effort force.", "Diagram MCQ", 40, 50, "applied", "Retain current strength with corrected arm arrows.", "no", "qa_review", "in_review", "lever_moment_balance_v1"),
  b("mechanical", 9, "Lever fulcrum shift", "lever_fulcrum_shift", "Same lever before/after fulcrum movement; ask effect on effort.", "Diagram MCQ", 35, 40, "applied", "Reason qualitatively rather than calculate.", "candidate", "qa_review", "in_review", "lever_fulcrum_shift_v1"),
  b("mechanical", 10, "Hydraulic force", "hydraulic_force_area", "Two piston areas; input force given; ask output force.", "Diagram MCQ", 45, 55, "applied", "Retain current pressure/area strength.", "no", "qa_review", "in_review", "hydraulic_force_area_v1"),
  b("mechanical", 11, "Hydraulic movement", "hydraulic_volume_displacement", "Small piston moves given distance; ask large piston movement.", "Diagram MCQ", 45, 55, "stretch", "Add volume conservation, not only force.", "no", "qa_review", "in_review", "hydraulic_volume_displacement_v1"),
  b("mechanical", 12, "Linked bars", "linked_bar_motion", "Two pivoted bars linked by a connector; ask motion of second end.", "Diagram MCQ", 35, 45, "applied", "Fill FRV linked-bars gap.", "candidate", "qa_review", "in_review", "linked_bar_motion_v1"),
  b("mechanical", 13, "Bell crank / linkage", "bell_crank_direction", "Right-angle linkage changes direction of movement.", "Diagram MCQ", 35, 45, "applied", "Rapid cause-and-effect recognition.", "yes", "qa_review", "in_review", "bell_crank_direction_v1"),
  b("mechanical", 14, "Inclined plane", "inclined_plane_force", "Compare force required on two ramps reaching same height.", "Diagram MCQ", 35, 45, "foundation", "Broaden simple machines.", "no", "qa_review", "in_review", "inclined_plane_force_v1"),
  b("mechanical", 15, "Wheel and axle", "wheel_axle_advantage", "Different radii; ask which arrangement gives greater mechanical advantage.", "Diagram MCQ", 35, 45, "applied", "Fill wheels/simple-machines coverage.", "no", "qa_review", "in_review", "wheel_axle_advantage_v1"),
  b("mechanical", 16, "Force / friction", "friction_start_force", "Same block on two surfaces; ask which needs more force to start.", "Diagram MCQ", 30, 40, "foundation", "Fill forces/motion gap.", "candidate", "qa_review", "in_review", "friction_start_force_v1"),
  b("mechanical", 17, "Centre of mass / stability", "stability_base_height", "Three objects with different base/height; ask most stable.", "Diagram MCQ", 30, 40, "applied", "Useful practical physics style.", "candidate", "qa_review", "in_review", "stability_base_height_v1"),
  b("mechanical", 18, "Acceleration / inertia", "trolley_inertia", "Object on trolley during sudden acceleration; ask relative motion.", "Diagram MCQ", 35, 45, "applied", "Fill forces/motion gap.", "no", "qa_review", "in_review", "trolley_inertia_v1"),
  b("mechanical", 19, "3D mechanical visualisation", "mechanical_view_rotation", "Simple shaft/handle arrangement viewed from another angle.", "Spatial-mech MCQ", 45, 60, "stretch", "Directly address FRV 3D visualisation.", "no", "qa_review", "in_review", "mechanical_view_rotation_v1"),
  b("mechanical", 20, "Integrated machine", "integrated_machine_motion", "Gear drives pulley/lever or linkage; ask final motion.", "Diagram MCQ", 50, 60, "stretch", "Test method selection under realistic complexity.", "no", "qa_review", "in_review", "integrated_machine_motion_v1"),

  // Numerical — 20
  b("numerical", 1, "Mental arithmetic", "mental_arithmetic_two_step", "Two-step arithmetic with friendly numbers.", "MCQ", 35, 45, "foundation", "Criteria-style speed baseline.", "candidate", "pilot_live", "cleared", "mental_arithmetic_two_step_v1"),
  b("numerical", 2, "Estimate", "numeric_estimation", "Choose closest estimate for multiplication/division.", "MCQ", 30, 40, "foundation", "Rapid plausibility check.", "yes", "pilot_live", "cleared", "numeric_estimation_v1"),
  b("numerical", 3, "Percentage of quantity", "percentage_of_quantity", "Calculate 15% or 12.5% of practical value.", "MCQ", 40, 50, "foundation", "Retain current strength.", "no", "pilot_live", "cleared", "percentage_of_quantity_v1"),
  b("numerical", 4, "Percentage change", "percentage_change", "Original/final values; ask percentage increase/decrease.", "MCQ", 45, 60, "applied", "Test denominator choice.", "no", "pilot_live", "cleared", "percentage_change_v1"),
  b("numerical", 5, "Ratio sharing", "ratio_sharing", "Divide total in 2:3:5 ratio.", "MCQ", 45, 60, "applied", "Retain current strength.", "no", "pilot_live", "cleared", "ratio_sharing_v1"),
  b("numerical", 6, "Direct rate", "direct_rate", "Distance/time or flow/time.", "MCQ", 40, 50, "foundation", "Retain current strength.", "no", "pilot_live", "cleared", "direct_rate_v1"),
  b("numerical", 7, "Inverse work rate", "inverse_work_rate", "Workers/pumps and fixed job duration.", "MCQ", 50, 65, "applied", "Retain newly taught inverse-rate method.", "no", "pilot_live", "cleared", "inverse_work_rate_v1"),
  b("numerical", 8, "Average", "missing_value_average", "Find missing value from average.", "MCQ", 45, 55, "applied", "Criteria-style math/logic.", "no", "pilot_live", "cleared", "missing_value_average_v1"),
  b("numerical", 9, "Money", "discount_tax_unit_price", "Discount then GST or unit-price comparison.", "MCQ", 50, 65, "applied", "FRV adult-context numeracy.", "no", "qa_review", "in_review", "discount_tax_unit_price_v1"),
  b("numerical", 10, "Measurement conversion", "measurement_conversion", "mm/cm/m or L/mL; two-step conversion.", "MCQ", 40, 50, "foundation", "Expand measurement coverage.", "candidate", "qa_review", "in_review", "measurement_conversion_v1"),
  b("numerical", 11, "Area", "composite_area", "Floor/rectangle with excluded section; ask usable area.", "MCQ", 50, 65, "applied", "Fill FRV measurement/geometry gap.", "no", "qa_review", "in_review", "composite_area_v1"),
  b("numerical", 12, "Volume", "rectangular_volume", "Rectangular tank/container capacity.", "MCQ or numeric entry", 50, 65, "applied", "Fill FRV volume gap.", "no", "qa_review", "in_review", "rectangular_volume_v1"),
  b("numerical", 13, "Scale plan", "plan_scale_distance", "Use a plan scale to find real distance.", "Plan + MCQ", 55, 70, "applied", "Fill maps/plans gap.", "no", "qa_review", "in_review", "plan_scale_distance_v1"),
  b("numerical", 14, "Map/grid", "map_grid_distance", "Read route distance or coordinates from simple map.", "Map + MCQ", 50, 65, "applied", "FRV contextual data presentation.", "no", "qa_review", "in_review", "map_grid_distance_v1"),
  b("numerical", 15, "Bar chart", "bar_chart_comparison", "Compare categories and calculate difference/percentage.", "Chart + MCQ", 50, 65, "applied", "Broaden data interpretation.", "no", "qa_review", "in_review", "bar_chart_comparison_v1"),
  b("numerical", 16, "Line graph", "line_graph_rate", "Find trend, rate or interpolated value.", "Graph + MCQ", 50, 65, "applied", "Broaden graphical literacy.", "no", "qa_review", "in_review", "line_graph_rate_v1"),
  b("numerical", 17, "Two-way table", "two_way_table", "Read conditional total or compare groups.", "Table + MCQ", 50, 65, "applied", "Data selection discipline."),
  b("numerical", 18, "Basic probability", "simple_probability", "Simple event probability from counts.", "MCQ", 45, 60, "applied", "Fill statistics/probability gap."),
  b("numerical", 19, "Numeric entry", "numeric_entry_area_rate", "Area/rate item requiring typed numeric response.", "Numeric entry", 50, 65, "applied", "Match FRV non-MCQ formats."),
  b("numerical", 20, "True/false data claim", "data_claim_true_false", "Evaluate statement against table/graph.", "True/False", 45, 60, "applied", "Match FRV response-format variety."),

  // Abstract & logical — 20
  b("abstract_logical", 1, "Next sequence - rotation", "sequence_rotation", "Single shape rotates fixed angle.", "Visual MCQ", 40, 55, "foundation", "FRV-style non-verbal sequence.", "candidate"),
  b("abstract_logical", 2, "Next sequence - count", "sequence_count", "Symbols increase/decrease by fixed count.", "Visual MCQ", 40, 55, "foundation", "Basic visual rule.", "candidate"),
  b("abstract_logical", 3, "Next sequence - alternation", "sequence_alternation", "Two rules alternate across positions.", "Visual MCQ", 50, 65, "applied", "Increase rule complexity."),
  b("abstract_logical", 4, "Next sequence - dual feature", "sequence_dual_feature", "Shape rotates while shading alternates.", "Visual MCQ", 55, 70, "applied", "Test feature separation."),
  b("abstract_logical", 5, "Missing matrix - addition", "matrix_addition", "Third cell combines first two.", "Matrix MCQ", 50, 65, "applied", "Retain current matrix strength."),
  b("abstract_logical", 6, "Missing matrix - subtraction", "matrix_subtraction", "Elements cancel or remove.", "Matrix MCQ", 50, 65, "applied", "Ambiguity-audited matrix logic."),
  b("abstract_logical", 7, "Missing matrix - rotation", "matrix_rotation", "Rows/columns transform orientation.", "Matrix MCQ", 55, 70, "applied", "Visual rule transfer."),
  b("abstract_logical", 8, "Missing matrix - overlay", "matrix_overlay", "Two cells superimposed produce third.", "Matrix MCQ", 55, 70, "stretch", "More realistic visual complexity."),
  b("abstract_logical", 9, "Classification - outlier", "classification_outlier", "Four options share exact component set; one differs.", "Visual MCQ", 40, 55, "foundation", "Criteria-style outlier.", "candidate"),
  b("abstract_logical", 10, "Classification - symmetry", "classification_symmetry", "Odd one out based on one unique symmetry property.", "Visual MCQ", 45, 60, "applied", "Avoid multi-criterion ambiguity."),
  b("abstract_logical", 11, "Analogy - rotation", "analogy_rotation", "A changes to B; apply same visual transformation to C.", "Visual analogy", 45, 60, "applied", "Use explicit transform layout."),
  b("abstract_logical", 12, "Analogy - fill change", "analogy_fill_change", "Filled becomes outline while shape retained.", "Visual analogy", 40, 55, "foundation", "Simple one-rule analogy.", "candidate"),
  b("abstract_logical", 13, "Deduction - ordering", "deduction_ordering", "Three/four entities with before/after constraints.", "Text logic MCQ", 45, 60, "applied", "FENZ deductive component."),
  b("abstract_logical", 14, "Deduction - conditional", "deduction_conditional", "If/then statements; choose must-follow conclusion.", "Text logic MCQ", 45, 60, "applied", "FENZ deductive component."),
  b("abstract_logical", 15, "Deduction - set logic", "deduction_set_logic", "All/some/none statements; choose necessary conclusion.", "Text logic MCQ", 50, 65, "stretch", "Higher logical precision."),
  b("abstract_logical", 16, "Pattern - movement grid", "pattern_movement_grid", "Dot moves around positions on a grid.", "Visual MCQ", 45, 60, "applied", "Spatial-pattern crossover."),
  b("abstract_logical", 17, "Pattern - reflection", "pattern_reflection_rotation", "Figure alternates mirror reflection and rotation.", "Visual MCQ", 55, 70, "stretch", "Higher visual demand."),
  b("abstract_logical", 18, "Diagrammatic rule", "diagrammatic_rule_machine", "Input/output icons show a rule machine.", "Diagram MCQ", 50, 65, "applied", "WA diagrammatic-reasoning calibration."),
  b("abstract_logical", 19, "Spatial outlier", "spatial_outlier", "Five compound figures; one lacks the shared arrangement.", "Visual MCQ", 45, 60, "applied", "Criteria-style spatial classification."),
  b("abstract_logical", 20, "Integrated matrix", "integrated_matrix", "Two simultaneous rules across rows and columns.", "Matrix MCQ", 60, 75, "stretch", "Upper-end calibration item."),

  // Verbal — 20
  b("verbal", 1, "Explicit fact", "explicit_fact", "Short workplace notice; retrieve stated detail.", "Passage MCQ", 40, 50, "foundation", "Retain current strength."),
  b("verbal", 2, "Explicit condition", "explicit_condition", "Instruction with exception; identify when rule applies.", "Passage MCQ", 45, 55, "applied", "Conditions/limits."),
  b("verbal", 3, "Main point", "main_point", "Short paragraph; choose best summary.", "Passage MCQ", 45, 60, "applied", "Literacy breadth."),
  b("verbal", 4, "Supported inference", "supported_inference", "Choose modest inference, reject overclaim.", "Passage MCQ", 50, 65, "applied", "Retain current strength."),
  b("verbal", 5, "Meaning in context", "meaning_in_context", "Infer meaning of familiar word/phrase from passage.", "Passage MCQ", 45, 60, "applied", "Broaden context vocabulary."),
  b("verbal", 6, "Sequence instruction", "instruction_sequence", "Multi-step procedure; identify correct order.", "Instruction MCQ", 45, 60, "applied", "Retain current strength."),
  b("verbal", 7, "Exception handling", "instruction_exception", "Procedure with unless/except condition.", "Instruction MCQ", 50, 65, "applied", "Real workplace comprehension."),
  b("verbal", 8, "Evidence scope", "evidence_scope", "Small survey/study; choose justified conclusion.", "Passage MCQ", 50, 65, "applied", "Retain current scope discipline."),
  b("verbal", 9, "Compare two texts", "dual_text_compare", "Two short notices; identify agreement/difference.", "Dual passage MCQ", 60, 75, "applied", "FRV varied-text literacy."),
  b("verbal", 10, "Longer passage", "long_passage_explicit", "180-250 word informational passage; explicit detail.", "Passage MCQ", 60, 75, "applied", "Increase FRV text-length realism."),
  b("verbal", 11, "Longer passage inference", "long_passage_inference", "Same passage; supported inference.", "Passage MCQ", 60, 75, "applied", "Sustained reading demand."),
  b("verbal", 12, "Table + text", "mixed_source_table_text", "Read a short roster/instruction plus table.", "Mixed-source MCQ", 55, 70, "applied", "Adult-context literacy/data crossover."),
  b("verbal", 13, "Vocabulary antonym", "vocabulary_antonym", "Common work-relevant word; choose opposite.", "Micro MCQ", 20, 30, "foundation", "Criteria-style verbal speed.", "yes"),
  b("verbal", 14, "Vocabulary synonym", "vocabulary_synonym", "Common work-relevant word; choose nearest meaning.", "Micro MCQ", 20, 30, "foundation", "Criteria-style verbal speed.", "yes"),
  b("verbal", 15, "Word relationship", "word_relationship", "Complete analogy between common words.", "Micro MCQ", 25, 35, "applied", "Criteria-style verbal relationship.", "yes"),
  b("verbal", 16, "Sentence completion", "sentence_completion", "Choose word that best completes a concise sentence.", "Micro MCQ", 25, 35, "applied", "Fast verbal reasoning.", "yes"),
  b("verbal", 17, "Claim vs evidence", "claim_vs_evidence", "Short report plus four claims; choose supported one.", "Passage MCQ", 50, 65, "applied", "Evidence discipline."),
  b("verbal", 18, "Ambiguous pronoun/reference", "reference_resolution", "Identify what a pronoun/phrase refers to.", "Passage MCQ", 45, 60, "applied", "Reading precision."),
  b("verbal", 19, "Policy interpretation", "policy_interpretation", "Policy excerpt; choose permitted action.", "Passage MCQ", 55, 70, "applied", "Job-relevant comprehension."),
  b("verbal", 20, "Multi-paragraph synthesis", "multi_paragraph_synthesis", "Two paragraphs; choose conclusion supported by both.", "Passage MCQ", 65, 80, "stretch", "Upper-end literacy calibration."),
];

export const generalCalibrationBlueprintById = Object.fromEntries(
  generalCalibrationBlueprints.map((item) => [item.blueprintId, item]),
) as Record<string, GeneralCalibrationBlueprint>;

export const generalCalibrationDomains: { id: CalibrationDomain; label: string }[] = [
  { id: "mechanical", label: "Mechanical" },
  { id: "numerical", label: "Numerical" },
  { id: "abstract_logical", label: "Abstract & logical" },
  { id: "verbal", label: "Verbal" },
];

export const calibrationQaGate = [
  "Original item, not a paraphrase of provider material",
  "Single keyed answer survives ambiguity review",
  "Each distractor maps to a named misconception or skipped step",
  "Diagram/text labels, dimensions, units and directions are consistent",
  "Mobile legibility checked without pinch-zoom",
  "Knowledgeable-tester time trial completed",
  "Difficulty spread remains deliberate",
  "Accessibility and unnecessary cultural knowledge reviewed",
  "Employer/provider tags supported by published evidence",
  "Author estimates remain separate from empirical beta evidence",
] as const;

export function getGeneralCalibrationSummary() {
  return generalCalibrationDomains.map((domain) => {
    const items = generalCalibrationBlueprints.filter((item) => item.domain === domain.id);
    return {
      ...domain,
      total: items.length,
      pilotLive: items.filter((item) => item.implementationStatus === "pilot_live").length,
      inAuthoring: items.filter((item) => item.implementationStatus === "authoring").length,
      inQa: items.filter((item) => item.implementationStatus === "qa_review").length,
      blueprintOnly: items.filter((item) => item.implementationStatus === "blueprint_only").length,
    };
  });
}
