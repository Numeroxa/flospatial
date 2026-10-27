export const PILOT2_TELEMETRY_VERSION = "pilot2-v0.44.20";

/** Optional additions to existing journey responses; old records remain valid. */
export type Pilot2Telemetry = {
  questionPresentedAt: string;
  firstSelectedOptionId: string;
  firstSelectionAt: string;
  finalSubmissionAt: string;
  answerChangeCount: number;
  firstSelectionTimeMs: number;
  totalQuestionTimeMs: number;
  domain: string;
  subcompetency: string;
};

type SelectionCapture = {
  presentedAt: string;
  startedAtMs: number;
  firstOptionId: string | null;
  firstSelectionAt: string | null;
  firstSelectionTimeMs: number | null;
  selectedOptionId: string | null;
  answerChangeCount: number;
  submitted: Omit<Pilot2Telemetry, "domain" | "subcompetency"> | null;
};

export function beginPilot2Question(wallTime = Date.now(), monotonicTime = performance.now()): SelectionCapture {
  return { presentedAt: new Date(wallTime).toISOString(), startedAtMs: monotonicTime, firstOptionId: null, firstSelectionAt: null, firstSelectionTimeMs: null, selectedOptionId: null, answerChangeCount: 0, submitted: null };
}

export function recordPilot2Selection(capture: SelectionCapture, optionId: string, wallTime = Date.now(), monotonicTime = performance.now()) {
  if (capture.submitted || optionId === capture.selectedOptionId) return;
  if (capture.firstOptionId === null) {
    capture.firstOptionId = optionId;
    capture.firstSelectionAt = new Date(wallTime).toISOString();
    capture.firstSelectionTimeMs = Math.max(0, monotonicTime - capture.startedAtMs);
  } else {
    capture.answerChangeCount += 1;
  }
  capture.selectedOptionId = optionId;
}

export function submitPilot2Question(capture: SelectionCapture, wallTime = Date.now(), monotonicTime = performance.now()) {
  if (capture.submitted) return capture.submitted;
  if (!capture.firstOptionId || !capture.firstSelectionAt || capture.firstSelectionTimeMs === null) throw new Error("Select an answer before submitting.");
  capture.submitted = {
    questionPresentedAt: capture.presentedAt,
    firstSelectedOptionId: capture.firstOptionId,
    firstSelectionAt: capture.firstSelectionAt,
    finalSubmissionAt: new Date(wallTime).toISOString(),
    answerChangeCount: capture.answerChangeCount,
    firstSelectionTimeMs: capture.firstSelectionTimeMs,
    totalQuestionTimeMs: Math.max(0, monotonicTime - capture.startedAtMs),
  };
  return capture.submitted;
}

type ExportResponse = { responseId: string; sessionId: string; questionId: string; selectedOptionId: string | null; correct: boolean; responseTimeMs: number; answeredAt: string; telemetryVersion?: string } & Partial<Pilot2Telemetry>;
type ExportSession = { sessionId: string; sessionType: string; startedAt: string; completedAt?: string };
type ExportQuestion = { questionId: string; domain: string; subcompetency: string; correctOptionId: string; options: { optionId: string; text: string }[] };

function csvCell(value: unknown) {
  // Quote every cell; neutralise spreadsheet formulas in authored/free text.
  const text = value === undefined || value === null ? "" : String(value);
  return `"${(/^[=+@-]/.test(text) ? "'" + text : text).replace(/"/g, '""')}"`;
}

export function buildPilot2Csv(journey: { guestJourneyId: string; sessions: ExportSession[]; responses: ExportResponse[] }, questions: ExportQuestion[]) {
  const sessions = new Map(journey.sessions.map(s => [s.sessionId, s]));
  const bank = new Map(questions.map(q => [q.questionId, q]));
  const headers = ["export_version", "participant_journey_id", "session_id", "session_type", "pathway_stage", "session_started_at", "session_completed_at", "response_id", "question_id", "domain", "subcompetency", "capture_kind", "telemetry_version", "question_presented_at", "first_selected_option_id", "first_selected_option_text", "first_selection_at", "final_submitted_option_id", "final_submitted_option_text", "final_submission_at", "answer_change_count", "answer_changed", "first_correct", "final_correct", "answer_transition", "first_selection_time_ms", "total_question_time_ms", "legacy_response_time_ms", "answered_at"];
  const rows = journey.responses.map(response => {
    const session = sessions.get(response.sessionId);
    const question = bank.get(response.questionId);
    const instrumented = response.telemetryVersion === PILOT2_TELEMETRY_VERSION && response.firstSelectedOptionId !== undefined;
    const firstCorrect = instrumented && question ? response.firstSelectedOptionId === question.correctOptionId : undefined;
    const transition = firstCorrect === undefined ? "" : `${firstCorrect ? "correct" : "incorrect"}_to_${response.correct ? "correct" : "incorrect"}`;
    const stage = session?.sessionType.includes("independent") ? "independent" : session?.sessionType.includes("assessment") && session.sessionType !== "mechanical_starting_point" ? "check" : session?.sessionType.includes("guided") ? "guided" : session?.sessionType === "mechanical_starting_point" ? "starting_point" : "other";
    return [PILOT2_TELEMETRY_VERSION, journey.guestJourneyId, response.sessionId, session?.sessionType, stage, session?.startedAt, session?.completedAt, response.responseId, response.questionId, response.domain ?? question?.domain, response.subcompetency ?? question?.subcompetency, instrumented ? "pilot2" : "legacy_or_uninstrumented", response.telemetryVersion, response.questionPresentedAt, response.firstSelectedOptionId, question?.options.find(o => o.optionId === response.firstSelectedOptionId)?.text, response.firstSelectionAt, response.selectedOptionId, question?.options.find(o => o.optionId === response.selectedOptionId)?.text, response.finalSubmissionAt, response.answerChangeCount, instrumented ? (response.answerChangeCount ?? 0) > 0 : undefined, firstCorrect, response.correct, transition, response.firstSelectionTimeMs, response.totalQuestionTimeMs, response.responseTimeMs, response.answeredAt];
  });
  return "\uFEFF" + [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
}
