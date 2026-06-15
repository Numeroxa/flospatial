import { useEffect, useMemo, useState } from "react";

type AppScreen =
  | "landing"
  | "pathway-selection"
  | "preparation-context"
  | "mechanical-baseline-intro"
  | "mechanical-baseline-question"
  | "assessment-complete"
  | "first-advisor-insight"
  | "dashboard";

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
  sessionType: "mechanical_starting_point";
  pathwayId: PathwayId;
  domain: "mechanical";
  subcompetency: MechanicalSubcompetency;
  concept: string;
  difficulty: "foundational" | "developing" | "applied";
  stem: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
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
  recommendationType: "start_hydraulic_fundamentals" | "start_mechanical_foundations" | "follow_up_diagnostic";
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

type Milestone = { milestoneId: string; type: "starting_point_established" | "first_focus_identified" | "dashboard_created"; label: string; createdAt: string };

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

const MVP_GUEST_JOURNEY_KEY = "flospatial.mvpGuestJourney.v1";
const TEST_ACCESS_PASSWORD = "flospatial";
const ENABLE_PASSWORD_GATE = true;

function id(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function now() { return new Date().toISOString(); }

function createEmptyMvpGuestJourney(): MvpGuestJourney {
  return { version: "mvp_v1", guestJourneyId: id("guest"), sessions: [], responses: [], competencyEvidence: [], observations: [], constraints: [], recommendations: [], whyExplanations: [], readinessSnapshots: [], milestones: [], updatedAt: now() };
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

function createMechanicalBaselineSession(): AssessmentSession {
  return { sessionId: id("session"), sessionType: "mechanical_starting_point", pathwayId: "fire_service", startedAt: now(), questionIds: mechanicalQuestions.map((q) => q.questionId) };
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

function PrimaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return <button disabled={disabled} onClick={onClick} className="rounded-xl border border-[#5ED3F3]/30 bg-[#5ED3F3]/10 px-6 py-4 font-medium text-[#D9F8FF] transition hover:border-[#5ED3F3]/60 hover:bg-[#5ED3F3]/15 disabled:cursor-not-allowed disabled:opacity-40">{children}</button>;
}
function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) { return <button onClick={onClick} className="rounded-xl border border-white/10 px-6 py-4 font-medium text-[#C4CEDA] transition hover:text-[#F4F6F8]">{children}</button>; }
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <div className={`rounded-[28px] border border-white/5 bg-[#171C23] p-7 shadow-2xl shadow-black/10 ${className}`}>{children}</div>; }
function Shell({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) { return <main className="min-h-screen bg-[#111418] text-[#F4F6F8]"><header className="border-b border-white/5"><div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6"><div><div className="text-xl font-semibold tracking-wide">FloSpatial</div><div className="mt-1 text-xs tracking-[0.18em] text-[#6E7A88]">Preparation intelligence</div></div><div className="text-sm text-[#8D98A6]">{right ?? "Progress saved locally"}</div></div></header>{children}</main>; }
function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-[#5ED3F3]/20 bg-[#5ED3F3]/10 px-3 py-1 text-xs font-medium text-[#BFF3FF]">{children}</span>; }

function LandingScreen({ onBegin }: { onBegin: () => void }) { return <Shell><section className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-8 py-20"><div className="max-w-2xl"><Badge>No account or email required to begin</Badge><h1 className="mt-8 text-5xl font-semibold leading-tight tracking-tight md:text-6xl">Prepare smarter for selection assessments.</h1><p className="mt-8 max-w-xl text-lg leading-relaxed text-[#9AA3B2]">FloSpatial helps you identify what to work on, why it matters, and what to do next.</p><div className="mt-12"><PrimaryButton onClick={onBegin}>Begin preparation</PrimaryButton></div></div><div className="mt-20 grid gap-5 md:grid-cols-3"><Card><h3 className="text-lg font-semibold">Find your focus</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">FloSpatial looks for the preparation area most likely to matter next.</p></Card><Card><h3 className="text-lg font-semibold">Understand why</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">Every major recommendation includes a clear explanation.</p></Card><Card><h3 className="text-lg font-semibold">Track progress</h3><p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">Your preparation journey is saved on this device.</p></Card></div></section></Shell>; }
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
function DashboardScreen({ journey, onWhy, onReset }: { journey: MvpGuestJourney; onWhy: () => void; onReset: () => void }) { const rec = getCurrentRecommendation(journey); const readiness = getCurrentReadiness(journey); const milestones = getRecentMilestones(journey); return <Shell><section className="mx-auto max-w-6xl px-8 py-12"><div className="mb-9"><p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Dashboard</p><h1 className="mt-3 text-4xl font-semibold">Your preparation cockpit</h1></div><div className="grid gap-5 lg:grid-cols-2"><Card className="lg:col-span-2"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recommended next step</div><h2 className="mt-3 text-3xl font-semibold">{rec?.title}</h2><p className="mt-3 max-w-2xl text-[#AAB4C0]">{rec?.summary}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><PrimaryButton disabled>{rec?.actionLabel} — coming soon</PrimaryButton><SecondaryButton onClick={onWhy}>Why this recommendation?</SecondaryButton></div></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Current focus</div><h3 className="mt-3 text-2xl font-semibold">{journey.dashboardState?.currentFocusLabel}</h3><p className="mt-3 text-[#9AA3B2]">This is the preparation area FloSpatial currently recommends addressing first.</p></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Readiness snapshot</div><h3 className="mt-3 text-2xl font-semibold">{readiness?.label}</h3><p className="mt-3 text-[#9AA3B2]">{readiness?.explanation}</p></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Recent progress</div><ul className="mt-4 space-y-3 text-[#C8D2DD]">{milestones.map((m) => <li key={m.milestoneId}>• {m.label}</li>)}</ul></Card><Card><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Starting point summary</div><p className="mt-4 text-[#C8D2DD]">{journey.dashboardState?.baselineSummary?.mechanicalQuestionsCompleted ?? 0} mechanical reasoning questions completed.</p>{journey.dashboardState?.baselineSummary?.focusArea && <p className="mt-3 text-[#9AA3B2]">Initial focus: {journey.dashboardState.baselineSummary.focusArea}</p>}</Card><Card className="lg:col-span-2"><div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Save status</div><p className="mt-4 text-[#C8D2DD]">Progress saved on this device.</p><p className="mt-3 text-[#9AA3B2]">You can continue without creating an account. A free username option can be added later for cross-device continuity.</p><div className="mt-7"><SecondaryButton onClick={onReset}>Reset local demo journey</SecondaryButton></div></Card></div></section></Shell>; }
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

  const why = getCurrentWhy(journey);
  return <>{showWhy && <WhyModal why={why} onClose={() => setShowWhy(false)} />}{screen === "landing" && <LandingScreen onBegin={() => setScreen("pathway-selection")} />}{screen === "pathway-selection" && <PathwaySelectionScreen onSelect={selectFireService} />}{screen === "preparation-context" && <PreparationContextScreen onSave={saveContext} />}{screen === "mechanical-baseline-intro" && <BaselineIntroScreen onStart={startBaseline} />}{screen === "mechanical-baseline-question" && activeSession && <MechanicalQuestionScreen journey={journey} sessionId={activeSession.sessionId} questionIndex={activeQuestionIndex} onAnswer={handleAnswer} />}{screen === "assessment-complete" && <AssessmentCompleteScreen onView={() => setScreen("first-advisor-insight")} />}{screen === "first-advisor-insight" && <FirstAdvisorInsightScreen journey={journey} onWhy={() => setShowWhy(true)} onDashboard={() => setScreen("dashboard")} />}{screen === "dashboard" && <DashboardScreen journey={journey} onWhy={() => setShowWhy(true)} onReset={resetDemo} />}</>;
}
