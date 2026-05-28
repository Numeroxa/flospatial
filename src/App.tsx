import { useEffect, useMemo, useRef, useState } from "react";

type Cube = { x: number; y: number; z: number };
type Shape = Cube[];

type DifficultyBand = "foundational" | "developing" | "stretch";
type TrainingFocus =
  | "rotational-consistency"
  | "mirror-discrimination"
  | "rotation-axis-tracking"
  | "rotation-magnitude-recognition";

type AnswerType = "correct" | "mirror" | "wrong-axis" | "wrong-angle";

type AnswerOption = {
  shape: Shape;
  type: AnswerType;
};

type TransformationProfile = {
  axisComplexity: number;
  anchorDisruption: number;
  silhouetteVolatility: number;
  symmetryInterference: number;
  orientationDistance: number;
};

type PuzzleProfile = {
  cubeCount: number;
  verticality: number;
  branching: number;
  spatialSpread: number;
  estimatedDifficulty: DifficultyBand;
  focus: TrainingFocus;
  transformationProfile: TransformationProfile;
  perceptualTarget: PerceptualTarget;
  transformationTarget: TransformationTarget;
};

type PerceptualTarget = {
  maxAmbiguityRisk: number;
  minAnchorClarity: number;
  maxOcclusionDensity: number;
};

type TransformationTarget = {
  maxAxisComplexity: number;
  maxAnchorDisruption: number;
  maxSilhouetteVolatility: number;
  minOrientationDistance: number;
  maxOrientationDistance: number;
};

type PuzzleRequest = {
  focus: TrainingFocus;
  difficulty: DifficultyBand;
  targetCubeCount: number;
  requireVerticalAnchor: boolean;
  allowMirrorDistractor: boolean;
  allowMultiAxisTransform: boolean;
  distractorSubtlety: "clear" | "moderate" | "subtle";
  perceptualTarget: PerceptualTarget;
  transformationTarget: TransformationTarget;
  recentTransformationProfiles?: TransformationProfile[];
};

type Puzzle = {
  id: string;
  referenceShape: Shape;
  answers: AnswerOption[];
  correctIndex: number;
  feedback: string;
  profile: PuzzleProfile;
};

type SessionPhase =
  | "warmup"
  | "core"
  | "stretch"
  | "reinforcement"
  | "recovery"
  | "complete";

type ResponseRecord = {
  puzzleId: string;
  correct: boolean;
  responseTimeMs: number;
  selectedType: AnswerType;
  focus: TrainingFocus;
  difficulty: DifficultyBand;
  transformationProfile?: TransformationProfile;
  phaseAtAnswer?: SessionPhase;
};

type FatigueSignals = {
  prolongedDeliberation: number;
  repeatedAnchorDisruption: number;
  sustainedHighVolatility: number;
  consecutiveStretchExposure: number;
  errorRecoveryLoad: number;
};

type RestorationSignals = {
  recentRecoveryAccuracy: number;
  recentRecoveryTempo: "none" | "stabilising" | "strained";
  restorationMomentum: number;
};

type ContinuityState = {
  representationStability: number;
  anchorPersistenceState: number;
  symmetryFatigue: number;
  orientationConfidence: number;
};

type SessionInsight = {
  title: string;
  body: string;
};

type SessionState = {
  sessionTexture: SessionTexture;
  sessionSeed: number;
  totalQuestions: number;
  phase: SessionPhase;
  questionIndex: number;
  score: number;
  responses: ResponseRecord[];
  recentTransformationProfiles: TransformationProfile[];
  fatigueSignals: FatigueSignals;
  restorationSignals: RestorationSignals;
  continuityState: ContinuityState;
  recentInsights: SessionInsight[];
  fatigueEstimate: number;
  confidenceMomentum: number;
  currentFocus: TrainingFocus;
  lastPhaseChangeAt: number;
  reinforcementCount: number;
  recoveryCount: number;
  lastRecoveryAt: number | null;
};

type SessionTexture =
  | "stabilisation"
  | "mirror-focus"
  | "orientation-flow"
  | "high-transformation"
  | "recovery-weighted";

type LongitudinalSignals = {
  perceptualConfidenceTrend: number;
  adaptiveComplexityTolerance: number;
  recentFatigueAverage: number;
  recentRecoveryResponsiveness: number;
  mirrorErrorBias: number;
  axisTrackingBias: number;
  orientationStabilityTrend: number;
  preferredSessionLength: number;
  voluntaryContinuationRate: number;
};

type CognitiveProfile = {
  sessionsCompleted: number;
  longitudinalSignals: LongitudinalSignals;
  rotationalConsistency: number;
  mirrorDiscrimination: number;
  rotationAxisTracking: number;
  rotationMagnitudeRecognition: number;
  averageResponseTimeMs: number;
  recentFocus: TrainingFocus;
  updatedAt: string;
};

const STORAGE_KEY = "flospatial.localProfile.v1";
const DEFAULT_SESSION_LENGTH = 12;
const ENABLE_PASSWORD_GATE = true;
const TEST_ACCESS_PASSWORD = "flospatial";

type SessionLengthPreset = {
  label: string;
  questions: number;
  description: string;
};

const SESSION_LENGTH_PRESETS: SessionLengthPreset[] = [
  { label: "Quick", questions: 8, description: "A short focused session" },
  { label: "Standard", questions: 12, description: "The recommended default" },
  { label: "Deep", questions: 20, description: "Longer testing session" },
];

const defaultProfile: CognitiveProfile = {
  longitudinalSignals: {
    perceptualConfidenceTrend: 0.5,
    adaptiveComplexityTolerance: 0.5,
    recentFatigueAverage: 0,
    recentRecoveryResponsiveness: 0.5,
    mirrorErrorBias: 0,
    axisTrackingBias: 0,
    orientationStabilityTrend: 0.5,
    preferredSessionLength: DEFAULT_SESSION_LENGTH,
    voluntaryContinuationRate: 0,
  },
  sessionsCompleted: 0,
  rotationalConsistency: 0.5,
  mirrorDiscrimination: 0.5,
  rotationAxisTracking: 0.5,
  rotationMagnitudeRecognition: 0.5,
  averageResponseTimeMs: 0,
  recentFocus: "rotational-consistency",
  updatedAt: new Date().toISOString(),
};

function loadLocalProfile(): CognitiveProfile {
  if (typeof window === "undefined") return defaultProfile;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProfile;

  try {
    return { ...defaultProfile, ...(JSON.parse(raw) as Partial<CognitiveProfile>) };
  } catch {
    return defaultProfile;
  }
}

function saveLocalProfile(profile: CognitiveProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function createInitialSession(initialFocus: TrainingFocus, totalQuestions = DEFAULT_SESSION_LENGTH): SessionState {
  return {
    sessionTexture: "stabilisation",
    sessionSeed: Math.floor(Date.now() % 100000),
    totalQuestions,
    phase: "warmup",
    questionIndex: 0,
    score: 0,
    responses: [],
    recentTransformationProfiles: [],
    fatigueSignals: {
      prolongedDeliberation: 0,
      repeatedAnchorDisruption: 0,
      sustainedHighVolatility: 0,
      consecutiveStretchExposure: 0,
      errorRecoveryLoad: 0,
    },
    restorationSignals: {
      recentRecoveryAccuracy: 0,
      recentRecoveryTempo: "none",
      restorationMomentum: 0,
    },
    recentInsights: [],
    continuityState: {
      representationStability: 0.5,
      anchorPersistenceState: 0.5,
      symmetryFatigue: 0,
      orientationConfidence: 0.5,
    },
    fatigueEstimate: 0,
    confidenceMomentum: 0.5,
    currentFocus: initialFocus,
    lastPhaseChangeAt: 0,
    reinforcementCount: 0,
    recoveryCount: 0,
    lastRecoveryAt: null,
  };
}

function normalizeShape(shape: Shape): Shape {
  const minX = Math.min(...shape.map((cube) => cube.x));
  const minY = Math.min(...shape.map((cube) => cube.y));
  const minZ = Math.min(...shape.map((cube) => cube.z));

  return shape.map((cube) => ({
    x: cube.x - minX,
    y: cube.y - minY,
    z: cube.z - minZ,
  }));
}

function rotateX90(shape: Shape): Shape {
  return normalizeShape(shape.map((cube) => ({ x: cube.x, y: -cube.z, z: cube.y })));
}

function rotateY90(shape: Shape): Shape {
  return normalizeShape(shape.map((cube) => ({ x: cube.z, y: cube.y, z: -cube.x })));
}

function rotateY180(shape: Shape): Shape {
  return rotateY90(rotateY90(shape));
}

function rotateZ90(shape: Shape): Shape {
  return normalizeShape(shape.map((cube) => ({ x: -cube.y, y: cube.x, z: cube.z })));
}

function mirrorX(shape: Shape): Shape {
  return normalizeShape(shape.map((cube) => ({ x: -cube.x, y: cube.y, z: cube.z })));
}

function generateAllRotations(shape: Shape): Shape[] {
  const rotations: Shape[] = [];
  const seen = new Set<string>();
  const queue: Shape[] = [normalizeShape(shape)];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    const normalised = normalizeShape(current);
    const key = shapeKey(normalised);

    if (seen.has(key)) continue;

    seen.add(key);
    rotations.push(normalised);

    queue.push(rotateX90(normalised));
    queue.push(rotateY90(normalised));
    queue.push(rotateZ90(normalised));
  }

  return rotations;
}

function getCanonicalShapeKey(shape: Shape) {
  return generateAllRotations(shape)
    .map((rotation) => shapeKey(rotation))
    .sort()[0];
}

function areRotationallyEquivalent(a: Shape, b: Shape) {
  return getCanonicalShapeKey(a) === getCanonicalShapeKey(b);
}

function shapeKey(shape: Shape) {
  return [...shape]
    .map((cube) => `${cube.x},${cube.y},${cube.z}`)
    .sort()
    .join("|");
}

function createSeededRandom(seed: number) {
  let value = seed;
  return function random() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function randomItem<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

const DIRECTIONS: Cube[] = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
];

function cubeKey(cube: Cube) {
  return `${cube.x},${cube.y},${cube.z}`;
}

function fallbackShape(): Shape {
  return [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 2, y: 1, z: 0 },
    { x: 2, y: 1, z: 1 },
  ];
}

const SEED_SHAPE_FAMILIES: Shape[] = [
  // tower forms
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: 2 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
  ],

  // staircase forms
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 0, z: 1 },
    { x: 2, y: 0, z: 1 },
    { x: 2, y: 0, z: 2 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 1, y: 1, z: 1 },
    { x: 2, y: 1, z: 1 },
  ],

  // hooked forms
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 2, y: 1, z: 0 },
    { x: 2, y: 1, z: 1 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 },
    { x: 1, y: 2, z: 0 },
    { x: 1, y: 2, z: 1 },
  ],

  // offset asymmetric forms
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 2, y: 1, z: 0 },
    { x: 2, y: 1, z: 1 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 1, y: 2, z: 0 },
    { x: 2, y: 2, z: 0 },
  ],

  // compact cluster forms
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 1, y: 1, z: 1 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 1, z: 1 },
  ],

  // cantilever / overhang forms
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 0, z: 1 },
    { x: 2, y: 0, z: 1 },
    { x: 3, y: 0, z: 1 },
    { x: 1, y: 1, z: 0 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 1, z: 1 },
    { x: 0, y: 2, z: 1 },
    { x: 0, y: 3, z: 1 },
    { x: 1, y: 1, z: 0 },
  ],

  // negative-space / frame-like forms
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 2, y: 1, z: 0 },
    { x: 2, y: 1, z: 1 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 2, z: 0 },
    { x: 1, y: 2, z: 1 },
  ],

  // asymmetric bridge forms
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 2, y: 0, z: 1 },
    { x: 2, y: 1, z: 1 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 2, z: 1 },
    { x: 1, y: 2, z: 1 },
  ],

  // rotational anchor traps
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 1, y: 1, z: 1 },
    { x: 2, y: 1, z: 1 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 2, z: 1 },
  ],
];

function getSeedShape(random: () => number): Shape {
  if (random() < 0.45) {
    return [{ x: 0, y: 0, z: 0 }];
  }

  const template = randomItem(SEED_SHAPE_FAMILIES, random);
  return normalizeShape(template);
}

function scoreShape(
  shape: Shape
): Omit<PuzzleProfile, "focus" | "transformationProfile" | "perceptualTarget" | "transformationTarget"> {
  const cubeCount = shape.length;
  const verticality = shape.filter((cube) => cube.z > 0).length;
  const xSpread = Math.max(...shape.map((cube) => cube.x)) - Math.min(...shape.map((cube) => cube.x));
  const ySpread = Math.max(...shape.map((cube) => cube.y)) - Math.min(...shape.map((cube) => cube.y));
  const zSpread = Math.max(...shape.map((cube) => cube.z)) - Math.min(...shape.map((cube) => cube.z));
  const spatialSpread = xSpread + ySpread + zSpread;
  const branching = new Set(shape.map((cube) => `${cube.x},${cube.y}`)).size;
  const difficultyScore = cubeCount + verticality * 1.5 + branching * 0.8 + spatialSpread * 0.6;

  return {
    cubeCount,
    verticality,
    branching,
    spatialSpread,
    estimatedDifficulty: difficultyScore < 10 ? "foundational" : difficultyScore < 13 ? "developing" : "stretch",
  };
}

function getProjectedBounds(shape: Shape) {
  const points = shape.flatMap((cube) => {
    const faces = getCubeFaces(cube);
    return [...faces.top, ...faces.left, ...faces.right];
  });

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);

  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function hasComfortableProjectedFootprint(shape: Shape) {
  const bounds = getProjectedBounds(shape);
  const aspectRatio = bounds.width / Math.max(bounds.height, 1);

  return bounds.width <= 260 && bounds.height <= 250 && aspectRatio <= 2.15;
}

function isReadableShape(shape: Shape) {
  return getPerceptualQualityScore(shape) >= 0.62 && hasComfortableProjectedFootprint(shape);
}

function getShapeCentroid(shape: Shape) {
  return {
    x: shape.reduce((sum, cube) => sum + cube.x, 0) / shape.length,
    y: shape.reduce((sum, cube) => sum + cube.y, 0) / shape.length,
    z: shape.reduce((sum, cube) => sum + cube.z, 0) / shape.length,
  };
}

function getSpreadVector(shape: Shape) {
  const xs = shape.map((cube) => cube.x);
  const ys = shape.map((cube) => cube.y);
  const zs = shape.map((cube) => cube.z);

  return {
    x: Math.max(...xs) - Math.min(...xs),
    y: Math.max(...ys) - Math.min(...ys),
    z: Math.max(...zs) - Math.min(...zs),
  };
}

function getSilhouetteSignature(shape: Shape) {
  return [...new Set(shape.map((cube) => `${cube.x},${cube.y}`))].sort().join("|");
}

function getPuzzleFingerprint(shape: Shape) {
  const profile = scoreShape(shape);

  return JSON.stringify({
    silhouette: getSilhouetteSignature(shape),
    cubeCount: profile.cubeCount,
    verticality: profile.verticality,
    branching: profile.branching,
    spread: profile.spatialSpread,
  });
}

function hasRecentPuzzleSimilarity(shape: Shape) {
  const fingerprint = getPuzzleFingerprint(shape);
  return recentPuzzleFingerprints.includes(fingerprint);
}

function rememberPuzzleFingerprint(shape: Shape) {
  recentPuzzleFingerprints.push(getPuzzleFingerprint(shape));

  if (recentPuzzleFingerprints.length > 18) {
    recentPuzzleFingerprints.shift();
  }
}

function getSilhouetteKey(shape: Shape) {
  return [...new Set(shape.map((cube) => `${cube.x},${cube.y}`))].sort().join("|");
}

function getTransformationProfile(referenceShape: Shape, transformedShape: Shape): TransformationProfile {
  const referenceSpread = getSpreadVector(referenceShape);
  const transformedSpread = getSpreadVector(transformedShape);
  const referenceCentroid = getShapeCentroid(referenceShape);
  const transformedCentroid = getShapeCentroid(transformedShape);

  const spreadShift =
    Math.abs(referenceSpread.x - transformedSpread.x) +
    Math.abs(referenceSpread.y - transformedSpread.y) +
    Math.abs(referenceSpread.z - transformedSpread.z);

  const centroidShift =
    Math.abs(referenceCentroid.x - transformedCentroid.x) +
    Math.abs(referenceCentroid.y - transformedCentroid.y) +
    Math.abs(referenceCentroid.z - transformedCentroid.z);

  const silhouetteVolatility =
    getSilhouetteKey(referenceShape) === getSilhouetteKey(transformedShape)
      ? 0.18
      : Math.min(1, 0.35 + spreadShift / 8);

  const referenceLoad = getPerceptualLoadProfile(referenceShape);
  const transformedLoad = getPerceptualLoadProfile(transformedShape);

  const anchorDisruption = Math.min(
    1,
    Math.abs(referenceLoad.anchorClarity - transformedLoad.anchorClarity) + silhouetteVolatility * 0.45
  );

  const symmetryInterference = Math.min(
    1,
    (referenceLoad.symmetryInterference + transformedLoad.symmetryInterference) / 2
  );

  const orientationDistance = Math.min(1, (spreadShift + centroidShift) / 10 + silhouetteVolatility * 0.35);

  const axisComplexity = Math.min(
    1,
    0.25 +
      (referenceSpread.x !== transformedSpread.x ? 0.22 : 0) +
      (referenceSpread.y !== transformedSpread.y ? 0.22 : 0) +
      (referenceSpread.z !== transformedSpread.z ? 0.22 : 0)
  );

  return {
    axisComplexity,
    anchorDisruption,
    silhouetteVolatility,
    symmetryInterference,
    orientationDistance,
  };
}

function getPerceptualLoadProfile(shape: Shape) {
  const xs = shape.map((cube) => cube.x);
  const ys = shape.map((cube) => cube.y);
  const zs = shape.map((cube) => cube.z);

  const spreadX = Math.max(...xs) - Math.min(...xs);
  const spreadY = Math.max(...ys) - Math.min(...ys);
  const spreadZ = Math.max(...zs) - Math.min(...zs);

  const occupiedColumns = new Set(shape.map((cube) => `${cube.x},${cube.y}`)).size;
  const verticality = shape.filter((cube) => cube.z > 0).length;
  const footprintBalance = Math.min(spreadX + 1, spreadY + 1) / Math.max(spreadX + 1, spreadY + 1);
  const columnDensity = occupiedColumns / shape.length;

  const occlusionDensity = 1 - columnDensity;
  const silhouetteComplexity = Math.min((spreadX + spreadY + spreadZ) / 8, 1);
  const anchorClarity = Math.min(1, verticality > 0 ? 0.55 + footprintBalance * 0.35 + columnDensity * 0.1 : 0.35);
  const symmetryInterference = footprintBalance > 0.82 && spreadX + spreadY > 3 ? 0.45 : 0.18;
  const ambiguityRisk = Math.min(1, occlusionDensity * 0.45 + symmetryInterference * 0.25 + (spreadZ === 0 ? 0.3 : 0));

  return {
    occlusionDensity,
    silhouetteComplexity,
    anchorClarity,
    symmetryInterference,
    ambiguityRisk,
  };
}

function getPerceptualQualityScore(shape: Shape) {
  const profile = getPerceptualLoadProfile(shape);

  const clarityScore = profile.anchorClarity * 0.34;
  const silhouetteScore = (1 - Math.abs(profile.silhouetteComplexity - 0.55)) * 0.24;
  const occlusionScore = (1 - profile.occlusionDensity) * 0.22;
  const ambiguityScore = (1 - profile.ambiguityRisk) * 0.2;

  return Math.max(
    0,
    Math.min(
      1,
      clarityScore + silhouetteScore + occlusionScore + ambiguityScore
    )
  );
}

function validateShape(shape: Shape, perceptualTarget?: PerceptualTarget) {
  const profile = scoreShape(shape);
  const perceptualQuality = getPerceptualQualityScore(shape);
  const perceptualLoad = getPerceptualLoadProfile(shape);
  const hasVerticalAnchor = profile.verticality > 0;
  const hasEnoughSpread = profile.spatialSpread >= 3;
  const notTooDense = profile.branching >= 3;
  const suitableCubeCount = shape.length >= 5 && shape.length <= 8;

  return {
    valid:
      hasVerticalAnchor &&
      hasEnoughSpread &&
      notTooDense &&
      suitableCubeCount &&
      perceptualQuality >= 0.62 &&
      perceptualLoad.ambiguityRisk < (perceptualTarget?.maxAmbiguityRisk ?? 0.55) &&
      perceptualLoad.anchorClarity >= (perceptualTarget?.minAnchorClarity ?? 0.52) &&
      perceptualLoad.occlusionDensity <= (perceptualTarget?.maxOcclusionDensity ?? 0.58),
    profile,
  };
}

function generateConnectedShape({
  cubeCount,
  requireVerticalAnchor,
  seed,
  perceptualTarget,
  maxAttempts = 120,
}: {
  cubeCount: number;
  requireVerticalAnchor: boolean;
  seed: number;
  perceptualTarget?: PerceptualTarget;
  maxAttempts?: number;
}): Shape {
  const random = createSeededRandom(seed);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let shape: Shape = getSeedShape(random).slice(0, cubeCount);

    while (shape.length < cubeCount) {
      const anchor = randomItem(shape, random);
      const direction = randomItem(DIRECTIONS, random);
      const candidate = {
        x: anchor.x + direction.x,
        y: anchor.y + direction.y,
        z: anchor.z + direction.z,
      };

      if (candidate.z < 0) continue;
      if (new Set(shape.map(cubeKey)).has(cubeKey(candidate))) continue;

      shape = [...shape, candidate];
    }

    shape = normalizeShape(shape);
    const validation = validateShape(shape, perceptualTarget);

    if (validation.valid && isReadableShape(shape) && (!requireVerticalAnchor || validation.profile.verticality > 0)) {
      return shape;
    }
  }

  return fallbackShape();
}

function getProjectedSilhouetteKey(shape: Shape) {
  return [...new Set(shape.map((cube) => {
    const projected = projectCube(cube);
    return `${Math.round(projected.x / 10)},${Math.round(projected.y / 10)}`;
  }))]
    .sort()
    .join("|");
}

function removeDuplicateAnswers(options: AnswerOption[]) {
  const seen = new Set<string>();
  const seenProjected = new Set<string>();

  return options.filter((option) => {
    const key = shapeKey(option.shape);
    const projectedKey = getProjectedSilhouetteKey(option.shape);

    if (seen.has(key) || seenProjected.has(projectedKey)) return false;

    seen.add(key);
    seenProjected.add(projectedKey);
    return true;
  });
}

function chooseCorrectShape(referenceShape: Shape, request: PuzzleRequest): Shape {
  const candidateTransforms = request.allowMultiAxisTransform
    ? [rotateY180, rotateX90, rotateZ90, rotateY90]
    : [rotateY90, rotateX90, rotateY180, rotateZ90];

  const candidates = candidateTransforms.map((transform) => {
    const transformedShape = transform(referenceShape);
    const profile = getTransformationProfile(referenceShape, transformedShape);

    return {
      transformedShape,
      profile,
      score:
        scoreTransformationAgainstTarget(profile, request.transformationTarget) * 0.82 +
        getTransformationVarietyScore(profile, request.recentTransformationProfiles ?? []) * 0.18,
    };
  });

  return candidates.sort((a, b) => b.score - a.score)[0].transformedShape;
}

function scoreTransformationAgainstTarget(profile: TransformationProfile, target: TransformationTarget) {
  const axisFit = profile.axisComplexity <= target.maxAxisComplexity ? 1 : 0.4;
  const anchorFit = profile.anchorDisruption <= target.maxAnchorDisruption ? 1 : 0.4;
  const silhouetteFit = profile.silhouetteVolatility <= target.maxSilhouetteVolatility ? 1 : 0.4;
  const orientationFit =
    profile.orientationDistance >= target.minOrientationDistance &&
    profile.orientationDistance <= target.maxOrientationDistance
      ? 1
      : 0.5;

  return axisFit * 0.25 + anchorFit * 0.25 + silhouetteFit * 0.2 + orientationFit * 0.3;
}

function getTransformationVarietyScore(profile: TransformationProfile, recentProfiles: TransformationProfile[]) {
  const recent = recentProfiles.slice(-3);
  if (recent.length === 0) return 0.5;

  const averageDistance =
    recent.reduce((sum, recentProfile) => {
      return (
        sum +
        Math.abs(profile.axisComplexity - recentProfile.axisComplexity) +
        Math.abs(profile.anchorDisruption - recentProfile.anchorDisruption) +
        Math.abs(profile.silhouetteVolatility - recentProfile.silhouetteVolatility) +
        Math.abs(profile.symmetryInterference - recentProfile.symmetryInterference) +
        Math.abs(profile.orientationDistance - recentProfile.orientationDistance)
      );
    }, 0) /
    recent.length /
    5;

  return Math.max(0, Math.min(1, averageDistance));
}

function buildPuzzle(index: number, request: PuzzleRequest): Puzzle {
  return buildPuzzleAttempt(index, request, 0);
}

function buildPuzzleAttempt(index: number, request: PuzzleRequest, attempt: number): Puzzle {
  let referenceShape = generateConnectedShape({
    cubeCount: request.targetCubeCount,
    requireVerticalAnchor: request.requireVerticalAnchor,
    seed: index + 1000 + attempt * 137,
    perceptualTarget: request.perceptualTarget,
  });

  let similarityAttempts = 0;

  while (hasRecentPuzzleSimilarity(referenceShape) && similarityAttempts < 8) {
    referenceShape = generateConnectedShape({
      cubeCount: request.targetCubeCount,
      requireVerticalAnchor: request.requireVerticalAnchor,
      seed: index + 5000 + similarityAttempts * 211,
      perceptualTarget: request.perceptualTarget,
    });

    similarityAttempts += 1;
  }

  rememberPuzzleFingerprint(referenceShape);

  const correctShape = chooseCorrectShape(referenceShape, request);

  const distractors = generateStructuralDistractors(referenceShape, index + attempt * 997, 3);

  recentPuzzleSeeds.push(index + attempt * 17);
if (recentPuzzleSeeds.length > 50) recentPuzzleSeeds.shift();

const finalAnswers = shuffleAnswers(
    removeDuplicateAnswers([
      { shape: correctShape, type: "correct" },
      ...distractors,
    ]),
    index + 7000 + attempt * 101
  );

  const correctIndex = finalAnswers.findIndex((answer) => answer.type === "correct");
  const validation = validateShape(referenceShape);

  if (correctIndex < 0 || finalAnswers.length < 4) {
    if (attempt >= 8) {
      return buildFallbackPuzzle(index, request);
    }

    return buildPuzzleAttempt(index, request, attempt + 1);
  }

  return {
    id: `mr-${String(index + 1).padStart(3, "0")}`,
    referenceShape,
    answers: finalAnswers,
    correctIndex,
    feedback: "Compare the object’s structure rather than its outline alone.",
    profile: {
      ...validation.profile,
      focus: request.focus,
      transformationProfile: getTransformationProfile(referenceShape, correctShape),
      perceptualTarget: request.perceptualTarget,
      transformationTarget: request.transformationTarget,
    },
  };
}

function generateStructuralDistractors(referenceShape: Shape, seed: number, count: number): AnswerOption[] {
  const distractors: AnswerOption[] = [];
  const seen = new Set<string>([shapeKey(normalizeShape(referenceShape))]);

  const mirrored = normalizeShape(mirrorX(referenceShape));
  if (!areRotationallyEquivalent(referenceShape, mirrored)) {
    distractors.push({ shape: mirrored, type: "mirror" });
    seen.add(shapeKey(mirrored));
  }

  let attempt = 0;

  while (distractors.length < count && attempt < 80) {
    const candidate = generateConnectedShape({
      cubeCount: referenceShape.length,
      requireVerticalAnchor: true,
      seed: seed + 3000 + attempt * 41,
      perceptualTarget: {
        maxAmbiguityRisk: 0.5,
        minAnchorClarity: 0.5,
        maxOcclusionDensity: 0.55,
      },
    });

    const key = shapeKey(candidate);

    if (
      !seen.has(key) &&
      !areRotationallyEquivalent(referenceShape, candidate)
    ) {
      distractors.push({
        shape: candidate,
        type: attempt % 2 === 0 ? "wrong-axis" : "wrong-angle",
      });
      seen.add(key);
    }

    attempt++;
  }

  return distractors.slice(0, count);
}

const recentPuzzleSeeds: number[] = [];
const recentPuzzleFingerprints: string[] = [];
const recentCorrectAnswerPositions: number[] = [];

function shuffleAnswers(answers: AnswerOption[], seed = 1): AnswerOption[] {
  const random = createSeededRandom(seed);

  for (let attempt = 0; attempt < 6; attempt++) {
    const shuffled = [...answers];

    for (let index = shuffled.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    const correctIndex = shuffled.findIndex((answer) => answer.type === "correct");
    const recent = recentCorrectAnswerPositions.slice(-2);

    const repeatedTooOften = recent.length >= 2 && recent.every((position) => position === correctIndex);

    if (!repeatedTooOften) {
      recentCorrectAnswerPositions.push(correctIndex);
      if (recentCorrectAnswerPositions.length > 12) {
        recentCorrectAnswerPositions.shift();
      }

      return shuffled;
    }
  }

  return [...answers];
}

function buildFallbackPuzzle(index: number, request: PuzzleRequest): Puzzle {
  const referenceShape = fallbackShape();
  const correctShape = rotateY90(referenceShape);
  const answers: AnswerOption[] = removeDuplicateAnswers([
    { shape: correctShape, type: "correct" },
    { shape: mirrorX(referenceShape), type: "mirror" },
    { shape: rotateX90(referenceShape), type: "wrong-axis" },
    { shape: rotateY180(referenceShape), type: "wrong-angle" },
  ]);
  const validation = validateShape(referenceShape);

  return {
    id: `mr-${String(index + 1).padStart(3, "0")}`,
    referenceShape,
    answers,
    correctIndex: 0,
    feedback: "Compare the object’s structure rather than its outline alone.",
    profile: {
      ...validation.profile,
      focus: request.focus,
      transformationProfile: getTransformationProfile(referenceShape, correctShape),
      perceptualTarget: request.perceptualTarget,
      transformationTarget: request.transformationTarget,
    },
  };
}

function adjustPerceptualTargetForFatigue(
  target: PerceptualTarget,
  fatigueEstimate: number
): PerceptualTarget {
  if (fatigueEstimate < 0.45) return target;

  const adjustment = Math.min(0.18, fatigueEstimate * 0.18);

  return {
    maxAmbiguityRisk: Math.max(0.22, target.maxAmbiguityRisk - adjustment),
    minAnchorClarity: Math.min(0.82, target.minAnchorClarity + adjustment),
    maxOcclusionDensity: Math.max(0.28, target.maxOcclusionDensity - adjustment),
  };
}

function adjustTransformationTargetForFatigue(
  target: TransformationTarget,
  fatigueEstimate: number
): TransformationTarget {
  if (fatigueEstimate < 0.45) return target;

  const adjustment = Math.min(0.2, fatigueEstimate * 0.2);

  return {
    maxAxisComplexity: Math.max(0.42, target.maxAxisComplexity - adjustment),
    maxAnchorDisruption: Math.max(0.28, target.maxAnchorDisruption - adjustment),
    maxSilhouetteVolatility: Math.max(0.35, target.maxSilhouetteVolatility - adjustment),
    minOrientationDistance: Math.max(0.12, target.minOrientationDistance - adjustment * 0.5),
    maxOrientationDistance: Math.max(0.5, target.maxOrientationDistance - adjustment),
  };
}

function getPerceptualTargetForPhase(phase: SessionPhase): PerceptualTarget {
  switch (phase) {
    case "warmup":
    case "recovery":
      return {
        maxAmbiguityRisk: 0.28,
        minAnchorClarity: 0.72,
        maxOcclusionDensity: 0.35,
      };

    case "stretch":
      return {
        maxAmbiguityRisk: 0.48,
        minAnchorClarity: 0.55,
        maxOcclusionDensity: 0.55,
      };

    case "reinforcement":
      return {
        maxAmbiguityRisk: 0.34,
        minAnchorClarity: 0.68,
        maxOcclusionDensity: 0.42,
      };

    case "core":
    default:
      return {
        maxAmbiguityRisk: 0.38,
        minAnchorClarity: 0.62,
        maxOcclusionDensity: 0.45,
      };
  }
}

function getTransformationTargetForPhase(phase: SessionPhase): TransformationTarget {
  switch (phase) {
    case "warmup":
    case "recovery":
      return {
        maxAxisComplexity: 0.5,
        maxAnchorDisruption: 0.35,
        maxSilhouetteVolatility: 0.42,
        minOrientationDistance: 0.15,
        maxOrientationDistance: 0.55,
      };

    case "stretch":
      return {
        maxAxisComplexity: 0.85,
        maxAnchorDisruption: 0.72,
        maxSilhouetteVolatility: 0.75,
        minOrientationDistance: 0.45,
        maxOrientationDistance: 0.95,
      };

    case "reinforcement":
      return {
        maxAxisComplexity: 0.62,
        maxAnchorDisruption: 0.48,
        maxSilhouetteVolatility: 0.55,
        minOrientationDistance: 0.25,
        maxOrientationDistance: 0.7,
      };

    case "core":
    default:
      return {
        maxAxisComplexity: 0.7,
        maxAnchorDisruption: 0.58,
        maxSilhouetteVolatility: 0.62,
        minOrientationDistance: 0.28,
        maxOrientationDistance: 0.82,
      };
  }
}

function fatigueAdjustmentStrength(session: SessionState) {
  return Math.min(
    1,
    Math.max(
      session.fatigueEstimate,
      session.fatigueSignals.prolongedDeliberation,
      session.fatigueSignals.sustainedHighVolatility,
      session.fatigueSignals.errorRecoveryLoad
    )
  );
}

function getRecoveryAdjustedPerceptualTarget(session: SessionState): PerceptualTarget {
  const base = getPerceptualTargetForPhase(session.phase);
  const strength = session.phase === "recovery" ? 1 : fatigueAdjustmentStrength(session) * 0.45;

  return {
    maxAmbiguityRisk: Math.max(0.22, base.maxAmbiguityRisk - strength * 0.12),
    minAnchorClarity: Math.min(0.82, base.minAnchorClarity + strength * 0.12),
    maxOcclusionDensity: Math.max(0.28, base.maxOcclusionDensity - strength * 0.12),
  };
}

function getRecoveryAdjustedTransformationTarget(session: SessionState): TransformationTarget {
  const base = getTransformationTargetForPhase(session.phase);
  const strength = session.phase === "recovery" ? 1 : fatigueAdjustmentStrength(session) * 0.45;

  return {
    maxAxisComplexity: Math.max(0.38, base.maxAxisComplexity - strength * 0.12),
    maxAnchorDisruption: Math.max(0.28, base.maxAnchorDisruption - strength * 0.18),
    maxSilhouetteVolatility: Math.max(0.34, base.maxSilhouetteVolatility - strength * 0.16),
    minOrientationDistance: Math.max(0.12, base.minOrientationDistance - strength * 0.06),
    maxOrientationDistance: Math.max(0.45, base.maxOrientationDistance - strength * 0.14),
  };
}

function isApproachingSessionEnd(session: SessionState) {
  return session.totalQuestions - session.questionIndex <= 3;
}

function getAdaptiveWarmupLength(profile: CognitiveProfile) {
  if (profile.longitudinalSignals.recentFatigueAverage > 0.52) {
    return 3;
  }

  if (profile.longitudinalSignals.orientationStabilityTrend > 0.72) {
    return 1;
  }

  return 2;
}

function determineSessionTexture(session: SessionState): SessionTexture {
  if (session.recoveryCount > 0 || session.fatigueEstimate > 0.58) {
    return "recovery-weighted";
  }

  if (session.currentFocus === "mirror-discrimination") {
    return "mirror-focus";
  }

  if (session.phase === "stretch") {
    return "high-transformation";
  }

  if (session.confidenceMomentum > 0.72) {
    return "orientation-flow";
  }

  return "stabilisation";
}

function getAdaptiveComplexityBias(profile: CognitiveProfile) {
  if (profile.longitudinalSignals.adaptiveComplexityTolerance > 0.74) {
    return 1;
  }

  if (profile.longitudinalSignals.recentFatigueAverage > 0.55) {
    return -1;
  }

  return 0;
}

function createPuzzleRequest(session: SessionState): PuzzleRequest {
  const profile = loadLocalProfile();
  const sessionTexture = determineSessionTexture(session);
  const complexityBias = getAdaptiveComplexityBias(profile);

  const approachingEnd = isApproachingSessionEnd(session);

  const difficulty: DifficultyBand =
    session.phase === "warmup" || session.phase === "recovery"
      ? "foundational"
      : session.phase === "stretch"
      ? "stretch"
      : "developing";

  return {
    focus:
      sessionTexture === "mirror-focus"
        ? "mirror-discrimination"
        : session.currentFocus,
    difficulty,
    targetCubeCount:
      sessionTexture === "recovery-weighted"
        ? 5
        : difficulty === "foundational"
        ? 5 + Math.max(0, complexityBias)
        : difficulty === "developing"
        ? 6 + complexityBias
        : 7 + complexityBias,
    requireVerticalAnchor: true,
    allowMirrorDistractor: true,
    allowMultiAxisTransform:
      session.phase === "stretch" || sessionTexture === "high-transformation",
    distractorSubtlety: approachingEnd
      ? "moderate"
      : difficulty === "foundational"
      ? "clear"
      : difficulty === "developing"
      ? "moderate"
      : "subtle",
    perceptualTarget: approachingEnd
      ? {
          ...getRecoveryAdjustedPerceptualTarget(session),
          maxAmbiguityRisk: Math.max(
            0.22,
            getRecoveryAdjustedPerceptualTarget(session).maxAmbiguityRisk - 0.08
          ),
          minAnchorClarity: Math.min(
            0.85,
            getRecoveryAdjustedPerceptualTarget(session).minAnchorClarity + 0.08
          ),
        }
      : getRecoveryAdjustedPerceptualTarget(session),
    transformationTarget: approachingEnd
      ? {
          ...getRecoveryAdjustedTransformationTarget(session),
          maxAnchorDisruption: Math.max(
            0.25,
            getRecoveryAdjustedTransformationTarget(session).maxAnchorDisruption - 0.1
          ),
          maxSilhouetteVolatility: Math.max(
            0.32,
            getRecoveryAdjustedTransformationTarget(session).maxSilhouetteVolatility - 0.08
          ),
        }
      : getRecoveryAdjustedTransformationTarget(session),
    recentTransformationProfiles: session.recentTransformationProfiles,
  };
}

function getRecentAccuracy(responses: ResponseRecord[], count = 3) {
  const recent = responses.slice(-count);
  if (recent.length === 0) return 1;
  return recent.filter((response) => response.correct).length / recent.length;
}

function getAverageRecentResponseTime(responses: ResponseRecord[], count = 3) {
  const recent = responses.slice(-count);
  if (recent.length === 0) return 0;
  return Math.round(recent.reduce((sum, response) => sum + response.responseTimeMs, 0) / recent.length);
}

function countRecentErrorsByType(responses: ResponseRecord[], type: AnswerType, count = 4) {
  return responses.slice(-count).filter((response) => !response.correct && response.selectedType === type).length;
}

function getReinforcementFocus(responses: ResponseRecord[]): TrainingFocus | null {
  const mirrorErrors = countRecentErrorsByType(responses, "mirror", 4);
  const axisErrors = countRecentErrorsByType(responses, "wrong-axis", 4);
  const angleErrors = countRecentErrorsByType(responses, "wrong-angle", 4);

  if (mirrorErrors >= 2) return "mirror-discrimination";
  if (axisErrors >= 2) return "rotation-axis-tracking";
  if (angleErrors >= 2) return "rotation-magnitude-recognition";
  return null;
}

function recoveryIsRecommended(responses: ResponseRecord[]) {
  return (
    getRecentAccuracy(responses, 3) < 0.5 ||
    getAverageRecentResponseTime(responses, 3) > 25000
  );
}

function shouldTriggerRecoveryWindow(session: SessionState) {
  const recentlyRecovered =
    session.lastRecoveryAt !== null &&
    session.questionIndex - session.lastRecoveryAt < 3;

  if (session.recoveryCount >= 2 || recentlyRecovered) {
    return false;
  }

  return (
    recoveryIsRecommended(session.responses) ||
    session.fatigueEstimate > 0.58 ||
    session.fatigueSignals.prolongedDeliberation > 0.55 ||
    session.fatigueSignals.sustainedHighVolatility > 0.62 ||
    session.fatigueSignals.errorRecoveryLoad > 0.55
  );
}

function recoveryShouldResolve(session: SessionState) {
  return (
    session.phase === "recovery" &&
    session.restorationSignals.restorationMomentum > 0.72 &&
    session.fatigueEstimate < 0.45
  );
}

function orchestrateNextStep(session: SessionState): Pick<SessionState, "phase" | "currentFocus"> {
  const profile = loadLocalProfile();
  const adaptiveWarmupLength = getAdaptiveWarmupLength(profile);

  if (session.questionIndex < adaptiveWarmupLength) {
    return { phase: "warmup", currentFocus: session.currentFocus };
  }

  if (recoveryShouldResolve(session)) {
    return { phase: "core", currentFocus: session.currentFocus };
  }

  const questionsSincePhaseChange = session.questionIndex - session.lastPhaseChangeAt;
  if (questionsSincePhaseChange < 2) return { phase: session.phase, currentFocus: session.currentFocus };

  const reinforcementFocus = getReinforcementFocus(session.responses);
  if (reinforcementFocus && session.reinforcementCount < 2) {
    return { phase: "reinforcement", currentFocus: reinforcementFocus };
  }

  if (shouldTriggerRecoveryWindow(session)) {
    return { phase: "recovery", currentFocus: session.currentFocus };
  }

  if (getRecentAccuracy(session.responses, 3) > 0.8 && session.confidenceMomentum > 0.7) {
    return { phase: "stretch", currentFocus: session.currentFocus };
  }

  return { phase: "core", currentFocus: session.currentFocus };
}

function calculateFatigueSignals(
  responses: ResponseRecord[],
  transformationProfiles: TransformationProfile[],
  currentPhase: SessionPhase
): FatigueSignals {
  const recentResponses = responses.slice(-5);
  const recentProfiles = transformationProfiles.slice(-5);

  const prolongedDeliberation = Math.min(
    1,
    recentResponses.filter((item) => item.responseTimeMs > 18000).length / 4
  );

  const repeatedAnchorDisruption = Math.min(
    1,
    recentProfiles.reduce((sum, profile) => sum + profile.anchorDisruption, 0) /
      Math.max(recentProfiles.length, 1)
  );

  const sustainedHighVolatility = Math.min(
    1,
    recentProfiles.reduce((sum, profile) => sum + profile.silhouetteVolatility, 0) /
      Math.max(recentProfiles.length, 1)
  );

  const consecutiveStretchExposure = currentPhase === "stretch" ? Math.min(1, recentProfiles.length / 5) : 0;

  const errorRecoveryLoad = Math.min(
    1,
    recentResponses.filter((item) => !item.correct).length / 4
  );

  return {
    prolongedDeliberation,
    repeatedAnchorDisruption,
    sustainedHighVolatility,
    consecutiveStretchExposure,
    errorRecoveryLoad,
  };
}

function calculateFatigueEstimate(signals: FatigueSignals) {
  return Math.min(
    1,
    signals.prolongedDeliberation * 0.28 +
      signals.repeatedAnchorDisruption * 0.22 +
      signals.sustainedHighVolatility * 0.2 +
      signals.consecutiveStretchExposure * 0.18 +
      signals.errorRecoveryLoad * 0.12
  );
}

function calculateRestorationSignals(responses: ResponseRecord[]): RestorationSignals {
  const recentRecoveryResponses = responses
    .filter((response) => response.phaseAtAnswer === "recovery")
    .slice(-3);

  if (recentRecoveryResponses.length === 0) {
    return {
      recentRecoveryAccuracy: 0,
      recentRecoveryTempo: "none",
      restorationMomentum: 0,
    };
  }

  const recentRecoveryAccuracy =
    recentRecoveryResponses.filter((response) => response.correct).length /
    recentRecoveryResponses.length;

  const averageRecoveryTime =
    recentRecoveryResponses.reduce((sum, response) => sum + response.responseTimeMs, 0) /
    recentRecoveryResponses.length;

  const recentRecoveryTempo = averageRecoveryTime > 18000 ? "strained" : "stabilising";

  const restorationMomentum = Math.min(
    1,
    recentRecoveryAccuracy * 0.7 + (recentRecoveryTempo === "stabilising" ? 0.3 : 0.05)
  );

  return {
    recentRecoveryAccuracy,
    recentRecoveryTempo,
    restorationMomentum,
  };
}

function generateSessionInsights(
  session: SessionState,
  latestResponse: ResponseRecord
): SessionInsight[] {
  const insights = [...session.recentInsights];

  if (
    latestResponse.correct &&
    latestResponse.responseTimeMs < 9000 &&
    session.phase === "stretch"
  ) {
    insights.unshift({
      title: "Orientation stability",
      body: "More demanding viewpoint transitions appeared increasingly manageable during this session.",
    });
  }

  if (
    !latestResponse.correct &&
    latestResponse.selectedType === "mirror"
  ) {
    insights.unshift({
      title: "Mirror interference",
      body: "Mirrored structures can preserve convincing visual relationships while quietly reversing internal organisation.",
    });
  }

  if (
    session.phase === "recovery" &&
    latestResponse.correct
  ) {
    insights.unshift({
      title: "Perceptual recovery",
      body: "Clearer transitions often help restore stable internal representations after demanding transformations.",
    });
  }

  if (
    latestResponse.correct &&
    latestResponse.responseTimeMs < 7000 &&
    session.continuityState.orientationConfidence > 0.72
  ) {
    insights.unshift({
      title: "Perceptual fluency",
      body: "Certain viewpoint transitions appeared to require less deliberate reconstruction during this session.",
    });
  }

  return insights.slice(0, 3);
}

function calculateContinuityState(
  session: SessionState,
  latestTransformationProfile?: TransformationProfile
): ContinuityState {
  const previous = session.continuityState;

  if (!latestTransformationProfile) {
    return previous;
  }

  const representationStability = Math.max(
    0,
    Math.min(
      1,
      previous.representationStability * 0.72 +
        (1 - latestTransformationProfile.silhouetteVolatility) * 0.28
    )
  );

  const anchorPersistenceState = Math.max(
    0,
    Math.min(
      1,
      previous.anchorPersistenceState * 0.7 +
        (1 - latestTransformationProfile.anchorDisruption) * 0.3
    )
  );

  const symmetryFatigue = Math.max(
    0,
    Math.min(
      1,
      previous.symmetryFatigue * 0.82 + latestTransformationProfile.symmetryInterference * 0.18
    )
  );

  const orientationConfidence = Math.max(
    0,
    Math.min(
      1,
      previous.orientationConfidence * 0.7 +
        representationStability * 0.15 +
        anchorPersistenceState * 0.15
    )
  );

  return {
    representationStability,
    anchorPersistenceState,
    symmetryFatigue,
    orientationConfidence,
  };
}

function recordResponse(session: SessionState, response: ResponseRecord): SessionState {
  const responses = [...session.responses, response];
  const recentTransformationProfiles = response.transformationProfile
    ? [...session.recentTransformationProfiles, response.transformationProfile].slice(-6)
    : session.recentTransformationProfiles;
  const fatigueSignals = calculateFatigueSignals(
    responses,
    recentTransformationProfiles,
    session.phase
  );

  const fatigueEstimate = calculateFatigueEstimate(fatigueSignals);
  const restorationSignals = calculateRestorationSignals(responses);

  const continuityState = calculateContinuityState(
    session,
    response.transformationProfile
  );

  const confidenceMomentum = response.correct
    ? Math.min(session.confidenceMomentum + 0.15, 1)
    : Math.max(session.confidenceMomentum - 0.12, 0);

  const provisionalSession: SessionState = {
    ...session,
    sessionTexture: determineSessionTexture(session),
    questionIndex: session.questionIndex + 1,
    score: response.correct ? session.score + 1 : session.score,
    responses,
    recentTransformationProfiles,
    fatigueSignals,
    restorationSignals,
    continuityState,
    fatigueEstimate,
    confidenceMomentum,
  };

  const recentInsights = generateSessionInsights(provisionalSession, response);
  const sessionWithInsights: SessionState = {
    ...provisionalSession,
    recentInsights,
  };

  const decision = orchestrateNextStep(sessionWithInsights);
  const enteringReinforcement = decision.phase === "reinforcement" && session.phase !== "reinforcement";
  const enteringRecovery = decision.phase === "recovery" && session.phase !== "recovery";
  const phaseChanged = decision.phase !== session.phase;

  return {
    ...sessionWithInsights,
    phase: decision.phase,
    currentFocus: decision.currentFocus,
    lastPhaseChangeAt: phaseChanged ? provisionalSession.questionIndex : session.lastPhaseChangeAt,
    reinforcementCount: enteringReinforcement ? session.reinforcementCount + 1 : session.reinforcementCount,
    recoveryCount: enteringRecovery ? session.recoveryCount + 1 : session.recoveryCount,
    lastRecoveryAt: enteringRecovery ? provisionalSession.questionIndex : session.lastRecoveryAt,
  };
}

function calculateAccuracy(responses: ResponseRecord[]) {
  if (responses.length === 0) return 0;
  return Math.round((responses.filter((response) => response.correct).length / responses.length) * 100);
}

function calculateAverageResponseTime(responses: ResponseRecord[]) {
  if (responses.length === 0) return 0;
  return Math.round(responses.reduce((sum, response) => sum + response.responseTimeMs, 0) / responses.length);
}

function getResponseTempoLabel(responseTimeMs: number) {
  if (responseTimeMs < 5000) return "quick";
  if (responseTimeMs < 15000) return "steady";
  return "deliberate";
}

function getRecentTimingProfile(responses: ResponseRecord[]) {
  const recent = responses.slice(-5);

  if (recent.length === 0) {
    return {
      averageResponseTimeMs: 0,
      quickResponses: 0,
      steadyResponses: 0,
      deliberateResponses: 0,
      note: "No timing pattern available yet.",
    };
  }

  const labels = recent.map((response) => getResponseTempoLabel(response.responseTimeMs));

  return {
    averageResponseTimeMs: calculateAverageResponseTime(recent),
    quickResponses: labels.filter((label) => label === "quick").length,
    steadyResponses: labels.filter((label) => label === "steady").length,
    deliberateResponses: labels.filter((label) => label === "deliberate").length,
    note: "Timing is treated as a pacing signal, not as direct evidence of internal cognition.",
  };
}

function identifyAdaptiveFocus(responses: ResponseRecord[]): TrainingFocus {
  const incorrect = responses.filter((response) => !response.correct);
  const mirrorErrors = incorrect.filter((response) => response.selectedType === "mirror").length;
  const axisErrors = incorrect.filter((response) => response.selectedType === "wrong-axis").length;
  const angleErrors = incorrect.filter((response) => response.selectedType === "wrong-angle").length;

  if (mirrorErrors >= axisErrors && mirrorErrors >= angleErrors && mirrorErrors > 0) return "mirror-discrimination";
  if (axisErrors >= angleErrors && axisErrors > 0) return "rotation-axis-tracking";
  if (angleErrors > 0) return "rotation-magnitude-recognition";
  return "rotational-consistency";
}

function calculateLongitudinalSignals(
  profile: CognitiveProfile,
  responses: ResponseRecord[]
): LongitudinalSignals {
  const recentAccuracy = responses.filter((r) => r.correct).length / Math.max(1, responses.length);

  const mirrorErrors = responses.filter(
    (response) => !response.correct && response.selectedType === "mirror"
  ).length;

  const axisErrors = responses.filter(
    (response) => !response.correct && response.selectedType === "wrong-axis"
  ).length;

  const recoveryResponses = responses.filter((response) => response.phaseAtAnswer === "recovery");

  return {
    perceptualConfidenceTrend:
      profile.longitudinalSignals.perceptualConfidenceTrend * 0.72 +
      recentAccuracy * 0.28,
    adaptiveComplexityTolerance:
      profile.longitudinalSignals.adaptiveComplexityTolerance * 0.75 +
      Math.min(1, responses.length / 16) * 0.25,
    recentFatigueAverage:
      profile.longitudinalSignals.recentFatigueAverage * 0.7 +
      (1 - recentAccuracy) * 0.3,
    recentRecoveryResponsiveness:
      recoveryResponses.length > 0
        ? recoveryResponses.filter((r) => r.correct).length / recoveryResponses.length
        : profile.longitudinalSignals.recentRecoveryResponsiveness,
    mirrorErrorBias: mirrorErrors / Math.max(1, responses.length),
    axisTrackingBias: axisErrors / Math.max(1, responses.length),
    orientationStabilityTrend:
      profile.longitudinalSignals.orientationStabilityTrend * 0.75 + recentAccuracy * 0.25,
    preferredSessionLength: responses.length,
    voluntaryContinuationRate:
      profile.sessionsCompleted > 0
        ? Math.min(1, profile.longitudinalSignals.voluntaryContinuationRate + 0.08)
        : 0.5,
  };
}

function updateCognitiveProfile(profile: CognitiveProfile, responses: ResponseRecord[]): CognitiveProfile {
  const learningRate = 0.08;
  const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

  const updateDomain = (current: number, focus: TrainingFocus) => {
    const relevant = responses.filter((response) => response.focus === focus);
    if (relevant.length === 0) return current;
    const accuracy = relevant.filter((response) => response.correct).length / relevant.length;
    return clamp(current * (1 - learningRate) + accuracy * learningRate);
  };

  const updated: CognitiveProfile = {
    ...profile,
    longitudinalSignals: calculateLongitudinalSignals(profile, responses),
    sessionsCompleted: profile.sessionsCompleted + 1,
    rotationalConsistency: updateDomain(profile.rotationalConsistency, "rotational-consistency"),
    mirrorDiscrimination: updateDomain(profile.mirrorDiscrimination, "mirror-discrimination"),
    rotationAxisTracking: updateDomain(profile.rotationAxisTracking, "rotation-axis-tracking"),
    rotationMagnitudeRecognition: updateDomain(profile.rotationMagnitudeRecognition, "rotation-magnitude-recognition"),
    averageResponseTimeMs: calculateAverageResponseTime(responses) || profile.averageResponseTimeMs,
    recentFocus: identifyAdaptiveFocus(responses),
    updatedAt: new Date().toISOString(),
  };

  return updated;
}

const TILE_WIDTH = 34;
const TILE_HEIGHT = 17;
const ELEVATION = 34;

function projectCube(cube: Cube) {
  return {
    x: (cube.x - cube.y) * TILE_WIDTH,
    y: (cube.x + cube.y) * TILE_HEIGHT - cube.z * ELEVATION,
  };
}

function getCubeFaces(cube: Cube) {
  const { x: cx, y: cy } = projectCube(cube);

  return {
    top: [
      [cx, cy - TILE_HEIGHT],
      [cx + TILE_WIDTH, cy],
      [cx, cy + TILE_HEIGHT],
      [cx - TILE_WIDTH, cy],
    ],
    left: [
      [cx - TILE_WIDTH, cy],
      [cx, cy + TILE_HEIGHT],
      [cx, cy + TILE_HEIGHT + ELEVATION],
      [cx - TILE_WIDTH, cy + ELEVATION],
    ],
    right: [
      [cx + TILE_WIDTH, cy],
      [cx, cy + TILE_HEIGHT],
      [cx, cy + TILE_HEIGHT + ELEVATION],
      [cx + TILE_WIDTH, cy + ELEVATION],
    ],
  };
}

function ShapeRenderer({ shape, large = false, compact = false }: { shape: Shape; large?: boolean; compact?: boolean }) {
  const occupied = new Set(shape.map((cube) => cubeKey(cube)));

  const sortedCubes = [...shape].sort((a, b) => {
    const depthA = a.x + a.y + a.z * 1.2;
    const depthB = b.x + b.y + b.z * 1.2;

    if (depthA !== depthB) return depthA - depthB;
    if (a.y !== b.y) return a.y - b.y;
    if (a.x !== b.x) return a.x - b.x;
    return a.z - b.z;
  });

  const toPoints = (points: number[][]) =>
    points.map(([x, y]) => `${x},${y}`).join(" ");

  const renderedFacePoints = sortedCubes.flatMap((cube) => {
    const faces = getCubeFaces(cube);
    return [...faces.top, ...faces.left, ...faces.right];
  });

  const minRenderedX = Math.min(...renderedFacePoints.map(([x]) => x));
  const maxRenderedX = Math.max(...renderedFacePoints.map(([x]) => x));
  const minRenderedY = Math.min(...renderedFacePoints.map(([, y]) => y));
  const maxRenderedY = Math.max(...renderedFacePoints.map(([, y]) => y));
  const padding = large ? 36 : 28;
  const dynamicViewBox = `${minRenderedX - padding} ${minRenderedY - padding} ${
    maxRenderedX - minRenderedX + padding * 2
  } ${maxRenderedY - minRenderedY + padding * 2}`;

  function hasCubeAt(x: number, y: number, z: number) {
    return occupied.has(`${x},${y},${z}`);
  }

  function isTopExposed(cube: Cube) {
    return !hasCubeAt(cube.x, cube.y, cube.z + 1);
  }

  function isLeftExposed(cube: Cube) {
    return !hasCubeAt(cube.x, cube.y + 1, cube.z);
  }

  function isRightExposed(cube: Cube) {
    return !hasCubeAt(cube.x + 1, cube.y, cube.z);
  }

  return (
    <svg
      viewBox={dynamicViewBox}
      className={large
        ? compact
          ? "h-40 w-40 sm:h-56 sm:w-56 lg:h-72 lg:w-72"
          : "h-64 w-64 sm:h-80 sm:w-80"
        : compact
        ? "h-32 w-32 sm:h-40 sm:w-40"
        : "h-36 w-36 sm:h-44 sm:w-44"}
      aria-hidden="true"
    >
      <g
        transform="translate(0, 10)"
        style={{ shapeRendering: "geometricPrecision" }}
        opacity="0.98"
      >
        {sortedCubes.map((cube, index) => {
          const faces = getCubeFaces(cube);

          return (
            <g key={`${cube.x}-${cube.y}-${cube.z}-${index}`}>
              {isLeftExposed(cube) && (
                <polygon
                  points={toPoints(faces.left)}
                  fill="#C7D0DA"
                  stroke="rgba(17,20,24,0.3)"
                  strokeWidth="1.05"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {isRightExposed(cube) && (
                <polygon
                  points={toPoints(faces.right)}
                  fill="#AAB7C4"
                  stroke="rgba(17,20,24,0.32)"
                  strokeWidth="1.05"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {isTopExposed(cube) && (
                <polygon
                  points={toPoints(faces.top)}
                  fill="#E1E6EC"
                  stroke="rgba(17,20,24,0.26)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function getFocusLabel(focus: TrainingFocus) {
  switch (focus) {
    case "mirror-discrimination":
      return "mirror recognition";
    case "rotation-axis-tracking":
      return "rotation-axis tracking";
    case "rotation-magnitude-recognition":
      return "rotation magnitude recognition";
    case "rotational-consistency":
    default:
      return "rotational fluency";
  }
}

function getFocusMessage(focus: TrainingFocus) {
  switch (focus) {
    case "mirror-discrimination":
      return "Upcoming sessions will continue strengthening mirror recognition.";
    case "rotation-axis-tracking":
      return "Upcoming sessions will reinforce rotation-axis tracking.";
    case "rotation-magnitude-recognition":
      return "Upcoming sessions will continue building rotation magnitude recognition.";
    case "rotational-consistency":
    default:
      return "Upcoming sessions will continue strengthening rotational consistency.";
  }
}

function getAdaptiveContinuityMessage(profile: CognitiveProfile) {
  if (profile.longitudinalSignals.perceptualConfidenceTrend > 0.76) {
    return "Recent sessions suggest increasingly stable structural recognition under changing orientations.";
  }

  if (profile.longitudinalSignals.recentRecoveryResponsiveness > 0.72) {
    return "Recent sessions suggest improved recovery after more demanding perceptual transitions.";
  }

  return "The system continues adapting pacing and ambiguity based on recent interaction patterns.";
}

function getAdaptiveOpeningMessage(profile: CognitiveProfile) {
  if (profile.sessionsCompleted <= 1) {
    return "Spatial recognition improves gradually through repeated exposure and stable perceptual pacing.";
  }

  if (profile.longitudinalSignals.orientationStabilityTrend > 0.72) {
    return "Recent sessions suggest increasingly stable orientation tracking across changing viewpoints.";
  }

  if (profile.longitudinalSignals.recentFatigueAverage > 0.45) {
    return "Today’s session may begin with slightly clearer transitions to support perceptual stability.";
  }

  return "Recent sessions suggest gradually strengthening structural recognition and rotational fluency.";
}

function getLongitudinalReflection(profile: CognitiveProfile) {
  if (profile.longitudinalSignals.orientationStabilityTrend > 0.72) {
    return "Recent sessions suggest improving orientation stability across changing viewpoints.";
  }

  if (profile.longitudinalSignals.mirrorErrorBias > 0.28) {
    return "Recent sessions suggest ongoing improvement in distinguishing mirrored structures.";
  }

  if (profile.longitudinalSignals.recentFatigueAverage > 0.42) {
    return "Recent sessions suggest sustained engagement during cognitively demanding transitions.";
  }

  return "Recent sessions suggest gradually strengthening spatial consistency and structural recognition.";
}

function getSessionReflectionMessage(session: SessionState) {
  if (session.recoveryCount > 0 && session.restorationSignals.restorationMomentum > 0.65) {
    return "The session included a calmer recovery sequence and your responses showed signs of restored stability.";
  }

  if (session.recoveryCount > 0) {
    return "The session included a calmer recovery sequence to support visual clarity and orientation stability.";
  }

  if (session.reinforcementCount > 0) {
    return "The session introduced focused reinforcement to support more consistent spatial recognition.";
  }

  if (session.fatigueEstimate > 0.55) {
    return "You completed a demanding spatial reasoning session with sustained cognitive effort.";
  }

  return "You completed a focused spatial reasoning session with steady engagement.";
}

function getResponseFeedback(puzzle: Puzzle, selectedIndex: number) {
  if (selectedIndex === puzzle.correctIndex) {
    const positiveFeedback = [
      "Correct — structure preserved through rotation.",
      "Correct — the object identity remained consistent.",
      "Correct — anchor relationships remained stable.",
      "Correct — orientation changed without altering structure.",
    ];

    return positiveFeedback[(puzzle.id.length + selectedIndex) % positiveFeedback.length];
  }

  const selectedType = puzzle.answers[selectedIndex]?.type;

  switch (selectedType) {
    case "mirror":
      return "Not quite — this option reverses part of the structure.";
    case "wrong-axis":
      return "Not quite — this follows a different rotation axis.";
    case "wrong-angle":
      return "Not quite — this changes the rotation magnitude.";
    default:
      return "Not quite — compare the object’s structure rather than its outline alone.";
  }
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-[#5ED3F3]/30 bg-[#5ED3F3]/10 px-7 py-4 font-medium text-[#D9F8FF] transition-all duration-300 ease-out hover:border-[#5ED3F3]/60 hover:bg-[#5ED3F3]/15 focus:outline-none focus:ring-2 focus:ring-[#5ED3F3]/40"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-white/10 px-7 py-4 font-medium text-[#C4CEDA] transition-colors duration-300 ease-out hover:text-[#F4F6F8] focus:outline-none focus:ring-2 focus:ring-[#5ED3F3]/30"
    >
      {children}
    </button>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#111418] p-6 text-left">
      <div className="text-sm text-[#8D98A6]">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-[#F4F6F8]">{value}</div>
    </div>
  );
}

function DebugPanel({ data }: { data: Record<string, unknown> }) {
  const showDebugPanel = false;

  if (!showDebugPanel) return null;

  return (
    <details className="mt-10 rounded-2xl border border-white/5 bg-black/20 p-5 text-left text-xs text-[#8D98A6]">
      <summary className="cursor-pointer select-none text-sm text-[#AAB4C0]">
        Development inspection
      </summary>
      <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

const COGNITIVE_NOTES = [
  {
    title: "Why spatial recognition improves through exposure",
    summary:
      "Repeated exposure gradually reduces the effort required to preserve object identity across changing viewpoints.",
    content:
      "Early sessions often feel effortful because the brain attempts to consciously track every structural detail. With repeated exposure, more stable internal representations begin to form automatically. Over time, rotations that once felt cognitively heavy often become smoother and less effortful to interpret.",
  },
  {
    title: "Why mirror shapes feel so convincing",
    summary:
      "Mirror distractors preserve much of an object’s visual structure while quietly reversing critical spatial relationships.",
    content:
      "Most people assume mental rotation problems are difficult because the objects are complex. In reality, much of the difficulty comes from mirror interference. Mirror shapes preserve many visual relationships while subtly reversing internal structure. Strong performers gradually learn to track stable anchor relationships instead of relying only on outline recognition.",
  },
  {
    title: "Why some rotations suddenly snap into place",
    summary:
      "Strong spatial performers often stabilise a small number of anchor relationships rather than mentally rotating every detail.",
    content:
      "Experienced performers rarely rotate every cube individually. Instead, the brain begins preserving only the most informative structural relationships. Once these anchors stabilise, the rest of the object often becomes suddenly coherent. This is why some difficult rotations can abruptly feel obvious after a period of uncertainty.",
  },
  {
    title: "Why fatigue changes spatial perception",
    summary:
      "Spatial fatigue often feels less like tiredness and more like instability, ambiguity, and reduced anchor clarity.",
    content:
      "Mental rotation depends heavily on maintaining stable internal relationships while transforming them. As fatigue accumulates, those relationships become noisier and distractors feel more convincing. Well-paced cognitive systems therefore benefit from subtle recovery periods that restore clarity without making the adaptation obvious.",
  },
];

function HomeScreen({ onBeginTraining }: { onBeginTraining: () => void }) {
  const profile = loadLocalProfile();
  const hasProgress = profile.sessionsCompleted > 0;
  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#111418] font-sans text-[#F4F6F8]">
      <header className="w-full border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div>
            <div className="text-xl font-semibold tracking-wide">FloSpatial</div>
            <div className="mt-1 text-xs tracking-[0.18em] text-[#6E7A88]">
              Precision cognitive training
            </div>
          </div>
          <button className="text-sm text-[#AAB4C0] transition-colors hover:text-[#F4F6F8]">Sign In</button>
        </div>
      </header>

      <section className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-8 py-24">
        <div className="max-w-xl">
          

          <h1 className="max-w-lg text-5xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            Build spatial reasoning through focused practice
          </h1>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-[#9AA3B2]">
            {hasProgress
              ? getAdaptiveOpeningMessage(profile)
              : "Structured spatial training designed to improve rotational recognition, orientation fluency, and technical reasoning performance."}
          </p>

          <div className="mt-14 flex flex-wrap gap-4">
            <PrimaryButton onClick={onBeginTraining}>{hasProgress ? "Continue Training" : "Begin Training"}</PrimaryButton>
            
            {hasProgress && (
              <SecondaryButton
                onClick={() =>
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
                }
              >
                Cognitive Notes
              </SecondaryButton>
            )}
          </div>

          <section className="mt-24 max-w-3xl">
            <div className="mb-6 text-sm uppercase tracking-[0.22em] text-[#6E7A88]">
              Cognitive Notes
            </div>

            <p className="mb-10 max-w-2xl text-sm leading-relaxed text-[#7F8A98]">
              Short reflections on spatial perception, mental rotation, and cognitive pacing.
            </p>

            <div className="grid gap-5">
              {COGNITIVE_NOTES.map((note, index) => (
                <button
                  key={note.title}
                  onClick={() => setSelectedNote(index)}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-left transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03] focus:outline-none focus:ring-2 focus:ring-[#5ED3F3]/20"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[#F4F6F8]">
                      {note.title}
                    </h3>
                    
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#9AA3B2]">
                    {note.summary}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {selectedNote !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
              <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#171C23] p-8 shadow-2xl shadow-black/40">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-[#6E7A88]">
                      Cognitive Note
                    </div>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#F4F6F8]">
                      {COGNITIVE_NOTES[selectedNote].title}
                    </h2>
                  </div>

                  <button
                    onClick={() => setSelectedNote(null)}
                    className="rounded-lg px-3 py-2 text-sm text-[#8D98A6] transition-colors hover:text-[#F4F6F8]"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-8 text-base leading-relaxed text-[#C8D2DD]">
                  {COGNITIVE_NOTES[selectedNote].content}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}

function OnboardingScreen({ onBeginSession }: { onBeginSession: (sessionLength: number) => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111418] p-8 text-[#F4F6F8]">
      <section className="w-full max-w-2xl rounded-[32px] border border-white/5 bg-[#171C23] p-10 text-center shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Mental Rotation</p>
        <h1 className="mx-auto mt-6 max-w-xl text-4xl font-semibold leading-tight">Recognise the same object from different angles</h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#9AA3B2]">
          Take your time. Focus on how the structure changes orientation while remaining the same object.
        </p>
        <div className="mt-10">
          <div className="grid gap-3 sm:grid-cols-3">
            {SESSION_LENGTH_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onBeginSession(preset.questions)}
                className="rounded-2xl border border-white/10 bg-[#111418] p-5 text-left transition-all duration-300 hover:border-[#5ED3F3]/40 focus:outline-none focus:ring-2 focus:ring-[#5ED3F3]/30"
              >
                <div className="text-lg font-semibold text-[#F4F6F8]">{preset.label}</div>
                <div className="mt-1 text-sm text-[#8D98A6]">{preset.questions} questions</div>
                <div className="mt-3 text-xs leading-relaxed text-[#6E7A88]">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SessionSummary({
  session,
  onContinueTraining,
  onReturnHome,
}: {
  session: SessionState;
  onContinueTraining: () => void;
  onReturnHome: () => void;
}) {
  const profile = loadLocalProfile();
  const accuracy = calculateAccuracy(session.responses);
  const averageResponseTimeMs = calculateAverageResponseTime(session.responses);
  const adaptiveFocus = identifyAdaptiveFocus(session.responses);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111418] p-8 text-[#F4F6F8]">
      <section className="w-full max-w-3xl rounded-[32px] border border-white/5 bg-[#171C23] p-10 text-center shadow-2xl shadow-black/20">
        
        <h1 className="mx-auto mt-6 max-w-xl text-4xl font-semibold leading-tight">Session complete</h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#9AA3B2]">
          {getSessionReflectionMessage(session)}
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/5 bg-[#111418] p-6 text-left">
          <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Next focus</div>
          <p className="mt-4 text-base leading-relaxed text-[#C8D2DD]">{getFocusMessage(adaptiveFocus)}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <MetricCard label="Accuracy" value={`${accuracy}%`} />
          <MetricCard label="Average response time" value={averageResponseTimeMs ? `${Math.round(averageResponseTimeMs / 1000)} sec` : "—"} />
          <MetricCard label="Questions" value={`${session.responses.length}`} />
        </div>

        <div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6 text-left">
          <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">
            Longitudinal reflection
          </div>

          <p className="mt-4 text-base leading-relaxed text-[#C8D2DD]">
            {getLongitudinalReflection(profile)}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/5 bg-[#111418] p-6 text-left">
          <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">
            Session reflection
          </div>

          <p className="mt-4 text-base leading-relaxed text-[#C8D2DD]">
            {session.sessionTexture === "recovery-weighted"
              ? "This session gently shifted toward clearer structures and steadier visual transitions."
              : session.sessionTexture === "mirror-focus"
              ? "This session placed more emphasis on distinguishing true rotations from mirrored alternatives."
              : session.sessionTexture === "high-transformation"
              ? "This session included more demanding changes in viewpoint and orientation."
              : session.sessionTexture === "orientation-flow"
              ? "This session supported a smoother rhythm of orientation tracking and recognition."
              : "This session maintained a balanced spatial reasoning rhythm."}
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/5 bg-[#111418] p-6 text-left">
          <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">
            Cognitive continuity
          </div>

          <p className="mt-4 text-base leading-relaxed text-[#C8D2DD]">
            {getAdaptiveContinuityMessage(profile)}
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/5 bg-[#111418] p-6 text-left">
          <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">Progress saved</div>
          <p className="mt-4 text-base leading-relaxed text-[#C8D2DD]">
            Your progress is saved on this device. Create an account if you’d like to continue across devices.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <SecondaryButton
              onClick={onContinueTraining}
            >
              Continue as guest
            </SecondaryButton>

            <PrimaryButton
              onClick={() =>
                alert(
                  "Account creation will be available soon. Your progress remains saved on this device."
                )
              }
            >
              Create account
            </PrimaryButton>

            <SecondaryButton
              onClick={onReturnHome}
            >
              Return home
            </SecondaryButton>
          </div>
        </div>
      </section>
    </main>
  );
}

function SessionScreen({ onReturnHome, sessionLength }: { onReturnHome: () => void; sessionLength: number }) {
  const profile = useMemo(() => loadLocalProfile(), []);
  const [session, setSession] = useState(() => createInitialSession(profile.recentFocus, sessionLength));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [isTransitioningPuzzle, setIsTransitioningPuzzle] = useState(false);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [profileSaved, setProfileSaved] = useState(false);
  const pendingTimeoutsRef = useRef<number[]>([]);
  const mobileScrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const currentPuzzle = useMemo(() => {
    if (session.questionIndex >= sessionLength) return null;
    return buildPuzzle(session.sessionSeed + session.questionIndex * 31, createPuzzleRequest(session));
  }, [session]);

  const compactPresentation = currentPuzzle
    ? currentPuzzle.profile.verticality >= 3 || currentPuzzle.profile.branching >= 6
    : false;

  useEffect(() => {
    if (typeof window === "undefined" || session.questionIndex === 0) return;

    if (window.innerWidth < 1024) {
      window.requestAnimationFrame(() => {
        mobileScrollAnchorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [session.questionIndex]);

  useEffect(() => {
    if (currentPuzzle || profileSaved) return;
    const existingProfile = loadLocalProfile();
    saveLocalProfile(updateCognitiveProfile(existingProfile, session.responses));
    setProfileSaved(true);
  }, [currentPuzzle, profileSaved, session.responses]);

  function clearPendingTimeouts() {
    pendingTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    pendingTimeoutsRef.current = [];
  }

  function restartSession() {
    clearPendingTimeouts();
    const latestProfile = loadLocalProfile();
    setSession(createInitialSession(latestProfile.recentFocus, sessionLength));
    setSelectedIndex(null);
    setShowFeedback(false);
    setAnswerLocked(false);
    setIsTransitioningPuzzle(false);
    setQuestionStartedAt(Date.now());
    setProfileSaved(false);
  }

  function handleSelect(index: number) {
    if (answerLocked || selectedIndex !== null || !currentPuzzle) return;

    const answeredPuzzle = currentPuzzle;
    const selectedOption = answeredPuzzle.answers[index];
    const correct = index === answeredPuzzle.correctIndex;
    const responseTimeMs = Date.now() - questionStartedAt;

    setAnswerLocked(true);
    setSelectedIndex(index);

    const feedbackTimeout = window.setTimeout(() => setShowFeedback(true), 300);

    const advanceTimeout = window.setTimeout(() => {
      setIsTransitioningPuzzle(true);

      window.setTimeout(() => {
        setSession((previous) =>
        recordResponse(previous, {
          puzzleId: answeredPuzzle.id,
          correct,
          responseTimeMs,
          selectedType: selectedOption.type,
          focus: answeredPuzzle.profile.focus,
          difficulty: answeredPuzzle.profile.estimatedDifficulty,
          transformationProfile: answeredPuzzle.profile.transformationProfile,
          phaseAtAnswer: session.phase,
        })
      );

        setSelectedIndex(null);
        setShowFeedback(false);
        setAnswerLocked(false);
        setQuestionStartedAt(Date.now());

        window.setTimeout(() => {
          setIsTransitioningPuzzle(false);
        }, 120);
      }, 120);
    }, 1800);

    pendingTimeoutsRef.current = [feedbackTimeout, advanceTimeout];
  }

  useEffect(() => {
    return () => {
      clearPendingTimeouts();
    };
  }, []);

  if (!currentPuzzle) {
    return <SessionSummary session={session} onContinueTraining={restartSession} onReturnHome={onReturnHome} />;
  }

  return (
    <main className="min-h-screen bg-[#111418] text-[#F4F6F8]">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <button
            onClick={onReturnHome}
            className="text-sm text-[#8D98A6] transition-colors hover:text-[#F4F6F8] focus:outline-none focus:ring-2 focus:ring-[#5ED3F3]/30 rounded-lg px-2 py-1"
          >
            ← Home
          </button>
          <div className="text-sm text-[#8D98A6]">Focus Mode</div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 py-14">
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-[#5ED3F3]/70 transition-all duration-500 ease-out"
            style={{ width: `${((session.questionIndex + 1) / sessionLength) * 100}%` }}
          />
        </div>

        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">Training Session</p>
            <h1 className="mt-4 text-3xl font-semibold">Mental Rotation</h1>
          </div>
          <div className="text-right text-sm text-[#8D98A6]">
            <div className="mb-2 text-xs tracking-[0.18em] text-[#6E7A88]">
              {session.sessionTexture === "recovery-weighted"
                ? "Recovery weighted"
                : session.sessionTexture === "mirror-focus"
                ? "Mirror focus"
                : session.sessionTexture === "high-transformation"
                ? "High transformation"
                : session.sessionTexture === "orientation-flow"
                ? "Orientation flow"
                : "Stabilisation"}
            </div>
            <div>Question {session.questionIndex + 1} of {sessionLength}</div>
            <div className="mt-1 text-xs text-[#6E7A88]">Focused spatial reasoning</div>
          </div>
        </div>

        <div
          ref={mobileScrollAnchorRef}
          className={`grid gap-6 transition-all duration-150 ease-out lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 ${
            isTransitioningPuzzle ? "opacity-40 scale-[0.995]" : "opacity-100 scale-100"
          }`}
        >
          <section className="sticky top-0 z-20 rounded-[28px] border border-white/5 bg-[#171C23]/95 p-4 shadow-2xl shadow-black/20 backdrop-blur-md lg:static lg:rounded-[32px] lg:p-10 lg:backdrop-blur-0">
            <div className="mb-3 flex items-center justify-between gap-4 text-sm text-[#8D98A6] lg:mb-6">
              <span>
                {session.phase === "recovery"
                  ? "Reference object — stabilised presentation"
                  : "Reference object"}
              </span>
              <span className="text-xs tracking-[0.16em] text-[#6E7A88] lg:hidden">
                {session.questionIndex + 1} / {sessionLength}
              </span>
            </div>
            <div className="flex min-h-[118px] items-center justify-center sm:min-h-[220px] lg:min-h-[360px]">
              <ShapeRenderer
                shape={currentPuzzle.referenceShape}
                large
                compact={true}
              />
            </div>

            {showFeedback && selectedIndex !== null && (
              <div className="mt-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-center text-xs leading-relaxed text-[#C8D2DD] sm:hidden">
                {getResponseFeedback(currentPuzzle, selectedIndex)}
              </div>
            )}
          </section>

          <section className="pt-2 lg:pt-0">
            <div className="mb-5 text-sm text-[#8D98A6] lg:mb-6">
              {session.sessionTexture === "mirror-focus"
                ? "Which option preserves the same structure rather than reversing it?"
                : "Which option shows the identical object viewed from a different angle?"}
            </div>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                compactPresentation ? "gap-4 sm:gap-6" : "gap-4 sm:gap-5"
              }`}
            >
              {currentPuzzle.answers.map((option, index) => {
                const isSelected = selectedIndex === index;
                const isCorrect = currentPuzzle.correctIndex === index;
                const isIncorrectSelected = showFeedback && isSelected && !isCorrect;

                return (
                  <button
                    key={`${currentPuzzle.id}-${index}`}
                    onClick={() => handleSelect(index)}
                    className={`rounded-2xl border bg-[#111418] p-5 transition-all duration-300 ease-out hover:border-[#5ED3F3]/30 focus:outline-none focus:ring-2 focus:ring-[#5ED3F3]/40 sm:p-8 ${
                      isSelected ? "scale-[1.01] border-[#5ED3F3]/50" : "border-white/5"
                    } ${showFeedback && isCorrect ? "border-[#38D39F]/70" : ""} ${isIncorrectSelected ? "border-[#FF7A7A]/70" : ""}`}
                  >
                    <div className="flex h-28 items-center justify-center sm:h-40">
                      <ShapeRenderer shape={option.shape} compact={compactPresentation} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 hidden min-h-[40px] text-center text-lg text-[#DCE3EA] transition-all duration-300 ease-out sm:block">
          {showFeedback && selectedIndex !== null && <span className="inline-block rounded-xl border border-white/5 bg-white/[0.02] px-5 py-3">
              {getResponseFeedback(currentPuzzle, selectedIndex)}
            </span>}
        </div>

        {session.recentInsights.length > 0 && (
          <section className="mt-12 rounded-[28px] border border-white/5 bg-[#171C23] p-8">
            <div className="text-sm uppercase tracking-[0.18em] text-[#6E7A88]">
              Session observations
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#7F8A98]">
              These observations reflect pacing, stability, and perceptual adaptation patterns emerging during the session.
            </p>

            <div className="mt-6 grid gap-4">
              {session.recentInsights.map((insight, index) => (
                <div
                  key={`${insight.title}-${index}`}
                  className="rounded-2xl border border-white/5 bg-[#111418] p-5"
                >
                  <div className="text-sm font-medium text-[#DCE3EA]">
                    {insight.title}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#8D98A6]">
                    {insight.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <DebugPanel
          data={{
            session: {
              phase: session.phase,
              sessionSeed: session.sessionSeed,
              questionIndex: session.questionIndex,
              score: session.score,
              fatigueEstimate: Number(session.fatigueEstimate.toFixed(3)),
              fatigueSignals: Object.fromEntries(
                Object.entries(session.fatigueSignals).map(([key, value]) => [key, Number(value.toFixed(3))])
              ),
              restorationSignals: {
                recentRecoveryAccuracy: Number(session.restorationSignals.recentRecoveryAccuracy.toFixed(3)),
                recentRecoveryTempo: session.restorationSignals.recentRecoveryTempo,
                restorationMomentum: Number(session.restorationSignals.restorationMomentum.toFixed(3)),
              },
              continuityState: {
                representationStability: Number(session.continuityState.representationStability.toFixed(3)),
                anchorPersistenceState: Number(session.continuityState.anchorPersistenceState.toFixed(3)),
                symmetryFatigue: Number(session.continuityState.symmetryFatigue.toFixed(3)),
                orientationConfidence: Number(session.continuityState.orientationConfidence.toFixed(3)),
              },
              confidenceMomentum: session.confidenceMomentum,
              currentFocus: session.currentFocus,
              reinforcementCount: session.reinforcementCount,
              recoveryCount: session.recoveryCount,
              recentTransformationProfiles: session.recentTransformationProfiles.map((profile) =>
                Object.fromEntries(
                  Object.entries(profile).map(([key, value]) => [key, Number(value.toFixed(3))])
                )
              ),
              timingProfile: getRecentTimingProfile(session.responses),
            },
            puzzle: {
              id: currentPuzzle.id,
              correctIndex: currentPuzzle.correctIndex,
              focus: currentPuzzle.profile.focus,
              difficulty: currentPuzzle.profile.estimatedDifficulty,
              cubeCount: currentPuzzle.profile.cubeCount,
              verticality: currentPuzzle.profile.verticality,
              branching: currentPuzzle.profile.branching,
              spatialSpread: currentPuzzle.profile.spatialSpread,
              transformationProfile: Object.fromEntries(
                Object.entries(currentPuzzle.profile.transformationProfile).map(([key, value]) => [
                  key,
                  Number(value.toFixed(3)),
                ])
              ),
              activePerceptualTarget: Object.fromEntries(
                Object.entries(currentPuzzle.profile.perceptualTarget).map(([key, value]) => [
                  key,
                  Number(value.toFixed(3)),
                ])
              ),
              activeTransformationTarget: Object.fromEntries(
                Object.entries(currentPuzzle.profile.transformationTarget).map(([key, value]) => [
                  key,
                  Number(value.toFixed(3)),
                ])
              ),
              referenceShapeKey: shapeKey(currentPuzzle.referenceShape),
              canonicalKey: getCanonicalShapeKey(currentPuzzle.referenceShape),
              perceptualQuality: Number(getPerceptualQualityScore(currentPuzzle.referenceShape).toFixed(3)),
              perceptualLoadProfile: Object.fromEntries(
                Object.entries(getPerceptualLoadProfile(currentPuzzle.referenceShape)).map(([key, value]) => [
                  key,
                  Number(value.toFixed(3)),
                ])
              ),
              answerTypes: currentPuzzle.answers.map((answer) => answer.type),
              answerCanonicalKeys: currentPuzzle.answers.map((answer) => getCanonicalShapeKey(answer.shape)),
            },
          }}
        />
      </section>
    </main>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.trim() === TEST_ACCESS_PASSWORD) {
      window.localStorage.setItem("flospatial.accessGranted.v1", "true");
      onUnlock();
      return;
    }

    setError(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111418] p-8 text-[#F4F6F8]">
      <section className="w-full max-w-md rounded-[32px] border border-white/5 bg-[#171C23] p-10 shadow-2xl shadow-black/20">
        <div className="text-sm uppercase tracking-[0.22em] text-[#6E7A88]">FloSpatial</div>
        <h1 className="mt-6 text-4xl font-semibold leading-tight">Private testing access</h1>
        <p className="mt-5 text-base leading-relaxed text-[#9AA3B2]">
          Enter the shared testing password to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(false);
            }}
            type="password"
            autoFocus
            className="w-full rounded-xl border border-white/10 bg-[#111418] px-4 py-4 text-[#F4F6F8] outline-none transition-colors focus:border-[#5ED3F3]/50 focus:ring-2 focus:ring-[#5ED3F3]/20"
            placeholder="Password"
          />

          {error && (
            <p className="mt-3 text-sm text-[#FF9A9A]">That password did not match.</p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-xl border border-[#5ED3F3]/30 bg-[#5ED3F3]/10 px-7 py-4 font-medium text-[#D9F8FF] transition-all duration-300 ease-out hover:border-[#5ED3F3]/60 hover:bg-[#5ED3F3]/15 focus:outline-none focus:ring-2 focus:ring-[#5ED3F3]/40"
          >
            Enter
          </button>
        </form>
      </section>
    </main>
  );
}

export default function FloSpatialPrototype() {
  const [accessGranted, setAccessGranted] = useState(() => {
    if (!ENABLE_PASSWORD_GATE || typeof window === "undefined") return true;
    return window.localStorage.getItem("flospatial.accessGranted.v1") === "true";
  });
  const [screen, setScreen] = useState<"home" | "onboarding" | "session">("home");
  const [sessionLength, setSessionLength] = useState(DEFAULT_SESSION_LENGTH);

  if (!accessGranted) {
    return <PasswordGate onUnlock={() => setAccessGranted(true)} />;
  }

  if (screen === "onboarding") {
    return (
      <OnboardingScreen
        onBeginSession={(length) => {
          setSessionLength(length);
          setScreen("session");
        }}
      />
    );
  }

  if (screen === "session") {
    return <SessionScreen sessionLength={sessionLength} onReturnHome={() => setScreen("home")} />;
  }

  return <HomeScreen onBeginTraining={() => setScreen("onboarding")} />;
}
