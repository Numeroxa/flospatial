import { useEffect, useMemo, useState } from "react";

type AppScreen =
  | "landing"
  | "pathway-selection"
  | "preparation-context"
  | "mechanical-baseline-intro"
  | "mechanical-baseline-question"
  | "assessment-complete"
  | "first-advisor-insight"
  | "dashboard"
  | "hydraulic-fundamentals"
  | "hydraulic-fundamentals-complete"
  | "guided-hydraulic-practice-intro"
  | "guided-hydraulic-practice-question"
  | "guided-hydraulic-practice-debrief"
  | "mixed-mechanical-practice-intro"
  | "mixed-mechanical-practice-question"
  | "mixed-mechanical-practice-debrief"
  | "gear-fundamentals"
  | "gear-fundamentals-complete"
  | "guided-gear-practice-intro"
  | "guided-gear-practice-question"
  | "guided-gear-practice-debrief"
  | "gear-independent-practice-intro"
  | "gear-independent-practice-question"
  | "gear-independent-practice-debrief"
  | "gear-assessment-intro"
  | "gear-assessment-question"
  | "gear-assessment-debrief"
  | "pulley-fundamentals"
  | "pulley-fundamentals-complete"
  | "guided-pulley-practice-intro"
  | "guided-pulley-practice-question"
  | "guided-pulley-practice-debrief"
  | "pulley-independent-practice-intro"
  | "pulley-independent-practice-question"
  | "pulley-independent-practice-debrief"
  | "pulley-assessment-intro"
  | "pulley-assessment-question"
  | "pulley-assessment-debrief";

type TestScenario =
  | "hydraulic_baseline"
  | "hydraulic_module_complete"
  | "guided_strong_improvement"
  | "guided_moderate_improvement"
  | "guided_no_clear_improvement"
  | "mixed_gear_focus"
  | "gear_guided_ready"
  | "gear_guided_strong"
  | "gear_independent_strong"
  | "pulley_guided_ready"
  | "pulley_guided_strong"
  | "pulley_independent_strong";

type PathwayId = "fire_service";
type MechanicalSubcompetency = "hydraulics" | "gears" | "pulleys" | "levers";
type Confidence = "low" | "moderate" | "high";
type EvidenceStrength = "none" | "early" | "emerging" | "strong" | "established";

type PreparationContext = {
  assessmentTiming: "unknown" | "within_2_weeks" | "two_to_six_weeks" | "six_to_twelve_weeks" | "more_than_twelve_weeks";
  weeklyPrepTime: "less_than_one_hour" | "one_to_two_hours" | "three_to_five_hours" | "more_than_five_hours" | "not_sure";
  previousAttempt: "no" | "yes" | "prefer_not_to_say";
  createdAt: string;
};

type QuestionOption = { optionId: string; label: "A" | "B" | "C" | "D"; text: string };
type MvpQuestion = {
  questionId: string;
  sessionType: "mechanical_starting_point" | "guided_hydraulic_practice" | "mixed_mechanical_practice" | "guided_gear_practice" | "gear_independent_practice" | "gear_assessment" | "guided_pulley_practice" | "pulley_independent_practice" | "pulley_assessment" | "guided_pulley_practice" | "pulley_independent_practice" | "pulley_assessment";
  pathwayId: PathwayId;
  domain: "mechanical";
  subcompetency: MechanicalSubcompetency;
  concept: string;
  difficulty: "foundational" | "developing" | "applied";
  stem: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  feedbackCue?: string;
};

type AssessmentSession = {
  sessionId: string;
  sessionType: "mechanical_starting_point" | "guided_hydraulic_practice" | "mixed_mechanical_practice" | "guided_gear_practice" | "gear_independent_practice" | "gear_assessment" | "guided_pulley_practice" | "pulley_independent_practice" | "pulley_assessment" | "guided_pulley_practice" | "pulley_independent_practice" | "pulley_assessment";
  pathwayId: PathwayId;
  startedAt: string;
  completedAt?: string;
  questionIds: string[];
};

type AssessmentResponse = {
  responseId: string;
  sessionId: string;
  questionId: string;
  selectedOptionId: string | null;
  correct: boolean;
  responseTimeMs: number;
  notSureSelected: boolean;
  answeredAt: string;
};

type CompetencyEvidence = {
  evidenceId: string;
  domain: "mechanical";
  subcompetency: MechanicalSubcompetency;
  attempted: number;
  correct: number;
  accuracy: number;
  evidenceStrength: EvidenceStrength;
  sourceSessionId: string;
  updatedAt: string;
};

type Observation = { observationId: string; title: string; summary: string; evidenceIds: string[]; confidence: Confidence; createdAt: string };
type PreparationConstraint = {
  constraintId: string;
  constraintType: "foundation_knowledge" | "broad_foundation" | "insufficient_evidence";
  domain: "mechanical";
  subcompetency?: MechanicalSubcompetency;
  status: "identified" | "active" | "under_review" | "improving";
  confidence: Confidence;
  observationId: string;
  createdAt: string;
  updatedAt: string;
};

type Recommendation = {
  recommendationId: string;
  recommendationType:
    | "start_hydraulic_fundamentals"
    | "start_mechanical_foundations"
    | "follow_up_diagnostic"
    | "begin_guided_hydraulic_practice"
    | "start_applied_hydraulic_problems"
    | "continue_guided_hydraulic_practice"
    | "review_hydraulic_fundamentals"
    | "begin_mixed_mechanical_practice"
    | "start_gear_fundamentals"
    | "start_pulley_fundamentals"
    | "start_lever_fundamentals"
    | "continue_mixed_mechanical_practice"
    | "begin_guided_gear_practice"
    | "continue_guided_gear_practice"
    | "begin_gear_independent_practice"
    | "continue_gear_independent_practice"
    | "review_gear_fundamentals"
    | "return_to_mixed_mechanical_practice"
    | "begin_gear_assessment"
    | "repeat_gear_assessment"
    | "begin_guided_pulley_practice"
    | "continue_guided_pulley_practice"
    | "begin_pulley_independent_practice"
    | "continue_pulley_independent_practice"
    | "review_pulley_fundamentals"
    | "begin_pulley_assessment"
    | "repeat_pulley_assessment";
  title: string;
  summary: string;
  actionLabel: string;
  confidence: Confidence;
  whyExplanationId: string;
  status: "active" | "completed" | "replaced";
  createdAt: string;
};

type WhyExplanation = {
  whyExplanationId: string;
  title: string;
  observation: string;
  evidence: string;
  interpretation: string;
  recommendation: string;
  confidence: string;
  createdAt: string;
};

type ReadinessSnapshot = {
  readinessSnapshotId: string;
  state: "not_enough_evidence" | "early_evidence" | "developing_evidence";
  label: string;
  explanation: string;
  confidence: Confidence;
  createdAt: string;
};

type Milestone = {
  milestoneId: string;
  type:
    | "starting_point_established"
    | "first_focus_identified"
    | "dashboard_created"
    | "first_learning_action_completed"
    | "guided_hydraulic_practice_completed"
    | "first_improvement_signal"
    | "mixed_mechanical_practice_completed"
    | "second_focus_identified"
    | "guided_gear_practice_completed"
    | "gear_independent_practice_completed"
    | "gear_improvement_signal"
    | "gear_assessment_completed"
    | "gear_pathway_completed"
    | "guided_pulley_practice_completed"
    | "pulley_independent_practice_completed"
    | "pulley_improvement_signal"
    | "pulley_assessment_completed"
    | "pulley_pathway_completed";
  label: string;
  createdAt: string;
};

type DashboardState = {
  dashboardStateId: string;
  currentRecommendationId?: string;
  currentFocusLabel?: string;
  readinessSnapshotId?: string;
  recentMilestoneIds: string[];
  baselineSummary?: { mechanicalQuestionsCompleted: number; strongestArea?: string; focusArea?: string };
  saveStatus: "local_only" | "username_account";
  updatedAt: string;
};

type LearningModuleId = "hydraulic_fundamentals" | "gear_fundamentals" | "pulley_fundamentals";

type LearningMiniCheck = {
  questionId: string;
  stem: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
};

type LearningModuleSection = {
  sectionId: string;
  title: string;
  body: string;
  keyPoint?: string;
  miniCheck?: LearningMiniCheck;
};

type LearningModule = {
  moduleId: LearningModuleId;
  title: string;
  subtitle: string;
  targetDomain: "mechanical";
  targetSubcompetency: MechanicalSubcompetency;
  estimatedMinutes: number;
  sections: LearningModuleSection[];
};

type ModuleMiniCheckResponse = {
  questionId: string;
  selectedOptionId: string;
  correct: boolean;
  answeredAt: string;
};

type ModuleProgress = {
  moduleProgressId: string;
  moduleId: LearningModuleId;
  currentSectionIndex: number;
  miniCheckResponses: ModuleMiniCheckResponse[];
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
};

type ModuleCompletion = {
  moduleCompletionId: string;
  moduleId: LearningModuleId;
  completedAt: string;
};

type PracticeSummary = {
  summaryId: string;
  sessionId: string;
  sessionType: "guided_hydraulic_practice" | "mixed_mechanical_practice" | "guided_gear_practice" | "gear_independent_practice" | "gear_assessment" | "guided_pulley_practice" | "pulley_independent_practice" | "pulley_assessment";
  attempted: number;
  correct: number;
  accuracy: number;
  conceptBreakdown: { concept: string; attempted: number; correct: number; accuracy: number }[];
  createdAt: string;
};

type Debrief = {
  debriefId: string;
  sessionId: string;
  title: string;
  summary: string;
  comparison: string;
  interpretation: string;
  recommendationId: string;
  confidence: Confidence;
  whyExplanationId: string;
  createdAt: string;
};

type MvpGuestJourney = {
  version: "mvp_v1";
  guestJourneyId: string;
  selectedPathwayId?: PathwayId;
  preparationContext?: PreparationContext;
  sessions: AssessmentSession[];
  responses: AssessmentResponse[];
  competencyEvidence: CompetencyEvidence[];
  observations: Observation[];
  constraints: PreparationConstraint[];
  recommendations: Recommendation[];
  whyExplanations: WhyExplanation[];
  readinessSnapshots: ReadinessSnapshot[];
  milestones: Milestone[];
  moduleProgress: ModuleProgress[];
  moduleCompletions: ModuleCompletion[];
  practiceSummaries: PracticeSummary[];
  debriefs: Debrief[];
  dashboardState?: DashboardState;
  updatedAt: string;
};

const MVP_GUEST_JOURNEY_KEY = "flospatial.mvpGuestJourney.v1";
const TEST_ACCESS_PASSWORD = "flospatial";
const ENABLE_PASSWORD_GATE = import.meta.env.VITE_ENABLE_PASSWORD_GATE !== "false";
// Keep prototype testing shortcuts visible during the current alpha testing phase.
const SHOW_TEST_SCENARIOS = true;
const BUILD_LABEL = "Pulley Pathway v1 Alpha";

function id(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function now() { return new Date().toISOString(); }

const OPTION_LABELS = ["A", "B", "C", "D"] as const;
type OptionLabel = (typeof OPTION_LABELS)[number];

function buildQuestionOptions(questionId: string, optionTexts: string[], correctLabel: OptionLabel) {
  const offset = [...questionId].reduce((sum, char) => sum + char.charCodeAt(0), 0) % OPTION_LABELS.length;
  const originalCorrectIndex = OPTION_LABELS.indexOf(correctLabel);
  const rotatedTexts = optionTexts.map((_, index) => optionTexts[(index + offset) % OPTION_LABELS.length]);
  const newCorrectIndex = (originalCorrectIndex - offset + OPTION_LABELS.length) % OPTION_LABELS.length;
  return {
    options: OPTION_LABELS.map((label, index) => ({ optionId: `${questionId}-${label}`, label, text: rotatedTexts[index] })),
    correctOptionId: `${questionId}-${OPTION_LABELS[newCorrectIndex]}`,
  };
}

function createEmptyMvpGuestJourney(): MvpGuestJourney {
  return { version: "mvp_v1", guestJourneyId: id("guest"), sessions: [], responses: [], competencyEvidence: [], observations: [], constraints: [], recommendations: [], whyExplanations: [], readinessSnapshots: [], milestones: [], moduleProgress: [], moduleCompletions: [], practiceSummaries: [], debriefs: [], updatedAt: now() };
}
function migrateMvpGuestJourney(journey: MvpGuestJourney): MvpGuestJourney {
  const currentRecommendationId = journey.dashboardState?.currentRecommendationId;
  const currentRecommendation = journey.recommendations.find((rec) => rec.recommendationId === currentRecommendationId);
  const latestGuidedGearSummary = [...journey.practiceSummaries].reverse().find((summary) => summary.sessionType === "guided_gear_practice");
  const hasIndependentGearSession = journey.sessions.some((session) => session.sessionType === "gear_independent_practice");

  // Migrate journeys saved by the previous Gear Alpha build, which sent a strong
  // Guided Gear Practice result directly to the Gear Check.
  if (
    currentRecommendation?.recommendationType === "begin_gear_assessment" &&
    latestGuidedGearSummary &&
    latestGuidedGearSummary.accuracy >= 0.8 &&
    !hasIndependentGearSession
  ) {
    const updatedRecommendation: Recommendation = {
      ...currentRecommendation,
      recommendationType: "begin_gear_independent_practice",
      title: "Begin Independent Gear Practice",
      summary: "Apply the same gear concepts across a larger set of less-supported diagrams before the Gear Check.",
      actionLabel: "Start independent practice",
    };
    const updatedWhyExplanations = journey.whyExplanations.map((why) =>
      why.whyExplanationId === currentRecommendation.whyExplanationId
        ? {
            ...why,
            title: "Why Independent Gear Practice is recommended",
            observation: "Guided Gear Practice showed consistent gear reasoning.",
            interpretation: "The core gear concepts are ready to be applied across a broader, less-supported practice bank before the Gear Check.",
            recommendation: "Independent Gear Practice is recommended as the next step.",
          }
        : why
    );
    return {
      ...journey,
      recommendations: journey.recommendations.map((rec) => rec.recommendationId === updatedRecommendation.recommendationId ? updatedRecommendation : rec),
      whyExplanations: updatedWhyExplanations,
      dashboardState: journey.dashboardState ? { ...journey.dashboardState, currentFocusLabel: "Gear reasoning", updatedAt: now() } : journey.dashboardState,
      updatedAt: now(),
    };
  }
  return journey;
}

function loadMvpGuestJourney(): MvpGuestJourney {
  if (typeof window === "undefined") return createEmptyMvpGuestJourney();
  const raw = window.localStorage.getItem(MVP_GUEST_JOURNEY_KEY);
  if (!raw) return createEmptyMvpGuestJourney();
  try {
    const parsed = JSON.parse(raw) as MvpGuestJourney;
    const hydrated = parsed.version === "mvp_v1" ? { ...createEmptyMvpGuestJourney(), ...parsed } : createEmptyMvpGuestJourney();
    return migrateMvpGuestJourney(hydrated);
  } catch { return createEmptyMvpGuestJourney(); }
}
function saveMvpGuestJourney(journey: MvpGuestJourney) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MVP_GUEST_JOURNEY_KEY, JSON.stringify({ ...journey, updatedAt: now() }));
}
function resetMvpGuestJourney() {
  if (typeof window !== "undefined") window.localStorage.removeItem(MVP_GUEST_JOURNEY_KEY);
}

function makeQuestion(questionId: string, subcompetency: MechanicalSubcompetency, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "mechanical_starting_point", pathwayId: "fire_service", domain: "mechanical", subcompetency, concept, difficulty: "foundational", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation };
}

const mechanicalQuestions: MvpQuestion[] = [
  makeQuestion("HYD-B-001", "hydraulics", "pressure_transfer", "In a sealed hydraulic system filled with fluid, what happens when force is applied to one piston?", ["The pressure is transmitted through the fluid.", "The pressure disappears inside the fluid.", "The fluid prevents force from reaching the other piston.", "The pressure only acts on the piston being pushed."], "A", "In a closed hydraulic system, pressure applied at one point is transmitted through the fluid."),
  makeQuestion("HYD-B-002", "hydraulics", "closed_system_pressure", "In a closed fluid-filled system, a piston is pushed inward. What usually happens to the pressure?", ["It is transmitted through the fluid.", "It is destroyed by the fluid.", "It remains only behind the input piston.", "It disappears before reaching the output piston."], "A", "Pressure applied to a closed fluid is transmitted through the system."),
  makeQuestion("HYD-B-003", "hydraulics", "piston_area_force", "Why can a larger output piston produce greater force in a hydraulic system?", ["The same pressure acts over a larger area.", "The fluid creates extra pressure only at large pistons.", "Larger pistons always move farther.", "The input piston stops working."], "A", "Same pressure acting over a larger area produces greater force."),
  makeQuestion("HYD-B-004", "hydraulics", "force_distance_tradeoff", "A small piston moves a long distance to lift a larger piston a shorter distance. What does this show?", ["Force multiplication usually involves a distance tradeoff.", "Pressure has been lost.", "The load has become weightless.", "The output piston must move farther than the input."], "A", "Mechanical advantage often trades distance for greater force."),
  makeQuestion("HYD-B-005", "hydraulics", "movement_direction", "Two pistons are connected by sealed fluid. If the left piston is pushed down, what will the right piston usually do?", ["Move upward.", "Move downward.", "Stay fixed because pressure cannot travel.", "Move only if the system is open."], "A", "The pushed piston displaces fluid, usually driving the other piston upward."),
  makeQuestion("HYD-B-006", "hydraulics", "solving_strategy", "What is usually the best method for a hydraulic movement question?", ["Trace the input movement, pressure path and output movement.", "Choose the largest piston immediately.", "Assume every output moves downward.", "Ignore piston size."], "A", "Tracing the system is more reliable than guessing from the picture."),
  makeQuestion("HYD-B-007", "hydraulics", "applied_jack", "Why can a hydraulic jack lift a heavy vehicle?", ["Pressure is transmitted and acts over a larger output area.", "The vehicle becomes lighter.", "The fluid cancels gravity.", "The pressure disappears before reaching the jack."], "A", "A jack uses transmitted pressure over a larger area to create greater lifting force."),
  makeQuestion("HYD-B-008", "hydraulics", "applied_press", "A hydraulic press creates a large pressing force. What best explains this?", ["The same pressure acts over a larger output area.", "Pressure is lost as it travels.", "The output piston has no area.", "The input piston cancels movement."], "A", "Same pressure over a larger area produces greater force."),
  makeQuestion("GEAR-B-001", "gears", "gear_direction", "If two gears mesh directly and the left gear turns clockwise, what direction does the right gear turn?", ["Clockwise", "Anticlockwise", "It does not turn", "It turns both ways"], "B", "Directly meshed gears rotate in opposite directions."),
  makeQuestion("GEAR-B-002", "gears", "gear_train_direction", "Three gears mesh in a line. If the first turns clockwise, what direction does the third gear turn?", ["Clockwise", "Anticlockwise", "It cannot turn", "Direction cannot be known"], "A", "Each mesh reverses direction, so the third turns the same way as the first."),
  makeQuestion("GEAR-B-003", "gears", "gear_size_speed", "A small gear drives a larger gear. Compared with the small gear, the larger gear usually turns:", ["More slowly", "Faster", "At exactly double speed", "Not at all"], "A", "A larger driven gear usually rotates more slowly than the smaller driving gear."),
  makeQuestion("GEAR-B-004", "gears", "direct_mesh", "Two directly meshed gears will rotate:", ["In opposite directions", "In the same direction", "Only if they are the same size", "Only anticlockwise"], "A", "Directly meshed gears rotate in opposite directions."),
  makeQuestion("PULL-B-001", "pulleys", "fixed_pulley", "What is the main purpose of a fixed pulley?", ["To change the direction of the pulling force", "To remove all weight", "To double the load", "To stop the rope moving"], "A", "A fixed pulley mainly changes the direction of effort."),
  makeQuestion("PULL-B-002", "pulleys", "movable_pulley", "Why can a movable pulley make lifting easier?", ["More than one rope section supports the load.", "The load becomes weightless.", "The rope loses tension.", "The pulley removes gravity."], "A", "Multiple rope sections can share the load."),
  makeQuestion("PULL-B-003", "pulleys", "rope_sections", "A load is supported by two rope sections. Compared with one section, the effort is usually:", ["Lower", "Higher", "Unchanged always", "Impossible to apply"], "A", "More supporting rope sections reduce the effort needed."),
  makeQuestion("PULL-B-004", "pulleys", "distance_tradeoff", "What is a common tradeoff when pulleys reduce lifting effort?", ["You must pull more rope distance.", "The load becomes heavier.", "The rope stops moving.", "Direction cannot change."], "A", "Reduced effort usually comes with pulling a longer rope distance."),
  makeQuestion("LEV-B-001", "levers", "lever_arm", "Why does a longer handle often make turning or lifting easier?", ["It increases the turning effect.", "It removes the load.", "It stops the fulcrum moving.", "It cancels gravity."], "A", "A longer lever arm increases turning effect for the same force."),
  makeQuestion("LEV-B-002", "levers", "fulcrum_position", "If the fulcrum is closer to the load, what usually happens to effort?", ["Less effort is needed, but the effort end moves farther.", "More effort is always needed.", "The lever stops working.", "The load disappears."], "A", "Moving the fulcrum closer to the load can reduce effort but increases movement distance."),
  makeQuestion("LEV-B-003", "levers", "easiest_lift", "Which lever arrangement usually makes lifting easiest?", ["Fulcrum close to the load and effort applied far away.", "Fulcrum close to the effort and far from the load.", "Effort applied at the fulcrum.", "No fulcrum at all."], "A", "A long effort arm and short load arm provide mechanical advantage."),
  makeQuestion("LEV-B-004", "levers", "lever_tradeoff", "What is a common tradeoff when a lever reduces effort?", ["The effort end moves a greater distance.", "The load becomes weightless.", "The fulcrum disappears.", "The lever cannot move."], "A", "Mechanical advantage usually trades distance for lower effort."),
];


function makePracticeQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string, feedbackCue: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "guided_hydraulic_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "hydraulics", concept, difficulty: "developing", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation, feedbackCue };
}

const guidedHydraulicPracticeQuestions: MvpQuestion[] = [
  makePracticeQuestion("HYD-GP-001", "pressure_transfer", "In a sealed hydraulic system, a piston is pushed inward. What happens to the pressure in the fluid?", ["It is transmitted through the fluid.", "It disappears immediately.", "It only affects the air above the piston.", "It cannot affect another piston."], "A", "In a sealed hydraulic system, pressure is transmitted through the fluid.", "Look for how pressure travels through the closed fluid system."),
  makePracticeQuestion("HYD-GP-002", "fluid_role", "What is the main role of the fluid in a simple hydraulic system?", ["To make the load lighter.", "To transmit pressure.", "To stop force from moving.", "To remove the need for pistons."], "B", "The fluid transmits pressure from one part of the system to another.", "The fluid is the pressure-transmitting medium."),
  makePracticeQuestion("HYD-GP-003", "piston_area_force", "A small piston pushes fluid toward a larger piston. Which statement is most accurate?", ["The larger piston can produce greater force because pressure acts over a larger area.", "The larger piston must produce less force because it is larger.", "The fluid removes all pressure before it reaches the larger piston.", "The piston size has no relationship to force."], "A", "Same pressure acting over a larger piston area can produce greater force.", "Pressure and force are related, but piston area matters."),
  makePracticeQuestion("HYD-GP-004", "piston_area_force", "If the output piston is larger than the input piston, what is usually true?", ["The output piston produces no force.", "The output piston can produce greater force.", "The output piston always moves farther.", "Pressure cannot reach the output piston."], "B", "A larger output piston can produce greater force because pressure acts over a larger area.", "Same pressure × larger area = greater force."),
  makePracticeQuestion("HYD-GP-005", "force_distance_tradeoff", "A hydraulic system allows a small input force to lift a larger load. What is the usual tradeoff?", ["The load becomes weightless.", "The input piston may need to move a greater distance.", "The fluid stops moving.", "The output piston always moves farther than the input piston."], "B", "Increased output force usually comes with a movement-distance tradeoff.", "Mechanical advantage usually trades force for distance."),
  makePracticeQuestion("HYD-GP-006", "piston_area_force", "The same fluid pressure acts on two pistons. One piston has twice the area of the other. Which piston produces more force?", ["The smaller piston.", "The larger piston.", "Both must produce zero force.", "Area does not affect force."], "B", "Force equals pressure acting over area. With the same pressure, the larger area produces more force.", "When pressure is the same, compare piston area."),
  makePracticeQuestion("HYD-GP-007", "movement_direction", "In a simple two-piston hydraulic system, the left piston is pushed downward. The system is sealed and filled with fluid. What will the right piston usually do?", ["Move downward.", "Move upward.", "Stay fixed because fluid cannot transmit pressure.", "Move only if the fluid is removed."], "B", "The downward input displaces fluid and usually drives the other piston upward.", "Trace input movement, pressure path, then output movement."),
  makePracticeQuestion("HYD-GP-008", "solving_strategy", "Which method is usually best for solving hydraulic movement questions?", ["Choose the piston that looks largest.", "Assume the output always moves down.", "Trace the input force, pressure path and output movement.", "Ignore the fluid path."], "C", "Hydraulic movement problems are best solved by tracing the system.", "Trace before choosing."),
  makePracticeQuestion("HYD-GP-009", "applied_jack", "A hydraulic jack uses a small handle piston and a larger lifting piston. Why can the lifting piston raise a heavy load?", ["Pressure is transmitted through the fluid and acts over a larger piston area.", "The handle removes the load’s weight.", "The fluid cancels gravity.", "The large piston receives no pressure."], "A", "The transmitted pressure acts over the larger lifting piston area, producing greater force.", "Combine pressure transfer with piston area."),
  makePracticeQuestion("HYD-GP-010", "applied_press", "A hydraulic press produces a large pressing force using a smaller input piston. What best explains this?", ["Pressure is lost as it travels.", "The output piston has no area.", "The same pressure acts over a larger output area.", "The fluid prevents force transfer."], "C", "Same pressure acting over a larger output piston area produces greater force.", "Look for pressure acting over a larger area."),
];

function makeMixedQuestion(questionId: string, subcompetency: MechanicalSubcompetency, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string, feedbackCue: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "mixed_mechanical_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency, concept, difficulty: "developing", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation, feedbackCue };
}


function makeGearPracticeQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string, feedbackCue: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "guided_gear_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "gears", concept, difficulty: "developing", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation, feedbackCue };
}

const guidedGearPracticeQuestions: MvpQuestion[] = [
  makeGearPracticeQuestion("GEAR-GP-001", "direct_mesh_direction", "Gear A turns clockwise. Which way does Gear B turn?", ["Clockwise", "Anticlockwise", "It does not turn", "Direction cannot be known"], "B", "Each direct gear contact reverses direction, so Gear B turns anticlockwise.", "Trace one direct contact from the driver to the driven gear."),
  makeGearPracticeQuestion("GEAR-GP-002", "three_gear_direction", "Gear A turns anticlockwise. Which way does Gear C turn?", ["Clockwise", "Anticlockwise", "It does not turn", "Direction cannot be known"], "B", "There are two direct contacts. Two reversals mean Gear C turns the same way as Gear A: anticlockwise.", "Work one contact at a time rather than guessing from the final position."),
  makeGearPracticeQuestion("GEAR-GP-003", "four_gear_direction", "Gear A turns clockwise. Which way does Gear D turn?", ["Clockwise", "Anticlockwise", "It cannot turn", "It depends only on gear size"], "B", "There are three contacts. An odd number of reversals makes Gear D turn opposite to Gear A.", "Count contacts, not gears."),
  makeGearPracticeQuestion("GEAR-GP-004", "five_gear_direction", "Gear A turns anticlockwise. Which way does Gear E turn?", ["Clockwise", "Anticlockwise", "It cannot turn", "It depends only on gear size"], "B", "There are four contacts. An even number of reversals means Gear E turns the same way as Gear A.", "Trace the direction through every contact."),
  makeGearPracticeQuestion("GEAR-GP-005", "idler_effect", "Gear B sits between Gear A and Gear C. In this simple train, what is Gear B mainly doing?", ["Changing the direction relationship between A and C", "Making Gear C turn faster regardless of size", "Stopping torque from reaching Gear C", "Making all three gears turn the same way"], "A", "The middle gear adds another reversal and changes the direction relationship between the first and last gears.", "Ask what changes because an extra gear contact has been added."),
  makeGearPracticeQuestion("GEAR-GP-006", "idler_ratio", "Gear A has 12 teeth, Gear B has 28 teeth and Gear C has 36 teeth. If B is replaced by a different-sized idler that still meshes correctly, what happens to the speed ratio between A and C?", ["It stays the same", "It always doubles", "It becomes impossible to predict", "It depends only on the idler size"], "A", "In a simple gear train, the idler changes direction and spacing, but the overall speed ratio between the first and last gears depends on their tooth counts.", "Compare the first and last gears; the middle idler does not set the overall ratio."),
  makeGearPracticeQuestion("GEAR-GP-007", "small_to_large_speed", "Gear A is the 12-tooth driver and Gear B has 36 teeth. Which gear turns faster?", ["Gear A", "Gear B", "They turn at the same speed", "Neither gear can turn"], "A", "The smaller driver must turn more times for the larger driven gear to complete one revolution, so Gear A turns faster.", "Compare tooth counts before deciding speed."),
  makeGearPracticeQuestion("GEAR-GP-008", "large_to_small_speed", "Gear A is the 36-tooth driver and Gear B has 12 teeth. What happens to Gear B?", ["It turns faster than Gear A", "It turns more slowly than Gear A", "It turns at the same speed as Gear A", "It cannot turn"], "A", "A larger driver turning a smaller driven gear produces a faster output.", "A smaller driven gear completes more revolutions for the same tooth movement."),
  makeGearPracticeQuestion("GEAR-GP-009", "simple_ratio", "A 12-tooth gear turns at 90 rpm and drives a 36-tooth gear. How fast does the 36-tooth gear turn?", ["30 rpm", "90 rpm", "180 rpm", "270 rpm"], "A", "The driven gear has three times as many teeth, so it turns at one-third the speed: 30 rpm.", "Use the inverse tooth-count relationship: more teeth means fewer revolutions."),
  makeGearPracticeQuestion("GEAR-GP-010", "direction_and_speed", "Gear A has 30 teeth and turns clockwise at 60 rpm. It directly drives 15-tooth Gear B. Which statement is correct?", ["Gear B turns anticlockwise at 120 rpm", "Gear B turns clockwise at 120 rpm", "Gear B turns anticlockwise at 30 rpm", "Gear B turns clockwise at 30 rpm"], "A", "Direct contact reverses direction, and the smaller 15-tooth gear turns twice as fast as the 30-tooth driver.", "Solve direction and speed as two separate questions, then combine them."),
];


function makeGearIndependentQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "gear_independent_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "gears", concept, difficulty: "applied", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation };
}

const gearIndependentPracticeQuestions: MvpQuestion[] = [
  makeGearIndependentQuestion("GEAR-IP-001", "direct_mesh_direction", "Gear A turns clockwise. Which way does Gear B turn?", ["Anticlockwise", "Clockwise", "It does not turn", "Direction cannot be known"], "A", "Directly meshed gears rotate in opposite directions, so Gear B turns anticlockwise."),
  makeGearIndependentQuestion("GEAR-IP-002", "three_gear_direction", "Gear A turns clockwise. Which way does Gear C turn?", ["Clockwise", "Anticlockwise", "It cannot turn", "It depends on gear size"], "A", "Two gear contacts produce two reversals, so Gear C turns in the same direction as Gear A."),
  makeGearIndependentQuestion("GEAR-IP-003", "five_gear_direction", "Gear A turns anticlockwise. Which way does Gear E turn?", ["Anticlockwise", "Clockwise", "It cannot turn", "It depends on tooth count"], "A", "Four contacts produce four reversals, so the final gear turns in the same direction as Gear A."),
  makeGearIndependentQuestion("GEAR-IP-004", "six_gear_direction", "Gear A turns clockwise. Which way does Gear F turn?", ["Anticlockwise", "Clockwise", "It cannot turn", "Direction cannot be known"], "A", "Five contacts produce an odd number of reversals, so Gear F turns opposite to Gear A."),
  makeGearIndependentQuestion("GEAR-IP-005", "middle_driver_direction", "Gear B is the driver and turns clockwise. Which statement is correct?", ["Gears A and C both turn anticlockwise", "Gear A turns clockwise and Gear C anticlockwise", "Gear A turns anticlockwise and Gear C clockwise", "Gears A and C both turn clockwise"], "A", "Each gear directly meshing with clockwise Gear B must turn anticlockwise."),
  makeGearIndependentQuestion("GEAR-IP-006", "idler_effect", "Gear B is an idler between Gear A and Gear C. Gear A turns clockwise. Which way does Gear C turn?", ["Clockwise", "Anticlockwise", "It does not turn", "It depends only on the size of Gear B"], "A", "The idler creates a second reversal, so Gear C turns in the same direction as Gear A."),
  makeGearIndependentQuestion("GEAR-IP-007", "four_gear_direction", "Gear A turns clockwise through a train of four gears. Which way does Gear D turn?", ["Anticlockwise", "Clockwise", "It cannot turn", "It depends on which gear is largest"], "A", "Three contacts give three reversals, so Gear D turns opposite to Gear A."),
  makeGearIndependentQuestion("GEAR-IP-008", "small_to_large_speed", "A 14-tooth driver turns a 42-tooth driven gear. Which statement is correct?", ["The 42-tooth gear turns more slowly", "The 42-tooth gear turns faster", "Both gears turn at the same speed", "The 42-tooth gear cannot turn"], "A", "The driven gear has three times as many teeth, so it turns at one-third the speed of the driver."),
  makeGearIndependentQuestion("GEAR-IP-009", "large_to_small_speed", "A 48-tooth driver turns a 16-tooth driven gear. How does the driven gear rotate?", ["Three times faster", "Three times slower", "At the same speed", "Six times faster"], "A", "The driven gear has one-third as many teeth, so it completes three revolutions for each revolution of the driver."),
  makeGearIndependentQuestion("GEAR-IP-010", "equal_size_speed", "Two 24-tooth gears mesh directly. Compared with Gear A, Gear B turns:", ["At the same speed in the opposite direction", "At the same speed in the same direction", "Twice as fast", "Half as fast"], "A", "Equal tooth counts give equal rotational speed, while direct contact reverses direction."),
  makeGearIndependentQuestion("GEAR-IP-011", "simple_ratio", "A 12-tooth gear turns at 90 rpm and drives a 36-tooth gear. How fast does the 36-tooth gear turn?", ["30 rpm", "90 rpm", "180 rpm", "270 rpm"], "A", "The driven gear has three times as many teeth, so it turns at one-third the speed: 30 rpm."),
  makeGearIndependentQuestion("GEAR-IP-012", "simple_ratio", "A 40-tooth gear turns at 50 rpm and drives a 20-tooth gear. How fast does the 20-tooth gear turn?", ["100 rpm", "25 rpm", "50 rpm", "200 rpm"], "A", "The driven gear has half as many teeth, so it turns twice as fast: 100 rpm."),
  makeGearIndependentQuestion("GEAR-IP-013", "simple_ratio", "An 18-tooth driver turns at 120 rpm and drives a 54-tooth gear. What is the driven speed?", ["40 rpm", "60 rpm", "120 rpm", "360 rpm"], "A", "The driven gear has three times as many teeth, so it turns at one-third the driver speed: 40 rpm."),
  makeGearIndependentQuestion("GEAR-IP-014", "simple_ratio", "A 48-tooth driver turns at 60 rpm and drives a 16-tooth gear. What is the driven speed?", ["180 rpm", "20 rpm", "60 rpm", "120 rpm"], "A", "The driven gear has one-third as many teeth, so it turns three times as fast: 180 rpm."),
  makeGearIndependentQuestion("GEAR-IP-015", "idler_ratio", "Gear A has 12 teeth and turns at 90 rpm. It drives 24-tooth idler Gear B, which drives 36-tooth Gear C. How fast does Gear C turn?", ["30 rpm", "60 rpm", "90 rpm", "180 rpm"], "A", "The idler changes direction and spacing but not the overall ratio. The 12-tooth input driving the 36-tooth output gives 30 rpm."),
  makeGearIndependentQuestion("GEAR-IP-016", "direction_and_speed", "Gear A has 24 teeth and turns clockwise at 60 rpm. It drives 12-tooth Gear B. Which statement is correct?", ["Gear B turns anticlockwise at 120 rpm", "Gear B turns clockwise at 120 rpm", "Gear B turns anticlockwise at 30 rpm", "Gear B turns clockwise at 30 rpm"], "A", "Direct contact reverses direction, and the smaller driven gear turns twice as fast."),
  makeGearIndependentQuestion("GEAR-IP-017", "direction_and_speed", "Gear A has 15 teeth and turns anticlockwise at 100 rpm. It drives 30-tooth Gear B, which drives 45-tooth Gear C. What does Gear C do?", ["Turns anticlockwise at about 33 rpm", "Turns clockwise at about 33 rpm", "Turns anticlockwise at 300 rpm", "Turns clockwise at 100 rpm"], "A", "Two contacts preserve the input direction overall. The 15-tooth input to 45-tooth output gives one-third the speed: about 33 rpm."),
  makeGearIndependentQuestion("GEAR-IP-018", "direction_and_speed", "Gear B is the 36-tooth driver and turns clockwise at 50 rpm. It meshes with 12-tooth Gear A and 18-tooth Gear C. Which statement is correct?", ["Gear A turns anticlockwise at 150 rpm and Gear C anticlockwise at 100 rpm", "Gear A turns clockwise at 150 rpm and Gear C clockwise at 100 rpm", "Gear A turns anticlockwise at 50 rpm and Gear C clockwise at 50 rpm", "Gear A turns clockwise at 100 rpm and Gear C anticlockwise at 150 rpm"], "A", "Both gears reverse direction relative to Gear B. The 12-tooth gear turns three times as fast and the 18-tooth gear twice as fast."),
  makeGearIndependentQuestion("GEAR-IP-019", "relative_speed", "Gear A has 12 teeth, Gear B has 36 teeth and Gear C has 18 teeth. All three mesh in a simple train. Which gear turns most slowly?", ["Gear B", "Gear A", "Gear C", "They all turn at the same speed"], "A", "In a simple gear train, the gear with the greatest tooth count turns most slowly."),
  makeGearIndependentQuestion("GEAR-IP-020", "fastest_gear", "Gear A has 10 teeth, Gear B has 20 teeth and Gear C has 40 teeth. Which gear turns fastest?", ["Gear A", "Gear B", "Gear C", "They all turn at the same speed"], "A", "The smallest gear completes the most revolutions for the same tooth movement, so Gear A turns fastest."),
  makeGearIndependentQuestion("GEAR-IP-021", "slowest_gear", "Gear A has 20 teeth, Gear B has 60 teeth and Gear C has 30 teeth. Which gear turns most slowly?", ["Gear B", "Gear A", "Gear C", "The driver always turns most slowly"], "A", "The 60-tooth gear is the largest and therefore turns most slowly in this simple train."),
  makeGearIndependentQuestion("GEAR-IP-022", "idler_ratio", "Gear A has 15 teeth, Gear B is an idler and Gear C has 45 teeth. If Gear B is replaced by a different-sized idler that still meshes correctly, what happens to Gear C's speed relative to Gear A?", ["It stays the same", "It always doubles", "It becomes half as fast as before", "It depends only on the new idler size"], "A", "A simple idler changes direction and spacing but not the overall speed ratio between the first and last gears."),
  makeGearIndependentQuestion("GEAR-IP-023", "equal_size_speed", "Three equal 30-tooth gears mesh in a line. Gear A turns clockwise. Which statement about Gear C is correct?", ["It turns clockwise at the same speed as Gear A", "It turns anticlockwise at the same speed as Gear A", "It turns clockwise at half the speed", "It does not turn"], "A", "Two contacts preserve the original direction, and equal tooth counts preserve rotational speed."),
  makeGearIndependentQuestion("GEAR-IP-024", "four_gear_direction", "Four equal gears are arranged in an offset train. Gear A turns anticlockwise. Which way does Gear D turn?", ["Clockwise", "Anticlockwise", "It cannot turn", "The offset layout makes direction impossible to predict"], "A", "The visual layout does not change the contact rule. Three contacts produce three reversals, so Gear D turns clockwise."),
  makeGearIndependentQuestion("GEAR-IP-025", "direction_and_speed", "Gear A has 20 teeth and turns clockwise at 80 rpm. It drives 10-tooth Gear B, which drives 40-tooth Gear C. What does Gear C do?", ["Turns clockwise at 40 rpm", "Turns anticlockwise at 40 rpm", "Turns clockwise at 160 rpm", "Turns anticlockwise at 160 rpm"], "A", "Two contacts preserve the original direction. The 20-tooth input to 40-tooth output gives half the input speed: 40 rpm."),
];

function makeGearAssessmentQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "gear_assessment", pathwayId: "fire_service", domain: "mechanical", subcompetency: "gears", concept, difficulty: "applied", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation };
}

const gearAssessmentQuestions: MvpQuestion[] = [
  makeGearAssessmentQuestion("GEAR-AS-001", "direct_mesh_direction", "Gear A turns anticlockwise. Which way does Gear B turn?", ["Clockwise", "Anticlockwise", "It does not turn", "Direction cannot be known"], "A", "Directly meshed gears rotate in opposite directions."),
  makeGearAssessmentQuestion("GEAR-AS-002", "three_gear_direction", "Gear A turns clockwise. Which way does Gear C turn?", ["Clockwise", "Anticlockwise", "It cannot turn", "It depends on gear size"], "A", "Two gear contacts create two reversals, so Gear C turns the same way as Gear A."),
  makeGearAssessmentQuestion("GEAR-AS-003", "four_gear_direction", "Gear A turns anticlockwise. Which way does Gear D turn?", ["Clockwise", "Anticlockwise", "It cannot turn", "It depends only on the largest gear"], "A", "Three contacts create an odd number of reversals, so Gear D turns opposite to Gear A."),
  makeGearAssessmentQuestion("GEAR-AS-004", "idler_effect", "An extra gear is inserted between Gear A and Gear C without changing A or C. What is the main effect on Gear C?", ["Its rotation direction reverses", "Its speed always doubles", "It stops turning", "Its tooth count changes"], "A", "Adding one idler adds one extra direction reversal. With the first and last gear unchanged, it does not set the overall speed ratio."),
  makeGearAssessmentQuestion("GEAR-AS-005", "small_to_large_speed", "A 15-tooth gear drives a 45-tooth gear. Which gear turns faster?", ["The 15-tooth gear", "The 45-tooth gear", "They turn at the same speed", "Speed cannot be compared"], "A", "The smaller gear turns faster; the larger gear turns more slowly."),
  makeGearAssessmentQuestion("GEAR-AS-006", "large_to_small_speed", "A 40-tooth gear drives a 10-tooth gear. Compared with the driver, the 10-tooth gear turns:", ["Four times faster", "Four times slower", "At the same speed", "Twice as fast"], "A", "The driven gear has one quarter as many teeth, so it turns four times faster."),
  makeGearAssessmentQuestion("GEAR-AS-007", "simple_ratio", "A 15-tooth driver turns at 120 rpm and drives a 45-tooth gear. What is the output speed?", ["40 rpm", "120 rpm", "240 rpm", "360 rpm"], "A", "The driven gear has three times as many teeth, so it turns at one-third the speed: 40 rpm."),
  makeGearAssessmentQuestion("GEAR-AS-008", "simple_ratio", "A 40-tooth driver turns at 50 rpm and drives a 10-tooth gear. What is the output speed?", ["200 rpm", "100 rpm", "50 rpm", "12.5 rpm"], "A", "The driven gear has one quarter as many teeth, so it turns four times faster: 200 rpm."),
  makeGearAssessmentQuestion("GEAR-AS-009", "direction_and_speed", "Gear A has 20 teeth and turns clockwise at 100 rpm. It directly drives 40-tooth Gear B. Which statement is correct?", ["Gear B turns anticlockwise at 50 rpm", "Gear B turns clockwise at 50 rpm", "Gear B turns anticlockwise at 200 rpm", "Gear B turns clockwise at 200 rpm"], "A", "Direct contact reverses direction, and the 40-tooth driven gear turns at half the speed."),
  makeGearAssessmentQuestion("GEAR-AS-010", "idler_ratio", "Gear A has 20 teeth and turns clockwise at 120 rpm. It drives 10-tooth Gear B, which drives 40-tooth Gear C. Which statement about Gear C is correct?", ["It turns clockwise at 60 rpm", "It turns anticlockwise at 60 rpm", "It turns clockwise at 240 rpm", "It turns anticlockwise at 240 rpm"], "A", "Two contacts mean Gear C turns the same way as Gear A. The overall ratio depends on A and C: 20 to 40 gives 60 rpm."),
];


function makeGuidedPulleyQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string, feedbackCue: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "guided_pulley_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "pulleys", concept, difficulty: "developing", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation, feedbackCue };
}

const guidedPulleyPracticeQuestions: MvpQuestion[] = [
  makeGuidedPulleyQuestion("PULL-GP-001", "fixed_pulley_direction", "A single fixed pulley is attached to the ceiling. If you pull the free end down, what is the main effect?", ["The load rises while the effort direction changes", "The load becomes weightless", "The effort is automatically halved", "The pulley stores force"], "A", "A fixed pulley mainly changes the direction of effort. Pulling down can lift the load upward.", "A fixed pulley changes direction more than force."),
  makeGuidedPulleyQuestion("PULL-GP-002", "supporting_strands", "A movable pulley is supported by two rope sections. In an ideal system, how many rope sections share the load?", ["Two", "One", "Three", "Four"], "A", "Both rope sections attached around the moving pulley share the load.", "Count only rope sections that pull upward on the moving part."),
  makeGuidedPulleyQuestion("PULL-GP-003", "supporting_strands", "The moving block in the diagram is supported by three rope sections. What is the ideal mechanical advantage?", ["3", "1", "2", "6"], "A", "In an ideal pulley system, mechanical advantage is approximately the number of rope sections supporting the moving load.", "Count the supporting strands, not every visible length of rope."),
  makeGuidedPulleyQuestion("PULL-GP-004", "supporting_strands", "A block-and-tackle arrangement has four rope sections supporting the moving block. What is the ideal mechanical advantage?", ["4", "2", "6", "8"], "A", "Four supporting rope sections give an ideal mechanical advantage of four.", "Count upward-supporting rope sections attached to the moving assembly."),
  makeGuidedPulleyQuestion("PULL-GP-005", "free_end", "The free end of the rope hangs downward for the person to pull. Should that free end be counted as supporting the load?", ["No, unless it directly pulls upward on the moving block", "Yes, every visible rope section always counts", "Only if it is the longest section", "Only when the load is light"], "A", "The free end is not automatically a supporting strand. Count only rope sections that directly support the moving assembly.", "Ask whether this rope section pulls upward on the moving part."),
  makeGuidedPulleyQuestion("PULL-GP-006", "fixed_vs_movable", "Which arrangement provides force advantage in the ideal diagrams shown here?", ["The arrangement with a movable pulley supported by multiple rope sections", "A single fixed pulley by itself", "Any pulley regardless of rope path", "Only a pulley that turns clockwise"], "A", "A movable pulley can share the load across multiple rope sections. A single fixed pulley mainly changes direction.", "Look for rope sections lifting the moving block."),
  makeGuidedPulleyQuestion("PULL-GP-007", "force_calculation", "A 200 N load is supported by two rope sections in an ideal pulley system. About how much effort is needed?", ["100 N", "200 N", "400 N", "50 N"], "A", "With two supporting strands, the ideal effort is 200 ÷ 2 = 100 N.", "Divide the load by the number of supporting strands."),
  makeGuidedPulleyQuestion("PULL-GP-008", "force_calculation", "A 300 N load is supported by three rope sections. What is the ideal effort?", ["100 N", "150 N", "300 N", "900 N"], "A", "Three supporting strands share the 300 N load, so the ideal effort is 100 N.", "Load ÷ supporting strands = ideal effort."),
  makeGuidedPulleyQuestion("PULL-GP-009", "distance_tradeoff", "A pulley system has a mechanical advantage of four. To raise the load by 1 metre, approximately how much rope must be pulled in an ideal system?", ["4 metres", "1 metre", "0.25 metres", "8 metres"], "A", "A four-to-one force advantage usually means pulling about four times as much rope distance.", "Mechanical advantage trades lower effort for greater rope movement."),
  makeGuidedPulleyQuestion("PULL-GP-010", "integrated", "A 400 N load is supported by four rope sections. Which statement is correct for an ideal system?", ["About 100 N effort is needed, and more rope must be pulled than the load rises", "About 400 N effort is needed and rope distance is unchanged", "About 1600 N effort is needed", "The load becomes weightless"], "A", "Four supporting strands reduce ideal effort to 100 N, with a corresponding distance tradeoff.", "Combine strand count with the effort-distance tradeoff."),
];

function makePulleyIndependentQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string, feedbackCue: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "pulley_independent_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "pulleys", concept, difficulty: "applied", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation, feedbackCue };
}

const pulleyIndependentPracticeQuestions: MvpQuestion[] = [
  makePulleyIndependentQuestion("PULL-IP-001", "fixed_pulley_direction", "A worker pulls down on the free end of a rope passing over a single fixed pulley. What happens to the load?", ["It rises", "It falls", "It remains stationary", "It moves sideways"], "A", "The fixed pulley changes the direction of effort: pulling down raises the load.", "Trace the rope direction over the fixed pulley."),
  makePulleyIndependentQuestion("PULL-IP-002", "fixed_pulley_advantage", "What is the ideal mechanical advantage of a single fixed pulley?", ["1", "2", "3", "4"], "A", "A single fixed pulley changes direction but does not ideally reduce the force required.", "A fixed pulley alone does not multiply force."),
  makePulleyIndependentQuestion("PULL-IP-003", "supporting_strands", "How many rope sections support the moving block in the diagram?", ["2", "1", "3", "4"], "A", "Two rope sections pull upward on the moving block.", "Count upward forces on the moving assembly."),
  makePulleyIndependentQuestion("PULL-IP-004", "supporting_strands", "The moving block is lifted by three supporting rope sections. What is the ideal mechanical advantage?", ["3", "1", "2", "6"], "A", "Three supporting strands give an ideal mechanical advantage of three.", "Mechanical advantage follows the number of supporting strands."),
  makePulleyIndependentQuestion("PULL-IP-005", "supporting_strands", "The lower block is supported by four rope sections. What is the ideal mechanical advantage?", ["4", "2", "8", "16"], "A", "Four supporting strands give an ideal mechanical advantage of four.", "Count the strands attached to the moving block."),
  makePulleyIndependentQuestion("PULL-IP-006", "free_end", "Which rope section should not be counted when finding mechanical advantage?", ["A free end that does not pull upward on the moving block", "A strand directly supporting the moving block", "A strand attached to the moving block", "A strand carrying tension upward from the lower pulley"], "A", "A free end is not counted unless it directly supports the moving load.", "Count function, not appearance."),
  makePulleyIndependentQuestion("PULL-IP-007", "force_calculation", "A 240 N load is supported by two rope sections. What is the ideal effort?", ["120 N", "240 N", "480 N", "60 N"], "A", "240 ÷ 2 = 120 N.", "Divide load by supporting strands."),
  makePulleyIndependentQuestion("PULL-IP-008", "force_calculation", "A 360 N load is supported by three rope sections. What is the ideal effort?", ["120 N", "180 N", "360 N", "1080 N"], "A", "360 ÷ 3 = 120 N.", "Load ÷ mechanical advantage."),
  makePulleyIndependentQuestion("PULL-IP-009", "force_calculation", "A 600 N load is supported by four rope sections. What is the ideal effort?", ["150 N", "300 N", "600 N", "2400 N"], "A", "600 ÷ 4 = 150 N.", "Use the number of supporting strands."),
  makePulleyIndependentQuestion("PULL-IP-010", "load_calculation", "A person applies 80 N of effort to an ideal system with two supporting strands. What load can be balanced?", ["160 N", "80 N", "40 N", "320 N"], "A", "Two supporting strands can ideally balance twice the effort: 160 N.", "Effort × supporting strands = ideal load."),
  makePulleyIndependentQuestion("PULL-IP-011", "load_calculation", "An ideal system has three supporting strands and an effort of 90 N. What load can be balanced?", ["270 N", "180 N", "90 N", "30 N"], "A", "90 × 3 = 270 N.", "Multiply effort by the strand count."),
  makePulleyIndependentQuestion("PULL-IP-012", "load_calculation", "An ideal four-strand system is pulled with 75 N. What load can be balanced?", ["300 N", "150 N", "75 N", "600 N"], "A", "75 × 4 = 300 N.", "Mechanical advantage multiplies the ideal load capacity."),
  makePulleyIndependentQuestion("PULL-IP-013", "distance_tradeoff", "A two-strand pulley system raises a load 2 m. Approximately how much rope must be pulled ideally?", ["4 m", "2 m", "1 m", "8 m"], "A", "With a two-to-one mechanical advantage, the rope moves about twice the load distance.", "Force advantage is exchanged for rope distance."),
  makePulleyIndependentQuestion("PULL-IP-014", "distance_tradeoff", "A three-strand system raises a load by 0.5 m. Approximately how much rope is pulled?", ["1.5 m", "0.5 m", "3 m", "0.17 m"], "A", "Three supporting strands mean about three times as much rope movement: 1.5 m.", "Multiply load travel by mechanical advantage."),
  makePulleyIndependentQuestion("PULL-IP-015", "distance_tradeoff", "A four-strand system requires 8 m of rope pull. Approximately how far does the load rise?", ["2 m", "4 m", "8 m", "32 m"], "A", "8 ÷ 4 = 2 m of load movement.", "Rope distance ÷ mechanical advantage = load travel."),
  makePulleyIndependentQuestion("PULL-IP-016", "fixed_vs_movable", "Which change would reduce ideal effort most?", ["Increase the number of rope sections supporting the moving block", "Add another fixed pulley that only changes direction", "Use a longer free end", "Pull faster"], "A", "More supporting strands increase mechanical advantage. A fixed direction-change pulley alone does not.", "Look for additional upward support on the moving block."),
  makePulleyIndependentQuestion("PULL-IP-017", "same_tension", "In an ideal continuous rope, what is assumed about tension in each section of that rope?", ["It is approximately the same", "It is zero at the top", "It doubles at every pulley", "It depends only on rope colour"], "A", "Ideal pulley reasoning assumes approximately equal tension throughout one continuous rope.", "One continuous ideal rope carries the same tension."),
  makePulleyIndependentQuestion("PULL-IP-018", "anchor_point", "One end of the rope is attached directly to the moving block, and two other rope sections also support it. How many supporting sections are there?", ["3", "2", "1", "4"], "A", "The attached rope end also pulls upward on the moving block, so it counts as a supporting section.", "An anchored end counts if it directly supports the moving part."),
  makePulleyIndependentQuestion("PULL-IP-019", "unusual_layout", "The pulleys are drawn at an angle, but three rope sections still pull on the moving block. What determines ideal mechanical advantage?", ["The number of supporting rope sections", "Whether the diagram is vertical", "The colour of the rope", "The size of the load box"], "A", "Diagram orientation does not change the basic method: count supporting rope sections.", "Ignore surface orientation; find the support relationship."),
  makePulleyIndependentQuestion("PULL-IP-020", "compound_system", "A fixed pulley redirects the free end after a two-strand movable pulley. What is the ideal mechanical advantage?", ["2", "1", "3", "4"], "A", "The extra fixed pulley changes pull direction but does not add another supporting strand to the moving load.", "Do not count direction-change pulleys as extra force advantage."),
  makePulleyIndependentQuestion("PULL-IP-021", "effort_direction", "A fixed pulley is added above the free end of a four-strand block-and-tackle so the person can pull downward. What changes?", ["The effort direction changes, but the ideal mechanical advantage remains 4", "The mechanical advantage becomes 5", "The load doubles", "The rope tension becomes zero"], "A", "A fixed direction-change pulley alters convenience, not the number of strands supporting the moving block.", "Separate effort direction from force advantage."),
  makePulleyIndependentQuestion("PULL-IP-022", "comparison", "System A has two supporting strands. System B has four. For the same load, which needs less ideal effort?", ["System B", "System A", "Both need the same effort", "Neither can lift"], "A", "Four supporting strands share the load more than two, so System B needs less ideal effort.", "More supporting strands means lower ideal effort."),
  makePulleyIndependentQuestion("PULL-IP-023", "comparison", "System A has a fixed pulley only. System B has one movable pulley with two supporting strands. Which provides greater ideal force advantage?", ["System B", "System A", "They are identical", "Neither has any rope tension"], "A", "The movable pulley system has two supporting strands and an ideal mechanical advantage of two.", "A fixed pulley redirects; a movable pulley can multiply force."),
  makePulleyIndependentQuestion("PULL-IP-024", "integrated", "A 480 N load is lifted by an ideal four-strand system. Which statement is correct?", ["About 120 N effort is needed and about four times the load travel in rope must be pulled", "About 480 N effort is needed with no distance tradeoff", "About 1920 N effort is needed", "The free end must support the load directly"], "A", "480 ÷ 4 = 120 N, and the force advantage is exchanged for greater rope travel.", "Combine force and distance consequences."),
  makePulleyIndependentQuestion("PULL-IP-025", "integrated", "A worker can pull with 100 N and needs to balance a 300 N load ideally. What minimum number of supporting rope sections is required?", ["3", "2", "4", "1"], "A", "300 ÷ 100 = 3, so at least three supporting strands are required ideally.", "Required mechanical advantage = load ÷ effort."),
];

function makePulleyAssessmentQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "pulley_assessment", pathwayId: "fire_service", domain: "mechanical", subcompetency: "pulleys", concept, difficulty: "applied", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation };
}

const pulleyAssessmentQuestions: MvpQuestion[] = [
  makePulleyAssessmentQuestion("PULL-AS-001", "system_recognition", "What is the main effect of the fixed pulley shown?", ["It changes the direction of effort", "It halves the required force", "It doubles the load", "It prevents rope movement"], "A", "A single fixed pulley mainly changes effort direction."),
  makePulleyAssessmentQuestion("PULL-AS-002", "supporting_strands", "How many rope sections directly support the moving block?", ["2", "1", "3", "4"], "A", "Two rope sections support the moving block."),
  makePulleyAssessmentQuestion("PULL-AS-003", "supporting_strands", "What is the ideal mechanical advantage of the pulley arrangement shown?", ["3", "1", "2", "6"], "A", "Three supporting strands give an ideal mechanical advantage of three."),
  makePulleyAssessmentQuestion("PULL-AS-004", "supporting_strands", "What is the ideal mechanical advantage of this block-and-tackle?", ["4", "2", "6", "8"], "A", "Four rope sections support the moving block."),
  makePulleyAssessmentQuestion("PULL-AS-005", "force", "A 360 N load is supported by three rope sections. What ideal effort is required?", ["120 N", "180 N", "360 N", "1080 N"], "A", "360 ÷ 3 = 120 N."),
  makePulleyAssessmentQuestion("PULL-AS-006", "force", "A 500 N load is supported by four rope sections. What ideal effort is required?", ["125 N", "250 N", "500 N", "2000 N"], "A", "500 ÷ 4 = 125 N."),
  makePulleyAssessmentQuestion("PULL-AS-007", "distance", "A four-strand system raises a load by 1.5 m. Approximately how much rope is pulled ideally?", ["6 m", "1.5 m", "3 m", "0.375 m"], "A", "1.5 × 4 = 6 m of rope movement."),
  makePulleyAssessmentQuestion("PULL-AS-008", "anchor_point", "One rope end is attached to the moving block and two other sections support it. What is the ideal mechanical advantage?", ["3", "2", "1", "4"], "A", "The anchored end counts because it directly supports the moving block."),
  makePulleyAssessmentQuestion("PULL-AS-009", "fixed_vs_movable", "A fixed pulley is added only to redirect the free end of a two-strand movable-pulley system. What is the ideal mechanical advantage?", ["2", "3", "1", "4"], "A", "The fixed pulley changes direction but adds no extra supporting strand."),
  makePulleyAssessmentQuestion("PULL-AS-010", "integrated", "A person pulls 4 m of rope to raise a 400 N load by 1 m in an ideal system. Which statement best fits?", ["The system has mechanical advantage 4 and needs about 100 N effort", "The system has mechanical advantage 1 and needs 400 N effort", "The system has mechanical advantage 2 and needs 200 N effort", "The system has mechanical advantage 8 and needs 50 N effort"], "A", "A 4:1 distance ratio indicates mechanical advantage 4, so ideal effort is 400 ÷ 4 = 100 N."),
];

const mixedMechanicalPracticeQuestions: MvpQuestion[] = [
  makeMixedQuestion("MIX-HYD-001", "hydraulics", "pressure_transfer", "A sealed hydraulic system has a small input piston connected to a larger output piston. What carries the effect of the input force to the output piston?", ["Pressure transmitted through the fluid", "Air above the piston", "The weight of the load", "The size of the handle only"], "A", "In a sealed hydraulic system, pressure is transmitted through the fluid.", "Trace the pressure path through the fluid."),
  makeMixedQuestion("MIX-HYD-002", "hydraulics", "piston_area_force", "The same pressure acts on two output pistons. One piston has a larger area. Which produces greater force?", ["The larger-area piston", "The smaller-area piston", "Both produce no force", "Area does not matter"], "A", "The same pressure acting over a larger area produces greater force.", "When force is the question, compare piston area."),
  makeMixedQuestion("MIX-HYD-003", "hydraulics", "movement_direction", "Two pistons are connected by sealed fluid. If the left piston is pushed down, what usually happens to the right piston?", ["It moves upward", "It moves downward", "It cannot move", "It moves only if the fluid is removed"], "A", "Pushing one piston down displaces fluid and usually drives the other piston upward.", "Trace input movement, fluid displacement and output movement."),
  makeMixedQuestion("MIX-HYD-004", "hydraulics", "force_distance_tradeoff", "A hydraulic system lets a small force move a heavy load. What is the usual tradeoff?", ["The input side moves a greater distance", "The load becomes weightless", "Pressure disappears", "The output must move farther"], "A", "Mechanical advantage usually trades force for distance.", "Look for force gain paired with movement-distance tradeoff."),
  makeMixedQuestion("MIX-HYD-005", "hydraulics", "applied_jack", "A hydraulic jack lifts a vehicle with a larger lifting piston. What best explains the lift?", ["Pressure acts over the larger piston area", "The vehicle becomes lighter", "The fluid cancels gravity", "The input piston removes pressure"], "A", "The larger piston can create greater force because pressure acts over a larger area.", "Combine pressure transfer with piston area."),
  makeMixedQuestion("MIX-GEAR-001", "gears", "gear_direction", "Two gears mesh directly. Gear A turns clockwise. Gear B will turn:", ["Clockwise", "Anticlockwise", "It will not turn", "Upward only"], "B", "Directly meshed gears rotate in opposite directions.", "Each direct gear contact reverses direction."),
  makeMixedQuestion("MIX-GEAR-002", "gears", "gear_train_direction", "Three gears mesh in a line. If the first gear turns clockwise, the third gear turns:", ["Clockwise", "Anticlockwise", "It cannot turn", "Direction is random"], "A", "With three gears in a line, there are two reversals, so the first and third turn the same way.", "Count the number of gear contacts."),
  makeMixedQuestion("MIX-GEAR-003", "gears", "gear_size_speed", "A small gear drives a larger gear. The larger gear usually turns:", ["More slowly", "Faster", "At the same speed in all cases", "Only clockwise"], "A", "A larger driven gear usually turns more slowly than the smaller driving gear.", "Compare gear sizes to infer speed change."),
  makeMixedQuestion("MIX-GEAR-004", "gears", "idler_gear", "Gear A drives Gear B, and Gear B drives Gear C. Gear B mainly changes:", ["The direction relationship between A and C", "The weight of the gears", "Whether pressure is transmitted", "The number of teeth on Gear A"], "A", "An intermediate gear reverses direction between contacts and changes the final direction relationship.", "Trace the gears one contact at a time."),
  makeMixedQuestion("MIX-GEAR-005", "gears", "gear_train_method", "What is usually the best method for a gear-direction question?", ["Trace each gear contact and count reversals", "Guess from the largest gear", "Assume all gears turn the same way", "Ignore intermediate gears"], "A", "Gear-direction questions are best solved by tracing each contact and counting reversals.", "Count each mesh as a direction reversal."),
  makeMixedQuestion("MIX-PULL-001", "pulleys", "fixed_pulley", "What is the main effect of a single fixed pulley?", ["It changes the direction of effort", "It removes all load", "It doubles force automatically", "It stops the rope moving"], "A", "A fixed pulley mainly changes the direction of the pulling force.", "Fixed pulleys mainly redirect effort."),
  makeMixedQuestion("MIX-PULL-002", "pulleys", "movable_pulley", "A movable pulley supports a load with two rope sections. Compared with direct lifting, the effort is usually:", ["Lower", "Higher", "Exactly zero", "Unrelated to rope sections"], "A", "Multiple rope sections can share the load and reduce effort.", "Count how many rope sections support the load."),
  makeMixedQuestion("MIX-PULL-003", "pulleys", "rope_sections", "In a pulley system, more supporting rope sections usually means:", ["Less effort but more rope pulled", "More effort and less rope pulled", "No movement", "The load becomes weightless"], "A", "Pulley mechanical advantage reduces effort but usually requires pulling more rope distance.", "Look for the effort-distance tradeoff."),
  makeMixedQuestion("MIX-PULL-004", "pulleys", "pulley_tradeoff", "A pulley system makes lifting easier. What is the usual tradeoff?", ["You pull more rope distance", "The pulley removes gravity", "The rope loses tension", "The load cannot move"], "A", "Reduced effort usually comes with greater rope movement distance.", "Mechanical advantage trades effort for distance."),
  makeMixedQuestion("MIX-PULL-005", "pulleys", "pulley_method", "What should you usually count first in a pulley mechanical-advantage question?", ["The rope sections supporting the load", "The colour of the pulley", "The length of the handle", "The direction of gravity only"], "A", "Counting supporting rope sections is a useful first step in pulley questions.", "Start by counting support strands."),
  makeMixedQuestion("MIX-LEV-001", "levers", "lever_arm", "Why does a longer handle make a tool easier to turn?", ["It increases the turning effect of the force", "It removes all force", "It makes the object weightless", "It stops movement"], "A", "A longer lever arm increases turning effect for the same force.", "Compare distances from the fulcrum."),
  makeMixedQuestion("MIX-LEV-002", "levers", "fulcrum_position", "A lever's fulcrum is moved closer to the load. What usually happens?", ["Less effort is needed, but the effort end moves farther", "More effort is always needed", "The lever stops working", "The load disappears"], "A", "Moving the fulcrum closer to the load can increase mechanical advantage, with a distance tradeoff.", "Look at the load arm and effort arm."),
  makeMixedQuestion("MIX-LEV-003", "levers", "easiest_lift", "Which lever setup usually makes a heavy load easiest to lift?", ["Fulcrum close to the load and effort applied farther away", "Fulcrum close to the effort", "No fulcrum", "Effort applied only at the load"], "A", "A short load arm and long effort arm provide greater mechanical advantage.", "Long effort arm, short load arm."),
  makeMixedQuestion("MIX-LEV-004", "levers", "lever_tradeoff", "A lever reduces the effort needed to lift a load. What is the usual tradeoff?", ["The effort end moves farther", "The load has no weight", "The fulcrum disappears", "The load must move farther"], "A", "Lever mechanical advantage usually trades distance for lower effort.", "Reduced effort usually costs extra movement distance."),
  makeMixedQuestion("MIX-LEV-005", "levers", "lever_method", "What is usually the best first step in a lever question?", ["Locate the fulcrum, load and effort", "Choose the longest word", "Ignore where the force is applied", "Assume all levers work the same way"], "A", "Lever questions are best solved by locating the fulcrum, load and effort first.", "Find fulcrum, load and effort before choosing."),
];


function moduleOption(questionId: string, label: "A" | "B" | "C" | "D", text: string): QuestionOption {
  return { optionId: `${questionId}-${label}`, label, text };
}

function makeMiniCheck(questionId: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string): LearningMiniCheck {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return {
    questionId,
    stem,
    options: prepared.options,
    correctOptionId: prepared.correctOptionId,
    explanation,
  };
}

const hydraulicFundamentalsModule: LearningModule = {
  moduleId: "hydraulic_fundamentals",
  title: "Hydraulic Fundamentals",
  subtitle: "Pressure, piston size, force multiplication and movement direction",
  targetDomain: "mechanical",
  targetSubcompetency: "hydraulics",
  estimatedMinutes: 10,
  sections: [
    {
      sectionId: "hyd-fund-001",
      title: "What hydraulics means",
      body: "Hydraulics uses fluid to transmit force. In many simple hydraulic systems, force applied at one piston creates pressure in the fluid. That pressure can act on another piston and produce movement or force somewhere else.",
      keyPoint: "The fluid transmits pressure through the system.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-001", "What is the main role of the fluid in a simple hydraulic system?", ["To transmit pressure", "To remove all force", "To stop the pistons moving", "To make the load weightless"], "A", "In a simple sealed hydraulic system, the fluid transmits pressure from one part of the system to another."),
    },
    {
      sectionId: "hyd-fund-002",
      title: "Pressure travels through fluid",
      body: "In a closed hydraulic system, pressure does not stay only at the input piston. It is transmitted through the fluid. This is why pushing one piston can affect another piston connected by fluid.",
      keyPoint: "Pressure applied at one point is transmitted through the closed fluid system.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-002", "In a sealed fluid-filled system, pressure applied at one piston is usually:", ["Transmitted through the fluid", "Destroyed by the fluid", "Kept only under the input piston", "Removed by the output piston"], "A", "In a closed fluid-filled system, pressure is transmitted through the fluid."),
    },
    {
      sectionId: "hyd-fund-003",
      title: "Piston size and force",
      body: "A larger piston has more surface area. If the same pressure acts over a larger area, the output force can be greater. This is why a small input force can help lift or press a heavier load in a hydraulic jack or press.",
      keyPoint: "Same pressure over a larger area can produce greater force.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-003", "Why can a larger output piston produce greater force?", ["Because the same pressure acts over a larger area", "Because pressure disappears before reaching it", "Because larger pistons always move farther", "Because the input piston stops working"], "A", "Same pressure acting over a larger piston area can produce greater force."),
    },
    {
      sectionId: "hyd-fund-004",
      title: "The distance tradeoff",
      body: "Hydraulics can increase force, but there is usually a tradeoff. The small input piston may need to move a longer distance so the larger output piston can move a shorter distance with greater force.",
      keyPoint: "More output force usually comes with less output movement distance.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-004", "In a hydraulic jack, why might the handle piston move farther than the lifting piston?", ["Because force multiplication usually comes with a movement-distance tradeoff", "Because the fluid loses all pressure", "Because the lifting piston is not connected", "Because the load has become weightless"], "A", "Force multiplication usually comes with a movement-distance tradeoff."),
    },
    {
      sectionId: "hyd-fund-005",
      title: "Direction of movement",
      body: "For movement questions, do not guess from the picture alone. Trace the input movement, then trace where the fluid pressure goes, then predict what the output piston will do.",
      keyPoint: "Trace input movement → pressure path → output movement.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-005", "If the left piston is pushed down in a simple sealed two-piston system, what will the right piston usually do?", ["Move upward", "Move downward", "Stay fixed because pressure cannot travel", "Move only if the system contains air"], "A", "The downward input displaces fluid and usually drives the other piston upward."),
    },
    {
      sectionId: "hyd-fund-006",
      title: "Worked example",
      body: "A hydraulic jack has a small handle piston and a larger lifting piston. The handle piston is pushed down. This creates pressure in the fluid. The pressure is transmitted to the larger lifting piston. Because the lifting piston has a larger area, it can produce greater lifting force. The tradeoff is that the lifting piston moves a shorter distance.",
      keyPoint: "Hydraulic jacks use transmitted pressure and larger output area to create greater lifting force.",
    },
    {
      sectionId: "hyd-fund-007",
      title: "Solving method",
      body: "When faced with a hydraulic reasoning question, use a simple sequence:\n\n1. Find the input piston.\n2. Trace the pressure path through the fluid.\n3. Compare piston sizes.\n4. Predict force or movement.\n5. Check whether there is a distance tradeoff.\n\nThis method is more reliable than guessing from the picture alone.",
      keyPoint: "Trace the system before choosing an answer.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-007", "What is usually the best first step in a hydraulic movement question?", ["Trace the input force, pressure path and output movement", "Guess which piston looks heavier", "Assume every output moves downward", "Ignore piston size"], "A", "Tracing the input, pressure path and output movement is the most reliable approach."),
    },
    {
      sectionId: "hyd-fund-008",
      title: "Completion",
      body: "You have completed Hydraulic Fundamentals. FloSpatial now needs follow-up practice evidence to see whether the earlier hydraulic-force reasoning constraint is improving.",
      keyPoint: "The next step is an evidence check, not a readiness judgement.",
    },
  ],
};


const gearFundamentalsModule: LearningModule = {
  moduleId: "gear_fundamentals",
  title: "Gear Fundamentals",
  subtitle: "Direction, gear trains, idlers, gear size and simple ratios",
  targetDomain: "mechanical",
  targetSubcompetency: "gears",
  estimatedMinutes: 10,
  sections: [
    {
      sectionId: "gear-fund-001",
      title: "What gears do",
      body: "Gears transfer turning motion from one part of a machine to another. In mechanical reasoning questions, you are usually asked to predict direction, speed, or the effect of gear size.",
      keyPoint: "Gears transfer rotation, and directly meshed gears reverse direction.",
      miniCheck: makeMiniCheck("GEAR-FUND-MC-001", "When two gears mesh directly, what usually happens to their rotation directions?", ["They rotate in opposite directions", "They rotate in the same direction", "The driven gear cannot turn", "Both gears become locked"], "A", "Directly meshed gears rotate in opposite directions."),
    },
    {
      sectionId: "gear-fund-002",
      title: "Driver and driven gears",
      body: "The driver gear is the gear being turned first. The driven gear is the gear being turned by another gear. Start every gear question by finding the driver gear, then trace the motion from gear to gear.",
      keyPoint: "Find the driver first, then trace the gear train.",
      miniCheck: makeMiniCheck("GEAR-FUND-MC-002", "In a gear question, what is usually the best first step?", ["Find the driver gear", "Guess the largest gear", "Ignore the first gear", "Assume all gears turn clockwise"], "A", "Finding the driver gear gives you the starting direction for the whole gear train."),
    },
    {
      sectionId: "gear-fund-003",
      title: "Worked example: three gears",
      body: "Imagine three gears in a row: A drives B, and B drives C. If A turns clockwise, B turns anticlockwise. C then reverses again, so C turns clockwise. Each direct mesh reverses direction.",
      keyPoint: "Each gear contact reverses direction. Gear 1 and Gear 3 turn the same way in a three-gear line.",
      miniCheck: makeMiniCheck("GEAR-FUND-MC-003", "Three gears are in a row. If the first gear turns clockwise, which way does the third gear turn?", ["Clockwise", "Anticlockwise", "It cannot turn", "Direction cannot be known"], "A", "The second gear reverses direction, and the third reverses it again, so the third turns the same way as the first."),
    },
    {
      sectionId: "gear-fund-004",
      title: "Gear size and speed",
      body: "Gear size affects speed. A small gear driving a large gear usually makes the large gear turn more slowly. A large gear driving a small gear usually makes the small gear turn faster. This is similar to trading speed and turning force.",
      keyPoint: "Small driving large → slower output. Large driving small → faster output.",
      miniCheck: makeMiniCheck("GEAR-FUND-MC-004", "A small gear drives a larger gear. Compared with the small gear, the larger gear usually turns:", ["More slowly", "Faster", "At the same speed in all cases", "Only clockwise"], "A", "A larger driven gear usually turns more slowly than the smaller driving gear."),
    },
    {
      sectionId: "gear-fund-005",
      title: "Idler gears",
      body: "An idler gear sits between two other gears. It changes the direction of rotation, but in simple aptitude questions it usually does not change the overall gear ratio between the first and last gear. It is often used to make the output turn in the desired direction.",
      keyPoint: "An idler gear changes direction without being the main output gear.",
      miniCheck: makeMiniCheck("GEAR-FUND-MC-005", "What is a common role of an idler gear in a simple gear train?", ["It changes the direction of the final gear", "It makes all gears stop", "It removes all torque", "It makes the first gear disappear"], "A", "An idler gear is often used to change output direction."),
    },
    {
      sectionId: "gear-fund-006",
      title: "Simple gear ratios",
      body: "You do not need advanced maths for the first version of FloSpatial gear reasoning. The key idea is simple: a larger gear has more teeth and needs more movement from a smaller gear to complete one full turn. That is why larger driven gears usually turn more slowly.",
      keyPoint: "Compare relative gear size before deciding which turns faster.",
      miniCheck: makeMiniCheck("GEAR-FUND-MC-006", "A 10-tooth gear drives a 20-tooth gear. Which gear turns faster?", ["The 10-tooth gear", "The 20-tooth gear", "Both must turn at the same speed", "Neither can turn"], "A", "The smaller gear turns faster; the larger gear turns more slowly."),
    },
    {
      sectionId: "gear-fund-007",
      title: "Solving method",
      body: "Use this sequence for gear questions:\n\n1. Find the driver gear.\n2. Trace each gear contact.\n3. Count direction reversals.\n4. Compare gear sizes.\n5. Predict output direction and speed.\n\nThis prevents guessing from the drawing alone.",
      keyPoint: "Trace direction first, then compare size.",
      miniCheck: makeMiniCheck("GEAR-FUND-MC-007", "What should you do after identifying the driver gear?", ["Trace each gear contact", "Ignore the middle gears", "Assume the last gear turns clockwise", "Only compare colours"], "A", "After finding the driver gear, trace each contact through the gear train."),
    },
    {
      sectionId: "gear-fund-008",
      title: "Completion",
      body: "You have completed Gear Fundamentals. FloSpatial now has a structured foundation for gear direction, gear trains, idlers, gear size and simple ratios. The next step is Guided Gear Practice, which checks whether these gear concepts transfer into problem-solving.",
      keyPoint: "Gear Fundamentals complete. Guided Gear Practice is the next evidence check.",
    },
  ],
};


const pulleyFundamentalsModule: LearningModule = {
  moduleId: "pulley_fundamentals",
  title: "Pulley Fundamentals",
  subtitle: "Fixed pulleys, movable pulleys, supporting strands, force and distance",
  targetDomain: "mechanical",
  targetSubcompetency: "pulleys",
  estimatedMinutes: 10,
  sections: [
    {
      sectionId: "pulley-fund-001",
      title: "What pulleys do",
      body: "Pulleys use a rope and one or more wheels to change how a force is applied. In aptitude questions, you are usually asked about direction of effort, the number of rope sections supporting a load, ideal mechanical advantage, or the force-distance tradeoff.",
      keyPoint: "First decide whether the pulley only changes direction or whether the moving load is supported by multiple rope sections.",
      miniCheck: makeMiniCheck("PULL-FUND-MC-001", "What is the main effect of a single fixed pulley?", ["It changes the direction of effort", "It always halves the effort", "It makes the load weightless", "It removes rope tension"], "A", "A single fixed pulley mainly changes the direction of effort."),
    },
    {
      sectionId: "pulley-fund-002",
      title: "Fixed and movable pulleys",
      body: "A fixed pulley stays attached to the support above the load. By itself, it mainly makes pulling more convenient by changing direction. A movable pulley rises with the load. When more than one rope section pulls upward on that moving assembly, the load is shared between them.",
      keyPoint: "Fixed pulley → direction change. Movable pulley → possible force advantage.",
      miniCheck: makeMiniCheck("PULL-FUND-MC-002", "Which arrangement can provide an ideal force advantage?", ["A movable pulley supported by multiple rope sections", "A single fixed pulley only", "Any wheel regardless of rope path", "A pulley that turns clockwise"], "A", "A movable pulley can share the load across multiple supporting rope sections."),
    },
    {
      sectionId: "pulley-fund-003",
      title: "Count the supporting strands",
      body: "The most useful rule is simple: count the rope sections that directly pull upward on the moving load or moving pulley block. Do not count every visible part of the rope. A free end used for pulling does not automatically support the load.",
      keyPoint: "Count support, not rope appearance.",
      miniCheck: makeMiniCheck("PULL-FUND-MC-003", "Which rope sections should be counted for ideal mechanical advantage?", ["Sections that directly support the moving load", "Every visible rope section", "Only the free end", "Only the longest section"], "A", "Count rope sections that directly support the moving assembly."),
    },
    {
      sectionId: "pulley-fund-004",
      title: "Mechanical advantage",
      body: "In the ideal pulley diagrams used here, mechanical advantage is approximately the number of rope sections supporting the moving load. Two supporting sections give an ideal advantage of 2. Three give 3. Four give 4.",
      keyPoint: "Ideal mechanical advantage ≈ number of supporting strands.",
      miniCheck: makeMiniCheck("PULL-FUND-MC-004", "A moving block is supported by four rope sections. What is the ideal mechanical advantage?", ["4", "2", "8", "16"], "A", "Four supporting strands give an ideal mechanical advantage of four."),
    },
    {
      sectionId: "pulley-fund-005",
      title: "Force calculations",
      body: "For simple ideal questions, divide the load by the number of supporting strands. A 300 N load supported by three strands needs about 100 N effort. Real systems lose some force to friction, but aptitude tests usually use the ideal relationship unless told otherwise.",
      keyPoint: "Ideal effort = load ÷ supporting strands.",
      miniCheck: makeMiniCheck("PULL-FUND-MC-005", "A 240 N load is supported by two rope sections. What is the ideal effort?", ["120 N", "240 N", "480 N", "60 N"], "A", "240 ÷ 2 = 120 N."),
    },
    {
      sectionId: "pulley-fund-006",
      title: "The distance tradeoff",
      body: "Pulley systems do not create energy. If the effort is reduced by a factor of four, you usually pull about four times as much rope distance as the load rises. This is the same force-distance tradeoff seen in other simple machines.",
      keyPoint: "Less effort usually means more rope movement.",
      miniCheck: makeMiniCheck("PULL-FUND-MC-006", "A four-strand system raises a load by 1 m. Approximately how much rope is pulled ideally?", ["4 m", "1 m", "0.25 m", "8 m"], "A", "A four-to-one force advantage usually requires about four times the rope travel."),
    },
    {
      sectionId: "pulley-fund-007",
      title: "Solving method",
      body: "Use this sequence for pulley questions:\n\n1. Identify the moving load or moving block.\n2. Trace the rope path.\n3. Count rope sections that directly support the moving part.\n4. Ignore direction-change pulleys when counting force advantage.\n5. Apply the force or distance tradeoff if needed.",
      keyPoint: "Find the moving part first, then count the strands that support it.",
      miniCheck: makeMiniCheck("PULL-FUND-MC-007", "What is usually the best first step in a pulley mechanical-advantage question?", ["Identify the moving load or moving block", "Count every pulley wheel", "Choose the longest rope", "Assume the largest pulley gives the most force"], "A", "Finding the moving part lets you count only the rope sections that actually support it."),
    },
    {
      sectionId: "pulley-fund-008",
      title: "Completion",
      body: "You have completed Pulley Fundamentals. The next step is Guided Pulley Practice, where the diagrams help you apply the strand-count method before the support is reduced.",
      keyPoint: "Pulley Fundamentals complete. Guided Pulley Practice comes next.",
    },
  ],
};

function createMechanicalBaselineSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "mechanical_starting_point", pathwayId: "fire_service", startedAt: now(), questionIds: mechanicalQuestions.map((q) => q.questionId) };
}
function createGuidedHydraulicPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "guided_hydraulic_practice", pathwayId: "fire_service", startedAt: now(), questionIds: guidedHydraulicPracticeQuestions.map((q) => q.questionId) };
}
function createMixedMechanicalPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "mixed_mechanical_practice", pathwayId: "fire_service", startedAt: now(), questionIds: mixedMechanicalPracticeQuestions.map((q) => q.questionId) };
}
function createGuidedGearPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "guided_gear_practice", pathwayId: "fire_service", startedAt: now(), questionIds: guidedGearPracticeQuestions.map((q) => q.questionId) };
}
function createGearIndependentPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "gear_independent_practice", pathwayId: "fire_service", startedAt: now(), questionIds: gearIndependentPracticeQuestions.map((q) => q.questionId) };
}
function createGearAssessmentSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "gear_assessment", pathwayId: "fire_service", startedAt: now(), questionIds: gearAssessmentQuestions.map((q) => q.questionId) };
}
function createGuidedPulleyPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "guided_pulley_practice", pathwayId: "fire_service", startedAt: now(), questionIds: guidedPulleyPracticeQuestions.map((q) => q.questionId) };
}
function createPulleyIndependentPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "pulley_independent_practice", pathwayId: "fire_service", startedAt: now(), questionIds: pulleyIndependentPracticeQuestions.map((q) => q.questionId) };
}
function createPulleyAssessmentSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "pulley_assessment", pathwayId: "fire_service", startedAt: now(), questionIds: pulleyAssessmentQuestions.map((q) => q.questionId) };
}
function createAssessmentResponse(sessionId: string, question: MvpQuestion, selectedOptionId: string | null, responseTimeMs: number, notSureSelected: boolean): AssessmentResponse {
  return { responseId: id("response"), sessionId, questionId: question.questionId, selectedOptionId, correct: selectedOptionId === question.correctOptionId, responseTimeMs, notSureSelected, answeredAt: now() };
}
function evidenceStrength(attempted: number): EvidenceStrength {
  if (attempted === 0) return "none";
  if (attempted <= 5) return "early";
  if (attempted <= 14) return "emerging";
  if (attempted <= 29) return "strong";
  return "established";
}
function calculateMechanicalEvidence(session: AssessmentSession, responses: AssessmentResponse[]): CompetencyEvidence[] {
  const subs: MechanicalSubcompetency[] = ["hydraulics", "gears", "pulleys", "levers"];
  return subs.map((subcompetency) => {
    const questionIds = new Set(mechanicalQuestions.filter((q) => q.subcompetency === subcompetency).map((q) => q.questionId));
    const subResponses = responses.filter((r) => questionIds.has(r.questionId));
    const attempted = subResponses.length;
    const correct = subResponses.filter((r) => r.correct).length;
    return { evidenceId: id("evidence"), domain: "mechanical", subcompetency, attempted, correct, accuracy: attempted ? correct / attempted : 0, evidenceStrength: evidenceStrength(attempted), sourceSessionId: session.sessionId, updatedAt: now() };
  });
}
function ev(evidence: CompetencyEvidence[], sub: MechanicalSubcompetency) { return evidence.find((item) => item.subcompetency === sub)!; }
function hasHydraulicsSpecificConstraint(evidence: CompetencyEvidence[]) {
  const h = ev(evidence, "hydraulics");
  const otherAvg = (ev(evidence, "gears").accuracy + ev(evidence, "pulleys").accuracy + ev(evidence, "levers").accuracy) / 3;
  return h.attempted >= 6 && h.accuracy <= 0.5 && otherAvg >= 0.6;
}
function hasBroadMechanicalConstraint(evidence: CompetencyEvidence[]) {
  return ["hydraulics", "gears", "pulleys", "levers"].every((sub) => ev(evidence, sub as MechanicalSubcompetency).accuracy <= 0.5);
}

type AdvisorDecisionPackage = { observations: Observation[]; constraints: PreparationConstraint[]; recommendations: Recommendation[]; whyExplanations: WhyExplanation[]; readinessSnapshots: ReadinessSnapshot[]; milestones: Milestone[]; dashboardState: DashboardState };

function commonMilestones(): Milestone[] {
  return [
    { milestoneId: id("milestone"), type: "starting_point_established", label: "Starting point established", createdAt: now() },
    { milestoneId: id("milestone"), type: "first_focus_identified", label: "First preparation focus identified", createdAt: now() },
  ];
}
function makeReadiness(label = "Early evidence — readiness not yet assessed", explanation = "Your starting point assessment has identified an initial preparation focus, but readiness requires more evidence over time."): ReadinessSnapshot {
  return { readinessSnapshotId: id("readiness"), state: "early_evidence", label, explanation, confidence: "high", createdAt: now() };
}
function runBaselineAdvisorRules(evidence: CompetencyEvidence[]): AdvisorDecisionPackage {
  if (hasBroadMechanicalConstraint(evidence)) return createBroadMechanicalDecision(evidence);
  if (hasHydraulicsSpecificConstraint(evidence)) return createHydraulicSpecificDecision(evidence);
  return createNoClearDecision(evidence);
}
function createHydraulicSpecificDecision(evidence: CompetencyEvidence[]): AdvisorDecisionPackage {
  const h = ev(evidence, "hydraulics");
  const observation: Observation = { observationId: id("obs"), title: "Hydraulic-force reasoning stood out", summary: "Hydraulic-force reasoning appears to be the clearest preparation focus from this starting point assessment.", evidenceIds: evidence.map((e) => e.evidenceId), confidence: "moderate", createdAt: now() };
  const constraint: PreparationConstraint = { constraintId: id("constraint"), constraintType: "foundation_knowledge", domain: "mechanical", subcompetency: "hydraulics", status: "identified", confidence: "moderate", observationId: observation.observationId, createdAt: now(), updatedAt: now() };
  const why: WhyExplanation = { whyExplanationId: id("why"), title: "Why Hydraulic Fundamentals is recommended", observation: "Hydraulic-force reasoning stood out as the clearest preparation focus in your starting point assessment.", evidence: `You answered ${h.correct} of ${h.attempted} hydraulic questions correctly. Your gears, pulleys and levers results were stronger.`, interpretation: "This suggests hydraulics may be a specific mechanical reasoning constraint rather than a broad mechanical reasoning issue.", recommendation: "Hydraulic Fundamentals is recommended because it targets pressure transfer, piston size, force multiplication and movement direction.", confidence: "Moderate. This is enough evidence to guide a first preparation step, but not enough to judge overall readiness.", createdAt: now() };
  const rec: Recommendation = { recommendationId: id("rec"), recommendationType: "start_hydraulic_fundamentals", title: "Start Hydraulic Fundamentals", summary: "Build the foundation concepts behind pressure transfer, piston size, force multiplication and movement direction.", actionLabel: "Start Hydraulic Fundamentals", confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness = makeReadiness();
  const milestones = commonMilestones();
  return { observations: [observation], constraints: [constraint], recommendations: [rec], whyExplanations: [why], readinessSnapshots: [readiness], milestones, dashboardState: { dashboardStateId: id("dash"), currentRecommendationId: rec.recommendationId, currentFocusLabel: "Hydraulic-force reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds: milestones.map((m) => m.milestoneId), baselineSummary: { mechanicalQuestionsCompleted: 20, focusArea: "Hydraulics" }, saveStatus: "local_only", updatedAt: now() } };
}
function createBroadMechanicalDecision(evidence: CompetencyEvidence[]): AdvisorDecisionPackage {
  const observation: Observation = { observationId: id("obs"), title: "Mechanical foundations need broader attention", summary: "The starting point evidence suggests this may not be isolated to one mechanical topic.", evidenceIds: evidence.map((e) => e.evidenceId), confidence: "moderate", createdAt: now() };
  const constraint: PreparationConstraint = { constraintId: id("constraint"), constraintType: "broad_foundation", domain: "mechanical", status: "identified", confidence: "moderate", observationId: observation.observationId, createdAt: now(), updatedAt: now() };
  const why: WhyExplanation = { whyExplanationId: id("why"), title: "Why Mechanical Foundations is recommended", observation: "Several mechanical reasoning areas appeared to need attention.", evidence: "Hydraulics, gears, pulleys and levers all showed limited correct responses in this starting point assessment.", interpretation: "This suggests a broader mechanical reasoning foundation may be more useful than focusing narrowly on hydraulics first.", recommendation: "Mechanical Foundations is recommended as the first preparation step.", confidence: "Moderate. This is a first diagnostic signal, not a readiness judgement.", createdAt: now() };
  const rec: Recommendation = { recommendationId: id("rec"), recommendationType: "start_mechanical_foundations", title: "Start Mechanical Foundations", summary: "Begin with a broader foundation across mechanical reasoning topics.", actionLabel: "Start Mechanical Foundations", confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness = makeReadiness();
  const milestones = commonMilestones();
  return { observations: [observation], constraints: [constraint], recommendations: [rec], whyExplanations: [why], readinessSnapshots: [readiness], milestones, dashboardState: { dashboardStateId: id("dash"), currentRecommendationId: rec.recommendationId, currentFocusLabel: "Mechanical foundations", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds: milestones.map((m) => m.milestoneId), baselineSummary: { mechanicalQuestionsCompleted: 20, focusArea: "Mechanical foundations" }, saveStatus: "local_only", updatedAt: now() } };
}
function createNoClearDecision(evidence: CompetencyEvidence[]): AdvisorDecisionPackage {
  const observation: Observation = { observationId: id("obs"), title: "No clear primary focus yet", summary: "FloSpatial does not yet have one clear preparation focus from this assessment alone.", evidenceIds: evidence.map((e) => e.evidenceId), confidence: "low", createdAt: now() };
  const constraint: PreparationConstraint = { constraintId: id("constraint"), constraintType: "insufficient_evidence", domain: "mechanical", status: "identified", confidence: "low", observationId: observation.observationId, createdAt: now(), updatedAt: now() };
  const why: WhyExplanation = { whyExplanationId: id("why"), title: "Why a follow-up diagnostic is recommended", observation: "The starting point assessment did not show one clear primary preparation focus.", evidence: "Your results were mixed, without a single mechanical area standing out strongly enough for a specific first module.", interpretation: "More evidence would help FloSpatial recommend the most useful next step.", recommendation: "A short follow-up diagnostic is recommended.", confidence: "Low to moderate. This is intentionally cautious because the evidence is not yet specific.", createdAt: now() };
  const rec: Recommendation = { recommendationId: id("rec"), recommendationType: "follow_up_diagnostic", title: "Complete a short follow-up diagnostic", summary: "Gather more evidence before choosing a narrow preparation focus.", actionLabel: "Start follow-up diagnostic", confidence: "low", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness = makeReadiness("Early evidence — focus not yet confirmed", "FloSpatial has recorded your starting point, but more evidence is needed before identifying a confident preparation focus.");
  const milestones = commonMilestones();
  return { observations: [observation], constraints: [constraint], recommendations: [rec], whyExplanations: [why], readinessSnapshots: [readiness], milestones, dashboardState: { dashboardStateId: id("dash"), currentRecommendationId: rec.recommendationId, currentFocusLabel: "Further diagnostic evidence", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds: milestones.map((m) => m.milestoneId), baselineSummary: { mechanicalQuestionsCompleted: 20 }, saveStatus: "local_only", updatedAt: now() } };
}
function completeMechanicalBaseline(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const evidence = calculateMechanicalEvidence(completedSession, responses);
  const decision = runBaselineAdvisorRules(evidence);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), competencyEvidence: [...journey.competencyEvidence, ...evidence], observations: [...journey.observations, ...decision.observations], constraints: [...journey.constraints, ...decision.constraints], recommendations: [...journey.recommendations, ...decision.recommendations], whyExplanations: [...journey.whyExplanations, ...decision.whyExplanations], readinessSnapshots: [...journey.readinessSnapshots, ...decision.readinessSnapshots], milestones: [...journey.milestones, ...decision.milestones], dashboardState: decision.dashboardState, updatedAt: now() };
}
function getCurrentRecommendation(journey: MvpGuestJourney) { return journey.recommendations.find((r) => r.recommendationId === journey.dashboardState?.currentRecommendationId); }
function getCurrentReadiness(journey: MvpGuestJourney) { return journey.readinessSnapshots.find((r) => r.readinessSnapshotId === journey.dashboardState?.readinessSnapshotId); }
function getCurrentWhy(journey: MvpGuestJourney) { const rec = getCurrentRecommendation(journey); return journey.whyExplanations.find((w) => w.whyExplanationId === rec?.whyExplanationId); }
function getRecentMilestones(journey: MvpGuestJourney) { const ids = new Set(journey.dashboardState?.recentMilestoneIds ?? []); return journey.milestones.filter((m) => ids.has(m.milestoneId)); }

function getCurrentHydraulicProgress(journey: MvpGuestJourney) {
  return journey.moduleProgress.find((progress) => progress.moduleId === "hydraulic_fundamentals" && !progress.completedAt);
}
function startHydraulicFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  if (getCurrentHydraulicProgress(journey)) return journey;
  const alreadyCompleted = journey.moduleCompletions.some((completion) => completion.moduleId === "hydraulic_fundamentals");
  if (alreadyCompleted) return journey;
  const progress: ModuleProgress = { moduleProgressId: id("module-progress"), moduleId: "hydraulic_fundamentals", currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  return { ...journey, moduleProgress: [...journey.moduleProgress, progress], updatedAt: now() };
}
function updateHydraulicProgress(journey: MvpGuestJourney, nextProgress: ModuleProgress): MvpGuestJourney {
  return { ...journey, moduleProgress: journey.moduleProgress.map((progress) => progress.moduleProgressId === nextProgress.moduleProgressId ? nextProgress : progress), updatedAt: now() };
}
function completeHydraulicFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  const activeProgress = getCurrentHydraulicProgress(journey);
  const completedAt = now();
  const completedProgress = activeProgress ? { ...activeProgress, currentSectionIndex: hydraulicFundamentalsModule.sections.length - 1, completedAt, updatedAt: completedAt } : undefined;
  const completion: ModuleCompletion = { moduleCompletionId: id("module-completion"), moduleId: "hydraulic_fundamentals", completedAt };
  const previousRecommendation = getCurrentRecommendation(journey);
  const previousWhyId = previousRecommendation?.whyExplanationId;
  const why: WhyExplanation = { whyExplanationId: id("why"), title: "Why Guided Hydraulic Practice is recommended", observation: "Hydraulic Fundamentals has been completed.", evidence: "You completed the module linked to your current hydraulic-force reasoning focus.", interpretation: "Follow-up practice is needed to see whether the earlier hydraulic constraint is improving.", recommendation: "Guided Hydraulic Practice is recommended as the next evidence check.", confidence: "High. Follow-up practice is the appropriate next step after targeted learning.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: "begin_guided_hydraulic_practice", title: "Begin Guided Hydraulic Practice", summary: "Check whether the hydraulic foundation concepts are beginning to transfer into practice.", actionLabel: "Begin Guided Practice", confidence: "high", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const updatedConstraints = journey.constraints.map((constraint) => constraint.subcompetency === "hydraulics" && constraint.status === "identified" ? { ...constraint, status: "under_review" as const, updatedAt: now() } : constraint);
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "early_evidence", label: "Early evidence — improvement not yet confirmed", explanation: "Hydraulic Fundamentals has been completed, but FloSpatial still needs practice evidence before judging whether the earlier constraint is improving.", confidence: "high", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "first_learning_action_completed", label: "Hydraulic Fundamentals completed", createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-5);
  return {
    ...journey,
    moduleProgress: completedProgress ? journey.moduleProgress.map((progress) => progress.moduleProgressId === completedProgress.moduleProgressId ? completedProgress : progress) : journey.moduleProgress,
    moduleCompletions: [...journey.moduleCompletions, completion],
    constraints: updatedConstraints,
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, milestone],
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Hydraulic-force reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}


function getBaselineHydraulicsEvidence(journey: MvpGuestJourney) {
  return [...journey.competencyEvidence].reverse().find((e) => e.subcompetency === "hydraulics");
}

function getCurrentGearProgress(journey: MvpGuestJourney) {
  return journey.moduleProgress.find((progress) => progress.moduleId === "gear_fundamentals" && !progress.completedAt);
}
function startGearFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  if (getCurrentGearProgress(journey)) return journey;
  const alreadyCompleted = journey.moduleCompletions.some((completion) => completion.moduleId === "gear_fundamentals");
  if (alreadyCompleted) return journey;
  const progress: ModuleProgress = { moduleProgressId: id("module-progress"), moduleId: "gear_fundamentals", currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  return { ...journey, moduleProgress: [...journey.moduleProgress, progress], updatedAt: now() };
}
function updateGearProgress(journey: MvpGuestJourney, nextProgress: ModuleProgress): MvpGuestJourney {
  return { ...journey, moduleProgress: journey.moduleProgress.map((progress) => progress.moduleProgressId === nextProgress.moduleProgressId ? nextProgress : progress), updatedAt: now() };
}
function completeGearFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  const activeProgress = getCurrentGearProgress(journey);
  const completedAt = now();
  const completedProgress = activeProgress ? { ...activeProgress, currentSectionIndex: gearFundamentalsModule.sections.length - 1, completedAt, updatedAt: completedAt } : undefined;
  const completion: ModuleCompletion = { moduleCompletionId: id("module-completion"), moduleId: "gear_fundamentals", completedAt };
  const previousRecommendation = getCurrentRecommendation(journey);
  const why: WhyExplanation = {
    whyExplanationId: id("why"),
    title: "Why Guided Gear Practice is recommended",
    observation: "Gear Fundamentals has been completed.",
    evidence: "You completed the module linked to the current gear-reasoning preparation focus.",
    interpretation: "Follow-up practice is needed to see whether gear direction, gear trains and gear-size concepts are beginning to transfer into problem-solving.",
    recommendation: "Guided Gear Practice is recommended as the next evidence check.",
    confidence: "High. Follow-up practice is the appropriate next step after targeted learning.",
    createdAt: now(),
  };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: "begin_guided_gear_practice", title: "Begin Guided Gear Practice", summary: "Check whether gear direction, idler and gear-size concepts transfer into practice.", actionLabel: "Begin Guided Gear Practice", confidence: "high", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const milestone: Milestone = { milestoneId: id("milestone"), type: "first_learning_action_completed", label: "Gear Fundamentals completed", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "developing_evidence", label: "Developing evidence — gear practice not yet checked", explanation: "Gear Fundamentals has been completed, but FloSpatial still needs practice evidence before judging whether the gear focus is improving.", confidence: "high", createdAt: now() };
  return {
    ...journey,
    moduleProgress: completedProgress ? journey.moduleProgress.map((progress) => progress.moduleProgressId === completedProgress.moduleProgressId ? completedProgress : progress) : journey.moduleProgress,
    moduleCompletions: [...journey.moduleCompletions, completion],
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, milestone],
    dashboardState: { dashboardStateId: id("dash"), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Gear reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds: [...(journey.dashboardState?.recentMilestoneIds ?? []).slice(-3), milestone.milestoneId], baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}


function getCurrentPulleyProgress(journey: MvpGuestJourney) {
  return journey.moduleProgress.find((progress) => progress.moduleId === "pulley_fundamentals" && !progress.completedAt);
}
function startPulleyFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  if (getCurrentPulleyProgress(journey)) return journey;
  const alreadyCompleted = journey.moduleCompletions.some((completion) => completion.moduleId === "pulley_fundamentals");
  if (alreadyCompleted) return journey;
  const progress: ModuleProgress = { moduleProgressId: id("module-progress"), moduleId: "pulley_fundamentals", currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  return { ...journey, moduleProgress: [...journey.moduleProgress, progress], updatedAt: now() };
}
function updatePulleyProgress(journey: MvpGuestJourney, nextProgress: ModuleProgress): MvpGuestJourney {
  return { ...journey, moduleProgress: journey.moduleProgress.map((progress) => progress.moduleProgressId === nextProgress.moduleProgressId ? nextProgress : progress), updatedAt: now() };
}
function completePulleyFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  const activeProgress = getCurrentPulleyProgress(journey);
  const completedAt = now();
  const completedProgress = activeProgress ? { ...activeProgress, currentSectionIndex: pulleyFundamentalsModule.sections.length - 1, completedAt, updatedAt: completedAt } : undefined;
  const completion: ModuleCompletion = { moduleCompletionId: id("module-completion"), moduleId: "pulley_fundamentals", completedAt };
  const previousRecommendation = getCurrentRecommendation(journey);
  const why: WhyExplanation = { whyExplanationId: id("why"), title: "Why Guided Pulley Practice is recommended", observation: "Pulley Fundamentals has been completed.", evidence: "You completed the foundation module covering fixed and movable pulleys, supporting strands, force and distance.", interpretation: "Guided diagram practice is the next useful step before support is reduced.", recommendation: "Guided Pulley Practice is recommended next.", confidence: "High. This is the planned next stage after the fundamentals module.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: "begin_guided_pulley_practice", title: "Begin Guided Pulley Practice", summary: "Apply the supporting-strand method to guided pulley diagrams.", actionLabel: "Begin Guided Pulley Practice", confidence: "high", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const milestone: Milestone = { milestoneId: id("milestone"), type: "first_learning_action_completed", label: "Pulley Fundamentals completed", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "developing_evidence", label: "Developing evidence — pulley practice not yet checked", explanation: "Pulley Fundamentals is complete, but practice evidence is still needed.", confidence: "high", createdAt: now() };
  return { ...journey, moduleProgress: completedProgress ? journey.moduleProgress.map((progress) => progress.moduleProgressId === completedProgress.moduleProgressId ? completedProgress : progress) : journey.moduleProgress, moduleCompletions: [...journey.moduleCompletions, completion], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Pulley reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds: [...(journey.dashboardState?.recentMilestoneIds ?? []).slice(-4), milestone.milestoneId], baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function calculatePulleySummary(session: AssessmentSession, responses: AssessmentResponse[], questions: MvpQuestion[], sessionType: PracticeSummary["sessionType"], categories: { concept: string; concepts: string[] }[]): PracticeSummary {
  const conceptBreakdown = categories.map((category) => {
    const ids = new Set(questions.filter((q) => category.concepts.includes(q.concept)).map((q) => q.questionId));
    const categoryResponses = responses.filter((r) => ids.has(r.questionId));
    const attempted = categoryResponses.length;
    const correct = categoryResponses.filter((r) => r.correct).length;
    return { concept: category.concept, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType, attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}

function completeGuidedPulleyPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculatePulleySummary(completedSession, responses, guidedPulleyPracticeQuestions, "guided_pulley_practice", [
    { concept: "recognition", concepts: ["fixed_pulley_direction", "fixed_vs_movable", "free_end"] },
    { concept: "strand_count", concepts: ["supporting_strands"] },
    { concept: "force_distance", concepts: ["force_calculation", "distance_tradeoff", "integrated"] },
  ]);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_pulley_independent_practice";
  let title = "Begin Independent Pulley Practice";
  let summaryText = "Apply the same pulley method across a larger set of less-supported diagrams.";
  let actionLabel = "Start independent practice";
  let interpretation = "The guided result is strong enough to reduce support and broaden the question set.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.5) { recommendationType = "continue_guided_pulley_practice"; title = "Continue Guided Pulley Practice"; summaryText = "Strengthen strand counting and force calculations before reducing support."; actionLabel = "Continue guided practice"; interpretation = "The core method is emerging, but more guided practice is useful before moving on."; }
  else if (summary.accuracy < 0.5) { recommendationType = "review_pulley_fundamentals"; title = "Review Pulley Fundamentals"; summaryText = "Revisit the support-strand method before continuing."; actionLabel = "Review Pulley Fundamentals"; interpretation = "The guided result suggests the core method is not yet secure enough for less-supported practice."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Guided Pulley Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `Accuracy ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one guided pulley set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.5 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for less support" : "Developing evidence — pulley method still consolidating", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: summary.accuracy >= 0.8 ? "pulley_improvement_signal" : "guided_pulley_practice_completed", label: summary.accuracy >= 0.8 ? "Pulley improvement signal detected" : "Guided Pulley Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Guided Pulley Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Guided pulley practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Pulley reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completePulleyIndependentPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculatePulleySummary(completedSession, responses, pulleyIndependentPracticeQuestions, "pulley_independent_practice", [
    { concept: "recognition", concepts: ["fixed_pulley_direction", "fixed_pulley_advantage", "fixed_vs_movable", "free_end", "same_tension", "anchor_point", "unusual_layout", "compound_system", "effort_direction", "comparison"] },
    { concept: "strand_count", concepts: ["supporting_strands"] },
    { concept: "force_distance", concepts: ["force_calculation", "load_calculation", "distance_tradeoff", "integrated"] },
  ]);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_pulley_assessment";
  let title = "Begin Pulley Check";
  let summaryText = "Check whether pulley reasoning remains stable without immediate feedback.";
  let actionLabel = "Start Pulley Check";
  let interpretation = "Independent practice is strong enough to move to an assessment-style check.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.6) { recommendationType = "continue_pulley_independent_practice"; title = "Continue Independent Pulley Practice"; summaryText = "Consolidate the weaker pulley patterns before the check."; actionLabel = "Continue independent practice"; interpretation = "The method is useful but not yet consistent enough for the check."; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_pulley_practice"; title = "Return to Guided Pulley Practice"; summaryText = "Restore the support-strand method with guided feedback before continuing independently."; actionLabel = "Start guided practice"; interpretation = "The less-supported set exposed a gap that guided practice can address more efficiently."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Independent Pulley Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `Accuracy ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one independent pulley set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for Pulley Check" : "Developing evidence — pulley practice continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "pulley_independent_practice_completed", label: "Independent Pulley Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Independent Pulley Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Independent pulley practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Pulley reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completePulleyAssessment(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculatePulleySummary(completedSession, responses, pulleyAssessmentQuestions, "pulley_assessment", [
    { concept: "recognition", concepts: ["system_recognition", "fixed_vs_movable", "anchor_point"] },
    { concept: "mechanical_advantage", concepts: ["supporting_strands"] },
    { concept: "force_distance", concepts: ["force", "distance", "integrated"] },
  ]);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "return_to_mixed_mechanical_practice";
  let title = "Return to Mixed Mechanical Practice";
  let summaryText = "Recheck pulley reasoning alongside gears, hydraulics and levers.";
  let actionLabel = "Start mixed practice";
  let currentFocus = "Mechanical reasoning integration";
  let interpretation = "The Pulley Check is strong enough to move back into mixed mechanical reasoning.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.6) { recommendationType = "continue_pulley_independent_practice"; title = "Target the Weakest Pulley Pattern"; summaryText = "Do another independent pulley set before repeating the check."; actionLabel = "Continue independent practice"; currentFocus = "Pulley reasoning"; interpretation = "The check showed useful learning, but one more consolidation step is appropriate."; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_pulley_practice"; title = "Return to Guided Pulley Practice"; summaryText = "Rebuild the pulley method with immediate feedback before another check."; actionLabel = "Start guided practice"; currentFocus = "Pulley reasoning"; interpretation = "The assessment-style check suggests the pulley method is not yet stable enough without support."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Pulley Check: ${summary.correct} of ${summary.attempted} correct.`, evidence: `Accuracy ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one short assessment-style pulley check.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — pulley pathway completed" : "Developing evidence — pulley pathway continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const completedMilestone: Milestone = { milestoneId: id("milestone"), type: "pulley_assessment_completed", label: "Pulley Check completed", createdAt: now() };
  const pathwayMilestone: Milestone | undefined = summary.accuracy >= 0.8 ? { milestoneId: id("milestone"), type: "pulley_pathway_completed", label: "Pulley pathway completed", createdAt: now() } : undefined;
  const newMilestones = pathwayMilestone ? [completedMilestone, pathwayMilestone] : [completedMilestone];
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Pulley Check complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Pulley Check: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const evidence: CompetencyEvidence = { evidenceId: id("evidence"), domain: "mechanical", subcompetency: "pulleys", attempted: summary.attempted, correct: summary.correct, accuracy: summary.accuracy, evidenceStrength: evidenceStrength(summary.attempted), sourceSessionId: sessionId, updatedAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), ...newMilestones.map((m) => m.milestoneId)].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], competencyEvidence: [...journey.competencyEvidence, evidence], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, ...newMilestones], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: currentFocus, readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function calculateGuidedPracticeSummary(session: AssessmentSession, responses: AssessmentResponse[]): PracticeSummary {
  const conceptBreakdown = [...new Set(guidedHydraulicPracticeQuestions.map((q) => q.concept))].map((concept) => {
    const questionIds = new Set(guidedHydraulicPracticeQuestions.filter((q) => q.concept === concept).map((q) => q.questionId));
    const conceptResponses = responses.filter((r) => questionIds.has(r.questionId));
    const attempted = conceptResponses.length;
    const correct = conceptResponses.filter((r) => r.correct).length;
    return { concept, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType: "guided_hydraulic_practice", attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}
function completeGuidedHydraulicPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateGuidedPracticeSummary(completedSession, responses);
  const baseline = getBaselineHydraulicsEvidence(journey);
  const baselineAccuracy = baseline?.accuracy ?? 0;
  const improvement = summary.accuracy - baselineAccuracy;

  let recommendationType: Recommendation["recommendationType"];
  let title: string;
  let summaryText: string;
  let actionLabel: string;
  let readinessLabel: string;
  let readinessExplanation: string;
  let constraintStatus: PreparationConstraint["status"];
  let whyTitle: string;
  let observation: string;
  let interpretation: string;
  let recommendationText: string;
  let confidenceText: string;
  let debriefSummary: string;
  let debriefInterpretation: string;
  const strongImprovement = baselineAccuracy <= 0.5 && summary.accuracy >= 0.8 && summary.attempted === 10;
  const moderateImprovement = improvement >= 0.2 && summary.accuracy < 0.8 && summary.accuracy > 0.5;

  if (strongImprovement) {
    recommendationType = "begin_mixed_mechanical_practice";
    title = "Begin Mixed Mechanical Practice";
    summaryText = "Check whether hydraulic reasoning stays stable when mixed with gears, pulleys and levers.";
    actionLabel = "Start Mixed Practice";
    readinessLabel = "Developing evidence";
    readinessExplanation = "FloSpatial is beginning to see a positive response to targeted hydraulic practice, but broader readiness still needs more evidence.";
    constraintStatus = "improving";
    whyTitle = "Why Mixed Mechanical Practice is recommended";
    observation = "Your hydraulic practice improved after completing Hydraulic Fundamentals.";
    interpretation = "This suggests the foundation concepts may be improving, but FloSpatial needs to check whether that improvement transfers into more realistic problems.";
    recommendationText = "Mixed Mechanical Practice is recommended to check whether the improvement remains stable alongside other mechanical topics.";
    confidenceText = "Moderate. The improvement is encouraging, but it is based on one guided practice set.";
    debriefSummary = "Your hydraulic practice improved strongly after completing Hydraulic Fundamentals.";
    debriefInterpretation = "This suggests the foundation module may have addressed part of the earlier hydraulic-force reasoning constraint. The next useful step is to mix hydraulic items with other mechanical topics.";
  } else if (moderateImprovement) {
    recommendationType = "continue_guided_hydraulic_practice";
    title = "Continue Guided Hydraulic Practice";
    summaryText = "Strengthen the hydraulic foundations before moving into applied hydraulic problems.";
    actionLabel = "Continue Guided Practice";
    readinessLabel = "Developing evidence";
    readinessExplanation = "Your results are moving in a positive direction, but more guided evidence is useful before moving into applied problems.";
    constraintStatus = "improving";
    whyTitle = "Why continued guided practice is recommended";
    observation = "Your hydraulic-force reasoning is showing early improvement.";
    interpretation = "The direction is positive, but the result is not yet stable enough to move confidently into applied hydraulic problems.";
    recommendationText = "Continue Guided Hydraulic Practice is recommended to strengthen the foundation before applied practice.";
    confidenceText = "Moderate. Current evidence suggests improvement, but more guided practice is still useful.";
    debriefSummary = "Your hydraulic-force reasoning is showing early improvement.";
    debriefInterpretation = "This is a positive direction, but more guided practice is recommended before moving into applied hydraulic problems.";
  } else {
    recommendationType = "review_hydraulic_fundamentals";
    title = "Review Hydraulic Fundamentals";
    summaryText = "Reinforce pressure transfer, piston size and movement-direction concepts before moving forward.";
    actionLabel = "Review Hydraulic Fundamentals";
    readinessLabel = "Early evidence — improvement not yet confirmed";
    readinessExplanation = "Current practice evidence does not yet show a clear improvement signal, so readiness should not be inferred.";
    constraintStatus = "active";
    whyTitle = "Why reviewing Hydraulic Fundamentals is recommended";
    observation = "Follow-up practice does not yet show a clear improvement signal.";
    interpretation = "This suggests the foundation concepts may need more reinforcement before moving into applied problems.";
    recommendationText = "Review Hydraulic Fundamentals and complete additional guided examples.";
    confidenceText = "Moderate. This is a cautious recommendation based on the current practice result.";
    debriefSummary = "Current evidence does not yet show clear improvement in hydraulic-force reasoning.";
    debriefInterpretation = "This suggests the hydraulic concepts may need more reinforcement before moving into applied problems.";
  }

  const evidenceText = `Starting point hydraulics: ${baseline?.correct ?? 0} of ${baseline?.attempted ?? 0}. Guided Hydraulic Practice: ${summary.correct} of ${summary.attempted}.`;
  const why: WhyExplanation = { whyExplanationId: id("why"), title: whyTitle, observation, evidence: evidenceText, interpretation, recommendation: recommendationText, confidence: confidenceText, createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const updatedConstraints = journey.constraints.map((constraint) => constraint.subcompetency === "hydraulics" ? { ...constraint, status: constraintStatus, updatedAt: now() } : constraint);
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: recommendationType === "review_hydraulic_fundamentals" ? "early_evidence" : "developing_evidence", label: readinessLabel, explanation: readinessExplanation, confidence: "high", createdAt: now() };
  const guidedMilestone: Milestone = { milestoneId: id("milestone"), type: "guided_hydraulic_practice_completed", label: "Guided Hydraulic Practice completed", createdAt: now() };
  const improvementMilestone: Milestone | null = recommendationType !== "review_hydraulic_fundamentals" ? { milestoneId: id("milestone"), type: "first_improvement_signal", label: recommendationType === "begin_mixed_mechanical_practice" ? "First improvement signal detected" : "Early improvement signal detected", createdAt: now() } : null;
  const newMilestones = improvementMilestone ? [guidedMilestone, improvementMilestone] : [guidedMilestone];
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Guided practice complete", summary: debriefSummary, comparison: evidenceText, interpretation: debriefInterpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), ...newMilestones.map((m) => m.milestoneId)].slice(-6);
  return {
    ...journey,
    sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s),
    practiceSummaries: [...journey.practiceSummaries, summary],
    debriefs: [...journey.debriefs, debrief],
    constraints: updatedConstraints,
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, ...newMilestones],
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: recommendationType === "begin_mixed_mechanical_practice" ? "Mechanical reasoning integration" : "Hydraulic-force reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}

function calculateMixedPracticeSummary(session: AssessmentSession, responses: AssessmentResponse[]): PracticeSummary {
  const subcompetencies: MechanicalSubcompetency[] = ["hydraulics", "gears", "pulleys", "levers"];
  const conceptBreakdown = subcompetencies.map((subcompetency) => {
    const questionIds = new Set(mixedMechanicalPracticeQuestions.filter((q) => q.subcompetency === subcompetency).map((q) => q.questionId));
    const subResponses = responses.filter((r) => questionIds.has(r.questionId));
    const attempted = subResponses.length;
    const correct = subResponses.filter((r) => r.correct).length;
    return { concept: subcompetency, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType: "mixed_mechanical_practice", attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}


function calculateGuidedGearPracticeSummary(session: AssessmentSession, responses: AssessmentResponse[]): PracticeSummary {
  const conceptBreakdown = [...new Set(guidedGearPracticeQuestions.map((q) => q.concept))].map((concept) => {
    const questionIds = new Set(guidedGearPracticeQuestions.filter((q) => q.concept === concept).map((q) => q.questionId));
    const conceptResponses = responses.filter((r) => questionIds.has(r.questionId));
    const attempted = conceptResponses.length;
    const correct = conceptResponses.filter((r) => r.correct).length;
    return { concept, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType: "guided_gear_practice", attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}

function completeGuidedGearPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateGuidedGearPracticeSummary(completedSession, responses);
  const previousRecommendation = getCurrentRecommendation(journey);
  const previousRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let title = "Guided Gear Practice complete";
  let debriefSummary = "Gear practice evidence has been added to your preparation journey.";
  let interpretation = "FloSpatial has enough early gear-practice evidence to update your next step.";
  let recommendationType: Recommendation["recommendationType"] = "return_to_mixed_mechanical_practice";
  let recommendationTitle = "Return to Mixed Mechanical Practice";
  let recommendationSummary = "Recheck whether gear reasoning remains stable when mixed with hydraulics, pulleys and levers.";
  let actionLabel = "Start mixed practice";
  let currentFocus = "Mechanical reasoning integration";
  let readinessLabel = "Developing evidence — gear practice checked";
  let readinessExplanation = "Gear Fundamentals has now been followed by guided practice. FloSpatial can start checking whether gear reasoning remains stable in mixed mechanical practice.";
  let whyObservation = "Guided Gear Practice showed consistent gear reasoning.";
  let whyInterpretation = "This suggests the gear foundation concepts are beginning to transfer into practice. The next useful evidence check is mixed mechanical practice.";

  if (summary.accuracy >= 0.8) {
    recommendationType = "begin_gear_independent_practice";
    recommendationTitle = "Begin Independent Gear Practice";
    recommendationSummary = "Apply the same gear concepts across a larger set of less-supported diagrams before the Gear Check.";
    actionLabel = "Start independent practice";
    currentFocus = "Gear reasoning";
    readinessLabel = "Developing evidence — ready for independent practice";
    readinessExplanation = "Guided practice was strong enough to move into a larger bank of less-supported gear problems.";
    debriefSummary = "Gear-direction, idler and gear-speed reasoning appeared consistent during guided practice.";
    interpretation = "This is an encouraging practice signal. The next step is independent practice with immediate answer feedback but without guided diagram cues.";
    whyObservation = "Guided Gear Practice showed consistent gear reasoning.";
    whyInterpretation = "This suggests the core gear concepts are ready to be applied across a broader, less-supported practice bank before the Gear Check.";
  } else if (summary.accuracy >= 0.5) {
    recommendationType = "continue_guided_gear_practice";
    recommendationTitle = "Continue Guided Gear Practice";
    recommendationSummary = "Strengthen gear direction, idler and gear-size reasoning before returning to mixed mechanical practice.";
    actionLabel = "Continue gear practice";
    currentFocus = "Gear reasoning";
    readinessLabel = "Developing evidence — gear reasoning improving";
    readinessExplanation = "Guided practice suggests gear reasoning is improving, but more practice may be useful before returning to mixed mechanical practice.";
    debriefSummary = "Gear reasoning is showing useful practice evidence, but consistency is still developing.";
    interpretation = "The direction is positive, but gear trains, idlers or speed relationships may still need further guided practice.";
    whyObservation = "Guided Gear Practice showed partial improvement.";
    whyInterpretation = "This suggests the concepts are developing, but more guided practice is likely to improve consistency before mixed practice.";
  } else {
    recommendationType = "review_gear_fundamentals";
    recommendationTitle = "Review Gear Fundamentals";
    recommendationSummary = "Revisit gear direction, idler gears and gear-size concepts before repeating guided gear practice.";
    actionLabel = "Review Gear Fundamentals";
    currentFocus = "Gear reasoning";
    readinessLabel = "Early evidence — gear improvement not yet confirmed";
    readinessExplanation = "Gear Fundamentals has been completed, but guided practice has not yet shown stable improvement.";
    debriefSummary = "Gear reasoning remains an active preparation focus.";
    interpretation = "This does not mean the learning was wasted. It means the gear concepts likely need more reinforcement before moving forward.";
    whyObservation = "Guided Gear Practice did not yet show a clear improvement signal.";
    whyInterpretation = "This suggests the next step is to reinforce the foundation concepts before trying mixed practice again.";
  }

  const why: WhyExplanation = {
    whyExplanationId: id("why"),
    title: `Why ${recommendationTitle} is recommended`,
    observation: whyObservation,
    evidence: `Guided Gear Practice: ${summary.correct} of ${summary.attempted}.`,
    interpretation: whyInterpretation,
    recommendation: `${recommendationTitle} is recommended as the next step.`,
    confidence: "Moderate. This recommendation is based on one guided gear practice session.",
    createdAt: now(),
  };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title: recommendationTitle, summary: recommendationSummary, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy < 0.5 ? "early_evidence" : "developing_evidence", label: readinessLabel, explanation: readinessExplanation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: summary.accuracy >= 0.8 ? "gear_improvement_signal" : "guided_gear_practice_completed", label: summary.accuracy >= 0.8 ? "Gear improvement signal detected" : "Guided Gear Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title, summary: debriefSummary, comparison: `Guided Gear Practice: ${summary.correct} of ${summary.attempted}`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-6);
  return {
    ...journey,
    sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s),
    practiceSummaries: [...journey.practiceSummaries, summary],
    debriefs: [...journey.debriefs, debrief],
    recommendations: [...previousRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, milestone],
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: currentFocus, readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}



function calculateGearIndependentPracticeSummary(session: AssessmentSession, responses: AssessmentResponse[]): PracticeSummary {
  const categories = [
    { concept: "direction", concepts: ["direct_mesh_direction", "three_gear_direction", "four_gear_direction", "five_gear_direction", "six_gear_direction", "middle_driver_direction", "idler_effect"] },
    { concept: "speed", concepts: ["small_to_large_speed", "large_to_small_speed", "equal_size_speed", "relative_speed", "fastest_gear", "slowest_gear"] },
    { concept: "ratios", concepts: ["simple_ratio", "direction_and_speed", "idler_ratio"] },
  ];
  const conceptBreakdown = categories.map((category) => {
    const questionIds = new Set(gearIndependentPracticeQuestions.filter((q) => category.concepts.includes(q.concept)).map((q) => q.questionId));
    const categoryResponses = responses.filter((r) => questionIds.has(r.questionId));
    const attempted = categoryResponses.length;
    const correct = categoryResponses.filter((r) => r.correct).length;
    return { concept: category.concept, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType: "gear_independent_practice", attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}

function completeGearIndependentPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateGearIndependentPracticeSummary(completedSession, responses);
  const weakest = [...summary.conceptBreakdown].sort((a, b) => a.accuracy - b.accuracy)[0];
  const weakestLabel = weakest?.concept === "direction" ? "gear direction" : weakest?.concept === "speed" ? "relative speed" : "ratios and combined reasoning";

  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);

  let recommendationType: Recommendation["recommendationType"] = "begin_gear_assessment";
  let recommendationTitle = "Take the Gear Check";
  let recommendationSummary = "Test whether your gear reasoning holds up without immediate answer feedback.";
  let actionLabel = "Start Gear Check";
  let readinessLabel = "Developing evidence — ready for a gear check";
  let readinessExplanation = "Independent practice was strong enough to justify an assessment-style check.";
  let debriefSummary = "Your gear reasoning was consistent across a broader independent practice set.";
  let interpretation = "This is good practice evidence. The next useful step is a short Gear Check with no immediate feedback, so the result reflects more independent performance.";
  let whyObservation = "Independent Gear Practice showed consistent reasoning across direction, speed and ratio problems.";
  let whyInterpretation = "The broader practice result is strong enough to move to a short assessment-style check.";

  if (summary.accuracy < 0.8 && summary.accuracy >= 0.6) {
    recommendationType = "continue_gear_independent_practice";
    recommendationTitle = "Continue Independent Gear Practice";
    recommendationSummary = `Do another practice set, with extra attention to ${weakestLabel}, before taking the Gear Check.`;
    actionLabel = "Continue independent practice";
    readinessLabel = "Developing evidence — consolidate before the check";
    readinessExplanation = "Independent practice showed useful progress, but one area is not yet consistent enough for the Gear Check.";
    debriefSummary = "Your independent gear practice showed useful progress, but consistency is still developing.";
    interpretation = `The weakest area was ${weakestLabel}. Another practice session is more useful than moving immediately into the Gear Check.`;
    whyObservation = `Independent Gear Practice was partly successful, with the weakest evidence in ${weakestLabel}.`;
    whyInterpretation = "A further independent practice set should strengthen the specific pattern before the assessment-style check.";
  } else if (summary.accuracy < 0.6) {
    recommendationType = "continue_guided_gear_practice";
    recommendationTitle = "Return to Guided Gear Practice";
    recommendationSummary = `Rebuild ${weakestLabel} with guided feedback before returning to independent practice.`;
    actionLabel = "Return to guided gear practice";
    readinessLabel = "Early evidence — more guided consolidation needed";
    readinessExplanation = "The independent practice result suggests that the gear concepts need more supported consolidation before the Gear Check.";
    debriefSummary = "The larger practice set exposed some gear patterns that are not yet stable.";
    interpretation = `The weakest area was ${weakestLabel}. Returning briefly to guided practice is more useful than simply repeating the independent set.`;
    whyObservation = `Independent Gear Practice showed the weakest evidence in ${weakestLabel}.`;
    whyInterpretation = "The next useful step is supported practice on the unstable pattern before another independent attempt.";
  }

  const why: WhyExplanation = {
    whyExplanationId: id("why"),
    title: `Why ${recommendationTitle} is recommended`,
    observation: whyObservation,
    evidence: `Independent Gear Practice: ${summary.correct} of ${summary.attempted}.`,
    interpretation: whyInterpretation,
    recommendation: `${recommendationTitle} is recommended as the next step.`,
    confidence: "Moderate. This recommendation is based on one independent gear practice session.",
    createdAt: now(),
  };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title: recommendationTitle, summary: recommendationSummary, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy < 0.6 ? "early_evidence" : "developing_evidence", label: readinessLabel, explanation: readinessExplanation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "gear_independent_practice_completed", label: "Independent Gear Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Independent Gear Practice complete", summary: debriefSummary, comparison: `${summary.correct} of ${summary.attempted} correct`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);

  return {
    ...journey,
    sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s),
    practiceSummaries: [...journey.practiceSummaries, summary],
    debriefs: [...journey.debriefs, debrief],
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, milestone],
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Gear reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}

function calculateGearAssessmentSummary(session: AssessmentSession, responses: AssessmentResponse[]): PracticeSummary {
  const categories = [
    { concept: "direction", concepts: ["direct_mesh_direction", "three_gear_direction", "four_gear_direction", "idler_effect"] },
    { concept: "speed", concepts: ["small_to_large_speed", "large_to_small_speed"] },
    { concept: "ratios", concepts: ["simple_ratio", "direction_and_speed", "idler_ratio"] },
  ];
  const conceptBreakdown = categories.map((category) => {
    const questionIds = new Set(gearAssessmentQuestions.filter((q) => category.concepts.includes(q.concept)).map((q) => q.questionId));
    const categoryResponses = responses.filter((r) => questionIds.has(r.questionId));
    const attempted = categoryResponses.length;
    const correct = categoryResponses.filter((r) => r.correct).length;
    return { concept: category.concept, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType: "gear_assessment", attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}

function completeGearAssessment(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateGearAssessmentSummary(completedSession, responses);
  const weakest = [...summary.conceptBreakdown].sort((a, b) => a.accuracy - b.accuracy)[0];
  const weakestLabel = weakest?.concept === "direction" ? "gear direction" : weakest?.concept === "speed" ? "relative speed" : "gear ratios";

  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);

  let recommendationType: Recommendation["recommendationType"] = "return_to_mixed_mechanical_practice";
  let recommendationTitle = "Return to Mixed Mechanical Practice";
  let recommendationSummary = "Recheck gear reasoning alongside hydraulics, pulleys and levers.";
  let actionLabel = "Start mixed practice";
  let currentFocus = "Mechanical reasoning integration";
  let readinessLabel = "Developing evidence — gear pathway completed";
  let readinessExplanation = "Your Gear Check was strong enough to move back into mixed mechanical practice.";
  let debriefTitle = "Gear Check complete";
  let debriefSummary = "Your gear reasoning held up under a less-supported, assessment-style check.";
  let interpretation = "This is good evidence that the core gear pathway has done its job. The next useful test is whether the skill remains available when gear questions are mixed with other mechanical topics.";
  let whyObservation = "The Gear Check showed consistent independent gear reasoning.";
  let whyInterpretation = "The result is strong enough to move from isolated gear practice back to mixed mechanical reasoning.";

  if (summary.accuracy < 0.8 && summary.accuracy >= 0.6) {
    recommendationType = "continue_gear_independent_practice";
    recommendationTitle = "Target the Weakest Gear Pattern";
    recommendationSummary = `Do another independent practice set, with extra attention to ${weakestLabel}, before repeating the Gear Check.`;
    actionLabel = "Continue independent practice";
    currentFocus = "Gear reasoning";
    readinessLabel = "Developing evidence — one more consolidation step";
    readinessExplanation = "The Gear Check showed useful learning, but one or two patterns are not yet consistent enough to close the pathway.";
    debriefSummary = "The Gear Check showed useful progress, but the result was not yet consistently strong.";
    interpretation = `The weakest area was ${weakestLabel}. A short targeted return to independent practice is more useful than simply repeating the same test immediately.`;
    whyObservation = `The Gear Check was partly successful, with the weakest evidence in ${weakestLabel}.`;
    whyInterpretation = "A brief targeted independent practice step should improve the specific pattern before another Gear Check.";
  } else if (summary.accuracy < 0.6) {
    recommendationType = "review_gear_fundamentals";
    recommendationTitle = "Review Gear Fundamentals";
    recommendationSummary = `Revisit the core gear method, especially ${weakestLabel}, before continuing.`;
    actionLabel = "Review Gear Fundamentals";
    currentFocus = "Gear reasoning";
    readinessLabel = "Early evidence — gear pathway not yet secure";
    readinessExplanation = "The Gear Check suggests the core method is not yet stable enough under assessment-style conditions.";
    debriefSummary = "The Gear Check exposed an active gear-reasoning gap.";
    interpretation = `The weakest area was ${weakestLabel}. Returning to the fundamentals is likely to be more efficient than adding more unsupported questions.`;
    whyObservation = `The Gear Check did not yet show stable independent gear reasoning, especially in ${weakestLabel}.`;
    whyInterpretation = "The next step should restore the core method before further assessment-style practice.";
  }

  const why: WhyExplanation = {
    whyExplanationId: id("why"),
    title: `Why ${recommendationTitle} is recommended`,
    observation: whyObservation,
    evidence: `Gear Check: ${summary.correct} of ${summary.attempted} correct.`,
    interpretation: whyInterpretation,
    recommendation: `${recommendationTitle} is recommended as the next step.`,
    confidence: "Moderate. This recommendation is based on one short assessment-style gear check.",
    createdAt: now(),
  };
  const recommendation: Recommendation = {
    recommendationId: id("rec"),
    recommendationType,
    title: recommendationTitle,
    summary: recommendationSummary,
    actionLabel,
    confidence: "moderate",
    whyExplanationId: why.whyExplanationId,
    status: "active",
    createdAt: now(),
  };
  const readiness: ReadinessSnapshot = {
    readinessSnapshotId: id("readiness"),
    state: summary.accuracy >= 0.8 ? "developing_evidence" : summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence",
    label: readinessLabel,
    explanation: readinessExplanation,
    confidence: "moderate",
    createdAt: now(),
  };
  const completedMilestone: Milestone = { milestoneId: id("milestone"), type: "gear_assessment_completed", label: "Gear Check completed", createdAt: now() };
  const pathwayMilestone: Milestone | undefined = summary.accuracy >= 0.8 ? { milestoneId: id("milestone"), type: "gear_pathway_completed", label: "Gear pathway completed", createdAt: now() } : undefined;
  const newMilestones = pathwayMilestone ? [completedMilestone, pathwayMilestone] : [completedMilestone];
  const debrief: Debrief = {
    debriefId: id("debrief"),
    sessionId,
    title: debriefTitle,
    summary: debriefSummary,
    comparison: `Gear Check: ${summary.correct} of ${summary.attempted} correct (${Math.round(summary.accuracy * 100)}%).`,
    interpretation,
    recommendationId: recommendation.recommendationId,
    confidence: "moderate",
    whyExplanationId: why.whyExplanationId,
    createdAt: now(),
  };
  const evidence: CompetencyEvidence = {
    evidenceId: id("evidence"),
    domain: "mechanical",
    subcompetency: "gears",
    attempted: summary.attempted,
    correct: summary.correct,
    accuracy: summary.accuracy,
    evidenceStrength: evidenceStrength(summary.attempted),
    sourceSessionId: sessionId,
    updatedAt: now(),
  };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), ...newMilestones.map((m) => m.milestoneId)].slice(-6);

  return {
    ...journey,
    sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s),
    practiceSummaries: [...journey.practiceSummaries, summary],
    debriefs: [...journey.debriefs, debrief],
    competencyEvidence: [...journey.competencyEvidence, evidence],
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, ...newMilestones],
    dashboardState: {
      ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }),
      currentRecommendationId: recommendation.recommendationId,
      currentFocusLabel: currentFocus,
      readinessSnapshotId: readiness.readinessSnapshotId,
      recentMilestoneIds,
      baselineSummary: journey.dashboardState?.baselineSummary,
      saveStatus: "local_only",
      updatedAt: now(),
    },
    updatedAt: now(),
  };
}

function completeMixedMechanicalPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateMixedPracticeSummary(completedSession, responses);
  const breakdown = summary.conceptBreakdown;
  const weakest = [...breakdown].sort((a, b) => a.accuracy - b.accuracy)[0];
  const focusMap: Record<string, { title: string; label: string; recommendationType: Recommendation["recommendationType"]; moduleTitle: string }> = {
    gears: { title: "Gear reasoning now appears to be the largest remaining preparation focus.", label: "Gear reasoning", recommendationType: "start_gear_fundamentals", moduleTitle: "Start Gear Fundamentals" },
    pulleys: { title: "Pulley reasoning now appears to be the largest remaining preparation focus.", label: "Pulley reasoning", recommendationType: "start_pulley_fundamentals", moduleTitle: "Start Pulley Fundamentals" },
    levers: { title: "Lever reasoning now appears to be the largest remaining preparation focus.", label: "Lever reasoning", recommendationType: "start_lever_fundamentals", moduleTitle: "Start Lever Fundamentals" },
    hydraulics: { title: "Hydraulic-force reasoning still needs reinforcement in mixed practice.", label: "Hydraulic-force reasoning", recommendationType: "review_hydraulic_fundamentals", moduleTitle: "Review Hydraulic Fundamentals" },
  };
  const noClearWeakness = summary.accuracy >= 0.9 && breakdown.every((item) => item.accuracy >= 0.8);
  const focus = noClearWeakness ? {
    title: "No specific mechanical weakness was identified in this mixed practice session.",
    label: "Structured mechanical foundations",
    recommendationType: "start_hydraulic_fundamentals" as Recommendation["recommendationType"],
    moduleTitle: "Continue with Hydraulic Fundamentals",
  } : (focusMap[weakest?.concept ?? "gears"] ?? focusMap.gears);
  const hydraulic = breakdown.find((item) => item.concept === "hydraulics");
  const evidenceText = breakdown.map((item) => `${item.concept[0].toUpperCase()}${item.concept.slice(1)}: ${item.correct} of ${item.attempted}`).join(". ");
  const why: WhyExplanation = noClearWeakness ? {
    whyExplanationId: id("why"),
    title: "Why structured mechanical foundations are recommended",
    observation: "No specific mechanical weakness was identified in this mixed practice session.",
    evidence: `Mixed Mechanical Practice evidence: ${evidenceText}.`,
    interpretation: "Your results were strong across hydraulics, gears, pulleys and levers. This recommendation is therefore a progression recommendation, not a weakness recommendation.",
    recommendation: "Hydraulic Fundamentals is suggested as the next structured learning module so the preparation journey can continue in an organised sequence.",
    confidence: "Moderate. The mixed practice result is encouraging, but one strong session is not enough for a broad readiness judgement.",
    createdAt: now(),
  } : {
    whyExplanationId: id("why"),
    title: `Why ${focus.moduleTitle} is recommended`,
    observation: hydraulic && hydraulic.accuracy >= 0.75 ? `Hydraulic reasoning remained relatively stable in mixed practice. ${focus.title}` : focus.title,
    evidence: `Mixed Mechanical Practice evidence: ${evidenceText}.`,
    interpretation: `This suggests the earlier hydraulic focus is no longer the only useful signal. FloSpatial is now using mixed mechanical evidence to identify the next preparation focus.`,
    recommendation: `${focus.moduleTitle} is recommended as the next step.`,
    confidence: "Moderate. This is based on one mixed practice session, so it is useful for guidance but not a full readiness judgement.",
    createdAt: now(),
  };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: focus.recommendationType, title: focus.moduleTitle, summary: noClearWeakness ? "No specific weakness was identified in mixed practice. This is suggested as the next structured learning step, not because hydraulics appears weak." : `Build the foundation concepts for ${focus.label.toLowerCase()} before the next mixed practice check.`, actionLabel: noClearWeakness ? "Start Hydraulic Fundamentals" : focus.moduleTitle, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "developing_evidence", label: "Developing evidence", explanation: "FloSpatial now has evidence from a mixed mechanical practice session and can begin identifying the next focus area, but broader readiness still requires more evidence.", confidence: "moderate", createdAt: now() };
  const completedMilestone: Milestone = { milestoneId: id("milestone"), type: "mixed_mechanical_practice_completed", label: "Mixed Mechanical Practice completed", createdAt: now() };
  const focusMilestone: Milestone = { milestoneId: id("milestone"), type: "second_focus_identified", label: noClearWeakness ? "No clear mechanical weakness identified" : `${focus.label} identified as next focus`, createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Mixed mechanical practice complete", summary: noClearWeakness ? "Your mixed mechanical practice was strong across all four areas. No specific mechanical weakness was identified in this session." : (hydraulic && hydraulic.accuracy >= 0.75 ? `Your hydraulic reasoning remained stable during mixed practice. ${focus.label} now appears to be the largest remaining preparation focus.` : `Mixed practice suggests ${focus.label.toLowerCase()} is the next useful focus.`), comparison: evidenceText, interpretation: noClearWeakness ? "FloSpatial is treating the next step as structured progression rather than remediation. Continuing with a fundamentals module keeps the preparation journey organised without implying a weakness." : `FloSpatial uses mixed practice to check whether improved areas stay stable while other mechanical topics are interleaved.`, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), completedMilestone.milestoneId, focusMilestone.milestoneId].slice(-7);
  return {
    ...journey,
    sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s),
    practiceSummaries: [...journey.practiceSummaries, summary],
    debriefs: [...journey.debriefs, debrief],
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, completedMilestone, focusMilestone],
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: focus.label, readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}

function getLatestDebrief(journey: MvpGuestJourney) {
  return journey.debriefs[journey.debriefs.length - 1];
}

type ResumeState = { screen: AppScreen; activeSessionId?: string; activeQuestionIndex: number };

function getResumeState(journey: MvpGuestJourney): ResumeState {
  const incompleteSession = [...journey.sessions].reverse().find((session) => !session.completedAt);
  if (incompleteSession) {
    const answered = journey.responses.filter((response) => response.sessionId === incompleteSession.sessionId).length;
    const screenBySessionType: Record<AssessmentSession["sessionType"], AppScreen> = {
      mechanical_starting_point: "mechanical-baseline-question",
      guided_hydraulic_practice: "guided-hydraulic-practice-question",
      mixed_mechanical_practice: "mixed-mechanical-practice-question",
      guided_gear_practice: "guided-gear-practice-question",
      gear_independent_practice: "gear-independent-practice-question",
      gear_assessment: "gear-assessment-question",
      guided_pulley_practice: "guided-pulley-practice-question",
      pulley_independent_practice: "pulley-independent-practice-question",
      pulley_assessment: "pulley-assessment-question",
    };
    return {
      screen: screenBySessionType[incompleteSession.sessionType],
      activeSessionId: incompleteSession.sessionId,
      activeQuestionIndex: Math.min(answered, Math.max(incompleteSession.questionIds.length - 1, 0)),
    };
  }
  if (journey.dashboardState) return { screen: "dashboard", activeQuestionIndex: 0 };
  if (journey.preparationContext) return { screen: "mechanical-baseline-intro", activeQuestionIndex: 0 };
  if (journey.selectedPathwayId) return { screen: "preparation-context", activeQuestionIndex: 0 };
  return { screen: "landing", activeQuestionIndex: 0 };
}

function createDemoPreparationContext(): PreparationContext {
  return {
    assessmentTiming: "two_to_six_weeks",
    weeklyPrepTime: "three_to_five_hours",
    previousAttempt: "no",
    createdAt: now(),
  };
}

function getNonCorrectOptionId(question: MvpQuestion) {
  return question.options.find((option) => option.optionId !== question.correctOptionId)?.optionId ?? null;
}

function buildResponsesForTargetCounts(
  session: AssessmentSession,
  questions: MvpQuestion[],
  targetCorrectBySubcompetency: Partial<Record<MechanicalSubcompetency, number>>
): AssessmentResponse[] {
  const correctSoFar: Partial<Record<MechanicalSubcompetency, number>> = {};

  return questions.map((question, index) => {
    const targetCorrect = targetCorrectBySubcompetency[question.subcompetency] ?? 0;
    const currentCorrect = correctSoFar[question.subcompetency] ?? 0;
    const shouldAnswerCorrectly = currentCorrect < targetCorrect;

    if (shouldAnswerCorrectly) {
      correctSoFar[question.subcompetency] = currentCorrect + 1;
    }

    const selectedOptionId = shouldAnswerCorrectly
      ? question.correctOptionId
      : getNonCorrectOptionId(question);

    return createAssessmentResponse(
      session.sessionId,
      question,
      selectedOptionId,
      6500 + index * 180,
      false
    );
  });
}

function buildGuidedResponses(
  session: AssessmentSession,
  targetCorrect: number
): AssessmentResponse[] {
  return guidedHydraulicPracticeQuestions.map((question, index) => {
    const shouldAnswerCorrectly = index < targetCorrect;
    const selectedOptionId = shouldAnswerCorrectly
      ? question.correctOptionId
      : getNonCorrectOptionId(question);

    return createAssessmentResponse(
      session.sessionId,
      question,
      selectedOptionId,
      7200 + index * 220,
      false
    );
  });
}

function createHydraulicBaselineDemoJourney(): MvpGuestJourney {
  const session = createMechanicalBaselineSession();
  const responses = buildResponsesForTargetCounts(session, mechanicalQuestions, {
    hydraulics: 3,
    gears: 3,
    pulleys: 3,
    levers: 3,
  });

  const journey: MvpGuestJourney = {
    ...createEmptyMvpGuestJourney(),
    selectedPathwayId: "fire_service",
    preparationContext: createDemoPreparationContext(),
    sessions: [session],
    responses,
  };

  return completeMechanicalBaseline(journey, session.sessionId);
}

function createHydraulicModuleCompleteDemoJourney(): MvpGuestJourney {
  const baseline = createHydraulicBaselineDemoJourney();
  const started = startHydraulicFundamentals(baseline);
  return completeHydraulicFundamentals(started);
}

function createGuidedPracticeDemoJourney(targetCorrect: number): MvpGuestJourney {
  const moduleComplete = createHydraulicModuleCompleteDemoJourney();
  const session = createGuidedHydraulicPracticeSession();
  const responses = buildGuidedResponses(session, targetCorrect);

  const journeyWithPractice: MvpGuestJourney = {
    ...moduleComplete,
    sessions: [...moduleComplete.sessions, session],
    responses: [...moduleComplete.responses, ...responses],
    updatedAt: now(),
  };

  return completeGuidedHydraulicPractice(journeyWithPractice, session.sessionId);
}

function buildMixedResponsesWithGearFocus(session: AssessmentSession): AssessmentResponse[] {
  const targets: Partial<Record<MechanicalSubcompetency, number>> = {
    hydraulics: 4,
    gears: 2,
    pulleys: 4,
    levers: 4,
  };
  return buildResponsesForTargetCounts(session, mixedMechanicalPracticeQuestions, targets);
}

function createMixedGearFocusDemoJourney(): MvpGuestJourney {
  const strongGuided = createGuidedPracticeDemoJourney(9);
  const mixedRecommendationWhy: WhyExplanation = { whyExplanationId: id("why"), title: "Why Mixed Mechanical Practice is recommended", observation: "Hydraulic reasoning improved during guided practice.", evidence: "The demo journey includes a strong guided hydraulic practice result.", interpretation: "Mixed practice is now useful to check whether hydraulics remains stable alongside gears, pulleys and levers.", recommendation: "Begin Mixed Mechanical Practice.", confidence: "Moderate. This is a prototype testing shortcut.", createdAt: now() };
  const mixedRecommendation: Recommendation = { recommendationId: id("rec"), recommendationType: "begin_mixed_mechanical_practice", title: "Begin Mixed Mechanical Practice", summary: "Check whether hydraulic reasoning stays stable when mixed with gears, pulleys and levers.", actionLabel: "Start Mixed Practice", confidence: "moderate", whyExplanationId: mixedRecommendationWhy.whyExplanationId, status: "active", createdAt: now() };
  const withMixedRecommendation: MvpGuestJourney = {
    ...strongGuided,
    recommendations: [...strongGuided.recommendations.map((rec) => ({ ...rec, status: rec.status === "active" ? "completed" as const : rec.status })), mixedRecommendation],
    whyExplanations: [...strongGuided.whyExplanations, mixedRecommendationWhy],
    dashboardState: { ...(strongGuided.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: mixedRecommendation.recommendationId, currentFocusLabel: "Mechanical reasoning integration", updatedAt: now() },
  };
  const session = createMixedMechanicalPracticeSession();
  const responses = buildMixedResponsesWithGearFocus(session);
  return completeMixedMechanicalPractice({ ...withMixedRecommendation, sessions: [...withMixedRecommendation.sessions, session], responses: [...withMixedRecommendation.responses, ...responses] }, session.sessionId);
}


function createGearGuidedReadyDemoJourney(): MvpGuestJourney {
  return completeGearFundamentals(createMixedGearFocusDemoJourney());
}
function createGearGuidedStrongDemoJourney(): MvpGuestJourney {
  const ready = createGearGuidedReadyDemoJourney();
  const session = createGuidedGearPracticeSession();
  const responses = guidedGearPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 9 ? question.correctOptionId : question.options.find((o) => o.optionId !== question.correctOptionId)?.optionId ?? null, 18000 + index * 550, false));
  return completeGuidedGearPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
}

function createGearIndependentStrongDemoJourney(): MvpGuestJourney {
  const ready = createGearGuidedStrongDemoJourney();
  const session = createGearIndependentPracticeSession();
  const responses = gearIndependentPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 22 ? question.correctOptionId : getNonCorrectOptionId(question), 16000 + index * 430, false));
  return completeGearIndependentPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
}


function createPulleyGuidedReadyDemoJourney(): MvpGuestJourney {
  return completePulleyFundamentals(createMixedGearFocusDemoJourney());
}
function createPulleyGuidedStrongDemoJourney(): MvpGuestJourney {
  const ready = createPulleyGuidedReadyDemoJourney();
  const session = createGuidedPulleyPracticeSession();
  const responses = guidedPulleyPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 9 ? question.correctOptionId : getNonCorrectOptionId(question), 17000 + index * 500, false));
  return completeGuidedPulleyPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
}
function createPulleyIndependentStrongDemoJourney(): MvpGuestJourney {
  const ready = createPulleyGuidedStrongDemoJourney();
  const session = createPulleyIndependentPracticeSession();
  const responses = pulleyIndependentPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 22 ? question.correctOptionId : getNonCorrectOptionId(question), 15500 + index * 420, false));
  return completePulleyIndependentPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
}

function createTestScenarioJourney(scenario: TestScenario): MvpGuestJourney {
  switch (scenario) {
    case "hydraulic_module_complete":
      return createHydraulicModuleCompleteDemoJourney();
    case "guided_strong_improvement":
      return createGuidedPracticeDemoJourney(9);
    case "guided_moderate_improvement":
      return createGuidedPracticeDemoJourney(6);
    case "guided_no_clear_improvement":
      return createGuidedPracticeDemoJourney(3);
    case "mixed_gear_focus":
      return createMixedGearFocusDemoJourney();
    case "gear_guided_ready":
      return createGearGuidedReadyDemoJourney();
    case "gear_guided_strong":
      return createGearGuidedStrongDemoJourney();
    case "gear_independent_strong":
      return createGearIndependentStrongDemoJourney();
    case "pulley_guided_ready":
      return createPulleyGuidedReadyDemoJourney();
    case "pulley_guided_strong":
      return createPulleyGuidedStrongDemoJourney();
    case "pulley_independent_strong":
      return createPulleyIndependentStrongDemoJourney();
    case "hydraulic_baseline":
    default:
      return createHydraulicBaselineDemoJourney();
  }
}

function TestScenarioPanel({ onLoad }: { onLoad: (scenario: TestScenario) => void }) {
  const scenarios: { scenario: TestScenario; title: string; description: string }[] = [
    {
      scenario: "hydraulic_baseline",
      title: "Hydraulic weakness baseline",
      description: "Loads a starting point where hydraulics is the first recommended focus.",
    },
    {
      scenario: "hydraulic_module_complete",
      title: "After Hydraulic Fundamentals",
      description: "Loads a journey where the next step is Guided Hydraulic Practice.",
    },
    {
      scenario: "guided_strong_improvement",
      title: "Strong guided improvement",
      description: "Loads a journey where the next step is Mixed Mechanical Practice.",
    },
    {
      scenario: "mixed_gear_focus",
      title: "Mixed practice → Gear focus",
      description: "Loads a mixed mechanical result where Gear Fundamentals is recommended next.",
    },
    {
      scenario: "gear_guided_ready",
      title: "After Gear Fundamentals",
      description: "Loads a journey where Guided Gear Practice is recommended next.",
    },
    {
      scenario: "gear_guided_strong",
      title: "Strong guided gear practice",
      description: "Loads a journey where strong guided gear practice leads to Independent Gear Practice.",
    },
    {
      scenario: "gear_independent_strong",
      title: "Strong independent gear practice",
      description: "Loads a journey where independent gear practice is complete and the Gear Check is recommended next.",
    },
    {
      scenario: "pulley_guided_ready",
      title: "After Pulley Fundamentals",
      description: "Loads a journey where Guided Pulley Practice is recommended next.",
    },
    {
      scenario: "pulley_guided_strong",
      title: "Strong guided pulley practice",
      description: "Loads a journey where Independent Pulley Practice is recommended next.",
    },
    {
      scenario: "pulley_independent_strong",
      title: "Strong independent pulley practice",
      description: "Loads a journey where the Pulley Check is recommended next.",
    },
    {
      scenario: "guided_moderate_improvement",
      title: "Moderate guided improvement",
      description: "Loads a journey where continued guided practice is recommended.",
    },
    {
      scenario: "guided_no_clear_improvement",
      title: "No clear guided improvement",
      description: "Loads a journey where reviewing Hydraulic Fundamentals is recommended.",
    },
  ];

  return (
    <Card className="border-[#5ED3F3]/10 bg-[#121923]">
      <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Testing shortcuts</div>
      <h2 className="mt-3 text-2xl font-semibold">Load a demo journey</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9AA3B2]">
        These shortcuts are for prototype testing only. They let you jump to key advisor states without manually answering the same questions each time.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {scenarios.map((item) => (
          <button
            key={item.scenario}
            onClick={() => onLoad(item.scenario)}
            className="rounded-2xl border border-white/10 bg-[#111418] p-4 text-left transition hover:border-[#5ED3F3]/40 hover:bg-[#5ED3F3]/5"
          >
            <div className="font-semibold text-[#F4F6F8]">{item.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-[#8D98A6]">{item.description}</div>
          </button>
        ))}
      </div>
    </Card>
  );
}


function PrimaryButton({ children, onClick, disabled = false, className = "" }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return <button disabled={disabled} onClick={onClick} className={`rounded-xl border border-[#5ED3F3]/30 bg-[#5ED3F3]/10 px-6 py-4 font-medium text-[#D9F8FF] transition hover:border-[#5ED3F3]/60 hover:bg-[#5ED3F3]/15 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}>{children}</button>;
}
function SecondaryButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) { return <button onClick={onClick} className={`rounded-xl border border-white/10 px-6 py-4 font-medium text-[#C4CEDA] transition hover:text-[#F4F6F8] ${className}`}>{children}</button>; }
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <div className={`rounded-[28px] border border-white/5 bg-[#171C23] p-7 shadow-2xl shadow-black/10 ${className}`}>{children}</div>; }
function Shell({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) { return <main className="min-h-screen bg-[#111418] text-[#F4F6F8]"><header className="border-b border-white/5"><div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6"><div><div className="text-xl font-semibold tracking-wide">FloSpatial</div><div className="mt-1 text-xs tracking-[0.18em] text-[#6E7A88]">Preparation intelligence</div></div><div className="text-sm text-[#8D98A6]">{right ?? "Progress saved locally"}</div></div></header>{children}</main>; }
function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-[#5ED3F3]/20 bg-[#5ED3F3]/10 px-3 py-1 text-xs font-medium text-[#BFF3FF]">{children}</span>; }

function LandingScreen({ onBegin, onLoadTestScenario }: { onBegin: () => void; onLoadTestScenario: (scenario: TestScenario) => void }) { return <Shell><section className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-8 py-20"><div className="max-w-2xl"><Badge>No account or email required to begin</Badge><h1 className="mt-8 text-5xl font-semibold leading-tight tracking-tight md:text-6xl">Prepare smarter for selection assessments.</h1><p className="mt-8 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">FloSpatial helps you identify what to work on, why it matters, and what to do next.</p><div className="mt-12"><PrimaryButton onClick={onBegin}>Begin preparation</PrimaryButton></div></div><div className="mt-20 grid gap-5 md:grid-cols-3"><Card><h3 className="text-lg font-semibold">Find your focus</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">FloSpatial looks for the preparation area most likely to matter next.</p></Card><Card><h3 className="text-lg font-semibold">Understand why</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">Every major recommendation includes a clear explanation.</p></Card><Card><h3 className="text-lg font-semibold">Track progress</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">Your preparation journey is saved on this device.</p></Card></div>{SHOW_TEST_SCENARIOS && <div className="mt-10"><TestScenarioPanel onLoad={onLoadTestScenario} /></div>}</section></Shell>; }
function PathwaySelectionScreen({ onSelect }: { onSelect: () => void }) { return <Shell><section className="mx-auto max-w-5xl px-8 py-16"><h1 className="text-4xl font-semibold">Choose your preparation pathway</h1><p className="mt-5 max-w-2xl text-[#9AA3B2]">FloSpatial adapts recommendations to the type of selection assessment you are preparing for.</p><div className="mt-10 grid gap-5 md:grid-cols-2"><Card className="border-[#5ED3F3]/20"><div className="flex justify-between gap-4"><h2 className="text-2xl font-semibold">Fire Service</h2><Badge>Available</Badge></div><p className="mt-5 text-[#AAB4C0]">Mechanical, numerical and spatial reasoning preparation for Fire Service-style selection assessments.</p><div className="mt-8"><PrimaryButton onClick={onSelect}>Select Fire Service</PrimaryButton></div></Card>{["Military Aircrew", "Police Selection", "Defence Officer", "Emergency Services"].map((name) => <Card key={name} className="opacity-55"><div className="flex justify-between"><h2 className="text-xl font-semibold">{name}</h2><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#8D98A6]">Coming soon</span></div><p className="mt-5 text-sm text-[#8D98A6]">This pathway will be added later.</p></Card>)}</div><p className="mt-10 text-sm text-[#6E7A88]">FloSpatial is not affiliated with or endorsed by any specific employer, agency or selection body.</p></section></Shell>; }
function OptionGroup<T extends string>({ label, value, options, onChange }: { label: string; value?: T; options: { label: string; value: T }[]; onChange: (value: T) => void }) { return <div><div className="mb-3 text-sm font-medium text-[#C8D2DD]">{label}</div><div className="grid gap-3 sm:grid-cols-2">{options.map((o) => <button key={o.value} onClick={() => onChange(o.value)} className={`rounded-xl border p-4 text-left text-sm transition ${value === o.value ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10 text-[#E8FBFF]" : "border-white/10 bg-[#111418] text-[#AAB4C0] hover:border-white/20"}`}>{o.label}</button>)}</div></div>; }
function PreparationContextScreen({ onSave }: { onSave: (context: PreparationContext) => void }) {
  const [assessmentTiming, setAssessmentTiming] = useState<PreparationContext["assessmentTiming"]>();
  const [weeklyPrepTime, setWeeklyPrepTime] = useState<PreparationContext["weeklyPrepTime"]>();
  const [previousAttempt, setPreviousAttempt] = useState<PreparationContext["previousAttempt"]>();
  const [error, setError] = useState(false);
  return <Shell><section className="mx-auto max-w-3xl px-8 py-16"><Card><h1 className="text-4xl font-semibold">Tell us about your preparation</h1><p className="mt-5 text-[#9AA3B2]">This helps FloSpatial choose a realistic next step. You can begin without entering your name or email.</p><div className="mt-10 space-y-8"><OptionGroup label="When is your assessment?" value={assessmentTiming} onChange={setAssessmentTiming} options={[{ label: "I do not know yet", value: "unknown" }, { label: "Within 2 weeks", value: "within_2_weeks" }, { label: "2–6 weeks", value: "two_to_six_weeks" }, { label: "6–12 weeks", value: "six_to_twelve_weeks" }, { label: "More than 12 weeks", value: "more_than_twelve_weeks" }]} /><OptionGroup label="How much time can you usually prepare each week?" value={weeklyPrepTime} onChange={setWeeklyPrepTime} options={[{ label: "Less than 1 hour", value: "less_than_one_hour" }, { label: "1–2 hours", value: "one_to_two_hours" }, { label: "3–5 hours", value: "three_to_five_hours" }, { label: "More than 5 hours", value: "more_than_five_hours" }, { label: "Not sure", value: "not_sure" }]} /><OptionGroup label="Have you attempted a similar assessment before?" value={previousAttempt} onChange={setPreviousAttempt} options={[{ label: "No", value: "no" }, { label: "Yes", value: "yes" }, { label: "Prefer not to say", value: "prefer_not_to_say" }]} /></div>{error && <p className="mt-6 text-sm text-[#FFB3B3]">Please choose an option for each question before continuing.</p>}<div className="mt-10"><PrimaryButton onClick={() => { if (!assessmentTiming || !weeklyPrepTime || !previousAttempt) { setError(true); return; } onSave({ assessmentTiming, weeklyPrepTime, previousAttempt, createdAt: now() }); }}>Continue</PrimaryButton></div></Card></section></Shell>;
}
function BaselineIntroScreen({ onStart }: { onStart: () => void }) { return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Mechanical reasoning</p><h1 className="mt-5 text-4xl font-semibold">Starting Point Assessment</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">This first section looks at mechanical reasoning. FloSpatial will use your responses to identify an initial preparation focus.</p><p className="mx-auto mt-4 max-w-xl text-[#C8D2DD]">This is not a pass/fail test. It is used to guide your preparation.</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-4">{["20 questions", "No timer", "No account required", "No live score shown"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><div className="mt-10"><PrimaryButton onClick={onStart}>Start assessment</PrimaryButton></div></Card></section></Shell>; }
function MechanicalQuestionScreen({ journey, sessionId, questionIndex, onAnswer }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  useEffect(() => setStartedAt(Date.now()), [questionIndex]);
  const question = mechanicalQuestions[questionIndex];
  const progress = ((questionIndex + 1) / mechanicalQuestions.length) * 100;
  if (!question) return null;
  function answer(optionId: string | null, notSure = false) { onAnswer(createAssessmentResponse(sessionId, question, optionId, Date.now() - startedAt, notSure), questionIndex === mechanicalQuestions.length - 1); }
  const answered = journey.responses.filter((r) => r.sessionId === sessionId).length;
  return <Shell right="Starting point assessment"><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-8 flex items-end justify-between"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Starting Point Assessment</p><h1 className="mt-3 text-3xl font-semibold">Mechanical reasoning</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {mechanicalQuestions.length}<br /><span className="text-xs">{answered} saved</span></div></div><Card><p className="text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p><div className="mt-8 grid gap-4">{question.options.map((option) => <button key={option.optionId} onClick={() => answer(option.optionId)} className="rounded-2xl border border-white/10 bg-[#111418] p-5 text-left transition hover:border-[#5ED3F3]/40"><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div><div className="mt-7"><SecondaryButton onClick={() => answer(null, true)}>I'm not sure</SecondaryButton></div></Card></section></Shell>;
}
function AssessmentCompleteScreen({ onView }: { onView: () => void }) { return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><h1 className="text-4xl font-semibold">Starting point assessment complete</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">FloSpatial has reviewed your responses and prepared your first preparation insight.</p><div className="mt-10"><PrimaryButton onClick={onView}>View insight</PrimaryButton></div></Card></section></Shell>; }
function WhyModal({ why, onClose }: { why?: WhyExplanation; onClose: () => void }) { if (!why) return null; const sections = [["Observation", why.observation], ["Evidence", why.evidence], ["Interpretation", why.interpretation], ["Recommendation", why.recommendation], ["Confidence", why.confidence]]; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-[32px] border border-white/10 bg-[#171C23] p-8 shadow-2xl"><div className="flex items-start justify-between gap-6"><div><p className="text-xs uppercase tracking-[0.22em] text-[#6E7A88]">Why explanation</p><h2 className="mt-3 text-3xl font-semibold">{why.title}</h2></div><button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-[#8D98A6] hover:text-white">Close</button></div><div className="mt-8 space-y-6">{sections.map(([label, text]) => <div key={label} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">{label}</div><p className="mt-3 leading-relaxed text-[#C8D2DD]">{text}</p></div>)}</div><p className="mt-6 text-sm text-[#6E7A88]">FloSpatial uses this explanation to keep recommendations transparent and evidence-based.</p></div></div>; }
function FirstAdvisorInsightScreen({ journey, onWhy, onDashboard }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void }) { const rec = getCurrentRecommendation(journey); const focus = journey.dashboardState?.currentFocusLabel ?? "Preparation focus"; return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Your first preparation insight</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{focus === "Hydraulic-force reasoning" ? "Hydraulic-force reasoning currently appears to be your highest-value preparation focus." : rec?.recommendationType === "start_mechanical_foundations" ? "Mechanical reasoning foundations appear to need broader attention." : "FloSpatial does not yet have one clear preparation focus."}</h1><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>{rec?.confidence === "moderate" ? "Moderate confidence" : rec?.confidence === "high" ? "High confidence" : "Low confidence"}</Badge></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>; }
function DashboardScreen({ journey, onWhy, onReset, onStartHydraulics, onStartGuidedPractice, onStartMixedPractice, onStartGearFundamentals, onStartGuidedGearPractice, onStartGearIndependentPractice, onStartGearAssessment, onStartPulleyFundamentals, onStartGuidedPulleyPractice, onStartPulleyIndependentPractice, onStartPulleyAssessment, onLoadTestScenario }: { journey: MvpGuestJourney; onWhy: () => void; onReset: () => void; onStartHydraulics: () => void; onStartGuidedPractice: () => void; onStartMixedPractice: () => void; onStartGearFundamentals: () => void; onStartGuidedGearPractice: () => void; onStartGearIndependentPractice: () => void; onStartGearAssessment: () => void; onStartPulleyFundamentals: () => void; onStartGuidedPulleyPractice: () => void; onStartPulleyIndependentPractice: () => void; onStartPulleyAssessment: () => void; onLoadTestScenario: (scenario: TestScenario) => void }) {
  const rec = getCurrentRecommendation(journey);
  const readiness = getCurrentReadiness(journey);
  const milestones = getRecentMilestones(journey);
  const canStartHydraulics = rec?.recommendationType === "start_hydraulic_fundamentals";
  const canStartGuided = rec?.recommendationType === "begin_guided_hydraulic_practice" || rec?.recommendationType === "continue_guided_hydraulic_practice" || rec?.title?.toLowerCase().includes("guided hydraulic practice");
  const canStartMixed = rec?.recommendationType === "begin_mixed_mechanical_practice" || rec?.recommendationType === "return_to_mixed_mechanical_practice" || rec?.title?.toLowerCase().includes("mixed mechanical practice");
  const canStartGear = rec?.recommendationType === "start_gear_fundamentals" || rec?.recommendationType === "review_gear_fundamentals" || rec?.title?.toLowerCase().includes("gear fundamentals");
  const canStartGuidedGear = rec?.recommendationType === "begin_guided_gear_practice" || rec?.recommendationType === "continue_guided_gear_practice" || rec?.title?.toLowerCase().includes("guided gear practice");
  const canStartIndependentGear = rec?.recommendationType === "begin_gear_independent_practice" || rec?.recommendationType === "continue_gear_independent_practice" || rec?.title?.toLowerCase().includes("independent gear practice");
  const canStartGearAssessment = rec?.recommendationType === "begin_gear_assessment" || rec?.recommendationType === "repeat_gear_assessment" || rec?.actionLabel?.toLowerCase().includes("gear check");
  const canStartPulley = rec?.recommendationType === "start_pulley_fundamentals" || rec?.recommendationType === "review_pulley_fundamentals" || rec?.title?.toLowerCase().includes("pulley fundamentals");
  const canStartGuidedPulley = rec?.recommendationType === "begin_guided_pulley_practice" || rec?.recommendationType === "continue_guided_pulley_practice" || rec?.title?.toLowerCase().includes("guided pulley practice");
  const canStartIndependentPulley = rec?.recommendationType === "begin_pulley_independent_practice" || rec?.recommendationType === "continue_pulley_independent_practice" || rec?.title?.toLowerCase().includes("independent pulley practice");
  const canStartPulleyAssessment = rec?.recommendationType === "begin_pulley_assessment" || rec?.recommendationType === "repeat_pulley_assessment" || rec?.actionLabel?.toLowerCase().includes("pulley check");
  return <Shell><section className="mx-auto max-w-6xl px-8 py-12"><div className="mb-9"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Dashboard</p><h1 className="mt-3 text-4xl font-semibold">Your preparation cockpit</h1></div><div className="grid gap-5 lg:grid-cols-2"><Card className="lg:col-span-2"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-3xl font-semibold">{rec?.title}</h2><p className="mt-3 max-w-2xl text-[#AAB4C0]">{rec?.summary}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row">{canStartHydraulics ? <PrimaryButton onClick={onStartHydraulics}>Start module</PrimaryButton> : canStartGuided ? <PrimaryButton onClick={onStartGuidedPractice}>Begin practice</PrimaryButton> : canStartGear ? <PrimaryButton onClick={onStartGearFundamentals}>Start module</PrimaryButton> : canStartGuidedGear ? <PrimaryButton onClick={onStartGuidedGearPractice}>Begin guided practice</PrimaryButton> : canStartIndependentGear ? <PrimaryButton onClick={onStartGearIndependentPractice}>Start independent practice</PrimaryButton> : canStartGearAssessment ? <PrimaryButton onClick={onStartGearAssessment}>Start Gear Check</PrimaryButton> : canStartPulley ? <PrimaryButton onClick={onStartPulleyFundamentals}>Start module</PrimaryButton> : canStartGuidedPulley ? <PrimaryButton onClick={onStartGuidedPulleyPractice}>Begin guided practice</PrimaryButton> : canStartIndependentPulley ? <PrimaryButton onClick={onStartPulleyIndependentPractice}>Start independent practice</PrimaryButton> : canStartPulleyAssessment ? <PrimaryButton onClick={onStartPulleyAssessment}>Start Pulley Check</PrimaryButton> : canStartMixed ? <PrimaryButton onClick={onStartMixedPractice}>Start mixed practice</PrimaryButton> : <PrimaryButton disabled>{rec?.actionLabel} — coming soon</PrimaryButton>}<SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton></div></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Current focus</div><h3 className="mt-3 text-2xl font-semibold">{journey.dashboardState?.currentFocusLabel}</h3><p className="mt-3 text-[#9AA3B2]">This is the area FloSpatial currently recommends addressing next. If no clear weakness is identified, this may be a structured progression step rather than a weakness signal.</p></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Readiness snapshot</div><h3 className="mt-3 text-2xl font-semibold">{readiness?.label}</h3><p className="mt-3 text-[#9AA3B2]">{readiness?.explanation}</p></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recent progress</div><ul className="mt-4 space-y-3 text-[#C8D2DD]">{milestones.map((m) => <li key={m.milestoneId}>• {m.label}</li>)}</ul></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Starting point summary</div><p className="mt-4 text-[#C8D2DD]">{journey.dashboardState?.baselineSummary?.mechanicalQuestionsCompleted ?? 0} mechanical reasoning questions completed.</p>{journey.dashboardState?.baselineSummary?.focusArea && <p className="mt-3 text-[#9AA3B2]">Initial focus: {journey.dashboardState.baselineSummary.focusArea}</p>}</Card><Card className="lg:col-span-2"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Alpha pathway access</div><h3 className="mt-3 text-2xl font-semibold">Mechanical pathways</h3><p className="mt-3 max-w-3xl text-[#9AA3B2]">Direct access remains available while the pathways are being tested. These buttons do not change the current recommendation until a stage is completed.</p><p className="mt-3 text-xs text-[#6E7A88]">Build: {BUILD_LABEL}</p><div className="mt-7 rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-sm font-semibold text-[#D9F8FF]">Gear pathway</div><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><PrimaryButton onClick={onStartGearFundamentals}>Gear Fundamentals</PrimaryButton><SecondaryButton onClick={onStartGuidedGearPractice}>Guided Gear Practice</SecondaryButton><SecondaryButton onClick={onStartGearIndependentPractice}>Independent Gear Practice</SecondaryButton><SecondaryButton onClick={onStartGearAssessment}>Gear Check</SecondaryButton></div></div><div className="mt-4 rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-sm font-semibold text-[#D9F8FF]">Pulley pathway</div><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><PrimaryButton onClick={onStartPulleyFundamentals}>Pulley Fundamentals</PrimaryButton><SecondaryButton onClick={onStartGuidedPulleyPractice}>Guided Pulley Practice</SecondaryButton><SecondaryButton onClick={onStartPulleyIndependentPractice}>Independent Pulley Practice</SecondaryButton><SecondaryButton onClick={onStartPulleyAssessment}>Pulley Check</SecondaryButton></div></div></Card><Card className="lg:col-span-2"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Save status</div><p className="mt-4 text-[#C8D2DD]">Progress saved on this device.</p><p className="mt-3 text-[#9AA3B2]">You can continue without creating an account. A free username option can be added later for cross-device continuity.</p><div className="mt-7"><SecondaryButton onClick={onReset}>Reset local demo journey</SecondaryButton></div></Card>{SHOW_TEST_SCENARIOS && <div className="lg:col-span-2"><TestScenarioPanel onLoad={onLoadTestScenario} /></div>}</div></section></Shell>;
}

function HydraulicWorkedExampleDiagram() {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7">
      <div className="mb-5 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Worked example diagram</div>
      <svg viewBox="0 0 760 330" role="img" aria-label="Hydraulic jack diagram showing a small input piston transmitting pressure to a larger output piston" className="h-auto w-full">
        <defs>
          <marker id="arrowCyan" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5ED3F3" />
          </marker>
          <marker id="arrowSoft" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#D9F8FF" />
          </marker>
        </defs>

        <rect x="70" y="115" width="115" height="145" rx="14" fill="#171C23" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
        <rect x="95" y="142" width="65" height="28" rx="6" fill="#DDE3EA" />
        <rect x="112" y="55" width="31" height="88" rx="8" fill="#8D98A6" />
        <path d="M 127 35 L 127 92" stroke="#D9F8FF" strokeWidth="5" markerEnd="url(#arrowSoft)" />
        <text x="127" y="26" textAnchor="middle" fill="#D9F8FF" fontSize="18" fontWeight="600">Force applied</text>
        <text x="127" y="294" textAnchor="middle" fill="#AAB4C0" fontSize="17">Small input piston</text>

        <path d="M 185 222 H 515" stroke="#5ED3F3" strokeWidth="34" strokeLinecap="round" opacity="0.25" />
        <path d="M 190 222 H 505" stroke="#5ED3F3" strokeWidth="5" strokeDasharray="12 12" markerEnd="url(#arrowCyan)" />
        <text x="350" y="202" textAnchor="middle" fill="#D9F8FF" fontSize="18" fontWeight="600">Pressure path through fluid</text>

        <rect x="515" y="82" width="175" height="178" rx="18" fill="#171C23" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
        <rect x="548" y="126" width="110" height="42" rx="8" fill="#DDE3EA" />
        <rect x="580" y="50" width="48" height="78" rx="9" fill="#8D98A6" />
        <path d="M 604 119 L 604 60" stroke="#D9F8FF" strokeWidth="5" markerEnd="url(#arrowSoft)" />
        <text x="604" y="32" textAnchor="middle" fill="#D9F8FF" fontSize="18" fontWeight="600">Greater lifting force</text>
        <text x="604" y="294" textAnchor="middle" fill="#AAB4C0" fontSize="17">Large output piston</text>

        <text x="604" y="317" textAnchor="middle" fill="#5ED3F3" fontSize="16">Larger area → greater force</text>
        <text x="127" y="317" textAnchor="middle" fill="#6E7A88" fontSize="15">Longer input movement</text>
        <text x="604" y="76" textAnchor="middle" fill="#6E7A88" fontSize="15">Shorter output movement</text>
      </svg>
      <p className="mt-5 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">
        Same pressure acting over a larger area can produce greater output force. The tradeoff is that the larger piston usually moves a shorter distance.
      </p>
    </div>
  );
}

function HydraulicSolvingMethodDiagram() {
  const steps = [
    "Find input",
    "Trace pressure",
    "Compare sizes",
    "Predict output",
    "Check tradeoff",
  ];

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7">
      <div className="mb-5 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Solving method diagram</div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <svg viewBox="0 0 680 300" role="img" aria-label="Hydraulic solving method diagram with numbered callouts" className="h-auto w-full">
          <defs>
            <marker id="arrowMethod" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#5ED3F3" />
            </marker>
          </defs>

          <rect x="60" y="112" width="115" height="130" rx="14" fill="#171C23" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
          <rect x="88" y="134" width="59" height="26" rx="6" fill="#DDE3EA" />
          <rect x="104" y="58" width="30" height="78" rx="8" fill="#8D98A6" />
          <circle cx="62" cy="70" r="20" fill="#5ED3F3" opacity="0.18" stroke="#5ED3F3" />
          <text x="62" y="77" textAnchor="middle" fill="#D9F8FF" fontSize="18" fontWeight="700">1</text>
          <path d="M 120 40 L 120 92" stroke="#D9F8FF" strokeWidth="5" markerEnd="url(#arrowMethod)" />

          <path d="M 175 205 H 455" stroke="#5ED3F3" strokeWidth="30" strokeLinecap="round" opacity="0.22" />
          <path d="M 190 205 H 440" stroke="#5ED3F3" strokeWidth="5" strokeDasharray="10 11" markerEnd="url(#arrowMethod)" />
          <circle cx="318" cy="164" r="20" fill="#5ED3F3" opacity="0.18" stroke="#5ED3F3" />
          <text x="318" y="171" textAnchor="middle" fill="#D9F8FF" fontSize="18" fontWeight="700">2</text>

          <rect x="455" y="78" width="165" height="164" rx="18" fill="#171C23" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
          <rect x="486" y="118" width="102" height="39" rx="8" fill="#DDE3EA" />
          <rect x="516" y="50" width="43" height="70" rx="9" fill="#8D98A6" />
          <circle cx="605" cy="93" r="20" fill="#5ED3F3" opacity="0.18" stroke="#5ED3F3" />
          <text x="605" y="100" textAnchor="middle" fill="#D9F8FF" fontSize="18" fontWeight="700">3</text>
          <path d="M 538 120 L 538 62" stroke="#D9F8FF" strokeWidth="5" markerEnd="url(#arrowMethod)" />
          <circle cx="600" cy="178" r="20" fill="#5ED3F3" opacity="0.18" stroke="#5ED3F3" />
          <text x="600" y="185" textAnchor="middle" fill="#D9F8FF" fontSize="18" fontWeight="700">4</text>
          <circle cx="510" cy="263" r="20" fill="#5ED3F3" opacity="0.18" stroke="#5ED3F3" />
          <text x="510" y="270" textAnchor="middle" fill="#D9F8FF" fontSize="18" fontWeight="700">5</text>
        </svg>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#171C23] p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#5ED3F3]/35 bg-[#5ED3F3]/10 text-sm font-semibold text-[#D9F8FF]">{index + 1}</div>
              <div className="text-sm font-medium text-[#C8D2DD]">{step}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">
        Use the same sequence each time rather than guessing from the diagram.
      </p>
    </div>
  );
}


function GearTrainDiagram() {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7">
      <div className="mb-5 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Gear train diagram</div>
      <svg viewBox="0 0 760 300" role="img" aria-label="Three meshed gears showing alternating rotation direction" className="h-auto w-full">
        <defs>
          <marker id="gearArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5ED3F3" /></marker>
        </defs>
        <circle cx="210" cy="150" r="72" fill="#171C23" stroke="rgba(255,255,255,0.22)" strokeWidth="4" />
        <circle cx="380" cy="150" r="72" fill="#171C23" stroke="rgba(255,255,255,0.22)" strokeWidth="4" />
        <circle cx="550" cy="150" r="72" fill="#171C23" stroke="rgba(255,255,255,0.22)" strokeWidth="4" />
        {[210,380,550].map((cx) => Array.from({length:12}).map((_,i)=>{
          const angle=(i*30*Math.PI)/180; const x1=cx+Math.cos(angle)*78; const y1=150+Math.sin(angle)*78; const x2=cx+Math.cos(angle)*92; const y2=150+Math.sin(angle)*92;
          return <line key={`${cx}-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" />
        }))}
        <text x="210" y="156" textAnchor="middle" fill="#F4F6F8" fontSize="24" fontWeight="700">A</text>
        <text x="380" y="156" textAnchor="middle" fill="#F4F6F8" fontSize="24" fontWeight="700">B</text>
        <text x="550" y="156" textAnchor="middle" fill="#F4F6F8" fontSize="24" fontWeight="700">C</text>
        <path d="M 160 80 C 120 125 120 175 160 220" fill="none" stroke="#5ED3F3" strokeWidth="6" markerEnd="url(#gearArrow)" />
        <path d="M 430 220 C 470 175 470 125 430 80" fill="none" stroke="#5ED3F3" strokeWidth="6" markerEnd="url(#gearArrow)" />
        <path d="M 500 80 C 460 125 460 175 500 220" fill="none" stroke="#5ED3F3" strokeWidth="6" markerEnd="url(#gearArrow)" />
        <text x="210" y="260" textAnchor="middle" fill="#AAB4C0" fontSize="17">Clockwise</text>
        <text x="380" y="260" textAnchor="middle" fill="#AAB4C0" fontSize="17">Anticlockwise</text>
        <text x="550" y="260" textAnchor="middle" fill="#AAB4C0" fontSize="17">Clockwise</text>
      </svg>
      <p className="mt-5 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">Each gear contact reverses direction. In a three-gear train, the first and third gears rotate the same way.</p>
    </div>
  );
}

function GearSizeDiagram() {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7">
      <div className="mb-5 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Gear size diagram</div>
      <svg viewBox="0 0 760 310" role="img" aria-label="Small gear driving a larger gear" className="h-auto w-full">
        <circle cx="250" cy="160" r="55" fill="#171C23" stroke="rgba(255,255,255,0.22)" strokeWidth="4" />
        <circle cx="445" cy="160" r="105" fill="#171C23" stroke="rgba(255,255,255,0.22)" strokeWidth="4" />
        {Array.from({length:10}).map((_,i)=>{ const a=i*36*Math.PI/180; return <line key={`small-${i}`} x1={250+Math.cos(a)*58} y1={160+Math.sin(a)*58} x2={250+Math.cos(a)*72} y2={160+Math.sin(a)*72} stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" /> })}
        {Array.from({length:20}).map((_,i)=>{ const a=i*18*Math.PI/180; return <line key={`large-${i}`} x1={445+Math.cos(a)*108} y1={160+Math.sin(a)*108} x2={445+Math.cos(a)*123} y2={160+Math.sin(a)*123} stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" /> })}
        <text x="250" y="166" textAnchor="middle" fill="#F4F6F8" fontSize="22" fontWeight="700">10 teeth</text>
        <text x="445" y="166" textAnchor="middle" fill="#F4F6F8" fontSize="22" fontWeight="700">20 teeth</text>
        <text x="250" y="265" textAnchor="middle" fill="#D9F8FF" fontSize="18">Smaller driver</text>
        <text x="445" y="285" textAnchor="middle" fill="#D9F8FF" fontSize="18">Larger driven gear</text>
        <path d="M 140 60 C 100 115 100 195 140 250" fill="none" stroke="#5ED3F3" strokeWidth="6" />
        <text x="610" y="95" fill="#AAB4C0" fontSize="18">Larger gear</text>
        <text x="610" y="125" fill="#AAB4C0" fontSize="18">turns more slowly</text>
        <text x="610" y="165" fill="#5ED3F3" fontSize="18">More teeth = more movement</text>
        <text x="610" y="195" fill="#5ED3F3" fontSize="18">needed for one turn</text>
      </svg>
      <p className="mt-5 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">When a small gear drives a larger gear, the larger gear usually turns more slowly.</p>
    </div>
  );
}

function GearFundamentalsScreen({ journey, onSaveJourney, onComplete }: { journey: MvpGuestJourney; onSaveJourney: (journey: MvpGuestJourney) => void; onComplete: () => void }) {
  const existingProgress = getCurrentGearProgress(journey);
  const progress = existingProgress ?? { moduleProgressId: id("module-progress"), moduleId: "gear_fundamentals" as const, currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const section = gearFundamentalsModule.sections[progress.currentSectionIndex];
  const miniCheck = section.miniCheck;
  const selectedCorrect = Boolean(miniCheck && selectedOptionId === miniCheck.correctOptionId);
  const isFinalSection = progress.currentSectionIndex === gearFundamentalsModule.sections.length - 1;

  function persistProgress(nextProgress: ModuleProgress) {
    const nextJourney = journey.moduleProgress.some((item) => item.moduleProgressId === nextProgress.moduleProgressId)
      ? updateGearProgress(journey, nextProgress)
      : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() };
    onSaveJourney(nextJourney);
  }
  function answerMiniCheck(optionId: string) {
    if (!miniCheck || showFeedback) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);
    const response: ModuleMiniCheckResponse = { questionId: miniCheck.questionId, selectedOptionId: optionId, correct: optionId === miniCheck.correctOptionId, answeredAt: now() };
    persistProgress({ ...progress, miniCheckResponses: [...progress.miniCheckResponses.filter((item) => item.questionId !== miniCheck.questionId), response], updatedAt: now() });
  }
  function goNext() {
    if (isFinalSection) { onComplete(); return; }
    const nextProgress = { ...progress, currentSectionIndex: Math.min(progress.currentSectionIndex + 1, gearFundamentalsModule.sections.length - 1), updatedAt: now() };
    setSelectedOptionId(null); setShowFeedback(false); persistProgress(nextProgress);
  }
  function goBack() {
    const nextProgress = { ...progress, currentSectionIndex: Math.max(progress.currentSectionIndex - 1, 0), updatedAt: now() };
    setSelectedOptionId(null); setShowFeedback(false); persistProgress(nextProgress);
  }

  return <Shell><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${((progress.currentSectionIndex + 1) / gearFundamentalsModule.sections.length) * 100}%` }} /></div><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Gear Fundamentals</p><h1 className="mt-3 text-4xl font-semibold">{gearFundamentalsModule.title}</h1><p className="mt-3 text-[#9AA3B2]">{gearFundamentalsModule.subtitle}</p></div><Badge>Section {progress.currentSectionIndex + 1} of {gearFundamentalsModule.sections.length}</Badge></div><Card><h2 className="text-3xl font-semibold">{section.title}</h2><p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-[#C8D2DD]">{section.body}</p>{section.sectionId === "gear-fund-003" && <GearTrainDiagram />}{section.sectionId === "gear-fund-004" && <GearSizeDiagram />}{section.keyPoint && <div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Key point</div><p className="mt-3 text-[#D9F8FF]">{section.keyPoint}</p></div>}{miniCheck && <div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Quick check</div><p className="mt-3 text-lg font-medium text-[#F4F6F8]">{miniCheck.stem}</p><div className="mt-5 grid gap-3">{miniCheck.options.map((option) => <button key={option.optionId} onClick={() => answerMiniCheck(option.optionId)} className={`rounded-xl border p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 bg-[#171C23] hover:border-white/20"}`}><span className="font-semibold text-[#D9F8FF]">{option.label}.</span> <span className="text-[#C8D2DD]">{option.text}</span></button>)}</div>{showFeedback && <div className={`mt-5 rounded-xl border p-4 ${selectedCorrect ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-medium">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 text-sm leading-relaxed text-[#C8D2DD]">{miniCheck.explanation}</p></div>}</div>}<div className="mt-9 flex flex-col gap-3 pb-4 sm:flex-row sm:justify-between sm:pb-0"><PrimaryButton className="sm:order-2" onClick={goNext}>{isFinalSection ? "Complete module" : "Continue"}</PrimaryButton><SecondaryButton className="sm:order-1" onClick={goBack}>Back</SecondaryButton></div></Card></section></Shell>;
}

function GearFundamentalsCompleteScreen({ journey, onWhy, onDashboard, onStartGuidedGearPractice }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGuidedGearPractice: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Learning action complete</p><h1 className="mt-6 text-4xl font-semibold leading-tight">Gear Fundamentals complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">FloSpatial has updated your preparation journey. The next planned step is to check whether these gear concepts transfer into guided practice.</p><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>{rec?.confidence === "high" ? "High confidence" : "Moderate confidence"}</Badge></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onStartGuidedGearPractice}>Begin gear practice</PrimaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}

function HydraulicFundamentalsScreen({ journey, onSaveJourney, onComplete }: { journey: MvpGuestJourney; onSaveJourney: (journey: MvpGuestJourney) => void; onComplete: () => void }) {
  const existingProgress = getCurrentHydraulicProgress(journey);
  const progress = existingProgress ?? { moduleProgressId: id("module-progress"), moduleId: "hydraulic_fundamentals" as const, currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const section = hydraulicFundamentalsModule.sections[progress.currentSectionIndex];
  const miniCheck = section.miniCheck;
  const selectedCorrect = Boolean(miniCheck && selectedOptionId === miniCheck.correctOptionId);
  const isFinalSection = progress.currentSectionIndex === hydraulicFundamentalsModule.sections.length - 1;

  function persistProgress(nextProgress: ModuleProgress) {
    const nextJourney = journey.moduleProgress.some((item) => item.moduleProgressId === nextProgress.moduleProgressId)
      ? updateHydraulicProgress(journey, nextProgress)
      : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() };
    onSaveJourney(nextJourney);
  }
  function answerMiniCheck(optionId: string) {
    if (!miniCheck || showFeedback) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);
    const response: ModuleMiniCheckResponse = { questionId: miniCheck.questionId, selectedOptionId: optionId, correct: optionId === miniCheck.correctOptionId, answeredAt: now() };
    persistProgress({ ...progress, miniCheckResponses: [...progress.miniCheckResponses.filter((item) => item.questionId !== miniCheck.questionId), response], updatedAt: now() });
  }
  function goNext() {
    if (isFinalSection) { onComplete(); return; }
    const nextProgress = { ...progress, currentSectionIndex: Math.min(progress.currentSectionIndex + 1, hydraulicFundamentalsModule.sections.length - 1), updatedAt: now() };
    setSelectedOptionId(null);
    setShowFeedback(false);
    persistProgress(nextProgress);
  }
  function goBack() {
    const nextProgress = { ...progress, currentSectionIndex: Math.max(progress.currentSectionIndex - 1, 0), updatedAt: now() };
    setSelectedOptionId(null);
    setShowFeedback(false);
    persistProgress(nextProgress);
  }

  return <Shell><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${((progress.currentSectionIndex + 1) / hydraulicFundamentalsModule.sections.length) * 100}%` }} /></div><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Hydraulic Fundamentals</p><h1 className="mt-3 text-4xl font-semibold">{hydraulicFundamentalsModule.title}</h1><p className="mt-3 text-[#9AA3B2]">{hydraulicFundamentalsModule.subtitle}</p></div><Badge>Section {progress.currentSectionIndex + 1} of {hydraulicFundamentalsModule.sections.length}</Badge></div><Card><h2 className="text-3xl font-semibold">{section.title}</h2><p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-[#C8D2DD]">{section.body}</p>{section.sectionId === "hyd-fund-006" && <HydraulicWorkedExampleDiagram />}{section.sectionId === "hyd-fund-007" && <HydraulicSolvingMethodDiagram />}{section.keyPoint && <div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Key point</div><p className="mt-3 text-[#D9F8FF]">{section.keyPoint}</p></div>}{miniCheck && <div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Quick check</div><p className="mt-3 text-lg font-medium text-[#F4F6F8]">{miniCheck.stem}</p><div className="mt-5 grid gap-3">{miniCheck.options.map((option) => <button key={option.optionId} onClick={() => answerMiniCheck(option.optionId)} className={`rounded-xl border p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 bg-[#171C23] hover:border-white/20"}`}><span className="font-semibold text-[#D9F8FF]">{option.label}.</span> <span className="text-[#C8D2DD]">{option.text}</span></button>)}</div>{showFeedback && <div className={`mt-5 rounded-xl border p-4 ${selectedCorrect ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-medium">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 text-sm leading-relaxed text-[#C8D2DD]">{miniCheck.explanation}</p></div>}</div>}<div className="mt-9 flex flex-col gap-3 pb-4 sm:flex-row sm:justify-between sm:pb-0"><PrimaryButton className="sm:order-2" onClick={goNext}>{isFinalSection ? "Complete module" : "Continue"}</PrimaryButton><SecondaryButton className="sm:order-1" onClick={goBack}>Back</SecondaryButton></div></Card></section></Shell>;
}

function HydraulicFundamentalsCompleteScreen({ journey, onWhy, onDashboard, onStartGuidedPractice }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGuidedPractice: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Learning action complete</p><h1 className="mt-6 text-4xl font-semibold leading-tight">Hydraulic Fundamentals complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">FloSpatial has updated your preparation journey. The next step is to check whether these concepts transfer into practice.</p><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>{rec?.confidence === "high" ? "High confidence" : "Moderate confidence"}</Badge></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onStartGuidedPractice}>Begin practice</PrimaryButton><SecondaryButton onClick={onDashboard}>View dashboard</SecondaryButton></div></Card></section></Shell>;
}

function GuidedHydraulicPracticeIntroScreen({ onStart }: { onStart: () => void }) {
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Evidence check</p><h1 className="mt-5 text-4xl font-semibold">Guided Hydraulic Practice</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">This practice checks whether the hydraulic concepts you reviewed are beginning to transfer into problem-solving.</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{["10 questions", "Immediate feedback", "No timer"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">FloSpatial will compare this result with your starting point to update your recommendation.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Begin practice</PrimaryButton></div></Card></section></Shell>;
}
function GuidedHydraulicQuestionScreen({ journey, sessionId, questionIndex, onAnswer }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = guidedHydraulicPracticeQuestions[questionIndex];
  if (!question) return null;
  const selectedCorrect = selectedOptionId === question.correctOptionId;
  const progress = ((questionIndex + 1) / guidedHydraulicPracticeQuestions.length) * 100;
  function select(optionId: string) { if (showFeedback) return; setSelectedOptionId(optionId); setShowFeedback(true); }
  function next() { if (!selectedOptionId) return; const response = createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false); onAnswer(response, questionIndex === guidedHydraulicPracticeQuestions.length - 1); }
  const answered = journey.responses.filter((r) => r.sessionId === sessionId).length;
  return <Shell right="Guided practice"><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-8 flex items-end justify-between"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Guided Hydraulic Practice</p><h1 className="mt-3 text-3xl font-semibold">Hydraulic reasoning</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {guidedHydraulicPracticeQuestions.length}<br /><span className="text-xs">{answered} saved</span></div></div><Card><p className="text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p><div className="mt-8 grid gap-4">{question.options.map((option) => <button key={option.optionId} onClick={() => select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div>{showFeedback && <div className={`mt-7 rounded-2xl border p-5 ${selectedCorrect ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>{!selectedCorrect && question.feedbackCue && <p className="mt-4 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}</div>}<div className="mt-8 flex justify-end"><PrimaryButton disabled={!showFeedback} onClick={next}>{questionIndex === guidedHydraulicPracticeQuestions.length - 1 ? "Complete practice" : "Next question"}</PrimaryButton></div></Card></section></Shell>;
}
function GuidedHydraulicPracticeDebriefScreen({ journey, onWhy, onDashboard }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Practice debrief</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title ?? "Guided practice complete"}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p><div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Comparison</div><p className="mt-3 text-[#C8D2DD]">{debrief?.comparison}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>Moderate confidence</Badge></div></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}


function MixedMechanicalPracticeIntroScreen({ onStart }: { onStart: () => void }) {
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Adaptive evidence check</p><h1 className="mt-5 text-4xl font-semibold">Mixed Mechanical Practice</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">This session mixes hydraulics, gears, pulleys and levers to check what should become your next preparation focus.</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{["20 questions", "Immediate feedback", "No topic labels"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">FloSpatial will silently track each mechanical topic and update your recommendation after the session.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Start mixed practice</PrimaryButton></div></Card></section></Shell>;
}

function MixedMechanicalQuestionScreen({ journey, sessionId, questionIndex, onAnswer }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = mixedMechanicalPracticeQuestions[questionIndex];
  const progress = ((questionIndex + 1) / mixedMechanicalPracticeQuestions.length) * 100;
  const answered = journey.responses.filter((r) => r.sessionId === sessionId).length;
  if (!question) return null;
  const selectedCorrect = selectedOptionId === question.correctOptionId;
  function select(optionId: string) { if (showFeedback) return; setSelectedOptionId(optionId); setShowFeedback(true); }
  function next() { if (!selectedOptionId) return; const response = createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false); onAnswer(response, questionIndex === mixedMechanicalPracticeQuestions.length - 1); }
  return (
    <Shell right="Mixed practice">
      <section className="mx-auto max-w-5xl px-8 pb-44 pt-12 sm:pb-12">
        <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Mixed Mechanical Practice</p><h1 className="mt-3 text-3xl font-semibold">Mechanical reasoning</h1></div>
          <div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {mixedMechanicalPracticeQuestions.length}<br /><span className="text-xs">{answered} saved</span></div>
        </div>
        <Card>
          <p className="text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p>
          <div className="mt-8 grid gap-4">
            {question.options.map((option) => <button key={option.optionId} onClick={() => select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}
          </div>
          {showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl sm:static sm:mt-7 sm:rounded-2xl sm:border sm:p-5 sm:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}>
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p>
                  <p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>
                  {!selectedCorrect && question.feedbackCue && <p className="mt-3 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}
                </div>
                <div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === mixedMechanicalPracticeQuestions.length - 1 ? "Complete mixed practice" : "Next question"}</PrimaryButton></div>
              </div>
            </div>
          </div>}
        </Card>
      </section>
    </Shell>
  );
}

function MixedMechanicalPracticeDebriefScreen({ journey, onWhy, onDashboard }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Mixed practice debrief</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title ?? "Mixed mechanical practice complete"}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p><div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Mixed practice evidence</div><p className="mt-3 text-[#C8D2DD]">{debrief?.comparison}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>Moderate confidence</Badge></div></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}


function GuidedGearPracticeIntroScreen({ onStart }: { onStart: () => void }) {
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Evidence check</p><h1 className="mt-5 text-4xl font-semibold">Guided Gear Practice</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">This practice checks whether gear direction, idler and gear-size concepts are beginning to transfer into problem-solving.</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{["10 questions", "Immediate feedback", "Diagram-first reasoning"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">FloSpatial will use this result to decide whether to return to mixed mechanical practice or continue reinforcing gear reasoning.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Begin gear practice</PrimaryButton></div></Card></section></Shell>;
}

function GuidedGearQuestionScreen({ journey, sessionId, questionIndex, onAnswer }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = guidedGearPracticeQuestions[questionIndex];
  const progress = ((questionIndex + 1) / guidedGearPracticeQuestions.length) * 100;
  const answered = journey.responses.filter((r) => r.sessionId === sessionId).length;
  if (!question) return null;
  const selectedCorrect = selectedOptionId === question.correctOptionId;
  function select(optionId: string) { if (showFeedback) return; setSelectedOptionId(optionId); setShowFeedback(true); }
  function next() { if (!selectedOptionId) return; const response = createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false); onAnswer(response, questionIndex === guidedGearPracticeQuestions.length - 1); }
  return (
    <Shell right="Guided gear practice">
      <section className="mx-auto max-w-5xl px-8 pb-44 pt-12 sm:pb-12">
        <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Guided Gear Practice</p><h1 className="mt-3 text-3xl font-semibold">Gear reasoning</h1></div>
          <div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {guidedGearPracticeQuestions.length}<br /><span className="text-xs">{answered} saved</span></div>
        </div>
        <Card>
          <GearQuestionDiagram question={question} mode="guided" />
          <p className="mt-7 text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p>
          <div className="mt-8 grid gap-4">
            {question.options.map((option) => <button key={option.optionId} onClick={() => select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}
          </div>
          {showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl sm:static sm:mt-7 sm:rounded-2xl sm:border sm:p-5 sm:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}>
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p>
                  <p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>
                  {!selectedCorrect && question.feedbackCue && <p className="mt-3 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}
                </div>
                <div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === guidedGearPracticeQuestions.length - 1 ? "Complete gear practice" : "Next question"}</PrimaryButton></div>
              </div>
            </div>
          </div>}
        </Card>
      </section>
    </Shell>
  );
}

function GuidedGearPracticeDebriefScreen({ journey, onWhy, onDashboard, onStartGearIndependentPractice }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGearIndependentPractice: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const shouldStartIndependentPractice = rec?.recommendationType === "begin_gear_independent_practice";
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Gear practice debrief</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title ?? "Guided Gear Practice complete"}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p><div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Practice evidence</div><p className="mt-3 text-[#C8D2DD]">{debrief?.comparison}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>Moderate confidence</Badge></div></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton>{shouldStartIndependentPractice ? <PrimaryButton onClick={onStartGearIndependentPractice}>Start Independent Gear Practice</PrimaryButton> : <PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton>}</div></Card></section></Shell>;
}


function GearIndependentPracticeIntroScreen({ onStart }: { onStart: () => void }) {
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Independent practice</p><h1 className="mt-5 text-4xl font-semibold">Independent Gear Practice</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">Twenty-five diagram-based problems covering direction, idlers, relative speed and simple gear ratios.</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{["25 questions", "Immediate answer feedback", "No guided diagram cues"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">This is practice, not the final check. You will still see whether each answer is correct, but the diagrams will no longer tell you what to notice.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Begin independent practice</PrimaryButton></div></Card></section></Shell>;
}

function GearIndependentPracticeQuestionScreen({ journey, sessionId, questionIndex, onAnswer }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = gearIndependentPracticeQuestions[questionIndex];
  if (!question) return null;
  const progress = ((questionIndex + 1) / gearIndependentPracticeQuestions.length) * 100;
  const answered = journey.responses.filter((response) => response.sessionId === sessionId).length;
  const selectedCorrect = selectedOptionId === question.correctOptionId;
  function select(optionId: string) { if (showFeedback) return; setSelectedOptionId(optionId); setShowFeedback(true); }
  function next() { if (!selectedOptionId) return; const response = createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false); onAnswer(response, questionIndex === gearIndependentPracticeQuestions.length - 1); }

  return (
    <Shell right="Independent gear practice">
      <section className="mx-auto max-w-5xl px-8 pb-44 pt-12 sm:pb-12">
        <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Independent Gear Practice</p><h1 className="mt-3 text-3xl font-semibold">Apply the gear rules</h1></div>
          <div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {gearIndependentPracticeQuestions.length}<br /><span className="text-xs">{answered} saved</span></div>
        </div>
        <Card>
          <GearQuestionDiagram question={question} mode="practice" />
          <p className="mt-7 text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p>
          <div className="mt-8 grid gap-4">
            {question.options.map((option) => <button key={option.optionId} onClick={() => select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}
          </div>
          {showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl sm:static sm:mt-7 sm:rounded-2xl sm:border sm:p-5 sm:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}>
            <div className="mx-auto max-w-5xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p></div><div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === gearIndependentPracticeQuestions.length - 1 ? "Complete independent practice" : "Next question"}</PrimaryButton></div></div></div>
          </div>}
        </Card>
      </section>
    </Shell>
  );
}

function GearIndependentPracticeDebriefScreen({ journey, onWhy, onDashboard }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === "gear_independent_practice");
  const labels: Record<string, string> = { direction: "Direction", speed: "Relative speed", ratios: "Ratios & integration" };
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Independent practice debrief</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title ?? "Independent Gear Practice complete"}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-3">{summary.conceptBreakdown.map((item) => <div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{labels[item.concept] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Practice result</div><p className="mt-3 text-[#C8D2DD]">{debrief?.comparison}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>Moderate confidence</Badge></div></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}

type GearDiagramMode = "guided" | "practice" | "assessment";
type GearDirection = "clockwise" | "anticlockwise";
type GearDiagramSpec = {
  teeth: number[];
  yOffsets?: number[];
  driverIndex: number;
  driverDirection: GearDirection;
  showTeeth?: boolean;
  helper?: string;
};

function getGearDiagramSpec(questionId: string): GearDiagramSpec {
  const specs: Record<string, GearDiagramSpec> = {
    "GEAR-GP-001": { teeth: [20, 20], driverIndex: 0, driverDirection: "clockwise", helper: "Start with Gear A, then trace one direct contact." },
    "GEAR-GP-002": { teeth: [20, 20, 20], driverIndex: 0, driverDirection: "anticlockwise", helper: "Trace the direction one contact at a time." },
    "GEAR-GP-003": { teeth: [20, 20, 20, 20], driverIndex: 0, driverDirection: "clockwise", helper: "Count contacts, not gears." },
    "GEAR-GP-004": { teeth: [20, 20, 20, 20, 20], driverIndex: 0, driverDirection: "anticlockwise", helper: "Keep alternating direction through the whole train." },
    "GEAR-GP-005": { teeth: [20, 20, 20], driverIndex: 0, driverDirection: "clockwise", helper: "Look at what changes when a middle gear adds one more contact." },
    "GEAR-GP-006": { teeth: [12, 28, 36], driverIndex: 0, driverDirection: "clockwise", showTeeth: true, helper: "Compare the first and last gears when thinking about overall speed ratio." },
    "GEAR-GP-007": { teeth: [12, 36], driverIndex: 0, driverDirection: "clockwise", showTeeth: true, helper: "Compare the tooth counts before deciding which gear completes more revolutions." },
    "GEAR-GP-008": { teeth: [36, 12], driverIndex: 0, driverDirection: "clockwise", showTeeth: true, helper: "A smaller driven gear needs fewer teeth to pass for one full revolution." },
    "GEAR-GP-009": { teeth: [12, 36], driverIndex: 0, driverDirection: "clockwise", showTeeth: true, helper: "Use the inverse relationship between tooth count and rotational speed." },
    "GEAR-GP-010": { teeth: [30, 15], driverIndex: 0, driverDirection: "clockwise", showTeeth: true, helper: "Solve direction and speed separately, then combine them." },

    "GEAR-IP-001": { teeth: [20, 20], yOffsets: [20, -20], driverIndex: 0, driverDirection: "clockwise" },
    "GEAR-IP-002": { teeth: [20, 20, 20], yOffsets: [-24, 24, -24], driverIndex: 0, driverDirection: "clockwise" },
    "GEAR-IP-003": { teeth: [20, 20, 20, 20, 20], yOffsets: [18, -18, 18, -18, 18], driverIndex: 0, driverDirection: "anticlockwise" },
    "GEAR-IP-004": { teeth: [20, 20, 20, 20, 20, 20], yOffsets: [-16, 16, -16, 16, -16, 16], driverIndex: 0, driverDirection: "clockwise" },
    "GEAR-IP-005": { teeth: [20, 20, 20], yOffsets: [20, -24, 20], driverIndex: 1, driverDirection: "clockwise" },
    "GEAR-IP-006": { teeth: [20, 24, 20], yOffsets: [-18, 24, -18], driverIndex: 0, driverDirection: "clockwise" },
    "GEAR-IP-007": { teeth: [20, 20, 20, 20], yOffsets: [28, -20, 20, -28], driverIndex: 0, driverDirection: "clockwise" },
    "GEAR-IP-008": { teeth: [14, 42], yOffsets: [18, -18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-009": { teeth: [48, 16], yOffsets: [-18, 18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-010": { teeth: [24, 24], yOffsets: [22, -22], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-011": { teeth: [12, 36], yOffsets: [-20, 20], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-012": { teeth: [40, 20], yOffsets: [18, -18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-013": { teeth: [18, 54], yOffsets: [-20, 20], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-014": { teeth: [48, 16], yOffsets: [20, -20], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-015": { teeth: [12, 24, 36], yOffsets: [20, -24, 20], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-016": { teeth: [24, 12], yOffsets: [-20, 20], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-017": { teeth: [15, 30, 45], yOffsets: [-22, 22, -22], driverIndex: 0, driverDirection: "anticlockwise", showTeeth: true },
    "GEAR-IP-018": { teeth: [12, 36, 18], yOffsets: [22, -24, 22], driverIndex: 1, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-019": { teeth: [12, 36, 18], yOffsets: [-18, 24, -18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-020": { teeth: [10, 20, 40], yOffsets: [20, -20, 20], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-021": { teeth: [20, 60, 30], yOffsets: [-20, 20, -20], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-022": { teeth: [15, 20, 45], yOffsets: [18, -24, 18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-023": { teeth: [30, 30, 30], yOffsets: [-22, 22, -22], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-IP-024": { teeth: [20, 20, 20, 20], yOffsets: [30, -25, 16, -30], driverIndex: 0, driverDirection: "anticlockwise" },
    "GEAR-IP-025": { teeth: [20, 10, 40], yOffsets: [20, -24, 20], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },

    "GEAR-AS-001": { teeth: [20, 20], yOffsets: [34, -34], driverIndex: 0, driverDirection: "anticlockwise" },
    "GEAR-AS-002": { teeth: [20, 20, 20], yOffsets: [-28, 28, -28], driverIndex: 0, driverDirection: "clockwise" },
    "GEAR-AS-003": { teeth: [20, 20, 20, 20], yOffsets: [22, -22, 22, -22], driverIndex: 0, driverDirection: "anticlockwise" },
    "GEAR-AS-004": { teeth: [20, 20, 20], yOffsets: [0, -34, 0], driverIndex: 0, driverDirection: "clockwise" },
    "GEAR-AS-005": { teeth: [15, 45], yOffsets: [18, -18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-AS-006": { teeth: [40, 10], yOffsets: [-18, 18], driverIndex: 0, driverDirection: "anticlockwise", showTeeth: true },
    "GEAR-AS-007": { teeth: [15, 45], yOffsets: [-24, 24], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-AS-008": { teeth: [40, 10], yOffsets: [24, -24], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-AS-009": { teeth: [20, 40], yOffsets: [-20, 20], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "GEAR-AS-010": { teeth: [20, 10, 40], yOffsets: [18, -24, 18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
  };
  return specs[questionId] ?? { teeth: [20, 20], driverIndex: 0, driverDirection: "clockwise" };
}

function buildGearDiagramNodes(spec: GearDiagramSpec) {
  const rawRadii = spec.teeth.map((teeth) => Math.max(43, Math.min(86, 34 + teeth * 1.15)));
  const rawOffsets = spec.yOffsets ?? spec.teeth.map(() => 0);
  const rawDistances = rawRadii.slice(0, -1).map((radius, index) => {
    const nextRadius = rawRadii[index + 1];
    const dy = rawOffsets[index + 1] - rawOffsets[index];
    const contactDistance = radius + nextRadius + 6;
    return Math.sqrt(Math.max(contactDistance * contactDistance - dy * dy, 1));
  });
  const rawSpan = rawRadii[0] + rawDistances.reduce((sum, distance) => sum + distance, 0) + rawRadii[rawRadii.length - 1];
  const scale = Math.min(1, 670 / rawSpan);
  const radii = rawRadii.map((radius) => radius * scale);
  const offsets = rawOffsets.map((offset) => offset * scale);
  const distances = rawDistances.map((distance) => distance * scale);
  const span = radii[0] + distances.reduce((sum, distance) => sum + distance, 0) + radii[radii.length - 1];
  let x = (760 - span) / 2 + radii[0];

  return radii.map((radius, index) => {
    if (index > 0) x += distances[index - 1];
    return {
      cx: x,
      cy: 150 + offsets[index],
      radius,
      teeth: spec.teeth[index],
      label: String.fromCharCode(65 + index),
    };
  });
}

function GearQuestionDiagram({ question, mode }: { question: MvpQuestion; mode: GearDiagramMode }) {
  const spec = getGearDiagramSpec(question.questionId);
  const nodes = buildGearDiagramNodes(spec);
  const driver = nodes[spec.driverIndex];
  const markerId = `gear-arrow-${question.questionId}`;
  const arrowRadius = driver.radius + 25;
  const clockwisePath = `M ${driver.cx - arrowRadius * 0.72} ${driver.cy - arrowRadius * 0.68} A ${arrowRadius} ${arrowRadius} 0 1 1 ${driver.cx + arrowRadius * 0.76} ${driver.cy + arrowRadius * 0.62}`;
  const anticlockwisePath = `M ${driver.cx + arrowRadius * 0.72} ${driver.cy - arrowRadius * 0.68} A ${arrowRadius} ${arrowRadius} 0 1 0 ${driver.cx - arrowRadius * 0.76} ${driver.cy + arrowRadius * 0.62}`;
  const aria = `${nodes.length}-gear diagram. Gear ${driver.label} turns ${spec.driverDirection}.`;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">{mode === "guided" ? "Guided diagram" : mode === "practice" ? "Practice diagram" : "Gear diagram"}</div>
        {mode === "practice" && <div className="text-xs text-[#6E7A88]">No guided cues</div>}
        {mode === "assessment" && <div className="text-xs text-[#6E7A88]">No hints</div>}
      </div>
      <svg viewBox="0 0 760 315" role="img" aria-label={aria} className="h-auto w-full">
        <defs>
          <marker id={markerId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5ED3F3" />
          </marker>
        </defs>
        {nodes.map((node) => {
          const toothCount = Math.max(10, Math.min(24, Math.round(node.teeth / 2)));
          const toothInner = node.radius + 4;
          const toothOuter = node.radius + 15;
          return (
            <g key={node.label}>
              <circle cx={node.cx} cy={node.cy} r={node.radius} fill="#171C23" stroke="rgba(255,255,255,0.24)" strokeWidth="4" />
              {Array.from({ length: toothCount }).map((_, toothIndex) => {
                const angle = (toothIndex * (360 / toothCount) * Math.PI) / 180;
                return <line key={`${node.label}-${toothIndex}`} x1={node.cx + Math.cos(angle) * toothInner} y1={node.cy + Math.sin(angle) * toothInner} x2={node.cx + Math.cos(angle) * toothOuter} y2={node.cy + Math.sin(angle) * toothOuter} stroke="rgba(255,255,255,0.24)" strokeWidth="4" strokeLinecap="round" />;
              })}
              <text x={node.cx} y={node.cy + (spec.showTeeth ? -4 : 7)} textAnchor="middle" fill="#F4F6F8" fontSize="24" fontWeight="700">{node.label}</text>
              {spec.showTeeth && <text x={node.cx} y={node.cy + 23} textAnchor="middle" fill="#9AA3B2" fontSize="15">{node.teeth} teeth</text>}
            </g>
          );
        })}
        <path d={spec.driverDirection === "clockwise" ? clockwisePath : anticlockwisePath} fill="none" stroke="#5ED3F3" strokeWidth="6" markerEnd={`url(#${markerId})`} />
        <text x={driver.cx} y="292" textAnchor="middle" fill="#D9F8FF" fontSize="16">Gear {driver.label}: {spec.driverDirection}</text>
      </svg>
      {mode === "guided" && spec.helper && <p className="mt-3 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">{spec.helper}</p>}
    </div>
  );
}

function GearAssessmentIntroScreen({ onStart }: { onStart: () => void }) {
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Assessment-style check</p><h1 className="mt-5 text-4xl font-semibold">Gear Check</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">Ten diagram-based questions. There is no immediate feedback, so the result gives a cleaner picture of what you can do independently.</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{["10 questions", "No immediate feedback", "Untimed"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">Work at a steady pace. You can use the diagram, but no hints or worked feedback will appear until the check is complete.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Start Gear Check</PrimaryButton></div></Card></section></Shell>;
}

function GearAssessmentQuestionScreen({ journey, sessionId, questionIndex, onAnswer }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStartedAt(Date.now()); setSelectedOptionId(null); }, [questionIndex]);
  const question = gearAssessmentQuestions[questionIndex];
  if (!question) return null;
  const progress = ((questionIndex + 1) / gearAssessmentQuestions.length) * 100;
  const answered = journey.responses.filter((response) => response.sessionId === sessionId).length;

  function next() {
    if (!selectedOptionId) return;
    const response = createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false);
    onAnswer(response, questionIndex === gearAssessmentQuestions.length - 1);
  }

  return (
    <Shell right="Gear Check">
      <section className="mx-auto max-w-5xl px-8 py-12">
        <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Gear Check</p><h1 className="mt-3 text-3xl font-semibold">Assessment-style gear reasoning</h1></div>
          <div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {gearAssessmentQuestions.length}<br /><span className="text-xs">{answered} saved</span></div>
        </div>
        <Card>
          <GearQuestionDiagram question={question} mode="assessment" />
          <p className="mt-7 text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p>
          <div className="mt-8 grid gap-4">
            {question.options.map((option) => <button key={option.optionId} onClick={() => setSelectedOptionId(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}
          </div>
          <div className="mt-8 flex justify-end"><PrimaryButton disabled={!selectedOptionId} onClick={next}>{questionIndex === gearAssessmentQuestions.length - 1 ? "Finish Gear Check" : "Next question"}</PrimaryButton></div>
        </Card>
      </section>
    </Shell>
  );
}

function GearAssessmentDebriefScreen({ journey, onWhy, onDashboard }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === "gear_assessment");
  const labels: Record<string, string> = { direction: "Direction", speed: "Relative speed", ratios: "Ratios & integration" };

  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Gear Check debrief</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title ?? "Gear Check complete"}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-3">{summary.conceptBreakdown.map((item) => <div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{labels[item.concept] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Result</div><p className="mt-3 text-[#C8D2DD]">{debrief?.comparison}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>Moderate confidence</Badge></div></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}


function PulleyConceptDiagram() {
  return <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7"><div className="mb-4 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Supporting-strand example</div><svg viewBox="0 0 760 330" role="img" aria-label="A moving pulley block supported by four rope sections" className="h-auto w-full"><line x1="90" y1="55" x2="670" y2="55" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round"/><text x="380" y="35" textAnchor="middle" fill="#8D98A6" fontSize="16">Fixed support</text>{[250,335,425,510].map((x,i)=><g key={x}><line x1={x} y1="65" x2={x} y2="215" stroke="#5ED3F3" strokeWidth="7" strokeLinecap="round"/><text x={x} y="115" textAnchor="middle" fill="#D9F8FF" fontSize="17">{i+1}</text></g>)}<rect x="210" y="210" width="340" height="60" rx="20" fill="#171C23" stroke="rgba(255,255,255,0.24)" strokeWidth="4"/><text x="380" y="247" textAnchor="middle" fill="#F4F6F8" fontSize="22" fontWeight="700">Moving block</text><rect x="305" y="270" width="150" height="42" rx="10" fill="#252C35"/><text x="380" y="298" textAnchor="middle" fill="#C8D2DD" fontSize="18">Load</text></svg><p className="mt-4 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">The useful question is not “How many pieces of rope can I see?” It is “How many rope sections directly support the moving block?”</p></div>;
}

function PulleyFundamentalsScreen({ journey, onSaveJourney, onComplete }: { journey: MvpGuestJourney; onSaveJourney: (journey: MvpGuestJourney) => void; onComplete: () => void }) {
  const existingProgress = getCurrentPulleyProgress(journey);
  const progress = existingProgress ?? { moduleProgressId: id("module-progress"), moduleId: "pulley_fundamentals" as const, currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const section = pulleyFundamentalsModule.sections[progress.currentSectionIndex];
  const miniCheck = section.miniCheck;
  const selectedCorrect = Boolean(miniCheck && selectedOptionId === miniCheck.correctOptionId);
  const isFinalSection = progress.currentSectionIndex === pulleyFundamentalsModule.sections.length - 1;
  function persistProgress(nextProgress: ModuleProgress) { const nextJourney = journey.moduleProgress.some((item) => item.moduleProgressId === nextProgress.moduleProgressId) ? updatePulleyProgress(journey, nextProgress) : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() }; onSaveJourney(nextJourney); }
  function answerMiniCheck(optionId: string) { if (!miniCheck || showFeedback) return; setSelectedOptionId(optionId); setShowFeedback(true); const response: ModuleMiniCheckResponse = { questionId: miniCheck.questionId, selectedOptionId: optionId, correct: optionId === miniCheck.correctOptionId, answeredAt: now() }; persistProgress({ ...progress, miniCheckResponses: [...progress.miniCheckResponses.filter((item) => item.questionId !== miniCheck.questionId), response], updatedAt: now() }); }
  function goNext() { if (isFinalSection) { onComplete(); return; } const nextProgress = { ...progress, currentSectionIndex: Math.min(progress.currentSectionIndex + 1, pulleyFundamentalsModule.sections.length - 1), updatedAt: now() }; setSelectedOptionId(null); setShowFeedback(false); persistProgress(nextProgress); }
  function goBack() { const nextProgress = { ...progress, currentSectionIndex: Math.max(progress.currentSectionIndex - 1, 0), updatedAt: now() }; setSelectedOptionId(null); setShowFeedback(false); persistProgress(nextProgress); }
  return <Shell><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${((progress.currentSectionIndex + 1) / pulleyFundamentalsModule.sections.length) * 100}%` }} /></div><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Pulley Fundamentals</p><h1 className="mt-3 text-4xl font-semibold">{pulleyFundamentalsModule.title}</h1><p className="mt-3 text-[#9AA3B2]">{pulleyFundamentalsModule.subtitle}</p></div><Badge>Section {progress.currentSectionIndex + 1} of {pulleyFundamentalsModule.sections.length}</Badge></div><Card><h2 className="text-3xl font-semibold">{section.title}</h2><p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-[#C8D2DD]">{section.body}</p>{(section.sectionId === "pulley-fund-003" || section.sectionId === "pulley-fund-004") && <PulleyConceptDiagram />}{section.keyPoint && <div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Key point</div><p className="mt-3 text-[#D9F8FF]">{section.keyPoint}</p></div>}{miniCheck && <div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Quick check</div><p className="mt-3 text-lg font-medium text-[#F4F6F8]">{miniCheck.stem}</p><div className="mt-5 grid gap-3">{miniCheck.options.map((option) => <button key={option.optionId} onClick={() => answerMiniCheck(option.optionId)} className={`rounded-xl border p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 bg-[#171C23] hover:border-white/20"}`}><span className="font-semibold text-[#D9F8FF]">{option.label}.</span> <span className="text-[#C8D2DD]">{option.text}</span></button>)}</div>{showFeedback && <div className={`mt-5 rounded-xl border p-4 ${selectedCorrect ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-medium">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 text-sm leading-relaxed text-[#C8D2DD]">{miniCheck.explanation}</p></div>}</div>}<div className="mt-9 flex flex-col gap-3 pb-4 sm:flex-row sm:justify-between sm:pb-0"><PrimaryButton className="sm:order-2" onClick={goNext}>{isFinalSection ? "Complete module" : "Continue"}</PrimaryButton><SecondaryButton className="sm:order-1" onClick={goBack}>Back</SecondaryButton></div></Card></section></Shell>;
}

function PulleyFundamentalsCompleteScreen({ journey, onWhy, onDashboard, onStartGuidedPulleyPractice }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGuidedPulleyPractice: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Learning action complete</p><h1 className="mt-6 text-4xl font-semibold leading-tight">Pulley Fundamentals complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">The next stage is guided diagram practice using the same support-strand method.</p><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onStartGuidedPulleyPractice}>Begin pulley practice</PrimaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}

type PulleyQuestionMode = "guided" | "independent" | "assessment";
const pulleySupportCounts: Record<string, number> = {
  "PULL-GP-001": 1, "PULL-GP-002": 2, "PULL-GP-003": 3, "PULL-GP-004": 4, "PULL-GP-005": 2, "PULL-GP-006": 2, "PULL-GP-007": 2, "PULL-GP-008": 3, "PULL-GP-009": 4, "PULL-GP-010": 4,
  "PULL-IP-001": 1, "PULL-IP-002": 1, "PULL-IP-003": 2, "PULL-IP-004": 3, "PULL-IP-005": 4, "PULL-IP-006": 2, "PULL-IP-007": 2, "PULL-IP-008": 3, "PULL-IP-009": 4, "PULL-IP-010": 2, "PULL-IP-011": 3, "PULL-IP-012": 4, "PULL-IP-013": 2, "PULL-IP-014": 3, "PULL-IP-015": 4, "PULL-IP-016": 4, "PULL-IP-017": 2, "PULL-IP-018": 3, "PULL-IP-019": 3, "PULL-IP-020": 2, "PULL-IP-021": 4, "PULL-IP-022": 4, "PULL-IP-023": 2, "PULL-IP-024": 4, "PULL-IP-025": 3,
  "PULL-AS-001": 1, "PULL-AS-002": 2, "PULL-AS-003": 3, "PULL-AS-004": 4, "PULL-AS-005": 3, "PULL-AS-006": 4, "PULL-AS-007": 4, "PULL-AS-008": 3, "PULL-AS-009": 2, "PULL-AS-010": 4,
};
function PulleyQuestionDiagram({ question, mode }: { question: MvpQuestion; mode: PulleyQuestionMode }) {
  const count = pulleySupportCounts[question.questionId] ?? 2;
  const fixedOnly = count === 1;
  const helper = mode === "guided" ? question.feedbackCue : undefined;
  if (fixedOnly) return <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7"><div className="mb-4 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Pulley diagram</div><svg viewBox="0 0 760 330" role="img" aria-label="Single fixed pulley with a load on one side and a free end on the other" className="h-auto w-full"><line x1="170" y1="52" x2="590" y2="52" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round"/><circle cx="380" cy="100" r="48" fill="#171C23" stroke="rgba(255,255,255,0.28)" strokeWidth="5"/><path d="M 285 260 L 285 100 Q 285 52 333 52 L 427 52 Q 475 52 475 100 L 475 275" fill="none" stroke="#5ED3F3" strokeWidth="7" strokeLinecap="round"/><rect x="230" y="245" width="110" height="55" rx="12" fill="#252C35"/><text x="285" y="278" textAnchor="middle" fill="#F4F6F8" fontSize="20">Load</text><path d="M 475 210 L 475 285" stroke="#D9F8FF" strokeWidth="5"/><path d="M 460 268 L 475 292 L 490 268" fill="#D9F8FF"/><text x="525" y="265" fill="#AAB4C0" fontSize="18">Pull down</text></svg>{helper && <p className="mt-3 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">{helper}</p>}</div>;
  const xs = Array.from({ length: count }, (_, i) => 250 + (i * 260) / Math.max(count - 1, 1));
  return <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7"><div className="mb-4 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Pulley diagram</div><svg viewBox="0 0 760 350" role="img" aria-label={`Moving pulley block supported by ${count} rope sections`} className="h-auto w-full"><line x1="100" y1="55" x2="650" y2="55" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round"/>{xs.map((x,i)=><g key={x}><line x1={x} y1="70" x2={x} y2="220" stroke="#5ED3F3" strokeWidth="7" strokeLinecap="round"/>{mode === "guided" && <text x={x} y="135" textAnchor="middle" fill="#D9F8FF" fontSize="17">{i+1}</text>}</g>)}<rect x="205" y="215" width="350" height="62" rx="20" fill="#171C23" stroke="rgba(255,255,255,0.24)" strokeWidth="4"/><circle cx="300" cy="225" r="30" fill="#20262F" stroke="rgba(255,255,255,0.22)" strokeWidth="4"/><circle cx="460" cy="225" r="30" fill="#20262F" stroke="rgba(255,255,255,0.22)" strokeWidth="4"/><text x="380" y="256" textAnchor="middle" fill="#F4F6F8" fontSize="20" fontWeight="700">Moving block</text><rect x="300" y="280" width="160" height="48" rx="12" fill="#252C35"/><text x="380" y="311" textAnchor="middle" fill="#C8D2DD" fontSize="19">Load</text><line x1="600" y1="70" x2="600" y2="270" stroke="#8D98A6" strokeWidth="5" strokeDasharray="10 9"/><path d="M 586 252 L 600 276 L 614 252" fill="#8D98A6"/>{mode === "guided" && <text x="620" y="185" fill="#8D98A6" fontSize="16">Free end</text>}</svg>{helper && <p className="mt-3 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">{helper}</p>}</div>;
}

function PulleyPracticeIntroScreen({ stage, onStart }: { stage: "guided" | "independent" | "assessment"; onStart: () => void }) {
  const config = stage === "guided" ? { eyebrow: "Guided practice", title: "Guided Pulley Practice", body: "Ten diagram-based questions with immediate feedback. The diagrams help you apply the supporting-strand method.", items: ["10 questions", "Immediate feedback", "Guided diagrams"], button: "Begin guided practice" } : stage === "independent" ? { eyebrow: "Independent practice", title: "Independent Pulley Practice", body: "Twenty-five less-supported questions covering recognition, strand counting, force calculations and the distance tradeoff.", items: ["25 questions", "Immediate feedback", "Less support"], button: "Begin independent practice" } : { eyebrow: "Assessment-style check", title: "Pulley Check", body: "Ten questions with no immediate feedback. This gives a cleaner picture of what remains available independently.", items: ["10 questions", "No immediate feedback", "Untimed"], button: "Start Pulley Check" };
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{config.eyebrow}</p><h1 className="mt-5 text-4xl font-semibold">{config.title}</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">{config.body}</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{config.items.map((item)=><div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><div className="mt-10"><PrimaryButton onClick={onStart}>{config.button}</PrimaryButton></div></Card></section></Shell>;
}

function PulleyPracticeQuestionScreen({ journey, sessionId, questionIndex, onAnswer, questions, stage }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void; questions: MvpQuestion[]; stage: PulleyQuestionMode }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = questions[questionIndex]; if (!question) return null;
  const progress = ((questionIndex + 1) / questions.length) * 100;
  const answered = journey.responses.filter((r) => r.sessionId === sessionId).length;
  const immediate = stage !== "assessment";
  const selectedCorrect = selectedOptionId === question.correctOptionId;
  function select(optionId: string) { if (immediate && showFeedback) return; setSelectedOptionId(optionId); if (immediate) setShowFeedback(true); }
  function next() { if (!selectedOptionId) return; const response = createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false); onAnswer(response, questionIndex === questions.length - 1); }
  const title = stage === "guided" ? "Guided Pulley Practice" : stage === "independent" ? "Independent Pulley Practice" : "Pulley Check";
  return <Shell right={title}><section className={`mx-auto max-w-5xl px-8 pt-12 ${immediate ? "pb-44 sm:pb-12" : "pb-12"}`}><div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{title}</p><h1 className="mt-3 text-3xl font-semibold">Pulley reasoning</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {questions.length}<br/><span className="text-xs">{answered} saved</span></div></div><Card><PulleyQuestionDiagram question={question} mode={stage}/><p className="mt-7 text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p><div className="mt-8 grid gap-4">{question.options.map((option)=><button key={option.optionId} onClick={()=>select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div>{immediate && showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl sm:static sm:mt-7 sm:rounded-2xl sm:border sm:p-5 sm:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}><div className="mx-auto max-w-5xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>{!selectedCorrect && question.feedbackCue && <p className="mt-3 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}</div><div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === questions.length - 1 ? `Complete ${stage === "guided" ? "guided practice" : "independent practice"}` : "Next question"}</PrimaryButton></div></div></div></div>}{!immediate && <div className="mt-8 flex justify-end"><PrimaryButton disabled={!selectedOptionId} onClick={next}>{questionIndex === questions.length - 1 ? "Finish Pulley Check" : "Next question"}</PrimaryButton></div>}</Card></section></Shell>;
}

function PulleyDebriefScreen({ journey, stage, onWhy, onDashboard, onNext }: { journey: MvpGuestJourney; stage: "guided" | "independent" | "assessment"; onWhy: () => void; onDashboard: () => void; onNext?: () => void }) {
  const debrief = getLatestDebrief(journey); const rec = getCurrentRecommendation(journey);
  const sessionType = stage === "guided" ? "guided_pulley_practice" : stage === "independent" ? "pulley_independent_practice" : "pulley_assessment";
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === sessionType);
  const labels: Record<string,string> = { recognition: "System recognition", strand_count: "Supporting strands", force_distance: "Force & distance", mechanical_advantage: "Mechanical advantage" };
  const canUseNext = stage === "guided" ? rec?.recommendationType === "begin_pulley_independent_practice" : stage === "independent" ? rec?.recommendationType === "begin_pulley_assessment" : false;
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{stage === "assessment" ? "Pulley Check debrief" : "Pulley practice debrief"}</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-3">{summary.conceptBreakdown.map((item)=><div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{labels[item.concept] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton>{canUseNext && onNext && <PrimaryButton onClick={onNext}>{stage === "guided" ? "Start Independent Pulley Practice" : "Start Pulley Check"}</PrimaryButton>}<PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) { const [password, setPassword] = useState(""); const [error, setError] = useState(false); return <main className="flex min-h-screen items-center justify-center bg-[#111418] p-8 text-[#F4F6F8]"><section className="w-full max-w-md rounded-[32px] border border-white/5 bg-[#171C23] p-10 shadow-2xl"><div className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">FloSpatial</div><h1 className="mt-6 text-4xl font-semibold">Private testing access</h1><p className="mt-5 text-[#9AA3B2]">Enter the shared testing password to continue.</p><form onSubmit={(e) => { e.preventDefault(); if (password.trim() === TEST_ACCESS_PASSWORD) { window.localStorage.setItem("flospatial.accessGranted.v1", "true"); onUnlock(); } else setError(true); }} className="mt-8"><input value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} type="password" autoFocus className="w-full rounded-xl border border-white/10 bg-[#111418] px-4 py-4 outline-none focus:border-[#5ED3F3]/50" placeholder="Password" />{error && <p className="mt-3 text-sm text-[#FF9A9A]">That password did not match.</p>}<button className="mt-6 w-full rounded-xl border border-[#5ED3F3]/30 bg-[#5ED3F3]/10 px-7 py-4 font-medium text-[#D9F8FF]">Enter</button></form></section></main>; }

export default function FloSpatialPrototype() {
  const [accessGranted, setAccessGranted] = useState(() => !ENABLE_PASSWORD_GATE || (typeof window !== "undefined" && window.localStorage.getItem("flospatial.accessGranted.v1") === "true"));
  const [journey, setJourney] = useState<MvpGuestJourney>(() => loadMvpGuestJourney());
  const [screen, setScreen] = useState<AppScreen>(() => getResumeState(journey).screen);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(() => getResumeState(journey).activeSessionId);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(() => getResumeState(journey).activeQuestionIndex);
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => { saveMvpGuestJourney(journey); }, [journey]);
  const activeSession = useMemo(() => activeSessionId ? journey.sessions.find((s) => s.sessionId === activeSessionId) : undefined, [activeSessionId, journey.sessions]);
  if (!accessGranted) return <PasswordGate onUnlock={() => setAccessGranted(true)} />;

  function updateJourney(next: MvpGuestJourney) { setJourney({ ...next, updatedAt: now() }); }
  function selectFireService() { updateJourney({ ...journey, selectedPathwayId: "fire_service" }); setScreen("preparation-context"); }
  function saveContext(context: PreparationContext) { updateJourney({ ...journey, preparationContext: context }); setScreen("mechanical-baseline-intro"); }
  function startBaseline() { const session = createMechanicalBaselineSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setScreen("mechanical-baseline-question"); }
  function handleAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeMechanicalBaseline(withResponse, activeSessionId); updateJourney(completed); setScreen("assessment-complete"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function resetDemo() { resetMvpGuestJourney(); const empty = createEmptyMvpGuestJourney(); setJourney(empty); setActiveSessionId(undefined); setActiveQuestionIndex(0); setShowWhy(false); setScreen("landing"); }
  function loadTestScenario(scenario: TestScenario) { const next = createTestScenarioJourney(scenario); updateJourney(next); setActiveSessionId(undefined); setActiveQuestionIndex(0); setShowWhy(false); setScreen("dashboard"); }
  function openHydraulicFundamentals() { const next = startHydraulicFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("hydraulic-fundamentals"); }
  function completeHydraulicsModule() { const next = completeHydraulicFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("hydraulic-fundamentals-complete"); }
  function openGuidedPracticeIntro() { setShowWhy(false); setScreen("guided-hydraulic-practice-intro"); }
  function startGuidedPractice() { const session = createGuidedHydraulicPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("guided-hydraulic-practice-question"); }
  function handleGuidedAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeGuidedHydraulicPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("guided-hydraulic-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openMixedPracticeIntro() { setShowWhy(false); setScreen("mixed-mechanical-practice-intro"); }
  function openGearFundamentals() { const next = startGearFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("gear-fundamentals"); }
  function completeGearModule() { const next = completeGearFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("gear-fundamentals-complete"); }
  function openGuidedGearPracticeIntro() { setShowWhy(false); setScreen("guided-gear-practice-intro"); }
  function startGuidedGearPractice() { const session = createGuidedGearPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("guided-gear-practice-question"); }
  function handleGuidedGearAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeGuidedGearPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("guided-gear-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openGearIndependentPracticeIntro() { setShowWhy(false); setScreen("gear-independent-practice-intro"); }
  function startGearIndependentPractice() { const session = createGearIndependentPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("gear-independent-practice-question"); }
  function handleGearIndependentPracticeAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeGearIndependentPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("gear-independent-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openGearAssessmentIntro() { setShowWhy(false); setScreen("gear-assessment-intro"); }
  function startGearAssessment() { const session = createGearAssessmentSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("gear-assessment-question"); }
  function handleGearAssessmentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeGearAssessment(withResponse, activeSessionId); updateJourney(completed); setScreen("gear-assessment-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openPulleyFundamentals() { const next = startPulleyFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("pulley-fundamentals"); }
  function completePulleyModule() { const next = completePulleyFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("pulley-fundamentals-complete"); }
  function openGuidedPulleyPracticeIntro() { setShowWhy(false); setScreen("guided-pulley-practice-intro"); }
  function startGuidedPulleyPractice() { const session = createGuidedPulleyPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("guided-pulley-practice-question"); }
  function handleGuidedPulleyAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeGuidedPulleyPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("guided-pulley-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openPulleyIndependentPracticeIntro() { setShowWhy(false); setScreen("pulley-independent-practice-intro"); }
  function startPulleyIndependentPractice() { const session = createPulleyIndependentPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("pulley-independent-practice-question"); }
  function handlePulleyIndependentPracticeAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completePulleyIndependentPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("pulley-independent-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openPulleyAssessmentIntro() { setShowWhy(false); setScreen("pulley-assessment-intro"); }
  function startPulleyAssessment() { const session = createPulleyAssessmentSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("pulley-assessment-question"); }
  function handlePulleyAssessmentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completePulleyAssessment(withResponse, activeSessionId); updateJourney(completed); setScreen("pulley-assessment-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function startMixedPractice() { const session = createMixedMechanicalPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("mixed-mechanical-practice-question"); }
  function handleMixedAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeMixedMechanicalPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("mixed-mechanical-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }

  const why = getCurrentWhy(journey);
  return <>{showWhy && <WhyModal why={why} onClose={() => setShowWhy(false)} />}{screen === "landing" && <LandingScreen onBegin={() => setScreen("pathway-selection")} onLoadTestScenario={loadTestScenario} />}{screen === "pathway-selection" && <PathwaySelectionScreen onSelect={selectFireService} />}{screen === "preparation-context" && <PreparationContextScreen onSave={saveContext} />}{screen === "mechanical-baseline-intro" && <BaselineIntroScreen onStart={startBaseline} />}{screen === "mechanical-baseline-question" && activeSession && <MechanicalQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleAnswer} />}{screen === "assessment-complete" && <AssessmentCompleteScreen onView={() => setScreen("first-advisor-insight")} />}{screen === "first-advisor-insight" && <FirstAdvisorInsightScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "dashboard" && <DashboardScreen journey={journey} onWhy={() => setShowWhy(true)} onReset={resetDemo} onStartHydraulics={openHydraulicFundamentals} onStartGuidedPractice={openGuidedPracticeIntro} onStartMixedPractice={openMixedPracticeIntro} onStartGearFundamentals={openGearFundamentals} onStartGuidedGearPractice={openGuidedGearPracticeIntro} onStartGearIndependentPractice={openGearIndependentPracticeIntro} onStartGearAssessment={openGearAssessmentIntro} onStartPulleyFundamentals={openPulleyFundamentals} onStartGuidedPulleyPractice={openGuidedPulleyPracticeIntro} onStartPulleyIndependentPractice={openPulleyIndependentPracticeIntro} onStartPulleyAssessment={openPulleyAssessmentIntro} onLoadTestScenario={loadTestScenario} />}{screen === "hydraulic-fundamentals" && <HydraulicFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeHydraulicsModule} />}{screen === "hydraulic-fundamentals-complete" && <HydraulicFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuidedPractice={openGuidedPracticeIntro} />}{screen === "guided-hydraulic-practice-intro" && <GuidedHydraulicPracticeIntroScreen onStart={startGuidedPractice} />}{screen === "guided-hydraulic-practice-question" && activeSession && <GuidedHydraulicQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedAnswer} />}{screen === "guided-hydraulic-practice-debrief" && <GuidedHydraulicPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "mixed-mechanical-practice-intro" && <MixedMechanicalPracticeIntroScreen onStart={startMixedPractice} />}{screen === "mixed-mechanical-practice-question" && activeSession && <MixedMechanicalQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleMixedAnswer} />}{screen === "mixed-mechanical-practice-debrief" && <MixedMechanicalPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "gear-fundamentals" && <GearFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeGearModule} />}{screen === "guided-gear-practice-intro" && <GuidedGearPracticeIntroScreen onStart={startGuidedGearPractice} />}{screen === "guided-gear-practice-question" && activeSession && <GuidedGearQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedGearAnswer} />}{screen === "guided-gear-practice-debrief" && <GuidedGearPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGearIndependentPractice={openGearIndependentPracticeIntro} />}{screen === "gear-independent-practice-intro" && <GearIndependentPracticeIntroScreen onStart={startGearIndependentPractice} />}{screen === "gear-independent-practice-question" && activeSession && <GearIndependentPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGearIndependentPracticeAnswer} />}{screen === "gear-independent-practice-debrief" && <GearIndependentPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "gear-assessment-intro" && <GearAssessmentIntroScreen onStart={startGearAssessment} />}{screen === "gear-assessment-question" && activeSession && <GearAssessmentQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGearAssessmentAnswer} />}{screen === "gear-assessment-debrief" && <GearAssessmentDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "gear-fundamentals-complete" && <GearFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuidedGearPractice={openGuidedGearPracticeIntro} />}{screen === "pulley-fundamentals" && <PulleyFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completePulleyModule} />}{screen === "pulley-fundamentals-complete" && <PulleyFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuidedPulleyPractice={openGuidedPulleyPracticeIntro} />}{screen === "guided-pulley-practice-intro" && <PulleyPracticeIntroScreen stage="guided" onStart={startGuidedPulleyPractice} />}{screen === "guided-pulley-practice-question" && activeSession && <PulleyPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedPulleyAnswer} questions={guidedPulleyPracticeQuestions} stage="guided" />}{screen === "guided-pulley-practice-debrief" && <PulleyDebriefScreen journey={journey} stage="guided" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openPulleyIndependentPracticeIntro} />}{screen === "pulley-independent-practice-intro" && <PulleyPracticeIntroScreen stage="independent" onStart={startPulleyIndependentPractice} />}{screen === "pulley-independent-practice-question" && activeSession && <PulleyPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handlePulleyIndependentPracticeAnswer} questions={pulleyIndependentPracticeQuestions} stage="independent" />}{screen === "pulley-independent-practice-debrief" && <PulleyDebriefScreen journey={journey} stage="independent" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openPulleyAssessmentIntro} />}{screen === "pulley-assessment-intro" && <PulleyPracticeIntroScreen stage="assessment" onStart={startPulleyAssessment} />}{screen === "pulley-assessment-question" && activeSession && <PulleyPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handlePulleyAssessmentAnswer} questions={pulleyAssessmentQuestions} stage="assessment" />}{screen === "pulley-assessment-debrief" && <PulleyDebriefScreen journey={journey} stage="assessment" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}</>;
}
