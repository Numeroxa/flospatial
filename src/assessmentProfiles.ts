export type AssessmentModality =
  | "text"
  | "static_visual"
  | "video"
  | "audio"
  | "game"
  | "map"
  | "writing"
  | "personality_inventory";

export type TimingModel =
  | { kind: "component_timed"; seconds?: number; itemCount?: number }
  | { kind: "overall_timed"; seconds?: number; itemCount?: number }
  | { kind: "untimed"; itemCount?: number }
  | { kind: "mixed" }
  | { kind: "unknown" };

export type AssessmentComponent = {
  componentId: string;
  label: string;
  domains: string[];
  modality: AssessmentModality[];
  timing: TimingModel;
  calculatorRule?: "allowed" | "prohibited" | "onscreen" | "follow_current_instructions" | "unknown";
  scratchRule?: "paper" | "whiteboard" | "none" | "follow_current_instructions" | "unknown";
  navigationRule?: "linear" | "skip_return" | "provider_specific" | "unknown";
  trainability: "cognitive_skill" | "judgement_reasoning" | "familiarisation_only" | "do_not_coach_personality";
};

export type Provenance = {
  sourceUrl: string;
  sourceTier: "official_employer" | "official_provider" | "official_recruitment_partner";
  verifiedDate: string;
  status: "current" | "current_with_unknowns" | "discrepancy_noted";
  note?: string;
};

export type ProviderProfile = {
  providerProfileId: string;
  providerName: string;
  testFamily: string;
  profileVersion: string;
  components: AssessmentComponent[];
  interactionNotes?: string[];
  provenance: Provenance[];
};

export type EmployerComponentRule = {
  // Stable employer-local key. This remains usable even when the assessment
  // provider has not been publicly identified.
  componentKey: string;
  // Populate only when the component has been mapped to a verified provider profile.
  providerComponentId?: string;
  required: boolean;
  passThresholdPercent?: number;
  weightPercent?: number;
  rankingUse?: "pass_fail" | "weighted" | "ranking" | "unknown";
};

export type EmployerProfile = {
  employerProfileId: string;
  employerName: string;
  country: string;
  recruitmentCycle: string;
  providerStatus: "verified" | "unknown" | "under_investigation";
  providerProfileId?: string;
  componentRules: EmployerComponentRule[];
  localStages?: string[];
  notes?: string[];
  provenance: Provenance[];
};

export type FluencyProfile = {
  fluencyProfileId: string;
  domain: string;
  subskill: string;
  archetype: string;
  targetFluentTimeSecAuthor: number;
  accuracyGate: number;
  rapidRecognition: boolean;
  compareMetric: "median_rt";
  variabilityMetric: "iqr";
  telemetryVersion: string;
  responseTimeBasis: "selection_latency";
  minimumComparableResponses: number;
  rapidErrorBoundaryFractionOfTarget: number;
  progressionRule: string;
  employerProfileIds: string[];
};

export const providerProfiles: ProviderProfile[] = [
  {
    providerProfileId: "FENZ_SHL_GAS_2026",
    providerName: "SHL",
    testFamily: "General Ability Screen",
    profileVersion: "2026",
    components: [
      {
        componentId: "gas",
        label: "General Ability Screen",
        domains: ["numerical", "verbal", "deductive", "abstract"],
        modality: ["text", "static_visual"],
        timing: { kind: "overall_timed", seconds: 600 },
        calculatorRule: "follow_current_instructions",
        scratchRule: "follow_current_instructions",
        navigationRule: "provider_specific",
        trainability: "cognitive_skill",
      },
    ],
    provenance: [
      {
        sourceUrl: "https://www.fireandemergency.nz/work-or-volunteer-for-us/become-a-career-firefighter/how-to-prepare/",
        sourceTier: "official_employer",
        verifiedDate: "2026-08-14",
        status: "current",
      },
    ],
  },
  {
    providerProfileId: "OFAI_FACT_2026",
    providerName: "OFAI",
    testFamily: "Firefighter Aptitude and Character Test (FACT)",
    profileVersion: "2026",
    components: [
      { componentId: "reading", label: "Reading Ability", domains: ["reading"], modality: ["text"], timing: { kind: "mixed", itemCount: 15 } as TimingModel, trainability: "cognitive_skill" },
      { componentId: "math", label: "Mathematical Reasoning", domains: ["numerical"], modality: ["text"], timing: { kind: "mixed", itemCount: 15 } as TimingModel, trainability: "cognitive_skill" },
      { componentId: "map", label: "Map Reading", domains: ["map_navigation", "spatial"], modality: ["map", "static_visual"], timing: { kind: "mixed", itemCount: 10 } as TimingModel, trainability: "cognitive_skill" },
      { componentId: "writing", label: "Writing Ability", domains: ["written_communication"], modality: ["text"], timing: { kind: "mixed", itemCount: 10 } as TimingModel, trainability: "cognitive_skill" },
      { componentId: "character", label: "Personal Characteristics", domains: ["interpersonal", "teamwork", "integrity", "emotional_stability"], modality: ["personality_inventory"], timing: { kind: "mixed", itemCount: 60 } as TimingModel, trainability: "do_not_coach_personality" },
    ],
    interactionNotes: ["110 multiple-choice items", "Up to three hours", "Aptitude 45%; character 55%", "Pass/fail certificate"],
    provenance: [
      {
        sourceUrl: "https://ofai.ca/ofai/stage-one-firefighter-aptitude-and-character-test",
        sourceTier: "official_provider",
        verifiedDate: "2026-08-14",
        status: "current",
      },
    ],
  },
  {
    providerProfileId: "NTN_FIRETEAM_2026",
    providerName: "National Testing Network",
    testFamily: "FireTEAM",
    profileVersion: "2026",
    components: [
      { componentId: "human_relations", label: "Human Relations", domains: ["situational_judgement", "interpersonal"], modality: ["video"], timing: { kind: "mixed" }, navigationRule: "linear", trainability: "judgement_reasoning" },
      { componentId: "mechanical", label: "Mechanical", domains: ["mechanical", "systems_troubleshooting"], modality: ["video", "static_visual"], timing: { kind: "mixed" }, trainability: "cognitive_skill" },
      { componentId: "reading", label: "Reading", domains: ["reading"], modality: ["text"], timing: { kind: "mixed" }, trainability: "cognitive_skill" },
      { componentId: "math", label: "Math", domains: ["numerical", "mental_arithmetic", "proportions"], modality: ["video"], timing: { kind: "mixed" }, calculatorRule: "prohibited", scratchRule: "none", trainability: "cognitive_skill" },
    ],
    interactionNotes: ["Approximate total test time: two hours", "Human Relations Part I video items play without stopping", "Mechanical content includes valves, water pressure and troubleshooting"],
    provenance: [
      {
        sourceUrl: "https://nationaltestingnetwork.com/publicsafetyjobs/ntn-test-firefighter.cfm",
        sourceTier: "official_provider",
        verifiedDate: "2026-08-14",
        status: "current",
      },
    ],
  },
  {
    providerProfileId: "CHESHIRE_TESTPARTNERSHIP_2026",
    providerName: "Test Partnership",
    testFamily: "Assessment for Firefighter + FRS Ability Tests",
    profileVersion: "2026",
    components: [
      { componentId: "behavioural", label: "Assessment for Firefighter", domains: ["values", "behavioural_preferences"], modality: ["text"], timing: { kind: "untimed" }, trainability: "familiarisation_only" },
      { componentId: "numerical", label: "Numerical Reasoning", domains: ["numerical"], modality: ["text", "static_visual"], timing: { kind: "component_timed" }, trainability: "cognitive_skill" },
      { componentId: "verbal", label: "Verbal Reasoning", domains: ["verbal"], modality: ["text"], timing: { kind: "component_timed" }, trainability: "cognitive_skill" },
      { componentId: "mechanical", label: "Mechanical Reasoning", domains: ["mechanical"], modality: ["static_visual"], timing: { kind: "component_timed" }, trainability: "cognitive_skill" },
    ],
    provenance: [
      {
        sourceUrl: "https://www.cheshirefire.gov.uk/jobs/wholetime-firefighter/recruitment-process/",
        sourceTier: "official_employer",
        verifiedDate: "2026-08-14",
        status: "current",
      },
    ],
  },
  {
    providerProfileId: "QFD_PEARSON_2026",
    providerName: "Pearson VUE",
    testFamily: "QFD Supervised Testing",
    profileVersion: "2026",
    components: [
      { componentId: "mechanical", label: "Mechanical Reasoning", domains: ["mechanical"], modality: ["text", "static_visual"], timing: { kind: "unknown" }, trainability: "cognitive_skill" },
      { componentId: "core_abilities", label: "Core Abilities", domains: ["general_aptitude"], modality: ["text", "static_visual"], timing: { kind: "unknown" }, trainability: "cognitive_skill" },
    ],
    provenance: [
      {
        sourceUrl: "https://www.pearsonvue.com/us/en/qfes.html",
        sourceTier: "official_provider",
        verifiedDate: "2026-08-14",
        status: "current_with_unknowns",
        note: "Current registration windows are public, but exact item counts/timing are not established here.",
      },
    ],
  },
];

export const employerProfiles: EmployerProfile[] = [
  {
    employerProfileId: "FENZ_CAREER_FIREFIGHTER_2026",
    employerName: "Fire and Emergency New Zealand",
    country: "New Zealand",
    recruitmentCycle: "2026",
    providerStatus: "verified",
    providerProfileId: "FENZ_SHL_GAS_2026",
    componentRules: [{ componentKey: "general_ability_screen", providerComponentId: "gas", required: true, rankingUse: "unknown" }],
    localStages: ["online cognitive assessment", "cognitive verification", "physical pre-entry test", "practical assessment centre", "formal interview"],
    provenance: [
      { sourceUrl: "https://www.fireandemergency.nz/work-or-volunteer-for-us/become-a-career-firefighter/how-to-prepare/", sourceTier: "official_employer", verifiedDate: "2026-08-14", status: "current" },
    ],
  },
  {
    employerProfileId: "ACTFR_2026",
    employerName: "ACT Fire & Rescue",
    country: "Australia",
    recruitmentCycle: "2026",
    providerStatus: "unknown",
    componentRules: [
      { componentKey: "verbal", required: true, rankingUse: "unknown" },
      { componentKey: "numerical", required: true, rankingUse: "unknown" },
      { componentKey: "abstract", required: true, rankingUse: "unknown" },
      { componentKey: "spatial", required: true, rankingUse: "unknown" },
    ],
    localStages: ["online aptitude test", "written response", "possible aptitude verification", "beep test", "assessment centre", "physical aptitude test", "formal interview", "medical and psychometric evaluation"],
    notes: [
      "Use the official ESA Stage 2 description as the governing formal profile: verbal, numerical, abstract and spatial reasoning.",
      "The SolPeople recruitment microsite uses broader language including mechanical and critical thinking, but states that it is a guide and official careers information governs; retain this as a discrepancy/provenance note rather than changing the formal profile.",
    ],
    provenance: [
      { sourceUrl: "https://esa.act.gov.au/join-us-careers/fire-rescue/joining-actfr", sourceTier: "official_employer", verifiedDate: "2026-08-14", status: "current" },
      { sourceUrl: "https://readywillingable.solpeople.com.au/", sourceTier: "official_recruitment_partner", verifiedDate: "2026-08-14", status: "discrepancy_noted" },
    ],
  },
  {
    employerProfileId: "QFD_RECRUIT_FIREFIGHTER_2026",
    employerName: "Queensland Fire Department",
    country: "Australia",
    recruitmentCycle: "2026",
    providerStatus: "verified",
    providerProfileId: "QFD_PEARSON_2026",
    componentRules: [
      { componentKey: "mechanical_reasoning", providerComponentId: "mechanical", required: true, rankingUse: "unknown" },
      { componentKey: "core_abilities", providerComponentId: "core_abilities", required: true, rankingUse: "unknown" },
    ],
    provenance: [
      { sourceUrl: "https://www.qfes.qld.gov.au/join-our-team/fire-and-rescue-service/recruit-firefighter", sourceTier: "official_employer", verifiedDate: "2026-08-14", status: "current_with_unknowns" },
      { sourceUrl: "https://www.pearsonvue.com/us/en/qfes.html", sourceTier: "official_provider", verifiedDate: "2026-08-14", status: "current_with_unknowns" },
    ],
  },
  {
    employerProfileId: "WA_DFES_CAREER_FIREFIGHTER_2026",
    employerName: "Department of Fire and Emergency Services (WA)",
    country: "Australia",
    recruitmentCycle: "2026",
    providerStatus: "unknown",
    componentRules: [
      { componentKey: "verbal_reasoning", required: true, rankingUse: "unknown" },
      { componentKey: "numerical_reasoning", required: true, rankingUse: "unknown" },
      { componentKey: "error_checking", required: true, rankingUse: "unknown" },
      { componentKey: "spatial_awareness", required: true, rankingUse: "unknown" },
      { componentKey: "mechanical_reasoning", required: true, rankingUse: "unknown" },
      { componentKey: "diagrammatic_reasoning", required: true, rankingUse: "unknown" },
    ],
    localStages: ["online application", "cognitive and personality assessments", "physical assessments", "further selection stages"],
    notes: [
      "The current official DFES recruitment page identifies the common cognitive domains but does not name the cognitive/personality assessment provider.",
      "Keep the provider field unknown until a current primary source identifies it; do not infer a provider from third-party preparation sites.",
      "Personality assessment is a separate selection construct and should not be coached as a right-answer aptitude test.",
    ],
    provenance: [
      {
        sourceUrl: "https://www.dfes.wa.gov.au/careers-and-volunteering/career-firefighting",
        sourceTier: "official_employer",
        verifiedDate: "2026-08-16",
        status: "current_with_unknowns",
        note: "Current cognitive domains verified; provider not named on the official recruitment page.",
      },
    ],
  },
  {
    employerProfileId: "SA_MFS_FULL_TIME_FIREFIGHTER_2026",
    employerName: "South Australian Metropolitan Fire Service",
    country: "Australia",
    recruitmentCycle: "2026",
    providerStatus: "unknown",
    componentRules: [
      { componentKey: "communication_verbal_written", required: true, rankingUse: "unknown" },
      { componentKey: "problem_solving", required: true, rankingUse: "unknown" },
      { componentKey: "mechanical_reasoning", required: true, rankingUse: "unknown" },
      { componentKey: "decision_making_incomplete_information", required: true, rankingUse: "unknown" },
    ],
    localStages: ["online assessment and psychometric testing", "group exercises", "physical aptitude testing", "interviews"],
    notes: [
      "Current MFS material explicitly includes decision-making with incomplete information alongside communication, problem solving and mechanical reasoning.",
      "The official recruitment material does not name the assessment provider, so provider-specific styling/timing must remain unverified.",
      "Decision-making with incomplete information is a strong research signal for a future Workplace Judgement / decision-reasoning family, distinct from personality coaching.",
    ],
    provenance: [
      {
        sourceUrl: "https://www.mfs.sa.gov.au/recruitment/full-time-firefighters/recruitment-process",
        sourceTier: "official_employer",
        verifiedDate: "2026-08-16",
        status: "current_with_unknowns",
        note: "Current assessed areas verified; provider not named on the official recruitment page.",
      },
    ],
  },
];

export const gearDirectionFluencyProfile: FluencyProfile = {
  fluencyProfileId: "gear_direction_v0_3",
  domain: "mechanical",
  subskill: "gear_direction",
  archetype: "gear_direction_contact_parity",
  targetFluentTimeSecAuthor: 35,
  accuracyGate: 0.85,
  rapidRecognition: true,
  compareMetric: "median_rt",
  variabilityMetric: "iqr",
  telemetryVersion: "selection_latency_v1",
  responseTimeBasis: "selection_latency",
  minimumComparableResponses: 6,
  rapidErrorBoundaryFractionOfTarget: 0.25,
  progressionRule: "Treat speed as progress only when median RT falls across comparable blocks while accuracy is stable or improving; do not let rapid errors count as fluency.",
  employerProfileIds: ["FENZ_CAREER_FIREFIGHTER_2026", "QFD_RECRUIT_FIREFIGHTER_2026"],
};
