import { useEffect, useMemo, useRef, useState } from "react";

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
  | "hydraulic-independent-practice-intro"
  | "hydraulic-independent-practice-question"
  | "hydraulic-independent-practice-debrief"
  | "hydraulic-transfer-reflection"
  | "save-progress"
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
  | "pulley-assessment-debrief"
  | "lever-fundamentals"
  | "lever-fundamentals-complete"
  | "guided-lever-practice-intro"
  | "guided-lever-practice-question"
  | "guided-lever-practice-debrief"
  | "lever-independent-practice-intro"
  | "lever-independent-practice-question"
  | "lever-independent-practice-debrief"
  | "lever-assessment-intro"
  | "lever-assessment-question"
  | "lever-assessment-debrief"
  | "mixed-mechanical-assessment-intro"
  | "mixed-mechanical-assessment-question"
  | "mixed-mechanical-assessment-debrief"
  | "numerical-fundamentals"
  | "numerical-fundamentals-complete"
  | "guided-numerical-practice-intro"
  | "guided-numerical-practice-question"
  | "guided-numerical-practice-debrief"
  | "numerical-independent-practice-intro"
  | "numerical-independent-practice-question"
  | "numerical-independent-practice-debrief"
  | "numerical-assessment-intro"
  | "numerical-assessment-question"
  | "numerical-assessment-debrief"
  | "abstract-logical-fundamentals"
  | "abstract-logical-fundamentals-complete"
  | "guided-abstract-logical-practice-intro"
  | "guided-abstract-logical-practice-question"
  | "guided-abstract-logical-practice-debrief"
  | "abstract-logical-independent-practice-intro"
  | "abstract-logical-independent-practice-question"
  | "abstract-logical-independent-practice-debrief"
  | "abstract-logical-assessment-intro"
  | "abstract-logical-assessment-question"
  | "abstract-logical-assessment-debrief"
  | "verbal-fundamentals"
  | "verbal-fundamentals-complete"
  | "guided-verbal-practice-intro"
  | "guided-verbal-practice-question"
  | "guided-verbal-practice-debrief"
  | "verbal-independent-practice-intro"
  | "verbal-independent-practice-question"
  | "verbal-independent-practice-debrief"
  | "verbal-assessment-intro"
  | "verbal-assessment-question"
  | "verbal-assessment-debrief"
  | "answer-review";

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
  | "pulley_independent_strong"
  | "lever_guided_ready"
  | "lever_guided_strong"
  | "lever_independent_strong"
  | "mixed_assessment_pulley_focus"
  | "abstract_guided_ready"
  | "abstract_guided_strong"
  | "abstract_independent_strong"
  | "verbal_guided_ready"
  | "verbal_guided_strong"
  | "verbal_independent_strong";

type PathwayId = "fire_service";
type MechanicalSubcompetency = "hydraulics" | "gears" | "pulleys" | "levers";
type NumericalSubcompetency = "arithmetic_estimation" | "percentages_ratios" | "rates_proportion" | "tables_data";
type AbstractLogicalSubcompetency = "pattern_sequences" | "matrices_rules" | "classification_relationships" | "deductive_reasoning";
type VerbalSubcompetency = "explicit_information" | "inference_context" | "instructions_sequence" | "assumptions_conclusions";
type Domain = "mechanical" | "numerical" | "abstract_logical" | "verbal";
type Subcompetency = MechanicalSubcompetency | NumericalSubcompetency | AbstractLogicalSubcompetency | VerbalSubcompetency;
type NumericalDataTable = { headers: string[]; rows: string[][] };
type AbstractVisual = { kind: "sequence" | "matrix" | "set"; rows: string[][]; caption?: string };
type VerbalPassage = { title?: string; text: string; label?: string };
type ReviewableSessionType =
  | "hydraulic_independent_practice"
  | "gear_independent_practice"
  | "pulley_independent_practice"
  | "lever_independent_practice"
  | "numerical_independent_practice"
  | "abstract_logical_independent_practice"
  | "verbal_independent_practice"
  | "gear_assessment"
  | "pulley_assessment"
  | "lever_assessment"
  | "numerical_assessment"
  | "abstract_logical_assessment"
  | "verbal_assessment"
  | "mixed_mechanical_assessment";
type ReviewMode = "incorrect" | "all";
type AnswerReviewContext = {
  sessionId: string;
  sessionType: ReviewableSessionType;
  mode: ReviewMode;
  returnScreen: AppScreen;
};
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
  sessionType: "mechanical_starting_point" | "guided_hydraulic_practice" | "hydraulic_independent_practice" | "mixed_mechanical_practice" | "guided_gear_practice" | "gear_independent_practice" | "gear_assessment" | "guided_pulley_practice" | "pulley_independent_practice" | "pulley_assessment" | "guided_lever_practice" | "lever_independent_practice" | "lever_assessment" | "mixed_mechanical_assessment" | "guided_numerical_practice" | "numerical_independent_practice" | "numerical_assessment" | "guided_abstract_logical_practice" | "abstract_logical_independent_practice" | "abstract_logical_assessment" | "guided_verbal_practice" | "verbal_independent_practice" | "verbal_assessment";
  pathwayId: PathwayId;
  domain: Domain;
  subcompetency: Subcompetency;
  concept: string;
  difficulty: "foundational" | "developing" | "applied";
  stem: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  feedbackCue?: string;
  dataTable?: NumericalDataTable;
  abstractVisual?: AbstractVisual;
  verbalPassage?: VerbalPassage;
};

type AssessmentSession = {
  sessionId: string;
  sessionType: "mechanical_starting_point" | "guided_hydraulic_practice" | "hydraulic_independent_practice" | "mixed_mechanical_practice" | "guided_gear_practice" | "gear_independent_practice" | "gear_assessment" | "guided_pulley_practice" | "pulley_independent_practice" | "pulley_assessment" | "guided_lever_practice" | "lever_independent_practice" | "lever_assessment" | "mixed_mechanical_assessment" | "guided_numerical_practice" | "numerical_independent_practice" | "numerical_assessment" | "guided_abstract_logical_practice" | "abstract_logical_independent_practice" | "abstract_logical_assessment" | "guided_verbal_practice" | "verbal_independent_practice" | "verbal_assessment";
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
  domain: Domain;
  subcompetency: Subcompetency;
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
  domain: Domain;
  subcompetency?: Subcompetency;
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
    | "begin_hydraulic_independent_practice"
    | "continue_hydraulic_independent_practice"
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
    | "repeat_pulley_assessment"
    | "begin_guided_lever_practice"
    | "continue_guided_lever_practice"
    | "begin_lever_independent_practice"
    | "continue_lever_independent_practice"
    | "review_lever_fundamentals"
    | "begin_lever_assessment"
    | "repeat_lever_assessment"
    | "begin_mixed_mechanical_assessment"
    | "repeat_mixed_mechanical_assessment"
    | "start_numerical_fundamentals"
    | "begin_guided_numerical_practice"
    | "continue_guided_numerical_practice"
    | "begin_numerical_independent_practice"
    | "continue_numerical_independent_practice"
    | "review_numerical_fundamentals"
    | "begin_numerical_assessment"
    | "repeat_numerical_assessment"
    | "continue_numerical_practice"
    | "start_abstract_logical_fundamentals"
    | "begin_guided_abstract_logical_practice"
    | "continue_guided_abstract_logical_practice"
    | "begin_abstract_logical_independent_practice"
    | "continue_abstract_logical_independent_practice"
    | "review_abstract_logical_fundamentals"
    | "begin_abstract_logical_assessment"
    | "repeat_abstract_logical_assessment"
    | "continue_abstract_logical_practice"
    | "start_verbal_fundamentals"
    | "begin_guided_verbal_practice"
    | "continue_guided_verbal_practice"
    | "begin_verbal_independent_practice"
    | "continue_verbal_independent_practice"
    | "review_verbal_fundamentals"
    | "begin_verbal_assessment"
    | "repeat_verbal_assessment"
    | "continue_verbal_practice";
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
    | "hydraulic_independent_practice_completed"
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
    | "pulley_pathway_completed"
    | "guided_lever_practice_completed"
    | "lever_independent_practice_completed"
    | "lever_improvement_signal"
    | "lever_assessment_completed"
    | "lever_pathway_completed"
    | "mixed_mechanical_assessment_completed"
    | "guided_numerical_practice_completed"
    | "numerical_independent_practice_completed"
    | "numerical_assessment_completed"
    | "numerical_pathway_completed"
    | "guided_abstract_logical_practice_completed"
    | "abstract_logical_independent_practice_completed"
    | "abstract_logical_assessment_completed"
    | "abstract_logical_pathway_completed"
    | "guided_verbal_practice_completed"
    | "verbal_independent_practice_completed"
    | "verbal_assessment_completed"
    | "verbal_pathway_completed";
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
  startingAssessmentSummary?: {
    questionsCompleted: number;
    domainScores: Record<Domain, { attempted: number; correct: number }>;
    recommendedDomain: Domain;
    recommendedFocus?: string;
  };
  saveStatus: "local_only" | "username_account";
  updatedAt: string;
};

type LearningModuleId = "hydraulic_fundamentals" | "gear_fundamentals" | "pulley_fundamentals" | "lever_fundamentals" | "numerical_fundamentals" | "abstract_logical_fundamentals" | "verbal_fundamentals";

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
  targetDomain: Domain;
  targetSubcompetency: Subcompetency;
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
  sessionType: "guided_hydraulic_practice" | "hydraulic_independent_practice" | "mixed_mechanical_practice" | "guided_gear_practice" | "gear_independent_practice" | "gear_assessment" | "guided_pulley_practice" | "pulley_independent_practice" | "pulley_assessment" | "guided_lever_practice" | "lever_independent_practice" | "lever_assessment" | "mixed_mechanical_assessment" | "guided_numerical_practice" | "numerical_independent_practice" | "numerical_assessment" | "guided_abstract_logical_practice" | "abstract_logical_independent_practice" | "abstract_logical_assessment" | "guided_verbal_practice" | "verbal_independent_practice" | "verbal_assessment";
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

type PrototypeAccountProfile = { firstName: string; username: string; createdAt: string };

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
  prototypeAccount?: PrototypeAccountProfile;
  updatedAt: string;
};

const MVP_GUEST_JOURNEY_KEY = "flospatial.mvpGuestJourney.v1";
const TEST_ACCESS_PASSWORD = "flospatial";
const ENABLE_PASSWORD_GATE = import.meta.env.VITE_ENABLE_PASSWORD_GATE !== "false";
// Keep prototype testing shortcuts visible during the current alpha testing phase.
const SHOW_TEST_SCENARIOS = true;
const BUILD_LABEL = "Hydraulic Pressure Journey v1.0";

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

function makePracticeQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string, feedbackCue: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "guided_hydraulic_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "hydraulics", concept, difficulty: "developing", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation, feedbackCue };
}

const guidedHydraulicPracticeQuestions: MvpQuestion[] = [
  makePracticeQuestion(
    "HYD-GP-001",
    "pressure_transfer",
    "In an ideal sealed hydraulic system, which quantity is transmitted unchanged through the fluid?",
    ["Pressure", "Force", "Piston area", "Movement distance"],
    "A",
    "Pressure is transmitted through the confined fluid. Start by finding what stays the same.",
    "What stays the same? Pressure."
  ),
  makePracticeQuestion(
    "HYD-GP-002",
    "piston_area_force",
    "The same pressure acts on a small piston and a larger piston. Which piston produces the greater force?",
    ["The larger piston", "The smaller piston", "They produce the same force", "Neither piston produces force"],
    "A",
    "The larger piston produces greater force because the same pressure acts over a larger area.",
    "Same pressure. Compare the piston areas."
  ),
  makePracticeQuestion(
    "HYD-GP-003",
    "integrated_reasoning",
    "An input piston has an area of 2 cm² and receives 20 N. The output piston has an area of 10 cm². What is the ideal output force?",
    ["100 N", "20 N", "50 N", "200 N"],
    "A",
    "The input pressure is 20 ÷ 2 = 10 N/cm². The same pressure acts on 10 cm², giving 10 × 10 = 100 N.",
    "Find pressure first, keep it the same, then apply it to the output area."
  ),
];

function makeHydraulicIndependentQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "hydraulic_independent_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "hydraulics", concept, difficulty: "applied", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation };
}

const hydraulicIndependentPracticeQuestions: MvpQuestion[] = [
  makeHydraulicIndependentQuestion("HYD-IP-001", "car_jack", "A car jack uses a 3 cm² input piston and a 15 cm² lifting piston. If 60 N is applied to the input, what ideal lifting force is produced?", ["300 N", "60 N", "180 N", "900 N"], "A", "The area is five times larger, so the ideal output force is five times larger: 300 N."),
  makeHydraulicIndependentQuestion("HYD-IP-002", "workshop_press", "A workshop press has the same pressure on two pistons. The output piston has four times the area of the input piston. The output force is ideally:", ["Four times the input force", "The same as the input force", "One-quarter of the input force", "Unrelated to piston area"], "A", "At the same pressure, four times the area produces four times the force."),
  makeHydraulicIndependentQuestion("HYD-IP-003", "excavator_ram", "An excavator hydraulic ram receives a fluid pressure of 8 N/cm². Its piston area is 25 cm². What force does the ram produce ideally?", ["200 N", "33 N", "100 N", "320 N"], "A", "Force equals pressure × area: 8 × 25 = 200 N."),
  makeHydraulicIndependentQuestion("HYD-IP-004", "aircraft_landing_gear", "In an ideal aircraft hydraulic system, pressure at the control piston is 12 N/cm². What pressure reaches the landing-gear actuator?", ["12 N/cm²", "A greater pressure", "A smaller pressure", "Zero pressure"], "A", "In a confined ideal fluid, the pressure is transmitted through the system."),
  makeHydraulicIndependentQuestion("HYD-IP-005", "vehicle_brakes", "A brake master cylinder creates pressure in the fluid. A wheel-cylinder piston has a larger area. Why can it produce a larger force?", ["The same pressure acts over a larger area", "The pressure increases as it travels", "The fluid removes the vehicle's momentum", "The larger piston moves farther"], "A", "The pressure is transmitted through the fluid; the larger piston area produces the greater force."),
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


function makeGuidedLeverQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string, feedbackCue: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "guided_lever_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "levers", concept, difficulty: "developing", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation, feedbackCue };
}

const guidedLeverPracticeQuestions: MvpQuestion[] = [
  makeGuidedLeverQuestion("LEV-GP-001", "lever_parts", "In the diagram, what is the triangular support under the bar called?", ["The fulcrum", "The load", "The effort arm", "The output force"], "A", "The fixed support about which the lever turns is the fulcrum.", "Find the point the bar rotates around."),
  makeGuidedLeverQuestion("LEV-GP-002", "long_effort_arm", "The same downward force can be applied at Position 1 or Position 2. Which position gives the greater turning effect?", ["The position farther from the fulcrum", "The position closer to the fulcrum", "Both positions always give the same turning effect", "Neither position can turn the lever"], "A", "For the same force, applying it farther from the fulcrum produces a greater turning effect.", "Compare the perpendicular distance from the fulcrum."),
  makeGuidedLeverQuestion("LEV-GP-003", "easiest_lift", "Which arrangement makes a heavy load easiest to lift?", ["Fulcrum close to the load and effort applied farther away", "Fulcrum close to the effort and far from the load", "Effort applied directly at the fulcrum", "No fulcrum at all"], "A", "A short load arm and long effort arm give greater mechanical advantage.", "Look for a short load arm and a long effort arm."),
  makeGuidedLeverQuestion("LEV-GP-004", "fulcrum_position", "If the fulcrum is moved closer to the load while the effort position stays the same, what usually happens?", ["Less effort is needed", "More effort is always needed", "The lever cannot move", "The load becomes heavier"], "A", "Moving the fulcrum closer to the load shortens the load arm and increases mechanical advantage.", "Compare the load arm before and after the change."),
  makeGuidedLeverQuestion("LEV-GP-005", "balance_calculation", "A 100 N load is 1 m from the fulcrum. The effort is applied 2 m from the fulcrum. What effort balances the lever?", ["50 N", "100 N", "200 N", "25 N"], "A", "Balance requires equal turning effects: 100 × 1 = effort × 2, so effort = 50 N.", "Set load force × load arm equal to effort force × effort arm."),
  makeGuidedLeverQuestion("LEV-GP-006", "balance_calculation", "A 200 N load is 0.5 m from the fulcrum. The effort is applied 2 m away. What effort is needed ideally?", ["50 N", "100 N", "200 N", "800 N"], "A", "The load moment is 200 × 0.5 = 100 N·m. Dividing by the 2 m effort arm gives 50 N.", "Calculate the load turning effect first."),
  makeGuidedLeverQuestion("LEV-GP-007", "distance_tradeoff", "A lever reduces the effort needed to lift a load. What is the usual tradeoff?", ["The effort end moves farther than the load", "The load loses its weight", "The fulcrum disappears", "The load must always move farther than the effort"], "A", "Mechanical advantage reduces force by requiring a greater movement distance at the effort end.", "Less force usually means more movement distance."),
  makeGuidedLeverQuestion("LEV-GP-008", "lever_classes", "Which description identifies a first-class lever?", ["The fulcrum lies between the load and the effort", "The load lies between the fulcrum and effort", "The effort lies between the fulcrum and load", "There is no fulcrum"], "A", "A first-class lever has the fulcrum between the effort and the load.", "Look at the order of fulcrum, load and effort."),
  makeGuidedLeverQuestion("LEV-GP-009", "lever_classes", "A wheelbarrow is a common example of which lever arrangement?", ["The load lies between the fulcrum and the effort", "The fulcrum lies between the load and effort", "The effort lies between the fulcrum and load", "There is no mechanical advantage"], "A", "In a wheelbarrow, the wheel is the fulcrum, the load sits between it and the effort at the handles.", "Identify the order from wheel to load to handles."),
  makeGuidedLeverQuestion("LEV-GP-010", "integrated", "A 300 N load is 0.5 m from the fulcrum. Effort is applied 1.5 m from the fulcrum. What effort is needed ideally?", ["100 N", "300 N", "900 N", "50 N"], "A", "The load moment is 150 N·m. Dividing by the 1.5 m effort arm gives 100 N.", "Compare turning effects on the two sides."),
];

function makeLeverIndependentQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string, feedbackCue: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "lever_independent_practice", pathwayId: "fire_service", domain: "mechanical", subcompetency: "levers", concept, difficulty: "applied", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation, feedbackCue };
}

const leverIndependentPracticeQuestions: MvpQuestion[] = [
  makeLeverIndependentQuestion("LEV-IP-001", "lever_parts", "What is the fulcrum of a lever?", ["The point about which the lever turns", "The object being moved", "The applied force only", "The longest end of the bar"], "A", "The fulcrum is the pivot point about which the lever rotates.", "Find the pivot."),
  makeLeverIndependentQuestion("LEV-IP-002", "long_effort_arm", "The same 50 N force is applied at two points on a lever. Which produces more turning effect?", ["The point farther from the fulcrum", "The point closer to the fulcrum", "Both always produce the same effect", "The point directly above the load regardless of distance"], "A", "For the same force, greater distance from the fulcrum gives greater turning effect.", "Compare force distance from the pivot."),
  makeLeverIndependentQuestion("LEV-IP-003", "easiest_lift", "Which setup gives the greatest ideal mechanical advantage?", ["A long effort arm and short load arm", "A short effort arm and long load arm", "Equal arms only", "Effort applied at the fulcrum"], "A", "A long effort arm compared with the load arm gives greater mechanical advantage.", "Compare effort-arm length with load-arm length."),
  makeLeverIndependentQuestion("LEV-IP-004", "fulcrum_position", "The fulcrum is moved closer to the load. What is the main effect?", ["The effort required usually decreases", "The effort required always doubles", "The lever stops acting as a lever", "The load arm becomes longer"], "A", "Moving the fulcrum toward the load shortens the load arm and increases mechanical advantage.", "Shorter load arm usually means less effort."),
  makeLeverIndependentQuestion("LEV-IP-005", "fulcrum_position", "The fulcrum is moved closer to the effort while the load stays fixed. What usually happens?", ["More effort is needed", "Less effort is needed", "The load becomes weightless", "Nothing can change"], "A", "Moving the fulcrum toward the effort shortens the effort arm and reduces mechanical advantage.", "A shorter effort arm gives less turning effect for the same force."),
  makeLeverIndependentQuestion("LEV-IP-006", "arm_ratio", "The effort arm is 3 m and the load arm is 1 m. What is the ideal mechanical advantage?", ["3", "1", "2", "4"], "A", "Ideal mechanical advantage is effort arm ÷ load arm = 3 ÷ 1 = 3.", "Compare the arm lengths as a ratio."),
  makeLeverIndependentQuestion("LEV-IP-007", "load_calculation", "A 100 N effort acts 3 m from the fulcrum. A load is 1 m from the fulcrum. What load can be balanced ideally?", ["300 N", "100 N", "33 N", "900 N"], "A", "100 × 3 = 300 N·m, so a load 1 m away can be 300 N.", "Equal turning effects balance the lever."),
  makeLeverIndependentQuestion("LEV-IP-008", "force_calculation", "A 400 N load is 0.5 m from the fulcrum. Effort is applied 2 m away. What effort is needed?", ["100 N", "200 N", "400 N", "1600 N"], "A", "400 × 0.5 = 200 N·m. 200 ÷ 2 = 100 N effort.", "Load moment ÷ effort arm gives effort force."),
  makeLeverIndependentQuestion("LEV-IP-009", "force_calculation", "A 240 N load is 1 m from the fulcrum. Effort is applied 3 m away. What effort balances it?", ["80 N", "120 N", "240 N", "720 N"], "A", "240 × 1 = effort × 3, so effort = 80 N.", "Use equal moments around the fulcrum."),
  makeLeverIndependentQuestion("LEV-IP-010", "load_calculation", "A 60 N effort acts 4 m from the fulcrum. The load is 1 m away. What load can be balanced?", ["240 N", "60 N", "15 N", "480 N"], "A", "60 × 4 = 240 N·m, so the 1 m load can be 240 N.", "Multiply effort by effort-arm length."),
  makeLeverIndependentQuestion("LEV-IP-011", "balance_calculation", "A 300 N person sits 2 m from a seesaw pivot. How far from the pivot should a 200 N person sit to balance?", ["3 m", "2 m", "1.5 m", "4 m"], "A", "300 × 2 = 600 N·m. 600 ÷ 200 = 3 m.", "Balance the turning effects."),
  makeLeverIndependentQuestion("LEV-IP-012", "distance_tradeoff", "A lever gives a mechanical advantage of 4. If the load rises 0.5 m, approximately how far must the effort end move ideally?", ["2 m", "0.5 m", "0.125 m", "4 m"], "A", "A four-to-one force advantage requires about four times the movement distance: 2 m.", "Mechanical advantage trades force for distance."),
  makeLeverIndependentQuestion("LEV-IP-013", "lever_classes", "In a first-class lever, what lies between the other two parts?", ["The fulcrum", "The load", "The effort", "Nothing"], "A", "A first-class lever places the fulcrum between load and effort.", "Think of a seesaw."),
  makeLeverIndependentQuestion("LEV-IP-014", "lever_classes", "In a second-class lever, what lies between the fulcrum and the effort?", ["The load", "The fulcrum", "The effort", "A second fulcrum"], "A", "A second-class lever places the load between fulcrum and effort.", "Think of a wheelbarrow."),
  makeLeverIndependentQuestion("LEV-IP-015", "lever_classes", "In a third-class lever, what lies between the fulcrum and the load?", ["The effort", "The load", "The fulcrum", "A second load"], "A", "A third-class lever places the effort between fulcrum and load.", "Think of tweezers or the forearm."),
  makeLeverIndependentQuestion("LEV-IP-016", "applied_crowbar", "Why does using a longer crowbar usually make prying easier?", ["The effort acts farther from the fulcrum", "The load becomes lighter", "The fulcrum stops moving", "The metal creates extra energy"], "A", "A longer effort arm increases turning effect for the same applied force.", "Longer distance from the pivot increases moment."),
  makeLeverIndependentQuestion("LEV-IP-017", "applied_wheelbarrow", "Why can a wheelbarrow reduce the force needed at the handles?", ["The load lies closer to the wheel fulcrum than the hands do", "The wheel removes the load's weight", "The handles are always vertical", "The load acts at the fulcrum"], "A", "The load arm is shorter than the effort arm, giving mechanical advantage.", "Compare the wheel-to-load and wheel-to-hands distances."),
  makeLeverIndependentQuestion("LEV-IP-018", "third_class_tradeoff", "A third-class lever often sacrifices force advantage. What can it gain instead?", ["Greater speed or movement distance at the load", "Zero effort", "No need for a fulcrum", "A heavier load automatically"], "A", "Third-class levers can increase the speed and movement distance of the load at the cost of force advantage.", "Force and distance advantages trade off."),
  makeLeverIndependentQuestion("LEV-IP-019", "equal_arms", "A lever has equal arm lengths. What effort balances a 150 N load ideally?", ["150 N", "75 N", "300 N", "50 N"], "A", "Equal arm lengths require equal forces for balance.", "Equal distances mean equal forces at balance."),
  makeLeverIndependentQuestion("LEV-IP-020", "long_effort_arm", "The effort point is moved from 1 m to 2 m from the fulcrum while force stays the same. What happens to turning effect?", ["It doubles", "It halves", "It stays the same", "It becomes zero"], "A", "Moment equals force × distance, so doubling the distance doubles the turning effect.", "Turning effect changes directly with distance."),
  makeLeverIndependentQuestion("LEV-IP-021", "movement_direction", "On a simple first-class lever, the effort end moves down. What does the load end do?", ["Moves up", "Moves down", "Does not move", "Moves sideways only"], "A", "The two ends rotate about the fulcrum in opposite vertical directions.", "Trace rotation about the pivot."),
  makeLeverIndependentQuestion("LEV-IP-022", "fulcrum_position", "Which change reduces the effort needed most?", ["Move the fulcrum closer to the load", "Move the fulcrum closer to the effort", "Apply effort at the fulcrum", "Shorten the effort arm"], "A", "Moving the fulcrum closer to the load shortens the load arm relative to the effort arm.", "Increase the effort-arm to load-arm ratio."),
  makeLeverIndependentQuestion("LEV-IP-023", "arm_ratio", "The effort arm is 5 times the load arm. What is the ideal mechanical advantage?", ["5", "1", "2.5", "10"], "A", "Mechanical advantage is the ratio of effort arm to load arm: 5.", "Use effort arm ÷ load arm."),
  makeLeverIndependentQuestion("LEV-IP-024", "easiest_lift", "Setup A has a 4 m effort arm and 1 m load arm. Setup B has a 2 m effort arm and 1 m load arm. Which needs less effort?", ["Setup A", "Setup B", "They need the same effort", "Neither can lift"], "A", "Setup A has twice the mechanical advantage of Setup B.", "Compare effort-arm to load-arm ratios."),
  makeLeverIndependentQuestion("LEV-IP-025", "integrated", "A 500 N load is 0.4 m from the fulcrum. Effort is applied 2 m away. What effort is needed ideally?", ["100 N", "250 N", "500 N", "40 N"], "A", "500 × 0.4 = 200 N·m. 200 ÷ 2 = 100 N.", "Calculate the load moment, then divide by the effort arm."),
];

function makeLeverAssessmentQuestion(questionId: string, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "lever_assessment", pathwayId: "fire_service", domain: "mechanical", subcompetency: "levers", concept, difficulty: "applied", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation };
}

const leverAssessmentQuestions: MvpQuestion[] = [
  makeLeverAssessmentQuestion("LEV-AS-001", "system_recognition", "Which point in a lever is the pivot?", ["The fulcrum", "The load", "The effort", "The longest arm"], "A", "The fulcrum is the pivot point."),
  makeLeverAssessmentQuestion("LEV-AS-002", "easiest_setup", "Which setup gives the greatest ideal force advantage?", ["Longest effort arm with shortest load arm", "Shortest effort arm with longest load arm", "Equal arms with effort at the fulcrum", "No fulcrum"], "A", "The greatest force advantage comes from a long effort arm and short load arm."),
  makeLeverAssessmentQuestion("LEV-AS-003", "fulcrum_position", "What happens when the fulcrum is moved closer to the load?", ["The effort needed usually decreases", "The effort needed always increases", "Mechanical advantage becomes zero", "The load must move farther than the effort"], "A", "A shorter load arm increases mechanical advantage."),
  makeLeverAssessmentQuestion("LEV-AS-004", "force", "A 360 N load is 0.5 m from the fulcrum. Effort is applied 1.5 m away. What effort is needed?", ["120 N", "180 N", "360 N", "1080 N"], "A", "360 × 0.5 = 180 N·m. 180 ÷ 1.5 = 120 N."),
  makeLeverAssessmentQuestion("LEV-AS-005", "balance", "A 250 N load acts 1.2 m from the fulcrum. What force 3 m away balances it?", ["100 N", "250 N", "625 N", "60 N"], "A", "250 × 1.2 = 300 N·m. 300 ÷ 3 = 100 N."),
  makeLeverAssessmentQuestion("LEV-AS-006", "arm_ratio", "The effort arm is 4 m and the load arm is 1 m. What is the ideal mechanical advantage?", ["4", "2", "1", "8"], "A", "4 ÷ 1 = 4."),
  makeLeverAssessmentQuestion("LEV-AS-007", "lever_class", "Which arrangement is a second-class lever?", ["The load lies between fulcrum and effort", "The fulcrum lies between load and effort", "The effort lies between fulcrum and load", "The lever has two fulcrums"], "A", "A second-class lever has the load between fulcrum and effort."),
  makeLeverAssessmentQuestion("LEV-AS-008", "movement_direction", "The effort end of a first-class lever moves downward. What happens to the load end?", ["It moves upward", "It also moves downward", "It stays fixed", "It moves only toward the fulcrum"], "A", "Rotation about the fulcrum moves the opposite end upward."),
  makeLeverAssessmentQuestion("LEV-AS-009", "distance", "An ideal lever has mechanical advantage 3. If the load rises 0.4 m, about how far does the effort end move?", ["1.2 m", "0.4 m", "0.13 m", "3.4 m"], "A", "A three-to-one force advantage requires about three times the effort movement distance: 1.2 m."),
  makeLeverAssessmentQuestion("LEV-AS-010", "integrated", "A 600 N load is 0.5 m from the fulcrum. A 100 N effort is applied on the other side. How far from the fulcrum must the effort act to balance?", ["3 m", "6 m", "1 m", "0.3 m"], "A", "The load moment is 300 N·m. 300 ÷ 100 = 3 m."),
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


function makeMixedAssessmentQuestion(questionId: string, subcompetency: MechanicalSubcompetency, concept: string, stem: string, options: string[], correctLabel: OptionLabel, explanation: string): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return { questionId, sessionType: "mixed_mechanical_assessment", pathwayId: "fire_service", domain: "mechanical", subcompetency, concept, difficulty: "applied", stem, options: prepared.options, correctOptionId: prepared.correctOptionId, explanation };
}

const mixedMechanicalAssessmentQuestions: MvpQuestion[] = [
  makeMixedAssessmentQuestion("MMA-GEAR-001", "gears", "direction", "Gear A turns clockwise. Which way does Gear D turn?", ["Clockwise", "Anticlockwise", "It does not turn", "Direction cannot be known"], "B", "Four gears create three direct contacts, so the final gear turns opposite to the driver."),
  makeMixedAssessmentQuestion("MMA-HYD-001", "hydraulics", "area_force", "The same fluid pressure acts on both pistons. The output piston has twice the area of the input piston. Compared with the input force, the output force is ideally:", ["Twice as large", "Half as large", "The same", "Zero"], "A", "With the same pressure, force increases in proportion to piston area."),
  makeMixedAssessmentQuestion("MMA-PULL-001", "pulleys", "system_recognition", "What is the main effect of this single fixed pulley?", ["It changes the direction of effort", "It halves the effort", "It doubles the load", "It removes rope tension"], "A", "A single fixed pulley mainly changes the direction in which the effort is applied."),
  makeMixedAssessmentQuestion("MMA-LEV-001", "levers", "balance_force", "A 600 N load acts 0.5 m from the fulcrum. The effort is applied 2 m from the fulcrum. What effort balances the load?", ["150 N", "300 N", "600 N", "1200 N"], "A", "The load moment is 600 × 0.5 = 300 N·m. Dividing by 2 m gives 150 N."),
  makeMixedAssessmentQuestion("MMA-PULL-002", "pulleys", "mechanical_advantage", "A 400 N load is ideally supported by two rope sections. Approximately what effort is needed?", ["200 N", "400 N", "800 N", "100 N"], "A", "With two supporting rope sections, the ideal effort is 400 ÷ 2 = 200 N."),
  makeMixedAssessmentQuestion("MMA-GEAR-002", "gears", "driver_position", "The middle gear is the driver and turns clockwise. Which way does Gear C turn?", ["Clockwise", "Anticlockwise", "It cannot turn", "It depends only on gear size"], "B", "Gear C meshes directly with the clockwise driver, so it turns anticlockwise."),
  makeMixedAssessmentQuestion("MMA-LEV-002", "levers", "mechanical_advantage", "Which setup gives the greatest mechanical advantage?", ["The load close to the fulcrum and the effort far away", "The effort close to the fulcrum and the load far away", "Load and effort both at the fulcrum", "No fulcrum"], "A", "A short load arm and long effort arm give the greatest force advantage."),
  makeMixedAssessmentQuestion("MMA-HYD-002", "hydraulics", "movement_direction", "The left piston is pushed downward in the sealed system. What will the right piston usually do?", ["Move upward", "Move downward", "Remain fixed", "Move only if air enters"], "A", "The input piston displaces fluid, which drives the other piston upward."),
  makeMixedAssessmentQuestion("MMA-HYD-003", "hydraulics", "pressure_force", "The fluid pressure is 50 kPa and the piston area is 0.02 m². What force is produced?", ["1000 N", "2500 N", "100 N", "25 N"], "A", "50,000 Pa × 0.02 m² = 1000 N."),
  makeMixedAssessmentQuestion("MMA-LEV-003", "levers", "movement_direction", "The effort end of this first-class lever moves downward. What happens to the load end?", ["It moves upward", "It also moves downward", "It stays fixed", "It moves toward the fulcrum only"], "A", "The two ends of a first-class lever move in opposite directions around the fulcrum."),
  makeMixedAssessmentQuestion("MMA-GEAR-003", "gears", "speed_ratio", "A 12-tooth gear drives a 36-tooth gear. How fast does the 36-tooth gear turn compared with the driver?", ["One-third as fast", "Three times as fast", "At the same speed", "It does not turn"], "A", "The driven gear has three times as many teeth, so it turns at one-third the speed."),
  makeMixedAssessmentQuestion("MMA-PULL-003", "pulleys", "force", "A 600 N load is ideally supported by three rope sections. Approximately what effort is needed?", ["200 N", "300 N", "600 N", "1800 N"], "A", "The ideal effort is 600 ÷ 3 = 200 N."),
  makeMixedAssessmentQuestion("MMA-GEAR-004", "gears", "direction_speed", "A 40-tooth gear drives a 10-tooth gear. Compared with the driver, the output gear turns:", ["Four times faster in the opposite direction", "Four times slower in the same direction", "At the same speed in the opposite direction", "Twice as fast in the same direction"], "A", "Direct mesh reverses direction, and the 10-tooth gear turns four times faster than the 40-tooth driver."),
  makeMixedAssessmentQuestion("MMA-PULL-004", "pulleys", "load_capacity", "A person pulls with 100 N in an ideal system with four supporting rope sections. What load can be supported?", ["400 N", "100 N", "25 N", "800 N"], "A", "Four supporting sections provide an ideal mechanical advantage of four: 100 × 4 = 400 N."),
  makeMixedAssessmentQuestion("MMA-HYD-004", "hydraulics", "force_ratio", "A 100 N force acts on a 2 cm² input piston. The output piston area is 10 cm². What is the ideal output force?", ["500 N", "200 N", "1000 N", "20 N"], "A", "The output area is five times larger, so the ideal output force is five times larger: 500 N."),
  makeMixedAssessmentQuestion("MMA-LEV-004", "levers", "balance", "A 100 N effort acts 3 m from the fulcrum. What load can be balanced 1 m from the fulcrum?", ["300 N", "100 N", "33 N", "600 N"], "A", "The effort moment is 100 × 3 = 300 N·m, so a 300 N load at 1 m balances it."),
  makeMixedAssessmentQuestion("MMA-LEV-005", "levers", "arm_ratio", "The effort arm is 4 m and the load arm is 1 m. What is the ideal mechanical advantage?", ["4", "2", "1", "8"], "A", "Ideal mechanical advantage equals effort-arm length divided by load-arm length: 4 ÷ 1 = 4."),
  makeMixedAssessmentQuestion("MMA-GEAR-005", "gears", "idler_ratio", "A 20-tooth driver turns through an idler and drives a 60-tooth output gear. Compared with the driver, the output turns:", ["In the same direction at one-third the speed", "In the opposite direction at three times the speed", "In the same direction at three times the speed", "In the opposite direction at the same speed"], "A", "Two contacts make the output turn in the same direction as the driver. The 60-tooth output turns at one-third the driver speed."),
  makeMixedAssessmentQuestion("MMA-PULL-005", "pulleys", "distance_tradeoff", "The load rises 0.5 m in an ideal system with four supporting rope sections. How much rope must be pulled?", ["2 m", "0.5 m", "0.125 m", "4 m"], "A", "A four-to-one force advantage requires four times the rope movement distance: 2 m."),
  makeMixedAssessmentQuestion("MMA-HYD-005", "hydraulics", "distance_tradeoff", "A hydraulic system provides a four-to-one force advantage. Ideally, how far must the input piston move compared with the output piston?", ["Four times as far", "One-quarter as far", "The same distance", "Distance is unrelated to force advantage"], "A", "A four-to-one force advantage requires the input side to move about four times the output distance."),
  makeMixedAssessmentQuestion("MMA-PULL-006", "pulleys", "support_relationship", "The diagram is unfamiliar, but three rope sections directly support the moving block. What determines the ideal mechanical advantage?", ["The three supporting rope sections", "The angle of the drawing", "The colour of the rope", "The number of fixed supports above"], "A", "Ideal mechanical advantage depends on the rope sections directly supporting the moving load, not the diagram orientation."),
  makeMixedAssessmentQuestion("MMA-LEV-006", "levers", "integrated", "A 400 N load acts 0.75 m from the fulcrum. A 100 N effort is used on the other side. How far from the fulcrum must the effort act to balance?", ["3 m", "1.5 m", "0.75 m", "4 m"], "A", "The load moment is 400 × 0.75 = 300 N·m. A 100 N effort therefore needs a 3 m arm."),
  makeMixedAssessmentQuestion("MMA-HYD-006", "hydraulics", "equal_area", "The two pistons have equal area in an ideal sealed hydraulic system. If the input force is 300 N, what output force is expected?", ["300 N", "600 N", "150 N", "Zero"], "A", "Equal piston areas at the same pressure produce equal forces."),
  makeMixedAssessmentQuestion("MMA-GEAR-006", "gears", "integrated", "A 15-tooth gear drives two idlers and then a 45-tooth output gear. Compared with the driver, the output turns:", ["In the opposite direction at one-third the speed", "In the same direction at three times the speed", "In the same direction at one-third the speed", "In the opposite direction at three times the speed"], "A", "Three direct contacts reverse the final direction. The 45-tooth output turns at one-third the speed of the 15-tooth driver."),
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


function makeNumericalQuestion(
  questionId: string,
  sessionType: "guided_numerical_practice" | "numerical_independent_practice" | "numerical_assessment",
  subcompetency: NumericalSubcompetency,
  concept: string,
  stem: string,
  options: string[],
  correctLabel: OptionLabel,
  explanation: string,
  difficulty: "developing" | "applied",
  feedbackCue?: string,
  dataTable?: NumericalDataTable
): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return {
    questionId,
    sessionType,
    pathwayId: "fire_service",
    domain: "numerical",
    subcompetency,
    concept,
    difficulty,
    stem,
    options: prepared.options,
    correctOptionId: prepared.correctOptionId,
    explanation,
    feedbackCue,
    dataTable,
  };
}

const guidedNumericalPracticeQuestions: MvpQuestion[] = [
  makeNumericalQuestion("NUM-G-001", "guided_numerical_practice", "arithmetic_estimation", "basic_arithmetic", "A depot has 48 helmets and receives 37 more. How many helmets are there now?", ["85", "75", "95", "84"], "A", "48 + 37 = 85.", "developing", "Add the tens and units carefully.", undefined),
  makeNumericalQuestion("NUM-G-002", "guided_numerical_practice", "arithmetic_estimation", "estimation", "Which is the closest estimate for 19.8 × 5.1?", ["100", "50", "150", "250"], "A", "20 × 5 is about 100, so 100 is the best estimate.", "developing", "Round to friendly numbers before calculating.", undefined),
  makeNumericalQuestion("NUM-G-003", "guided_numerical_practice", "percentages_ratios", "percentage_of_amount", "What is 15% of 240?", ["36", "24", "30", "48"], "A", "10% of 240 is 24 and 5% is 12, so 15% is 36.", "developing", "Use easy percentage anchors such as 10% and 5%.", undefined),
  makeNumericalQuestion("NUM-G-004", "guided_numerical_practice", "percentages_ratios", "percentage_change", "A score of 80 is increased by 25%. What is the new score?", ["100", "105", "95", "120"], "A", "25% of 80 is 20, so the new score is 100.", "developing", "Find the change first, then add it.", undefined),
  makeNumericalQuestion("NUM-G-005", "guided_numerical_practice", "percentages_ratios", "ratio_sharing", "Red and blue markers are in the ratio 3:5. There are 64 markers altogether. How many are red?", ["24", "40", "18", "32"], "A", "There are 8 ratio parts. Each part is 8, so red = 3 × 8 = 24.", "developing", "Add the ratio parts before sharing the total.", undefined),
  makeNumericalQuestion("NUM-G-006", "guided_numerical_practice", "rates_proportion", "unit_rate", "A vehicle travels 180 km in 3 hours. What is its average speed?", ["60 km/h", "90 km/h", "45 km/h", "540 km/h"], "A", "180 ÷ 3 = 60 km/h.", "developing", "Reduce the information to a one-unit rate.", undefined),
  makeNumericalQuestion("NUM-G-007", "guided_numerical_practice", "rates_proportion", "direct_proportion", "A team completes 12 checks in 8 minutes. At the same rate, how many checks can it complete in 12 minutes?", ["18", "16", "20", "24"], "A", "12 minutes is 1.5 times as long as 8 minutes, so 12 × 1.5 = 18.", "developing", "Scale both quantities by the same factor.", undefined),
  makeNumericalQuestion("NUM-G-008", "guided_numerical_practice", "rates_proportion", "work_rate", "Four identical pumps fill a tank in 6 hours. At the same combined rate, how long would six pumps take?", ["4 hours", "9 hours", "3 hours", "6 hours"], "A", "The job is 24 pump-hours. With six pumps, 24 ÷ 6 = 4 hours.", "developing", "For shared work, think in total worker-hours or pump-hours.", undefined),
  makeNumericalQuestion("NUM-G-009", "guided_numerical_practice", "tables_data", "table_percentage", "According to the table, what percentage of applicants passed?", ["80%", "75%", "48%", "125%"], "A", "48 out of 60 passed. 48 ÷ 60 = 0.8 = 80%.", "developing", "Read the correct row first, then calculate the fraction as a percentage.", {"headers": ["Applicants", "Passed"], "rows": [["60", "48"]]}),
  makeNumericalQuestion("NUM-G-010", "guided_numerical_practice", "tables_data", "table_difference", "What is the difference between the slowest and fastest average response times?", ["2.2 min", "1.9 min", "2.6 min", "13.4 min"], "A", "The slowest is 8.1 minutes and the fastest is 5.9 minutes. 8.1 − 5.9 = 2.2.", "developing", "Identify the maximum and minimum before subtracting.", {"headers": ["Station", "Average response time"], "rows": [["A", "7.5 min"], ["B", "6.2 min"], ["C", "8.1 min"], ["D", "5.9 min"]]}),
];

const numericalIndependentPracticeQuestions: MvpQuestion[] = [
  makeNumericalQuestion("NUM-IP-001", "numerical_independent_practice", "arithmetic_estimation", "basic_arithmetic", "What is 375 + 248?", ["623", "613", "633", "523"], "A", "375 + 248 = 623.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-002", "numerical_independent_practice", "arithmetic_estimation", "basic_arithmetic", "What is 960 − 475?", ["485", "495", "475", "585"], "A", "960 − 475 = 485.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-003", "numerical_independent_practice", "arithmetic_estimation", "multiplication", "What is 24 × 18?", ["432", "442", "384", "468"], "A", "24 × 18 = 24 × (20 − 2) = 480 − 48 = 432.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-004", "numerical_independent_practice", "arithmetic_estimation", "division", "What is 864 ÷ 12?", ["72", "62", "82", "96"], "A", "12 × 72 = 864.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-005", "numerical_independent_practice", "arithmetic_estimation", "estimation", "Which is the closest estimate for 49 × 21?", ["1,000", "500", "1,500", "2,000"], "A", "50 × 20 = 1,000.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-006", "numerical_independent_practice", "arithmetic_estimation", "order_of_operations", "What is 180 − 4 × 25?", ["80", "4,400", "140", "100"], "A", "Multiply first: 4 × 25 = 100. Then 180 − 100 = 80.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-007", "numerical_independent_practice", "percentages_ratios", "percentage_of_amount", "What is 12% of 350?", ["42", "35", "38", "47"], "A", "10% is 35 and 2% is 7, giving 42.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-008", "numerical_independent_practice", "percentages_ratios", "percentage_increase", "A quantity of 72 increases by 25%. What is the new quantity?", ["90", "97", "86", "108"], "A", "25% of 72 is 18, so 72 + 18 = 90.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-009", "numerical_independent_practice", "percentages_ratios", "percentage_decrease", "A budget of 240 units is reduced by 15%. What remains?", ["204", "216", "200", "225"], "A", "15% of 240 is 36, so 240 − 36 = 204.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-010", "numerical_independent_practice", "percentages_ratios", "percentage_change", "A value rises from 160 to 200. What is the percentage increase?", ["25%", "20%", "40%", "12.5%"], "A", "The increase is 40. 40 ÷ 160 = 25%.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-011", "numerical_independent_practice", "percentages_ratios", "ratio_sharing", "Red and blue items are in the ratio 2:3. There are 45 items altogether. How many are red?", ["18", "27", "15", "20"], "A", "There are 5 parts, each worth 9. Red = 2 × 9 = 18.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-012", "numerical_independent_practice", "percentages_ratios", "ratio_sharing", "A mixture contains fuel and water in the ratio 1:4. There are 30 L altogether. How much is fuel?", ["6 L", "24 L", "7.5 L", "5 L"], "A", "There are 5 parts, so each part is 6 L. Fuel is one part.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-013", "numerical_independent_practice", "percentages_ratios", "direct_proportion", "Three identical items cost $18. At the same price, what do eight items cost?", ["$48", "$42", "$54", "$36"], "A", "Each item costs $6, so eight cost $48.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-014", "numerical_independent_practice", "rates_proportion", "unit_rate", "A vehicle travels 210 km in 3.5 hours. What is its average speed?", ["60 km/h", "70 km/h", "55 km/h", "73.5 km/h"], "A", "210 ÷ 3.5 = 60 km/h.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-015", "numerical_independent_practice", "rates_proportion", "direct_proportion", "A machine produces 15 units in 6 minutes. At the same rate, how long will 40 units take?", ["16 min", "12 min", "18 min", "20 min"], "A", "15 units in 6 minutes is 2.5 units per minute. 40 ÷ 2.5 = 16 minutes.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-016", "numerical_independent_practice", "rates_proportion", "work_rate", "Five workers complete a job in 8 hours. At the same productivity, how long would ten workers take?", ["4 hours", "16 hours", "5 hours", "6 hours"], "A", "The job is 40 worker-hours. 40 ÷ 10 = 4 hours.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-017", "numerical_independent_practice", "rates_proportion", "flow_rate", "Water flows at 24 L per minute for 7.5 minutes. How much water flows?", ["180 L", "168 L", "192 L", "210 L"], "A", "24 × 7.5 = 180 L.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-018", "numerical_independent_practice", "rates_proportion", "unit_rate", "A manual has 360 pages. A candidate reads 45 pages per hour. How long will it take?", ["8 hours", "7 hours", "9 hours", "6 hours"], "A", "360 ÷ 45 = 8 hours.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-019", "numerical_independent_practice", "rates_proportion", "scale", "On a map, 1 cm represents 5 km. What distance does 7.2 cm represent?", ["36 km", "35 km", "31 km", "42 km"], "A", "7.2 × 5 = 36 km.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-IP-020", "numerical_independent_practice", "tables_data", "table_total", "How many calls were recorded on Tuesday and Thursday combined?", ["120", "103", "107", "65"], "A", "55 + 65 = 120.", "applied", undefined, {"headers": ["Day", "Calls"], "rows": [["Monday", "42"], ["Tuesday", "55"], ["Wednesday", "38"], ["Thursday", "65"]]}),
  makeNumericalQuestion("NUM-IP-021", "numerical_independent_practice", "tables_data", "table_rate", "Which centres had the highest pass rate?", ["A and C", "B only", "C only", "B and D"], "A", "A: 36/45 = 80%; B: 42/60 = 70%; C: 28/35 = 80%; D: 49/70 = 70%.", "applied", undefined, {"headers": ["Centre", "Applicants", "Passed"], "rows": [["A", "45", "36"], ["B", "60", "42"], ["C", "35", "28"], ["D", "70", "49"]]}),
  makeNumericalQuestion("NUM-IP-022", "numerical_independent_practice", "tables_data", "table_difference", "How many more helmets than radios are listed?", ["36", "24", "12", "204"], "A", "120 − 84 = 36.", "applied", undefined, {"headers": ["Equipment", "Count"], "rows": [["Helmets", "120"], ["Jackets", "96"], ["Boots", "108"], ["Radios", "84"]]}),
  makeNumericalQuestion("NUM-IP-023", "numerical_independent_practice", "tables_data", "table_unit_rate", "Which team completed the most tasks per staff member?", ["Team C", "Team A", "Team B", "Team D"], "A", "A = 7 each, B = 7 each, C = 8 each, D = 6 each.", "applied", undefined, {"headers": ["Team", "Staff", "Tasks"], "rows": [["A", "8", "56"], ["B", "10", "70"], ["C", "6", "48"], ["D", "12", "72"]]}),
  makeNumericalQuestion("NUM-IP-024", "numerical_independent_practice", "tables_data", "table_percentage_change", "Actual spending was what percentage above budget?", ["10%", "24%", "9%", "110%"], "A", "The overspend is 24,000. 24,000 ÷ 240,000 = 10%.", "applied", undefined, {"headers": ["Budget", "Actual"], "rows": [["$240,000", "$264,000"]]}),
  makeNumericalQuestion("NUM-IP-025", "numerical_independent_practice", "tables_data", "table_change", "How much did the reading increase from the first measurement to the third?", ["6", "4", "3", "24"], "A", "24 − 18 = 6.", "applied", undefined, {"headers": ["Measurement", "Reading"], "rows": [["1", "18"], ["2", "21"], ["3", "24"], ["4", "22"]]}),
];

const numericalAssessmentQuestions: MvpQuestion[] = [
  makeNumericalQuestion("NUM-A-001", "numerical_assessment", "tables_data", "table_percentage", "Which station had the highest completion rate?", ["Station C", "Station A", "Station B", "Station D"], "A", "A = 42/50 = 84%; B = 54/72 = 75%; C = 38/40 = 95%; D = 63/75 = 84%.", "applied", undefined, {"headers": ["Station", "Assigned", "Completed"], "rows": [["A", "50", "42"], ["B", "72", "54"], ["C", "40", "38"], ["D", "75", "63"]]}),
  makeNumericalQuestion("NUM-A-002", "numerical_assessment", "arithmetic_estimation", "basic_arithmetic", "What is 725 + 386?", ["1,111", "1,101", "1,121", "1,211"], "A", "725 + 386 = 1,111.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-A-003", "numerical_assessment", "rates_proportion", "unit_rate", "A vehicle travels 270 km in 4.5 hours. What is its average speed?", ["60 km/h", "55 km/h", "65 km/h", "75 km/h"], "A", "270 ÷ 4.5 = 60 km/h.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-A-004", "numerical_assessment", "percentages_ratios", "percentage_of_amount", "What is 18% of 250?", ["45", "40", "50", "36"], "A", "10% is 25, 8% is 20, total 45.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-A-005", "numerical_assessment", "arithmetic_estimation", "division", "What is 1,440 ÷ 16?", ["90", "80", "96", "100"], "A", "16 × 90 = 1,440.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-A-006", "numerical_assessment", "tables_data", "table_difference", "How many more units were available than required for Item B?", ["18", "12", "24", "102"], "A", "120 − 102 = 18.", "applied", undefined, {"headers": ["Item", "Required", "Available"], "rows": [["A", "84", "96"], ["B", "102", "120"], ["C", "75", "81"], ["D", "110", "104"]]}),
  makeNumericalQuestion("NUM-A-007", "numerical_assessment", "percentages_ratios", "percentage_decrease", "A value of 150 is reduced by 20%. What remains?", ["120", "130", "125", "100"], "A", "20% of 150 is 30, leaving 120.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-A-008", "numerical_assessment", "rates_proportion", "direct_proportion", "Eight inspections take 5 minutes. At the same rate, how long do 24 inspections take?", ["15 min", "10 min", "12 min", "18 min"], "A", "24 is three times 8, so the time is three times 5 = 15 minutes.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-A-009", "numerical_assessment", "arithmetic_estimation", "estimation", "Which is the closest estimate for 31.2 × 9.8?", ["300", "200", "400", "30"], "A", "31.2 is about 30 and 9.8 is about 10, giving about 300.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-A-010", "numerical_assessment", "percentages_ratios", "ratio_sharing", "Two quantities are in the ratio 4:7 and total 99. What is the smaller quantity?", ["36", "63", "44", "55"], "A", "There are 11 parts, each worth 9. The smaller quantity is 4 × 9 = 36.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-A-011", "numerical_assessment", "rates_proportion", "work_rate", "Three workers complete a job in 10 hours. At the same productivity, how long would five workers take?", ["6 hours", "5 hours", "8 hours", "15 hours"], "A", "The job is 30 worker-hours. 30 ÷ 5 = 6 hours.", "applied", undefined, undefined),
  makeNumericalQuestion("NUM-A-012", "numerical_assessment", "tables_data", "table_average", "What is the average of the four recorded values?", ["24", "23", "25", "26"], "A", "(18 + 22 + 26 + 30) ÷ 4 = 24.", "applied", undefined, {"headers": ["Record", "Value"], "rows": [["1", "18"], ["2", "22"], ["3", "26"], ["4", "30"]]}),
];


function makeAbstractLogicalQuestion(
  questionId: string,
  subcompetency: AbstractLogicalSubcompetency,
  concept: string,
  stem: string,
  options: string[],
  correctLabel: OptionLabel,
  explanation: string,
  feedbackCue?: string,
  abstractVisual?: AbstractVisual,
  sessionType: "guided_abstract_logical_practice" | "abstract_logical_independent_practice" | "abstract_logical_assessment" = "guided_abstract_logical_practice"
): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return {
    questionId,
    sessionType,
    pathwayId: "fire_service",
    domain: "abstract_logical",
    subcompetency,
    concept,
    difficulty: sessionType === "guided_abstract_logical_practice" ? "developing" : "applied",
    stem,
    options: prepared.options,
    correctOptionId: prepared.correctOptionId,
    explanation,
    feedbackCue,
    abstractVisual,
  };
}

const guidedAbstractLogicalPracticeQuestions: MvpQuestion[] = [
  makeAbstractLogicalQuestion("ABS-G-001", "pattern_sequences", "alternating_pattern", "What should replace the question mark?", ["▲", "○", "■", "◆"], "A", "The sequence alternates ▲, ○, ▲, ○, so the next symbol is ▲.", "Look first for a simple repeating cycle.", {"kind": "sequence", "rows": [["▲", "○", "▲", "○", "?"]]}),
  makeAbstractLogicalQuestion("ABS-G-002", "pattern_sequences", "count_progression", "What should replace the question mark?", ["●●●●", "●●●", "●●●●●", "●"], "A", "The number of dots increases by one each time: 1, 2, 3, then 4.", "Count what changes from one step to the next.", {"kind": "sequence", "rows": [["●", "●●", "●●●", "?"]]}),
  makeAbstractLogicalQuestion("ABS-G-003", "pattern_sequences", "rotation", "Which arrow comes next?", ["←", "↑", "→", "↓"], "A", "Each arrow rotates 90° clockwise: ↑, →, ↓, ←.", "Track direction separately from shape.", {"kind": "sequence", "rows": [["↑", "→", "↓", "?"]]}),
  makeAbstractLogicalQuestion("ABS-G-004", "pattern_sequences", "two_rule_sequence", "What should replace the question mark?", ["▲▲▲▲▲", "○○○○○", "▲▲▲▲", "○○○○○○"], "A", "Shape alternates triangle, circle while the count increases by one. The fifth term is five triangles.", "When one rule is not enough, separate shape from number.", {"kind": "sequence", "rows": [["▲", "○○", "▲▲▲", "○○○○", "?"]]}),
  makeAbstractLogicalQuestion("ABS-G-005", "matrices_rules", "row_progression", "What belongs in the missing cell?", ["○○○", "○○", "○○○○", "●●●"], "A", "Each row increases from one symbol to two, then three. The missing cell is three circles.", "Check whether each row follows the same relationship.", {"kind": "matrix", "rows": [["▲", "▲▲", "▲▲▲"], ["○", "○○", "?"]]}),
  makeAbstractLogicalQuestion("ABS-G-006", "matrices_rules", "combination_rule", "What belongs in the missing cell?", ["■□", "■■", "□□", "■"], "A", "In each row, the third cell combines the first two cells. ■ and □ therefore become ■□.", "Compare the first two cells with the third.", {"kind": "matrix", "rows": [["▲", "○", "▲○"], ["■", "□", "?"]]}),
  makeAbstractLogicalQuestion("ABS-G-007", "classification_relationships", "odd_one_out", "Which item is the odd one out?", ["○", "▲", "■", "◆"], "A", "The circle is the only shape with no straight sides.", "Look for the property shared by three options, not the one that merely looks unusual.", {"kind": "set", "rows": [["▲", "■", "◆", "○"]]}),
  makeAbstractLogicalQuestion("ABS-G-008", "classification_relationships", "analogy", "▲ becomes △. Using the same rule, what should ■ become?", ["□", "◆", "●", "▲"], "A", "The rule changes a filled shape to its outline version. Filled square becomes outline square.", "Name the transformation before applying it.", {"kind": "sequence", "rows": [["▲", "→", "△", "   ", "■", "→", "?"]]}),
  makeAbstractLogicalQuestion("ABS-G-009", "deductive_reasoning", "must_follow", "All rescue pumps are machines. Which statement must be true?", ["All rescue pumps are machines", "All machines are rescue pumps", "Some machines are not rescue pumps", "All rescue pumps are portable"], "A", "The only statement guaranteed by the information is the original relationship: every rescue pump is a machine.", "Choose only what must follow, not what might be true.", undefined),
  makeAbstractLogicalQuestion("ABS-G-010", "deductive_reasoning", "ordering", "Ali finishes before Ben. Ben finishes before Chen. Who must finish last?", ["Chen", "Ben", "Ali", "Cannot be known"], "A", "The order is Ali, then Ben, then Chen. Chen must be last.", "Build the order explicitly before answering.", undefined),
].map((question) => ({ ...question, sessionType: "guided_abstract_logical_practice" as const }));

const abstractLogicalIndependentPracticeQuestions: MvpQuestion[] = [
  makeAbstractLogicalQuestion("ABS-IP-001", "pattern_sequences", "alternating_pattern", "What comes next?", ["◆", "○", "■", "▲"], "A", "The pattern alternates ◆ and ○.", undefined, {"kind": "sequence", "rows": [["◆", "○", "◆", "○", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-002", "pattern_sequences", "count_progression", "What comes next?", ["■■", "■", "■■■", "□□□□"], "A", "The count falls by one: five, four, three, then two squares.", undefined, {"kind": "sequence", "rows": [["■■■■■", "■■■■", "■■■", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-003", "pattern_sequences", "rotation", "Which arrow comes next?", ["↖", "↘", "↙", "↑"], "A", "The arrow rotates 90° clockwise: ↗, ↘, ↙, ↖.", undefined, {"kind": "sequence", "rows": [["↗", "↘", "↙", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-004", "pattern_sequences", "alternating_fill", "What comes next?", ["▲▲▲▲▲", "△△△△△", "▲▲▲▲", "△△△△"], "A", "Fill alternates and the count increases by one: filled 1, outline 2, filled 3, outline 4, so the fifth term is five filled triangles.", undefined, {"kind": "sequence", "rows": [["▲", "△△", "▲▲▲", "△△△△", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-005", "pattern_sequences", "cycle", "What comes next?", ["■", "▲", "○", "◆"], "A", "The three-symbol cycle repeats ▲, ○, ■.", undefined, {"kind": "sequence", "rows": [["▲", "○", "■", "▲", "○", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-006", "pattern_sequences", "two_rule_sequence", "What comes next?", ["○○○○○○", "▲▲▲▲▲▲", "○○○○○", "▲▲▲▲▲"], "A", "Shape alternates triangle/circle and count rises from 1 to 6, so the sixth term is six circles.", undefined, {"kind": "sequence", "rows": [["▲", "○○", "▲▲▲", "○○○○", "▲▲▲▲▲", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-007", "matrices_rules", "row_progression", "What belongs in the missing cell?", ["■■■■", "■■■", "■■", "■"], "A", "Each row increases by one symbol from left to right: two, three, four.", undefined, {"kind": "matrix", "rows": [["▲", "▲▲", "▲▲▲"], ["■■", "■■■", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-008", "matrices_rules", "combination_rule", "What belongs in the missing cell?", ["○◆", "○○", "◆◆", "○"], "A", "The third cell combines the first and second cells. ○ and ◆ become ○◆.", undefined, {"kind": "matrix", "rows": [["▲", "■", "▲■"], ["○", "◆", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-009", "matrices_rules", "alternating_rule", "What belongs in the missing cell?", ["○", "▲", "■", "◆"], "A", "Each row alternates the two symbols: ▲ ○ ▲ and ○ ▲ ○.", undefined, {"kind": "matrix", "rows": [["▲", "○", "▲"], ["○", "▲", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-010", "matrices_rules", "column_progression", "What belongs in the missing cell?", ["●●●", "●●", "●●●●", "○○○"], "A", "Each column follows 1, 2, 3 symbols from top to bottom. The final cell needs three dots.", undefined, {"kind": "matrix", "rows": [["▲", "●"], ["▲▲", "●●"], ["▲▲▲", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-011", "matrices_rules", "subtraction_rule", "What belongs in the missing cell?", ["▲", "▲▲", "▲▲▲", "○"], "A", "In each row the third cell shows what remains when the second count is removed from the first: 3−2=1 and 4−3=1.", undefined, {"kind": "matrix", "rows": [["▲▲▲", "▲▲", "▲"], ["▲▲▲▲", "▲▲▲", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-012", "classification_relationships", "odd_one_out", "Which item is the odd one out?", ["○", "△", "□", "◇"], "A", "The circle is the only figure without corners.", undefined, {"kind": "set", "rows": [["△", "□", "◇", "○"]]}),
  makeAbstractLogicalQuestion("ABS-IP-013", "classification_relationships", "odd_one_out", "Which pair is the odd one out?", ["▲ → ▲", "▲ → △", "■ → □", "● → ○"], "A", "Three pairs change a filled shape to an outline shape. ▲ → ▲ does not change.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-IP-014", "classification_relationships", "analogy", "↑ becomes →. Using the same rule, what should ← become?", ["↑", "↓", "→", "←"], "A", "The rule is a 90° clockwise rotation. ← becomes ↑.", undefined, {"kind": "sequence", "rows": [["↑", "→", "→", "   ", "←", "→", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-015", "classification_relationships", "analogy", "▲▲ becomes ▲▲▲▲. Using the same rule, what should ●●● become?", ["●●●●●●", "●●●●", "●●", "●●●●●"], "A", "The quantity doubles. Three dots become six dots.", undefined, {"kind": "sequence", "rows": [["▲▲", "→", "▲▲▲▲", "   ", "●●●", "→", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-016", "classification_relationships", "shared_property", "Which option belongs with the group shown?", ["□", "○", "△", "◇"], "A", "The group contains four-sided shapes, so the square belongs with it.", undefined, {"kind": "set", "rows": [["▭", "◇", "▱", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-017", "deductive_reasoning", "syllogism", "All valves are components. No components are living things. What must follow?", ["No valves are living things", "All living things are valves", "Some components are valves", "No components are valves"], "A", "If all valves are components and no components are living things, then no valves are living things.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-IP-018", "deductive_reasoning", "some_not_all", "Some technicians are drivers. Which statement must be true?", ["At least one technician is a driver", "All technicians are drivers", "No drivers are technicians", "Most technicians are drivers"], "A", "'Some' guarantees at least one, but not all or most.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-IP-019", "deductive_reasoning", "ordering", "Dana arrives before Eli. Farah arrives after Eli. Who must arrive first?", ["Dana", "Eli", "Farah", "Cannot be known"], "A", "Dana is before Eli, and Farah is after Eli, so Dana must be first.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-IP-020", "deductive_reasoning", "conditional", "If the alarm sounds, the warning light turns on. The alarm sounds. What must follow?", ["The warning light turns on", "The warning light stays off", "The alarm is faulty", "Nothing can be concluded"], "A", "The stated rule directly applies: alarm sounds → warning light on.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-IP-021", "deductive_reasoning", "contrapositive", "If the gate is open, the sensor is active. The sensor is not active. What must follow?", ["The gate is not open", "The gate is open", "The sensor is broken", "Nothing can be concluded"], "A", "If an open gate always activates the sensor, then a non-active sensor means the gate cannot be open.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-IP-022", "deductive_reasoning", "ordering", "Job K must be done before Job L. Job M must be done after Job L. Which order is possible?", ["K, L, M", "L, K, M", "M, K, L", "L, M, K"], "A", "K must precede L, and M must follow L, giving K, L, M.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-IP-023", "deductive_reasoning", "syllogism", "All inspectors are trained. All trained staff carry identification. What must follow?", ["All inspectors carry identification", "All people with identification are inspectors", "Some trained staff are not inspectors", "No inspectors are trained"], "A", "The two universal statements link: inspector → trained → carries identification.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-IP-024", "pattern_sequences", "two_rule_sequence", "What comes next?", ["□□□□□", "■■■■■", "□□□□", "■■■■"], "A", "Fill alternates outline/filled while count increases. The fifth term is five outline squares.", undefined, {"kind": "sequence", "rows": [["□", "■■", "□□□", "■■■■", "?"]]}),
  makeAbstractLogicalQuestion("ABS-IP-025", "matrices_rules", "integrated_matrix", "What belongs in the missing cell?", ["▲▲○", "▲○", "▲▲▲○", "○○▲"], "A", "In each row the final cell combines the symbols in the first two cells. ▲▲ and ○ become ▲▲○.", undefined, {"kind": "matrix", "rows": [["▲", "○○", "▲○○"], ["▲▲", "○", "?"]]}),
].map((question) => ({ ...question, sessionType: "abstract_logical_independent_practice" as const }));

const abstractLogicalAssessmentQuestions: MvpQuestion[] = [
  makeAbstractLogicalQuestion("ABS-A-001", "pattern_sequences", "rotation", "Which symbol comes next?", ["→", "↓", "←", "↑"], "A", "The arrow rotates 90° clockwise each step.", undefined, {"kind": "sequence", "rows": [["→", "↓", "←", "↑", "?"]]}),
  makeAbstractLogicalQuestion("ABS-A-002", "matrices_rules", "combination_rule", "What belongs in the missing cell?", ["■○", "■■", "○○", "■"], "A", "The third cell combines the first two cells in each row.", undefined, {"kind": "matrix", "rows": [["▲", "◆", "▲◆"], ["■", "○", "?"]]}),
  makeAbstractLogicalQuestion("ABS-A-003", "classification_relationships", "odd_one_out", "Which item is the odd one out?", ["○", "△", "□", "⬟"], "A", "The circle is the only item without straight sides and corners.", undefined, {"kind": "set", "rows": [["△", "□", "⬟", "○"]]}),
  makeAbstractLogicalQuestion("ABS-A-004", "deductive_reasoning", "syllogism", "All breathing apparatus units are equipment. No equipment is a person. What must follow?", ["No breathing apparatus unit is a person", "All people are equipment", "Some equipment is a person", "All equipment is breathing apparatus"], "A", "Every breathing apparatus unit is equipment, and no equipment is a person.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-A-005", "pattern_sequences", "count_progression", "What comes next?", ["●●●●●", "●●●●", "●●●●●●", "●"], "A", "The count increases by one each step.", undefined, {"kind": "sequence", "rows": [["●", "●●", "●●●", "●●●●", "?"]]}),
  makeAbstractLogicalQuestion("ABS-A-006", "matrices_rules", "row_progression", "What belongs in the missing cell?", ["◇◇◇", "◇◇", "◇◇◇◇", "◆◆◆"], "A", "Each row progresses from one to two to three of the same symbol.", undefined, {"kind": "matrix", "rows": [["▲", "▲▲", "▲▲▲"], ["◇", "◇◇", "?"]]}),
  makeAbstractLogicalQuestion("ABS-A-007", "classification_relationships", "analogy", "● becomes ○. Using the same rule, what should ◆ become?", ["◇", "■", "▲", "◆"], "A", "The rule changes filled to outline; ◆ becomes ◇.", undefined, {"kind": "sequence", "rows": [["●", "→", "○", "   ", "◆", "→", "?"]]}),
  makeAbstractLogicalQuestion("ABS-A-008", "deductive_reasoning", "ordering", "Rina is before Sam. Tariq is after Sam. Who must be last?", ["Tariq", "Sam", "Rina", "Cannot be known"], "A", "The order must be Rina, Sam, Tariq.", undefined, undefined),
  makeAbstractLogicalQuestion("ABS-A-009", "pattern_sequences", "two_rule_sequence", "What comes next?", ["○○○○○○", "▲▲▲▲▲▲", "○○○○○", "▲▲▲▲▲"], "A", "Shape alternates and count increases by one, so the sixth term is six circles.", undefined, {"kind": "sequence", "rows": [["▲", "○○", "▲▲▲", "○○○○", "▲▲▲▲▲", "?"]]}),
  makeAbstractLogicalQuestion("ABS-A-010", "matrices_rules", "column_progression", "What belongs in the missing cell?", ["■■■", "■■", "■■■■", "□□□"], "A", "Each column increases from one to two to three symbols.", undefined, {"kind": "matrix", "rows": [["○", "■"], ["○○", "■■"], ["○○○", "?"]]}),
  makeAbstractLogicalQuestion("ABS-A-011", "classification_relationships", "shared_property", "Which option belongs with the group?", ["⬡", "○", "△", "□"], "A", "The displayed group contains shapes with six sides, so the hexagon belongs.", undefined, {"kind": "set", "rows": [["⬢", "⬡", "⌬", "?"]]}),
  makeAbstractLogicalQuestion("ABS-A-012", "deductive_reasoning", "conditional", "If a test is complete, a result is recorded. No result has been recorded. What must follow?", ["The test is not complete", "The test is complete", "The result was deleted", "Nothing can be concluded"], "A", "Under the stated rule, a completed test would produce a recorded result. No result means the test is not complete.", undefined, undefined),
].map((question) => ({ ...question, sessionType: "abstract_logical_assessment" as const }));


function makeVerbalQuestion(
  questionId: string,
  subcompetency: VerbalSubcompetency,
  concept: string,
  passage: VerbalPassage,
  stem: string,
  options: string[],
  correctLabel: OptionLabel,
  explanation: string,
  feedbackCue?: string,
  sessionType: "guided_verbal_practice" | "verbal_independent_practice" | "verbal_assessment" = "guided_verbal_practice"
): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return {
    questionId,
    sessionType,
    pathwayId: "fire_service",
    domain: "verbal",
    subcompetency,
    concept,
    difficulty: sessionType === "guided_verbal_practice" ? "developing" : "applied",
    stem,
    options: prepared.options,
    correctOptionId: prepared.correctOptionId,
    explanation,
    feedbackCue,
    verbalPassage: passage,
  };
}

const guidedVerbalPracticeQuestions: MvpQuestion[] = [
  makeVerbalQuestion("VER-G-001", "explicit_information", "stated_detail", { title: "Equipment notice", text: "All breathing apparatus sets must be returned to Bay 3 after inspection. Damaged sets should be tagged and placed on the red shelf beside the workshop door." }, "Where should a damaged breathing apparatus set be placed?", ["On the red shelf beside the workshop door", "In Bay 3 with all other sets", "At the front desk", "Inside the inspection room"], "A", "The notice explicitly says damaged sets should be placed on the red shelf beside the workshop door.", "Locate the exact sentence that answers the question."),
  makeVerbalQuestion("VER-G-002", "explicit_information", "main_point", { title: "Training update", text: "Tomorrow's outdoor hose drill has been moved indoors because of forecast lightning. The start time remains 08:30, and candidates should report to the equipment hall rather than the drill yard." }, "What is the main purpose of the update?", ["To tell candidates that the drill location has changed", "To cancel the drill completely", "To move the start time to the afternoon", "To announce a new equipment inspection"], "A", "The central message is that the drill is still happening but has moved indoors.", "Ask what one message the whole passage is mainly communicating."),
  makeVerbalQuestion("VER-G-003", "inference_context", "supported_inference", { title: "Station log", text: "At 06:45 the crew began the vehicle check. At 06:58 a missing torch was recorded. The vehicle left the station at 07:12 after a replacement torch had been collected from stores." }, "What can reasonably be inferred?", ["The missing torch was replaced before the vehicle left", "The vehicle left without completing any checks", "The torch was found inside the vehicle", "Stores opened at exactly 06:58"], "A", "The passage says a replacement torch was collected before the vehicle left, so that inference is supported.", "Choose what the passage supports, not what could merely be possible."),
  makeVerbalQuestion("VER-G-004", "inference_context", "meaning_in_context", { title: "Supervisor note", text: "The first plan was workable, but it left very little margin for delay. The revised plan was more robust because it allowed extra time for equipment checks and travel." }, "In this passage, what does robust most nearly mean?", ["Able to cope better with problems or delay", "Physically heavy", "More expensive", "Difficult to understand"], "A", "The context explains that the revised plan can tolerate delay better, so robust means more resilient or reliable.", "Use the surrounding sentence to test the meaning."),
  makeVerbalQuestion("VER-G-005", "instructions_sequence", "ordered_steps", { title: "Radio check procedure", text: "First switch the radio to Channel 2. Then press the test key for two seconds. If no tone is heard, check the battery indicator before reporting a fault." }, "What should happen immediately before a fault is reported?", ["Check the battery indicator", "Switch to Channel 2", "Press the test key for two seconds", "Replace the radio"], "A", "If no tone is heard, the instruction says to check the battery indicator before reporting a fault.", "Follow the sequence exactly and pay attention to words such as before and then."),
  makeVerbalQuestion("VER-G-006", "instructions_sequence", "conditional_instruction", { title: "Entry instruction", text: "Candidates with a blue pass should enter through Gate A. Candidates with a green pass should use Gate B. Anyone arriving after 09:00 must report to reception first, regardless of pass colour." }, "A candidate with a blue pass arrives at 09:10. What should they do first?", ["Report to reception", "Enter through Gate A", "Enter through Gate B", "Wait outside until the next session"], "A", "The late-arrival rule applies regardless of pass colour, so reception comes first.", "When rules conflict, look for words such as regardless, except or only if."),
  makeVerbalQuestion("VER-G-007", "assumptions_conclusions", "unsupported_assumption", { title: "Brief report", text: "Three candidates completed the new practice set. All three improved their scores on a second attempt." }, "Which statement would be an unsupported assumption?", ["The new practice set will improve every candidate's score", "Three candidates completed the set", "Each candidate attempted the set twice", "All three scored better on the second attempt"], "A", "The passage describes only three candidates. It does not justify a claim about every candidate.", "Watch for answers that go beyond the size or scope of the evidence."),
  makeVerbalQuestion("VER-G-008", "assumptions_conclusions", "must_follow", { title: "Selection rule", text: "Every candidate who reaches Stage 3 has completed the written assessment. Priya has reached Stage 3." }, "Which conclusion must follow?", ["Priya completed the written assessment", "Priya passed every part of the selection process", "Priya received the highest written score", "Priya has already been offered a position"], "A", "The rule states that everyone who reaches Stage 3 has completed the written assessment.", "Choose only the conclusion guaranteed by the statements."),
  makeVerbalQuestion("VER-G-009", "explicit_information", "stated_exception", { title: "Library access", text: "The training library is open from 07:00 to 19:00 on weekdays. On Fridays it closes at 17:00. Weekend access is available only to staff with prior approval." }, "When does the training library close on Friday?", ["17:00", "19:00", "07:00", "It is closed all day"], "A", "Friday is the stated exception to the usual weekday closing time.", "Look for exceptions that modify a general rule."),
  makeVerbalQuestion("VER-G-010", "instructions_sequence", "multi_condition", { title: "Assessment submission", text: "Complete the answer sheet in black ink. If you change an answer, erase it fully before marking the new choice. At the end, place the answer sheet inside the booklet but do not seal the booklet." }, "What should a candidate do at the end of the assessment?", ["Place the answer sheet inside the booklet without sealing it", "Seal the booklet with the answer sheet inside", "Hand in the answer sheet separately", "Rewrite all changed answers in blue ink"], "A", "The final instruction is to place the sheet inside the booklet and not seal it.", "Keep the exact instruction in view and avoid adding a familiar procedure that is not stated."),
];

const verbalIndependentPracticeQuestions: MvpQuestion[] = [
  makeVerbalQuestion("VER-IP-001", "explicit_information", "stated_detail", { title: "Workshop notice", text: "Protective gloves are stored in Cabinet 4. Eye protection is kept in the wall rack. Used batteries must be placed in the marked recycling container near the rear exit." }, "Where should used batteries be placed?", ["In the marked recycling container near the rear exit", "In Cabinet 4", "In the wall rack", "Beside the front entrance"], "A", "The final sentence gives the required location.", undefined),
  makeVerbalQuestion("VER-IP-002", "explicit_information", "main_point", { title: "Schedule message", text: "The afternoon assessment will begin at the usual time, but Room 6 is unavailable. All candidates should report to Room 9 instead. Staff will place signs in the corridor." }, "What is the main message?", ["The assessment location has changed", "The assessment has been cancelled", "The assessment time has changed", "Candidates should wait in the corridor"], "A", "The key update is the change from Room 6 to Room 9.", undefined),
  makeVerbalQuestion("VER-IP-003", "explicit_information", "stated_reason", { title: "Maintenance note", text: "Pump 2 was removed from service after an unusual vibration was detected during the morning check. A spare unit was installed so operations could continue." }, "Why was Pump 2 removed from service?", ["An unusual vibration was detected", "The spare unit failed", "Operations had already stopped", "The morning check was cancelled"], "A", "The passage directly states the reason.", undefined),
  makeVerbalQuestion("VER-IP-004", "explicit_information", "time_detail", { title: "Candidate briefing", text: "Registration opens at 07:30. The briefing begins at 08:10, and doors close five minutes before it starts. Late candidates will not be admitted once the doors are closed." }, "At what time do the doors close?", ["08:05", "08:10", "07:30", "08:15"], "A", "Five minutes before 08:10 is 08:05.", undefined),
  makeVerbalQuestion("VER-IP-005", "explicit_information", "comparison_detail", { title: "Practice summary", text: "Group A completed 18 questions with two errors. Group B completed 16 questions with one error. Group C completed 20 questions with four errors." }, "Which group completed the most questions?", ["Group C", "Group A", "Group B", "Groups A and C equally"], "A", "Group C completed 20 questions, the highest number stated.", undefined),
  makeVerbalQuestion("VER-IP-006", "explicit_information", "stated_exception", { title: "Parking instruction", text: "Visitor parking is permitted in Rows 1 to 4. Row 3 is reserved for maintenance vehicles until noon. After noon, visitors may also use Row 3." }, "At 10:00, which row is unavailable to visitors?", ["Row 3", "Row 1", "Row 2", "Row 4"], "A", "Row 3 is reserved until noon.", undefined),

  makeVerbalQuestion("VER-IP-007", "inference_context", "supported_inference", { title: "Incident note", text: "The training room was empty when the alarm sounded. Two minutes later, staff arrived and found smoke coming from a faulty projector. The projector was disconnected and the room remained closed for the rest of the day." }, "What can reasonably be inferred?", ["The room was closed because of the incident", "The projector had been repaired before staff arrived", "People were evacuated from the room when the alarm sounded", "The alarm was known to be faulty"], "A", "The room remained closed after the smoke incident, supporting that inference.", undefined),
  makeVerbalQuestion("VER-IP-008", "inference_context", "meaning_in_context", { title: "Review comment", text: "The candidate's first explanation was vague. The second was more precise: it identified the exact rule and showed how each step followed from it." }, "What does precise most nearly mean here?", ["Exact and clearly defined", "Long and complicated", "Quietly spoken", "Unexpected"], "A", "The passage contrasts vague with exact identification of the rule.", undefined),
  makeVerbalQuestion("VER-IP-009", "inference_context", "author_attitude", { title: "Supervisor email", text: "The new checklist has reduced missed steps, but it is still too long for urgent use. We should keep the essential safety checks and remove duplicated items before the next trial." }, "Which view best reflects the writer's position?", ["The checklist is useful but needs refinement", "The checklist should be abandoned immediately", "The checklist is already perfect", "Safety checks should be removed"], "A", "The writer recognises a benefit but recommends shortening and refining the checklist.", undefined),
  makeVerbalQuestion("VER-IP-010", "inference_context", "supported_inference", { title: "Attendance record", text: "Nine candidates were booked for the morning session. Seven signed the attendance sheet. No one entered the room without signing." }, "What can be concluded?", ["At most seven booked candidates entered the room", "All nine candidates entered the room", "Two candidates entered without signing", "Exactly seven people passed the session"], "A", "If no one entered without signing and seven signed, no more than seven booked candidates entered.", undefined),
  makeVerbalQuestion("VER-IP-011", "inference_context", "meaning_in_context", { title: "Operations update", text: "Demand was intermittent during the morning: long quiet periods were followed by several calls arriving close together." }, "What does intermittent mean in this context?", ["Occurring at irregular intervals", "Continuing without any break", "Gradually decreasing", "Impossible to predict at all"], "A", "The description of quiet periods interrupted by clusters shows that demand occurred at intervals.", undefined),
  makeVerbalQuestion("VER-IP-012", "inference_context", "cause_effect", { title: "Practice result", text: "After the diagrams were enlarged, candidates made fewer errors when identifying small labels. Their scores on questions without small labels did not change." }, "Which inference is best supported?", ["The larger diagrams mainly helped candidates read small labels", "The larger diagrams improved every reasoning skill", "Candidates had memorised all the questions", "Small labels were never a problem"], "A", "The improvement was specific to questions involving small labels.", undefined),

  makeVerbalQuestion("VER-IP-013", "instructions_sequence", "ordered_steps", { title: "Equipment issue procedure", text: "Record the item number first. Then attach a yellow tag. After the tag is attached, move the item to the quarantine area and notify the supervisor." }, "What should happen immediately after the yellow tag is attached?", ["Move the item to the quarantine area", "Record the item number", "Return the item to service", "Remove the tag"], "A", "The passage states that movement to quarantine follows attachment of the tag.", undefined),
  makeVerbalQuestion("VER-IP-014", "instructions_sequence", "conditional_instruction", { title: "Practice booking", text: "Bookings may be changed online until 18:00 the day before the session. After that time, candidates must phone the training office. Changes are not accepted after the session has started." }, "A candidate wants to change a booking at 20:00 the day before the session. What should they do?", ["Phone the training office", "Change it online", "Wait until the session starts", "Make no contact because changes are forbidden"], "A", "After 18:00 the online option closes and the candidate must phone the office.", undefined),
  makeVerbalQuestion("VER-IP-015", "instructions_sequence", "exception_rule", { title: "Protective clothing", text: "Wear a helmet and gloves in the drill area. During classroom-only sessions, helmets are not required, but gloves must still be carried if practical work is scheduled later that day." }, "A candidate attends a classroom session followed by practical work later that day. Which instruction applies during the classroom session?", ["A helmet is not required, but gloves should be carried", "Both helmet and gloves must be worn", "Neither helmet nor gloves may be brought inside", "A helmet must be worn but gloves are optional"], "A", "The classroom exception removes the helmet requirement, while the later practical work means gloves should still be carried.", undefined),
  makeVerbalQuestion("VER-IP-016", "instructions_sequence", "priority_rule", { title: "Evacuation instruction", text: "Leave by the nearest safe exit. Do not use an exit blocked by smoke. If the normal assembly point is inaccessible, proceed to the secondary assembly point beside the south gate." }, "The nearest exit is blocked by smoke. What should a person do?", ["Use another safe exit", "Use the blocked exit because it is nearest", "Remain inside until the smoke clears", "Go directly to the secondary assembly point without leaving the building"], "A", "The nearest exit rule applies only to a safe exit; a smoke-blocked exit must not be used.", undefined),
  makeVerbalQuestion("VER-IP-017", "instructions_sequence", "multi_condition", { title: "Document handling", text: "Unsigned forms should be returned to the candidate. Signed forms with missing dates should be placed in Tray B. Fully completed forms go to Tray C." }, "Where should a signed form with no date be placed?", ["Tray B", "Tray C", "Returned to the candidate", "Destroyed"], "A", "The second rule applies exactly: signed but missing a date goes to Tray B.", undefined),
  makeVerbalQuestion("VER-IP-018", "instructions_sequence", "sequence_constraint", { title: "Test station procedure", text: "Check the display before connecting the sensor. Connect the sensor before pressing Start. Record the reading only after the value has remained stable for ten seconds." }, "Which order is correct?", ["Check display → connect sensor → press Start → wait for stability → record", "Connect sensor → check display → record → press Start", "Press Start → connect sensor → record immediately", "Record → check display → connect sensor"], "A", "The correct order follows each stated before/after relationship.", undefined),

  makeVerbalQuestion("VER-IP-019", "assumptions_conclusions", "unsupported_assumption", { title: "Trial result", text: "The new online module was completed by 40 candidates. Thirty-two said they found it easier to navigate than the old version." }, "Which statement is not justified by the passage?", ["The new module is easier for every candidate", "Most respondents preferred the new navigation", "Forty candidates completed the module", "Eight candidates did not say the new version was easier to navigate"], "A", "The result does not support a claim about every candidate.", undefined),
  makeVerbalQuestion("VER-IP-020", "assumptions_conclusions", "must_follow", { title: "Eligibility rule", text: "Only candidates who have completed the medical questionnaire may book the fitness test. Ben has booked the fitness test." }, "What must follow?", ["Ben completed the medical questionnaire", "Ben passed the fitness test", "Ben completed every selection stage", "Ben has no medical conditions"], "A", "Booking the test is allowed only after completing the questionnaire.", undefined),
  makeVerbalQuestion("VER-IP-021", "assumptions_conclusions", "scope_limit", { title: "Survey finding", text: "Of the 120 candidates surveyed at one centre, 78 preferred shorter practice sessions." }, "Which conclusion is best supported?", ["Most surveyed candidates at that centre preferred shorter sessions", "Most candidates everywhere prefer shorter sessions", "All 120 candidates preferred shorter sessions", "Shorter sessions always produce higher scores"], "A", "The evidence supports a claim about the surveyed group at that centre, not all candidates.", undefined),
  makeVerbalQuestion("VER-IP-022", "assumptions_conclusions", "must_follow", { title: "Storage rule", text: "All damaged helmets are removed from service. Helmet H17 is damaged." }, "Which conclusion must follow?", ["Helmet H17 is removed from service", "Helmet H17 cannot be repaired", "All helmets are damaged", "Helmet H17 caused an incident"], "A", "The universal rule applies directly to H17.", undefined),
  makeVerbalQuestion("VER-IP-023", "assumptions_conclusions", "argument_evidence", { title: "Proposal", text: "The training hall is busiest between 17:00 and 19:00. Opening one hour earlier would not reduce demand during that period unless some users changed when they attended." }, "Which fact would most strengthen the proposal to open earlier?", ["Many users say they would attend before 17:00 if the hall opened earlier", "The hall has blue flooring", "Most equipment is stored indoors", "The busiest period lasts two hours"], "A", "The proposal works only if some users shift attendance, so evidence that they would do so directly strengthens it.", undefined),
  makeVerbalQuestion("VER-IP-024", "assumptions_conclusions", "contradiction", { title: "Statements", text: "No vehicles in Bay 2 are available for use. Vehicle R4 is in Bay 2." }, "Which statement is inconsistent with the information?", ["Vehicle R4 is available for immediate use", "Vehicle R4 is in Bay 2", "Bay 2 contains at least one vehicle", "R4 is not available for use"], "A", "If no vehicle in Bay 2 is available and R4 is there, R4 cannot be available.", undefined),
  makeVerbalQuestion("VER-IP-025", "assumptions_conclusions", "best_conclusion", { title: "Performance note", text: "Candidates who paused to check the units made fewer calculation errors in this practice set. The note does not record how long they took overall." }, "Which conclusion is best supported?", ["Checking units was associated with fewer calculation errors in this set", "Checking units always improves every test score", "Candidates who checked units finished faster", "Time pressure had no effect"], "A", "The passage supports only an association with fewer calculation errors in this set.", undefined),
].map((question) => ({ ...question, sessionType: "verbal_independent_practice" as const }));

const verbalAssessmentQuestions: MvpQuestion[] = [
  makeVerbalQuestion("VER-A-001", "explicit_information", "stated_detail", { title: "Assessment notice", text: "Candidates must bring photo identification and arrive by 07:45. Lockers are available for phones and bags. The written assessment begins at 08:15." }, "What time must candidates arrive by?", ["07:45", "08:15", "07:15", "08:45"], "A", "The passage explicitly states an arrival time of 07:45.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-002", "inference_context", "meaning_in_context", { title: "Review", text: "The instructions were concise: they covered every essential step without unnecessary detail." }, "What does concise most nearly mean?", ["Brief but complete", "Confusing and incomplete", "Highly technical", "Repeated several times"], "A", "The context defines concise as covering what matters without unnecessary detail.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-003", "instructions_sequence", "conditional_instruction", { title: "Entry procedure", text: "Use the east entrance before 18:00. After 18:00, the east entrance is locked and all visitors must use the staffed west entrance." }, "A visitor arrives at 18:20. Which entrance should they use?", ["The west entrance", "The east entrance", "Either entrance", "No entrance is available"], "A", "After 18:00 all visitors must use the staffed west entrance.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-004", "assumptions_conclusions", "must_follow", { title: "Training rule", text: "Everyone who operates the lifting platform has completed platform training. Luca operates the lifting platform." }, "What must follow?", ["Luca completed platform training", "Luca trains all other operators", "Luca has never made an error", "Platform training guarantees promotion"], "A", "The universal rule applies directly to Luca.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-005", "explicit_information", "main_point", { title: "Service update", text: "The online practice system will be unavailable from 22:00 Saturday until 02:00 Sunday for maintenance. Saved progress will not be affected." }, "What is the main purpose of the update?", ["To warn of a temporary service interruption", "To say all progress will be deleted", "To announce a new assessment", "To change candidate passwords"], "A", "The update mainly announces a temporary maintenance outage.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-006", "inference_context", "supported_inference", { title: "Equipment record", text: "A pressure gauge failed its morning check and was marked out of service. A second gauge passed the same check and was fitted to the unit before training began." }, "What can reasonably be inferred?", ["The failed gauge was not used for the training session", "Both gauges failed the check", "Training began before any gauge was fitted", "The second gauge was also marked out of service"], "A", "A passing replacement was fitted before training, supporting that the failed gauge was not used.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-007", "instructions_sequence", "ordered_steps", { title: "Sample procedure", text: "Label the container before collecting the sample. Seal it immediately after collection. Then record the time on the form." }, "What should happen immediately after the sample is collected?", ["Seal the container", "Label the container", "Record the time before sealing", "Discard the form"], "A", "The instruction says to seal the container immediately after collection.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-008", "assumptions_conclusions", "scope_limit", { title: "Pilot study", text: "In a pilot involving 25 candidates, 19 completed more questions after the interface was simplified." }, "Which conclusion is best supported?", ["Most candidates in the pilot completed more questions after the change", "The change will help every future candidate", "The interface was the only factor affecting performance", "All 25 candidates improved"], "A", "The evidence supports a statement about most participants in this pilot only.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-009", "explicit_information", "stated_exception", { title: "Access hours", text: "The practice room closes at 20:00 Monday to Thursday and at 18:00 on Friday. It is closed on public holidays." }, "When does the room close on Friday?", ["18:00", "20:00", "It is always closed", "22:00"], "A", "Friday has a stated closing time of 18:00.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-010", "inference_context", "author_attitude", { title: "Manager note", text: "The revised briefing is clearer than the old one, but candidates still miss the final reporting instruction. That section should be rewritten before the next intake." }, "Which statement best reflects the manager's view?", ["The revision is an improvement but one section still needs work", "The old briefing should be restored unchanged", "The revised briefing has no problems", "The final reporting instruction should be removed"], "A", "The writer sees improvement but identifies one remaining problem.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-011", "instructions_sequence", "priority_rule", { title: "Fault response", text: "If the warning light appears, stop the machine. If there is also smoke or a burning smell, move away and raise the alarm rather than attempting a restart." }, "The warning light appears and smoke is visible. What should the operator do?", ["Move away and raise the alarm", "Restart the machine immediately", "Ignore the smoke and continue", "Wait beside the machine for ten minutes"], "A", "The smoke condition triggers the stronger instruction to move away and raise the alarm.", undefined, "verbal_assessment"),
  makeVerbalQuestion("VER-A-012", "assumptions_conclusions", "unsupported_assumption", { title: "Result summary", text: "Candidates who attended the optional workshop had a higher average score than candidates who did not attend." }, "Which conclusion is not justified by this information alone?", ["The workshop caused the higher scores", "The workshop group had a higher average score", "The two groups had different average scores", "Attendance was optional"], "A", "An observed difference does not by itself prove that the workshop caused it.", undefined, "verbal_assessment"),
];


type StartingQuestionExtras = {
  dataTable?: NumericalDataTable;
  abstractVisual?: AbstractVisual;
  verbalPassage?: VerbalPassage;
};

function makeStartingQuestion(
  questionId: string,
  domain: Domain,
  subcompetency: Subcompetency,
  concept: string,
  stem: string,
  options: string[],
  correctLabel: OptionLabel,
  explanation: string,
  extras: StartingQuestionExtras = {}
): MvpQuestion {
  const prepared = buildQuestionOptions(questionId, options, correctLabel);
  return {
    questionId,
    sessionType: "mechanical_starting_point",
    pathwayId: "fire_service",
    domain,
    subcompetency,
    concept,
    difficulty: "foundational",
    stem,
    options: prepared.options,
    correctOptionId: prepared.correctOptionId,
    explanation,
    ...extras,
  };
}

const startingAssessmentQuestions: MvpQuestion[] = [
  // Mechanical reasoning — eight questions, two from each core topic.
  makeStartingQuestion("START-MECH-001", "mechanical", "hydraulics", "pressure_transfer", "In a sealed hydraulic system, force is applied to the input piston. What happens to the pressure created in the fluid?", ["It is transmitted through the fluid", "It stays only behind the input piston", "It is destroyed by the fluid", "It can act only if the system is open"], "A", "Pressure applied to a sealed fluid is transmitted through the system."),
  makeStartingQuestion("START-MECH-002", "mechanical", "hydraulics", "piston_area_force", "Why can a larger output piston produce more force than a smaller input piston in an ideal hydraulic system?", ["The same pressure acts over a larger area", "The larger piston creates pressure from nothing", "The output piston always moves farther", "The fluid makes the load lighter"], "A", "At the same pressure, a larger piston area produces greater force."),
  makeStartingQuestion("START-MECH-003", "mechanical", "gears", "direct_mesh_direction", "Gear A turns clockwise and directly meshes with Gear B. Which way does Gear B turn?", ["Anticlockwise", "Clockwise", "It does not turn", "Direction depends only on gear size"], "A", "Directly meshed gears rotate in opposite directions."),
  makeStartingQuestion("START-MECH-004", "mechanical", "gears", "gear_ratio", "A 12-tooth gear drives a 36-tooth gear. Compared with the 12-tooth gear, the 36-tooth gear turns:", ["At one-third the speed", "Three times faster", "At the same speed", "In no predictable relationship"], "A", "The driven gear has three times as many teeth, so it turns at one-third the speed."),
  makeStartingQuestion("START-MECH-005", "mechanical", "pulleys", "fixed_pulley", "What is the main effect of a single fixed pulley?", ["It changes the direction of the pulling force", "It halves the required force", "It doubles the load", "It prevents the rope from moving"], "A", "A single fixed pulley mainly changes the direction of effort."),
  makeStartingQuestion("START-MECH-006", "mechanical", "pulleys", "supporting_strands", "A moving load is directly supported by three rope sections in an ideal pulley system. What is the ideal mechanical advantage?", ["3", "1", "2", "6"], "A", "Three supporting rope sections give an ideal mechanical advantage of three."),
  makeStartingQuestion("START-MECH-007", "mechanical", "levers", "easiest_setup", "Which lever arrangement gives the greatest ideal force advantage?", ["A long effort arm and a short load arm", "A short effort arm and a long load arm", "Equal arms with the effort at the fulcrum", "No fulcrum"], "A", "A long effort arm and short load arm give the greatest force advantage."),
  makeStartingQuestion("START-MECH-008", "mechanical", "levers", "moment_balance", "A 300 N load acts 0.5 m from a fulcrum. An effort is applied 1.5 m from the fulcrum. What effort balances the load?", ["100 N", "300 N", "450 N", "900 N"], "A", "The load moment is 300 × 0.5 = 150 N·m. Dividing by the 1.5 m effort arm gives 100 N."),

  // Numerical reasoning — six questions across arithmetic, estimation, percentages, ratios, rates and data.
  makeStartingQuestion("START-NUM-001", "numerical", "arithmetic_estimation", "basic_arithmetic", "What is 438 + 276?", ["714", "704", "724", "614"], "A", "438 + 276 = 714."),
  makeStartingQuestion("START-NUM-002", "numerical", "arithmetic_estimation", "estimation", "Which is the closest estimate for 39.6 × 5.2?", ["200", "100", "300", "40"], "A", "40 × 5 is about 200."),
  makeStartingQuestion("START-NUM-003", "numerical", "percentages_ratios", "percentage_of_amount", "What is 15% of 320?", ["48", "32", "64", "45"], "A", "10% of 320 is 32 and 5% is 16, giving 48."),
  makeStartingQuestion("START-NUM-004", "numerical", "percentages_ratios", "ratio_sharing", "Red and blue markers are in the ratio 3:5. There are 64 markers altogether. How many are red?", ["24", "40", "18", "32"], "A", "There are eight ratio parts. Each part is 8, so red = 3 × 8 = 24."),
  makeStartingQuestion("START-NUM-005", "numerical", "rates_proportion", "unit_rate", "A vehicle travels 240 km in 4 hours. What is its average speed?", ["60 km/h", "80 km/h", "40 km/h", "960 km/h"], "A", "240 ÷ 4 = 60 km/h."),
  makeStartingQuestion("START-NUM-006", "numerical", "tables_data", "table_percentage", "Which station had the highest completion rate?", ["South", "North", "East", "West"], "A", "South completed 45 of 50 tasks, a 90% completion rate, which is the highest.", { dataTable: { headers: ["Station", "Assigned", "Completed"], rows: [["North", "45", "36"], ["South", "50", "45"], ["East", "40", "34"], ["West", "60", "48"]] } }),

  // Abstract & logical reasoning — six questions across patterns, matrices, classification and deduction.
  makeStartingQuestion("START-ABS-001", "abstract_logical", "pattern_sequences", "rotation", "Which symbol comes next?", ["↑", "→", "↓", "←"], "A", "The arrow rotates 90° clockwise each step.", { abstractVisual: { kind: "sequence", rows: [["↑", "→", "↓", "←", "?"]] } }),
  makeStartingQuestion("START-ABS-002", "abstract_logical", "pattern_sequences", "two_rule_sequence", "What comes next?", ["▲▲▲▲▲", "○○○○○", "▲▲▲▲", "○○○○○○"], "A", "Shape alternates while the count increases by one. The fifth term is five triangles.", { abstractVisual: { kind: "sequence", rows: [["▲", "○○", "▲▲▲", "○○○○", "?"]] } }),
  makeStartingQuestion("START-ABS-003", "abstract_logical", "matrices_rules", "combination_rule", "What belongs in the missing cell?", ["■■◆", "■◆", "■■", "◆◆"], "A", "The third cell combines the symbols in the first two cells of each row.", { abstractVisual: { kind: "matrix", rows: [["▲", "○○", "▲○○"], ["■■", "◆", "?"]] } }),
  makeStartingQuestion("START-ABS-004", "abstract_logical", "classification_relationships", "odd_one_out", "Which item is the odd one out?", ["○", "△", "□", "⬟"], "A", "The circle is the only item without straight sides and corners.", { abstractVisual: { kind: "set", rows: [["△", "□", "⬟", "○"]] } }),
  makeStartingQuestion("START-ABS-005", "abstract_logical", "deductive_reasoning", "syllogism", "All rescue helmets are equipment. No equipment is a living thing. What must follow?", ["No rescue helmet is a living thing", "All living things are rescue helmets", "Some equipment is a living thing", "All equipment is a rescue helmet"], "A", "Every rescue helmet is equipment, and no equipment is a living thing."),
  makeStartingQuestion("START-ABS-006", "abstract_logical", "deductive_reasoning", "ordering", "Maya finishes before Noah. Noah finishes before Omar. Who must finish last?", ["Omar", "Noah", "Maya", "Cannot be known"], "A", "The required order is Maya, then Noah, then Omar."),

  // Verbal comprehension — six questions across stated information, context, instructions, inference and scope.
  makeStartingQuestion("START-VER-001", "verbal", "explicit_information", "stated_detail", "What time must candidates arrive by?", ["07:40", "08:00", "07:20", "08:30"], "A", "The notice explicitly states an arrival time of 07:40.", { verbalPassage: { title: "Assessment notice", text: "Candidates must bring photo identification and arrive by 07:40. Lockers are available for phones and bags. The written assessment begins at 08:00." } }),
  makeStartingQuestion("START-VER-002", "verbal", "inference_context", "meaning_in_context", "What does concise most nearly mean?", ["Brief but complete", "Confusing and incomplete", "Highly technical", "Repeated several times"], "A", "The context defines concise as covering what matters without unnecessary detail.", { verbalPassage: { title: "Review", text: "The revised instructions were concise: they covered every essential step without unnecessary detail." } }),
  makeStartingQuestion("START-VER-003", "verbal", "instructions_sequence", "conditional_instruction", "A visitor arrives at 18:20. Which entrance should they use?", ["The west entrance", "The east entrance", "Either entrance", "No entrance is available"], "A", "After 18:00 all visitors must use the staffed west entrance.", { verbalPassage: { title: "Entry procedure", text: "Use the east entrance before 18:00. After 18:00, the east entrance is locked and all visitors must use the staffed west entrance." } }),
  makeStartingQuestion("START-VER-004", "verbal", "instructions_sequence", "ordered_steps", "What should happen immediately after the sample is collected?", ["Seal the container", "Label the container", "Record the time before sealing", "Discard the form"], "A", "The instruction says to seal the container immediately after collection.", { verbalPassage: { title: "Sample procedure", text: "Label the container before collecting the sample. Seal it immediately after collection. Then record the time on the form." } }),
  makeStartingQuestion("START-VER-005", "verbal", "inference_context", "supported_inference", "What can reasonably be inferred?", ["The failed gauge was not used for the training session", "Both gauges failed the check", "Training began before any gauge was fitted", "The replacement gauge was also marked out of service"], "A", "A passing replacement was fitted before training, supporting that the failed gauge was not used.", { verbalPassage: { title: "Equipment record", text: "A pressure gauge failed its morning check and was marked out of service. A second gauge passed the same check and was fitted to the unit before training began." } }),
  makeStartingQuestion("START-VER-006", "verbal", "assumptions_conclusions", "scope_limit", "Which conclusion is best supported?", ["Most candidates in the pilot completed more questions after the change", "The change will help every future candidate", "The interface was the only factor affecting performance", "All candidates in the pilot improved"], "A", "The evidence supports a statement about most participants in this pilot only.", { verbalPassage: { title: "Pilot study", text: "In a pilot involving 24 candidates, 18 completed more questions after the interface was simplified." } }),
];

const startingDomainOrder: Domain[] = ["mechanical", "numerical", "abstract_logical", "verbal"];
const startingDomainLabels: Record<Domain, string> = {
  mechanical: "Mechanical reasoning",
  numerical: "Numerical reasoning",
  abstract_logical: "Abstract & logical reasoning",
  verbal: "Verbal comprehension",
};

const hydraulicFundamentalsModule: LearningModule = {
  moduleId: "hydraulic_fundamentals",
  title: "Hydraulic Pressure",
  subtitle: "Learn why a small input force can produce a much larger output force",
  targetDomain: "mechanical",
  targetSubcompetency: "hydraulics",
  estimatedMinutes: 10,
  sections: [
    {
      sectionId: "hyd-fund-001",
      title: "How can one person lift a car?",
      body: "A hydraulic jack can lift a heavy vehicle using a much smaller input force. The system does not create energy or make the vehicle lighter. It uses a simple relationship between pressure, piston area and force.",
      keyPoint: "By the end of this journey, you will know how to approach most basic hydraulic pressure questions.",
    },
    {
      sectionId: "hyd-fund-002",
      title: "Look for what stays the same",
      body: "In an ideal sealed hydraulic system, pressure applied at one piston is transmitted through the fluid. The pressure does not become larger at the output piston.",
      keyPoint: "Pressure stays the same throughout the fluid.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-002", "Which quantity is transmitted through an ideal sealed hydraulic system?", ["Pressure", "Piston area", "Movement distance", "Load weight"], "A", "Pressure is transmitted through the confined fluid."),
    },
    {
      sectionId: "hyd-fund-003",
      title: "Then look for what changes",
      body: "The output piston can have a much larger surface area than the input piston. When the same pressure acts over that larger area, the output force becomes larger. The pressure has not increased—the area has.",
      keyPoint: "The larger piston increases force, not pressure.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-003", "The same pressure acts on two pistons. Which produces greater force?", ["The piston with the larger area", "The piston with the smaller area", "Both always produce the same force", "Area has no effect"], "A", "The same pressure acting over a larger area produces greater force."),
    },
    {
      sectionId: "hyd-fund-004",
      title: "The pressure relationship",
      body: "Pressure is force spread over an area. More force over the same area creates more pressure. The same force spread over a larger area creates less pressure. In a hydraulic system, calculate the input pressure first, then use that same pressure at the output piston.",
      keyPoint: "Pressure = force ÷ area.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-004", "A force of 20 N acts on an area of 2 cm². What pressure is created?", ["10 N/cm²", "40 N/cm²", "22 N/cm²", "0.1 N/cm²"], "A", "20 ÷ 2 = 10 N/cm²."),
    },
    {
      sectionId: "hyd-fund-005",
      title: "A worked example",
      body: "A 20 N force acts on a 2 cm² input piston. That creates a pressure of 10 N/cm². The same pressure reaches a 10 cm² output piston, producing 100 N of output force.",
      keyPoint: "Find pressure first. Keep it the same. Apply it to the output area.",
    },
    {
      sectionId: "hyd-fund-006",
      title: "A repeatable reasoning method",
      body: `For most basic hydraulic questions:

1. Find the input force.
2. Find the input piston area.
3. Calculate the pressure.
4. Keep that pressure the same.
5. Apply it to the output piston area.

For movement questions, trace the input movement through the fluid to the output piston.`,
      keyPoint: "What stays the same? What changes? What follows?",
      miniCheck: makeMiniCheck("HYD-FUND-MC-006", "What should you normally calculate first in a hydraulic force question?", ["The input pressure", "The output movement", "The load weight", "The piston colour"], "A", "Calculate the input pressure first, then apply the same pressure to the output piston."),
    },
    {
      sectionId: "hyd-fund-007",
      title: "The force–distance tradeoff",
      body: "A hydraulic system can multiply force, but it cannot create energy. If the output force is five times larger, the input piston must ideally move about five times farther than the output piston.",
      keyPoint: "More force means less movement distance at the output.",
      miniCheck: makeMiniCheck("HYD-FUND-MC-007", "A system gives a four-to-one force advantage. How far does the input piston move compared with the output piston?", ["About four times as far", "One-quarter as far", "The same distance", "Distance is unrelated"], "A", "The force advantage is exchanged for a movement-distance disadvantage."),
    },
    {
      sectionId: "hyd-fund-008",
      title: "Take this with you",
      body: "You now have a method for recognising and solving basic hydraulic pressure questions. Next, Vivalsa will coach you through three examples before asking you to apply the method independently.",
      keyPoint: "Same pressure. Bigger area. Bigger force.",
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
      body: "You do not need advanced maths for the first version of Vivalsa gear reasoning. The key idea is simple: a larger gear has more teeth and needs more movement from a smaller gear to complete one full turn. That is why larger driven gears usually turn more slowly.",
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
      body: "You have completed Gear Fundamentals. Vivalsa now has a structured foundation for gear direction, gear trains, idlers, gear size and simple ratios. The next step is Guided Gear Practice, which checks whether these gear concepts transfer into problem-solving.",
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


const leverFundamentalsModule: LearningModule = {
  moduleId: "lever_fundamentals",
  title: "Lever Fundamentals",
  subtitle: "Fulcrums, arm lengths, turning effect and mechanical advantage",
  targetDomain: "mechanical",
  targetSubcompetency: "levers",
  estimatedMinutes: 10,
  sections: [
    {
      sectionId: "lever-fund-001",
      title: "The three parts of a lever",
      body: "Most lever questions become easier when you first locate three things: the fulcrum (pivot), the load, and the effort. The bar turns around the fulcrum. The load is what must be moved. The effort is the force applied to move it.",
      keyPoint: "Find fulcrum, load and effort before doing anything else.",
      miniCheck: makeMiniCheck("LEV-FUND-MC-001", "What is the point about which a lever rotates?", ["The fulcrum", "The load", "The effort", "The output arm"], "A", "The fulcrum is the pivot point."),
    },
    {
      sectionId: "lever-fund-002",
      title: "Turning effect depends on distance",
      body: "The same force produces more turning effect when it is applied farther from the fulcrum. That is why a long spanner, crowbar or handle can make a task easier.",
      keyPoint: "Same force + greater distance from the fulcrum = greater turning effect.",
      miniCheck: makeMiniCheck("LEV-FUND-MC-002", "Where should the same force be applied to create the greatest turning effect?", ["Farther from the fulcrum", "Closer to the fulcrum", "Directly at the fulcrum", "Distance does not matter"], "A", "A longer distance from the fulcrum gives greater turning effect."),
    },
    {
      sectionId: "lever-fund-003",
      title: "Mechanical advantage",
      body: "A lever gives force advantage when the effort arm is longer than the load arm. The easiest arrangement usually has the fulcrum close to the load and the effort applied farther away.",
      keyPoint: "Long effort arm. Short load arm.",
      miniCheck: makeMiniCheck("LEV-FUND-MC-003", "Which arrangement usually needs the least effort?", ["Long effort arm and short load arm", "Short effort arm and long load arm", "Effort applied at the fulcrum", "No difference between arm lengths"], "A", "A long effort arm relative to the load arm gives greater mechanical advantage."),
    },
    {
      sectionId: "lever-fund-004",
      title: "Balance the turning effects",
      body: "For simple ideal lever questions, balance occurs when the turning effects on both sides are equal. Turning effect = force × perpendicular distance from the fulcrum. So: load force × load arm = effort force × effort arm.",
      keyPoint: "Force × distance on one side must match force × distance on the other.",
      miniCheck: makeMiniCheck("LEV-FUND-MC-004", "A 100 N load acts 1 m from the fulcrum. What effort 2 m away balances it?", ["50 N", "100 N", "200 N", "25 N"], "A", "100 × 1 = 50 × 2."),
    },
    {
      sectionId: "lever-fund-005",
      title: "Moving the fulcrum",
      body: "Moving the fulcrum changes both arm lengths. Move it closer to the load and the load arm becomes shorter, so less effort is usually needed. Move it closer to the effort and mechanical advantage usually falls.",
      keyPoint: "Fulcrum closer to the load usually means less effort.",
      miniCheck: makeMiniCheck("LEV-FUND-MC-005", "What usually happens if the fulcrum moves closer to the load?", ["Less effort is needed", "More effort is needed", "The lever stops working", "The load becomes heavier"], "A", "A shorter load arm increases mechanical advantage."),
    },
    {
      sectionId: "lever-fund-006",
      title: "The three lever arrangements",
      body: "First class: fulcrum between effort and load, like a seesaw. Second class: load between fulcrum and effort, like a wheelbarrow. Third class: effort between fulcrum and load, like tweezers or the forearm.",
      keyPoint: "First: F in middle. Second: L in middle. Third: E in middle.",
      miniCheck: makeMiniCheck("LEV-FUND-MC-006", "Which part lies in the middle of a second-class lever?", ["The load", "The fulcrum", "The effort", "A second pivot"], "A", "A second-class lever places the load between fulcrum and effort."),
    },
    {
      sectionId: "lever-fund-007",
      title: "The force-distance tradeoff",
      body: "Levers do not create energy. When a lever reduces the force needed, the effort end usually moves farther than the load. In some third-class levers the tradeoff is reversed: more effort can produce greater speed or movement distance at the load.",
      keyPoint: "Less force usually costs more movement distance.",
      miniCheck: makeMiniCheck("LEV-FUND-MC-007", "A lever makes lifting easier. What is the usual tradeoff?", ["The effort end moves farther", "The load becomes weightless", "The fulcrum disappears", "The effort end moves less than the load in every case"], "A", "Force advantage is exchanged for movement distance."),
    },
    {
      sectionId: "lever-fund-008",
      title: "Solving method",
      body: "Use this sequence:\n\n1. Find the fulcrum.\n2. Locate the load and effort.\n3. Compare their distances from the fulcrum.\n4. For calculations, balance force × distance on both sides.\n5. Check the force-distance tradeoff if movement is involved.\n\nYou are now ready for Guided Lever Practice.",
      keyPoint: "Find the pivot first, then compare the two arms.",
    },
  ],
};


const numericalFundamentalsModule: LearningModule = {
  moduleId: "numerical_fundamentals",
  title: "Numerical Reasoning Fundamentals",
  subtitle: "Arithmetic, percentages, ratios, rates and data interpretation",
  targetDomain: "numerical",
  targetSubcompetency: "arithmetic_estimation",
  estimatedMinutes: 12,
  sections: [
    {
      sectionId: "numerical-fund-001",
      title: "Estimate before you calculate",
      body: "A quick estimate gives you a target. It helps you reject impossible answers and catches slips. Round to friendly numbers, decide roughly what the answer should be, then calculate more exactly if needed.",
      keyPoint: "Estimate first. Exact calculation second.",
      miniCheck: makeMiniCheck("NUM-FUND-MC-001", "Which is the best estimate for 39.7 × 5.2?", ["200", "100", "400", "50"], "A", "40 × 5 is about 200."),
    },
    {
      sectionId: "numerical-fund-002",
      title: "Keep the arithmetic controlled",
      body: "Most aptitude questions use ordinary arithmetic under pressure. Break awkward numbers into easier parts. Respect the order of operations: multiplication and division before addition and subtraction.",
      keyPoint: "Simplify the arithmetic before doing it.",
      miniCheck: makeMiniCheck("NUM-FUND-MC-002", "What is 150 − 3 × 20?", ["90", "2,940", "130", "60"], "A", "Multiply first: 3 × 20 = 60. Then 150 − 60 = 90."),
    },
    {
      sectionId: "numerical-fund-003",
      title: "Use percentage anchors",
      body: "Build percentages from easy anchors. Ten percent means divide by 10. Five percent is half of 10%. One percent means divide by 100. Combine these to find less familiar percentages quickly.",
      keyPoint: "10%, 5% and 1% are useful building blocks.",
      miniCheck: makeMiniCheck("NUM-FUND-MC-003", "What is 15% of 200?", ["30", "20", "15", "40"], "A", "10% is 20 and 5% is 10, so 15% is 30."),
    },
    {
      sectionId: "numerical-fund-004",
      title: "Separate the change from the final value",
      body: "For percentage increase or decrease, first calculate the amount of change. Then add or subtract it from the original. For percentage change between two values, compare the change with the original value.",
      keyPoint: "Find the change first. Then decide what the question asks for.",
      miniCheck: makeMiniCheck("NUM-FUND-MC-004", "A value of 80 increases by 25%. What is the new value?", ["100", "105", "95", "120"], "A", "25% of 80 is 20. Add it to 80 to get 100."),
    },
    {
      sectionId: "numerical-fund-005",
      title: "Ratios are parts of a whole",
      body: "For a ratio such as 2:3, the whole contains 5 equal parts. Add the ratio numbers, find the value of one part, then multiply by the number of parts you need.",
      keyPoint: "Add the ratio parts before sharing the total.",
      miniCheck: makeMiniCheck("NUM-FUND-MC-005", "Two quantities are in the ratio 2:3 and total 40. What is the smaller quantity?", ["16", "24", "20", "10"], "A", "There are 5 parts. Each part is 8, so the smaller quantity is 16."),
    },
    {
      sectionId: "numerical-fund-006",
      title: "Reduce rates to one unit",
      body: "Rates become easier when you find the amount for one unit of time, distance or work. For shared-work questions, total worker-hours can be a useful shortcut.",
      keyPoint: "Find the one-unit rate, then scale.",
      miniCheck: makeMiniCheck("NUM-FUND-MC-006", "A vehicle travels 150 km in 2.5 hours. What is its average speed?", ["60 km/h", "75 km/h", "50 km/h", "62.5 km/h"], "A", "150 ÷ 2.5 = 60 km/h."),
    },
    {
      sectionId: "numerical-fund-007",
      title: "Read the table before calculating",
      body: "In data questions, identify the correct row, column and units before doing arithmetic. Many mistakes come from using the wrong figures rather than difficult mathematics.\n\nCalls recorded:\nMonday 42\nTuesday 55\nWednesday 38\nThursday 65",
      keyPoint: "Select the right data before you calculate.",
      miniCheck: makeMiniCheck("NUM-FUND-MC-007", "Which day recorded the most calls?", ["Thursday", "Tuesday", "Monday", "Wednesday"], "A", "Thursday has the largest value: 65."),
    },
    {
      sectionId: "numerical-fund-008",
      title: "Check whether the answer is reasonable",
      body: "Before committing, compare your exact answer with your estimate. Check units and ask whether the result is plausible. Numerical reasoning rewards controlled decisions more than elaborate mathematics.\n\nYou are now ready for Guided Numerical Practice.",
      keyPoint: "Estimate, calculate, then sense-check.",
    },
  ],
};

function createMechanicalBaselineSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "mechanical_starting_point", pathwayId: "fire_service", startedAt: now(), questionIds: startingAssessmentQuestions.map((q) => q.questionId) };
}
function createGuidedHydraulicPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "guided_hydraulic_practice", pathwayId: "fire_service", startedAt: now(), questionIds: guidedHydraulicPracticeQuestions.map((q) => q.questionId) };
}
function createHydraulicIndependentPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "hydraulic_independent_practice", pathwayId: "fire_service", startedAt: now(), questionIds: hydraulicIndependentPracticeQuestions.map((q) => q.questionId) };
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
function createGuidedLeverPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "guided_lever_practice", pathwayId: "fire_service", startedAt: now(), questionIds: guidedLeverPracticeQuestions.map((q) => q.questionId) };
}
function createLeverIndependentPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "lever_independent_practice", pathwayId: "fire_service", startedAt: now(), questionIds: leverIndependentPracticeQuestions.map((q) => q.questionId) };
}
function createLeverAssessmentSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "lever_assessment", pathwayId: "fire_service", startedAt: now(), questionIds: leverAssessmentQuestions.map((q) => q.questionId) };
}
function createMixedMechanicalAssessmentSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "mixed_mechanical_assessment", pathwayId: "fire_service", startedAt: now(), questionIds: mixedMechanicalAssessmentQuestions.map((q) => q.questionId) };
}
function createGuidedNumericalPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "guided_numerical_practice", pathwayId: "fire_service", startedAt: now(), questionIds: guidedNumericalPracticeQuestions.map((q) => q.questionId) };
}
function createNumericalIndependentPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "numerical_independent_practice", pathwayId: "fire_service", startedAt: now(), questionIds: numericalIndependentPracticeQuestions.map((q) => q.questionId) };
}
function createNumericalAssessmentSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "numerical_assessment", pathwayId: "fire_service", startedAt: now(), questionIds: numericalAssessmentQuestions.map((q) => q.questionId) };
}
function createGuidedAbstractLogicalPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "guided_abstract_logical_practice", pathwayId: "fire_service", startedAt: now(), questionIds: guidedAbstractLogicalPracticeQuestions.map((q) => q.questionId) };
}
function createAbstractLogicalIndependentPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "abstract_logical_independent_practice", pathwayId: "fire_service", startedAt: now(), questionIds: abstractLogicalIndependentPracticeQuestions.map((q) => q.questionId) };
}
function createAbstractLogicalAssessmentSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "abstract_logical_assessment", pathwayId: "fire_service", startedAt: now(), questionIds: abstractLogicalAssessmentQuestions.map((q) => q.questionId) };
}
function createGuidedVerbalPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "guided_verbal_practice", pathwayId: "fire_service", startedAt: now(), questionIds: guidedVerbalPracticeQuestions.map((q) => q.questionId) };
}
function createVerbalIndependentPracticeSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "verbal_independent_practice", pathwayId: "fire_service", startedAt: now(), questionIds: verbalIndependentPracticeQuestions.map((q) => q.questionId) };
}
function createVerbalAssessmentSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "verbal_assessment", pathwayId: "fire_service", startedAt: now(), questionIds: verbalAssessmentQuestions.map((q) => q.questionId) };
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
function calculateStartingAssessmentEvidence(session: AssessmentSession, responses: AssessmentResponse[]): CompetencyEvidence[] {
  const subcompetencies = Array.from(new Set(startingAssessmentQuestions.map((question) => question.subcompetency))) as Subcompetency[];
  return subcompetencies.map((subcompetency) => {
    const questionIds = new Set(startingAssessmentQuestions.filter((question) => question.subcompetency === subcompetency).map((question) => question.questionId));
    const subResponses = responses.filter((response) => questionIds.has(response.questionId));
    const attempted = subResponses.length;
    const correct = subResponses.filter((response) => response.correct).length;
    const question = startingAssessmentQuestions.find((item) => item.subcompetency === subcompetency)!;
    return {
      evidenceId: id("evidence"),
      domain: question.domain,
      subcompetency,
      attempted,
      correct,
      accuracy: attempted ? correct / attempted : 0,
      evidenceStrength: evidenceStrength(attempted),
      sourceSessionId: session.sessionId,
      updatedAt: now(),
    };
  });
}

type StartingDomainResult = { domain: Domain; attempted: number; correct: number; accuracy: number };

function calculateStartingDomainResults(responses: AssessmentResponse[]): StartingDomainResult[] {
  return startingDomainOrder.map((domain) => {
    const questionIds = new Set(startingAssessmentQuestions.filter((question) => question.domain === domain).map((question) => question.questionId));
    const domainResponses = responses.filter((response) => questionIds.has(response.questionId));
    const attempted = domainResponses.length;
    const correct = domainResponses.filter((response) => response.correct).length;
    return { domain, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
}

function getStartingAssessmentSession(journey: MvpGuestJourney) {
  return [...journey.sessions]
    .filter((session) => session.sessionType === "mechanical_starting_point" && session.completedAt)
    .sort((a, b) => (b.completedAt ?? b.startedAt).localeCompare(a.completedAt ?? a.startedAt))[0];
}

function getStartingDomainResultsFromJourney(journey: MvpGuestJourney): StartingDomainResult[] {
  const session = getStartingAssessmentSession(journey);
  if (!session) return [];
  return calculateStartingDomainResults(journey.responses.filter((response) => response.sessionId === session.sessionId));
}

function getStartingDomainAccuracy(journey: MvpGuestJourney, domain: Domain) {
  return getStartingDomainResultsFromJourney(journey).find((result) => result.domain === domain)?.accuracy;
}

type AdvisorDecisionPackage = { observations: Observation[]; constraints: PreparationConstraint[]; recommendations: Recommendation[]; whyExplanations: WhyExplanation[]; readinessSnapshots: ReadinessSnapshot[]; milestones: Milestone[]; dashboardState: DashboardState };

function commonMilestones(): Milestone[] {
  return [
    { milestoneId: id("milestone"), type: "starting_point_established", label: "Cross-domain starting point established", createdAt: now() },
    { milestoneId: id("milestone"), type: "first_focus_identified", label: "First preparation focus identified", createdAt: now() },
  ];
}
function makeReadiness(label = "Early evidence — readiness not yet assessed", explanation = "Your starting assessment has identified an initial preparation focus, but readiness requires more evidence over time."): ReadinessSnapshot {
  return { readinessSnapshotId: id("readiness"), state: "early_evidence", label, explanation, confidence: "high", createdAt: now() };
}

type StartingRecommendationTarget = {
  recommendationType: Recommendation["recommendationType"];
  title: string;
  actionLabel: string;
  focusLabel: string;
  subcompetency?: Subcompetency;
};

function getStartingRecommendationTarget(domain: Domain, responses: AssessmentResponse[]): StartingRecommendationTarget {
  if (domain === "mechanical") {
    const mechanicalOrder: MechanicalSubcompetency[] = ["hydraulics", "gears", "pulleys", "levers"];
    const results = mechanicalOrder.map((subcompetency) => {
      const questionIds = new Set(startingAssessmentQuestions.filter((question) => question.subcompetency === subcompetency).map((question) => question.questionId));
      const subResponses = responses.filter((response) => questionIds.has(response.questionId));
      return { subcompetency, attempted: subResponses.length, correct: subResponses.filter((response) => response.correct).length, accuracy: subResponses.length ? subResponses.filter((response) => response.correct).length / subResponses.length : 0 };
    });
    const weakest = [...results].sort((a, b) => a.accuracy - b.accuracy || mechanicalOrder.indexOf(a.subcompetency) - mechanicalOrder.indexOf(b.subcompetency))[0];
    const targets: Record<MechanicalSubcompetency, StartingRecommendationTarget> = {
      hydraulics: { recommendationType: "start_hydraulic_fundamentals", title: "Start Hydraulic Fundamentals", actionLabel: "Start Hydraulic Fundamentals", focusLabel: "Hydraulic reasoning", subcompetency: "hydraulics" },
      gears: { recommendationType: "start_gear_fundamentals", title: "Start Gear Fundamentals", actionLabel: "Start Gear Fundamentals", focusLabel: "Gear reasoning", subcompetency: "gears" },
      pulleys: { recommendationType: "start_pulley_fundamentals", title: "Start Pulley Fundamentals", actionLabel: "Start Pulley Fundamentals", focusLabel: "Pulley reasoning", subcompetency: "pulleys" },
      levers: { recommendationType: "start_lever_fundamentals", title: "Start Lever Fundamentals", actionLabel: "Start Lever Fundamentals", focusLabel: "Lever reasoning", subcompetency: "levers" },
    };
    return targets[weakest.subcompetency];
  }
  if (domain === "numerical") return { recommendationType: "start_numerical_fundamentals", title: "Start Numerical Reasoning Fundamentals", actionLabel: "Start Numerical Fundamentals", focusLabel: "Numerical reasoning" };
  if (domain === "abstract_logical") return { recommendationType: "start_abstract_logical_fundamentals", title: "Start Abstract & Logical Fundamentals", actionLabel: "Start Abstract & Logical Fundamentals", focusLabel: "Abstract & logical reasoning" };
  return { recommendationType: "start_verbal_fundamentals", title: "Start Verbal Comprehension Fundamentals", actionLabel: "Start Verbal Fundamentals", focusLabel: "Verbal comprehension" };
}

function runStartingAssessmentAdvisorRules(responses: AssessmentResponse[], evidence: CompetencyEvidence[]): AdvisorDecisionPackage {
  const results = calculateStartingDomainResults(responses);
  const ranked = [...results].sort((a, b) => a.accuracy - b.accuracy || startingDomainOrder.indexOf(a.domain) - startingDomainOrder.indexOf(b.domain));
  const weakest = ranked[0];
  const nextWeakest = ranked[1];
  const strongAcrossDomains = results.every((result) => result.accuracy >= 0.75);
  const clearFocus = !strongAcrossDomains && (weakest.accuracy <= 0.5 || nextWeakest.accuracy - weakest.accuracy >= 0.25);
  const target: StartingRecommendationTarget = strongAcrossDomains
    ? { recommendationType: "begin_mixed_mechanical_assessment", title: "Confirm your mechanical reasoning", actionLabel: "Start Mixed Mechanical Assessment", focusLabel: "Mechanical reasoning validation" }
    : getStartingRecommendationTarget(weakest.domain, responses);
  const recommendedDomain: Domain = strongAcrossDomains ? "mechanical" : weakest.domain;
  const domainEvidence = results.map((result) => `${startingDomainLabels[result.domain]} ${result.correct}/${result.attempted}`).join(" · ");

  const observation: Observation = {
    observationId: id("obs"),
    title: strongAcrossDomains
      ? "Strong starting signals across all four domains"
      : clearFocus
        ? `${startingDomainLabels[weakest.domain]} is the clearest starting focus`
        : "Your starting profile is relatively balanced",
    summary: strongAcrossDomains
      ? "The short starting assessment did not identify a clear foundation gap. The next useful step is to gather stronger assessment-style evidence before skipping ahead."
      : clearFocus
        ? `${startingDomainLabels[weakest.domain]} produced the clearest early signal for where preparation may help most.`
        : "No single domain stood far apart from the others, so the Mentor is choosing a sensible first structured step.",
    evidenceIds: evidence.map((item) => item.evidenceId),
    confidence: "moderate",
    createdAt: now(),
  };
  const constraint: PreparationConstraint | null = strongAcrossDomains ? null : {
    constraintId: id("constraint"),
    constraintType: "foundation_knowledge",
    domain: weakest.domain,
    subcompetency: target.subcompetency,
    status: "identified",
    confidence: "moderate",
    observationId: observation.observationId,
    createdAt: now(),
    updatedAt: now(),
  };
  const why: WhyExplanation = {
    whyExplanationId: id("why"),
    title: strongAcrossDomains ? "Why a Mixed Mechanical Assessment is recommended" : `Why ${target.title.replace(/^Start /, "")} is recommended`,
    observation: observation.summary,
    evidence: `Starting assessment: ${domainEvidence}.`,
    interpretation: strongAcrossDomains
      ? "All four domains produced strong early signals. Vivalsa is deliberately not treating that short assessment as enough evidence to skip directly through the pathway. A deeper assessment-style check is a better way to confirm whether mechanical reasoning is genuinely stable."
      : clearFocus
        ? `${startingDomainLabels[weakest.domain]} was the lowest-scoring domain in this short starting assessment. That is enough to choose a useful first focus, but not enough to label a fixed weakness or judge overall readiness.`
        : `The four domain results were close. Rather than over-interpreting small differences, Vivalsa is using the lowest early signal to choose a practical first step in the structured pathway.`,
    recommendation: strongAcrossDomains
      ? "The Mixed Mechanical Assessment is recommended next. It provides stronger evidence without making you repeat fundamentals that the starting assessment did not clearly indicate you need."
      : `${target.title} is recommended as the first preparation step. Later practice and Checks will provide stronger evidence and can change the recommendation.`,
    confidence: "Moderate. This is an early preparation signal from a short cross-domain assessment, not a psychometric diagnosis or pass/fail judgement.",
    createdAt: now(),
  };
  const recommendation: Recommendation = {
    recommendationId: id("rec"),
    recommendationType: target.recommendationType,
    title: target.title,
    summary: strongAcrossDomains
      ? "Your starting profile was strong across all four core domains. Use the Mixed Mechanical Assessment to gather deeper evidence before deciding whether to skip mechanical foundation work."
      : clearFocus
        ? `${startingDomainLabels[weakest.domain]} is the clearest early focus. Begin with ${target.focusLabel.toLowerCase()} fundamentals, then use practice evidence to see whether the recommendation changes.`
        : `Your starting results were relatively balanced. Begin with ${target.focusLabel.toLowerCase()} as the first structured step, then let later evidence guide what comes next.`,
    actionLabel: target.actionLabel,
    confidence: "moderate",
    whyExplanationId: why.whyExplanationId,
    status: "active",
    createdAt: now(),
  };
  const readiness = makeReadiness(
    strongAcrossDomains ? "Early strong signals — readiness not yet confirmed" : undefined,
    strongAcrossDomains ? "The starting assessment was strong across all four domains, but readiness requires deeper assessment-style evidence." : undefined,
  );
  const milestones = commonMilestones();
  const resultMap = Object.fromEntries(results.map((result) => [result.domain, result])) as Record<Domain, StartingDomainResult>;
  const domainScores: Record<Domain, { attempted: number; correct: number }> = {
    mechanical: { attempted: resultMap.mechanical.attempted, correct: resultMap.mechanical.correct },
    numerical: { attempted: resultMap.numerical.attempted, correct: resultMap.numerical.correct },
    abstract_logical: { attempted: resultMap.abstract_logical.attempted, correct: resultMap.abstract_logical.correct },
    verbal: { attempted: resultMap.verbal.attempted, correct: resultMap.verbal.correct },
  };

  return {
    observations: [observation],
    constraints: constraint ? [constraint] : [],
    recommendations: [recommendation],
    whyExplanations: [why],
    readinessSnapshots: [readiness],
    milestones,
    dashboardState: {
      dashboardStateId: id("dash"),
      currentRecommendationId: recommendation.recommendationId,
      currentFocusLabel: target.focusLabel,
      readinessSnapshotId: readiness.readinessSnapshotId,
      recentMilestoneIds: milestones.map((milestone) => milestone.milestoneId),
      baselineSummary: { mechanicalQuestionsCompleted: resultMap.mechanical.attempted, focusArea: target.focusLabel },
      startingAssessmentSummary: {
        questionsCompleted: responses.length,
        domainScores,
        recommendedDomain,
        recommendedFocus: target.focusLabel,
      },
      saveStatus: "local_only",
      updatedAt: now(),
    },
  };
}

function completeMechanicalBaseline(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((item) => item.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((response) => response.sessionId === sessionId);
  const evidence = calculateStartingAssessmentEvidence(completedSession, responses);
  const decision = runStartingAssessmentAdvisorRules(responses, evidence);
  return {
    ...journey,
    sessions: journey.sessions.map((item) => item.sessionId === sessionId ? completedSession : item),
    competencyEvidence: [...journey.competencyEvidence, ...evidence],
    observations: [...journey.observations, ...decision.observations],
    constraints: [...journey.constraints, ...decision.constraints],
    recommendations: [...journey.recommendations, ...decision.recommendations],
    whyExplanations: [...journey.whyExplanations, ...decision.whyExplanations],
    readinessSnapshots: [...journey.readinessSnapshots, ...decision.readinessSnapshots],
    milestones: [...journey.milestones, ...decision.milestones],
    dashboardState: decision.dashboardState,
    updatedAt: now(),
  };
}
function getCurrentRecommendation(journey: MvpGuestJourney) { return journey.recommendations.find((r) => r.recommendationId === journey.dashboardState?.currentRecommendationId); }
function getCurrentReadiness(journey: MvpGuestJourney) { return journey.readinessSnapshots.find((r) => r.readinessSnapshotId === journey.dashboardState?.readinessSnapshotId); }
function getCurrentWhy(journey: MvpGuestJourney) { const rec = getCurrentRecommendation(journey); return journey.whyExplanations.find((w) => w.whyExplanationId === rec?.whyExplanationId); }
function getRecentMilestones(journey: MvpGuestJourney) { const ids = new Set(journey.dashboardState?.recentMilestoneIds ?? []); return journey.milestones.filter((m) => ids.has(m.milestoneId)); }


const abstractLogicalFundamentalsModule: LearningModule = {
  moduleId: "abstract_logical_fundamentals",
  title: "Abstract & Logical Fundamentals",
  subtitle: "Patterns, matrices, classification and deduction",
  targetDomain: "abstract_logical",
  targetSubcompetency: "pattern_sequences",
  estimatedMinutes: 12,
  sections: [
    {
      sectionId: "abs-fund-001",
      title: "Find what changes — and what does not",
      body: "Abstract reasoning questions are usually built from a small number of deliberate changes. The first task is not to guess the answer. It is to separate the features that change from the features that stay constant.",
      keyPoint: "Track each feature separately: shape, number, direction, position and fill.",
      miniCheck: makeMiniCheck("ABS-FUND-MC-001", "A sequence changes direction each step but keeps the same shape. What should you track first?", ["Direction", "Shape name only", "The size of the page", "Answer position"], "A", "The changing feature is direction, so track direction before looking for a more complicated rule."),
    },
    {
      sectionId: "abs-fund-002",
      title: "Start with the simplest rule",
      body: "Many difficult-looking questions use a simple repeating cycle, a steady increase, or a fixed rotation. Test the simplest plausible rule before inventing a complex one.",
      keyPoint: "Simple cycle → steady change → two interacting rules.",
      miniCheck: makeMiniCheck("ABS-FUND-MC-002", "▲ ○ ▲ ○ ? is best approached first as:", ["A repeating two-item cycle", "A random sequence", "A numerical equation", "A verbal analogy"], "A", "The simplest rule is a two-item alternating cycle."),
    },
    {
      sectionId: "abs-fund-003",
      title: "Separate two rules",
      body: "Some sequences change in two ways at once. A shape may alternate while the number of shapes increases. Track each feature on its own, then combine the rules.",
      keyPoint: "Do not force one rule to explain two independent changes.",
      miniCheck: makeMiniCheck("ABS-FUND-MC-003", "In ▲, ○○, ▲▲▲, ○○○○, what two features change?", ["Shape alternates and count increases", "Only colour changes", "Only position changes", "Nothing follows a rule"], "A", "The shape alternates between triangle and circle while the count increases by one."),
    },
    {
      sectionId: "abs-fund-004",
      title: "Matrices repeat relationships",
      body: "In a matrix, do not look only for the missing picture. Compare the relationship across a row or down a column. Ask whether the same operation is repeated.",
      keyPoint: "Compare cell 1 → cell 2 → cell 3, then test the same relationship elsewhere.",
      miniCheck: makeMiniCheck("ABS-FUND-MC-004", "In a matrix, the third cell in each row combines the first two. If the row shows ■, □, ?, what belongs last?", ["■□", "■■", "□□", "○"], "A", "The repeated row rule combines the first two symbols."),
    },
    {
      sectionId: "abs-fund-005",
      title: "Classify by relationship",
      body: "Odd-one-out and analogy questions are not solved by choosing the item that merely looks different. Find the property or transformation shared by the others.",
      keyPoint: "Describe the shared rule before selecting the exception.",
      miniCheck: makeMiniCheck("ABS-FUND-MC-005", "▲, ■ and ◆ all have straight sides. Which item does not share that property?", ["○", "▲", "■", "◆"], "A", "The circle is the only shape without straight sides."),
    },
    {
      sectionId: "abs-fund-006",
      title: "Use the same transformation",
      body: "Analogy questions ask you to identify what happened to the first item and apply the same change to another. Common transformations include rotation, reflection, count change and filled-to-outline change.",
      keyPoint: "Name the transformation before applying it.",
      miniCheck: makeMiniCheck("ABS-FUND-MC-006", "If ▲ becomes △, what should ■ become under the same rule?", ["□", "●", "◆", "▲"], "A", "The rule changes a filled shape into its outline version."),
    },
    {
      sectionId: "abs-fund-007",
      title: "Deduction means must, not might",
      body: "Logical reasoning questions often include statements that are possible but not guaranteed. Choose only conclusions that must follow from the information given.",
      keyPoint: "Do not add outside knowledge or assumptions.",
      miniCheck: makeMiniCheck("ABS-FUND-MC-007", "All pumps are machines. What must be true?", ["Every pump is a machine", "Every machine is a pump", "Every pump is portable", "Some machines are not pumps"], "A", "Only the stated relationship is guaranteed."),
    },
    {
      sectionId: "abs-fund-008",
      title: "A repeatable solving method",
      body: "Use a short routine:\n\n1. Identify the question type.\n2. List the features that may change.\n3. Test the simplest rule.\n4. Check the rule across every available step.\n5. For logic questions, choose only what must follow.\n\nThe next stage applies this method with immediate feedback.",
      keyPoint: "Identify → separate features → test rule → verify → answer.",
    },
  ],
};

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
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "early_evidence", label: "Early evidence — improvement not yet confirmed", explanation: "Hydraulic Fundamentals has been completed, but Vivalsa still needs practice evidence before judging whether the earlier constraint is improving.", confidence: "high", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "first_learning_action_completed", label: "Hydraulic Pressure learning completed", createdAt: now() };
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
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "developing_evidence", label: "Developing evidence — gear practice not yet checked", explanation: "Gear Fundamentals has been completed, but Vivalsa still needs practice evidence before judging whether the gear focus is improving.", confidence: "high", createdAt: now() };
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


function getCurrentLeverProgress(journey: MvpGuestJourney) {
  return journey.moduleProgress.find((progress) => progress.moduleId === "lever_fundamentals" && !progress.completedAt);
}
function startLeverFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  if (getCurrentLeverProgress(journey)) return journey;
  const alreadyCompleted = journey.moduleCompletions.some((completion) => completion.moduleId === "lever_fundamentals");
  if (alreadyCompleted) return journey;
  const progress: ModuleProgress = { moduleProgressId: id("module-progress"), moduleId: "lever_fundamentals", currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  return { ...journey, moduleProgress: [...journey.moduleProgress, progress], updatedAt: now() };
}
function updateLeverProgress(journey: MvpGuestJourney, nextProgress: ModuleProgress): MvpGuestJourney {
  return { ...journey, moduleProgress: journey.moduleProgress.map((progress) => progress.moduleProgressId === nextProgress.moduleProgressId ? nextProgress : progress), updatedAt: now() };
}
function completeLeverFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  const activeProgress = getCurrentLeverProgress(journey);
  const completedAt = now();
  const completedProgress = activeProgress ? { ...activeProgress, currentSectionIndex: leverFundamentalsModule.sections.length - 1, completedAt, updatedAt: completedAt } : undefined;
  const completion: ModuleCompletion = { moduleCompletionId: id("module-completion"), moduleId: "lever_fundamentals", completedAt };
  const previousRecommendation = getCurrentRecommendation(journey);
  const why: WhyExplanation = { whyExplanationId: id("why"), title: "Why Guided Lever Practice is recommended", observation: "Lever Fundamentals has been completed.", evidence: "You completed the foundation module covering fulcrums, arm lengths, moments and lever classes.", interpretation: "Guided diagram practice is the next useful step before support is reduced.", recommendation: "Guided Lever Practice is recommended next.", confidence: "High. This is the planned next stage after the fundamentals module.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: "begin_guided_lever_practice", title: "Begin Guided Lever Practice", summary: "Apply the fulcrum-and-arm method to guided lever diagrams.", actionLabel: "Begin Guided Lever Practice", confidence: "high", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const milestone: Milestone = { milestoneId: id("milestone"), type: "first_learning_action_completed", label: "Lever Fundamentals completed", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "developing_evidence", label: "Developing evidence — lever practice not yet checked", explanation: "Lever Fundamentals is complete, but practice evidence is still needed.", confidence: "high", createdAt: now() };
  return { ...journey, moduleProgress: completedProgress ? journey.moduleProgress.map((progress) => progress.moduleProgressId === completedProgress.moduleProgressId ? completedProgress : progress) : journey.moduleProgress, moduleCompletions: [...journey.moduleCompletions, completion], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Lever reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds: [...(journey.dashboardState?.recentMilestoneIds ?? []).slice(-4), milestone.milestoneId], baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function calculateLeverSummary(session: AssessmentSession, responses: AssessmentResponse[], questions: MvpQuestion[], sessionType: PracticeSummary["sessionType"], categories: { concept: string; concepts: string[] }[]): PracticeSummary {
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

function completeGuidedLeverPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateLeverSummary(completedSession, responses, guidedLeverPracticeQuestions, "guided_lever_practice", [
    { concept: "recognition", concepts: ["lever_parts", "lever_classes"] },
    { concept: "mechanical_advantage", concepts: ["long_effort_arm", "easiest_lift", "fulcrum_position"] },
    { concept: "balance_force", concepts: ["balance_calculation", "distance_tradeoff", "integrated"] },
  ]);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_lever_independent_practice";
  let title = "Begin Independent Lever Practice"; let summaryText = "Apply the lever method across a larger set of less-supported diagrams."; let actionLabel = "Start independent practice"; let interpretation = "The guided result is strong enough to reduce support.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.5) { recommendationType = "continue_guided_lever_practice"; title = "Continue Guided Lever Practice"; summaryText = "Strengthen arm-length and balance reasoning before reducing support."; actionLabel = "Continue guided practice"; interpretation = "The core method is emerging, but more guided practice is useful before moving on."; }
  else if (summary.accuracy < 0.5) { recommendationType = "review_lever_fundamentals"; title = "Review Lever Fundamentals"; summaryText = "Revisit fulcrums, arm lengths and moments before continuing."; actionLabel = "Review Lever Fundamentals"; interpretation = "The guided result suggests the core method is not yet secure enough for less-supported practice."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Guided Lever Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `Accuracy ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one guided lever set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.5 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for independent lever practice" : "Developing evidence — lever practice continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: summary.accuracy >= 0.8 ? "lever_improvement_signal" : "guided_lever_practice_completed", label: summary.accuracy >= 0.8 ? "Lever improvement signal detected" : "Guided Lever Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Guided Lever Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Guided lever practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Lever reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completeLeverIndependentPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateLeverSummary(completedSession, responses, leverIndependentPracticeQuestions, "lever_independent_practice", [
    { concept: "recognition", concepts: ["lever_parts", "lever_classes", "movement_direction", "applied_crowbar", "applied_wheelbarrow", "third_class_tradeoff"] },
    { concept: "mechanical_advantage", concepts: ["long_effort_arm", "easiest_lift", "fulcrum_position", "arm_ratio", "equal_arms"] },
    { concept: "balance_force", concepts: ["load_calculation", "force_calculation", "balance_calculation", "distance_tradeoff", "integrated"] },
  ]);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_lever_assessment";
  let title = "Begin the Lever Check"; let summaryText = "Check whether the lever method remains available without immediate feedback."; let actionLabel = "Start Lever Check"; let interpretation = "Independent practice is strong enough for an assessment-style check.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.6) { recommendationType = "continue_lever_independent_practice"; title = "Continue Independent Lever Practice"; summaryText = "Consolidate the weaker lever patterns before the check."; actionLabel = "Continue independent practice"; interpretation = "The method is useful but not yet consistently strong enough for the check."; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_lever_practice"; title = "Return to Guided Lever Practice"; summaryText = "Rebuild the lever method with immediate feedback before another independent set."; actionLabel = "Start guided practice"; interpretation = "Independent practice suggests the method is not yet stable enough without support."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Independent Lever Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `Accuracy ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one independent lever set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for Lever Check" : "Developing evidence — lever practice continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "lever_independent_practice_completed", label: "Independent Lever Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Independent Lever Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Independent lever practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Lever reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completeLeverAssessment(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateLeverSummary(completedSession, responses, leverAssessmentQuestions, "lever_assessment", [
    { concept: "recognition", concepts: ["system_recognition", "lever_class", "movement_direction"] },
    { concept: "mechanical_advantage", concepts: ["easiest_setup", "fulcrum_position", "arm_ratio"] },
    { concept: "balance_force", concepts: ["force", "balance", "distance", "integrated"] },
  ]);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const readyForMixedAssessment = journey.milestones.some((m) => m.type === "gear_pathway_completed") && journey.milestones.some((m) => m.type === "pulley_pathway_completed");
  let recommendationType: Recommendation["recommendationType"] = readyForMixedAssessment ? "begin_mixed_mechanical_assessment" : "return_to_mixed_mechanical_practice";
  let title = readyForMixedAssessment ? "Begin Mixed Mechanical Assessment" : "Return to Mixed Mechanical Practice";
  let summaryText = readyForMixedAssessment ? "Gears, pulleys and levers have now reached the assessment stage. Check whether you can select the right method when all four mechanical areas are mixed together." : "Recheck lever reasoning alongside gears, pulleys and hydraulics.";
  let actionLabel = readyForMixedAssessment ? "Start mixed assessment" : "Start mixed practice";
  let currentFocus = "Mechanical reasoning integration";
  let interpretation = readyForMixedAssessment ? "The Lever Check is strong and the earlier Gear and Pulley pathways are also complete. The next step is an integrated assessment rather than another single-topic exercise." : "The Lever Check is strong enough to move back into mixed mechanical reasoning.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.6) { recommendationType = "continue_lever_independent_practice"; title = "Target the Weakest Lever Pattern"; summaryText = "Do another independent lever set before repeating the check."; actionLabel = "Continue independent practice"; currentFocus = "Lever reasoning"; interpretation = "The check showed useful learning, but one more consolidation step is appropriate."; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_lever_practice"; title = "Return to Guided Lever Practice"; summaryText = "Rebuild the lever method with immediate feedback before another check."; actionLabel = "Start guided practice"; currentFocus = "Lever reasoning"; interpretation = "The assessment-style check suggests the lever method is not yet stable enough without support."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Lever Check: ${summary.correct} of ${summary.attempted} correct.`, evidence: `Accuracy ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one short assessment-style lever check.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — lever pathway completed" : "Developing evidence — lever pathway continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const completedMilestone: Milestone = { milestoneId: id("milestone"), type: "lever_assessment_completed", label: "Lever Check completed", createdAt: now() };
  const pathwayMilestone: Milestone | undefined = summary.accuracy >= 0.8 ? { milestoneId: id("milestone"), type: "lever_pathway_completed", label: "Lever pathway completed", createdAt: now() } : undefined;
  const newMilestones = pathwayMilestone ? [completedMilestone, pathwayMilestone] : [completedMilestone];
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Lever Check complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Lever Check: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const evidence: CompetencyEvidence = { evidenceId: id("evidence"), domain: "mechanical", subcompetency: "levers", attempted: summary.attempted, correct: summary.correct, accuracy: summary.accuracy, evidenceStrength: evidenceStrength(summary.attempted), sourceSessionId: sessionId, updatedAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), ...newMilestones.map((m) => m.milestoneId)].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], competencyEvidence: [...journey.competencyEvidence, evidence], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, ...newMilestones], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: currentFocus, readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}


function getCurrentNumericalProgress(journey: MvpGuestJourney) {
  return journey.moduleProgress.find((progress) => progress.moduleId === "numerical_fundamentals" && !progress.completedAt);
}
function startNumericalFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  if (getCurrentNumericalProgress(journey)) return journey;
  const alreadyCompleted = journey.moduleCompletions.some((completion) => completion.moduleId === "numerical_fundamentals");
  if (alreadyCompleted) return journey;
  const progress: ModuleProgress = { moduleProgressId: id("module-progress"), moduleId: "numerical_fundamentals", currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  return { ...journey, moduleProgress: [...journey.moduleProgress, progress], updatedAt: now() };
}
function updateNumericalProgress(journey: MvpGuestJourney, nextProgress: ModuleProgress): MvpGuestJourney {
  return { ...journey, moduleProgress: journey.moduleProgress.map((progress) => progress.moduleProgressId === nextProgress.moduleProgressId ? nextProgress : progress), updatedAt: now() };
}
function completeNumericalFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  const activeProgress = getCurrentNumericalProgress(journey);
  const completedAt = now();
  const completedProgress = activeProgress ? { ...activeProgress, currentSectionIndex: numericalFundamentalsModule.sections.length - 1, completedAt, updatedAt: completedAt } : undefined;
  const completion: ModuleCompletion = { moduleCompletionId: id("module-completion"), moduleId: "numerical_fundamentals", completedAt };
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const why: WhyExplanation = { whyExplanationId: id("why"), title: "Why Guided Numerical Practice is recommended", observation: "Numerical Reasoning Fundamentals has been completed.", evidence: "You completed the foundation module covering estimation, percentages, ratios, rates and table reading.", interpretation: "Guided practice is the next useful step before support is reduced.", recommendation: "Guided Numerical Practice is recommended next.", confidence: "High. This is the planned next stage after the fundamentals module.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: "begin_guided_numerical_practice", title: "Begin Guided Numerical Practice", summary: "Apply the core numerical methods with immediate feedback.", actionLabel: "Begin guided practice", confidence: "high", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "first_learning_action_completed", label: "Numerical Reasoning Fundamentals completed", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "developing_evidence", label: "Developing evidence — numerical practice not yet checked", explanation: "The fundamentals module is complete, but practice evidence is still needed.", confidence: "high", createdAt: now() };
  return {
    ...journey,
    moduleProgress: completedProgress ? journey.moduleProgress.map((progress) => progress.moduleProgressId === completedProgress.moduleProgressId ? completedProgress : progress) : journey.moduleProgress,
    moduleCompletions: [...journey.moduleCompletions, completion],
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, milestone],
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Numerical reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds: [...(journey.dashboardState?.recentMilestoneIds ?? []).slice(-4), milestone.milestoneId], baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}

const numericalCategoryLabels: Record<NumericalSubcompetency, string> = {
  arithmetic_estimation: "Arithmetic & estimation",
  percentages_ratios: "Percentages & ratios",
  rates_proportion: "Rates & proportion",
  tables_data: "Tables & data",
};

function calculateNumericalSummary(session: AssessmentSession, responses: AssessmentResponse[], questions: MvpQuestion[], sessionType: PracticeSummary["sessionType"]): PracticeSummary {
  const categories: NumericalSubcompetency[] = ["arithmetic_estimation", "percentages_ratios", "rates_proportion", "tables_data"];
  const conceptBreakdown = categories.map((category) => {
    const ids = new Set(questions.filter((q) => q.subcompetency === category).map((q) => q.questionId));
    const categoryResponses = responses.filter((r) => ids.has(r.questionId));
    const attempted = categoryResponses.length;
    const correct = categoryResponses.filter((r) => r.correct).length;
    return { concept: category, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType, attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}
function weakestNumericalCategory(summary: PracticeSummary) {
  return [...summary.conceptBreakdown].sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted)[0];
}
function numericalEvidenceFromSummary(summary: PracticeSummary, sessionId: string): CompetencyEvidence[] {
  return summary.conceptBreakdown.map((item) => ({
    evidenceId: id("evidence"),
    domain: "numerical" as const,
    subcompetency: item.concept as NumericalSubcompetency,
    attempted: item.attempted,
    correct: item.correct,
    accuracy: item.accuracy,
    evidenceStrength: evidenceStrength(item.attempted),
    sourceSessionId: sessionId,
    updatedAt: now(),
  }));
}

function completeGuidedNumericalPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateNumericalSummary(completedSession, responses, guidedNumericalPracticeQuestions, "guided_numerical_practice");
  const weakest = weakestNumericalCategory(summary);
  const weakestLabel = numericalCategoryLabels[weakest.concept as NumericalSubcompetency];
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_numerical_independent_practice";
  let title = "Begin Independent Numerical Practice";
  let summaryText = "Apply the same methods across a larger, less-supported question set.";
  let actionLabel = "Start independent practice";
  let interpretation = "Guided practice suggests the core numerical methods are ready for less-supported application.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.5) { recommendationType = "continue_guided_numerical_practice"; title = "Continue Guided Numerical Practice"; summaryText = `Do another guided set, with extra attention to ${weakestLabel.toLowerCase()}.`; actionLabel = "Continue guided practice"; interpretation = "The method is partly established, but immediate feedback is still useful."; }
  else if (summary.accuracy < 0.5) { recommendationType = "review_numerical_fundamentals"; title = "Review Numerical Fundamentals"; summaryText = `Revisit the core methods, especially ${weakestLabel.toLowerCase()}, before continuing.`; actionLabel = "Review fundamentals"; interpretation = "The guided result suggests the foundation should be rebuilt before support is reduced."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Guided Numerical Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `${weakestLabel} was the lowest area in this set.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one guided numerical practice set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.5 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for independent numerical practice" : "Developing evidence — numerical practice continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "guided_numerical_practice_completed", label: "Guided Numerical Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Guided Numerical Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Guided numerical practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Numerical reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completeNumericalIndependentPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateNumericalSummary(completedSession, responses, numericalIndependentPracticeQuestions, "numerical_independent_practice");
  const weakest = weakestNumericalCategory(summary);
  const weakestLabel = numericalCategoryLabels[weakest.concept as NumericalSubcompetency];
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_numerical_assessment";
  let title = "Take the Numerical Check";
  let summaryText = "Test whether the numerical methods hold up without immediate answer feedback.";
  let actionLabel = "Start Numerical Check";
  let interpretation = "Independent practice suggests the methods are ready for a short assessment-style check.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.6) { recommendationType = "continue_numerical_independent_practice"; title = "Continue Independent Numerical Practice"; summaryText = `Do another independent set, with extra attention to ${weakestLabel.toLowerCase()}.`; actionLabel = "Continue independent practice"; interpretation = "The methods are developing, but another less-supported practice set is appropriate before the check."; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_numerical_practice"; title = "Return to Guided Numerical Practice"; summaryText = `Rebuild ${weakestLabel.toLowerCase()} with immediate feedback before returning to independent practice.`; actionLabel = "Start guided practice"; interpretation = "Independent practice suggests the methods are not yet stable enough without support."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Independent Numerical Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `${weakestLabel} was the lowest area in this set.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one independent numerical practice set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for Numerical Check" : "Developing evidence — numerical practice continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "numerical_independent_practice_completed", label: "Independent Numerical Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Independent Numerical Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Independent numerical practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Numerical reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completeNumericalAssessment(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateNumericalSummary(completedSession, responses, numericalAssessmentQuestions, "numerical_assessment");
  const weakest = weakestNumericalCategory(summary);
  const weakestLabel = numericalCategoryLabels[weakest.concept as NumericalSubcompetency];
  const balancedStrong = summary.accuracy >= 0.8 && summary.conceptBreakdown.every((item) => item.correct >= 2);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "start_abstract_logical_fundamentals";
  let title = "Begin Abstract & Logical Reasoning";
  let summaryText = "Your numerical result is strong across all four areas. Move on to patterns, matrices, classification and deduction.";
  let actionLabel = "Start Abstract & Logical Fundamentals";
  let interpretation = "This is a progression recommendation. No single numerical area was weak enough to justify targeted remediation, so the next useful step is a new aptitude domain.";
  let recommendationKind: "progression" | "weakness" = "progression";
  if (!balancedStrong && summary.accuracy >= 0.6) { recommendationType = "continue_numerical_independent_practice"; title = `Target ${weakestLabel}`; summaryText = `The overall result is useful, but ${weakestLabel.toLowerCase()} is the clearest remaining numerical focus.`; actionLabel = "Start independent practice"; interpretation = "This is a strengthening recommendation based on the lowest numerical area in the check."; recommendationKind = "weakness"; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_numerical_practice"; title = "Return to Guided Numerical Practice"; summaryText = `Rebuild the core methods, with particular attention to ${weakestLabel.toLowerCase()}.`; actionLabel = "Start guided practice"; interpretation = "The assessment-style check suggests the numerical methods are not yet stable enough without support."; recommendationKind = "weakness"; }
  const evidenceText = summary.conceptBreakdown.map((item) => `${numericalCategoryLabels[item.concept as NumericalSubcompetency]}: ${item.correct}/${item.attempted}`).join(" · ");
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Numerical Check: ${summary.correct} of ${summary.attempted} correct.`, evidence: evidenceText, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one 12-question numerical check.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: balancedStrong ? "Developing evidence — numerical pathway completed" : "Developing evidence — numerical pathway continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const completedMilestone: Milestone = { milestoneId: id("milestone"), type: "numerical_assessment_completed", label: "Numerical Check completed", createdAt: now() };
  const pathwayMilestone: Milestone | undefined = balancedStrong ? { milestoneId: id("milestone"), type: "numerical_pathway_completed", label: "Numerical reasoning pathway completed", createdAt: now() } : undefined;
  const newMilestones = pathwayMilestone ? [completedMilestone, pathwayMilestone] : [completedMilestone];
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Numerical Check complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: evidenceText, interpretation: `${recommendationKind === "progression" ? "Progression recommendation" : "Strengthening recommendation"}: ${interpretation}`, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const evidence = numericalEvidenceFromSummary(summary, sessionId);
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), ...newMilestones.map((m) => m.milestoneId)].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], competencyEvidence: [...journey.competencyEvidence, ...evidence], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, ...newMilestones], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: balancedStrong ? "Numerical reasoning maintenance" : "Numerical reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}



const verbalFundamentalsModule: LearningModule = {
  moduleId: "verbal_fundamentals",
  title: "Verbal Comprehension Fundamentals",
  subtitle: "Find evidence, follow instructions and avoid unsupported conclusions",
  targetDomain: "verbal",
  targetSubcompetency: "explicit_information",
  estimatedMinutes: 12,
  sections: [
    {
      sectionId: "ver-fund-001",
      title: "Answer the question that was asked",
      body: "Verbal questions often become difficult because several statements in the passage are true. Start by identifying the exact task: a stated fact, the main point, an inference, an instruction or a conclusion.",
      keyPoint: "Question first → then search for the evidence that matches it.",
      miniCheck: makeMiniCheck("VER-FUND-MC-001", "A passage contains four true facts. What should guide which one you choose?", ["The exact question being asked", "The longest sentence", "The first fact in the passage", "The most dramatic detail"], "A", "The question determines which evidence is relevant."),
    },
    {
      sectionId: "ver-fund-002",
      title: "Separate stated from inferred",
      body: "A stated-information question asks what the passage directly tells you. An inference question asks what is strongly supported even if the exact words are not present. Do not treat a possible idea as a necessary inference.",
      keyPoint: "Stated = written directly. Inferred = strongly supported by what is written.",
      miniCheck: makeMiniCheck("VER-FUND-MC-002", "The report says a replacement radio was fitted before departure. Which statement is directly supported?", ["A replacement radio was fitted before departure", "The old radio was repaired", "The crew preferred the replacement", "The departure was delayed for an hour"], "A", "Only the first statement is directly supported by the wording."),
    },
    {
      sectionId: "ver-fund-003",
      title: "Use context to determine meaning",
      body: "When asked what a word means, do not rely only on a memorised dictionary definition. Read the surrounding sentence and test which option preserves the meaning of the passage.",
      keyPoint: "Replace the word with each option and ask which one still makes sense.",
      miniCheck: makeMiniCheck("VER-FUND-MC-003", "The plan was robust because it allowed for delays. Here, robust most nearly means:", ["Able to cope with problems", "Very heavy", "Brief", "Secret"], "A", "The context links robustness with coping better with delay."),
    },
    {
      sectionId: "ver-fund-004",
      title: "Follow instruction words precisely",
      body: "Words such as before, after, only, unless, except and regardless can completely change the correct action. Treat them as logical operators, not decoration.",
      keyPoint: "Circle the condition words mentally before choosing an action.",
      miniCheck: makeMiniCheck("VER-FUND-MC-004", "Anyone arriving after 09:00 must report to reception first, regardless of pass colour. A blue-pass candidate arrives at 09:10. What happens first?", ["Report to reception", "Use the blue-pass gate", "Wait outside", "Go home"], "A", "The word regardless makes the late-arrival rule override pass colour."),
    },
    {
      sectionId: "ver-fund-005",
      title: "Build the sequence",
      body: "For procedural passages, convert the wording into a short ordered chain. Then answer from the chain rather than rereading the whole passage repeatedly.",
      keyPoint: "Step 1 → Step 2 → condition → Step 3.",
      miniCheck: makeMiniCheck("VER-FUND-MC-005", "Label the item, attach a tag, then move it to quarantine. What happens immediately before quarantine?", ["Attach the tag", "Label the item", "Return it to service", "Notify reception"], "A", "The ordered chain places tag attachment immediately before quarantine."),
    },
    {
      sectionId: "ver-fund-006",
      title: "Do not overreach",
      body: "A common distractor takes a true result and makes it broader, stronger or more certain than the evidence allows. Watch for words such as all, always, proves and every.",
      keyPoint: "Match the scope and certainty of the conclusion to the evidence.",
      miniCheck: makeMiniCheck("VER-FUND-MC-006", "Three people improved after practice. Which claim goes too far?", ["The practice will improve everyone", "Three people improved", "The group was small", "Improvement was observed"], "A", "Evidence from three people cannot justify a claim about everyone."),
    },
    {
      sectionId: "ver-fund-007",
      title: "Must follow is stronger than might be true",
      body: "Deductive questions reward restraint. Choose only what is guaranteed by the statements. Real-world knowledge and plausible explanations do not count unless the passage gives them.",
      keyPoint: "Ask: could the statements be true while this answer is false? If yes, it does not have to follow.",
      miniCheck: makeMiniCheck("VER-FUND-MC-007", "All Stage 3 candidates completed the written test. Mei is at Stage 3. What must follow?", ["Mei completed the written test", "Mei topped the written test", "Mei has been hired", "Mei completed every selection stage"], "A", "Only completion of the written test is guaranteed."),
    },
    {
      sectionId: "ver-fund-008",
      title: "A repeatable verbal method",
      body: "Use the same short process across verbal questions: identify the task, locate the evidence, notice limits or conditions, then choose the option that says no more than the evidence supports.",
      keyPoint: "Task → evidence → limits → answer.",
      miniCheck: makeMiniCheck("VER-FUND-MC-008", "After locating the relevant evidence, what should you check before answering?", ["Its limits and conditions", "Whether the longest option is available", "Which option uses the most technical words", "The answer chosen in the previous question"], "A", "Limits and conditions protect against overreaching or missing exceptions."),
    },
  ],
};

function getCurrentAbstractLogicalProgress(journey: MvpGuestJourney) {
  return journey.moduleProgress.find((progress) => progress.moduleId === "abstract_logical_fundamentals" && !progress.completedAt);
}
function startAbstractLogicalFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  if (getCurrentAbstractLogicalProgress(journey)) return journey;
  const alreadyCompleted = journey.moduleCompletions.some((completion) => completion.moduleId === "abstract_logical_fundamentals");
  if (alreadyCompleted) return journey;
  const progress: ModuleProgress = { moduleProgressId: id("module-progress"), moduleId: "abstract_logical_fundamentals", currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  return { ...journey, moduleProgress: [...journey.moduleProgress, progress], updatedAt: now() };
}
function updateAbstractLogicalProgress(journey: MvpGuestJourney, nextProgress: ModuleProgress): MvpGuestJourney {
  return { ...journey, moduleProgress: journey.moduleProgress.map((progress) => progress.moduleProgressId === nextProgress.moduleProgressId ? nextProgress : progress), updatedAt: now() };
}
function completeAbstractLogicalFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  const activeProgress = getCurrentAbstractLogicalProgress(journey);
  const completedAt = now();
  const completedProgress = activeProgress ? { ...activeProgress, currentSectionIndex: abstractLogicalFundamentalsModule.sections.length - 1, completedAt, updatedAt: completedAt } : undefined;
  const completion: ModuleCompletion = { moduleCompletionId: id("module-completion"), moduleId: "abstract_logical_fundamentals", completedAt };
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const why: WhyExplanation = { whyExplanationId: id("why"), title: "Why Guided Abstract & Logical Practice is recommended", observation: "Abstract & Logical Fundamentals has been completed.", evidence: "You completed the foundation module covering sequences, matrices, classification, analogies and deduction.", interpretation: "Guided practice is the next useful step before support is reduced.", recommendation: "Guided Abstract & Logical Practice is recommended next.", confidence: "High. This is the planned next stage after the fundamentals module.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: "begin_guided_abstract_logical_practice", title: "Begin Guided Abstract & Logical Practice", summary: "Apply the core rule-finding methods with immediate feedback.", actionLabel: "Begin guided practice", confidence: "high", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "first_learning_action_completed", label: "Abstract & Logical Fundamentals completed", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "developing_evidence", label: "Developing evidence — abstract reasoning not yet checked", explanation: "The fundamentals module is complete, but practice evidence is still needed.", confidence: "high", createdAt: now() };
  return {
    ...journey,
    moduleProgress: completedProgress ? journey.moduleProgress.map((progress) => progress.moduleProgressId === completedProgress.moduleProgressId ? completedProgress : progress) : journey.moduleProgress,
    moduleCompletions: [...journey.moduleCompletions, completion],
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, milestone],
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Abstract & logical reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds: [...(journey.dashboardState?.recentMilestoneIds ?? []).slice(-4), milestone.milestoneId], baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}

const abstractLogicalCategoryLabels: Record<AbstractLogicalSubcompetency, string> = {
  pattern_sequences: "Patterns & sequences",
  matrices_rules: "Matrices & rules",
  classification_relationships: "Classification & relationships",
  deductive_reasoning: "Deductive reasoning",
};

function calculateAbstractLogicalSummary(session: AssessmentSession, responses: AssessmentResponse[], questions: MvpQuestion[], sessionType: PracticeSummary["sessionType"]): PracticeSummary {
  const categories: AbstractLogicalSubcompetency[] = ["pattern_sequences", "matrices_rules", "classification_relationships", "deductive_reasoning"];
  const conceptBreakdown = categories.map((category) => {
    const ids = new Set(questions.filter((q) => q.subcompetency === category).map((q) => q.questionId));
    const categoryResponses = responses.filter((r) => ids.has(r.questionId));
    const attempted = categoryResponses.length;
    const correct = categoryResponses.filter((r) => r.correct).length;
    return { concept: category, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType, attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}
function weakestAbstractLogicalCategory(summary: PracticeSummary) {
  return [...summary.conceptBreakdown].sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted)[0];
}
function abstractLogicalEvidenceFromSummary(summary: PracticeSummary, sessionId: string): CompetencyEvidence[] {
  return summary.conceptBreakdown.map((item) => ({
    evidenceId: id("evidence"),
    domain: "abstract_logical" as const,
    subcompetency: item.concept as AbstractLogicalSubcompetency,
    attempted: item.attempted,
    correct: item.correct,
    accuracy: item.accuracy,
    evidenceStrength: evidenceStrength(item.attempted),
    sourceSessionId: sessionId,
    updatedAt: now(),
  }));
}

function completeGuidedAbstractLogicalPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateAbstractLogicalSummary(completedSession, responses, guidedAbstractLogicalPracticeQuestions, "guided_abstract_logical_practice");
  const weakest = weakestAbstractLogicalCategory(summary);
  const weakestLabel = abstractLogicalCategoryLabels[weakest.concept as AbstractLogicalSubcompetency];
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_abstract_logical_independent_practice";
  let title = "Begin Independent Abstract & Logical Practice";
  let summaryText = "Apply the same rule-finding methods across a larger, less-supported question set.";
  let actionLabel = "Start independent practice";
  let interpretation = "Guided practice suggests the core methods are ready for less-supported application.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.5) { recommendationType = "continue_guided_abstract_logical_practice"; title = "Continue Guided Abstract & Logical Practice"; summaryText = `Do another guided set, with extra attention to ${weakestLabel.toLowerCase()}.`; actionLabel = "Continue guided practice"; interpretation = "The method is partly established, but immediate feedback is still useful."; }
  else if (summary.accuracy < 0.5) { recommendationType = "review_abstract_logical_fundamentals"; title = "Review Abstract & Logical Fundamentals"; summaryText = `Revisit the core methods, especially ${weakestLabel.toLowerCase()}, before continuing.`; actionLabel = "Review fundamentals"; interpretation = "The guided result suggests the foundation should be rebuilt before support is reduced."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Guided Abstract & Logical Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `${weakestLabel} was the lowest area in this set.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one guided abstract and logical practice set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.5 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for independent abstract practice" : "Developing evidence — abstract practice continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "guided_abstract_logical_practice_completed", label: "Guided Abstract & Logical Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Guided Abstract & Logical Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Guided abstract and logical practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Abstract & logical reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completeAbstractLogicalIndependentPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateAbstractLogicalSummary(completedSession, responses, abstractLogicalIndependentPracticeQuestions, "abstract_logical_independent_practice");
  const weakest = weakestAbstractLogicalCategory(summary);
  const weakestLabel = abstractLogicalCategoryLabels[weakest.concept as AbstractLogicalSubcompetency];
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_abstract_logical_assessment";
  let title = "Take the Abstract & Logical Check";
  let summaryText = "Test whether the rule-finding methods hold up without immediate answer feedback.";
  let actionLabel = "Start Abstract & Logical Check";
  let interpretation = "Independent practice suggests the methods are ready for a short assessment-style check.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.6) { recommendationType = "continue_abstract_logical_independent_practice"; title = "Continue Independent Abstract & Logical Practice"; summaryText = `Do another independent set, with extra attention to ${weakestLabel.toLowerCase()}.`; actionLabel = "Continue independent practice"; interpretation = "The methods are developing, but another less-supported practice set is appropriate before the check."; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_abstract_logical_practice"; title = "Return to Guided Abstract & Logical Practice"; summaryText = `Rebuild ${weakestLabel.toLowerCase()} with immediate feedback before returning to independent practice.`; actionLabel = "Start guided practice"; interpretation = "Independent practice suggests the methods are not yet stable enough without support."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Independent Abstract & Logical Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `${weakestLabel} was the lowest area in this set.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one independent abstract and logical practice set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for Abstract & Logical Check" : "Developing evidence — abstract practice continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "abstract_logical_independent_practice_completed", label: "Independent Abstract & Logical Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Independent Abstract & Logical Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Independent abstract and logical practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Abstract & logical reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completeAbstractLogicalAssessment(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateAbstractLogicalSummary(completedSession, responses, abstractLogicalAssessmentQuestions, "abstract_logical_assessment");
  const weakest = weakestAbstractLogicalCategory(summary);
  const weakestLabel = abstractLogicalCategoryLabels[weakest.concept as AbstractLogicalSubcompetency];
  const balancedStrong = summary.accuracy >= 0.8 && summary.conceptBreakdown.every((item) => item.correct >= 2);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "start_verbal_fundamentals";
  let title = "Begin Verbal Comprehension";
  let summaryText = "Your abstract and logical result is strong across all four areas. Move to the final core MVP domain: verbal comprehension.";
  let actionLabel = "Start Verbal Fundamentals";
  let interpretation = "This is a progression recommendation. No single abstract or logical area was weak enough to justify targeted remediation.";
  let recommendationKind: "progression" | "weakness" = "progression";
  if (!balancedStrong && summary.accuracy >= 0.6) { recommendationType = "continue_abstract_logical_independent_practice"; title = `Target ${weakestLabel}`; summaryText = `The overall result is useful, but ${weakestLabel.toLowerCase()} is the clearest remaining focus.`; actionLabel = "Start independent practice"; interpretation = "This is a strengthening recommendation based on the lowest area in the check."; recommendationKind = "weakness"; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_abstract_logical_practice"; title = "Return to Guided Abstract & Logical Practice"; summaryText = `Rebuild the core methods, with particular attention to ${weakestLabel.toLowerCase()}.`; actionLabel = "Start guided practice"; interpretation = "The assessment-style check suggests the rule-finding methods are not yet stable enough without support."; recommendationKind = "weakness"; }
  const evidenceText = summary.conceptBreakdown.map((item) => `${abstractLogicalCategoryLabels[item.concept as AbstractLogicalSubcompetency]}: ${item.correct}/${item.attempted}`).join(" · ");
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Abstract & Logical Check: ${summary.correct} of ${summary.attempted} correct.`, evidence: evidenceText, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one 12-question abstract and logical check.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: balancedStrong ? "Developing evidence — abstract and logical pathway completed" : "Developing evidence — abstract and logical pathway continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const completedMilestone: Milestone = { milestoneId: id("milestone"), type: "abstract_logical_assessment_completed", label: "Abstract & Logical Check completed", createdAt: now() };
  const pathwayMilestone: Milestone | undefined = balancedStrong ? { milestoneId: id("milestone"), type: "abstract_logical_pathway_completed", label: "Abstract & logical reasoning pathway completed", createdAt: now() } : undefined;
  const newMilestones = pathwayMilestone ? [completedMilestone, pathwayMilestone] : [completedMilestone];
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Abstract & Logical Check complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: evidenceText, interpretation: `${recommendationKind === "progression" ? "Progression recommendation" : "Strengthening recommendation"}: ${interpretation}`, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const evidence = abstractLogicalEvidenceFromSummary(summary, sessionId);
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), ...newMilestones.map((m) => m.milestoneId)].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], competencyEvidence: [...journey.competencyEvidence, ...evidence], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, ...newMilestones], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: balancedStrong ? "Verbal comprehension" : "Abstract & logical reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}


function getCurrentVerbalProgress(journey: MvpGuestJourney) {
  return journey.moduleProgress.find((progress) => progress.moduleId === "verbal_fundamentals" && !progress.completedAt);
}
function startVerbalFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  if (getCurrentVerbalProgress(journey)) return journey;
  const alreadyCompleted = journey.moduleCompletions.some((completion) => completion.moduleId === "verbal_fundamentals");
  if (alreadyCompleted) return journey;
  const progress: ModuleProgress = { moduleProgressId: id("module-progress"), moduleId: "verbal_fundamentals", currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  return { ...journey, moduleProgress: [...journey.moduleProgress, progress], updatedAt: now() };
}
function updateVerbalProgress(journey: MvpGuestJourney, nextProgress: ModuleProgress): MvpGuestJourney {
  return { ...journey, moduleProgress: journey.moduleProgress.map((progress) => progress.moduleProgressId === nextProgress.moduleProgressId ? nextProgress : progress), updatedAt: now() };
}
function completeVerbalFundamentals(journey: MvpGuestJourney): MvpGuestJourney {
  const activeProgress = getCurrentVerbalProgress(journey);
  const completedAt = now();
  const completedProgress = activeProgress ? { ...activeProgress, currentSectionIndex: verbalFundamentalsModule.sections.length - 1, completedAt, updatedAt: completedAt } : undefined;
  const completion: ModuleCompletion = { moduleCompletionId: id("module-completion"), moduleId: "verbal_fundamentals", completedAt };
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const why: WhyExplanation = { whyExplanationId: id("why"), title: "Why Guided Verbal Practice is recommended", observation: "Verbal Comprehension Fundamentals has been completed.", evidence: "You completed the foundation module covering stated information, inference, instructions and evidence limits.", interpretation: "Guided practice is the next useful step before support is reduced.", recommendation: "Guided Verbal Practice is recommended next.", confidence: "High. This is the planned next stage after the fundamentals module.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: "begin_guided_verbal_practice", title: "Begin Guided Verbal Practice", summary: "Apply the core reading methods with immediate feedback.", actionLabel: "Begin guided practice", confidence: "high", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "first_learning_action_completed", label: "Verbal Comprehension Fundamentals completed", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "developing_evidence", label: "Developing evidence — verbal comprehension not yet checked", explanation: "The fundamentals module is complete, but practice evidence is still needed.", confidence: "high", createdAt: now() };
  return {
    ...journey,
    moduleProgress: completedProgress ? journey.moduleProgress.map((progress) => progress.moduleProgressId === completedProgress.moduleProgressId ? completedProgress : progress) : journey.moduleProgress,
    moduleCompletions: [...journey.moduleCompletions, completion],
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, milestone],
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Verbal comprehension", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds: [...(journey.dashboardState?.recentMilestoneIds ?? []).slice(-4), milestone.milestoneId], baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}

const verbalCategoryLabels: Record<VerbalSubcompetency, string> = {
  explicit_information: "Stated information",
  inference_context: "Inference & context",
  instructions_sequence: "Instructions & sequence",
  assumptions_conclusions: "Assumptions & conclusions",
};

function calculateVerbalSummary(session: AssessmentSession, responses: AssessmentResponse[], questions: MvpQuestion[], sessionType: PracticeSummary["sessionType"]): PracticeSummary {
  const categories: VerbalSubcompetency[] = ["explicit_information", "inference_context", "instructions_sequence", "assumptions_conclusions"];
  const conceptBreakdown = categories.map((category) => {
    const ids = new Set(questions.filter((q) => q.subcompetency === category).map((q) => q.questionId));
    const categoryResponses = responses.filter((r) => ids.has(r.questionId));
    const attempted = categoryResponses.length;
    const correct = categoryResponses.filter((r) => r.correct).length;
    return { concept: category, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType, attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}
function weakestVerbalCategory(summary: PracticeSummary) {
  return [...summary.conceptBreakdown].sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted)[0];
}
function verbalEvidenceFromSummary(summary: PracticeSummary, sessionId: string): CompetencyEvidence[] {
  return summary.conceptBreakdown.map((item) => ({
    evidenceId: id("evidence"),
    domain: "verbal" as const,
    subcompetency: item.concept as VerbalSubcompetency,
    attempted: item.attempted,
    correct: item.correct,
    accuracy: item.accuracy,
    evidenceStrength: evidenceStrength(item.attempted),
    sourceSessionId: sessionId,
    updatedAt: now(),
  }));
}

function completeGuidedVerbalPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateVerbalSummary(completedSession, responses, guidedVerbalPracticeQuestions, "guided_verbal_practice");
  const weakest = weakestVerbalCategory(summary);
  const weakestLabel = verbalCategoryLabels[weakest.concept as VerbalSubcompetency];
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_verbal_independent_practice";
  let title = "Begin Independent Verbal Practice";
  let summaryText = "Apply the same reading methods across a larger, less-supported question set.";
  let actionLabel = "Start independent practice";
  let interpretation = "Guided practice suggests the core verbal methods are ready for less-supported application.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.5) { recommendationType = "continue_guided_verbal_practice"; title = "Continue Guided Verbal Practice"; summaryText = `Do another guided set, with extra attention to ${weakestLabel.toLowerCase()}.`; actionLabel = "Continue guided practice"; interpretation = "The method is partly established, but immediate feedback is still useful."; }
  else if (summary.accuracy < 0.5) { recommendationType = "review_verbal_fundamentals"; title = "Review Verbal Comprehension Fundamentals"; summaryText = `Revisit the core methods, especially ${weakestLabel.toLowerCase()}, before continuing.`; actionLabel = "Review fundamentals"; interpretation = "The guided result suggests the foundation should be rebuilt before support is reduced."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Guided Verbal Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `${weakestLabel} was the lowest area in this set.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one guided verbal practice set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.5 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for independent verbal practice" : "Developing evidence — verbal practice continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "guided_verbal_practice_completed", label: "Guided Verbal Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Guided Verbal Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Guided verbal practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Verbal comprehension", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completeVerbalIndependentPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateVerbalSummary(completedSession, responses, verbalIndependentPracticeQuestions, "verbal_independent_practice");
  const weakest = weakestVerbalCategory(summary);
  const weakestLabel = verbalCategoryLabels[weakest.concept as VerbalSubcompetency];
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "begin_verbal_assessment";
  let title = "Take the Verbal Comprehension Check";
  let summaryText = "Your independent practice is strong enough for a cleaner assessment-style check.";
  let actionLabel = "Start Verbal Check";
  let interpretation = "Independent practice suggests the verbal methods are ready to be checked without immediate feedback.";
  if (summary.accuracy < 0.8 && summary.accuracy >= 0.6) { recommendationType = "continue_verbal_independent_practice"; title = "Continue Independent Verbal Practice"; summaryText = `Do another independent set, with extra attention to ${weakestLabel.toLowerCase()}.`; actionLabel = "Continue independent practice"; interpretation = "The methods are developing, but another less-supported practice set is appropriate before the check."; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_verbal_practice"; title = "Return to Guided Verbal Practice"; summaryText = `Rebuild ${weakestLabel.toLowerCase()} with immediate feedback before returning to independent practice.`; actionLabel = "Start guided practice"; interpretation = "Independent practice suggests the methods are not yet stable enough without support."; }
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Independent Verbal Practice: ${summary.correct} of ${summary.attempted} correct.`, evidence: `${weakestLabel} was the lowest area in this set.`, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one independent verbal practice set.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: summary.accuracy >= 0.8 ? "Developing evidence — ready for Verbal Comprehension Check" : "Developing evidence — verbal practice continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "verbal_independent_practice_completed", label: "Independent Verbal Practice completed", createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Independent Verbal Practice complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: `Independent verbal practice: ${Math.round(summary.accuracy * 100)}%.`, interpretation, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, milestone], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: "Verbal comprehension", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
}

function completeVerbalAssessment(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((s) => s.sessionId === sessionId); if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((r) => r.sessionId === sessionId);
  const summary = calculateVerbalSummary(completedSession, responses, verbalAssessmentQuestions, "verbal_assessment");
  const weakest = weakestVerbalCategory(summary);
  const weakestLabel = verbalCategoryLabels[weakest.concept as VerbalSubcompetency];
  const balancedStrong = summary.accuracy >= 0.8 && summary.conceptBreakdown.every((item) => item.correct >= 2);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  let recommendationType: Recommendation["recommendationType"] = "continue_verbal_practice";
  let title = "Core aptitude pathways complete";
  let summaryText = "Your Verbal Check is strong across all four areas. Maintain the skill while the whole-product integration pass brings the core domains together.";
  let actionLabel = "Maintain verbal practice";
  let interpretation = "This is a progression recommendation. No single verbal area was weak enough to justify targeted remediation.";
  let recommendationKind: "progression" | "weakness" = "progression";
  if (!balancedStrong && summary.accuracy >= 0.6) { recommendationType = "continue_verbal_independent_practice"; title = `Target ${weakestLabel}`; summaryText = `The overall result is useful, but ${weakestLabel.toLowerCase()} is the clearest remaining focus.`; actionLabel = "Start independent practice"; interpretation = "This is a strengthening recommendation based on the lowest area in the check."; recommendationKind = "weakness"; }
  else if (summary.accuracy < 0.6) { recommendationType = "continue_guided_verbal_practice"; title = "Return to Guided Verbal Practice"; summaryText = `Rebuild the core methods, with particular attention to ${weakestLabel.toLowerCase()}.`; actionLabel = "Start guided practice"; interpretation = "The assessment-style check suggests the reading methods are not yet stable enough without support."; recommendationKind = "weakness"; }
  const evidenceText = summary.conceptBreakdown.map((item) => `${verbalCategoryLabels[item.concept as VerbalSubcompetency]}: ${item.correct}/${item.attempted}`).join(" · ");
  const why: WhyExplanation = { whyExplanationId: id("why"), title: `Why ${title} is recommended`, observation: `Verbal Comprehension Check: ${summary.correct} of ${summary.attempted} correct.`, evidence: evidenceText, interpretation, recommendation: `${title} is recommended next.`, confidence: "Moderate. This is based on one 12-question verbal comprehension check.", createdAt: now() };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: summary.accuracy >= 0.6 ? "developing_evidence" : "early_evidence", label: balancedStrong ? "Developing evidence — core aptitude pathways completed" : "Developing evidence — verbal pathway continuing", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const completedMilestone: Milestone = { milestoneId: id("milestone"), type: "verbal_assessment_completed", label: "Verbal Comprehension Check completed", createdAt: now() };
  const pathwayMilestone: Milestone | undefined = balancedStrong ? { milestoneId: id("milestone"), type: "verbal_pathway_completed", label: "Verbal comprehension pathway completed", createdAt: now() } : undefined;
  const newMilestones = pathwayMilestone ? [completedMilestone, pathwayMilestone] : [completedMilestone];
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Verbal Comprehension Check complete", summary: `${summary.correct} of ${summary.attempted} correct.`, comparison: evidenceText, interpretation: `${recommendationKind === "progression" ? "Progression recommendation" : "Strengthening recommendation"}: ${interpretation}`, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
  const evidence = verbalEvidenceFromSummary(summary, sessionId);
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), ...newMilestones.map((m) => m.milestoneId)].slice(-7);
  return { ...journey, sessions: journey.sessions.map((s) => s.sessionId === sessionId ? completedSession : s), practiceSummaries: [...journey.practiceSummaries, summary], debriefs: [...journey.debriefs, debrief], competencyEvidence: [...journey.competencyEvidence, ...evidence], recommendations: [...updatedRecommendations, recommendation], whyExplanations: [...journey.whyExplanations, why], readinessSnapshots: [...journey.readinessSnapshots, readiness], milestones: [...journey.milestones, ...newMilestones], dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: balancedStrong ? "Core aptitude pathway maintenance" : "Verbal comprehension", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() }, updatedAt: now() };
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
    recommendationType = "begin_hydraulic_independent_practice";
    title = "Begin Independent Hydraulic Practice";
    summaryText = "Apply the same hydraulic method across a short set without guidance before moving into mixed mechanical work.";
    actionLabel = "Start Independent Practice";
    readinessLabel = "Developing evidence";
    readinessExplanation = "Vivalsa is beginning to see a positive response to targeted hydraulic practice, but broader readiness still needs more evidence.";
    constraintStatus = "improving";
    whyTitle = "Why Independent Hydraulic Practice is recommended";
    observation = "Your hydraulic practice improved after completing Hydraulic Fundamentals.";
    interpretation = "This suggests the foundation concepts are beginning to transfer. Vivalsa now needs to see whether you can apply the same method without guided support.";
    recommendationText = "Independent Hydraulic Practice is recommended before mixing hydraulics with other mechanical topics.";
    confidenceText = "Moderate. The improvement is encouraging, but it is based on one guided practice set.";
    debriefSummary = "Your hydraulic practice improved strongly after completing Hydraulic Fundamentals.";
    debriefInterpretation = "This suggests the foundation module may have addressed part of the earlier hydraulic reasoning constraint. The next useful step is to apply the method independently.";
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
  const improvementMilestone: Milestone | null = recommendationType !== "review_hydraulic_fundamentals" ? { milestoneId: id("milestone"), type: "first_improvement_signal", label: recommendationType === "begin_hydraulic_independent_practice" ? "First improvement signal detected" : "Early improvement signal detected", createdAt: now() } : null;
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
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: recommendationType === "begin_hydraulic_independent_practice" ? "Independent hydraulic reasoning" : "Hydraulic-force reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: "local_only", updatedAt: now() },
    updatedAt: now(),
  };
}


function calculateHydraulicIndependentSummary(session: AssessmentSession, responses: AssessmentResponse[]): PracticeSummary {
  const concepts = Array.from(new Set(hydraulicIndependentPracticeQuestions.map((question) => question.concept)));
  const conceptBreakdown = concepts.map((concept) => {
    const ids = new Set(hydraulicIndependentPracticeQuestions.filter((question) => question.concept === concept).map((question) => question.questionId));
    const matching = responses.filter((response) => ids.has(response.questionId));
    const correct = matching.filter((response) => response.correct).length;
    return { concept, attempted: matching.length, correct, accuracy: matching.length ? correct / matching.length : 0 };
  });
  const correct = responses.filter((response) => response.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType: "hydraulic_independent_practice", attempted: responses.length, correct, accuracy: responses.length ? correct / responses.length : 0, conceptBreakdown, createdAt: now() };
}

function completeHydraulicIndependentPractice(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((item) => item.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((response) => response.sessionId === sessionId);
  const summary = calculateHydraulicIndependentSummary(completedSession, responses);
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);

  const isProgression = summary.accuracy >= 0.8;
  const needsMorePractice = summary.accuracy >= 0.6 && summary.accuracy < 0.8;
  const recommendationType: Recommendation["recommendationType"] = isProgression ? "begin_mixed_mechanical_practice" : needsMorePractice ? "continue_hydraulic_independent_practice" : "review_hydraulic_fundamentals";
  const title = isProgression ? "Move on to Mixed Mechanical Practice" : needsMorePractice ? "Practise Hydraulic Reasoning once more" : "Review Hydraulic Fundamentals";
  const recommendationSummary = isProgression
    ? "You are applying the hydraulic method independently. The next step is to check whether it stays stable when other mechanical topics are mixed in."
    : needsMorePractice
      ? "Your recent answers suggest hydraulic reasoning is still an area worth strengthening. A short second independent set should help make the method more consistent."
      : "Your recent answers suggest the core pressure, area and movement relationships need another pass before moving forward.";
  const actionLabel = isProgression ? "Continue" : needsMorePractice ? "Practise again" : "Review fundamentals";
  const interpretation = isProgression
    ? "You selected and applied the hydraulic method without guided prompts across most of the set."
    : needsMorePractice
      ? "The method is partly established, but the result is not yet consistent enough to treat the topic as stable."
      : "The independent set suggests the foundation relationships are not yet stable without support.";
  const why: WhyExplanation = {
    whyExplanationId: id("why"),
    title: isProgression ? "Why mixed mechanical practice is recommended" : "Why this strengthening step is recommended",
    observation: `${summary.correct} of ${summary.attempted} independent hydraulic questions were correct.`,
    evidence: `Independent Hydraulic Practice: ${summary.correct}/${summary.attempted} (${Math.round(summary.accuracy * 100)}%).`,
    interpretation,
    recommendation: recommendationSummary,
    confidence: "Moderate. This is based on one short independent practice set and will be updated as more evidence is collected.",
    createdAt: now(),
  };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: recommendationSummary, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: isProgression ? "developing_evidence" : "early_evidence", label: isProgression ? "Developing evidence" : "Area still being strengthened", explanation: interpretation, confidence: "moderate", createdAt: now() };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "hydraulic_independent_practice_completed", label: "Independent Hydraulic Practice completed", createdAt: now() };
  const debrief: Debrief = {
    debriefId: id("debrief"),
    sessionId,
    title: "Hydraulic Pressure complete",
    summary: `You applied the hydraulic relationships correctly in ${summary.correct} of ${summary.attempted} independent questions.`,
    comparison: `Independent Hydraulic Practice: ${summary.correct}/${summary.attempted}.`,
    interpretation,
    recommendationId: recommendation.recommendationId,
    confidence: "moderate",
    whyExplanationId: why.whyExplanationId,
    createdAt: now(),
  };
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-6);
  return {
    ...journey,
    sessions: journey.sessions.map((item) => item.sessionId === sessionId ? completedSession : item),
    practiceSummaries: [...journey.practiceSummaries, summary],
    debriefs: [...journey.debriefs, debrief],
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, milestone],
    dashboardState: { ...(journey.dashboardState ?? { dashboardStateId: id("dash"), recentMilestoneIds: [], saveStatus: "local_only" as const, updatedAt: now() }), currentRecommendationId: recommendation.recommendationId, currentFocusLabel: isProgression ? "Mechanical reasoning integration" : "Hydraulic reasoning", readinessSnapshotId: readiness.readinessSnapshotId, recentMilestoneIds, baselineSummary: journey.dashboardState?.baselineSummary, saveStatus: journey.dashboardState?.saveStatus ?? "local_only", updatedAt: now() },
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
  let interpretation = "Vivalsa has enough early gear-practice evidence to update your next step.";
  let recommendationType: Recommendation["recommendationType"] = "return_to_mixed_mechanical_practice";
  let recommendationTitle = "Return to Mixed Mechanical Practice";
  let recommendationSummary = "Recheck whether gear reasoning remains stable when mixed with hydraulics, pulleys and levers.";
  let actionLabel = "Start mixed practice";
  let currentFocus = "Mechanical reasoning integration";
  let readinessLabel = "Developing evidence — gear practice checked";
  let readinessExplanation = "Gear Fundamentals has now been followed by guided practice. Vivalsa can start checking whether gear reasoning remains stable in mixed mechanical practice.";
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
    interpretation: "Your results were strong across hydraulics, gears, pulleys and levers. This recommendation is therefore a progression recommendation, not a strengthening recommendation.",
    recommendation: "Hydraulic Fundamentals is suggested as the next structured learning module so the preparation journey can continue in an organised sequence.",
    confidence: "Moderate. The mixed practice result is encouraging, but one strong session is not enough for a broad readiness judgement.",
    createdAt: now(),
  } : {
    whyExplanationId: id("why"),
    title: `Why ${focus.moduleTitle} is recommended`,
    observation: hydraulic && hydraulic.accuracy >= 0.75 ? `Hydraulic reasoning remained relatively stable in mixed practice. ${focus.title}` : focus.title,
    evidence: `Mixed Mechanical Practice evidence: ${evidenceText}.`,
    interpretation: `This suggests the earlier hydraulic focus is no longer the only useful signal. Vivalsa is now using mixed mechanical evidence to identify the next preparation focus.`,
    recommendation: `${focus.moduleTitle} is recommended as the next step.`,
    confidence: "Moderate. This is based on one mixed practice session, so it is useful for guidance but not a full readiness judgement.",
    createdAt: now(),
  };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType: focus.recommendationType, title: focus.moduleTitle, summary: noClearWeakness ? "No specific weakness was identified in mixed practice. This is suggested as the next structured learning step, not because hydraulics appears weak." : `Build the foundation concepts for ${focus.label.toLowerCase()} before the next mixed practice check.`, actionLabel: noClearWeakness ? "Start Hydraulic Fundamentals" : focus.moduleTitle, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const readiness: ReadinessSnapshot = { readinessSnapshotId: id("readiness"), state: "developing_evidence", label: "Developing evidence", explanation: "Vivalsa now has evidence from a mixed mechanical practice session and can begin identifying the next focus area, but broader readiness still requires more evidence.", confidence: "moderate", createdAt: now() };
  const completedMilestone: Milestone = { milestoneId: id("milestone"), type: "mixed_mechanical_practice_completed", label: "Mixed Mechanical Practice completed", createdAt: now() };
  const focusMilestone: Milestone = { milestoneId: id("milestone"), type: "second_focus_identified", label: noClearWeakness ? "No clear mechanical weakness identified" : `${focus.label} identified as next focus`, createdAt: now() };
  const debrief: Debrief = { debriefId: id("debrief"), sessionId, title: "Mixed mechanical practice complete", summary: noClearWeakness ? "Your mixed mechanical practice was strong across all four areas. No specific mechanical weakness was identified in this session." : (hydraulic && hydraulic.accuracy >= 0.75 ? `Your hydraulic reasoning remained stable during mixed practice. ${focus.label} now appears to be the largest remaining preparation focus.` : `Mixed practice suggests ${focus.label.toLowerCase()} is the next useful focus.`), comparison: evidenceText, interpretation: noClearWeakness ? "Vivalsa is treating the next step as structured progression rather than remediation. Continuing with a fundamentals module keeps the preparation journey organised without implying a weakness." : `Vivalsa uses mixed practice to check whether improved areas stay stable while other mechanical topics are interleaved.`, recommendationId: recommendation.recommendationId, confidence: "moderate", whyExplanationId: why.whyExplanationId, createdAt: now() };
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


function calculateMixedMechanicalAssessmentSummary(session: AssessmentSession, responses: AssessmentResponse[]): PracticeSummary {
  const subcompetencies: MechanicalSubcompetency[] = ["hydraulics", "gears", "pulleys", "levers"];
  const conceptBreakdown = subcompetencies.map((subcompetency) => {
    const ids = new Set(mixedMechanicalAssessmentQuestions.filter((q) => q.subcompetency === subcompetency).map((q) => q.questionId));
    const subResponses = responses.filter((response) => ids.has(response.questionId));
    const attempted = subResponses.length;
    const correct = subResponses.filter((response) => response.correct).length;
    return { concept: subcompetency, attempted, correct, accuracy: attempted ? correct / attempted : 0 };
  });
  const attempted = responses.length;
  const correct = responses.filter((response) => response.correct).length;
  return { summaryId: id("summary"), sessionId: session.sessionId, sessionType: "mixed_mechanical_assessment", attempted, correct, accuracy: attempted ? correct / attempted : 0, conceptBreakdown, createdAt: now() };
}

function completeMixedMechanicalAssessment(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((item) => item.sessionId === sessionId);
  if (!session) return journey;
  const completedSession = { ...session, completedAt: now() };
  const responses = journey.responses.filter((response) => response.sessionId === sessionId);
  const summary = calculateMixedMechanicalAssessmentSummary(completedSession, responses);
  const weakest = [...summary.conceptBreakdown].sort((a, b) => a.accuracy - b.accuracy)[0];
  const integratedStrong = summary.accuracy >= 0.8 && summary.conceptBreakdown.every((item) => item.accuracy >= 4 / 6);
  const labels: Record<string, string> = { hydraulics: "Hydraulics", gears: "Gears", pulleys: "Pulleys", levers: "Levers" };
  const weakestLabel = labels[weakest?.concept ?? "gears"] ?? "Mechanical reasoning";

  let recommendationType: Recommendation["recommendationType"];
  let title: string;
  let summaryText: string;
  let actionLabel: string;
  let currentFocus: string;
  let interpretation: string;
  let recommendationKind: "progression" | "weakness";

  if (integratedStrong) {
    recommendationType = "start_numerical_fundamentals";
    title = "Begin Numerical Reasoning Fundamentals";
    summaryText = "Your result was strong across all four mechanical areas. The next useful progression step is to begin numerical reasoning rather than reteach a mechanical topic.";
    actionLabel = "Start Numerical Fundamentals";
    currentFocus = "Numerical reasoning";
    interpretation = "This is a progression recommendation. The assessment did not identify one mechanical area weak enough to justify targeted remediation, so preparation can move to the next core aptitude domain.";
    recommendationKind = "progression";
  } else {
    recommendationKind = "weakness";
    currentFocus = `${weakestLabel} reasoning`;
    if (weakest.concept === "hydraulics") {
      if (weakest.accuracy <= 0.5) {
        recommendationType = "review_hydraulic_fundamentals";
        title = "Review Hydraulic Fundamentals";
        summaryText = "Hydraulics was the clearest limiting area in the mixed assessment. Rebuild pressure, area and force relationships before another integrated check.";
        actionLabel = "Review fundamentals";
      } else {
        recommendationType = "begin_guided_hydraulic_practice";
        title = "Target Guided Hydraulic Practice";
        summaryText = "Hydraulics was the lowest area, but the foundation is partly present. Use immediate-feedback practice to stabilise it.";
        actionLabel = "Begin guided practice";
      }
    } else if (weakest.concept === "gears") {
      if (weakest.accuracy <= 0.5) {
        recommendationType = "continue_guided_gear_practice";
        title = "Return to Guided Gear Practice";
        summaryText = "Gear reasoning was the clearest limiting area. Rebuild the method with immediate feedback before another mixed assessment.";
        actionLabel = "Start guided practice";
      } else {
        recommendationType = "continue_gear_independent_practice";
        title = "Target Independent Gear Practice";
        summaryText = "Gear reasoning was the lowest area, but the method is partly stable. Consolidate it in less-supported practice.";
        actionLabel = "Start independent practice";
      }
    } else if (weakest.concept === "pulleys") {
      if (weakest.accuracy <= 0.5) {
        recommendationType = "continue_guided_pulley_practice";
        title = "Return to Guided Pulley Practice";
        summaryText = "Pulley reasoning was the clearest limiting area. Rebuild the support-strand method with immediate feedback.";
        actionLabel = "Start guided practice";
      } else {
        recommendationType = "continue_pulley_independent_practice";
        title = "Target Independent Pulley Practice";
        summaryText = "Pulley reasoning was the lowest area, but the method is partly stable. Consolidate it in less-supported practice.";
        actionLabel = "Start independent practice";
      }
    } else {
      if (weakest.accuracy <= 0.5) {
        recommendationType = "continue_guided_lever_practice";
        title = "Return to Guided Lever Practice";
        summaryText = "Lever reasoning was the clearest limiting area. Rebuild the fulcrum-and-arm method with immediate feedback.";
        actionLabel = "Start guided practice";
      } else {
        recommendationType = "continue_lever_independent_practice";
        title = "Target Independent Lever Practice";
        summaryText = "Lever reasoning was the lowest area, but the method is partly stable. Consolidate it in less-supported practice.";
        actionLabel = "Start independent practice";
      }
    }
    interpretation = `This is a strengthening recommendation. ${weakestLabel} was the lowest-scoring area when the four mechanical methods were mixed together.`;
  }

  const previousRecommendation = getCurrentRecommendation(journey);
  const updatedRecommendations = journey.recommendations.map((rec) => rec.recommendationId === previousRecommendation?.recommendationId ? { ...rec, status: "completed" as const } : rec);
  const comparison = summary.conceptBreakdown.map((item) => `${labels[item.concept] ?? item.concept}: ${item.correct}/${item.attempted}`).join(" · ");
  const why: WhyExplanation = {
    whyExplanationId: id("why"),
    title: `Why ${title} is recommended`,
    observation: integratedStrong ? "The mixed assessment was strong across all four mechanical areas." : `${weakestLabel} was the lowest-scoring area in the mixed assessment.`,
    evidence: `Overall: ${summary.correct} of ${summary.attempted}. ${comparison}.`,
    interpretation,
    recommendation: `${title} is recommended next.`,
    confidence: "Moderate. This is based on one 24-question mixed assessment and should guide the next preparation step rather than define overall aptitude.",
    createdAt: now(),
  };
  const recommendation: Recommendation = { recommendationId: id("rec"), recommendationType, title, summary: summaryText, actionLabel, confidence: "moderate", whyExplanationId: why.whyExplanationId, status: "active", createdAt: now() };
  const readiness: ReadinessSnapshot = {
    readinessSnapshotId: id("readiness"),
    state: "developing_evidence",
    label: integratedStrong ? "Developing evidence — integrated mechanical reasoning" : `Developing evidence — ${weakestLabel.toLowerCase()} is the next focus`,
    explanation: integratedStrong ? "The learner selected and applied the correct mechanical method across mixed categories with a strong overall result." : `The mixed assessment identified ${weakestLabel.toLowerCase()} as the clearest next preparation focus.`,
    confidence: "moderate",
    createdAt: now(),
  };
  const milestone: Milestone = { milestoneId: id("milestone"), type: "mixed_mechanical_assessment_completed", label: "Mixed Mechanical Assessment completed", createdAt: now() };
  const debrief: Debrief = {
    debriefId: id("debrief"),
    sessionId,
    title: "Mixed Mechanical Assessment complete",
    summary: `${summary.correct} of ${summary.attempted} correct (${Math.round(summary.accuracy * 100)}%).`,
    comparison,
    interpretation,
    recommendationId: recommendation.recommendationId,
    confidence: "moderate",
    whyExplanationId: why.whyExplanationId,
    createdAt: now(),
  };
  const evidence = summary.conceptBreakdown.map((item) => ({
    evidenceId: id("evidence"),
    domain: "mechanical" as const,
    subcompetency: item.concept as MechanicalSubcompetency,
    attempted: item.attempted,
    correct: item.correct,
    accuracy: item.accuracy,
    evidenceStrength: evidenceStrength(item.attempted),
    sourceSessionId: sessionId,
    updatedAt: now(),
  }));
  const recentMilestoneIds = [...(journey.dashboardState?.recentMilestoneIds ?? []), milestone.milestoneId].slice(-7);

  return {
    ...journey,
    sessions: journey.sessions.map((item) => item.sessionId === sessionId ? completedSession : item),
    practiceSummaries: [...journey.practiceSummaries, summary],
    debriefs: [...journey.debriefs, debrief],
    competencyEvidence: [...journey.competencyEvidence, ...evidence],
    recommendations: [...updatedRecommendations, recommendation],
    whyExplanations: [...journey.whyExplanations, why],
    readinessSnapshots: [...journey.readinessSnapshots, readiness],
    milestones: [...journey.milestones, milestone],
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
      hydraulic_independent_practice: "hydraulic-independent-practice-question",
      mixed_mechanical_practice: "mixed-mechanical-practice-question",
      guided_gear_practice: "guided-gear-practice-question",
      gear_independent_practice: "gear-independent-practice-question",
      gear_assessment: "gear-assessment-question",
      guided_pulley_practice: "guided-pulley-practice-question",
      pulley_independent_practice: "pulley-independent-practice-question",
      pulley_assessment: "pulley-assessment-question",
      guided_lever_practice: "guided-lever-practice-question",
      lever_independent_practice: "lever-independent-practice-question",
      lever_assessment: "lever-assessment-question",
      mixed_mechanical_assessment: "mixed-mechanical-assessment-question",
      guided_numerical_practice: "guided-numerical-practice-question",
      numerical_independent_practice: "numerical-independent-practice-question",
      numerical_assessment: "numerical-assessment-question",
      guided_abstract_logical_practice: "guided-abstract-logical-practice-question",
      abstract_logical_independent_practice: "abstract-logical-independent-practice-question",
      abstract_logical_assessment: "abstract-logical-assessment-question",
      guided_verbal_practice: "guided-verbal-practice-question",
      verbal_independent_practice: "verbal-independent-practice-question",
      verbal_assessment: "verbal-assessment-question",
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
  targetCorrectBySubcompetency: Partial<Record<Subcompetency, number>>
): AssessmentResponse[] {
  const correctSoFar: Partial<Record<Subcompetency, number>> = {};

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
  const responses = buildResponsesForTargetCounts(session, startingAssessmentQuestions, {
    hydraulics: 0,
    gears: 1,
    pulleys: 2,
    levers: 2,
    arithmetic_estimation: 2,
    percentages_ratios: 2,
    rates_proportion: 1,
    tables_data: 1,
    pattern_sequences: 2,
    matrices_rules: 1,
    classification_relationships: 1,
    deductive_reasoning: 2,
    explicit_information: 1,
    inference_context: 2,
    instructions_sequence: 2,
    assumptions_conclusions: 1,
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


function createLeverGuidedReadyDemoJourney(): MvpGuestJourney {
  const base = createHydraulicBaselineDemoJourney();
  const started = startLeverFundamentals(base);
  return completeLeverFundamentals(started);
}
function createLeverGuidedStrongDemoJourney(): MvpGuestJourney {
  const ready = createLeverGuidedReadyDemoJourney();
  const session = createGuidedLeverPracticeSession();
  const responses = guidedLeverPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 9 ? question.correctOptionId : getNonCorrectOptionId(question), 12000 + index * 360, false));
  return completeGuidedLeverPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
}
function createLeverIndependentStrongDemoJourney(): MvpGuestJourney {
  const ready = createLeverGuidedStrongDemoJourney();
  const session = createLeverIndependentPracticeSession();
  const responses = leverIndependentPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 22 ? question.correctOptionId : getNonCorrectOptionId(question), 15500 + index * 420, false));
  return completeLeverIndependentPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
}


function createMixedAssessmentPulleyFocusDemoJourney(): MvpGuestJourney {
  const base = createLeverIndependentStrongDemoJourney();
  const session = createMixedMechanicalAssessmentSession();
  const responses = buildResponsesForTargetCounts(session, mixedMechanicalAssessmentQuestions, {
    hydraulics: 5,
    gears: 5,
    pulleys: 2,
    levers: 5,
  });
  return completeMixedMechanicalAssessment({ ...base, sessions: [...base.sessions, session], responses: [...base.responses, ...responses] }, session.sessionId);
}


function createAbstractGuidedReadyDemoJourney(): MvpGuestJourney {
  const base = createHydraulicBaselineDemoJourney();
  const started = startAbstractLogicalFundamentals(base);
  return completeAbstractLogicalFundamentals(started);
}
function createAbstractGuidedStrongDemoJourney(): MvpGuestJourney {
  const ready = createAbstractGuidedReadyDemoJourney();
  const session = createGuidedAbstractLogicalPracticeSession();
  const responses = guidedAbstractLogicalPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 9 ? question.correctOptionId : getNonCorrectOptionId(question), 9000 + index * 320, false));
  return completeGuidedAbstractLogicalPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
}
function createAbstractIndependentStrongDemoJourney(): MvpGuestJourney {
  const ready = createAbstractGuidedStrongDemoJourney();
  const session = createAbstractLogicalIndependentPracticeSession();
  const responses = abstractLogicalIndependentPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 22 ? question.correctOptionId : getNonCorrectOptionId(question), 13500 + index * 390, false));
  return completeAbstractLogicalIndependentPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
}

function createVerbalGuidedReadyDemoJourney(): MvpGuestJourney {
  const base = createHydraulicBaselineDemoJourney();
  const started = startVerbalFundamentals(base);
  return completeVerbalFundamentals(started);
}
function createVerbalGuidedStrongDemoJourney(): MvpGuestJourney {
  const ready = createVerbalGuidedReadyDemoJourney();
  const session = createGuidedVerbalPracticeSession();
  const responses = guidedVerbalPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 9 ? question.correctOptionId : getNonCorrectOptionId(question), 10500 + index * 360, false));
  return completeGuidedVerbalPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
}
function createVerbalIndependentStrongDemoJourney(): MvpGuestJourney {
  const ready = createVerbalGuidedStrongDemoJourney();
  const session = createVerbalIndependentPracticeSession();
  const responses = verbalIndependentPracticeQuestions.map((question, index) => createAssessmentResponse(session.sessionId, question, index < 22 ? question.correctOptionId : getNonCorrectOptionId(question), 14500 + index * 410, false));
  return completeVerbalIndependentPractice({ ...ready, sessions: [...ready.sessions, session], responses: [...ready.responses, ...responses] }, session.sessionId);
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
    case "lever_guided_ready":
      return createLeverGuidedReadyDemoJourney();
    case "lever_guided_strong":
      return createLeverGuidedStrongDemoJourney();
    case "lever_independent_strong":
      return createLeverIndependentStrongDemoJourney();
    case "mixed_assessment_pulley_focus":
      return createMixedAssessmentPulleyFocusDemoJourney();
    case "abstract_guided_ready":
      return createAbstractGuidedReadyDemoJourney();
    case "abstract_guided_strong":
      return createAbstractGuidedStrongDemoJourney();
    case "abstract_independent_strong":
      return createAbstractIndependentStrongDemoJourney();
    case "verbal_guided_ready":
      return createVerbalGuidedReadyDemoJourney();
    case "verbal_guided_strong":
      return createVerbalGuidedStrongDemoJourney();
    case "verbal_independent_strong":
      return createVerbalIndependentStrongDemoJourney();
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
      scenario: "lever_guided_ready",
      title: "After Lever Fundamentals",
      description: "Loads a journey where Guided Lever Practice is recommended next.",
    },
    {
      scenario: "lever_guided_strong",
      title: "Strong guided lever practice",
      description: "Loads a journey where Independent Lever Practice is recommended next.",
    },
    {
      scenario: "lever_independent_strong",
      title: "Strong independent lever practice",
      description: "Loads a journey where the Lever Check is recommended next.",
    },
    {
      scenario: "mixed_assessment_pulley_focus",
      title: "Mixed assessment → Pulley focus",
      description: "Loads a completed mixed assessment where pulleys become the clearest strengthening recommendation.",
    },
    {
      scenario: "abstract_guided_ready",
      title: "After Abstract & Logical Fundamentals",
      description: "Loads a journey where Guided Abstract & Logical Practice is recommended next.",
    },
    {
      scenario: "abstract_guided_strong",
      title: "Strong guided abstract practice",
      description: "Loads a journey where Independent Abstract & Logical Practice is recommended next.",
    },
    {
      scenario: "abstract_independent_strong",
      title: "Strong independent abstract practice",
      description: "Loads a journey where the Abstract & Logical Check is recommended next.",
    },
    {
      scenario: "verbal_guided_ready",
      title: "After Verbal Fundamentals",
      description: "Loads a journey where Guided Verbal Practice is recommended next.",
    },
    {
      scenario: "verbal_guided_strong",
      title: "Strong guided verbal practice",
      description: "Loads a journey where Independent Verbal Practice is recommended next.",
    },
    {
      scenario: "verbal_independent_strong",
      title: "Strong independent verbal practice",
      description: "Loads a journey where the Verbal Comprehension Check is recommended next.",
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
function Shell({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) { return <main className="min-h-screen bg-[#111418] text-[#F4F6F8]"><header className="border-b border-white/5"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 sm:py-6"><div><div className="text-xl font-semibold tracking-wide">Vivalsa</div><div className="mt-1 text-xs tracking-[0.18em] text-[#6E7A88]">Aptitude test preparation</div></div><div className="text-right text-sm text-[#8D98A6]">{right ?? "Progress saved on this device"}</div></div></header>{children}</main>; }
function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-[#5ED3F3]/20 bg-[#5ED3F3]/10 px-3 py-1 text-xs font-medium text-[#BFF3FF]">{children}</span>; }

function LandingScreen({ onBegin, onLoadTestScenario }: { onBegin: () => void; onLoadTestScenario: (scenario: TestScenario) => void }) {
  return <Shell><section className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-6 py-16 sm:px-8 sm:py-20"><div className="max-w-3xl"><Badge>No account or email required to begin</Badge><h1 className="mt-8 text-5xl font-semibold leading-tight tracking-tight md:text-6xl">Learn how to solve aptitude-test questions.</h1><p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#9AA3B2]">Structured teaching, realistic practice and clear checks—guided by a Mentor that tells you what to work on next and why.</p><div className="mt-12"><PrimaryButton onClick={onBegin}>Start preparation</PrimaryButton></div></div><div className="mt-16 grid gap-5 md:grid-cols-3"><Card><h3 className="text-lg font-semibold">Learn the method</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">Understand the reasoning before you are expected to perform it independently.</p></Card><Card><h3 className="text-lg font-semibold">Build independent performance</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">Move from guided practice to less-supported questions and assessment-style checks.</p></Card><Card><h3 className="text-lg font-semibold">Know what to do next</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">The Mentor recommends the next useful step and explains the evidence behind it.</p></Card></div>{SHOW_TEST_SCENARIOS && <details className="mt-10 rounded-2xl border border-white/5 bg-[#151A21] p-5"><summary className="cursor-pointer text-sm font-medium text-[#8D98A6]">Tester tools</summary><div className="mt-5"><TestScenarioPanel onLoad={onLoadTestScenario} /></div></details>}</section></Shell>;
}
function PathwaySelectionScreen({ onSelect }: { onSelect: () => void }) {
  return <Shell><section className="mx-auto max-w-5xl px-6 py-16 sm:px-8"><h1 className="text-4xl font-semibold">Choose your preparation pathway</h1><p className="mt-5 max-w-2xl text-[#9AA3B2]">The MVP is deliberately focused on one pathway and doing it well.</p><div className="mt-10 max-w-2xl"><Card className="border-[#5ED3F3]/20"><div className="flex justify-between gap-4"><h2 className="text-2xl font-semibold">Fire Service</h2><Badge>Available</Badge></div><p className="mt-5 text-[#AAB4C0]">Mechanical, numerical, abstract & logical, verbal and supplementary spatial reasoning preparation for Fire Service-style selection assessments.</p><div className="mt-8"><PrimaryButton onClick={onSelect}>Continue with Fire Service</PrimaryButton></div></Card></div><p className="mt-10 max-w-2xl text-sm leading-relaxed text-[#6E7A88]">Vivalsa is not affiliated with or endorsed by any specific employer, agency or selection body. Other vocational pathways may be added later.</p></section></Shell>;
}
function OptionGroup<T extends string>({ label, value, options, onChange }: { label: string; value?: T; options: { label: string; value: T }[]; onChange: (value: T) => void }) { return <div><div className="mb-3 text-sm font-medium text-[#C8D2DD]">{label}</div><div className="grid gap-3 sm:grid-cols-2">{options.map((o) => <button key={o.value} onClick={() => onChange(o.value)} className={`rounded-xl border p-4 text-left text-sm transition ${value === o.value ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10 text-[#E8FBFF]" : "border-white/10 bg-[#111418] text-[#AAB4C0] hover:border-white/20"}`}>{o.label}</button>)}</div></div>; }
function PreparationContextScreen({ onSave }: { onSave: (context: PreparationContext) => void }) {
  const [assessmentTiming, setAssessmentTiming] = useState<PreparationContext["assessmentTiming"]>();
  const [weeklyPrepTime, setWeeklyPrepTime] = useState<PreparationContext["weeklyPrepTime"]>();
  const [previousAttempt, setPreviousAttempt] = useState<PreparationContext["previousAttempt"]>();
  const [error, setError] = useState(false);
  return <Shell><section className="mx-auto max-w-3xl px-8 py-16"><Card><h1 className="text-4xl font-semibold">Tell us about your preparation</h1><p className="mt-5 text-[#9AA3B2]">This helps Vivalsa choose a realistic next step. You can begin without entering your name or email.</p><div className="mt-10 space-y-8"><OptionGroup label="When is your assessment?" value={assessmentTiming} onChange={setAssessmentTiming} options={[{ label: "I do not know yet", value: "unknown" }, { label: "Within 2 weeks", value: "within_2_weeks" }, { label: "2–6 weeks", value: "two_to_six_weeks" }, { label: "6–12 weeks", value: "six_to_twelve_weeks" }, { label: "More than 12 weeks", value: "more_than_twelve_weeks" }]} /><OptionGroup label="How much time can you usually prepare each week?" value={weeklyPrepTime} onChange={setWeeklyPrepTime} options={[{ label: "Less than 1 hour", value: "less_than_one_hour" }, { label: "1–2 hours", value: "one_to_two_hours" }, { label: "3–5 hours", value: "three_to_five_hours" }, { label: "More than 5 hours", value: "more_than_five_hours" }, { label: "Not sure", value: "not_sure" }]} /><OptionGroup label="Have you attempted a similar assessment before?" value={previousAttempt} onChange={setPreviousAttempt} options={[{ label: "No", value: "no" }, { label: "Yes", value: "yes" }, { label: "Prefer not to say", value: "prefer_not_to_say" }]} /></div>{error && <p className="mt-6 text-sm text-[#FFB3B3]">Please choose an option for each question before continuing.</p>}<div className="mt-10"><PrimaryButton onClick={() => { if (!assessmentTiming || !weeklyPrepTime || !previousAttempt) { setError(true); return; } onSave({ assessmentTiming, weeklyPrepTime, previousAttempt, createdAt: now() }); }}>Continue</PrimaryButton></div></Card></section></Shell>;
}
function BaselineIntroScreen({ onStart }: { onStart: () => void }) {
  const domains = [
    { title: "Mechanical", detail: "Hydraulics, gears, pulleys and levers" },
    { title: "Numerical", detail: "Arithmetic, percentages, ratios, rates and data" },
    { title: "Abstract & logical", detail: "Patterns, matrices, classification and deduction" },
    { title: "Verbal", detail: "Stated information, inference, instructions and conclusions" },
  ];
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-6 py-16 sm:px-8"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Your starting point</p><h1 className="mt-5 text-4xl font-semibold">Starting assessment</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#9AA3B2]">A short cross-domain assessment across the four core areas in this MVP. The Mentor will use the pattern of results to choose a useful first preparation step.</p><p className="mx-auto mt-4 max-w-2xl text-[#C8D2DD]">This is not a pass/fail test, and it does not attempt to predict your selection outcome.</p><div className="mx-auto mt-9 grid max-w-3xl gap-3 sm:grid-cols-2">{domains.map((domain) => <div key={domain.title} className="rounded-2xl border border-white/5 bg-[#111418] p-5 text-left"><div className="font-semibold text-[#D9F8FF]">{domain.title}</div><div className="mt-2 text-sm leading-relaxed text-[#8D98A6]">{domain.detail}</div></div>)}</div><div className="mx-auto mt-7 grid max-w-3xl gap-3 sm:grid-cols-4">{["26 questions", "No timer", "No live score", "No account required"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-[#8D98A6]">You will move through four short sections. Answers are not revealed during the assessment.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Start assessment</PrimaryButton></div></Card></section></Shell>;
}
function MechanicalQuestionScreen({ journey, sessionId, questionIndex, onAnswer }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  useEffect(() => { requestAnimationFrame(() => document.getElementById("starting-question-card")?.scrollIntoView({ behavior: "smooth", block: "start" })); setStartedAt(Date.now()); setSelectedOptionId(null); }, [questionIndex]);
  const question = startingAssessmentQuestions[questionIndex];
  if (!question) return null;
  const progress = ((questionIndex + 1) / startingAssessmentQuestions.length) * 100;
  const answered = journey.responses.filter((response) => response.sessionId === sessionId).length;
  const domainIndex = startingDomainOrder.indexOf(question.domain);
  const domainQuestionNumber = startingAssessmentQuestions.slice(0, questionIndex + 1).filter((item) => item.domain === question.domain).length;
  const domainQuestionTotal = startingAssessmentQuestions.filter((item) => item.domain === question.domain).length;
  function submit(optionId: string | null, notSure = false) {
    onAnswer(createAssessmentResponse(sessionId, question, optionId, Date.now() - startedAt, notSure), questionIndex === startingAssessmentQuestions.length - 1);
  }
  return <Shell right="Starting assessment"><section className="mx-auto max-w-5xl px-6 pb-32 pt-8 sm:px-8 sm:pt-10 lg:pb-10"><div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-4 flex flex-wrap gap-2">{startingDomainOrder.map((domain, index) => <span key={domain} className={`rounded-full border px-3 py-1 text-xs ${index === domainIndex ? "border-[#5ED3F3]/35 bg-[#5ED3F3]/10 text-[#D9F8FF]" : index < domainIndex ? "border-white/10 bg-white/5 text-[#8D98A6]" : "border-white/5 text-[#596574]"}`}>{startingDomainLabels[domain]}</span>)}</div><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Section {domainIndex + 1} of 4</p><h1 className="mt-3 text-3xl font-semibold">{startingDomainLabels[question.domain]}</h1><p className="mt-2 text-sm text-[#8D98A6]">Question {domainQuestionNumber} of {domainQuestionTotal} in this section</p></div><div className="text-right text-sm text-[#8D98A6]">Overall {questionIndex + 1} of {startingAssessmentQuestions.length}<br /><span className="text-xs">{answered} saved</span></div></div><div id="starting-question-card" className="scroll-mt-4"><Card className="p-5 sm:p-6">{question.dataTable && <NumericalDataTableView table={question.dataTable} />}{question.abstractVisual && <AbstractLogicalVisualPanel visual={question.abstractVisual} />}{question.verbalPassage && <VerbalPassagePanel passage={question.verbalPassage} />}<p className="text-lg leading-relaxed text-[#F4F6F8] sm:text-xl">{question.stem}</p><div className="mt-5 grid gap-3">{question.options.map((option) => <button key={option.optionId} onClick={() => setSelectedOptionId(option.optionId)} className={`rounded-2xl border bg-[#111418] p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div><div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#111418]/95 p-3 shadow-2xl backdrop-blur-xl lg:static lg:mt-6 lg:flex lg:items-center lg:justify-between lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"><div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mx-0 lg:w-full"><SecondaryButton onClick={() => submit(null, true)}>I'm not sure</SecondaryButton><PrimaryButton disabled={!selectedOptionId} onClick={() => submit(selectedOptionId, false)}>{questionIndex === startingAssessmentQuestions.length - 1 ? "Finish assessment" : "Next question"}</PrimaryButton></div></div></Card></div></section></Shell>;
}
function AssessmentCompleteScreen({ onView }: { onView: () => void }) { return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-6 py-16 sm:px-8"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Four domains reviewed</p><h1 className="mt-5 text-4xl font-semibold">Starting assessment complete</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">The Mentor has compared your early signals across mechanical, numerical, abstract & logical and verbal reasoning.</p><p className="mx-auto mt-4 max-w-xl text-[#C8D2DD]">Your first recommendation is ready.</p><div className="mt-10"><PrimaryButton onClick={onView}>View Mentor recommendation</PrimaryButton></div></Card></section></Shell>; }
function WhyModal({ why, onClose }: { why?: WhyExplanation; onClose: () => void }) { if (!why) return null; const sections = [["Observation", why.observation], ["Evidence", why.evidence], ["Interpretation", why.interpretation], ["Recommendation", why.recommendation], ["Confidence", why.confidence]]; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-[32px] border border-white/10 bg-[#171C23] p-8 shadow-2xl"><div className="flex items-start justify-between gap-6"><div><p className="text-xs uppercase tracking-[0.22em] text-[#6E7A88]">Why explanation</p><h2 className="mt-3 text-3xl font-semibold">{why.title}</h2></div><button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-[#8D98A6] hover:text-white">Close</button></div><div className="mt-8 space-y-6">{sections.map(([label, text]) => <div key={label} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">{label}</div><p className="mt-3 leading-relaxed text-[#C8D2DD]">{text}</p></div>)}</div><p className="mt-6 text-sm text-[#6E7A88]">Vivalsa uses this explanation to keep recommendations transparent and evidence-based.</p></div></div>; }
function FirstAdvisorInsightScreen({ journey, onWhy, onStartRecommendation }: { journey: MvpGuestJourney; onWhy: () => void; onStartRecommendation: () => void }) {
  const rec = getCurrentRecommendation(journey);
  const timing = getAssessmentTimingLabel(journey.preparationContext);
  const results = getStartingDomainResultsFromJourney(journey);
  const ranked = [...results].sort((a, b) => b.accuracy - a.accuracy);
  const strongest = ranked[0];
  const focus = [...results].sort((a, b) => a.accuracy - b.accuracy)[0];
  return <Shell right={timing}><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-6 py-12 sm:px-8 sm:py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">A useful starting point</p><h1 className="mt-5 text-4xl font-semibold leading-tight">We have seen enough to make a first recommendation.</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#9AA3B2]">As you complete more questions, Vivalsa will learn more about where your preparation will help most.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">You handled well</div><p className="mt-3 leading-relaxed text-[#DCE3EA]">{strongest ? `${startingDomainLabels[strongest.domain]} produced your strongest early signal.` : "You completed the starting questions and gave Vivalsa enough evidence to choose a first step."}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Area to strengthen</div><p className="mt-3 leading-relaxed text-[#DCE3EA]">{focus ? `${startingDomainLabels[focus.domain]} is currently the clearest area worth strengthening.` : "More evidence will make future recommendations more specific."}</p></div></div><div className="mt-6 rounded-2xl border border-[#5ED3F3]/20 bg-[#5ED3F3]/5 p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next</div><h2 className="mt-3 text-3xl font-semibold">{rec?.title ?? "Start learning"}</h2><p className="mt-4 max-w-3xl leading-relaxed text-[#AAB4C0]">{rec?.summary}</p><div className="mt-4 text-sm text-[#8D98A6]"><span className="font-medium text-[#C8D2DD]">Why this? Why now?</span> This is the clearest useful step from the early evidence available today. Later practice can change the recommendation.</div></div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><PrimaryButton onClick={onStartRecommendation}>{rec?.actionLabel ?? "Start learning"}</PrimaryButton><SecondaryButton onClick={onWhy}>Why this?</SecondaryButton></div></Card></section></Shell>;
}

function getAssessmentTimingLabel(context?: PreparationContext) {
  if (!context) return "Assessment timing not set";
  const labels: Record<PreparationContext["assessmentTiming"], string> = {
    unknown: "Assessment timing unknown",
    within_2_weeks: "Assessment within 2 weeks",
    two_to_six_weeks: "Assessment in 2–6 weeks",
    six_to_twelve_weeks: "Assessment in 6–12 weeks",
    more_than_twelve_weeks: "Assessment more than 12 weeks away",
  };
  return labels[context.assessmentTiming];
}

function getWeeklyPrepLabel(context?: PreparationContext) {
  if (!context) return undefined;
  const labels: Record<PreparationContext["weeklyPrepTime"], string> = {
    less_than_one_hour: "<1 hour/week",
    one_to_two_hours: "1–2 hours/week",
    three_to_five_hours: "3–5 hours/week",
    more_than_five_hours: "5+ hours/week",
    not_sure: "Weekly time not set",
  };
  return labels[context.weeklyPrepTime];
}

function getLatestPracticeSummary(journey: MvpGuestJourney, sessionTypes: PracticeSummary["sessionType"][]) {
  return [...journey.practiceSummaries]
    .filter((summary) => sessionTypes.includes(summary.sessionType))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

function getStartingMechanicalAccuracy(journey: MvpGuestJourney) {
  return getStartingDomainAccuracy(journey, "mechanical");
}

function getSimpleDomainProgress(
  journey: MvpGuestJourney,
  domain: Domain,
  assessmentType: PracticeSummary["sessionType"],
  independentType: PracticeSummary["sessionType"],
  guidedType: PracticeSummary["sessionType"],
  moduleId: LearningModuleId,
) {
  const assessment = getLatestPracticeSummary(journey, [assessmentType]);
  if (assessment) return { status: "Check complete", value: `${Math.round(assessment.accuracy * 100)}%`, detail: "Latest assessment-style check" };
  const independent = getLatestPracticeSummary(journey, [independentType]);
  if (independent) return { status: "Independent practice underway", value: `${Math.round(independent.accuracy * 100)}%`, detail: "Latest independent practice" };
  const guided = getLatestPracticeSummary(journey, [guidedType]);
  if (guided) return { status: "Guided practice underway", value: `${Math.round(guided.accuracy * 100)}%`, detail: "Latest guided practice" };
  if (journey.moduleCompletions.some((completion) => completion.moduleId === moduleId)) return { status: "Fundamentals complete", value: "Next stage ready", detail: "Foundation module completed" };
  if (journey.moduleProgress.some((progress) => progress.moduleId === moduleId)) return { status: "Fundamentals underway", value: "In progress", detail: "Foundation module started" };
  const startingAccuracy = getStartingDomainAccuracy(journey, domain);
  if (startingAccuracy !== undefined) return { status: "Starting point established", value: `${Math.round(startingAccuracy * 100)}%`, detail: "Cross-domain starting assessment" };
  return { status: "Not started", value: "—", detail: "No completed evidence yet" };
}

function getDashboardProgress(journey: MvpGuestJourney) {
  const mechanicalAssessment = getLatestPracticeSummary(journey, ["mixed_mechanical_assessment"]);
  const startingMechanical = getStartingMechanicalAccuracy(journey);
  const topicChecks = ["gear_assessment", "pulley_assessment", "lever_assessment"].filter((type) =>
    journey.practiceSummaries.some((summary) => summary.sessionType === type)
  ).length;
  const mechanical = mechanicalAssessment
    ? {
        status: "Integrated check complete",
        value: `${Math.round(mechanicalAssessment.accuracy * 100)}%`,
        detail: startingMechanical !== undefined
          ? `Starting point ${Math.round(startingMechanical * 100)}% · latest integrated check ${Math.round(mechanicalAssessment.accuracy * 100)}%`
          : "Latest integrated mechanical assessment",
      }
    : topicChecks > 0
      ? { status: "Mechanical pathways underway", value: `${topicChecks}/3 checks`, detail: "Gear, pulley and lever topic checks completed" }
      : journey.moduleCompletions.some((completion) => ["hydraulic_fundamentals", "gear_fundamentals", "pulley_fundamentals", "lever_fundamentals"].includes(completion.moduleId))
        ? { status: "Mechanical learning underway", value: "In progress", detail: "At least one mechanical foundation pathway has been completed" }
        : { status: "Starting point established", value: startingMechanical !== undefined ? `${Math.round(startingMechanical * 100)}%` : "—", detail: "Cross-domain starting assessment" };

  return [
    { name: "Mechanical reasoning", ...mechanical },
    { name: "Numerical reasoning", ...getSimpleDomainProgress(journey, "numerical", "numerical_assessment", "numerical_independent_practice", "guided_numerical_practice", "numerical_fundamentals") },
    { name: "Abstract & logical", ...getSimpleDomainProgress(journey, "abstract_logical", "abstract_logical_assessment", "abstract_logical_independent_practice", "guided_abstract_logical_practice", "abstract_logical_fundamentals") },
    { name: "Verbal comprehension", ...getSimpleDomainProgress(journey, "verbal", "verbal_assessment", "verbal_independent_practice", "guided_verbal_practice", "verbal_fundamentals") },
  ];
}

function DashboardScreen({
  journey,
  onWhy,
  onReset,
  onStartHydraulics,
  onStartGuidedPractice,
  onStartHydraulicIndependentPractice,
  onStartMixedPractice,
  onStartMixedAssessment,
  onStartGearFundamentals,
  onStartGuidedGearPractice,
  onStartGearIndependentPractice,
  onStartGearAssessment,
  onStartPulleyFundamentals,
  onStartGuidedPulleyPractice,
  onStartPulleyIndependentPractice,
  onStartPulleyAssessment,
  onStartLeverFundamentals,
  onStartGuidedLeverPractice,
  onStartLeverIndependentPractice,
  onStartLeverAssessment,
  onStartNumericalFundamentals,
  onStartGuidedNumericalPractice,
  onStartNumericalIndependentPractice,
  onStartNumericalAssessment,
  onStartAbstractLogicalFundamentals,
  onStartGuidedAbstractLogicalPractice,
  onStartAbstractLogicalIndependentPractice,
  onStartAbstractLogicalAssessment,
  onStartVerbalFundamentals,
  onStartGuidedVerbalPractice,
  onStartVerbalIndependentPractice,
  onStartVerbalAssessment,
  onLoadTestScenario,
}: {
  journey: MvpGuestJourney;
  onWhy: () => void;
  onReset: () => void;
  onStartHydraulics: () => void;
  onStartGuidedPractice: () => void;
  onStartHydraulicIndependentPractice: () => void;
  onStartMixedPractice: () => void;
  onStartMixedAssessment: () => void;
  onStartGearFundamentals: () => void;
  onStartGuidedGearPractice: () => void;
  onStartGearIndependentPractice: () => void;
  onStartGearAssessment: () => void;
  onStartPulleyFundamentals: () => void;
  onStartGuidedPulleyPractice: () => void;
  onStartPulleyIndependentPractice: () => void;
  onStartPulleyAssessment: () => void;
  onStartLeverFundamentals: () => void;
  onStartGuidedLeverPractice: () => void;
  onStartLeverIndependentPractice: () => void;
  onStartLeverAssessment: () => void;
  onStartNumericalFundamentals: () => void;
  onStartGuidedNumericalPractice: () => void;
  onStartNumericalIndependentPractice: () => void;
  onStartNumericalAssessment: () => void;
  onStartAbstractLogicalFundamentals: () => void;
  onStartGuidedAbstractLogicalPractice: () => void;
  onStartAbstractLogicalIndependentPractice: () => void;
  onStartAbstractLogicalAssessment: () => void;
  onStartVerbalFundamentals: () => void;
  onStartGuidedVerbalPractice: () => void;
  onStartVerbalIndependentPractice: () => void;
  onStartVerbalAssessment: () => void;
  onLoadTestScenario: (scenario: TestScenario) => void;
}) {
  const rec = getCurrentRecommendation(journey);
  const milestones = getRecentMilestones(journey);
  const progress = getDashboardProgress(journey);
  const timing = getAssessmentTimingLabel(journey.preparationContext);
  const weeklyPrep = getWeeklyPrepLabel(journey.preparationContext);

  const canStartHydraulics = rec?.recommendationType === "start_hydraulic_fundamentals";
  const canStartGuided = rec?.recommendationType === "begin_guided_hydraulic_practice" || rec?.recommendationType === "continue_guided_hydraulic_practice" || rec?.title?.toLowerCase().includes("guided hydraulic practice");
  const canStartIndependentHydraulics = rec?.recommendationType === "begin_hydraulic_independent_practice" || rec?.recommendationType === "continue_hydraulic_independent_practice" || rec?.title?.toLowerCase().includes("independent hydraulic practice");
  const canStartMixed = rec?.recommendationType === "begin_mixed_mechanical_practice" || rec?.recommendationType === "return_to_mixed_mechanical_practice" || rec?.title?.toLowerCase().includes("mixed mechanical practice");
  const canStartMixedAssessment = rec?.recommendationType === "begin_mixed_mechanical_assessment" || rec?.recommendationType === "repeat_mixed_mechanical_assessment";
  const canStartGear = rec?.recommendationType === "start_gear_fundamentals" || rec?.recommendationType === "review_gear_fundamentals" || rec?.title?.toLowerCase().includes("gear fundamentals");
  const canStartGuidedGear = rec?.recommendationType === "begin_guided_gear_practice" || rec?.recommendationType === "continue_guided_gear_practice" || rec?.title?.toLowerCase().includes("guided gear practice");
  const canStartIndependentGear = rec?.recommendationType === "begin_gear_independent_practice" || rec?.recommendationType === "continue_gear_independent_practice" || rec?.title?.toLowerCase().includes("independent gear practice");
  const canStartGearAssessment = rec?.recommendationType === "begin_gear_assessment" || rec?.recommendationType === "repeat_gear_assessment" || rec?.actionLabel?.toLowerCase().includes("gear check");
  const canStartPulley = rec?.recommendationType === "start_pulley_fundamentals" || rec?.recommendationType === "review_pulley_fundamentals" || rec?.title?.toLowerCase().includes("pulley fundamentals");
  const canStartGuidedPulley = rec?.recommendationType === "begin_guided_pulley_practice" || rec?.recommendationType === "continue_guided_pulley_practice" || rec?.title?.toLowerCase().includes("guided pulley practice");
  const canStartIndependentPulley = rec?.recommendationType === "begin_pulley_independent_practice" || rec?.recommendationType === "continue_pulley_independent_practice" || rec?.title?.toLowerCase().includes("independent pulley practice");
  const canStartPulleyAssessment = rec?.recommendationType === "begin_pulley_assessment" || rec?.recommendationType === "repeat_pulley_assessment" || rec?.actionLabel?.toLowerCase().includes("pulley check");
  const canStartLever = rec?.recommendationType === "start_lever_fundamentals" || rec?.recommendationType === "review_lever_fundamentals" || rec?.title?.toLowerCase().includes("lever fundamentals");
  const canStartGuidedLever = rec?.recommendationType === "begin_guided_lever_practice" || rec?.recommendationType === "continue_guided_lever_practice" || rec?.title?.toLowerCase().includes("guided lever practice");
  const canStartIndependentLever = rec?.recommendationType === "begin_lever_independent_practice" || rec?.recommendationType === "continue_lever_independent_practice" || rec?.title?.toLowerCase().includes("independent lever practice");
  const canStartLeverAssessment = rec?.recommendationType === "begin_lever_assessment" || rec?.recommendationType === "repeat_lever_assessment" || rec?.actionLabel?.toLowerCase().includes("lever check");
  const canStartNumerical = rec?.recommendationType === "start_numerical_fundamentals" || rec?.recommendationType === "review_numerical_fundamentals" || rec?.title?.toLowerCase().includes("numerical fundamentals");
  const canStartGuidedNumerical = rec?.recommendationType === "begin_guided_numerical_practice" || rec?.recommendationType === "continue_guided_numerical_practice";
  const canStartIndependentNumerical = rec?.recommendationType === "begin_numerical_independent_practice" || rec?.recommendationType === "continue_numerical_independent_practice" || rec?.recommendationType === "continue_numerical_practice";
  const canStartNumericalAssessment = rec?.recommendationType === "begin_numerical_assessment" || rec?.recommendationType === "repeat_numerical_assessment";
  const canStartAbstractLogical = rec?.recommendationType === "start_abstract_logical_fundamentals" || rec?.recommendationType === "review_abstract_logical_fundamentals" || rec?.title?.toLowerCase().includes("abstract & logical fundamentals");
  const canStartGuidedAbstractLogical = rec?.recommendationType === "begin_guided_abstract_logical_practice" || rec?.recommendationType === "continue_guided_abstract_logical_practice";
  const canStartIndependentAbstractLogical = rec?.recommendationType === "begin_abstract_logical_independent_practice" || rec?.recommendationType === "continue_abstract_logical_independent_practice" || rec?.recommendationType === "continue_abstract_logical_practice";
  const canStartAbstractLogicalAssessment = rec?.recommendationType === "begin_abstract_logical_assessment" || rec?.recommendationType === "repeat_abstract_logical_assessment";
  const canStartVerbal = rec?.recommendationType === "start_verbal_fundamentals" || rec?.recommendationType === "review_verbal_fundamentals" || rec?.title?.toLowerCase().includes("verbal comprehension fundamentals");
  const canStartGuidedVerbal = rec?.recommendationType === "begin_guided_verbal_practice" || rec?.recommendationType === "continue_guided_verbal_practice";
  const canStartIndependentVerbal = rec?.recommendationType === "begin_verbal_independent_practice" || rec?.recommendationType === "continue_verbal_independent_practice" || rec?.recommendationType === "continue_verbal_practice";
  const canStartVerbalAssessment = rec?.recommendationType === "begin_verbal_assessment" || rec?.recommendationType === "repeat_verbal_assessment";

  const recommendationAction = canStartHydraulics ? <PrimaryButton onClick={onStartHydraulics}>Start fundamentals</PrimaryButton>
    : canStartGuided ? <PrimaryButton onClick={onStartGuidedPractice}>Start guided practice</PrimaryButton>
    : canStartIndependentHydraulics ? <PrimaryButton onClick={onStartHydraulicIndependentPractice}>Start independent hydraulic practice</PrimaryButton>
    : canStartGear ? <PrimaryButton onClick={onStartGearFundamentals}>Start Gear Fundamentals</PrimaryButton>
    : canStartGuidedGear ? <PrimaryButton onClick={onStartGuidedGearPractice}>Start guided gear practice</PrimaryButton>
    : canStartIndependentGear ? <PrimaryButton onClick={onStartGearIndependentPractice}>Start independent gear practice</PrimaryButton>
    : canStartGearAssessment ? <PrimaryButton onClick={onStartGearAssessment}>Start Gear Check</PrimaryButton>
    : canStartPulley ? <PrimaryButton onClick={onStartPulleyFundamentals}>Start Pulley Fundamentals</PrimaryButton>
    : canStartGuidedPulley ? <PrimaryButton onClick={onStartGuidedPulleyPractice}>Start guided pulley practice</PrimaryButton>
    : canStartIndependentPulley ? <PrimaryButton onClick={onStartPulleyIndependentPractice}>Start independent pulley practice</PrimaryButton>
    : canStartPulleyAssessment ? <PrimaryButton onClick={onStartPulleyAssessment}>Start Pulley Check</PrimaryButton>
    : canStartLever ? <PrimaryButton onClick={onStartLeverFundamentals}>Start Lever Fundamentals</PrimaryButton>
    : canStartGuidedLever ? <PrimaryButton onClick={onStartGuidedLeverPractice}>Start guided lever practice</PrimaryButton>
    : canStartIndependentLever ? <PrimaryButton onClick={onStartLeverIndependentPractice}>Start independent lever practice</PrimaryButton>
    : canStartLeverAssessment ? <PrimaryButton onClick={onStartLeverAssessment}>Start Lever Check</PrimaryButton>
    : canStartNumerical ? <PrimaryButton onClick={onStartNumericalFundamentals}>Start Numerical Fundamentals</PrimaryButton>
    : canStartGuidedNumerical ? <PrimaryButton onClick={onStartGuidedNumericalPractice}>Start guided numerical practice</PrimaryButton>
    : canStartIndependentNumerical ? <PrimaryButton onClick={onStartNumericalIndependentPractice}>Start independent numerical practice</PrimaryButton>
    : canStartNumericalAssessment ? <PrimaryButton onClick={onStartNumericalAssessment}>Start Numerical Check</PrimaryButton>
    : canStartAbstractLogical ? <PrimaryButton onClick={onStartAbstractLogicalFundamentals}>Start Abstract & Logical Fundamentals</PrimaryButton>
    : canStartGuidedAbstractLogical ? <PrimaryButton onClick={onStartGuidedAbstractLogicalPractice}>Start guided abstract practice</PrimaryButton>
    : canStartIndependentAbstractLogical ? <PrimaryButton onClick={onStartAbstractLogicalIndependentPractice}>Start independent abstract practice</PrimaryButton>
    : canStartAbstractLogicalAssessment ? <PrimaryButton onClick={onStartAbstractLogicalAssessment}>Start Abstract & Logical Check</PrimaryButton>
    : canStartVerbal ? <PrimaryButton onClick={onStartVerbalFundamentals}>Start Verbal Fundamentals</PrimaryButton>
    : canStartGuidedVerbal ? <PrimaryButton onClick={onStartGuidedVerbalPractice}>Start guided verbal practice</PrimaryButton>
    : canStartIndependentVerbal ? <PrimaryButton onClick={onStartVerbalIndependentPractice}>Start independent verbal practice</PrimaryButton>
    : canStartVerbalAssessment ? <PrimaryButton onClick={onStartVerbalAssessment}>Start Verbal Check</PrimaryButton>
    : canStartMixedAssessment ? <PrimaryButton onClick={onStartMixedAssessment}>Start Mixed Mechanical Assessment</PrimaryButton>
    : canStartMixed ? <PrimaryButton onClick={onStartMixedPractice}>Start mixed practice</PrimaryButton>
    : rec ? <PrimaryButton disabled>{rec.actionLabel} — coming soon</PrimaryButton>
    : <PrimaryButton disabled>No recommendation yet</PrimaryButton>;

  return <Shell right={timing}><section className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-12">
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Dashboard</p><h1 className="mt-3 text-4xl font-semibold">Your preparation plan</h1></div>
      <div className="flex flex-wrap gap-2"><Badge>{timing}</Badge>{weeklyPrep && <Badge>{weeklyPrep}</Badge>}</div>
    </div>

    <Card className="border-[#5ED3F3]/15">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Mentor recommendation</div>
          <h2 className="mt-3 text-3xl font-semibold">{rec?.title ?? "Complete the starting assessment"}</h2>
          <p className="mt-4 text-lg leading-relaxed text-[#AAB4C0]">{rec?.summary ?? "Complete the cross-domain starting assessment so the Mentor can recommend a useful first step."}</p>
        </div>
        <Badge>{rec?.confidence === "high" ? "High confidence" : rec?.confidence === "moderate" ? "Moderate confidence" : "Early evidence"}</Badge>
      </div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">{recommendationAction}<SecondaryButton onClick={onWhy}>Why this?</SecondaryButton></div>
    </Card>

    <div className="mt-8">
      <div className="mb-4"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Your progress</div><p className="mt-2 text-sm text-[#8D98A6]">A simple view of the evidence collected so far. Scores are preparation signals, not pass/fail judgements.</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {progress.map((item) => <Card key={item.name} className="p-5"><div className="text-sm font-semibold text-[#D9F8FF]">{item.name}</div><div className="mt-4 text-3xl font-semibold">{item.value}</div><div className="mt-2 text-sm text-[#AAB4C0]">{item.status}</div><p className="mt-3 text-xs leading-relaxed text-[#6E7A88]">{item.detail}</p></Card>)}
      </div>
    </div>

    {milestones.length > 0 && <Card className="mt-8"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recent progress</div><div className="mt-5 grid gap-3 sm:grid-cols-2">{milestones.slice(-4).reverse().map((milestone) => <div key={milestone.milestoneId} className="rounded-2xl border border-white/5 bg-[#111418] p-4 text-sm text-[#C8D2DD]">{milestone.label}</div>)}</div></Card>}

    <details className="mt-8 rounded-[28px] border border-white/5 bg-[#171C23] p-6">
      <summary className="cursor-pointer list-none"><div className="flex items-center justify-between gap-4"><div><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Browse practice</div><h3 className="mt-2 text-2xl font-semibold">Open any pathway</h3><p className="mt-2 text-sm text-[#8D98A6]">The Mentor recommendation remains the default, but you can choose another activity.</p></div><span className="text-2xl text-[#6E7A88]">＋</span></div></summary>
      <div className="mt-6 space-y-4">
        <details className="rounded-2xl border border-white/5 bg-[#111418] p-5"><summary className="cursor-pointer font-semibold text-[#D9F8FF]">Mechanical reasoning</summary><div className="mt-5 space-y-5"><div><div className="text-sm text-[#8D98A6]">Hydraulics</div><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><PrimaryButton onClick={onStartHydraulics}>Fundamentals</PrimaryButton><SecondaryButton onClick={onStartGuidedPractice}>Guided practice</SecondaryButton><SecondaryButton onClick={onStartHydraulicIndependentPractice}>Independent</SecondaryButton><SecondaryButton onClick={onStartMixedPractice}>Mixed practice</SecondaryButton></div></div><div><div className="text-sm text-[#8D98A6]">Gears</div><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><PrimaryButton onClick={onStartGearFundamentals}>Fundamentals</PrimaryButton><SecondaryButton onClick={onStartGuidedGearPractice}>Guided</SecondaryButton><SecondaryButton onClick={onStartGearIndependentPractice}>Independent</SecondaryButton><SecondaryButton onClick={onStartGearAssessment}>Check</SecondaryButton></div></div><div><div className="text-sm text-[#8D98A6]">Pulleys</div><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><PrimaryButton onClick={onStartPulleyFundamentals}>Fundamentals</PrimaryButton><SecondaryButton onClick={onStartGuidedPulleyPractice}>Guided</SecondaryButton><SecondaryButton onClick={onStartPulleyIndependentPractice}>Independent</SecondaryButton><SecondaryButton onClick={onStartPulleyAssessment}>Check</SecondaryButton></div></div><div><div className="text-sm text-[#8D98A6]">Levers</div><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><PrimaryButton onClick={onStartLeverFundamentals}>Fundamentals</PrimaryButton><SecondaryButton onClick={onStartGuidedLeverPractice}>Guided</SecondaryButton><SecondaryButton onClick={onStartLeverIndependentPractice}>Independent</SecondaryButton><SecondaryButton onClick={onStartLeverAssessment}>Check</SecondaryButton></div></div><div className="rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-4"><div className="font-semibold text-[#D9F8FF]">Integrated mechanical assessment</div><div className="mt-3"><PrimaryButton onClick={onStartMixedAssessment}>Open assessment</PrimaryButton></div></div></div></details>

        <details className="rounded-2xl border border-white/5 bg-[#111418] p-5"><summary className="cursor-pointer font-semibold text-[#D9F8FF]">Numerical reasoning</summary><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><PrimaryButton onClick={onStartNumericalFundamentals}>Fundamentals</PrimaryButton><SecondaryButton onClick={onStartGuidedNumericalPractice}>Guided</SecondaryButton><SecondaryButton onClick={onStartNumericalIndependentPractice}>Independent</SecondaryButton><SecondaryButton onClick={onStartNumericalAssessment}>Check</SecondaryButton></div></details>

        <details className="rounded-2xl border border-white/5 bg-[#111418] p-5"><summary className="cursor-pointer font-semibold text-[#D9F8FF]">Abstract & logical reasoning</summary><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><PrimaryButton onClick={onStartAbstractLogicalFundamentals}>Fundamentals</PrimaryButton><SecondaryButton onClick={onStartGuidedAbstractLogicalPractice}>Guided</SecondaryButton><SecondaryButton onClick={onStartAbstractLogicalIndependentPractice}>Independent</SecondaryButton><SecondaryButton onClick={onStartAbstractLogicalAssessment}>Check</SecondaryButton></div></details>

        <details className="rounded-2xl border border-white/5 bg-[#111418] p-5"><summary className="cursor-pointer font-semibold text-[#D9F8FF]">Verbal comprehension</summary><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><PrimaryButton onClick={onStartVerbalFundamentals}>Fundamentals</PrimaryButton><SecondaryButton onClick={onStartGuidedVerbalPractice}>Guided</SecondaryButton><SecondaryButton onClick={onStartVerbalIndependentPractice}>Independent</SecondaryButton><SecondaryButton onClick={onStartVerbalAssessment}>Check</SecondaryButton></div></details>
      </div>
    </details>

    <div className="mt-8 flex flex-col gap-3 border-t border-white/5 pt-6 text-sm text-[#6E7A88] sm:flex-row sm:items-center sm:justify-between"><span>Progress is saved on this device.</span><span>Build: {BUILD_LABEL}</span></div>

    {SHOW_TEST_SCENARIOS && <details className="mt-6 rounded-2xl border border-white/5 bg-[#151A21] p-5"><summary className="cursor-pointer text-sm font-medium text-[#8D98A6]">Tester tools</summary><div className="mt-5"><div className="mb-5"><SecondaryButton onClick={onReset}>Reset local journey</SecondaryButton></div><TestScenarioPanel onLoad={onLoadTestScenario} /></div></details>}
  </section></Shell>;
}
function HydraulicCuriosityDiagram() {
  return <div className="hydraulic-visual mt-7" role="img" aria-label="A small input piston connected by fluid to a larger output piston lifting a vehicle">
    <svg viewBox="0 0 720 300" className="h-auto w-full">
      <rect x="70" y="150" width="120" height="100" rx="16" fill="#171C23" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
      <rect x="105" y="125" width="50" height="28" rx="6" fill="#DDE3EA" />
      <rect x="118" y="65" width="24" height="62" rx="7" fill="#8D98A6" />
      <path d="M130 35V82" stroke="#D9F8FF" strokeWidth="6" strokeLinecap="round" />
      <path d="M120 72l10 13 10-13" fill="none" stroke="#D9F8FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M190 218H490" stroke="#5ED3F3" strokeWidth="34" strokeLinecap="round" opacity=".24" />
      <rect x="490" y="115" width="160" height="135" rx="18" fill="#171C23" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
      <rect x="525" y="92" width="90" height="30" rx="7" fill="#DDE3EA" />
      <rect x="555" y="43" width="30" height="52" rx="7" fill="#8D98A6" />
      <g transform="translate(505 8)">
        <path d="M5 43h125l18 18H-8z" fill="#5ED3F3" opacity=".88" />
        <circle cx="24" cy="64" r="13" fill="#111418" stroke="#D9F8FF" strokeWidth="4" />
        <circle cx="116" cy="64" r="13" fill="#111418" stroke="#D9F8FF" strokeWidth="4" />
        <rect x="30" y="20" width="70" height="27" rx="9" fill="#D9F8FF" opacity=".95" />
      </g>
      <text x="130" y="282" textAnchor="middle" fill="#AAB4C0" fontSize="24" fontWeight="650">INPUT</text>
      <text x="570" y="282" textAnchor="middle" fill="#AAB4C0" fontSize="24" fontWeight="650">OUTPUT</text>
    </svg>
  </div>;
}

function HydraulicPressureDiagram() {
  return <div className="hydraulic-visual mt-7" role="img" aria-label="Equal pressure transmitted through fluid between two pistons">
    <svg viewBox="0 0 720 260" className="h-auto w-full">
      <rect x="70" y="70" width="120" height="145" rx="16" fill="#171C23" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
      <rect x="105" y="95" width="50" height="26" rx="6" fill="#DDE3EA" />
      <rect x="490" y="45" width="160" height="170" rx="18" fill="#171C23" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
      <rect x="525" y="82" width="90" height="34" rx="7" fill="#DDE3EA" />
      <path d="M190 175H490" stroke="#5ED3F3" strokeWidth="38" strokeLinecap="round" opacity=".25" />
      {[235,305,375,445].map((x) => <g key={x}><circle cx={x} cy="175" r="17" fill="#5ED3F3" opacity=".18"/><text x={x} y="181" textAnchor="middle" fill="#D9F8FF" fontSize="16" fontWeight="700">P</text></g>)}
      <text x="350" y="225" textAnchor="middle" fill="#D9F8FF" fontSize="25" fontWeight="700">SAME PRESSURE</text>
    </svg>
  </div>;
}

function HydraulicAreaForceDiagram() {
  return <div className="hydraulic-visual mt-7" role="img" aria-label="The same pressure acting on a larger piston area produces greater force">
    <svg viewBox="0 0 720 285" className="h-auto w-full">
      <defs><marker id="forceArrowV1" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#D9F8FF"/></marker></defs>
      <rect x="85" y="100" width="130" height="135" rx="16" fill="#171C23" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
      <rect x="118" y="125" width="64" height="27" rx="6" fill="#DDE3EA" />
      <rect x="475" y="70" width="175" height="165" rx="18" fill="#171C23" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
      <rect x="510" y="108" width="105" height="38" rx="7" fill="#DDE3EA" />
      <path d="M215 195H475" stroke="#5ED3F3" strokeWidth="38" strokeLinecap="round" opacity=".25" />
      <path d="M150 122V58" stroke="#D9F8FF" strokeWidth="5" markerEnd="url(#forceArrowV1)" />
      <path d="M563 105V30" stroke="#D9F8FF" strokeWidth="9" markerEnd="url(#forceArrowV1)" />
      <text x="150" y="274" textAnchor="middle" fill="#AAB4C0" fontSize="22" fontWeight="650">SMALLER FORCE</text>
      <text x="563" y="274" textAnchor="middle" fill="#D9F8FF" fontSize="22" fontWeight="700">GREATER FORCE</text>
      <text x="345" y="226" textAnchor="middle" fill="#5ED3F3" fontSize="22" fontWeight="700">SAME PRESSURE</text>
    </svg>
  </div>;
}

function HydraulicWorkedExampleDiagram() {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111418] px-3 py-5 sm:p-7">
      <div className="mb-4 px-2 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Worked example diagram</div>
      <svg viewBox="0 0 680 255" role="img" aria-label="A small input piston transmits the same pressure through fluid to a larger output piston, producing greater force" className="h-auto w-full">
        <defs>
          <marker id="arrowCyan" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5ED3F3" /></marker>
          <marker id="arrowSoft" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 10 5 L 0 10 z" fill="#D9F8FF" /></marker>
        </defs>
        <rect x="52" y="78" width="125" height="142" rx="15" fill="#171C23" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
        <rect x="80" y="108" width="69" height="30" rx="6" fill="#DDE3EA" />
        <rect x="99" y="37" width="31" height="73" rx="8" fill="#8D98A6" />
        <path d="M 114 20 L 114 69" stroke="#D9F8FF" strokeWidth="6" markerEnd="url(#arrowSoft)" />
        <path d="M 177 185 H 455" stroke="#5ED3F3" strokeWidth="38" strokeLinecap="round" opacity="0.25" />
        <path d="M 190 185 H 440" stroke="#5ED3F3" strokeWidth="6" strokeDasharray="13 12" markerEnd="url(#arrowCyan)" />
        <rect x="455" y="58" width="178" height="162" rx="18" fill="#171C23" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
        <rect x="489" y="100" width="110" height="43" rx="8" fill="#DDE3EA" />
        <rect x="521" y="27" width="48" height="75" rx="9" fill="#8D98A6" />
        <path d="M 545 96 L 545 37" stroke="#D9F8FF" strokeWidth="8" markerEnd="url(#arrowSoft)" />
        <text x="114" y="247" textAnchor="middle" fill="#D9F8FF" fontSize="22" fontWeight="700">INPUT</text>
        <text x="316" y="166" textAnchor="middle" fill="#D9F8FF" fontSize="21" fontWeight="700">SAME PRESSURE</text>
        <text x="545" y="247" textAnchor="middle" fill="#D9F8FF" fontSize="22" fontWeight="700">GREATER FORCE</text>
      </svg>
      <div className="mt-4 grid grid-cols-1 gap-2 px-2 text-base leading-relaxed text-[#C8D2DD] sm:grid-cols-2">
        <p><span className="font-semibold text-[#D9F8FF]">Small input piston:</span> a modest force creates pressure in the fluid.</p>
        <p><span className="font-semibold text-[#D9F8FF]">Large output piston:</span> the same pressure acts over a larger area, producing greater force.</p>
      </div>
      <p className="mt-4 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-base leading-relaxed text-[#D9F8FF]"><span className="font-semibold">Larger area → greater force.</span> The trade-off is that the larger piston usually moves a shorter distance.</p>
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
    if (miniCheck && !showFeedback) return;
    if (isFinalSection) { onComplete(); return; }
    const nextProgress = { ...progress, currentSectionIndex: Math.min(progress.currentSectionIndex + 1, gearFundamentalsModule.sections.length - 1), updatedAt: now() };
    setSelectedOptionId(null); setShowFeedback(false); persistProgress(nextProgress);
  }
  function goBack() {
    const nextProgress = { ...progress, currentSectionIndex: Math.max(progress.currentSectionIndex - 1, 0), updatedAt: now() };
    setSelectedOptionId(null); setShowFeedback(false); persistProgress(nextProgress);
  }

  return <Shell><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${((progress.currentSectionIndex + 1) / gearFundamentalsModule.sections.length) * 100}%` }} /></div><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Gear Fundamentals</p><h1 className="mt-3 text-4xl font-semibold">{gearFundamentalsModule.title}</h1><p className="mt-3 text-[#9AA3B2]">{gearFundamentalsModule.subtitle}</p></div><Badge>Section {progress.currentSectionIndex + 1} of {gearFundamentalsModule.sections.length}</Badge></div><Card><h2 className="text-3xl font-semibold">{section.title}</h2><p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-[#C8D2DD]">{section.body}</p>{section.sectionId === "gear-fund-003" && <GearTrainDiagram />}{section.sectionId === "gear-fund-004" && <GearSizeDiagram />}{section.keyPoint && <div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Key point</div><p className="mt-3 text-[#D9F8FF]">{section.keyPoint}</p></div>}{miniCheck && <div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Quick check</div><p className="mt-3 text-lg font-medium text-[#F4F6F8]">{miniCheck.stem}</p><div className="mt-5 grid gap-3">{miniCheck.options.map((option) => <button key={option.optionId} onClick={() => answerMiniCheck(option.optionId)} className={`rounded-xl border p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 bg-[#171C23] hover:border-white/20"}`}><span className="font-semibold text-[#D9F8FF]">{option.label}.</span> <span className="text-[#C8D2DD]">{option.text}</span></button>)}</div>{showFeedback && <div className={`mt-4 rounded-xl border p-4 ${selectedCorrect ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-medium">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 text-sm leading-relaxed text-[#C8D2DD]">{miniCheck.explanation}</p></div>}</div>}<div className="mt-9 flex flex-col gap-3 pb-4 sm:flex-row sm:justify-between sm:pb-0"><PrimaryButton className="sm:order-2" onClick={goNext}>{isFinalSection ? "Complete module" : "Continue"}</PrimaryButton><SecondaryButton className="sm:order-1" onClick={goBack}>Back</SecondaryButton></div></Card></section></Shell>;
}

function GearFundamentalsCompleteScreen({ journey, onWhy, onDashboard, onStartGuidedGearPractice }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGuidedGearPractice: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Learning action complete</p><h1 className="mt-6 text-4xl font-semibold leading-tight">Gear Fundamentals complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">Vivalsa has updated your preparation journey. The next planned step is to check whether these gear concepts transfer into guided practice.</p><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>{rec?.confidence === "high" ? "High confidence" : "Moderate confidence"}</Badge></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onStartGuidedGearPractice}>Begin gear practice</PrimaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}

function HydraulicFundamentalsScreen({ journey, onSaveJourney, onComplete }: { journey: MvpGuestJourney; onSaveJourney: (journey: MvpGuestJourney) => void; onComplete: () => void }) {
  const existingProgress = getCurrentHydraulicProgress(journey);
  const progress = existingProgress ?? { moduleProgressId: id("module-progress"), moduleId: "hydraulic_fundamentals" as const, currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const sectionTopRef = useRef<HTMLDivElement | null>(null);
  const section = hydraulicFundamentalsModule.sections[progress.currentSectionIndex];
  const miniCheck = section.miniCheck;
  const selectedCorrect = Boolean(miniCheck && selectedOptionId === miniCheck.correctOptionId);
  const isFinalSection = progress.currentSectionIndex === hydraulicFundamentalsModule.sections.length - 1;

  useEffect(() => {
    setSelectedOptionId(null);
    setShowFeedback(false);
    const frame = window.requestAnimationFrame(() => {
      sectionTopRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [progress.currentSectionIndex]);


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
    if (miniCheck && !showFeedback) return;
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

  return <Shell><section className="mx-auto max-w-5xl px-5 pb-24 pt-7 sm:px-8 sm:pb-12 sm:pt-12"><div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${((progress.currentSectionIndex + 1) / hydraulicFundamentalsModule.sections.length) * 100}%` }} /></div><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Hydraulic Pressure</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{hydraulicFundamentalsModule.title}</h1><p className="mt-2 text-sm text-[#9AA3B2] sm:text-base">{hydraulicFundamentalsModule.subtitle}</p></div><Badge>Section {progress.currentSectionIndex + 1} of {hydraulicFundamentalsModule.sections.length}</Badge></div><div ref={sectionTopRef} className="scroll-mt-4"><Card className="p-5 sm:p-8"><h2 className="text-2xl font-semibold sm:text-3xl">{section.title}</h2><p className="mt-5 whitespace-pre-line text-base leading-relaxed text-[#C8D2DD] sm:text-lg">{section.body}</p>{section.sectionId === "hyd-fund-001" && <HydraulicCuriosityDiagram />}{section.sectionId === "hyd-fund-002" && <HydraulicPressureDiagram />}{section.sectionId === "hyd-fund-003" && <HydraulicAreaForceDiagram />}{section.sectionId === "hyd-fund-005" && <HydraulicWorkedExampleDiagram />}{section.sectionId === "hyd-fund-006" && <HydraulicSolvingMethodDiagram />}{section.keyPoint && <div className="mt-7 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">{section.sectionId === "hyd-fund-008" ? "Pocket principle" : "Key idea"}</div><p className="mt-3 text-lg font-medium text-[#D9F8FF]">{section.keyPoint}</p></div>}{miniCheck && <div className="mt-7 rounded-2xl border border-white/5 bg-[#111418] p-5 sm:p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Quick check</div><p className="mt-3 text-lg font-medium text-[#F4F6F8]">{miniCheck.stem}</p><div className="mt-5 grid gap-3">{(showFeedback ? miniCheck.options.filter((option) => option.optionId === selectedOptionId) : miniCheck.options).map((option) => {
  const selected = selectedOptionId === option.optionId;
  return <button key={option.optionId} onClick={() => answerMiniCheck(option.optionId)} disabled={showFeedback} className={`rounded-xl border p-4 text-left transition ${selected ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 bg-[#171C23] hover:border-white/20"} ${showFeedback ? "cursor-default" : ""}`}><span className="font-semibold text-[#D9F8FF]">{option.label}.</span> <span className="text-[#C8D2DD]">{option.text}</span></button>;
})}</div>{showFeedback && <div className={`mt-5 rounded-xl border p-4 ${selectedCorrect ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-medium">{selectedCorrect ? "Exactly" : "Not quite"}</p><p className="mt-2 text-sm leading-relaxed text-[#C8D2DD]">{miniCheck.explanation}</p><div className="mt-4 sm:hidden"><PrimaryButton className="w-full" onClick={goNext}>{isFinalSection ? "Continue to practice" : "Continue"}</PrimaryButton></div></div>}</div>}</Card></div><div className={`mt-5 rounded-2xl border border-white/10 bg-[#111418] p-3 sm:mt-7 sm:block sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 ${miniCheck ? "hidden" : "block"}`}><div className="mx-auto flex max-w-5xl gap-3"><SecondaryButton className="flex-1 sm:flex-none" onClick={goBack}>Back</SecondaryButton><PrimaryButton className={`flex-1 sm:ml-auto sm:flex-none ${miniCheck && !showFeedback ? "cursor-not-allowed opacity-40" : ""}`} onClick={goNext} disabled={Boolean(miniCheck && !showFeedback)} aria-disabled={Boolean(miniCheck && !showFeedback)}>{isFinalSection ? "Continue to practice" : "Continue"}</PrimaryButton></div></div></section></Shell>;
}

function HydraulicFundamentalsCompleteScreen({ journey, onWhy, onDashboard, onStartGuidedPractice }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGuidedPractice: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Learning action complete</p><h1 className="mt-6 text-4xl font-semibold leading-tight">Hydraulic Pressure learning complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">Vivalsa has updated your preparation journey. The next step is to check whether these concepts transfer into practice.</p><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>{rec?.confidence === "high" ? "High confidence" : "Moderate confidence"}</Badge></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onStartGuidedPractice}>Begin practice</PrimaryButton><SecondaryButton onClick={onDashboard}>View dashboard</SecondaryButton></div></Card></section></Shell>;
}

function GuidedHydraulicPracticeIntroScreen({ onStart }: { onStart: () => void }) {
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Evidence check</p><h1 className="mt-5 text-4xl font-semibold">Guided Hydraulic Practice</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">Three coached questions will help you apply the same method: find what stays the same, compare the piston areas, then calculate.</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{["3 questions", "Immediate feedback", "No timer"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">The prompts will step back as soon as the method is clear.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Begin practice</PrimaryButton></div></Card></section></Shell>;
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
  return <Shell right="Guided practice"><section className="mx-auto max-w-5xl px-6 pb-40 pt-8 sm:px-8 sm:pt-10 lg:pb-10"><div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-5 flex items-end justify-between"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Guided Hydraulic Practice</p><h1 className="mt-3 text-3xl font-semibold">Hydraulic reasoning</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {guidedHydraulicPracticeQuestions.length}<br /><span className="text-xs">{answered} saved</span></div></div><Card className="p-5 sm:p-6"><p className="text-lg leading-relaxed text-[#F4F6F8] sm:text-xl">{question.stem}</p><div className="mt-5 grid gap-3">{question.options.map((option) => <button key={option.optionId} onClick={() => select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div>{showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-6 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}><div className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>{!selectedCorrect && question.feedbackCue && <p className="mt-3 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}</div><div className="shrink-0"><PrimaryButton onClick={next}>{questionIndex === guidedHydraulicPracticeQuestions.length - 1 ? "Complete practice" : "Next question"}</PrimaryButton></div></div></div>}</Card></section></Shell>;
}
function GuidedHydraulicPracticeDebriefScreen({ journey, onWhy, onNext, onDashboard }: { journey: MvpGuestJourney; onWhy: () => void; onNext: () => void; onDashboard: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Practice debrief</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title ?? "Guided practice complete"}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p><div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Comparison</div><p className="mt-3 text-[#C8D2DD]">{debrief?.comparison}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>Moderate confidence</Badge></div></div></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><PrimaryButton onClick={onNext}>{rec?.actionLabel ?? "Continue"}</PrimaryButton><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><SecondaryButton onClick={onDashboard}>View dashboard</SecondaryButton></div></Card></section></Shell>;
}

function HydraulicIndependentPracticeIntroScreen({ onStart }: { onStart: () => void }) {
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-6 py-12 sm:px-8 sm:py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Try it independently</p><h1 className="mt-5 text-4xl font-semibold">Independent Hydraulic Practice</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">Use the same method without prompts across five different hydraulic contexts. This is where Vivalsa checks whether the reasoning transfers.</p><div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3">{["5 questions", "Immediate feedback", "No guided prompts"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><div className="mt-9"><PrimaryButton onClick={onStart}>Begin independent practice</PrimaryButton></div></Card></section></Shell>;
}

function HydraulicIndependentPracticeQuestionScreen({ journey, sessionId, questionIndex, onAnswer }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { requestAnimationFrame(() => document.getElementById("hydraulic-independent-question")?.scrollIntoView({ behavior: "smooth", block: "start" })); setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = hydraulicIndependentPracticeQuestions[questionIndex];
  if (!question) return null;
  const selectedCorrect = selectedOptionId === question.correctOptionId;
  const progress = ((questionIndex + 1) / hydraulicIndependentPracticeQuestions.length) * 100;
  const answered = journey.responses.filter((response) => response.sessionId === sessionId).length;
  function select(optionId: string) { if (showFeedback) return; setSelectedOptionId(optionId); setShowFeedback(true); }
  function next() { if (!selectedOptionId) return; onAnswer(createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false), questionIndex === hydraulicIndependentPracticeQuestions.length - 1); }
  return <Shell right="Independent practice"><section className="mx-auto max-w-5xl px-6 pb-40 pt-8 sm:px-8 sm:pb-10 sm:pt-10"><div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Independent Hydraulic Practice</p><h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Hydraulic reasoning</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {hydraulicIndependentPracticeQuestions.length}<br/><span className="text-xs">{answered} saved</span></div></div><div id="hydraulic-independent-question" className="scroll-mt-4"><Card className="p-5 sm:p-6"><p className="text-lg leading-relaxed text-[#F4F6F8] sm:text-xl">{question.stem}</p><div className="mt-5 grid gap-3">{question.options.map((option) => <button key={option.optionId} onClick={() => select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div>{showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-6 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}><div className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p></div><div className="shrink-0"><PrimaryButton onClick={next}>{questionIndex === hydraulicIndependentPracticeQuestions.length - 1 ? "Complete practice" : "Next question"}</PrimaryButton></div></div></div>}</Card></div></section></Shell>;
}

function HydraulicIndependentPracticeDebriefScreen({ journey, onWhy, onContinue, onDashboard, onReviewIncorrect, onReviewAll }: { journey: MvpGuestJourney; onWhy: () => void; onContinue: () => void; onDashboard: () => void; onReviewIncorrect: () => void; onReviewAll: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const session = getLatestSessionOfType(journey, "hydraulic_independent_practice");
  const incorrectCount = session ? journey.responses.filter((response) => response.sessionId === session.sessionId && !response.correct).length : 0;
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-6 py-12 sm:px-8 sm:py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Session complete</p><h1 className="mt-5 text-4xl font-semibold">{debrief?.title ?? "Hydraulic Pressure complete"}</h1><p className="mt-5 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">You can now</div><ul className="mt-3 space-y-2 text-[#C8D2DD]"><li>✓ Identify what stays constant.</li><li>✓ Explain how piston area changes force.</li><li>✓ Apply the method in unfamiliar contexts.</li></ul></div><div className="rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Pocket principle</div><p className="mt-3 text-xl font-semibold text-[#D9F8FF]">Same pressure. Bigger area. Bigger force.</p></div></div><div className="mt-5 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">What we noticed</div><p className="mt-3 leading-relaxed text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="mt-5 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 leading-relaxed text-[#AAB4C0]">{rec?.summary}</p></div><AnswerReviewActions incorrectCount={incorrectCount} onReviewIncorrect={onReviewIncorrect} onReviewAll={onReviewAll} /><div className="mt-8 flex flex-col gap-3 sm:flex-row"><PrimaryButton onClick={onContinue}>Continue</PrimaryButton><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton><SecondaryButton onClick={onDashboard}>View dashboard</SecondaryButton></div></Card></section></Shell>;
}

function HydraulicTransferReflectionScreen({ onContinue }: { onContinue: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const correct = selected === "relationship";
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-5 py-10 sm:px-8 sm:py-16"><Card className="p-5 sm:p-8"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Before you continue</p><h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Imagine the next hydraulic question.</h1><p className="mt-5 text-lg leading-relaxed text-[#AAB4C0]">What is the most useful first thought?</p><div className="mt-7 grid gap-3">{[
    ["formula", "I should immediately search for a formula."],
    ["largest", "I should choose the largest piston."],
    ["relationship", "I should identify what stays the same and what changes."],
    ["force", "I should assume the force stays the same."],
  ].map(([idValue, label], index) => <button key={idValue} onClick={() => setSelected(idValue)} className={`rounded-2xl border p-4 text-left transition ${selected === idValue ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 bg-[#111418] hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{String.fromCharCode(65 + index)}</span><span className="text-[#DCE3EA]">{label}</span></button>)}</div>{selected && <div className={`mt-6 rounded-2xl border p-5 ${correct ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-semibold">{correct ? "Exactly" : "Look for the relationship first"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">Pressure stays the same through the ideal fluid. Piston area changes, so force changes.</p></div>}<div className="mt-7 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Pocket principle</div><p className="mt-3 text-xl font-semibold text-[#D9F8FF]">Same pressure. Bigger area. Bigger force.</p></div><div className="mt-8"><PrimaryButton onClick={onContinue}>Continue</PrimaryButton></div></Card></section></Shell>;
}

function SaveProgressScreen({ journey, onCreateAccount, onContinue }: { journey: MvpGuestJourney; onCreateAccount: (firstName: string, username: string) => void; onContinue: () => void }) {
  const [firstName, setFirstName] = useState(journey.prototypeAccount?.firstName ?? "");
  const [username, setUsername] = useState(journey.prototypeAccount?.username ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-6 py-12 sm:px-8 sm:py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Keep your progress</p><h1 className="mt-5 text-4xl font-semibold">Save your pathway.</h1><p className="mt-5 text-lg leading-relaxed text-[#9AA3B2]">Create a free account to keep your Vivalsa pathway together as the product develops.</p><div className="mt-5 inline-flex rounded-full border border-[#5ED3F3]/25 bg-[#5ED3F3]/10 px-4 py-2 text-sm font-medium text-[#D9F8FF]">No email address required.</div><div className="mt-8 grid gap-4"><label className="text-sm text-[#C8D2DD]">First name<input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#111418] px-4 py-3 text-[#F4F6F8] outline-none focus:border-[#5ED3F3]/50" /></label><label className="text-sm text-[#C8D2DD]">Username<input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#111418] px-4 py-3 text-[#F4F6F8] outline-none focus:border-[#5ED3F3]/50" /></label><label className="text-sm text-[#C8D2DD]">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#111418] px-4 py-3 text-[#F4F6F8] outline-none focus:border-[#5ED3F3]/50" /></label></div>{error && <p className="mt-4 text-sm text-[#FFB3B3]">Please complete all three fields.</p>}<p className="mt-5 text-xs leading-relaxed text-[#6E7A88]">Alpha note: this build is testing the account flow. Cross-device sync is not connected yet, and the password is not stored by this prototype.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><PrimaryButton onClick={() => { if (!firstName.trim() || !username.trim() || !password) { setError(true); return; } onCreateAccount(firstName.trim(), username.trim()); }}>Create account</PrimaryButton><SecondaryButton onClick={onContinue}>Continue without an account</SecondaryButton></div></Card></section></Shell>;
}

function MixedMechanicalPracticeIntroScreen({ onStart }: { onStart: () => void }) {
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Adaptive evidence check</p><h1 className="mt-5 text-4xl font-semibold">Mixed Mechanical Practice</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">This session mixes hydraulics, gears, pulleys and levers to check what should become your next preparation focus.</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{["20 questions", "Immediate feedback", "No topic labels"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">Vivalsa will silently track each mechanical topic and update your recommendation after the session.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Start mixed practice</PrimaryButton></div></Card></section></Shell>;
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
          {showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-7 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}>
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
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Evidence check</p><h1 className="mt-5 text-4xl font-semibold">Guided Gear Practice</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">This practice checks whether gear direction, idler and gear-size concepts are beginning to transfer into problem-solving.</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{["10 questions", "Immediate feedback", "Diagram-first reasoning"].map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">Vivalsa will use this result to decide whether to return to mixed mechanical practice or continue reinforcing gear reasoning.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Begin gear practice</PrimaryButton></div></Card></section></Shell>;
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
          {showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-7 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}>
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
          {showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-7 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}>
            <div className="mx-auto max-w-5xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p></div><div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === gearIndependentPracticeQuestions.length - 1 ? "Complete independent practice" : "Next question"}</PrimaryButton></div></div></div>
          </div>}
        </Card>
      </section>
    </Shell>
  );
}

function GearIndependentPracticeDebriefScreen({ journey, onWhy, onDashboard, onReviewIncorrect, onReviewAll }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onReviewIncorrect: () => void; onReviewAll: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const latestSession = getLatestSessionOfType(journey, "gear_independent_practice");
  const incorrectCount = latestSession ? journey.responses.filter((response) => response.sessionId === latestSession.sessionId && !response.correct).length : 0;
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === "gear_independent_practice");
  const labels: Record<string, string> = { direction: "Direction", speed: "Relative speed", ratios: "Ratios & integration" };
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Independent practice debrief</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title ?? "Independent Gear Practice complete"}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-3">{summary.conceptBreakdown.map((item) => <div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{labels[item.concept] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Practice result</div><p className="mt-3 text-[#C8D2DD]">{debrief?.comparison}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>Moderate confidence</Badge></div></div></div><AnswerReviewActions incorrectCount={incorrectCount} onReviewIncorrect={onReviewIncorrect} onReviewAll={onReviewAll} /><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
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
    "MMA-GEAR-001": { teeth: [20, 20, 20, 20], yOffsets: [24, -24, 24, -24], driverIndex: 0, driverDirection: "clockwise" },
    "MMA-GEAR-002": { teeth: [20, 20, 20], yOffsets: [-24, 24, -24], driverIndex: 1, driverDirection: "clockwise" },
    "MMA-GEAR-003": { teeth: [12, 36], yOffsets: [18, -18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "MMA-GEAR-004": { teeth: [40, 10], yOffsets: [-18, 18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "MMA-GEAR-005": { teeth: [20, 24, 60], yOffsets: [18, -24, 18], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
    "MMA-GEAR-006": { teeth: [15, 20, 20, 45], yOffsets: [24, -18, 18, -24], driverIndex: 0, driverDirection: "clockwise", showTeeth: true },
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

function GearQuestionDiagram({ question, mode, hideContextLabel = false }: { question: MvpQuestion; mode: GearDiagramMode; hideContextLabel?: boolean }) {
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
        {!hideContextLabel && <div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">{mode === "guided" ? "Guided diagram" : mode === "practice" ? "Practice diagram" : "Gear diagram"}</div>}
        {mode === "practice" && <div className="text-xs text-[#6E7A88]">No guided cues</div>}
        {mode === "assessment" && <div className={`text-xs text-[#6E7A88] ${hideContextLabel ? "ml-auto" : ""}`}>No hints</div>}
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

function GearAssessmentDebriefScreen({ journey, onWhy, onDashboard, onReviewIncorrect, onReviewAll }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onReviewIncorrect: () => void; onReviewAll: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === "gear_assessment");
  const labels: Record<string, string> = { direction: "Direction", speed: "Relative speed", ratios: "Ratios & integration" };
  const latestSession = getLatestSessionOfType(journey, "gear_assessment");
  const incorrectCount = latestSession ? journey.responses.filter((response) => response.sessionId === latestSession.sessionId && !response.correct).length : 0;

  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Gear Check debrief</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title ?? "Gear Check complete"}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-3">{summary.conceptBreakdown.map((item) => <div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{labels[item.concept] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Result</div><p className="mt-3 text-[#C8D2DD]">{debrief?.comparison}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p><div className="mt-5"><Badge>Moderate confidence</Badge></div></div></div><AnswerReviewActions incorrectCount={incorrectCount} onReviewIncorrect={onReviewIncorrect} onReviewAll={onReviewAll} /><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
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
  "MMA-PULL-001": 1, "MMA-PULL-002": 2, "MMA-PULL-003": 3, "MMA-PULL-004": 4, "MMA-PULL-005": 4, "MMA-PULL-006": 3,
};
function PulleyQuestionDiagram({ question, mode, hideContextLabel = false }: { question: MvpQuestion; mode: PulleyQuestionMode; hideContextLabel?: boolean }) {
  const count = pulleySupportCounts[question.questionId] ?? 2;
  const fixedOnly = count === 1;
  const helper = mode === "guided" ? question.feedbackCue : undefined;
  if (fixedOnly) return <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7">{!hideContextLabel && <div className="mb-4 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Pulley diagram</div>}<svg viewBox="0 0 760 330" role="img" aria-label="Single fixed pulley with a load on one side and a free end on the other" className="h-auto w-full"><line x1="170" y1="52" x2="590" y2="52" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round"/><circle cx="380" cy="100" r="48" fill="#171C23" stroke="rgba(255,255,255,0.28)" strokeWidth="5"/><path d="M 285 260 L 285 100 Q 285 52 333 52 L 427 52 Q 475 52 475 100 L 475 275" fill="none" stroke="#5ED3F3" strokeWidth="7" strokeLinecap="round"/><rect x="230" y="245" width="110" height="55" rx="12" fill="#252C35"/><text x="285" y="278" textAnchor="middle" fill="#F4F6F8" fontSize="20">Load</text><path d="M 475 210 L 475 285" stroke="#D9F8FF" strokeWidth="5"/><path d="M 460 268 L 475 292 L 490 268" fill="#D9F8FF"/><text x="525" y="265" fill="#AAB4C0" fontSize="18">Pull down</text></svg>{helper && <p className="mt-3 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">{helper}</p>}</div>;
  const xs = Array.from({ length: count }, (_, i) => 250 + (i * 260) / Math.max(count - 1, 1));
  return <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7">{!hideContextLabel && <div className="mb-4 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Pulley diagram</div>}<svg viewBox="0 0 760 350" role="img" aria-label={`Moving pulley block supported by ${count} rope sections`} className="h-auto w-full"><line x1="100" y1="55" x2="650" y2="55" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round"/>{xs.map((x,i)=><g key={x}><line x1={x} y1="70" x2={x} y2="220" stroke="#5ED3F3" strokeWidth="7" strokeLinecap="round"/>{mode === "guided" && <text x={x} y="135" textAnchor="middle" fill="#D9F8FF" fontSize="17">{i+1}</text>}</g>)}<rect x="205" y="215" width="350" height="62" rx="20" fill="#171C23" stroke="rgba(255,255,255,0.24)" strokeWidth="4"/><circle cx="300" cy="225" r="30" fill="#20262F" stroke="rgba(255,255,255,0.22)" strokeWidth="4"/><circle cx="460" cy="225" r="30" fill="#20262F" stroke="rgba(255,255,255,0.22)" strokeWidth="4"/><text x="380" y="256" textAnchor="middle" fill="#F4F6F8" fontSize="20" fontWeight="700">Moving block</text><rect x="300" y="280" width="160" height="48" rx="12" fill="#252C35"/><text x="380" y="311" textAnchor="middle" fill="#C8D2DD" fontSize="19">Load</text><line x1="600" y1="70" x2="600" y2="270" stroke="#8D98A6" strokeWidth="5" strokeDasharray="10 9"/><path d="M 586 252 L 600 276 L 614 252" fill="#8D98A6"/>{mode === "guided" && <text x="620" y="185" fill="#8D98A6" fontSize="16">Free end</text>}</svg>{helper && <p className="mt-3 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">{helper}</p>}</div>;
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
  return <Shell right={title}><section className={`mx-auto max-w-5xl px-8 pt-12 ${immediate ? "pb-44 lg:pb-12" : "pb-12"}`}><div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{title}</p><h1 className="mt-3 text-3xl font-semibold">Pulley reasoning</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {questions.length}<br/><span className="text-xs">{answered} saved</span></div></div><Card><PulleyQuestionDiagram question={question} mode={stage}/><p className="mt-7 text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p><div className="mt-8 grid gap-4">{question.options.map((option)=><button key={option.optionId} onClick={()=>select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div>{immediate && showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-7 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}><div className="mx-auto max-w-5xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>{!selectedCorrect && question.feedbackCue && <p className="mt-3 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}</div><div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === questions.length - 1 ? `Complete ${stage === "guided" ? "guided practice" : "independent practice"}` : "Next question"}</PrimaryButton></div></div></div></div>}{!immediate && <div className="mt-8 flex justify-end"><PrimaryButton disabled={!selectedOptionId} onClick={next}>{questionIndex === questions.length - 1 ? "Finish Pulley Check" : "Next question"}</PrimaryButton></div>}</Card></section></Shell>;
}

function PulleyDebriefScreen({ journey, stage, onWhy, onDashboard, onNext, onReviewIncorrect, onReviewAll }: { journey: MvpGuestJourney; stage: "guided" | "independent" | "assessment"; onWhy: () => void; onDashboard: () => void; onNext?: () => void; onReviewIncorrect?: () => void; onReviewAll?: () => void }) {
  const debrief = getLatestDebrief(journey); const rec = getCurrentRecommendation(journey);
  const sessionType = stage === "guided" ? "guided_pulley_practice" : stage === "independent" ? "pulley_independent_practice" : "pulley_assessment";
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === sessionType);
  const labels: Record<string,string> = { recognition: "System recognition", strand_count: "Supporting strands", force_distance: "Force & distance", mechanical_advantage: "Mechanical advantage" };
  const canUseNext = stage === "guided" ? rec?.recommendationType === "begin_pulley_independent_practice" : stage === "independent" ? rec?.recommendationType === "begin_pulley_assessment" : false;
  const reviewSession = stage === "independent" ? getLatestSessionOfType(journey, "pulley_independent_practice") : stage === "assessment" ? getLatestSessionOfType(journey, "pulley_assessment") : undefined;
  const incorrectCount = reviewSession ? journey.responses.filter((response) => response.sessionId === reviewSession.sessionId && !response.correct).length : 0;
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{stage === "assessment" ? "Pulley Check debrief" : "Pulley practice debrief"}</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-3">{summary.conceptBreakdown.map((item)=><div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{labels[item.concept] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p></div></div>{stage !== "guided" && onReviewIncorrect && onReviewAll && <AnswerReviewActions incorrectCount={incorrectCount} onReviewIncorrect={onReviewIncorrect} onReviewAll={onReviewAll} />}<div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton>{canUseNext && onNext && <PrimaryButton onClick={onNext}>{stage === "guided" ? "Start Independent Pulley Practice" : "Start Pulley Check"}</PrimaryButton>}<PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}


type LeverQuestionMode = "guided" | "independent" | "assessment";
type LeverDiagramSpec = { fulcrumX: number; loadX: number; effortX: number; loadLabel?: string; effortLabel?: string; helper?: string };

function getLeverDiagramSpec(questionId: string): LeverDiagramSpec {
  const secondClass = new Set(["LEV-GP-009", "LEV-IP-014", "LEV-IP-017", "LEV-AS-007"]);
  const thirdClass = new Set(["LEV-IP-015", "LEV-IP-018"]);
  const closeLoad = new Set(["LEV-GP-003", "LEV-GP-004", "LEV-IP-003", "LEV-IP-004", "LEV-IP-022", "LEV-AS-002", "LEV-AS-003", "MMA-LEV-002"]);
  if (questionId === "MMA-LEV-001") return { fulcrumX: 340, loadX: 280, effortX: 620, loadLabel: "0.5 m", effortLabel: "2 m" };
  if (questionId === "MMA-LEV-004") return { fulcrumX: 340, loadX: 250, effortX: 650, loadLabel: "1 m", effortLabel: "3 m" };
  if (questionId === "MMA-LEV-005") return { fulcrumX: 340, loadX: 260, effortX: 650, loadLabel: "1 m", effortLabel: "4 m" };
  if (questionId === "MMA-LEV-006") return { fulcrumX: 360, loadX: 260, effortX: 650, loadLabel: "0.75 m", effortLabel: "?" };
  if (secondClass.has(questionId)) return { fulcrumX: 140, loadX: 360, effortX: 650, helper: "Notice which part lies between the other two." };
  if (thirdClass.has(questionId)) return { fulcrumX: 140, effortX: 350, loadX: 650, helper: "Notice which part lies between the fulcrum and load." };
  if (closeLoad.has(questionId)) return { fulcrumX: 300, loadX: 220, effortX: 650, helper: "Compare the two distances from the fulcrum." };
  if (["LEV-GP-005", "LEV-IP-007", "LEV-AS-006", "MMA-LEV-005"].includes(questionId)) return { fulcrumX: 340, loadX: 250, effortX: 610, loadLabel: "1 m", effortLabel: "3 m", helper: "Compare force × distance on each side." };
  if (["LEV-GP-006", "LEV-IP-008", "LEV-AS-004", "MMA-LEV-001", "MMA-LEV-004"].includes(questionId)) return { fulcrumX: 340, loadX: 280, effortX: 620, loadLabel: "0.5 m", effortLabel: "2 m", helper: "Balance the turning effects." };
  if (["LEV-GP-010", "LEV-IP-009", "LEV-IP-025", "LEV-AS-005", "LEV-AS-010", "MMA-LEV-006"].includes(questionId)) return { fulcrumX: 360, loadX: 260, effortX: 650, helper: "Use force × distance about the fulcrum." };
  if (["LEV-IP-011"].includes(questionId)) return { fulcrumX: 380, loadX: 180, effortX: 650, loadLabel: "2 m", effortLabel: "?", helper: "Equal moments balance the seesaw." };
  if (["LEV-GP-002", "LEV-IP-002", "LEV-IP-020"].includes(questionId)) return { fulcrumX: 300, loadX: 190, effortX: 650, helper: "The farther effort point gives the greater turning effect." };
  return { fulcrumX: 360, loadX: 210, effortX: 630, helper: "Find the fulcrum, then compare the two arms." };
}

function LeverConceptDiagram() {
  return <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5"><svg viewBox="0 0 760 300" role="img" aria-label="Lever diagram showing load, fulcrum and effort" className="h-auto w-full"><defs><marker id="leverArrowConcept" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#5ED3F3" /></marker></defs><line x1="90" y1="150" x2="680" y2="150" stroke="#DDE3EA" strokeWidth="18" strokeLinecap="round"/><polygon points="360,158 315,238 405,238" fill="#5ED3F3" opacity="0.55"/><path d="M190 65 V130" stroke="#FFB86B" strokeWidth="5" markerEnd="url(#leverArrowConcept)"/><rect x="145" y="35" width="90" height="42" rx="8" fill="#212831" stroke="rgba(255,255,255,0.16)"/><text x="190" y="62" textAnchor="middle" fill="#F4F6F8" fontSize="18">Load</text><path d="M625 65 V130" stroke="#5ED3F3" strokeWidth="5" markerEnd="url(#leverArrowConcept)"/><text x="625" y="48" textAnchor="middle" fill="#D9F8FF" fontSize="18">Effort</text><text x="360" y="270" textAnchor="middle" fill="#D9F8FF" fontSize="18">Fulcrum</text></svg></div>;
}

function LeverFundamentalsScreen({ journey, onSaveJourney, onComplete }: { journey: MvpGuestJourney; onSaveJourney: (journey: MvpGuestJourney) => void; onComplete: () => void }) {
  const existingProgress = getCurrentLeverProgress(journey);
  const progress = existingProgress ?? { moduleProgressId: id("module-progress"), moduleId: "lever_fundamentals" as const, currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  const section = leverFundamentalsModule.sections[progress.currentSectionIndex]; const miniCheck = section.miniCheck;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null); const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setSelectedOptionId(null); setShowFeedback(false); }, [progress.currentSectionIndex]);
  const selectedCorrect = miniCheck ? selectedOptionId === miniCheck.correctOptionId : false;
  function answerMiniCheck(optionId: string) { if (!miniCheck || showFeedback) return; setSelectedOptionId(optionId); setShowFeedback(true); const response: ModuleMiniCheckResponse = { questionId: miniCheck.questionId, selectedOptionId: optionId, correct: optionId === miniCheck.correctOptionId, answeredAt: now() }; const nextProgress = { ...progress, miniCheckResponses: [...progress.miniCheckResponses.filter((item) => item.questionId !== miniCheck.questionId), response], updatedAt: now() }; onSaveJourney(existingProgress ? updateLeverProgress(journey, nextProgress) : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() }); }
  function goNext() { if (miniCheck && !showFeedback) return; if (progress.currentSectionIndex >= leverFundamentalsModule.sections.length - 1) { onComplete(); return; } const nextProgress = { ...progress, currentSectionIndex: progress.currentSectionIndex + 1, updatedAt: now() }; onSaveJourney(existingProgress ? updateLeverProgress(journey, nextProgress) : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() }); }
  function goBack() { if (progress.currentSectionIndex === 0) return; const nextProgress = { ...progress, currentSectionIndex: progress.currentSectionIndex - 1, updatedAt: now() }; onSaveJourney(updateLeverProgress(journey, nextProgress)); }
  return <Shell><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${((progress.currentSectionIndex + 1) / leverFundamentalsModule.sections.length) * 100}%` }} /></div><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Lever Fundamentals</p><h1 className="mt-3 text-4xl font-semibold">{leverFundamentalsModule.title}</h1><p className="mt-3 text-[#9AA3B2]">{leverFundamentalsModule.subtitle}</p></div><Badge>Section {progress.currentSectionIndex + 1} of {leverFundamentalsModule.sections.length}</Badge></div><Card><h2 className="text-3xl font-semibold">{section.title}</h2><p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-[#C8D2DD]">{section.body}</p>{["lever-fund-001","lever-fund-002","lever-fund-003"].includes(section.sectionId) && <LeverConceptDiagram />}{section.keyPoint && <div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Key point</div><p className="mt-3 text-[#D9F8FF]">{section.keyPoint}</p></div>}{miniCheck && <div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Quick check</div><p className="mt-3 text-lg font-medium text-[#F4F6F8]">{miniCheck.stem}</p><div className="mt-5 grid gap-3">{miniCheck.options.map((option) => <button key={option.optionId} onClick={() => answerMiniCheck(option.optionId)} className={`rounded-xl border p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 bg-[#171C23] hover:border-white/20"}`}><span className="font-semibold text-[#D9F8FF]">{option.label}.</span> <span className="text-[#C8D2DD]">{option.text}</span></button>)}</div>{showFeedback && <div className={`mt-5 rounded-xl border p-4 ${selectedCorrect ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-medium">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 text-sm leading-relaxed text-[#C8D2DD]">{miniCheck.explanation}</p></div>}</div>}<div className="mt-9 flex flex-col gap-3 pb-4 sm:flex-row sm:justify-between sm:pb-0"><PrimaryButton className="sm:order-2" onClick={goNext}>{progress.currentSectionIndex === leverFundamentalsModule.sections.length - 1 ? "Complete module" : "Continue"}</PrimaryButton><SecondaryButton className="sm:order-1" onClick={goBack}>Back</SecondaryButton></div></Card></section></Shell>;
}

function LeverFundamentalsCompleteScreen({ journey, onWhy, onDashboard, onStartGuidedLeverPractice }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGuidedLeverPractice: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Learning action complete</p><h1 className="mt-6 text-4xl font-semibold leading-tight">Lever Fundamentals complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">The next stage is guided diagram practice using the same fulcrum-and-arm method.</p><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onStartGuidedLeverPractice}>Begin lever practice</PrimaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}

function LeverQuestionDiagram({ question, mode }: { question: MvpQuestion; mode: LeverQuestionMode }) {
  const spec = getLeverDiagramSpec(question.questionId); const guided = mode === "guided"; const arrowId = `lever-arrow-${question.questionId}`;
  return <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-4 sm:p-6"><svg viewBox="0 0 760 300" role="img" aria-label="Lever reasoning diagram" className="h-auto w-full"><defs><marker id={arrowId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#5ED3F3" /></marker></defs><line x1="80" y1="150" x2="690" y2="150" stroke="#DDE3EA" strokeWidth="16" strokeLinecap="round"/><polygon points={`${spec.fulcrumX},158 ${spec.fulcrumX-42},235 ${spec.fulcrumX+42},235`} fill="#5ED3F3" opacity="0.52"/><rect x={spec.loadX-34} y="76" width="68" height="48" rx="8" fill="#2A313A" stroke="rgba(255,255,255,0.18)"/><path d={`M ${spec.loadX} 42 V 126`} stroke="#FFB86B" strokeWidth="5" markerEnd={`url(#${arrowId})`}/><path d={`M ${spec.effortX} 42 V 126`} stroke="#5ED3F3" strokeWidth="5" markerEnd={`url(#${arrowId})`}/><text x={spec.loadX} y="104" textAnchor="middle" fill="#F4F6F8" fontSize="17">Load</text><text x={spec.effortX} y="30" textAnchor="middle" fill="#D9F8FF" fontSize="17">Effort</text>{spec.loadLabel && <text x={(spec.loadX + spec.fulcrumX)/2} y="190" textAnchor="middle" fill="#8D98A6" fontSize="16">{spec.loadLabel}</text>}{spec.effortLabel && <text x={(spec.effortX + spec.fulcrumX)/2} y="190" textAnchor="middle" fill="#8D98A6" fontSize="16">{spec.effortLabel}</text>}<text x={spec.fulcrumX} y="268" textAnchor="middle" fill="#6E7A88" fontSize="15">pivot</text></svg>{guided && spec.helper && <p className="mt-4 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-4 text-sm leading-relaxed text-[#D9F8FF]">{spec.helper}</p>}</div>;
}

function LeverPracticeIntroScreen({ stage, onStart }: { stage: "guided" | "independent" | "assessment"; onStart: () => void }) {
  const config = stage === "guided" ? { eyebrow: "Guided practice", title: "Guided Lever Practice", body: "Ten diagram-based questions with immediate feedback. The diagrams help you apply the fulcrum-and-arm method.", items: ["10 questions", "Immediate feedback", "Guided diagrams"], button: "Begin guided practice" } : stage === "independent" ? { eyebrow: "Independent practice", title: "Independent Lever Practice", body: "Twenty-five less-supported questions covering setup recognition, mechanical advantage, moments and force-distance tradeoffs.", items: ["25 questions", "Immediate feedback", "Less support"], button: "Begin independent practice" } : { eyebrow: "Assessment-style check", title: "Lever Check", body: "Ten questions with no immediate feedback. This gives a cleaner picture of what remains available independently.", items: ["10 questions", "No immediate feedback", "Untimed"], button: "Start Lever Check" };
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{config.eyebrow}</p><h1 className="mt-5 text-4xl font-semibold">{config.title}</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">{config.body}</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{config.items.map((item)=><div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><div className="mt-10"><PrimaryButton onClick={onStart}>{config.button}</PrimaryButton></div></Card></section></Shell>;
}

function LeverPracticeQuestionScreen({ journey, sessionId, questionIndex, onAnswer, questions, stage }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void; questions: MvpQuestion[]; stage: LeverQuestionMode }) {
  const [startedAt, setStartedAt] = useState(Date.now()); const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null); const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = questions[questionIndex]; if (!question) return null; const progress = ((questionIndex + 1) / questions.length) * 100; const answered = journey.responses.filter((r) => r.sessionId === sessionId).length; const immediate = stage !== "assessment"; const selectedCorrect = selectedOptionId === question.correctOptionId;
  function select(optionId: string) { if (immediate && showFeedback) return; setSelectedOptionId(optionId); if (immediate) setShowFeedback(true); }
  function next() { if (!selectedOptionId) return; const response = createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false); onAnswer(response, questionIndex === questions.length - 1); }
  const title = stage === "guided" ? "Guided Lever Practice" : stage === "independent" ? "Independent Lever Practice" : "Lever Check";
  return <Shell right={title}><section className={`mx-auto max-w-5xl px-8 pt-12 ${immediate ? "pb-44 lg:pb-12" : "pb-12"}`}><div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{title}</p><h1 className="mt-3 text-3xl font-semibold">Lever reasoning</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {questions.length}<br/><span className="text-xs">{answered} saved</span></div></div><Card><LeverQuestionDiagram question={question} mode={stage}/><p className="mt-7 text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p><div className="mt-8 grid gap-4">{question.options.map((option)=><button key={option.optionId} onClick={()=>select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div>{immediate && showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-7 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}><div className="mx-auto max-w-5xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>{!selectedCorrect && question.feedbackCue && <p className="mt-3 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}</div><div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === questions.length - 1 ? `Complete ${stage === "guided" ? "guided practice" : "independent practice"}` : "Next question"}</PrimaryButton></div></div></div></div>}{!immediate && <div className="mt-8 flex justify-end"><PrimaryButton disabled={!selectedOptionId} onClick={next}>{questionIndex === questions.length - 1 ? "Finish Lever Check" : "Next question"}</PrimaryButton></div>}</Card></section></Shell>;
}

function LeverDebriefScreen({ journey, stage, onWhy, onDashboard, onNext, onReviewIncorrect, onReviewAll }: { journey: MvpGuestJourney; stage: "guided" | "independent" | "assessment"; onWhy: () => void; onDashboard: () => void; onNext?: () => void; onReviewIncorrect?: () => void; onReviewAll?: () => void }) {
  const debrief = getLatestDebrief(journey); const rec = getCurrentRecommendation(journey);
  const sessionType = stage === "guided" ? "guided_lever_practice" : stage === "independent" ? "lever_independent_practice" : "lever_assessment";
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === sessionType);
  const labels: Record<string,string> = { recognition: "Setup recognition", mechanical_advantage: "Mechanical advantage", balance_force: "Balance & force" };
  const canUseNext = stage === "guided" ? rec?.recommendationType === "begin_lever_independent_practice" : stage === "independent" ? rec?.recommendationType === "begin_lever_assessment" : false;
  const reviewSession = stage === "independent" ? getLatestSessionOfType(journey, "lever_independent_practice") : stage === "assessment" ? getLatestSessionOfType(journey, "lever_assessment") : undefined;
  const incorrectCount = reviewSession ? journey.responses.filter((response) => response.sessionId === reviewSession.sessionId && !response.correct).length : 0;
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{stage === "assessment" ? "Lever Check debrief" : "Lever practice debrief"}</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-3">{summary.conceptBreakdown.map((item)=><div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{labels[item.concept] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p></div></div>{stage !== "guided" && onReviewIncorrect && onReviewAll && <AnswerReviewActions incorrectCount={incorrectCount} onReviewIncorrect={onReviewIncorrect} onReviewAll={onReviewAll} />}<div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton>{canUseNext && onNext && <PrimaryButton onClick={onNext}>{stage === "guided" ? "Start Independent Lever Practice" : "Start Lever Check"}</PrimaryButton>}<PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}



function NumericalFundamentalsScreen({ journey, onSaveJourney, onComplete }: { journey: MvpGuestJourney; onSaveJourney: (journey: MvpGuestJourney) => void; onComplete: () => void }) {
  const existingProgress = getCurrentNumericalProgress(journey);
  const progress = existingProgress ?? { moduleProgressId: id("module-progress"), moduleId: "numerical_fundamentals" as const, currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  const section = numericalFundamentalsModule.sections[progress.currentSectionIndex];
  const miniCheck = section.miniCheck;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setSelectedOptionId(null); setShowFeedback(false); }, [progress.currentSectionIndex]);
  const selectedCorrect = miniCheck ? selectedOptionId === miniCheck.correctOptionId : false;
  function answerMiniCheck(optionId: string) {
    if (!miniCheck || showFeedback) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);
    const response: ModuleMiniCheckResponse = { questionId: miniCheck.questionId, selectedOptionId: optionId, correct: optionId === miniCheck.correctOptionId, answeredAt: now() };
    const nextProgress = { ...progress, miniCheckResponses: [...progress.miniCheckResponses.filter((item) => item.questionId !== miniCheck.questionId), response], updatedAt: now() };
    onSaveJourney(existingProgress ? updateNumericalProgress(journey, nextProgress) : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() });
  }
  function goNext() {
    if (miniCheck && !showFeedback) return;
    if (progress.currentSectionIndex >= numericalFundamentalsModule.sections.length - 1) { onComplete(); return; }
    const nextProgress = { ...progress, currentSectionIndex: progress.currentSectionIndex + 1, updatedAt: now() };
    onSaveJourney(existingProgress ? updateNumericalProgress(journey, nextProgress) : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() });
  }
  function goBack() {
    if (progress.currentSectionIndex === 0) return;
    const nextProgress = { ...progress, currentSectionIndex: progress.currentSectionIndex - 1, updatedAt: now() };
    onSaveJourney(updateNumericalProgress(journey, nextProgress));
  }
  return <Shell><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${((progress.currentSectionIndex + 1) / numericalFundamentalsModule.sections.length) * 100}%` }} /></div><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Numerical reasoning</p><h1 className="mt-3 text-4xl font-semibold">{numericalFundamentalsModule.title}</h1><p className="mt-3 text-[#9AA3B2]">{numericalFundamentalsModule.subtitle}</p></div><Badge>Section {progress.currentSectionIndex + 1} of {numericalFundamentalsModule.sections.length}</Badge></div><Card><h2 className="text-3xl font-semibold">{section.title}</h2><p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-[#C8D2DD]">{section.body}</p>{section.keyPoint && <div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Key point</div><p className="mt-3 text-[#D9F8FF]">{section.keyPoint}</p></div>}{miniCheck && <div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Quick check</div><p className="mt-3 text-lg font-medium text-[#F4F6F8]">{miniCheck.stem}</p><div className="mt-5 grid gap-3">{miniCheck.options.map((option) => <button key={option.optionId} onClick={() => answerMiniCheck(option.optionId)} className={`rounded-xl border p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 bg-[#171C23] hover:border-white/20"}`}><span className="font-semibold text-[#D9F8FF]">{option.label}.</span> <span className="text-[#C8D2DD]">{option.text}</span></button>)}</div>{showFeedback && <div className={`mt-5 rounded-xl border p-4 ${selectedCorrect ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-medium">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 text-sm leading-relaxed text-[#C8D2DD]">{miniCheck.explanation}</p></div>}</div>}<div className="mt-9 flex flex-col gap-3 pb-4 sm:flex-row sm:justify-between sm:pb-0"><PrimaryButton className="sm:order-2" onClick={goNext}>{progress.currentSectionIndex === numericalFundamentalsModule.sections.length - 1 ? "Complete module" : "Continue"}</PrimaryButton><SecondaryButton className="sm:order-1" onClick={goBack}>Back</SecondaryButton></div></Card></section></Shell>;
}

function NumericalFundamentalsCompleteScreen({ journey, onWhy, onDashboard, onStartGuided }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGuided: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Learning action complete</p><h1 className="mt-6 text-4xl font-semibold leading-tight">Numerical Reasoning Fundamentals complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">The next stage applies the same methods with immediate feedback.</p><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onStartGuided}>Begin guided practice</PrimaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}

type NumericalStage = "guided" | "independent" | "assessment";

function NumericalPracticeIntroScreen({ stage, onStart }: { stage: NumericalStage; onStart: () => void }) {
  const config = stage === "guided"
    ? { eyebrow: "Learning through application", title: "Guided Numerical Practice", description: "Ten questions across arithmetic, percentages, ratios, rates and data. Immediate feedback helps you correct the method as you work.", items: ["10 questions", "Immediate feedback", "Four numerical areas"], action: "Begin guided practice" }
    : stage === "independent"
      ? { eyebrow: "Less-supported practice", title: "Independent Numerical Practice", description: "A larger question set with varied numerical problems. You still receive feedback after each answer, but the method is yours to choose.", items: ["25 questions", "Immediate feedback", "Mixed numerical methods"], action: "Start independent practice" }
      : { eyebrow: "Assessment-style check", title: "Numerical Check", description: "Twelve mixed questions with no immediate answer feedback. The Mentor will use the result to identify either a clear area to strengthen or a progression step.", items: ["12 questions", "No immediate feedback", "Untimed in v1"], action: "Start Numerical Check" };
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{config.eyebrow}</p><h1 className="mt-5 text-4xl font-semibold">{config.title}</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">{config.description}</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{config.items.map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">Use mental or written working. The alpha build does not include a calculator.</p><div className="mt-10"><PrimaryButton onClick={onStart}>{config.action}</PrimaryButton></div></Card></section></Shell>;
}

function NumericalDataTableView({ table }: { table?: NumericalDataTable }) {
  if (!table) return null;
  return <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0E1115]"><table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm"><thead><tr>{table.headers.map((header) => <th key={header} className="break-words border-b border-white/10 px-2 py-2 text-[10px] uppercase leading-tight tracking-[0.08em] text-[#6E7A88] sm:px-3 sm:py-3 sm:text-xs sm:tracking-[0.12em]">{header}</th>)}</tr></thead><tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-white/5 last:border-0">{row.map((cell, cellIndex) => <td key={cellIndex} className="break-words px-2 py-2 leading-tight text-[#DCE3EA] sm:px-3 sm:py-3 sm:leading-normal">{cell}</td>)}</tr>)}</tbody></table></div>;
}

function NumericalPracticeQuestionScreen({ journey, sessionId, questionIndex, onAnswer, questions, stage }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void; questions: MvpQuestion[]; stage: NumericalStage }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = questions[questionIndex];
  if (!question) return null;
  const progress = ((questionIndex + 1) / questions.length) * 100;
  const answered = journey.responses.filter((response) => response.sessionId === sessionId).length;
  const selectedCorrect = selectedOptionId === question.correctOptionId;
  const title = stage === "guided" ? "Guided Numerical Practice" : stage === "independent" ? "Independent Numerical Practice" : "Numerical Check";
  function select(optionId: string) {
    if (showFeedback && stage !== "assessment") return;
    setSelectedOptionId(optionId);
    if (stage !== "assessment") setShowFeedback(true);
  }
  function next() {
    if (!selectedOptionId) return;
    onAnswer(createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false), questionIndex === questions.length - 1);
  }
  return <Shell right={title}><section className={`mx-auto max-w-5xl px-8 pt-12 ${stage === "assessment" ? "pb-12" : "pb-44 lg:pb-12"}`}><div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{title}</p><h1 className="mt-3 text-3xl font-semibold">Numerical reasoning</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {questions.length}<br/><span className="text-xs">{answered} saved</span></div></div><Card><NumericalDataTableView table={question.dataTable}/>{stage === "guided" && question.feedbackCue && <div className="mb-6 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/8 p-4 text-sm leading-relaxed text-[#D9F8FF]">{question.feedbackCue}</div>}<p className="text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p><div className="mt-8 grid gap-4">{question.options.map((option) => <button key={option.optionId} onClick={() => select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div>{stage === "assessment" ? <div className="mt-8 flex justify-end"><PrimaryButton disabled={!selectedOptionId} onClick={next}>{questionIndex === questions.length - 1 ? "Finish check" : "Next question"}</PrimaryButton></div> : showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-7 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}><div className="mx-auto max-w-5xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>{!selectedCorrect && question.feedbackCue && <p className="mt-3 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}</div><div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === questions.length - 1 ? "Complete practice" : "Next question"}</PrimaryButton></div></div></div></div>}</Card></section></Shell>;
}

function NumericalDebriefScreen({ journey, stage, onWhy, onDashboard, onNext, onReviewIncorrect, onReviewAll }: { journey: MvpGuestJourney; stage: NumericalStage; onWhy: () => void; onDashboard: () => void; onNext?: () => void; onReviewIncorrect?: () => void; onReviewAll?: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const sessionType: PracticeSummary["sessionType"] = stage === "guided" ? "guided_numerical_practice" : stage === "independent" ? "numerical_independent_practice" : "numerical_assessment";
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === sessionType);
  const canUseNext = stage === "guided" ? rec?.recommendationType === "begin_numerical_independent_practice" : stage === "independent" ? rec?.recommendationType === "begin_numerical_assessment" : false;
  const reviewSession = stage === "independent" ? getLatestSessionOfType(journey, "numerical_independent_practice") : stage === "assessment" ? getLatestSessionOfType(journey, "numerical_assessment") : undefined;
  const incorrectCount = reviewSession ? journey.responses.filter((response) => response.sessionId === reviewSession.sessionId && !response.correct).length : 0;
  const isProgression = stage === "assessment" && rec?.recommendationType === "start_abstract_logical_fundamentals";
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-5xl items-center px-8 py-16"><Card><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{stage === "assessment" ? "Numerical Check debrief" : "Numerical practice debrief"}</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p></div>{stage === "assessment" && <Badge>{isProgression ? "Progression recommendation" : "Strengthening recommendation"}</Badge>}</div>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{summary.conceptBreakdown.map((item) => <div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{numericalCategoryLabels[item.concept as NumericalSubcompetency] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 leading-relaxed text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Mentor recommendation</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 leading-relaxed text-[#AAB4C0]">{rec?.summary}</p></div></div>{stage !== "guided" && onReviewIncorrect && onReviewAll && <AnswerReviewActions incorrectCount={incorrectCount} onReviewIncorrect={onReviewIncorrect} onReviewAll={onReviewAll} />}<div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton>{canUseNext && onNext && <PrimaryButton onClick={onNext}>{stage === "guided" ? "Start Independent Numerical Practice" : "Start Numerical Check"}</PrimaryButton>}<PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}


function AbstractLogicalFundamentalsScreen({ journey, onSaveJourney, onComplete }: { journey: MvpGuestJourney; onSaveJourney: (journey: MvpGuestJourney) => void; onComplete: () => void }) {
  const existingProgress = getCurrentAbstractLogicalProgress(journey);
  const progress = existingProgress ?? { moduleProgressId: id("module-progress"), moduleId: "abstract_logical_fundamentals" as const, currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  const section = abstractLogicalFundamentalsModule.sections[progress.currentSectionIndex];
  const miniCheck = section.miniCheck;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setSelectedOptionId(null); setShowFeedback(false); }, [progress.currentSectionIndex]);
  const selectedCorrect = miniCheck ? selectedOptionId === miniCheck.correctOptionId : false;
  function answerMiniCheck(optionId: string) {
    if (!miniCheck || showFeedback) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);
    const response: ModuleMiniCheckResponse = { questionId: miniCheck.questionId, selectedOptionId: optionId, correct: optionId === miniCheck.correctOptionId, answeredAt: now() };
    const nextProgress = { ...progress, miniCheckResponses: [...progress.miniCheckResponses.filter((item) => item.questionId !== miniCheck.questionId), response], updatedAt: now() };
    onSaveJourney(existingProgress ? updateAbstractLogicalProgress(journey, nextProgress) : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() });
  }
  function goNext() {
    if (miniCheck && !showFeedback) return;
    if (progress.currentSectionIndex >= abstractLogicalFundamentalsModule.sections.length - 1) { onComplete(); return; }
    const nextProgress = { ...progress, currentSectionIndex: progress.currentSectionIndex + 1, updatedAt: now() };
    onSaveJourney(existingProgress ? updateAbstractLogicalProgress(journey, nextProgress) : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() });
  }
  function goBack() {
    if (progress.currentSectionIndex === 0) return;
    const nextProgress = { ...progress, currentSectionIndex: progress.currentSectionIndex - 1, updatedAt: now() };
    onSaveJourney(updateAbstractLogicalProgress(journey, nextProgress));
  }
  return <Shell><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${((progress.currentSectionIndex + 1) / abstractLogicalFundamentalsModule.sections.length) * 100}%` }} /></div><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Abstract & Logical Fundamentals</p><h1 className="mt-3 text-4xl font-semibold">{abstractLogicalFundamentalsModule.title}</h1><p className="mt-3 text-[#9AA3B2]">{abstractLogicalFundamentalsModule.subtitle}</p></div><Badge>Section {progress.currentSectionIndex + 1} of {abstractLogicalFundamentalsModule.sections.length}</Badge></div><Card><h2 className="text-3xl font-semibold">{section.title}</h2><p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-[#C8D2DD]">{section.body}</p>{section.keyPoint && <div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Key point</div><p className="mt-3 text-[#D9F8FF]">{section.keyPoint}</p></div>}{miniCheck && <div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Quick check</div><p className="mt-3 text-lg font-medium text-[#F4F6F8]">{miniCheck.stem}</p><div className="mt-5 grid gap-3">{miniCheck.options.map((option) => <button key={option.optionId} onClick={() => answerMiniCheck(option.optionId)} className={`rounded-xl border p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 bg-[#171C23] hover:border-white/20"}`}><span className="font-semibold text-[#D9F8FF]">{option.label}.</span> <span className="text-[#C8D2DD]">{option.text}</span></button>)}</div>{showFeedback && <div className={`mt-5 rounded-xl border p-4 ${selectedCorrect ? "border-[#38D39F]/40 bg-[#38D39F]/10" : "border-[#FFB86B]/40 bg-[#FFB86B]/10"}`}><p className="font-medium">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 text-sm leading-relaxed text-[#C8D2DD]">{miniCheck.explanation}</p></div>}</div>}<div className="mt-9 flex flex-col gap-3 pb-4 sm:flex-row sm:justify-between sm:pb-0"><PrimaryButton className="sm:order-2" onClick={goNext}>{progress.currentSectionIndex === abstractLogicalFundamentalsModule.sections.length - 1 ? "Complete module" : "Continue"}</PrimaryButton><SecondaryButton className="sm:order-1" onClick={goBack}>Back</SecondaryButton></div></Card></section></Shell>;
}

function AbstractLogicalFundamentalsCompleteScreen({ journey, onWhy, onDashboard, onStartGuided }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGuided: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Learning action complete</p><h1 className="mt-6 text-4xl font-semibold leading-tight">Abstract & Logical Fundamentals complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">The next stage is guided rule-finding practice with immediate feedback.</p><div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this next step?</SecondaryButton><PrimaryButton onClick={onStartGuided}>Begin guided practice</PrimaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}

type AbstractLogicalStage = "guided" | "independent" | "assessment";

function AbstractLogicalVisualPanel({ visual }: { visual: AbstractVisual }) {
  const maxColumns = Math.max(...visual.rows.map((row) => row.length));
  const isMatrix = visual.kind === "matrix";
  return <div className="mb-7 overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7">{visual.caption && <div className="mb-4 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">{visual.caption}</div>}<div className="mx-auto grid max-w-3xl gap-3" style={{ gridTemplateColumns: `repeat(${maxColumns}, minmax(0, 1fr))` }}>{visual.rows.flatMap((row, rowIndex) => Array.from({ length: maxColumns }, (_, colIndex) => { const cell = row[colIndex] ?? ""; const isMissing = cell === "?"; const isSpacer = cell.trim() === ""; return <div key={`${rowIndex}-${colIndex}`} className={`${isMatrix ? "aspect-square" : "min-h-20"} flex items-center justify-center rounded-2xl border text-center font-semibold ${isSpacer ? "border-transparent bg-transparent" : isMissing ? "border-[#5ED3F3]/45 bg-[#5ED3F3]/10 text-[#D9F8FF]" : "border-white/10 bg-[#171C23] text-[#F4F6F8]"}`}><span className="whitespace-pre text-2xl sm:text-3xl">{cell}</span></div>; }))}</div></div>;
}

function AbstractLogicalPracticeIntroScreen({ stage, onStart }: { stage: AbstractLogicalStage; onStart: () => void }) {
  const config = stage === "guided"
    ? { eyebrow: "Guided learning", title: "Guided Abstract & Logical Practice", body: "Ten questions across patterns, matrices, classification and deduction. You will receive immediate feedback and a short cue about what to notice.", items: ["10 questions", "Immediate feedback", "Rule-finding cues"], button: "Start guided practice" }
    : stage === "independent"
      ? { eyebrow: "Less-supported practice", title: "Independent Abstract & Logical Practice", body: "A larger question set with broader variation. Feedback comes after each answer, but the method is no longer signposted.", items: ["25 questions", "Immediate feedback", "Less support"], button: "Start independent practice" }
      : { eyebrow: "Assessment-style check", title: "Abstract & Logical Check", body: "Twelve mixed questions with no immediate answer feedback. The Mentor will identify either a clear area to strengthen or a progression step.", items: ["12 questions", "No immediate feedback", "Untimed in v1"], button: "Start Abstract & Logical Check" };
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{config.eyebrow}</p><h1 className="mt-5 text-4xl font-semibold">{config.title}</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">{config.body}</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{config.items.map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><div className="mt-10"><PrimaryButton onClick={onStart}>{config.button}</PrimaryButton></div></Card></section></Shell>;
}

function AbstractLogicalPracticeQuestionScreen({ journey, sessionId, questionIndex, onAnswer, questions, stage }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void; questions: MvpQuestion[]; stage: AbstractLogicalStage }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = questions[questionIndex]; if (!question) return null;
  const progress = ((questionIndex + 1) / questions.length) * 100;
  const answered = journey.responses.filter((r) => r.sessionId === sessionId).length;
  const selectedCorrect = selectedOptionId === question.correctOptionId;
  function select(optionId: string) { if (stage !== "assessment" && showFeedback) return; setSelectedOptionId(optionId); if (stage !== "assessment") setShowFeedback(true); }
  function next() { if (!selectedOptionId) return; const response = createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false); onAnswer(response, questionIndex === questions.length - 1); }
  const title = stage === "guided" ? "Guided Abstract & Logical Practice" : stage === "independent" ? "Independent Abstract & Logical Practice" : "Abstract & Logical Check";
  return <Shell right={title}><section className={`mx-auto max-w-5xl px-8 pt-12 ${stage === "assessment" ? "pb-12" : "pb-44 lg:pb-12"}`}><div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{title}</p><h1 className="mt-3 text-3xl font-semibold">Find the rule</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {questions.length}<br /><span className="text-xs">{answered} saved</span></div></div><Card>{question.abstractVisual && <AbstractLogicalVisualPanel visual={question.abstractVisual} />}{stage === "guided" && question.feedbackCue && <div className="mb-6 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/8 p-4 text-sm leading-relaxed text-[#D9F8FF]">{question.feedbackCue}</div>}<p className="text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p><div className="mt-8 grid gap-4">{question.options.map((option) => <button key={option.optionId} onClick={() => select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-lg text-[#DCE3EA]">{option.text}</span></button>)}</div>{stage === "assessment" ? <div className="mt-8 flex justify-end"><PrimaryButton disabled={!selectedOptionId} onClick={next}>{questionIndex === questions.length - 1 ? "Finish check" : "Next question"}</PrimaryButton></div> : showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-7 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}><div className="mx-auto max-w-5xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>{!selectedCorrect && question.feedbackCue && <p className="mt-3 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}</div><div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === questions.length - 1 ? "Complete practice" : "Next question"}</PrimaryButton></div></div></div></div>}</Card></section></Shell>;
}

function AbstractLogicalDebriefScreen({ journey, stage, onWhy, onDashboard, onNext, onReviewIncorrect, onReviewAll }: { journey: MvpGuestJourney; stage: AbstractLogicalStage; onWhy: () => void; onDashboard: () => void; onNext?: () => void; onReviewIncorrect?: () => void; onReviewAll?: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const sessionType: PracticeSummary["sessionType"] = stage === "guided" ? "guided_abstract_logical_practice" : stage === "independent" ? "abstract_logical_independent_practice" : "abstract_logical_assessment";
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === sessionType);
  const canUseNext = stage === "guided" ? rec?.recommendationType === "begin_abstract_logical_independent_practice" : stage === "independent" ? rec?.recommendationType === "begin_abstract_logical_assessment" : false;
  const reviewSession = stage === "independent" ? getLatestSessionOfType(journey, "abstract_logical_independent_practice") : stage === "assessment" ? getLatestSessionOfType(journey, "abstract_logical_assessment") : undefined;
  const incorrectCount = reviewSession ? journey.responses.filter((response) => response.sessionId === reviewSession.sessionId && !response.correct).length : 0;
  const isProgression = stage === "assessment" && rec?.recommendationType === "start_verbal_fundamentals";
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-5xl items-center px-8 py-16"><Card><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{stage === "assessment" ? "Abstract & Logical Check debrief" : "Abstract & logical practice debrief"}</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p></div>{stage === "assessment" && <Badge>{isProgression ? "Progression recommendation" : "Strengthening recommendation"}</Badge>}</div>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{summary.conceptBreakdown.map((item) => <div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{abstractLogicalCategoryLabels[item.concept as AbstractLogicalSubcompetency] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 leading-relaxed text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Mentor recommendation</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 leading-relaxed text-[#AAB4C0]">{rec?.summary}</p></div></div>{stage !== "guided" && onReviewIncorrect && onReviewAll && <AnswerReviewActions incorrectCount={incorrectCount} onReviewIncorrect={onReviewIncorrect} onReviewAll={onReviewAll} />}<div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton>{canUseNext && onNext && <PrimaryButton onClick={onNext}>{stage === "guided" ? "Start Independent Abstract & Logical Practice" : "Start Abstract & Logical Check"}</PrimaryButton>}<PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}


type VerbalStage = "guided" | "independent" | "assessment";

function VerbalFundamentalsScreen({ journey, onSaveJourney, onComplete }: { journey: MvpGuestJourney; onSaveJourney: (journey: MvpGuestJourney) => void; onComplete: () => void }) {
  const existingProgress = getCurrentVerbalProgress(journey);
  const progress = existingProgress ?? { moduleProgressId: id("module-progress"), moduleId: "verbal_fundamentals" as const, currentSectionIndex: 0, miniCheckResponses: [], startedAt: now(), updatedAt: now() };
  const section = verbalFundamentalsModule.sections[progress.currentSectionIndex];
  const miniCheck = section.miniCheck;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setSelectedOptionId(null); setShowFeedback(false); }, [progress.currentSectionIndex]);
  const selectedCorrect = miniCheck ? selectedOptionId === miniCheck.correctOptionId : false;
  function answerMiniCheck(optionId: string) {
    if (!miniCheck || showFeedback) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);
    const response: ModuleMiniCheckResponse = { questionId: miniCheck.questionId, selectedOptionId: optionId, correct: optionId === miniCheck.correctOptionId, answeredAt: now() };
    const nextProgress = { ...progress, miniCheckResponses: [...progress.miniCheckResponses.filter((item) => item.questionId !== miniCheck.questionId), response], updatedAt: now() };
    onSaveJourney(existingProgress ? updateVerbalProgress(journey, nextProgress) : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() });
  }
  function goNext() {
    if (miniCheck && !showFeedback) return;
    if (progress.currentSectionIndex >= verbalFundamentalsModule.sections.length - 1) { onComplete(); return; }
    const nextProgress = { ...progress, currentSectionIndex: progress.currentSectionIndex + 1, updatedAt: now() };
    onSaveJourney(existingProgress ? updateVerbalProgress(journey, nextProgress) : { ...journey, moduleProgress: [...journey.moduleProgress, nextProgress], updatedAt: now() });
  }
  function goBack() {
    if (progress.currentSectionIndex === 0) return;
    const nextProgress = { ...progress, currentSectionIndex: progress.currentSectionIndex - 1, updatedAt: now() };
    onSaveJourney(updateVerbalProgress(journey, nextProgress));
  }
  return <Shell><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${((progress.currentSectionIndex + 1) / verbalFundamentalsModule.sections.length) * 100}%` }} /></div><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Verbal Comprehension Fundamentals</p><h1 className="mt-3 text-4xl font-semibold">{verbalFundamentalsModule.title}</h1><p className="mt-3 text-[#9AA3B2]">{verbalFundamentalsModule.subtitle}</p></div><Badge>Section {progress.currentSectionIndex + 1} of {verbalFundamentalsModule.sections.length}</Badge></div><Card><h2 className="text-3xl font-semibold">{section.title}</h2><p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-[#C8D2DD]">{section.body}</p>{section.keyPoint && <div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/10 p-5"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Key point</div><p className="mt-3 text-[#D9F8FF]">{section.keyPoint}</p></div>}{miniCheck && <div className="mt-9 rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Quick check</div><p className="mt-4 text-lg leading-relaxed text-[#F4F6F8]">{miniCheck.stem}</p><div className="mt-5 grid gap-3">{miniCheck.options.map((option) => <button key={option.optionId} onClick={() => answerMiniCheck(option.optionId)} className={`rounded-xl border p-4 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div>{showFeedback && <div className={`mt-5 rounded-xl border p-4 ${selectedCorrect ? "border-[#38D39F]/30 bg-[#38D39F]/8" : "border-[#FFB86B]/30 bg-[#FFB86B]/8"}`}><div className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</div><p className="mt-2 text-sm leading-relaxed text-[#C8D2DD]">{miniCheck.explanation}</p></div>}</div>}<div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><SecondaryButton onClick={goBack} className={progress.currentSectionIndex === 0 ? "invisible" : ""}>Previous</SecondaryButton><PrimaryButton disabled={Boolean(miniCheck && !showFeedback)} onClick={goNext}>{progress.currentSectionIndex === verbalFundamentalsModule.sections.length - 1 ? "Complete fundamentals" : "Next section"}</PrimaryButton></div></Card></section></Shell>;
}

function VerbalFundamentalsCompleteScreen({ journey, onWhy, onDashboard, onStartGuided }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onStartGuided: () => void }) {
  const rec = getCurrentRecommendation(journey);
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-4xl items-center px-8 py-16"><Card><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Fundamentals complete</p><h1 className="mt-6 text-4xl font-semibold">Verbal Comprehension Fundamentals complete</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">You have covered how to find evidence, distinguish inference from assumption, follow written conditions and keep conclusions within the evidence.</p><div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Mentor recommendation</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 text-[#AAB4C0]">{rec?.summary}</p></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton><PrimaryButton onClick={onStartGuided}>Begin guided practice</PrimaryButton><SecondaryButton onClick={onDashboard}>View dashboard</SecondaryButton></div></Card></section></Shell>;
}

function VerbalPracticeIntroScreen({ stage, onStart }: { stage: VerbalStage; onStart: () => void }) {
  const config = stage === "guided"
    ? { eyebrow: "Guided practice", title: "Guided Verbal Practice", body: "Ten short passages and instruction sets with immediate feedback and a concise reading focus.", items: ["10 questions", "Immediate feedback", "Reading-focus cues"], button: "Start guided practice" }
    : stage === "independent"
      ? { eyebrow: "Less-supported practice", title: "Independent Verbal Practice", body: "Twenty-five questions with broader variation. Feedback follows each answer, but the reading method is no longer signposted.", items: ["25 questions", "Immediate feedback", "Less support"], button: "Start independent practice" }
      : { eyebrow: "Assessment-style check", title: "Verbal Comprehension Check", body: "Twelve mixed questions with no immediate answer feedback. The Mentor will identify either a clear area to strengthen or a progression step.", items: ["12 questions", "No immediate feedback", "Untimed in v1"], button: "Start Verbal Check" };
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{config.eyebrow}</p><h1 className="mt-5 text-4xl font-semibold">{config.title}</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">{config.body}</p><div className="mx-auto mt-9 grid max-w-xl gap-3 sm:grid-cols-3">{config.items.map((item) => <div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><div className="mt-10"><PrimaryButton onClick={onStart}>{config.button}</PrimaryButton></div></Card></section></Shell>;
}

function VerbalPassagePanel({ passage }: { passage?: VerbalPassage }) {
  if (!passage) return null;
  return <div className="mb-7 rounded-3xl border border-white/10 bg-[#111418] p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><div><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">{passage.label ?? "Passage"}</div>{passage.title && <h2 className="mt-2 text-xl font-semibold text-[#DCE3EA]">{passage.title}</h2>}</div></div><div className="mt-5 whitespace-pre-line text-[1.05rem] leading-8 text-[#C8D2DD]">{passage.text}</div></div>;
}

function VerbalPracticeQuestionScreen({ journey, sessionId, questionIndex, onAnswer, questions, stage }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void; questions: MvpQuestion[]; stage: VerbalStage }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStartedAt(Date.now()); setSelectedOptionId(null); setShowFeedback(false); }, [questionIndex]);
  const question = questions[questionIndex]; if (!question) return null;
  const progress = ((questionIndex + 1) / questions.length) * 100;
  const answered = journey.responses.filter((r) => r.sessionId === sessionId).length;
  const selectedCorrect = selectedOptionId === question.correctOptionId;
  function select(optionId: string) { if (stage !== "assessment" && showFeedback) return; setSelectedOptionId(optionId); if (stage !== "assessment") setShowFeedback(true); }
  function next() { if (!selectedOptionId) return; const response = createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false); onAnswer(response, questionIndex === questions.length - 1); }
  const title = stage === "guided" ? "Guided Verbal Practice" : stage === "independent" ? "Independent Verbal Practice" : "Verbal Comprehension Check";
  return <Shell right={title}><section className={`mx-auto max-w-5xl px-8 pt-12 ${stage === "assessment" ? "pb-12" : "pb-44 lg:pb-12"}`}><div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{title}</p><h1 className="mt-3 text-3xl font-semibold">Read for evidence</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {questions.length}<br/><span className="text-xs">{answered} saved</span></div></div><Card>{stage === "guided" && question.feedbackCue && <div className="mb-6 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/8 p-4 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">Reading focus: </span>{question.feedbackCue}</div>}<VerbalPassagePanel passage={question.verbalPassage}/><p className="text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p><div className="mt-8 grid gap-4">{question.options.map((option) => <button key={option.optionId} onClick={() => select(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div>{stage === "assessment" ? <div className="mt-8 flex justify-end"><PrimaryButton disabled={!selectedOptionId} onClick={next}>{questionIndex === questions.length - 1 ? "Finish check" : "Next question"}</PrimaryButton></div> : showFeedback && <div className={`fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-2xl backdrop-blur-xl lg:static lg:mt-7 lg:rounded-2xl lg:border lg:p-5 lg:shadow-none ${selectedCorrect ? "border-[#38D39F]/40 bg-[#101D1A]/95" : "border-[#FFB86B]/40 bg-[#211813]/95"}`}><div className="mx-auto max-w-5xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{selectedCorrect ? "Correct" : "Not quite"}</p><p className="mt-2 leading-relaxed text-[#C8D2DD]">{question.explanation}</p>{!selectedCorrect && question.feedbackCue && <p className="mt-3 text-sm leading-relaxed text-[#D9F8FF]"><span className="text-[#6E7A88]">What to notice next time: </span>{question.feedbackCue}</p>}</div><div className="shrink-0 sm:pt-1"><PrimaryButton onClick={next}>{questionIndex === questions.length - 1 ? "Complete practice" : "Next question"}</PrimaryButton></div></div></div></div>}</Card></section></Shell>;
}

function VerbalDebriefScreen({ journey, stage, onWhy, onDashboard, onNext, onReviewIncorrect, onReviewAll }: { journey: MvpGuestJourney; stage: VerbalStage; onWhy: () => void; onDashboard: () => void; onNext?: () => void; onReviewIncorrect?: () => void; onReviewAll?: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const sessionType: PracticeSummary["sessionType"] = stage === "guided" ? "guided_verbal_practice" : stage === "independent" ? "verbal_independent_practice" : "verbal_assessment";
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === sessionType);
  const canUseNext = stage === "guided" ? rec?.recommendationType === "begin_verbal_independent_practice" : stage === "independent" ? rec?.recommendationType === "begin_verbal_assessment" : false;
  const reviewSession = stage === "independent" ? getLatestSessionOfType(journey, "verbal_independent_practice") : stage === "assessment" ? getLatestSessionOfType(journey, "verbal_assessment") : undefined;
  const incorrectCount = reviewSession ? journey.responses.filter((response) => response.sessionId === reviewSession.sessionId && !response.correct).length : 0;
  const isProgression = stage === "assessment" && rec?.recommendationType === "continue_verbal_practice";
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-5xl items-center px-8 py-16"><Card><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{stage === "assessment" ? "Verbal Comprehension Check debrief" : "Verbal practice debrief"}</p><h1 className="mt-6 text-4xl font-semibold leading-tight">{debrief?.title}</h1><p className="mt-6 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p></div>{stage === "assessment" && <Badge>{isProgression ? "Progression recommendation" : "Strengthening recommendation"}</Badge>}</div>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{summary.conceptBreakdown.map((item) => <div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{verbalCategoryLabels[item.concept as VerbalSubcompetency] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 leading-relaxed text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Mentor recommendation</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 leading-relaxed text-[#AAB4C0]">{rec?.summary}</p></div></div>{stage !== "guided" && onReviewIncorrect && onReviewAll && <AnswerReviewActions incorrectCount={incorrectCount} onReviewIncorrect={onReviewIncorrect} onReviewAll={onReviewAll} />}<div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton>{canUseNext && onNext && <PrimaryButton onClick={onNext}>{stage === "guided" ? "Start Independent Verbal Practice" : "Start Verbal Check"}</PrimaryButton>}<PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}


const answerReviewConfig: Record<ReviewableSessionType, { title: string; questions: MvpQuestion[] }> = {
  hydraulic_independent_practice: { title: "Independent Hydraulic Practice", questions: hydraulicIndependentPracticeQuestions },
  gear_independent_practice: { title: "Independent Gear Practice", questions: gearIndependentPracticeQuestions },
  pulley_independent_practice: { title: "Independent Pulley Practice", questions: pulleyIndependentPracticeQuestions },
  lever_independent_practice: { title: "Independent Lever Practice", questions: leverIndependentPracticeQuestions },
  numerical_independent_practice: { title: "Independent Numerical Practice", questions: numericalIndependentPracticeQuestions },
  abstract_logical_independent_practice: { title: "Independent Abstract & Logical Practice", questions: abstractLogicalIndependentPracticeQuestions },
  verbal_independent_practice: { title: "Independent Verbal Practice", questions: verbalIndependentPracticeQuestions },
  gear_assessment: { title: "Gear Check", questions: gearAssessmentQuestions },
  pulley_assessment: { title: "Pulley Check", questions: pulleyAssessmentQuestions },
  lever_assessment: { title: "Lever Check", questions: leverAssessmentQuestions },
  numerical_assessment: { title: "Numerical Check", questions: numericalAssessmentQuestions },
  abstract_logical_assessment: { title: "Abstract & Logical Check", questions: abstractLogicalAssessmentQuestions },
  verbal_assessment: { title: "Verbal Comprehension Check", questions: verbalAssessmentQuestions },
  mixed_mechanical_assessment: { title: "Mixed Mechanical Assessment", questions: mixedMechanicalAssessmentQuestions },
};

function getLatestSessionOfType(journey: MvpGuestJourney, sessionType: ReviewableSessionType) {
  return [...journey.sessions].reverse().find((session) => session.sessionType === sessionType);
}

function AnswerReviewActions({ incorrectCount, onReviewIncorrect, onReviewAll }: { incorrectCount: number; onReviewIncorrect: () => void; onReviewAll: () => void }) {
  return (
    <div className="mt-8 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-6">
      <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Review your answers</div>
      <p className="mt-3 leading-relaxed text-[#C8D2DD]">Revisit the questions you missed, or review every explanation to reinforce the reasoning behind answers you got right.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {incorrectCount > 0 && <SecondaryButton onClick={onReviewIncorrect}>Review incorrect answers ({incorrectCount})</SecondaryButton>}
        <SecondaryButton onClick={onReviewAll}>Review all explanations</SecondaryButton>
      </div>
    </div>
  );
}

function AnswerReviewVisual({ question, sessionType }: { question: MvpQuestion; sessionType: ReviewableSessionType }) {
  if (sessionType === "gear_independent_practice") return <GearQuestionDiagram question={question} mode="practice" />;
  if (sessionType === "gear_assessment") return <GearQuestionDiagram question={question} mode="assessment" />;
  if (sessionType === "pulley_independent_practice") return <PulleyQuestionDiagram question={question} mode="independent" />;
  if (sessionType === "pulley_assessment") return <PulleyQuestionDiagram question={question} mode="assessment" />;
  if (sessionType === "lever_independent_practice") return <LeverQuestionDiagram question={question} mode="independent" />;
  if (sessionType === "lever_assessment") return <LeverQuestionDiagram question={question} mode="assessment" />;
  if (sessionType === "numerical_independent_practice" || sessionType === "numerical_assessment") return <NumericalDataTableView table={question.dataTable} />;
  if ((sessionType === "abstract_logical_independent_practice" || sessionType === "abstract_logical_assessment") && question.abstractVisual) return <AbstractLogicalVisualPanel visual={question.abstractVisual} />;
  if (sessionType === "verbal_independent_practice" || sessionType === "verbal_assessment") return <VerbalPassagePanel passage={question.verbalPassage} />;
  if (sessionType === "mixed_mechanical_assessment") return <MixedMechanicalAssessmentDiagram question={question} />;
  return null;
}

function AnswerReviewScreen({ journey, context, onModeChange, onBack }: { journey: MvpGuestJourney; context: AnswerReviewContext; onModeChange: (mode: ReviewMode) => void; onBack: () => void }) {
  const [reviewIndex, setReviewIndex] = useState(0);
  useEffect(() => { setReviewIndex(0); window.scrollTo({ top: 0, behavior: "smooth" }); }, [context.sessionId, context.mode]);
  const config = answerReviewConfig[context.sessionType];
  const session = journey.sessions.find((item) => item.sessionId === context.sessionId);
  const responseMap = new Map(journey.responses.filter((response) => response.sessionId === context.sessionId).map((response) => [response.questionId, response]));
  const questionMap = new Map(config.questions.map((question) => [question.questionId, question]));
  const allItems = (session?.questionIds ?? []).map((questionId) => {
    const question = questionMap.get(questionId);
    const response = responseMap.get(questionId);
    return question && response ? { question, response } : null;
  }).filter((item): item is { question: MvpQuestion; response: AssessmentResponse } => Boolean(item));
  const incorrectCount = allItems.filter((item) => !item.response.correct).length;
  const items = context.mode === "incorrect" ? allItems.filter((item) => !item.response.correct) : allItems;

  if (context.mode === "incorrect" && items.length === 0) {
    return <Shell right="Answer review"><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{config.title}</p><h1 className="mt-5 text-4xl font-semibold">No incorrect answers to review</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">You answered every question correctly. You can still review all explanations if you want to reinforce the reasoning.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><SecondaryButton onClick={onBack}>Back to results</SecondaryButton><PrimaryButton onClick={() => onModeChange("all")}>Review all explanations</PrimaryButton></div></Card></section></Shell>;
  }

  const current = items[Math.min(reviewIndex, Math.max(items.length - 1, 0))];
  if (!current) return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><h1 className="text-3xl font-semibold">No review data found</h1><p className="mt-5 text-[#9AA3B2]">Return to the results screen and try again.</p><div className="mt-8"><PrimaryButton onClick={onBack}>Back to results</PrimaryButton></div></Card></section></Shell>;

  const selectedOption = current.question.options.find((option) => option.optionId === current.response.selectedOptionId);
  const correctOption = current.question.options.find((option) => option.optionId === current.question.correctOptionId);
  const position = reviewIndex + 1;
  const total = items.length;

  function goPrevious() { setReviewIndex((index) => Math.max(0, index - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function goNext() { setReviewIndex((index) => Math.min(total - 1, index + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return (
    <Shell right="Answer review">
      <section className="mx-auto max-w-5xl px-8 py-12">
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">{config.title}</p><h1 className="mt-3 text-3xl font-semibold">Review explanations</h1><p className="mt-3 text-[#9AA3B2]">{context.mode === "incorrect" ? `${incorrectCount} incorrect answer${incorrectCount === 1 ? "" : "s"}` : `${allItems.length} questions`} · Question {position} of {total}</p></div>
          <div className="flex flex-wrap gap-2"><button onClick={() => onModeChange("incorrect")} className={`rounded-xl border px-4 py-2 text-sm transition ${context.mode === "incorrect" ? "border-[#5ED3F3]/50 bg-[#5ED3F3]/10 text-[#D9F8FF]" : "border-white/10 text-[#9AA3B2] hover:border-[#5ED3F3]/30"}`}>Incorrect only</button><button onClick={() => onModeChange("all")} className={`rounded-xl border px-4 py-2 text-sm transition ${context.mode === "all" ? "border-[#5ED3F3]/50 bg-[#5ED3F3]/10 text-[#D9F8FF]" : "border-white/10 text-[#9AA3B2] hover:border-[#5ED3F3]/30"}`}>All explanations</button></div>
        </div>
        <Card>
          <AnswerReviewVisual question={current.question} sessionType={context.sessionType} />
          <p className="mt-7 text-xl leading-relaxed text-[#F4F6F8]">{current.question.stem}</p>
          <div className="mt-8 grid gap-3">{current.question.options.map((option) => {
            const isCorrect = option.optionId === current.question.correctOptionId;
            const isSelected = option.optionId === current.response.selectedOptionId;
            const optionClass = isCorrect ? "border-[#38D39F]/45 bg-[#38D39F]/10" : isSelected ? "border-[#FFB86B]/45 bg-[#FFB86B]/10" : "border-white/8 bg-[#111418]";
            return <div key={option.optionId} className={`rounded-2xl border p-5 ${optionClass}`}><div className="flex items-start justify-between gap-4"><div><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></div><div className="shrink-0 text-xs uppercase tracking-[0.12em]">{isCorrect ? <span className="text-[#8FE7C8]">Correct answer</span> : isSelected ? <span className="text-[#FFD0A0]">Your answer</span> : null}</div></div></div>;
          })}</div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2"><div className={`rounded-2xl border p-5 ${current.response.correct ? "border-[#38D39F]/30 bg-[#38D39F]/8" : "border-[#FFB86B]/30 bg-[#FFB86B]/8"}`}><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">Your answer</div><p className="mt-3 text-[#DCE3EA]">{selectedOption ? `${selectedOption.label}. ${selectedOption.text}` : "No answer recorded"}</p></div><div className="rounded-2xl border border-[#38D39F]/30 bg-[#38D39F]/8 p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">Correct answer</div><p className="mt-3 text-[#DCE3EA]">{correctOption ? `${correctOption.label}. ${correctOption.text}` : "Correct answer unavailable"}</p></div></div>
          <div className="mt-6 rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Why</div><p className="mt-3 leading-relaxed text-[#C8D2DD]">{current.question.explanation}</p></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><SecondaryButton onClick={onBack}>Back to results</SecondaryButton><div className="flex gap-3"><button disabled={reviewIndex === 0} onClick={goPrevious} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-[#C8D2DD] transition hover:border-[#5ED3F3]/35 hover:text-[#D9F8FF] disabled:cursor-not-allowed disabled:opacity-35">Previous</button><PrimaryButton disabled={reviewIndex === total - 1} onClick={goNext}>Next explanation</PrimaryButton></div></div>
        </Card>
      </section>
    </Shell>
  );
}

function HydraulicAssessmentDiagram({ question }: { question: MvpQuestion }) {
  const specs: Record<string, { inputWidth: number; outputWidth: number; inputLabel: string; outputLabel: string; topLabel?: string; showInputArrow?: boolean }> = {
    "MMA-HYD-001": { inputWidth: 78, outputWidth: 150, inputLabel: "Area 1", outputLabel: "Area 2", topLabel: "Same pressure" },
    "MMA-HYD-002": { inputWidth: 86, outputWidth: 120, inputLabel: "Input", outputLabel: "Output", showInputArrow: true },
    "MMA-HYD-003": { inputWidth: 90, outputWidth: 130, inputLabel: "Fluid", outputLabel: "Area 0.02 m²", topLabel: "Pressure 50 kPa" },
    "MMA-HYD-004": { inputWidth: 72, outputWidth: 160, inputLabel: "100 N · 2 cm²", outputLabel: "10 cm²" },
    "MMA-HYD-005": { inputWidth: 72, outputWidth: 150, inputLabel: "Input movement", outputLabel: "Output movement", topLabel: "Force advantage 4:1" },
    "MMA-HYD-006": { inputWidth: 110, outputWidth: 110, inputLabel: "300 N", outputLabel: "Equal area", topLabel: "Ideal sealed system" },
  };
  const spec = specs[question.questionId] ?? { inputWidth: 86, outputWidth: 130, inputLabel: "Input", outputLabel: "Output" };
  const inputX = 170 - spec.inputWidth / 2;
  const outputX = 590 - spec.outputWidth / 2;
  const arrowId = `hyd-assess-arrow-${question.questionId}`;
  return <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111418] p-5 sm:p-7"><svg viewBox="0 0 760 340" role="img" aria-label="Hydraulic system with two connected pistons" className="h-auto w-full"><defs><marker id={arrowId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#5ED3F3" /></marker></defs><rect x={inputX} y="110" width={spec.inputWidth} height="150" rx="14" fill="#171C23" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/><rect x={outputX} y="85" width={spec.outputWidth} height="175" rx="16" fill="#171C23" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/><rect x={inputX+10} y="145" width={spec.inputWidth-20} height="24" rx="5" fill="#DDE3EA"/><rect x={outputX+12} y="122" width={spec.outputWidth-24} height="28" rx="5" fill="#DDE3EA"/><path d={`M ${inputX+spec.inputWidth} 225 H ${outputX}`} stroke="#5ED3F3" strokeWidth="32" strokeLinecap="round" opacity="0.24"/><path d={`M ${inputX+spec.inputWidth+8} 225 H ${outputX-8}`} stroke="#5ED3F3" strokeWidth="5" strokeDasharray="12 12" opacity="0.85"/><text x="380" y="210" textAnchor="middle" fill="#D9F8FF" fontSize="17">sealed fluid</text><text x="170" y="300" textAnchor="middle" fill="#AAB4C0" fontSize="17">{spec.inputLabel}</text><text x="590" y="300" textAnchor="middle" fill="#AAB4C0" fontSize="17">{spec.outputLabel}</text>{spec.topLabel && <text x="380" y="42" textAnchor="middle" fill="#D9F8FF" fontSize="20" fontWeight="700">{spec.topLabel}</text>}{spec.showInputArrow && <><path d="M 170 36 V 118" stroke="#5ED3F3" strokeWidth="5" markerEnd={`url(#${arrowId})`}/><text x="170" y="28" textAnchor="middle" fill="#D9F8FF" fontSize="17">push down</text></>}{question.questionId === "MMA-HYD-005" && <><path d="M 170 42 V 112" stroke="#5ED3F3" strokeWidth="5" markerEnd={`url(#${arrowId})`}/><path d="M 590 150 V 72" stroke="#D9F8FF" strokeWidth="5" markerEnd={`url(#${arrowId})`}/></>}</svg></div>;
}

function MixedMechanicalAssessmentDiagram({ question }: { question: MvpQuestion }) {
  if (question.subcompetency === "gears") return <GearQuestionDiagram question={question} mode="assessment" hideContextLabel />;
  if (question.subcompetency === "pulleys") return <PulleyQuestionDiagram question={question} mode="assessment" hideContextLabel />;
  if (question.subcompetency === "levers") return <LeverQuestionDiagram question={question} mode="assessment" />;
  return <HydraulicAssessmentDiagram question={question} />;
}

function MixedMechanicalAssessmentIntroScreen({ onStart }: { onStart: () => void }) {
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-3xl items-center px-8 py-16"><Card className="text-center"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Integrated evidence check</p><h1 className="mt-5 text-4xl font-semibold">Mixed Mechanical Assessment</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">Gears, pulleys, levers and hydraulics are mixed together. The category is not announced, so you must first decide which mechanical method applies.</p><div className="mx-auto mt-9 grid max-w-2xl gap-3 sm:grid-cols-4">{["24 questions", "4 mechanical areas", "No immediate feedback", "Untimed in v1"].map((item)=><div key={item} className="rounded-xl border border-white/5 bg-[#111418] p-4 text-sm text-[#AAB4C0]">{item}</div>)}</div><p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-[#8D98A6]">The Mentor will use the result to make either a strengthening recommendation or a progression recommendation.</p><div className="mt-10"><PrimaryButton onClick={onStart}>Start mixed assessment</PrimaryButton></div></Card></section></Shell>;
}

function MixedMechanicalAssessmentQuestionScreen({ journey, sessionId, questionIndex, onAnswer }: { journey: MvpGuestJourney; sessionId: string; questionIndex: number; onAnswer: (response: AssessmentResponse, final: boolean) => void }) {
  const [startedAt, setStartedAt] = useState(Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStartedAt(Date.now()); setSelectedOptionId(null); }, [questionIndex]);
  const question = mixedMechanicalAssessmentQuestions[questionIndex];
  if (!question) return null;
  const progress = ((questionIndex + 1) / mixedMechanicalAssessmentQuestions.length) * 100;
  const answered = journey.responses.filter((response) => response.sessionId === sessionId).length;
  function next() { if (!selectedOptionId) return; onAnswer(createAssessmentResponse(sessionId, question, selectedOptionId, Date.now() - startedAt, false), questionIndex === mixedMechanicalAssessmentQuestions.length - 1); }
  return <Shell right="Mixed Mechanical Assessment"><section className="mx-auto max-w-5xl px-8 py-12"><div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70 transition-all" style={{ width: `${progress}%` }} /></div><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Mixed Mechanical Assessment</p><h1 className="mt-3 text-3xl font-semibold">Choose the right method</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {questionIndex + 1} of {mixedMechanicalAssessmentQuestions.length}<br/><span className="text-xs">{answered} saved</span></div></div><Card><MixedMechanicalAssessmentDiagram question={question}/><p className="mt-7 text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p><div className="mt-8 grid gap-4">{question.options.map((option)=><button key={option.optionId} onClick={()=>setSelectedOptionId(option.optionId)} className={`rounded-2xl border bg-[#111418] p-5 text-left transition ${selectedOptionId === option.optionId ? "border-[#5ED3F3]/60 bg-[#5ED3F3]/10" : "border-white/10 hover:border-[#5ED3F3]/40"}`}><span className="mr-3 text-[#5ED3F3]">{option.label}</span><span className="text-[#DCE3EA]">{option.text}</span></button>)}</div><div className="mt-8 flex justify-end"><PrimaryButton disabled={!selectedOptionId} onClick={next}>{questionIndex === mixedMechanicalAssessmentQuestions.length - 1 ? "Finish assessment" : "Next question"}</PrimaryButton></div></Card></section></Shell>;
}

function MixedMechanicalAssessmentDebriefScreen({ journey, onWhy, onDashboard, onReviewIncorrect, onReviewAll }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void; onReviewIncorrect: () => void; onReviewAll: () => void }) {
  const debrief = getLatestDebrief(journey);
  const rec = getCurrentRecommendation(journey);
  const summary = [...journey.practiceSummaries].reverse().find((item) => item.sessionType === "mixed_mechanical_assessment");
  const labels: Record<string,string> = { hydraulics: "Hydraulics", gears: "Gears", pulleys: "Pulleys", levers: "Levers" };
  const isProgression = rec?.recommendationType === "continue_mixed_mechanical_practice";
  const latestSession = getLatestSessionOfType(journey, "mixed_mechanical_assessment");
  const incorrectCount = latestSession ? journey.responses.filter((response) => response.sessionId === latestSession.sessionId && !response.correct).length : 0;
  return <Shell><section className="mx-auto flex min-h-[82vh] max-w-5xl items-center px-8 py-16"><Card><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Integrated assessment debrief</p><h1 className="mt-5 text-4xl font-semibold leading-tight">{debrief?.title}</h1><p className="mt-5 text-lg leading-relaxed text-[#9AA3B2]">{debrief?.summary}</p></div><Badge>{isProgression ? "Progression recommendation" : "Strengthening recommendation"}</Badge></div>{summary && <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{summary.conceptBreakdown.map((item)=><div key={item.concept} className="rounded-2xl border border-white/5 bg-[#111418] p-5"><div className="text-xs uppercase tracking-[0.16em] text-[#6E7A88]">{labels[item.concept] ?? item.concept}</div><div className="mt-3 text-3xl font-semibold">{item.correct}/{item.attempted}</div><div className="mt-2 text-sm text-[#9AA3B2]">{Math.round(item.accuracy * 100)}%</div></div>)}</div>}<div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/5 bg-[#111418] p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Interpretation</div><p className="mt-3 leading-relaxed text-[#C8D2DD]">{debrief?.interpretation}</p></div><div className="rounded-2xl border border-[#5ED3F3]/15 bg-[#5ED3F3]/5 p-6"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Mentor recommendation</div><h2 className="mt-3 text-2xl font-semibold">{rec?.title}</h2><p className="mt-3 leading-relaxed text-[#AAB4C0]">{rec?.summary}</p></div></div><AnswerReviewActions incorrectCount={incorrectCount} onReviewIncorrect={onReviewIncorrect} onReviewAll={onReviewAll} /><div className="mt-9 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div></Card></section></Shell>;
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) { const [password, setPassword] = useState(""); const [error, setError] = useState(false); return <main className="flex min-h-screen items-center justify-center bg-[#111418] p-8 text-[#F4F6F8]"><section className="w-full max-w-md rounded-[32px] border border-white/5 bg-[#171C23] p-10 shadow-2xl"><div className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Vivalsa</div><h1 className="mt-6 text-4xl font-semibold">Private testing access</h1><p className="mt-5 text-[#9AA3B2]">Enter the shared testing password to continue.</p><form onSubmit={(e) => { e.preventDefault(); if (password.trim() === TEST_ACCESS_PASSWORD) { window.localStorage.setItem("flospatial.accessGranted.v1", "true"); onUnlock(); } else setError(true); }} className="mt-8"><input value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} type="password" autoFocus className="w-full rounded-xl border border-white/10 bg-[#111418] px-4 py-4 outline-none focus:border-[#5ED3F3]/50" placeholder="Password" />{error && <p className="mt-3 text-sm text-[#FF9A9A]">That password did not match.</p>}<button className="mt-6 w-full rounded-xl border border-[#5ED3F3]/30 bg-[#5ED3F3]/10 px-7 py-4 font-medium text-[#D9F8FF]">Enter</button></form></section></main>; }

export default function VivalsaPrototype() {
  const [accessGranted, setAccessGranted] = useState(() => !ENABLE_PASSWORD_GATE || (typeof window !== "undefined" && window.localStorage.getItem("flospatial.accessGranted.v1") === "true"));
  const [journey, setJourney] = useState<MvpGuestJourney>(() => loadMvpGuestJourney());
  const [screen, setScreen] = useState<AppScreen>(() => getResumeState(journey).screen);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(() => getResumeState(journey).activeSessionId);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(() => getResumeState(journey).activeQuestionIndex);
  const [showWhy, setShowWhy] = useState(false);
  const [reviewContext, setReviewContext] = useState<AnswerReviewContext | null>(null);

  useEffect(() => { saveMvpGuestJourney(journey); }, [journey]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [screen]);
  const activeSession = useMemo(() => activeSessionId ? journey.sessions.find((s) => s.sessionId === activeSessionId) : undefined, [activeSessionId, journey.sessions]);
  if (!accessGranted) return <PasswordGate onUnlock={() => setAccessGranted(true)} />;

  function updateJourney(next: MvpGuestJourney) { setJourney({ ...next, updatedAt: now() }); }
  function selectFireService() { updateJourney({ ...journey, selectedPathwayId: "fire_service" }); setScreen("preparation-context"); }
  function saveContext(context: PreparationContext) { updateJourney({ ...journey, preparationContext: context }); setScreen("mechanical-baseline-intro"); }
  function startBaseline() { const session = createMechanicalBaselineSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setScreen("mechanical-baseline-question"); }
  function handleAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeMechanicalBaseline(withResponse, activeSessionId); updateJourney(completed); setScreen("first-advisor-insight"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function resetDemo() { resetMvpGuestJourney(); const empty = createEmptyMvpGuestJourney(); setJourney(empty); setActiveSessionId(undefined); setActiveQuestionIndex(0); setShowWhy(false); setReviewContext(null); setScreen("landing"); }
  function loadTestScenario(scenario: TestScenario) { const next = createTestScenarioJourney(scenario); updateJourney(next); setActiveSessionId(undefined); setActiveQuestionIndex(0); setShowWhy(false); setReviewContext(null); setScreen("dashboard"); }
  function openAnswerReview(sessionType: ReviewableSessionType, mode: ReviewMode, returnScreen: AppScreen) {
    const session = getLatestSessionOfType(journey, sessionType);
    if (!session) return;
    setReviewContext({ sessionId: session.sessionId, sessionType, mode, returnScreen });
    setShowWhy(false);
    setScreen("answer-review");
  }
  function changeAnswerReviewMode(mode: ReviewMode) {
    setReviewContext((current) => current ? { ...current, mode } : current);
  }
  function closeAnswerReview() {
    const returnScreen = reviewContext?.returnScreen ?? "dashboard";
    setReviewContext(null);
    setScreen(returnScreen);
  }
  function openHydraulicFundamentals() { const next = startHydraulicFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("hydraulic-fundamentals"); }
  function completeHydraulicsModule() { const next = completeHydraulicFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("hydraulic-fundamentals-complete"); }
  function openGuidedPracticeIntro() { setShowWhy(false); setScreen("guided-hydraulic-practice-intro"); }
  function startGuidedPractice() { const session = createGuidedHydraulicPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("guided-hydraulic-practice-question"); }
  function handleGuidedAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeGuidedHydraulicPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("guided-hydraulic-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function continueAfterGuidedHydraulics() {
    const rec = getCurrentRecommendation(journey);
    if (rec?.recommendationType === "begin_hydraulic_independent_practice") { setScreen("hydraulic-independent-practice-intro"); return; }
    if (rec?.recommendationType === "continue_guided_hydraulic_practice") { setScreen("guided-hydraulic-practice-intro"); return; }
    if (rec?.recommendationType === "review_hydraulic_fundamentals") { setScreen("hydraulic-fundamentals"); return; }
    setScreen("dashboard");
  }
  function startHydraulicIndependentPractice() { const session = createHydraulicIndependentPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("hydraulic-independent-practice-question"); }
  function handleHydraulicIndependentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeHydraulicIndependentPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("hydraulic-independent-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function createPrototypeAccount(firstName: string, username: string) {
    const dashboardState = journey.dashboardState ? { ...journey.dashboardState, saveStatus: "username_account" as const, updatedAt: now() } : journey.dashboardState;
    updateJourney({ ...journey, prototypeAccount: { firstName, username, createdAt: now() }, dashboardState, updatedAt: now() });
    setScreen("dashboard");
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

  function openLeverFundamentals() { const next = startLeverFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("lever-fundamentals"); }
  function completeLeverModule() { const next = completeLeverFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("lever-fundamentals-complete"); }
  function openGuidedLeverPracticeIntro() { setShowWhy(false); setScreen("guided-lever-practice-intro"); }
  function startGuidedLeverPractice() { const session = createGuidedLeverPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("guided-lever-practice-question"); }
  function handleGuidedLeverAnswer(response: AssessmentResponse, final: boolean) { const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() }; if (final && activeSessionId) { const completed = completeGuidedLeverPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("guided-lever-practice-debrief"); return; } updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1); }
  function openLeverIndependentPracticeIntro() { setShowWhy(false); setScreen("lever-independent-practice-intro"); }
  function startLeverIndependentPractice() { const session = createLeverIndependentPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("lever-independent-practice-question"); }
  function handleLeverIndependentPracticeAnswer(response: AssessmentResponse, final: boolean) { const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() }; if (final && activeSessionId) { const completed = completeLeverIndependentPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("lever-independent-practice-debrief"); return; } updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1); }
  function openLeverAssessmentIntro() { setShowWhy(false); setScreen("lever-assessment-intro"); }
  function startLeverAssessment() { const session = createLeverAssessmentSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("lever-assessment-question"); }
  function handleLeverAssessmentAnswer(response: AssessmentResponse, final: boolean) { const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() }; if (final && activeSessionId) { const completed = completeLeverAssessment(withResponse, activeSessionId); updateJourney(completed); setScreen("lever-assessment-debrief"); return; } updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1); }
  function startMixedPractice() { const session = createMixedMechanicalPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("mixed-mechanical-practice-question"); }
  function handleMixedAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeMixedMechanicalPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("mixed-mechanical-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }


  function openMixedMechanicalAssessmentIntro() { setShowWhy(false); setScreen("mixed-mechanical-assessment-intro"); }
  function startMixedMechanicalAssessment() { const session = createMixedMechanicalAssessmentSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("mixed-mechanical-assessment-question"); }
  function handleMixedMechanicalAssessmentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeMixedMechanicalAssessment(withResponse, activeSessionId); updateJourney(completed); setScreen("mixed-mechanical-assessment-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }


  function openNumericalFundamentals() { const next = startNumericalFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("numerical-fundamentals"); }
  function completeNumericalModule() { const next = completeNumericalFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("numerical-fundamentals-complete"); }
  function openGuidedNumericalPracticeIntro() { setShowWhy(false); setScreen("guided-numerical-practice-intro"); }
  function startGuidedNumericalPractice() { const session = createGuidedNumericalPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("guided-numerical-practice-question"); }
  function handleGuidedNumericalAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeGuidedNumericalPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("guided-numerical-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openNumericalIndependentPracticeIntro() { setShowWhy(false); setScreen("numerical-independent-practice-intro"); }
  function startNumericalIndependentPractice() { const session = createNumericalIndependentPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("numerical-independent-practice-question"); }
  function handleNumericalIndependentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeNumericalIndependentPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("numerical-independent-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openNumericalAssessmentIntro() { setShowWhy(false); setScreen("numerical-assessment-intro"); }
  function startNumericalAssessment() { const session = createNumericalAssessmentSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("numerical-assessment-question"); }
  function handleNumericalAssessmentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeNumericalAssessment(withResponse, activeSessionId); updateJourney(completed); setScreen("numerical-assessment-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }


  function openAbstractLogicalFundamentals() { const next = startAbstractLogicalFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("abstract-logical-fundamentals"); }
  function completeAbstractLogicalModule() { const next = completeAbstractLogicalFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("abstract-logical-fundamentals-complete"); }
  function openGuidedAbstractLogicalPracticeIntro() { setShowWhy(false); setScreen("guided-abstract-logical-practice-intro"); }
  function startGuidedAbstractLogicalPractice() { const session = createGuidedAbstractLogicalPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("guided-abstract-logical-practice-question"); }
  function handleGuidedAbstractLogicalAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeGuidedAbstractLogicalPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("guided-abstract-logical-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openAbstractLogicalIndependentPracticeIntro() { setShowWhy(false); setScreen("abstract-logical-independent-practice-intro"); }
  function startAbstractLogicalIndependentPractice() { const session = createAbstractLogicalIndependentPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("abstract-logical-independent-practice-question"); }
  function handleAbstractLogicalIndependentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeAbstractLogicalIndependentPractice(withResponse, activeSessionId); updateJourney(completed); setScreen("abstract-logical-independent-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openAbstractLogicalAssessmentIntro() { setShowWhy(false); setScreen("abstract-logical-assessment-intro"); }
  function startAbstractLogicalAssessment() { const session = createAbstractLogicalAssessmentSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("abstract-logical-assessment-question"); }
  function handleAbstractLogicalAssessmentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeAbstractLogicalAssessment(withResponse, activeSessionId); updateJourney(completed); setScreen("abstract-logical-assessment-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }


  function openVerbalFundamentals() { const next = startVerbalFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("verbal-fundamentals"); }
  function completeVerbalModule() { const next = completeVerbalFundamentals(journey); updateJourney(next); setShowWhy(false); setScreen("verbal-fundamentals-complete"); }
  function openGuidedVerbalPracticeIntro() { setShowWhy(false); setScreen("guided-verbal-practice-intro"); }
  function startGuidedVerbalPractice() { const session = createGuidedVerbalPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("guided-verbal-practice-question"); }
  function handleGuidedVerbalAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeGuidedVerbalPractice(withResponse, activeSessionId); updateJourney(completed); setActiveSessionId(undefined); setActiveQuestionIndex(0); setScreen("guided-verbal-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openVerbalIndependentPracticeIntro() { setShowWhy(false); setScreen("verbal-independent-practice-intro"); }
  function startVerbalIndependentPractice() { const session = createVerbalIndependentPracticeSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("verbal-independent-practice-question"); }
  function handleVerbalIndependentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeVerbalIndependentPractice(withResponse, activeSessionId); updateJourney(completed); setActiveSessionId(undefined); setActiveQuestionIndex(0); setScreen("verbal-independent-practice-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }
  function openVerbalAssessmentIntro() { setShowWhy(false); setScreen("verbal-assessment-intro"); }
  function startVerbalAssessment() { const session = createVerbalAssessmentSession(); updateJourney({ ...journey, sessions: [...journey.sessions, session] }); setActiveSessionId(session.sessionId); setActiveQuestionIndex(0); setShowWhy(false); setScreen("verbal-assessment-question"); }
  function handleVerbalAssessmentAnswer(response: AssessmentResponse, final: boolean) {
    const withResponse: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    if (final && activeSessionId) { const completed = completeVerbalAssessment(withResponse, activeSessionId); updateJourney(completed); setActiveSessionId(undefined); setActiveQuestionIndex(0); setScreen("verbal-assessment-debrief"); return; }
    updateJourney(withResponse); setActiveQuestionIndex((idx) => idx + 1);
  }

  const why = getCurrentWhy(journey);
  function openCurrentRecommendation() {
    const rec = getCurrentRecommendation(journey);
    switch (rec?.recommendationType) {
      case "start_hydraulic_fundamentals": openHydraulicFundamentals(); return;
      case "start_gear_fundamentals": openGearFundamentals(); return;
      case "start_pulley_fundamentals": openPulleyFundamentals(); return;
      case "start_lever_fundamentals": openLeverFundamentals(); return;
      case "start_numerical_fundamentals": openNumericalFundamentals(); return;
      case "start_abstract_logical_fundamentals": openAbstractLogicalFundamentals(); return;
      case "start_verbal_fundamentals": openVerbalFundamentals(); return;
      case "begin_mixed_mechanical_assessment": openMixedMechanicalAssessmentIntro(); return;
      default: setScreen("dashboard");
    }
  }

  return <>{showWhy && <WhyModal why={why} onClose={() => setShowWhy(false)} />}{screen === "landing" && <LandingScreen onBegin={() => setScreen("pathway-selection")} onLoadTestScenario={loadTestScenario} />}{screen === "pathway-selection" && <PathwaySelectionScreen onSelect={selectFireService} />}{screen === "preparation-context" && <PreparationContextScreen onSave={saveContext} />}{screen === "mechanical-baseline-intro" && <BaselineIntroScreen onStart={startBaseline} />}{screen === "mechanical-baseline-question" && activeSession && <MechanicalQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleAnswer} />}{screen === "assessment-complete" && <AssessmentCompleteScreen onView={() => setScreen("first-advisor-insight")} />}{screen === "first-advisor-insight" && <FirstAdvisorInsightScreen journey={journey} onWhy={() => setShowWhy(true)} onStartRecommendation={openCurrentRecommendation} />}{screen === "dashboard" && <DashboardScreen journey={journey} onWhy={() => setShowWhy(true)} onReset={resetDemo} onStartHydraulics={openHydraulicFundamentals} onStartGuidedPractice={openGuidedPracticeIntro} onStartHydraulicIndependentPractice={() => setScreen("hydraulic-independent-practice-intro")} onStartMixedPractice={openMixedPracticeIntro} onStartMixedAssessment={openMixedMechanicalAssessmentIntro} onStartGearFundamentals={openGearFundamentals} onStartGuidedGearPractice={openGuidedGearPracticeIntro} onStartGearIndependentPractice={openGearIndependentPracticeIntro} onStartGearAssessment={openGearAssessmentIntro} onStartPulleyFundamentals={openPulleyFundamentals} onStartGuidedPulleyPractice={openGuidedPulleyPracticeIntro} onStartPulleyIndependentPractice={openPulleyIndependentPracticeIntro} onStartPulleyAssessment={openPulleyAssessmentIntro} onStartLeverFundamentals={openLeverFundamentals} onStartGuidedLeverPractice={openGuidedLeverPracticeIntro} onStartLeverIndependentPractice={openLeverIndependentPracticeIntro} onStartLeverAssessment={openLeverAssessmentIntro} onStartNumericalFundamentals={openNumericalFundamentals} onStartGuidedNumericalPractice={openGuidedNumericalPracticeIntro} onStartNumericalIndependentPractice={openNumericalIndependentPracticeIntro} onStartNumericalAssessment={openNumericalAssessmentIntro} onStartAbstractLogicalFundamentals={openAbstractLogicalFundamentals} onStartGuidedAbstractLogicalPractice={openGuidedAbstractLogicalPracticeIntro} onStartAbstractLogicalIndependentPractice={openAbstractLogicalIndependentPracticeIntro} onStartAbstractLogicalAssessment={openAbstractLogicalAssessmentIntro} onStartVerbalFundamentals={openVerbalFundamentals} onStartGuidedVerbalPractice={openGuidedVerbalPracticeIntro} onStartVerbalIndependentPractice={openVerbalIndependentPracticeIntro} onStartVerbalAssessment={openVerbalAssessmentIntro} onLoadTestScenario={loadTestScenario} />}{screen === "hydraulic-fundamentals" && <HydraulicFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeHydraulicsModule} />}{screen === "hydraulic-fundamentals-complete" && <HydraulicFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuidedPractice={openGuidedPracticeIntro} />}{screen === "guided-hydraulic-practice-intro" && <GuidedHydraulicPracticeIntroScreen onStart={startGuidedPractice} />}{screen === "guided-hydraulic-practice-question" && activeSession && <GuidedHydraulicQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedAnswer} />}{screen === "guided-hydraulic-practice-debrief" && <GuidedHydraulicPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onNext={continueAfterGuidedHydraulics} onDashboard={() => setScreen("dashboard")} />}{screen === "hydraulic-independent-practice-intro" && <HydraulicIndependentPracticeIntroScreen onStart={startHydraulicIndependentPractice} />}{screen === "hydraulic-independent-practice-question" && activeSession && <HydraulicIndependentPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleHydraulicIndependentAnswer} />}{screen === "hydraulic-independent-practice-debrief" && <HydraulicIndependentPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onContinue={() => setScreen("hydraulic-transfer-reflection")} onDashboard={() => setScreen("dashboard")} onReviewIncorrect={() => openAnswerReview("hydraulic_independent_practice", "incorrect", "hydraulic-independent-practice-debrief")} onReviewAll={() => openAnswerReview("hydraulic_independent_practice", "all", "hydraulic-independent-practice-debrief")} />}{screen === "hydraulic-transfer-reflection" && <HydraulicTransferReflectionScreen onContinue={() => setScreen("save-progress")} />}{screen === "save-progress" && <SaveProgressScreen journey={journey} onCreateAccount={createPrototypeAccount} onContinue={() => setScreen("dashboard")} />}{screen === "mixed-mechanical-practice-intro" && <MixedMechanicalPracticeIntroScreen onStart={startMixedPractice} />}{screen === "mixed-mechanical-practice-question" && activeSession && <MixedMechanicalQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleMixedAnswer} />}{screen === "mixed-mechanical-practice-debrief" && <MixedMechanicalPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "mixed-mechanical-assessment-intro" && <MixedMechanicalAssessmentIntroScreen onStart={startMixedMechanicalAssessment} />}{screen === "mixed-mechanical-assessment-question" && activeSession && <MixedMechanicalAssessmentQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleMixedMechanicalAssessmentAnswer} />}{screen === "mixed-mechanical-assessment-debrief" && <MixedMechanicalAssessmentDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onReviewIncorrect={() => openAnswerReview("mixed_mechanical_assessment", "incorrect", "mixed-mechanical-assessment-debrief")} onReviewAll={() => openAnswerReview("mixed_mechanical_assessment", "all", "mixed-mechanical-assessment-debrief")} />}{screen === "gear-fundamentals" && <GearFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeGearModule} />}{screen === "guided-gear-practice-intro" && <GuidedGearPracticeIntroScreen onStart={startGuidedGearPractice} />}{screen === "guided-gear-practice-question" && activeSession && <GuidedGearQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedGearAnswer} />}{screen === "guided-gear-practice-debrief" && <GuidedGearPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGearIndependentPractice={openGearIndependentPracticeIntro} />}{screen === "gear-independent-practice-intro" && <GearIndependentPracticeIntroScreen onStart={startGearIndependentPractice} />}{screen === "gear-independent-practice-question" && activeSession && <GearIndependentPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGearIndependentPracticeAnswer} />}{screen === "gear-independent-practice-debrief" && <GearIndependentPracticeDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onReviewIncorrect={() => openAnswerReview("gear_independent_practice", "incorrect", "gear-independent-practice-debrief")} onReviewAll={() => openAnswerReview("gear_independent_practice", "all", "gear-independent-practice-debrief")} />}{screen === "gear-assessment-intro" && <GearAssessmentIntroScreen onStart={startGearAssessment} />}{screen === "gear-assessment-question" && activeSession && <GearAssessmentQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGearAssessmentAnswer} />}{screen === "gear-assessment-debrief" && <GearAssessmentDebriefScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onReviewIncorrect={() => openAnswerReview("gear_assessment", "incorrect", "gear-assessment-debrief")} onReviewAll={() => openAnswerReview("gear_assessment", "all", "gear-assessment-debrief")} />}{screen === "gear-fundamentals-complete" && <GearFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuidedGearPractice={openGuidedGearPracticeIntro} />}{screen === "pulley-fundamentals" && <PulleyFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completePulleyModule} />}{screen === "pulley-fundamentals-complete" && <PulleyFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuidedPulleyPractice={openGuidedPulleyPracticeIntro} />}{screen === "guided-pulley-practice-intro" && <PulleyPracticeIntroScreen stage="guided" onStart={startGuidedPulleyPractice} />}{screen === "guided-pulley-practice-question" && activeSession && <PulleyPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedPulleyAnswer} questions={guidedPulleyPracticeQuestions} stage="guided" />}{screen === "guided-pulley-practice-debrief" && <PulleyDebriefScreen journey={journey} stage="guided" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openPulleyIndependentPracticeIntro} />}{screen === "pulley-independent-practice-intro" && <PulleyPracticeIntroScreen stage="independent" onStart={startPulleyIndependentPractice} />}{screen === "pulley-independent-practice-question" && activeSession && <PulleyPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handlePulleyIndependentPracticeAnswer} questions={pulleyIndependentPracticeQuestions} stage="independent" />}{screen === "pulley-independent-practice-debrief" && <PulleyDebriefScreen journey={journey} stage="independent" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openPulleyAssessmentIntro} onReviewIncorrect={() => openAnswerReview("pulley_independent_practice", "incorrect", "pulley-independent-practice-debrief")} onReviewAll={() => openAnswerReview("pulley_independent_practice", "all", "pulley-independent-practice-debrief")} />}{screen === "pulley-assessment-intro" && <PulleyPracticeIntroScreen stage="assessment" onStart={startPulleyAssessment} />}{screen === "pulley-assessment-question" && activeSession && <PulleyPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handlePulleyAssessmentAnswer} questions={pulleyAssessmentQuestions} stage="assessment" />}{screen === "pulley-assessment-debrief" && <PulleyDebriefScreen journey={journey} stage="assessment" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onReviewIncorrect={() => openAnswerReview("pulley_assessment", "incorrect", "pulley-assessment-debrief")} onReviewAll={() => openAnswerReview("pulley_assessment", "all", "pulley-assessment-debrief")} />}{screen === "lever-fundamentals" && <LeverFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeLeverModule} />}{screen === "lever-fundamentals-complete" && <LeverFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuidedLeverPractice={openGuidedLeverPracticeIntro} />}{screen === "guided-lever-practice-intro" && <LeverPracticeIntroScreen stage="guided" onStart={startGuidedLeverPractice} />}{screen === "guided-lever-practice-question" && activeSession && <LeverPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedLeverAnswer} questions={guidedLeverPracticeQuestions} stage="guided" />}{screen === "guided-lever-practice-debrief" && <LeverDebriefScreen journey={journey} stage="guided" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openLeverIndependentPracticeIntro} />}{screen === "lever-independent-practice-intro" && <LeverPracticeIntroScreen stage="independent" onStart={startLeverIndependentPractice} />}{screen === "lever-independent-practice-question" && activeSession && <LeverPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleLeverIndependentPracticeAnswer} questions={leverIndependentPracticeQuestions} stage="independent" />}{screen === "lever-independent-practice-debrief" && <LeverDebriefScreen journey={journey} stage="independent" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openLeverAssessmentIntro} onReviewIncorrect={() => openAnswerReview("lever_independent_practice", "incorrect", "lever-independent-practice-debrief")} onReviewAll={() => openAnswerReview("lever_independent_practice", "all", "lever-independent-practice-debrief")} />}{screen === "lever-assessment-intro" && <LeverPracticeIntroScreen stage="assessment" onStart={startLeverAssessment} />}{screen === "lever-assessment-question" && activeSession && <LeverPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleLeverAssessmentAnswer} questions={leverAssessmentQuestions} stage="assessment" />}{screen === "lever-assessment-debrief" && <LeverDebriefScreen journey={journey} stage="assessment" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onReviewIncorrect={() => openAnswerReview("lever_assessment", "incorrect", "lever-assessment-debrief")} onReviewAll={() => openAnswerReview("lever_assessment", "all", "lever-assessment-debrief")} />}{screen === "numerical-fundamentals" && <NumericalFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeNumericalModule} />}{screen === "numerical-fundamentals-complete" && <NumericalFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuided={openGuidedNumericalPracticeIntro} />}{screen === "guided-numerical-practice-intro" && <NumericalPracticeIntroScreen stage="guided" onStart={startGuidedNumericalPractice} />}{screen === "guided-numerical-practice-question" && activeSession && <NumericalPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedNumericalAnswer} questions={guidedNumericalPracticeQuestions} stage="guided" />}{screen === "guided-numerical-practice-debrief" && <NumericalDebriefScreen journey={journey} stage="guided" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openNumericalIndependentPracticeIntro} />}{screen === "numerical-independent-practice-intro" && <NumericalPracticeIntroScreen stage="independent" onStart={startNumericalIndependentPractice} />}{screen === "numerical-independent-practice-question" && activeSession && <NumericalPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleNumericalIndependentAnswer} questions={numericalIndependentPracticeQuestions} stage="independent" />}{screen === "numerical-independent-practice-debrief" && <NumericalDebriefScreen journey={journey} stage="independent" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openNumericalAssessmentIntro} onReviewIncorrect={() => openAnswerReview("numerical_independent_practice", "incorrect", "numerical-independent-practice-debrief")} onReviewAll={() => openAnswerReview("numerical_independent_practice", "all", "numerical-independent-practice-debrief")} />}{screen === "numerical-assessment-intro" && <NumericalPracticeIntroScreen stage="assessment" onStart={startNumericalAssessment} />}{screen === "numerical-assessment-question" && activeSession && <NumericalPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleNumericalAssessmentAnswer} questions={numericalAssessmentQuestions} stage="assessment" />}{screen === "numerical-assessment-debrief" && <NumericalDebriefScreen journey={journey} stage="assessment" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onReviewIncorrect={() => openAnswerReview("numerical_assessment", "incorrect", "numerical-assessment-debrief")} onReviewAll={() => openAnswerReview("numerical_assessment", "all", "numerical-assessment-debrief")} />}{screen === "abstract-logical-fundamentals" && <AbstractLogicalFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeAbstractLogicalModule} />}{screen === "abstract-logical-fundamentals-complete" && <AbstractLogicalFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuided={openGuidedAbstractLogicalPracticeIntro} />}{screen === "guided-abstract-logical-practice-intro" && <AbstractLogicalPracticeIntroScreen stage="guided" onStart={startGuidedAbstractLogicalPractice} />}{screen === "guided-abstract-logical-practice-question" && activeSession && <AbstractLogicalPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedAbstractLogicalAnswer} questions={guidedAbstractLogicalPracticeQuestions} stage="guided" />}{screen === "guided-abstract-logical-practice-debrief" && <AbstractLogicalDebriefScreen journey={journey} stage="guided" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openAbstractLogicalIndependentPracticeIntro} />}{screen === "abstract-logical-independent-practice-intro" && <AbstractLogicalPracticeIntroScreen stage="independent" onStart={startAbstractLogicalIndependentPractice} />}{screen === "abstract-logical-independent-practice-question" && activeSession && <AbstractLogicalPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleAbstractLogicalIndependentAnswer} questions={abstractLogicalIndependentPracticeQuestions} stage="independent" />}{screen === "abstract-logical-independent-practice-debrief" && <AbstractLogicalDebriefScreen journey={journey} stage="independent" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openAbstractLogicalAssessmentIntro} onReviewIncorrect={() => openAnswerReview("abstract_logical_independent_practice", "incorrect", "abstract-logical-independent-practice-debrief")} onReviewAll={() => openAnswerReview("abstract_logical_independent_practice", "all", "abstract-logical-independent-practice-debrief")} />}{screen === "abstract-logical-assessment-intro" && <AbstractLogicalPracticeIntroScreen stage="assessment" onStart={startAbstractLogicalAssessment} />}{screen === "abstract-logical-assessment-question" && activeSession && <AbstractLogicalPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleAbstractLogicalAssessmentAnswer} questions={abstractLogicalAssessmentQuestions} stage="assessment" />}{screen === "abstract-logical-assessment-debrief" && <AbstractLogicalDebriefScreen journey={journey} stage="assessment" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onReviewIncorrect={() => openAnswerReview("abstract_logical_assessment", "incorrect", "abstract-logical-assessment-debrief")} onReviewAll={() => openAnswerReview("abstract_logical_assessment", "all", "abstract-logical-assessment-debrief")} />}{screen === "verbal-fundamentals" && <VerbalFundamentalsScreen journey={journey} onSaveJourney={updateJourney} onComplete={completeVerbalModule} />}{screen === "verbal-fundamentals-complete" && <VerbalFundamentalsCompleteScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onStartGuided={openGuidedVerbalPracticeIntro} />}{screen === "guided-verbal-practice-intro" && <VerbalPracticeIntroScreen stage="guided" onStart={startGuidedVerbalPractice} />}{screen === "guided-verbal-practice-question" && activeSession && <VerbalPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleGuidedVerbalAnswer} questions={guidedVerbalPracticeQuestions} stage="guided" />}{screen === "guided-verbal-practice-debrief" && <VerbalDebriefScreen journey={journey} stage="guided" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openVerbalIndependentPracticeIntro} />}{screen === "verbal-independent-practice-intro" && <VerbalPracticeIntroScreen stage="independent" onStart={startVerbalIndependentPractice} />}{screen === "verbal-independent-practice-question" && activeSession && <VerbalPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleVerbalIndependentAnswer} questions={verbalIndependentPracticeQuestions} stage="independent" />}{screen === "verbal-independent-practice-debrief" && <VerbalDebriefScreen journey={journey} stage="independent" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onNext={openVerbalAssessmentIntro} onReviewIncorrect={() => openAnswerReview("verbal_independent_practice", "incorrect", "verbal-independent-practice-debrief")} onReviewAll={() => openAnswerReview("verbal_independent_practice", "all", "verbal-independent-practice-debrief")} />}{screen === "verbal-assessment-intro" && <VerbalPracticeIntroScreen stage="assessment" onStart={startVerbalAssessment} />}{screen === "verbal-assessment-question" && activeSession && <VerbalPracticeQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleVerbalAssessmentAnswer} questions={verbalAssessmentQuestions} stage="assessment" />}{screen === "verbal-assessment-debrief" && <VerbalDebriefScreen journey={journey} stage="assessment" onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} onReviewIncorrect={() => openAnswerReview("verbal_assessment", "incorrect", "verbal-assessment-debrief")} onReviewAll={() => openAnswerReview("verbal_assessment", "all", "verbal-assessment-debrief")} />}{screen === "answer-review" && reviewContext && <AnswerReviewScreen journey={journey} context={reviewContext} onModeChange={changeAnswerReviewMode} onBack={closeAnswerReview} />}</>;
}
