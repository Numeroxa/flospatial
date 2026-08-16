export type CalibrationStatus = "author_estimate" | "pilot" | "empirical";
export type CalibrationDifficultyBand = "foundation" | "standard" | "stretch";

export type CalibrationTimeRange = {
  minSec: number;
  maxSec: number;
};

export type CalibrationItemBlueprint = {
  questionId: string;
  familyId: string;
  formId: string;
  domain: "mechanical";
  subskill: "gear_direction";
  archetype: "gear_direction_contact_parity";
  difficultyBand: CalibrationDifficultyBand;
  reasoningSteps: number;
  targetFluentTimeRangeSec: CalibrationTimeRange;
  rapidRecognition: boolean;
  calibrationStatus: CalibrationStatus;
  providerStyleTags: string[];
  employerTags: string[];
};

export const GEAR_DIRECTION_CALIBRATION_BANK_VERSION = "APTESTA_GEAR_DIRECTION_CAL_BANK_2026_08_V0_4";
export const GEAR_DIRECTION_CALIBRATION_FAMILY_ID = "gear_direction_contact_parity_v1";
export const GEAR_DIRECTION_PARALLEL_FORM_IDS = ["GD-FORM-A", "GD-FORM-B", "GD-FORM-C"] as const;

const common = {
  familyId: GEAR_DIRECTION_CALIBRATION_FAMILY_ID,
  domain: "mechanical" as const,
  subskill: "gear_direction" as const,
  archetype: "gear_direction_contact_parity" as const,
  rapidRecognition: true,
  calibrationStatus: "author_estimate" as const,
  providerStyleTags: ["generic_fire_service"],
  employerTags: ["AU_NZ_MVP"],
};

function item(
  questionId: string,
  formId: (typeof GEAR_DIRECTION_PARALLEL_FORM_IDS)[number],
  reasoningSteps: number,
  minSec: number,
  maxSec: number,
  difficultyBand: CalibrationDifficultyBand = "standard",
): CalibrationItemBlueprint {
  return {
    ...common,
    questionId,
    formId,
    reasoningSteps,
    difficultyBand,
    targetFluentTimeRangeSec: { minSec, maxSec },
  };
}

// Author estimates only. These ranges are intentionally internal and should be
// replaced by empirical distributions after enough knowledgeable-tester / beta data.
export const gearDirectionCalibrationBlueprints: CalibrationItemBlueprint[] = [
  item("GEAR-FL-001", "GD-FORM-A", 1, 5, 18, "foundation"),
  item("GEAR-FL-002", "GD-FORM-A", 2, 6, 20),
  item("GEAR-FL-003", "GD-FORM-A", 3, 7, 22),
  item("GEAR-FL-004", "GD-FORM-A", 4, 8, 24),
  item("GEAR-FL-005", "GD-FORM-A", 5, 9, 26, "stretch"),
  item("GEAR-FL-006", "GD-FORM-A", 1, 5, 18, "foundation"),
  item("GEAR-FL-007", "GD-FORM-A", 2, 6, 20),
  item("GEAR-FL-008", "GD-FORM-A", 2, 6, 21),

  item("GEAR-FL-B01", "GD-FORM-B", 1, 5, 18, "foundation"),
  item("GEAR-FL-B02", "GD-FORM-B", 2, 6, 20),
  item("GEAR-FL-B03", "GD-FORM-B", 3, 7, 22),
  item("GEAR-FL-B04", "GD-FORM-B", 4, 8, 24),
  item("GEAR-FL-B05", "GD-FORM-B", 5, 9, 26, "stretch"),
  item("GEAR-FL-B06", "GD-FORM-B", 1, 5, 18, "foundation"),
  item("GEAR-FL-B07", "GD-FORM-B", 2, 6, 20),
  item("GEAR-FL-B08", "GD-FORM-B", 2, 6, 21),

  item("GEAR-FL-C01", "GD-FORM-C", 1, 5, 18, "foundation"),
  item("GEAR-FL-C02", "GD-FORM-C", 2, 6, 20),
  item("GEAR-FL-C03", "GD-FORM-C", 3, 7, 22),
  item("GEAR-FL-C04", "GD-FORM-C", 4, 8, 24),
  item("GEAR-FL-C05", "GD-FORM-C", 5, 9, 26, "stretch"),
  item("GEAR-FL-C06", "GD-FORM-C", 2, 6, 21),
  item("GEAR-FL-C07", "GD-FORM-C", 2, 6, 20),
  item("GEAR-FL-C08", "GD-FORM-C", 3, 7, 22),
];

export const gearDirectionCalibrationBlueprintByQuestionId = Object.fromEntries(
  gearDirectionCalibrationBlueprints.map((blueprint) => [blueprint.questionId, blueprint]),
) as Record<string, CalibrationItemBlueprint>;

export const gearDirectionCalibrationFormQuestionIds = Object.fromEntries(
  GEAR_DIRECTION_PARALLEL_FORM_IDS.map((formId) => [
    formId,
    gearDirectionCalibrationBlueprints.filter((item) => item.formId === formId).map((item) => item.questionId),
  ]),
) as Record<(typeof GEAR_DIRECTION_PARALLEL_FORM_IDS)[number], string[]>;
