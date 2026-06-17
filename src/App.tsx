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
  | "gear-fundamentals-complete";

type TestScenario =
  | "hydraulic_baseline"
  | "hydraulic_module_complete"
  | "guided_strong_improvement"
  | "guided_moderate_improvement"
  | "guided_no_clear_improvement"
  | "mixed_gear_focus";

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
  sessionType: "mechanical_starting_point" | "guided_hydraulic_practice" | "mixed_mechanical_practice";
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
  sessionType: "mechanical_starting_point" | "guided_hydraulic_practice" | "mixed_mechanical_practice";
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
    | "begin_guided_gear_practice";
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
    | "second_focus_identified";
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

type LearningModuleId = "hydraulic_fundamentals" | "gear_fundamentals";

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
  sessionType: "guided_hydraulic_practice" | "mixed_mechanical_practice";
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
const ENABLE_PASSWORD_GATE = true;

function id(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function now() { return new Date().toISOString(); }

function createEmptyMvpGuestJourney(): MvpGuestJourney {
  return { version: "mvp_v1", guestJourneyId: id("guest"), sessions: [], responses: [], competencyEvidence: [], observations: [], constraints: [], recommendations: [], whyExplanations: [], readinessSnapshots: [], milestones: [], moduleProgress: [], moduleCompletions: [], practiceSummaries: [], debriefs: [], updatedAt: now() };
}
function loadMvpGuestJourney(): MvpGuestJourney {
  if (typeof window === "undefined") return createEmptyMvpGuestJourney();
  const raw = window.localStorage.getItem(MVP_GUEST_JOURNEY_KEY);
  if (!raw) return createEmptyMvpGuestJourney();
  try {
    const parsed = JSON.parse(raw) as MvpGuestJourney;
    return parsed.version === "mvp_v1" ? { ...createEmptyMvpGuestJourney(), ...parsed } : createEmptyMvpGuestJourney();
  } catch { return createEmptyMvpGuestJourney(); }
}
function saveMvpGuestJourney(journey: MvpGuestJourney) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MVP_GUEST_JOURNEY_KEY, JSON.stringify({ ...journey, updatedAt: now() }));
}
function resetMvpGuestJourney() {
  if (typeof window !== "undefined") window.localStorage.removeItem(MVP_GUEST_JOURNEY_KEY);
}

function makeQuestion(questionId: string, subcompetency: MechanicalSubcompetency, concept: string, stem: string, options: string[], correctLabel: "A" | "B" | "C" | "D", explanation: string): MvpQuestion {
  const labels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  const qOptions = labels.map((label, index) => ({ optionId: `${questionId}-${label}`, label, text: options[index] }));
  return { questionId, sessionType: "mechanical_starting_point", pathwayId: "fire_service", domain: "mechanical", subcompetency, concept, difficulty: "foundational", stem, options: qOptions, correctOptionId: `${questionId}-${correctLabel}`, explanation };
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


function makePracticeQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: "A" | "B" | "C" | "D", explanation: string, feedbackCue: string): MvpQuestion {
  const labels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  const qOptions = labels.map((label, index) => ({ optionId: `${questionId}-${label}`, label, text: options[index] }));
  return { questionId, sessionType: "guided_hydraulic_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "hydraulics", concept, difficulty: "developing", stem, options: qOptions, correctOptionId: `${questionId}-${correctLabel}`, explanation, feedbackCue };
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

function makeMixedQuestion(questionId: string, subcompetency: MechanicalSubcompetency, concept: string, stem: string, options: string[], correctLabel: "A" | "B" | "C" | "D", explanation: string, feedbackCue: string): MvpQuestion {
  const labels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  const qOptions = labels.map((label, index) => ({ optionId: `${questionId}-${label}`, label, text: options[index] }));
  return { questionId, sessionType: "mixed_mechanical_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency, concept, difficulty: "developing", stem, options: qOptions, correctOptionId: `${questionId}-${correctLabel}`, explanation, feedbackCue };
}

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

function makeMiniCheck(questionId: string, stem: string, options: string[], correctLabel: "A" | "B" | "C" | "D", explanation: string): LearningMiniCheck {
  const labels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  return {
    questionId,
    stem,
    options: labels.map((label, index) => moduleOption(questionId, label, options[index])),
    correctOptionId: `${questionId}-${correctLabel}`,
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
      body: "You have completed Gear Fundamentals. FloSpatial now has a structured foundation for gear direction, gear trains, idlers, gear size and simple ratios. The next step is guided gear practice, which will be added as the next evidence check.",
      keyPoint: "Gear Fundamentals complete. Guided gear practice is the next planned evidence check.",
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
    recommendation: "Guided Gear Practice is recommended as the next evidence check. This practice set is planned for the next build.",
    confidence: "High. Follow-up practice is the appropriate next step after targeted learning.",
    createdAt: now(),
  };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: "begin_guided_gear_practice", title: "Begin Guided Gear Practice", summary: "Check whether gear direction, idler and gear-size concepts transfer into practice. This module is planned for the next build.", actionLabel: "Begin Guided Gear Practice", confidence: "high", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
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

function LandingScreen({ onBegin, onLoadTestScenario }: { onBegin: () => void; onLoadTestScenario: (scenario: TestScenario) => void }) { return <Shell><section className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-8 py-20"><div className="max-w-2xl"><Badge>No account or email required to begin</Badge><h1 className="mt-8 text-5xl font-semibold leading-tight tracking-tight md:text-6xl">Prepare smarter for selection assessments.</h1><p className="mt-8 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">FloSpatial helps you identify what to work on, why it matters, and what to do next.</p><div className="mt-12"><PrimaryButton onClick={onBegin}>Begin preparation</PrimaryButton></div></div><div className="mt-20 grid gap-5 md:grid-cols-3"><Card><h3 className="text-lg font-semibold">Find your focus</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">FloSpatial looks for the preparation area most likely to matter next.</p></Card><Card><h3 className="text-lg font-semibold">Understand why</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">Every major recommendation includes a clear explanation.</p></Card><Card><h3 className="text-lg font-semibold">Track progress</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">Your preparation journey is saved on this device.</p></Card></div><div className="mt-10"><TestScenarioPanel onLoad={onLoadTestScenario} /></div></section></Shell>; }
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
function DashboardScreen({ journey, onWhy, onReset, onStartHydraulics, onStartGuidedPractice, onStartMixedPractice, onStartGearFundamentals, onLoadTestScenario }: { journey: MvpGuestJourney; onWhy: () => void; onReset: () => void; onStartHydraulics: () => void; onStartGuidedPractice: () => void; onStartMixedPractice: () => void; onStartGearFundamentals: () => void; onLoadTestScenario: (scenario: TestScenario) => void }) {
  const rec = getCurrentRecommendation(journey);
  const readiness = getCurrentReadiness(journey);
  const milestones = getRecentMilestones(journey);
  const canStartHydraulics = rec?.recommendationType === "start_hydraulic_fundamentals";
  const canStartGuided = rec?.recommendationType === "begin_guided_hydraulic_practice" || rec?.recommendationType === "continue_guided_hydraulic_practice" || rec?.title?.toLowerCase().includes("guided hydraulic practice") || rec?.actionLabel?.toLowerCase().includes("guided practice");
  const canStartMixed = rec?.recommendationType === "begin_mixed_mechanical_practice" || rec?.title?.toLowerCase().includes("mixed mechanical practice") || rec?.actionLabel?.toLowerCase().includes("mixed practice");
  const canStartGear = rec?.recommendationType === "start_gear_fundamentals" || rec?.title?.toLowerCase().includes("gear fundamentals") || rec?.actionLabel?.toLowerCase().includes("gear fundamentals");
  return <Shell><section className="mx-auto max-w-6xl px-8 py-12"><div className="mb-9"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Dashboard</p><h1 className="mt-3 text-4xl font-semibold">Your preparation cockpit</h1></div><div className="grid gap-5 lg:grid-cols-2"><Card className="lg:col-span-2"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-3xl font-semibold">{rec?.title}</h2><p className="mt-3 max-w-2xl text-[#AAB4C0]">{rec?.summary}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row">{canStartHydraulics ? <PrimaryButton onClick={onStartHydraulics}>Start module</PrimaryButton> : canStartGuided ? <PrimaryButton onClick={onStartGuidedPractice}>Begin practice</PrimaryButton> : canStartMixed ? <PrimaryButton onClick={onStartMixedPractice}>Start mixed practice</PrimaryButton> : canStartGear ? <PrimaryButton onClick={onStartGearFundamentals}>Start module</PrimaryButton> : <PrimaryButton disabled>{rec?.actionLabel} — coming soon</PrimaryButton>}<SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton></div></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Current focus</div><h3 className="mt-3 text-2xl font-semibold">{journey.dashboardState?.currentFocusLabel}</h3><p className="mt-3 text-[#9AA3B2]">This is the area FloSpatial currently recommends addressing next. If no clear weakness is identified, this may be a structured progression step rather than a weakness signal.</p></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Readiness snapshot</div><h3 className="mt-3 text-2xl font-semibold">{readiness?.label}</h3><p className="mt-3 text-[#9AA3B2]">{readiness?.explanation}</p></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recent progress</div><ul className="mt-4 space-y-3 text-[#C8D2DD]">{milestones.map((m) => <li key={m.milestoneId}>• {m.label}</li>)}</ul></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Starting point summary</div><p className="mt-4 text-[#C8D2DD]">{journey.dashboardState?.baselineSummary?.mechanicalQuestionsCompleted ?? 0} mechanical reasoning questions completed.</p>{journey.dashboardState?.baselineSummary?.focusArea && <p className="mt-3 text-[#9AA3B2]">Initial focus: {journey.dashboardState.baselineSummary.focusArea}</p>}</Card><Card className="lg:col-span-2"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Save status</div><p className="mt-4 text-[#C8D2DD]">Progress saved on this device.</p><p className="mt-3 text-[#9AA3B2]">You can continue without creating an account. A free username option can be added later for cross-device continuity.</p><div className="mt-7"><SecondaryButton onClick={onReset}>Reset local demo journey</SecondaryButton></div></Card><div className="lg:col-span-2"><TestScenarioPanel onLoad={onLoadTestScenario} /></div></div></section></Shell>;
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

function GearFundamentalsCompleteScreen({ journey, onWhy, onDashboard }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Learning action complete</p><h1 className="mt-6 text-4xl font-semibold leading-tight">Gear Fundamentals complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">FloSpatial has updated your preparation journey. The next planned step is to check whether these gear concepts transfer into guided practice.</p><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>{rec?.confidence === "high" ? "High confidence" : "Moderate confidence"}</Badge></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton disabled>{rec?.actionLabel ?? "Begin Guided Gear Practice"} — coming soon</PrimaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
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

function PasswordGate({ onUnlock }: { onUnlock: () => void }) { const [password, setPassword] = useState(""); const [error, setError] = useState(false); return <main className="flex min-h-screen items-center justify-center bg-[#111418] p-8 text-[#F4F6F8]"><section className="w-full max-w-md rounded-[32px] border border-white/5 bg-[#171C23] p-10 shadow-2xl"><div className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">FloSpatial</div><h1 className="mt-6 text-4xl font-semibold">Private testing access</h1><p className="mt-5 text-[#9AA3B2]">Enter the shared testing password to continue.</p><form onSubmit={(e) => { e.preventDefault(); if (password.trim() === TEST_ACCESS_PASSWORD) { window.localStorage.setItem("flospatial.accessGranted.v1", "true"); onUnlock(); } else setError(true); }} className="mt-8"><input value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} type="password" autoFocus className="w-full rounded-xl border border-white/10 bg-[#111418] px-4 py-4 outline-none focus:border-[#5ED3F3]/50" placeholder="Password" />{error && <p className="mt-3 text-sm text-[#FF9A9A]">That password did not match.</p>}<button className="mt-6 w-full rounded-xl border border-[#5ED3F3]/30 bg-[#5ED3F3]/10 px-7 py-4 font-medium text-[#D9F8FF]">Enter</button></form></section></main>; }

export default function FloSpatialPrototype() {
  const [accessGranted, setAccessGranted] = useState(() => !ENABLE_PASSWORD_GATE || (typeof window !== "undefined" && window.localStorage.getItem("flospatial.accessGranted.v1") === "true"));
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [journey, setJourney] = useState<MvpGuestJourney>(() => loadMvpGuestJourney());
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
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
  function startMixedPractice() { const session = createMixedMechanicalPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("mixed-mechanical-practice-question"); }
  function handleMixedAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeMixedMechanicalPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("mixed-mechanical-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }

  const why = getCurrentWhy(journey);
  return <>{showWhy && <WhyModal why={why} onClose={() => setShowWhy(false)} />}{screen === "landing" && <LandingScreen onBegin={() => setScreen("pathway-selection")} onLoadTestScenario={loadTestScenario} />}{screen === "pathway-selection" && <PathwaySelectionScreen onSelect={selectFireService} />}{screen === "preparation-context" && <PreparationContextScreen onSave={saveContext} />}{screen === "mechanical-baseline-intro" && <BaselineIntroScreen onStart={startBaseline} />}{screen === "mechanical-baseline-question" && activeSession && <MechanicalQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleAnswer} />}{screen === "assessment-complete" && <AssessmentCompleteScreen onView={() => setScreen("first-advisor-insight")} />}{screen === "first-advisor-insight" && <FirstAdvisorInsightScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "dashboard" && <DashboardScreen journey={journey} onWhy={() => setShowWhy(true)} onReset={resetDemo} onStartHydraulics={openHydraulicFundamentals} onStartGuidedPractice={openGuidedPracticeIntro} onStartMixedPractice={openMixedPracticeIntro} onStartGearFundamentals={openGearFundamentals} onLoadTestScenario={loadTestScenario} />}{screen === "hydraulic-fundamentals" && <HydraulicFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeHydraulicsModule} />}{screen === "hydraulic-fundamentals-complete" && <HydraulicFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuidedPractice={openGuidedPracticeIntro} />}{screen === "guided-hydraulic-practice-intro" && <GuidedHydraulicPracticeIntroScreen onStart={startGuidedPractice} />}{screen === "guided-hydraulic-practice-question" && activeSession && <GuidedHydraulicQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedAnswer} />}{screen === "guided-hydraulic-practice-debrief" && <GuidedHydraulicPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "mixed-mechanical-practice-intro" && <MixedMechanicalPracticeIntroScreen onStart={startMixedPractice} />}{screen === "mixed-mechanical-practice-question" && activeSession && <MixedMechanicalQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleMixedAnswer} />}{screen === "mixed-mechanical-practice-debrief" && <MixedMechanicalPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "gear-fundamentals" && <GearFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeGearModule} />}{screen === "gear-fundamentals-complete" && <GearFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}</>;
}
