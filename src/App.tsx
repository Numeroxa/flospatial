import { useEffect, useMemo, useState } from "react";

type PathwayId = "fire_service";
type AppScreen =
  | "landing"
  | "pathway-selection"
  | "preparation-context"
  | "mechanical-baseline-intro"
  | "mechanical-baseline-question"
  | "assessment-complete"
  | "first-advisor-insight"
  | "dashboard";

type AssessmentTiming =
  | "unknown"
  | "within_2_weeks"
  | "two_to_six_weeks"
  | "six_to_twelve_weeks"
  | "more_than_twelve_weeks";

type WeeklyPrepTime =
  | "less_than_one_hour"
  | "one_to_two_hours"
  | "three_to_five_hours"
  | "more_than_five_hours"
  | "not_sure";

type PreviousAttempt = "no" | "yes" | "prefer_not_to_say";
type MechanicalSubcompetency = "hydraulics" | "gears" | "pulleys" | "levers";
type Difficulty = "foundational" | "developing" | "applied";
type EvidenceStrength = "none" | "early" | "emerging" | "strong" | "established";
type Confidence = "low" | "moderate" | "high";

type PreparationContext = {
  assessmentTiming: AssessmentTiming;
  weeklyPrepTime: WeeklyPrepTime;
  previousAttempt: PreviousAttempt;
  createdAt: string;
};

type QuestionOption = {
  optionId: string;
  label: "A" | "B" | "C" | "D";
  text: string;
};

type CommonErrorMapping = {
  optionId: string;
  errorType: string;
};

type MvpQuestion = {
  questionId: string;
  sessionType: "mechanical_starting_point";
  pathwayId: PathwayId;
  domain: "mechanical";
  subcompetency: MechanicalSubcompetency;
  concept: string;
  difficulty: Difficulty;
  stem: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  commonErrorMappings?: CommonErrorMapping[];
};

type AssessmentSession = {
  sessionId: string;
  sessionType: "mechanical_starting_point";
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

type Observation = {
  observationId: string;
  title: string;
  summary: string;
  evidenceIds: string[];
  confidence: Confidence;
  createdAt: string;
};

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
    | "follow_up_diagnostic";
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
  whyExplanationId?: string;
  createdAt: string;
};

type Milestone = {
  milestoneId: string;
  type: "starting_point_established" | "first_focus_identified" | "dashboard_created";
  label: string;
  createdAt: string;
};

type DashboardState = {
  dashboardStateId: string;
  currentRecommendationId?: string;
  currentFocusLabel?: string;
  readinessSnapshotId?: string;
  recentMilestoneIds: string[];
  baselineSummary?: {
    mechanicalQuestionsCompleted: number;
    strongestArea?: string;
    focusArea?: string;
  };
  saveStatus: "local_only" | "username_account";
  updatedAt: string;
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
  dashboardState?: DashboardState;
  updatedAt: string;
};

type AdvisorDecisionPackage = {
  observations: Observation[];
  constraints: PreparationConstraint[];
  recommendations: Recommendation[];
  whyExplanations: WhyExplanation[];
  readinessSnapshots: ReadinessSnapshot[];
  milestones: Milestone[];
  dashboardState: DashboardState;
};

const MVP_GUEST_JOURNEY_KEY = "flospatial.mvpGuestJourney.v1";

function id(prefix: string) {
  const cryptoId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `${prefix}-${cryptoId}`;
}

function now() {
  return new Date().toISOString();
}

function createEmptyMvpGuestJourney(): MvpGuestJourney {
  return {
    version: "mvp_v1",
    guestJourneyId: id("guest"),
    sessions: [],
    responses: [],
    competencyEvidence: [],
    observations: [],
    constraints: [],
    recommendations: [],
    whyExplanations: [],
    readinessSnapshots: [],
    milestones: [],
    updatedAt: now(),
  };
}

function loadMvpGuestJourney(): MvpGuestJourney {
  if (typeof window === "undefined") return createEmptyMvpGuestJourney();
  const raw = window.localStorage.getItem(MVP_GUEST_JOURNEY_KEY);
  if (!raw) return createEmptyMvpGuestJourney();

  try {
    const parsed = JSON.parse(raw) as MvpGuestJourney;
    if (parsed.version !== "mvp_v1") return createEmptyMvpGuestJourney();
    return {
      ...createEmptyMvpGuestJourney(),
      ...parsed,
      sessions: parsed.sessions ?? [],
      responses: parsed.responses ?? [],
      competencyEvidence: parsed.competencyEvidence ?? [],
      observations: parsed.observations ?? [],
      constraints: parsed.constraints ?? [],
      recommendations: parsed.recommendations ?? [],
      whyExplanations: parsed.whyExplanations ?? [],
      readinessSnapshots: parsed.readinessSnapshots ?? [],
      milestones: parsed.milestones ?? [],
    };
  } catch {
    return createEmptyMvpGuestJourney();
  }
}

function saveMvpGuestJourney(journey: MvpGuestJourney) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MVP_GUEST_JOURNEY_KEY, JSON.stringify({ ...journey, updatedAt: now() }));
}

function resetMvpGuestJourney() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MVP_GUEST_JOURNEY_KEY);
}

function q(
  questionId: string,
  subcompetency: MechanicalSubcompetency,
  concept: string,
  difficulty: Difficulty,
  stem: string,
  options: [string, string, string, string],
  correctLabel: "A" | "B" | "C" | "D",
  explanation: string,
  commonErrorMappings?: CommonErrorMapping[]
): MvpQuestion {
  const labels: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
  const mappedOptions = labels.map((label, index) => ({
    optionId: `${questionId}-${label}`,
    label,
    text: options[index],
  }));

  return {
    questionId,
    sessionType: "mechanical_starting_point",
    pathwayId: "fire_service",
    domain: "mechanical",
    subcompetency,
    concept,
    difficulty,
    stem,
    options: mappedOptions,
    correctOptionId: `${questionId}-${correctLabel}`,
    explanation,
    commonErrorMappings,
  };
}

const fireServiceMechanicalQuestions: MvpQuestion[] = [
  q(
    "HYD-B-001",
    "hydraulics",
    "pressure_transfer",
    "foundational",
    "In a sealed hydraulic system filled with fluid, what happens when force is applied to one piston?",
    [
      "The pressure is transmitted through the fluid.",
      "The pressure disappears inside the fluid.",
      "The fluid prevents force from reaching the other piston.",
      "The pressure only acts on the piston being pushed.",
    ],
    "A",
    "In a closed hydraulic system, pressure applied at one point is transmitted through the fluid."
  ),
  q(
    "HYD-B-002",
    "hydraulics",
    "pressure_transfer",
    "foundational",
    "Two pistons are connected by a sealed fluid-filled line. If the left piston is pushed inward, what is the best description of what happens inside the fluid?",
    [
      "Pressure is transmitted through the fluid toward the other piston.",
      "The fluid absorbs the pressure and stops moving.",
      "Pressure only travels if the fluid is replaced by air.",
      "The pressure remains only under the left piston.",
    ],
    "A",
    "The fluid transmits pressure through the sealed system."
  ),
  q(
    "HYD-B-003",
    "hydraulics",
    "piston_area_force",
    "foundational",
    "A small input piston is connected to a larger output piston by fluid. What is the main advantage of the larger output piston?",
    [
      "It can produce greater output force from the same pressure.",
      "It makes the fluid disappear.",
      "It reduces all pressure in the system.",
      "It makes the input piston move less forcefully.",
    ],
    "A",
    "The same pressure acting over a larger area can produce greater force."
  ),
  q(
    "HYD-B-004",
    "hydraulics",
    "force_distance_tradeoff",
    "developing",
    "In a hydraulic jack, a small piston may move a long distance while a larger piston lifts a heavy load a shorter distance. What does this show?",
    [
      "Hydraulic force multiplication involves a movement-distance tradeoff.",
      "Pressure is lost before it reaches the large piston.",
      "The large piston is weaker than the small piston.",
      "The fluid is not transmitting force.",
    ],
    "A",
    "Hydraulics can increase force, but this usually comes with a tradeoff in movement distance."
  ),
  q(
    "HYD-B-005",
    "hydraulics",
    "movement_direction",
    "foundational",
    "In a simple two-piston hydraulic system, the left piston is pushed downward into the cylinder. What will the right piston usually do?",
    ["Move upward.", "Move downward.", "Stay fixed because pressure cannot travel through fluid.", "Move only if the system contains air."],
    "A",
    "Pushing one piston down displaces fluid and usually drives the other piston upward."
  ),
  q(
    "HYD-B-006",
    "hydraulics",
    "solving_strategy",
    "developing",
    "When solving a hydraulic movement problem, which is usually the best first step?",
    [
      "Trace the input force, pressure path and output movement.",
      "Guess which piston looks heavier.",
      "Assume the output always moves downward.",
      "Ignore the direction of the input piston.",
    ],
    "A",
    "Hydraulic movement questions are best solved by tracing the input, pressure path and output movement."
  ),
  q(
    "HYD-B-007",
    "hydraulics",
    "applied_jack",
    "applied",
    "A hydraulic jack lifts a vehicle using a small handle piston and a larger lifting piston. Why can the larger piston lift the vehicle?",
    [
      "Pressure is transmitted through the fluid and acts over the larger piston area.",
      "The vehicle becomes lighter when the handle is pushed.",
      "The fluid removes gravity from the vehicle.",
      "Pressure disappears before reaching the lifting piston.",
    ],
    "A",
    "The transmitted pressure acts over the larger output piston area, producing greater lifting force."
  ),
  q(
    "HYD-B-008",
    "hydraulics",
    "applied_press",
    "applied",
    "A hydraulic press uses a small input piston and a large pressing piston. Which statement best explains how it produces a large pressing force?",
    [
      "The same pressure acts over the larger piston area.",
      "The pressure becomes weaker as it travels.",
      "The input piston cancels the output force.",
      "The fluid turns into a solid under pressure.",
    ],
    "A",
    "A larger output piston can produce more force because pressure acts over a greater area."
  ),
  q("GEAR-B-001", "gears", "meshed_direction", "foundational", "Two gears are touching. If the left gear turns clockwise, what direction will the right gear turn?", ["Clockwise", "Anticlockwise", "It will not turn", "It will turn upward only"], "B", "Meshed gears turn in opposite directions."),
  q("GEAR-B-002", "gears", "three_gears", "developing", "Three gears are arranged in a row. If the first gear turns clockwise, what direction will the third gear turn?", ["Clockwise", "Anticlockwise", "It will not turn", "It depends only on the colour of the gear"], "A", "Each gear reverses direction. Gear 1 and gear 3 turn in the same direction."),
  q("GEAR-B-003", "gears", "gear_size_speed", "developing", "A small gear drives a larger gear. Compared with the small gear, the larger gear will usually rotate:", ["More slowly", "Faster", "At exactly the same speed in all cases", "Without moving"], "A", "A larger gear generally rotates more slowly than a smaller gear driving it."),
  q("GEAR-B-004", "gears", "driven_gear_direction", "foundational", "If Gear A directly drives Gear B, what is the key relationship between their rotation directions?", ["They rotate in opposite directions.", "They always rotate in the same direction.", "Gear B cannot rotate.", "Gear A becomes smaller."], "A", "Directly meshed gears rotate in opposite directions."),
  q("PULL-B-001", "pulleys", "fixed_pulley", "foundational", "What is the main effect of a single fixed pulley?", ["It changes the direction of the pulling force.", "It removes the weight of the load.", "It doubles the force automatically.", "It stops the rope from moving."], "A", "A fixed pulley mainly changes the direction of force."),
  q("PULL-B-002", "pulleys", "movable_pulley", "foundational", "A movable pulley supporting a load can make lifting easier because:", ["More than one section of rope supports the load.", "The load disappears.", "The rope no longer has tension.", "Gravity stops acting on the load."], "A", "A movable pulley can reduce the effort required because multiple rope segments share the load."),
  q("PULL-B-003", "pulleys", "rope_sections", "developing", "In a pulley system, if two rope sections support the load, the effort required is usually:", ["Less than lifting the full load directly.", "Greater than the full load in every case.", "Exactly zero.", "Unrelated to the number of rope sections."], "A", "More supporting rope sections can reduce the effort required."),
  q("PULL-B-004", "pulleys", "pulley_tradeoff", "developing", "A pulley system reduces the effort needed to lift a load. What is the usual tradeoff?", ["You need to pull more rope distance.", "The load becomes weightless.", "The rope stops moving.", "The pulley removes friction completely."], "A", "Mechanical advantage usually trades lower effort for greater pulling distance."),
  q("LEV-B-001", "levers", "long_handle", "foundational", "A long handle on a tool can make it easier to turn or lift something because it:", ["Increases the turning effect of the applied force.", "Removes the force completely.", "Makes the object weightless.", "Stops the tool from moving."], "A", "A longer lever arm increases the turning effect, or moment, of a force."),
  q("LEV-B-002", "levers", "fulcrum_position", "developing", "A lever is used to lift a heavy object. Moving the fulcrum closer to the load usually means:", ["Less effort is needed, but the effort end moves farther.", "More effort is always needed.", "The lever stops working.", "The load becomes lighter."], "A", "Moving the fulcrum closer to the load can increase mechanical advantage, with a distance tradeoff."),
  q("LEV-B-003", "levers", "best_lifting_setup", "developing", "Which setup usually makes a heavy load easiest to lift with a lever?", ["Fulcrum close to the load and effort applied farther away.", "Fulcrum close to the effort and far from the load.", "No fulcrum at all.", "Effort applied at the load itself only."], "A", "A fulcrum close to the load and effort applied farther away gives better leverage."),
  q("LEV-B-004", "levers", "lever_tradeoff", "foundational", "A lever allows a person to lift a heavy load with less effort. What is the usual tradeoff?", ["The effort end moves a greater distance.", "The load has no weight.", "The fulcrum disappears.", "The load always moves farther than the effort."], "A", "Mechanical advantage reduces effort but usually requires movement over a greater distance."),
];

function calculateEvidenceStrength(attempted: number): EvidenceStrength {
  if (attempted === 0) return "none";
  if (attempted <= 5) return "early";
  if (attempted <= 14) return "emerging";
  if (attempted <= 29) return "strong";
  return "established";
}

function createMechanicalBaselineSession(): AssessmentSession {
  return {
    sessionId: id("session"),
    sessionType: "mechanical_starting_point",
    pathwayId: "fire_service",
    startedAt: now(),
    questionIds: fireServiceMechanicalQuestions.map((question) => question.questionId),
  };
}

function completeAssessmentSession(session: AssessmentSession): AssessmentSession {
  return { ...session, completedAt: now() };
}

function createAssessmentResponse({
  sessionId,
  question,
  selectedOptionId,
  responseTimeMs,
  notSureSelected,
}: {
  sessionId: string;
  question: MvpQuestion;
  selectedOptionId: string | null;
  responseTimeMs: number;
  notSureSelected: boolean;
}): AssessmentResponse {
  return {
    responseId: id("response"),
    sessionId,
    questionId: question.questionId,
    selectedOptionId,
    correct: selectedOptionId === question.correctOptionId,
    responseTimeMs,
    notSureSelected,
    answeredAt: now(),
  };
}

function calculateMechanicalEvidence({
  session,
  responses,
  questions,
}: {
  session: AssessmentSession;
  responses: AssessmentResponse[];
  questions: MvpQuestion[];
}): CompetencyEvidence[] {
  const subcompetencies: MechanicalSubcompetency[] = ["hydraulics", "gears", "pulleys", "levers"];

  return subcompetencies.map((subcompetency) => {
    const subQuestionIds = new Set(
      questions.filter((question) => question.subcompetency === subcompetency).map((question) => question.questionId)
    );
    const subResponses = responses.filter((response) => subQuestionIds.has(response.questionId));
    const attempted = subResponses.length;
    const correct = subResponses.filter((response) => response.correct).length;
    const accuracy = attempted > 0 ? correct / attempted : 0;

    return {
      evidenceId: id("evidence"),
      domain: "mechanical",
      subcompetency,
      attempted,
      correct,
      accuracy,
      evidenceStrength: calculateEvidenceStrength(attempted),
      sourceSessionId: session.sessionId,
      updatedAt: now(),
    };
  });
}

function getEvidence(evidence: CompetencyEvidence[], subcompetency: MechanicalSubcompetency): CompetencyEvidence {
  const found = evidence.find((item) => item.subcompetency === subcompetency);
  if (!found) throw new Error(`Missing evidence for ${subcompetency}`);
  return found;
}

function hasHydraulicsSpecificConstraint(evidence: CompetencyEvidence[]): boolean {
  const hydraulics = getEvidence(evidence, "hydraulics");
  const gears = getEvidence(evidence, "gears");
  const pulleys = getEvidence(evidence, "pulleys");
  const levers = getEvidence(evidence, "levers");
  const otherMechanicalAverage = (gears.accuracy + pulleys.accuracy + levers.accuracy) / 3;
  return hydraulics.attempted >= 6 && hydraulics.accuracy <= 0.5 && otherMechanicalAverage >= 0.6;
}

function hasBroadMechanicalConstraint(evidence: CompetencyEvidence[]): boolean {
  const hydraulics = getEvidence(evidence, "hydraulics");
  const gears = getEvidence(evidence, "gears");
  const pulleys = getEvidence(evidence, "pulleys");
  const levers = getEvidence(evidence, "levers");
  return hydraulics.accuracy <= 0.5 && gears.accuracy <= 0.5 && pulleys.accuracy <= 0.5 && levers.accuracy <= 0.5;
}

function active(items: Recommendation[]) {
  return items.filter((item) => item.status === "active");
}

function createHydraulicSpecificDecision(evidence: CompetencyEvidence[]): AdvisorDecisionPackage {
  const hydraulics = getEvidence(evidence, "hydraulics");
  const observation: Observation = {
    observationId: id("observation"),
    title: "Hydraulic-force reasoning stood out",
    summary: "Hydraulic-force reasoning appears to be the clearest preparation focus from this starting point assessment.",
    evidenceIds: evidence.map((item) => item.evidenceId),
    confidence: "moderate",
    createdAt: now(),
  };

  const constraint: PreparationConstraint = {
    constraintId: id("constraint"),
    constraintType: "foundation_knowledge",
    domain: "mechanical",
    subcompetency: "hydraulics",
    status: "identified",
    confidence: "moderate",
    observationId: observation.observationId,
    createdAt: now(),
    updatedAt: now(),
  };

  const whyExplanation: WhyExplanation = {
    whyExplanationId: id("why"),
    title: "Why Hydraulic Fundamentals is recommended",
    observation: "Hydraulic-force reasoning stood out as the clearest preparation focus in your starting point assessment.",
    evidence: `You answered ${hydraulics.correct} of ${hydraulics.attempted} hydraulic questions correctly. Your gears, pulleys and levers results were stronger.`,
    interpretation: "This suggests hydraulics may be a specific mechanical reasoning constraint rather than a broad mechanical reasoning issue.",
    recommendation: "Hydraulic Fundamentals is recommended because it targets pressure transfer, piston size, force multiplication and movement direction.",
    confidence: "Moderate. This is enough evidence to guide a first preparation step, but not enough to judge overall readiness.",
    createdAt: now(),
  };

  const recommendation: Recommendation = {
    recommendationId: id("recommendation"),
    recommendationType: "start_hydraulic_fundamentals",
    title: "Start Hydraulic Fundamentals",
    summary: "Build the foundation concepts behind pressure transfer, piston size, force multiplication and movement direction.",
    actionLabel: "Start Hydraulic Fundamentals",
    confidence: "moderate",
    whyExplanationId: whyExplanation.whyExplanationId,
    status: "active",
    createdAt: now(),
  };

  const readinessSnapshot: ReadinessSnapshot = {
    readinessSnapshotId: id("readiness"),
    state: "early_evidence",
    label: "Early evidence — readiness not yet assessed",
    explanation: "Your starting point assessment has identified an initial preparation focus, but readiness requires more evidence over time.",
    confidence: "high",
    createdAt: now(),
  };

  const milestones: Milestone[] = [
    { milestoneId: id("milestone"), type: "starting_point_established", label: "Starting point established", createdAt: now() },
    { milestoneId: id("milestone"), type: "first_focus_identified", label: "First preparation focus identified", createdAt: now() },
  ];

  const dashboardState: DashboardState = {
    dashboardStateId: id("dashboard"),
    currentRecommendationId: recommendation.recommendationId,
    currentFocusLabel: "Hydraulic-force reasoning",
    readinessSnapshotId: readinessSnapshot.readinessSnapshotId,
    recentMilestoneIds: milestones.map((milestone) => milestone.milestoneId),
    baselineSummary: { mechanicalQuestionsCompleted: 20, focusArea: "Hydraulics" },
    saveStatus: "local_only",
    updatedAt: now(),
  };

  return { observations: [observation], constraints: [constraint], recommendations: [recommendation], whyExplanations: [whyExplanation], readinessSnapshots: [readinessSnapshot], milestones, dashboardState };
}

function createBroadMechanicalDecision(evidence: CompetencyEvidence[]): AdvisorDecisionPackage {
  const observation: Observation = {
    observationId: id("observation"),
    title: "Broad mechanical reasoning pattern",
    summary: "Mechanical reasoning foundations appear broadly constrained in this starting point assessment.",
    evidenceIds: evidence.map((item) => item.evidenceId),
    confidence: "moderate",
    createdAt: now(),
  };
  const constraint: PreparationConstraint = {
    constraintId: id("constraint"),
    constraintType: "broad_foundation",
    domain: "mechanical",
    status: "identified",
    confidence: "moderate",
    observationId: observation.observationId,
    createdAt: now(),
    updatedAt: now(),
  };
  const whyExplanation: WhyExplanation = {
    whyExplanationId: id("why"),
    title: "Why broader mechanical foundation work is recommended",
    observation: "Several mechanical reasoning areas appeared constrained rather than one topic standing out clearly.",
    evidence: "Hydraulics, gears, pulleys and levers were all below the current starting-point threshold.",
    interpretation: "This suggests the first preparation focus should not be limited to hydraulics alone.",
    recommendation: "Broader mechanical foundation work is recommended before narrowing to a single mechanical topic.",
    confidence: "Moderate. The pattern is clear enough for a first step, but this remains early evidence.",
    createdAt: now(),
  };
  const recommendation: Recommendation = {
    recommendationId: id("recommendation"),
    recommendationType: "start_mechanical_foundations",
    title: "Start Mechanical Foundations",
    summary: "Build broad mechanical reasoning foundations before focusing on a single topic.",
    actionLabel: "Start Mechanical Foundations",
    confidence: "moderate",
    whyExplanationId: whyExplanation.whyExplanationId,
    status: "active",
    createdAt: now(),
  };
  const readinessSnapshot: ReadinessSnapshot = {
    readinessSnapshotId: id("readiness"),
    state: "early_evidence",
    label: "Early evidence — readiness not yet assessed",
    explanation: "Your starting point assessment has identified a broad foundation pattern, but readiness requires more evidence over time.",
    confidence: "high",
    createdAt: now(),
  };
  const milestones: Milestone[] = [
    { milestoneId: id("milestone"), type: "starting_point_established", label: "Starting point established", createdAt: now() },
    { milestoneId: id("milestone"), type: "first_focus_identified", label: "First preparation focus identified", createdAt: now() },
  ];
  const dashboardState: DashboardState = {
    dashboardStateId: id("dashboard"),
    currentRecommendationId: recommendation.recommendationId,
    currentFocusLabel: "Mechanical foundations",
    readinessSnapshotId: readinessSnapshot.readinessSnapshotId,
    recentMilestoneIds: milestones.map((milestone) => milestone.milestoneId),
    baselineSummary: { mechanicalQuestionsCompleted: 20, focusArea: "Mechanical foundations" },
    saveStatus: "local_only",
    updatedAt: now(),
  };

  return { observations: [observation], constraints: [constraint], recommendations: [recommendation], whyExplanations: [whyExplanation], readinessSnapshots: [readinessSnapshot], milestones, dashboardState };
}

function createNoClearPrimaryDecision(evidence: CompetencyEvidence[]): AdvisorDecisionPackage {
  const best = [...evidence].sort((a, b) => a.accuracy - b.accuracy)[0];
  const observation: Observation = {
    observationId: id("observation"),
    title: "No single focus is clear yet",
    summary: "The starting point assessment did not identify one clear preparation constraint.",
    evidenceIds: evidence.map((item) => item.evidenceId),
    confidence: "low",
    createdAt: now(),
  };
  const constraint: PreparationConstraint = {
    constraintId: id("constraint"),
    constraintType: "insufficient_evidence",
    domain: "mechanical",
    status: "identified",
    confidence: "low",
    observationId: observation.observationId,
    createdAt: now(),
    updatedAt: now(),
  };
  const whyExplanation: WhyExplanation = {
    whyExplanationId: id("why"),
    title: "Why a follow-up diagnostic is recommended",
    observation: "FloSpatial does not yet have one clear preparation focus from this starting point assessment.",
    evidence: `The lowest sampled area was ${labelSubcompetency(best.subcompetency)}, but the pattern was not strong enough to make a narrow recommendation responsibly.`,
    interpretation: "Forcing a recommendation from mixed evidence would be less trustworthy than collecting a little more targeted information.",
    recommendation: "A short follow-up diagnostic is recommended to clarify the best next step.",
    confidence: "Low to moderate. The recommendation is cautious because the current evidence is not yet specific enough.",
    createdAt: now(),
  };
  const recommendation: Recommendation = {
    recommendationId: id("recommendation"),
    recommendationType: "follow_up_diagnostic",
    title: "Complete a short follow-up diagnostic",
    summary: "Gather a little more evidence before choosing a narrow preparation focus.",
    actionLabel: "Start follow-up diagnostic",
    confidence: "low",
    whyExplanationId: whyExplanation.whyExplanationId,
    status: "active",
    createdAt: now(),
  };
  const readinessSnapshot: ReadinessSnapshot = {
    readinessSnapshotId: id("readiness"),
    state: "early_evidence",
    label: "Early evidence — readiness not yet assessed",
    explanation: "FloSpatial has starting point evidence, but not yet enough to make a confident preparation-focus judgement.",
    confidence: "high",
    createdAt: now(),
  };
  const milestones: Milestone[] = [{ milestoneId: id("milestone"), type: "starting_point_established", label: "Starting point established", createdAt: now() }];
  const dashboardState: DashboardState = {
    dashboardStateId: id("dashboard"),
    currentRecommendationId: recommendation.recommendationId,
    readinessSnapshotId: readinessSnapshot.readinessSnapshotId,
    recentMilestoneIds: milestones.map((milestone) => milestone.milestoneId),
    baselineSummary: { mechanicalQuestionsCompleted: 20 },
    saveStatus: "local_only",
    updatedAt: now(),
  };

  return { observations: [observation], constraints: [constraint], recommendations: [recommendation], whyExplanations: [whyExplanation], readinessSnapshots: [readinessSnapshot], milestones, dashboardState };
}

function runBaselineAdvisorRules(evidence: CompetencyEvidence[]): AdvisorDecisionPackage {
  if (hasBroadMechanicalConstraint(evidence)) return createBroadMechanicalDecision(evidence);
  if (hasHydraulicsSpecificConstraint(evidence)) return createHydraulicSpecificDecision(evidence);
  return createNoClearPrimaryDecision(evidence);
}

function completeMechanicalBaseline(journey: MvpGuestJourney, sessionId: string): MvpGuestJourney {
  const session = journey.sessions.find((item) => item.sessionId === sessionId);
  if (!session) throw new Error("Active session not found");
  const completedSession = completeAssessmentSession(session);
  const responses = journey.responses.filter((response) => response.sessionId === session.sessionId);
  const evidence = calculateMechanicalEvidence({ session: completedSession, responses, questions: fireServiceMechanicalQuestions });
  const decision = runBaselineAdvisorRules(evidence);
  const replacedRecommendations = journey.recommendations.map((recommendation) =>
    recommendation.status === "active" ? { ...recommendation, status: "replaced" as const } : recommendation
  );

  return {
    ...journey,
    sessions: journey.sessions.map((item) => (item.sessionId === session.sessionId ? completedSession : item)),
    competencyEvidence: [...journey.competencyEvidence, ...evidence],
    observations: [...journey.observations, ...decision.observations],
    constraints: [...journey.constraints, ...decision.constraints],
    recommendations: [...replacedRecommendations, ...decision.recommendations],
    whyExplanations: [...journey.whyExplanations, ...decision.whyExplanations],
    readinessSnapshots: [...journey.readinessSnapshots, ...decision.readinessSnapshots],
    milestones: [...journey.milestones, ...decision.milestones],
    dashboardState: decision.dashboardState,
    updatedAt: now(),
  };
}

function labelSubcompetency(subcompetency: MechanicalSubcompetency) {
  switch (subcompetency) {
    case "hydraulics":
      return "Hydraulics";
    case "gears":
      return "Gears";
    case "pulleys":
      return "Pulleys";
    case "levers":
      return "Levers";
  }
}

function getActiveRecommendation(journey: MvpGuestJourney): Recommendation | undefined {
  return journey.recommendations.find((item) => item.recommendationId === journey.dashboardState?.currentRecommendationId) ?? active(journey.recommendations)[0];
}

function getCurrentWhy(journey: MvpGuestJourney): WhyExplanation | undefined {
  const recommendation = getActiveRecommendation(journey);
  return journey.whyExplanations.find((item) => item.whyExplanationId === recommendation?.whyExplanationId);
}

function getCurrentReadinessSnapshot(journey: MvpGuestJourney): ReadinessSnapshot | undefined {
  return journey.readinessSnapshots.find((item) => item.readinessSnapshotId === journey.dashboardState?.readinessSnapshotId);
}

function getRecentMilestones(journey: MvpGuestJourney): Milestone[] {
  const ids = new Set(journey.dashboardState?.recentMilestoneIds ?? []);
  return journey.milestones.filter((milestone) => ids.has(milestone.milestoneId));
}

function getActiveSession(journey: MvpGuestJourney, activeSessionId?: string) {
  if (activeSessionId) return journey.sessions.find((session) => session.sessionId === activeSessionId);
  return [...journey.sessions].reverse().find((session) => !session.completedAt && session.sessionType === "mechanical_starting_point");
}

function getQuestionById(questionId: string) {
  return fireServiceMechanicalQuestions.find((question) => question.questionId === questionId);
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[28px] border border-white/5 bg-[#171C23] p-6 shadow-2xl shadow-black/10 ${className}`}>{children}</div>;
}

function PrimaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl border border-[#5ED3F3]/30 bg-[#5ED3F3]/10 px-6 py-4 font-medium text-[#D9F8FF] transition-all duration-300 hover:border-[#5ED3F3]/60 hover:bg-[#5ED3F3]/15 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl border border-white/10 px-6 py-4 font-medium text-[#C4CEDA] transition-colors hover:text-[#F4F6F8] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-full border border-[#5ED3F3]/20 bg-[#5ED3F3]/10 px-3 py-1 text-xs font-medium text-[#BCEFFF]">{children}</span>;
}

function AppHeader({ onReset }: { onReset: () => void }) {
  return (
    <header className="border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <div>
          <div className="text-xl font-semibold tracking-wide text-[#F4F6F8]">FloSpatial</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Preparation intelligence</div>
        </div>
        <button onClick={onReset} className="rounded-lg px-3 py-2 text-sm text-[#8D98A6] transition-colors hover:text-[#F4F6F8]">
          Reset demo
        </button>
      </div>
    </header>
  );
}

function LandingScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <main className="mx-auto max-w-7xl px-8 py-20">
      <section className="max-w-3xl">
        <Badge>No account or email required to begin</Badge>
        <h1 className="mt-8 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-[#F4F6F8] md:text-6xl">Prepare smarter for selection assessments.</h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">FloSpatial helps you identify what to work on, why it matters, and what to do next.</p>
        <div className="mt-12"><PrimaryButton onClick={onBegin}>Begin preparation</PrimaryButton></div>
      </section>
      <section className="mt-20 grid gap-5 md:grid-cols-3">
        <Card><h3 className="text-lg font-semibold text-[#F4F6F8]">Find your focus</h3><p className="mt-4 text-sm leading-relaxed text-[#9AA3B2]">FloSpatial looks for the preparation area most likely to matter next.</p></Card>
        <Card><h3 className="text-lg font-semibold text-[#F4F6F8]">Understand why</h3><p className="mt-4 text-sm leading-relaxed text-[#9AA3B2]">Every major recommendation includes a clear explanation.</p></Card>
        <Card><h3 className="text-lg font-semibold text-[#F4F6F8]">Track progress</h3><p className="mt-4 text-sm leading-relaxed text-[#9AA3B2]">Your preparation journey is saved on this device.</p></Card>
      </section>
    </main>
  );
}

function PathwaySelectionScreen({ onSelect }: { onSelect: () => void }) {
  const comingSoon = ["Military Aircrew", "Police Selection", "Defence Officer", "Emergency Services"];
  return (
    <main className="mx-auto max-w-6xl px-8 py-16">
      <h1 className="text-4xl font-semibold text-[#F4F6F8]">Choose your preparation pathway</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#9AA3B2]">FloSpatial adapts recommendations to the type of selection assessment you are preparing for.</p>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Card className="border-[#5ED3F3]/20">
          <div className="flex items-start justify-between gap-4"><h2 className="text-2xl font-semibold text-[#F4F6F8]">Fire Service</h2><Badge>Available</Badge></div>
          <p className="mt-4 leading-relaxed text-[#9AA3B2]">Mechanical, numerical and spatial reasoning preparation for Fire Service-style selection assessments.</p>
          <div className="mt-8"><PrimaryButton onClick={onSelect}>Select Fire Service</PrimaryButton></div>
        </Card>
        {comingSoon.map((item) => (
          <Card key={item} className="opacity-60">
            <div className="flex items-start justify-between gap-4"><h2 className="text-2xl font-semibold text-[#F4F6F8]">{item}</h2><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#8D98A6]">Coming soon</span></div>
            <p className="mt-4 leading-relaxed text-[#8D98A6]">This pathway will be added after the Fire Service MVP loop is working reliably.</p>
          </Card>
        ))}
      </div>
      <p className="mt-10 text-sm leading-relaxed text-[#6E7A88]">FloSpatial is not affiliated with or endorsed by any specific employer, agency or selection body.</p>
    </main>
  );
}

function OptionPill<T extends string>({ label, value, selected, onSelect }: { label: string; value: T; selected?: boolean; onSelect: (value: T) => void }) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`rounded-2xl border p-4 text-left transition-all ${selected ? "border-[#5ED3F3]/50 bg-[#5ED3F3]/10 text-[#D9F8FF]" : "border-white/10 bg-[#111418] text-[#C4CEDA] hover:border-white/20"}`}
    >
      {label}
    </button>
  );
}

function PreparationContextScreen({ initial, onContinue }: { initial?: PreparationContext; onContinue: (context: PreparationContext) => void }) {
  const [assessmentTiming, setAssessmentTiming] = useState<AssessmentTiming | undefined>(initial?.assessmentTiming);
  const [weeklyPrepTime, setWeeklyPrepTime] = useState<WeeklyPrepTime | undefined>(initial?.weeklyPrepTime);
  const [previousAttempt, setPreviousAttempt] = useState<PreviousAttempt | undefined>(initial?.previousAttempt);
  const [error, setError] = useState(false);

  function submit() {
    if (!assessmentTiming || !weeklyPrepTime || !previousAttempt) {
      setError(true);
      return;
    }
    onContinue({ assessmentTiming, weeklyPrepTime, previousAttempt, createdAt: initial?.createdAt ?? now() });
  }

  return (
    <main className="mx-auto max-w-4xl px-8 py-16">
      <h1 className="text-4xl font-semibold text-[#F4F6F8]">Tell us about your preparation</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#9AA3B2]">This helps FloSpatial choose a realistic next step. You can begin without entering your name or email.</p>
      <Card className="mt-10 space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-[#F4F6F8]">When is your assessment?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <OptionPill label="I do not know yet" value="unknown" selected={assessmentTiming === "unknown"} onSelect={setAssessmentTiming} />
            <OptionPill label="Within 2 weeks" value="within_2_weeks" selected={assessmentTiming === "within_2_weeks"} onSelect={setAssessmentTiming} />
            <OptionPill label="2–6 weeks" value="two_to_six_weeks" selected={assessmentTiming === "two_to_six_weeks"} onSelect={setAssessmentTiming} />
            <OptionPill label="6–12 weeks" value="six_to_twelve_weeks" selected={assessmentTiming === "six_to_twelve_weeks"} onSelect={setAssessmentTiming} />
            <OptionPill label="More than 12 weeks" value="more_than_twelve_weeks" selected={assessmentTiming === "more_than_twelve_weeks"} onSelect={setAssessmentTiming} />
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[#F4F6F8]">How much time can you usually prepare each week?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <OptionPill label="Less than 1 hour" value="less_than_one_hour" selected={weeklyPrepTime === "less_than_one_hour"} onSelect={setWeeklyPrepTime} />
            <OptionPill label="1–2 hours" value="one_to_two_hours" selected={weeklyPrepTime === "one_to_two_hours"} onSelect={setWeeklyPrepTime} />
            <OptionPill label="3–5 hours" value="three_to_five_hours" selected={weeklyPrepTime === "three_to_five_hours"} onSelect={setWeeklyPrepTime} />
            <OptionPill label="More than 5 hours" value="more_than_five_hours" selected={weeklyPrepTime === "more_than_five_hours"} onSelect={setWeeklyPrepTime} />
            <OptionPill label="Not sure" value="not_sure" selected={weeklyPrepTime === "not_sure"} onSelect={setWeeklyPrepTime} />
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[#F4F6F8]">Have you attempted a similar assessment before?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <OptionPill label="No" value="no" selected={previousAttempt === "no"} onSelect={setPreviousAttempt} />
            <OptionPill label="Yes" value="yes" selected={previousAttempt === "yes"} onSelect={setPreviousAttempt} />
            <OptionPill label="Prefer not to say" value="prefer_not_to_say" selected={previousAttempt === "prefer_not_to_say"} onSelect={setPreviousAttempt} />
          </div>
        </section>
        {error && <p className="text-sm text-[#FF9A9A]">Please choose an option for each question before continuing.</p>}
        <PrimaryButton onClick={submit}>Continue</PrimaryButton>
      </Card>
    </main>
  );
}

function BaselineIntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto flex max-w-4xl items-center px-8 py-20">
      <Card className="w-full text-center">
        <p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Mechanical reasoning</p>
        <h1 className="mt-5 text-4xl font-semibold text-[#F4F6F8]">Starting Point Assessment</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">This first section looks at mechanical reasoning. FloSpatial will use your responses to identify an initial preparation focus.</p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#8D98A6]">This is not a pass/fail test. It is used to guide your preparation.</p>
        <div className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-4">
          {['20 questions', 'No timer', 'No account required', 'No live score'].map((item) => <div key={item} className="rounded-2xl border border-white/5 bg-[#111418] p-4 text-sm text-[#C4CEDA]">{item}</div>)}
        </div>
        <div className="mt-10"><PrimaryButton onClick={onStart}>Start assessment</PrimaryButton></div>
      </Card>
    </main>
  );
}

function QuestionScreen({ session, responses, onAnswer }: { session: AssessmentSession; responses: AssessmentResponse[]; onAnswer: (question: MvpQuestion, selectedOptionId: string | null, responseTimeMs: number, notSureSelected: boolean) => void }) {
  const answeredIds = new Set(responses.filter((response) => response.sessionId === session.sessionId).map((response) => response.questionId));
  const questionIndex = Math.max(0, session.questionIds.findIndex((questionId) => !answeredIds.has(questionId)));
  const questionId = session.questionIds[questionIndex] ?? session.questionIds[session.questionIds.length - 1];
  const question = getQuestionById(questionId)!;
  const [startedAt, setStartedAt] = useState(Date.now());

  useEffect(() => setStartedAt(Date.now()), [question.questionId]);
  const current = questionIndex + 1;
  const total = session.questionIds.length;

  function select(optionId: string | null, notSureSelected: boolean) {
    onAnswer(question, optionId, Date.now() - startedAt, notSureSelected);
  }

  return (
    <main className="mx-auto max-w-5xl px-8 py-12">
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#5ED3F3]/70" style={{ width: `${(current / total) * 100}%` }} /></div>
      <div className="mb-8 flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Starting Point Assessment</p><h1 className="mt-3 text-2xl font-semibold text-[#F4F6F8]">Mechanical reasoning</h1></div><div className="text-right text-sm text-[#8D98A6]">Question {current} of {total}</div></div>
      <Card>
        <p className="text-xl leading-relaxed text-[#F4F6F8]">{question.stem}</p>
        <div className="mt-8 grid gap-4">
          {question.options.map((option) => (
            <button key={option.optionId} onClick={() => select(option.optionId, false)} className="rounded-2xl border border-white/10 bg-[#111418] p-5 text-left transition-all hover:border-[#5ED3F3]/40">
              <span className="mr-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-sm text-[#BFD8E5]">{option.label}</span>
              <span className="text-[#DCE3EA]">{option.text}</span>
            </button>
          ))}
        </div>
        <div className="mt-6"><SecondaryButton onClick={() => select(null, true)}>I’m not sure</SecondaryButton></div>
      </Card>
    </main>
  );
}

function AssessmentCompleteScreen({ onViewInsight }: { onViewInsight: () => void }) {
  return (
    <main className="mx-auto flex max-w-3xl items-center px-8 py-24">
      <Card className="w-full text-center">
        <h1 className="text-4xl font-semibold text-[#F4F6F8]">Starting point assessment complete</h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#9AA3B2]">FloSpatial has reviewed your responses and prepared your first preparation insight.</p>
        <div className="mt-10"><PrimaryButton onClick={onViewInsight}>View insight</PrimaryButton></div>
      </Card>
    </main>
  );
}

function WhyModal({ why, onClose }: { why?: WhyExplanation; onClose: () => void }) {
  if (!why) return null;
  const sections = [
    ["Observation", why.observation],
    ["Evidence", why.evidence],
    ["Interpretation", why.interpretation],
    ["Recommendation", why.recommendation],
    ["Confidence", why.confidence],
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-[30px] border border-white/10 bg-[#171C23] p-8 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-6"><div><p className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">Why explanation</p><h2 className="mt-3 text-3xl font-semibold text-[#F4F6F8]">{why.title}</h2></div><button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-[#8D98A6] hover:text-[#F4F6F8]">Close</button></div>
        <div className="mt-8 space-y-6">
          {sections.map(([label, body]) => <section key={label}><div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">{label}</div><p className="mt-2 leading-relaxed text-[#C8D2DD]">{body}</p></section>)}
        </div>
        <p className="mt-8 border-t border-white/5 pt-6 text-sm leading-relaxed text-[#6E7A88]">FloSpatial uses this explanation to keep recommendations transparent and evidence-based.</p>
      </div>
    </div>
  );
}

function AdvisorInsightScreen({ journey, onWhy, onDashboard }: { journey: MvpGuestJourney; onWhy: () => void; onDashboard: () => void }) {
  const recommendation = getActiveRecommendation(journey);
  const constraint = journey.constraints[journey.constraints.length - 1];
  const mainInsight = constraint?.constraintType === "broad_foundation"
    ? "Mechanical reasoning foundations appear to need broader attention."
    : constraint?.constraintType === "insufficient_evidence"
      ? "FloSpatial does not yet have one clear preparation focus."
      : "Hydraulic-force reasoning currently appears to be your highest-value preparation focus.";

  return (
    <main className="mx-auto max-w-4xl px-8 py-16">
      <p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Your first preparation insight</p>
      <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-[#F4F6F8]">{mainInsight}</h1>
      <Card className="mt-10">
        <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div>
        <h2 className="mt-4 text-3xl font-semibold text-[#F4F6F8]">{recommendation?.title}</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[#9AA3B2]">{recommendation?.summary}</p>
        <div className="mt-6"><Badge>{recommendation?.confidence === "moderate" ? "Moderate confidence" : recommendation?.confidence === "low" ? "Low confidence" : "High confidence"}</Badge></div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton><PrimaryButton onClick={onDashboard}>View dashboard</PrimaryButton></div>
      </Card>
    </main>
  );
}

function DashboardScreen({ journey, onWhy }: { journey: MvpGuestJourney; onWhy: () => void }) {
  const recommendation = getActiveRecommendation(journey);
  const readiness = getCurrentReadinessSnapshot(journey);
  const milestones = getRecentMilestones(journey);
  return (
    <main className="mx-auto max-w-7xl px-8 py-14">
      <div className="mb-10"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Preparation dashboard</p><h1 className="mt-4 text-4xl font-semibold text-[#F4F6F8]">Your next step is ready</h1></div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#5ED3F3]/15">
          <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div>
          <h2 className="mt-4 text-3xl font-semibold text-[#F4F6F8]">{recommendation?.title}</h2>
          <p className="mt-4 leading-relaxed text-[#9AA3B2]">{recommendation?.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><PrimaryButton disabled>{recommendation?.actionLabel} — coming soon</PrimaryButton><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton></div>
        </Card>
        <Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Current focus</div><h3 className="mt-4 text-2xl font-semibold text-[#F4F6F8]">{journey.dashboardState?.currentFocusLabel ?? "Clarifying focus"}</h3><p className="mt-4 text-sm leading-relaxed text-[#9AA3B2]">This is the preparation area FloSpatial currently recommends addressing first.</p></Card>
        <Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Readiness snapshot</div><h3 className="mt-4 text-2xl font-semibold text-[#F4F6F8]">{readiness?.label ?? "Not enough evidence yet"}</h3><p className="mt-4 text-sm leading-relaxed text-[#9AA3B2]">{readiness?.explanation ?? "Complete a starting point assessment to begin building readiness evidence."}</p></Card>
        <Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recent progress</div><div className="mt-4 space-y-3">{milestones.map((milestone) => <div key={milestone.milestoneId} className="rounded-xl border border-white/5 bg-[#111418] px-4 py-3 text-[#C8D2DD]">{milestone.label}</div>)}</div></Card>
        <Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Starting point summary</div><h3 className="mt-4 text-2xl font-semibold text-[#F4F6F8]">{journey.dashboardState?.baselineSummary?.mechanicalQuestionsCompleted ?? 0} mechanical questions completed</h3><p className="mt-4 text-sm leading-relaxed text-[#9AA3B2]">{journey.dashboardState?.baselineSummary?.focusArea ? `Initial focus: ${journey.dashboardState.baselineSummary.focusArea}` : "Initial focus requires more evidence."}</p></Card>
        <Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Save status</div><h3 className="mt-4 text-2xl font-semibold text-[#F4F6F8]">Progress saved on this device.</h3><p className="mt-4 text-sm leading-relaxed text-[#9AA3B2]">You can continue without creating an account. A free username option will be added later if you want to preserve your journey across devices.</p></Card>
      </div>
    </main>
  );
}

function getInitialScreen(journey: MvpGuestJourney): AppScreen {
  if (journey.dashboardState) return "dashboard";
  if (journey.responses.length > 0 && journey.sessions.some((session) => !session.completedAt)) return "mechanical-baseline-question";
  if (journey.preparationContext) return "mechanical-baseline-intro";
  if (journey.selectedPathwayId) return "preparation-context";
  return "landing";
}

export default function FloSpatialMvp() {
  const [journey, setJourney] = useState<MvpGuestJourney>(() => loadMvpGuestJourney());
  const [screen, setScreen] = useState<AppScreen>(() => getInitialScreen(loadMvpGuestJourney()));
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(() => getActiveSession(loadMvpGuestJourney())?.sessionId);
  const [whyOpen, setWhyOpen] = useState(false);

  function commit(nextJourney: MvpGuestJourney) {
    saveMvpGuestJourney(nextJourney);
    setJourney(nextJourney);
  }

  const activeSession = useMemo(() => getActiveSession(journey, activeSessionId), [journey, activeSessionId]);
  const activeSessionResponses = activeSession ? journey.responses.filter((response) => response.sessionId === activeSession.sessionId) : [];

  function resetDemo() {
    resetMvpGuestJourney();
    const empty = createEmptyMvpGuestJourney();
    setJourney(empty);
    setActiveSessionId(undefined);
    setScreen("landing");
    setWhyOpen(false);
  }

  function handleSelectFireService() {
    commit({ ...journey, selectedPathwayId: "fire_service", updatedAt: now() });
    setScreen("preparation-context");
  }

  function handlePreparationContext(context: PreparationContext) {
    commit({ ...journey, preparationContext: context, updatedAt: now() });
    setScreen("mechanical-baseline-intro");
  }

  function handleStartBaseline() {
    const session = createMechanicalBaselineSession();
    commit({ ...journey, sessions: [...journey.sessions, session], updatedAt: now() });
    setActiveSessionId(session.sessionId);
    setScreen("mechanical-baseline-question");
  }

  function handleAnswer(question: MvpQuestion, selectedOptionId: string | null, responseTimeMs: number, notSureSelected: boolean) {
    if (!activeSession) return;
    const response = createAssessmentResponse({ sessionId: activeSession.sessionId, question, selectedOptionId, responseTimeMs, notSureSelected });
    const nextJourney: MvpGuestJourney = { ...journey, responses: [...journey.responses, response], updatedAt: now() };
    const answeredCount = nextJourney.responses.filter((item) => item.sessionId === activeSession.sessionId).length;

    if (answeredCount >= activeSession.questionIds.length) {
      const completed = completeMechanicalBaseline(nextJourney, activeSession.sessionId);
      commit(completed);
      setScreen("assessment-complete");
      return;
    }

    commit(nextJourney);
  }

  const why = getCurrentWhy(journey);

  return (
    <main className="min-h-screen bg-[#111418] font-sans text-[#F4F6F8]">
      <AppHeader onReset={resetDemo} />
      {screen === "landing" && <LandingScreen onBegin={() => setScreen("pathway-selection")} />}
      {screen === "pathway-selection" && <PathwaySelectionScreen onSelect={handleSelectFireService} />}
      {screen === "preparation-context" && <PreparationContextScreen initial={journey.preparationContext} onContinue={handlePreparationContext} />}
      {screen === "mechanical-baseline-intro" && <BaselineIntroScreen onStart={handleStartBaseline} />}
      {screen === "mechanical-baseline-question" && activeSession && <QuestionScreen session={activeSession} responses={activeSessionResponses} onAnswer={handleAnswer} />}
      {screen === "assessment-complete" && <AssessmentCompleteScreen onViewInsight={() => setScreen("first-advisor-insight")} />}
      {screen === "first-advisor-insight" && <AdvisorInsightScreen journey={journey} onWhy={() => setWhyOpen(true)} onDashboard={() => setScreen("dashboard")} />}
      {screen === "dashboard" && <DashboardScreen journey={journey} onWhy={() => setWhyOpen(true)} />}
      <WhyModal why={whyOpen ? why : undefined} onClose={() => setWhyOpen(false)} />
    </main>
  );
}
