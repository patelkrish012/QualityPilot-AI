import { z } from 'zod';
export * from './requirements';
export * from './defects';
export * from './audit';
export * from './code-analysis';
export * from './digital-twin';
export * from './api-testing';
export * from './visual-regression';
export * from './dev-intelligence';
export * from './auth-matrix';
export * from './cicd-gate';
export declare enum OrgRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    VIEWER = "VIEWER"
}
export declare enum TestingMode {
    MODE_A_URL_BLACKBOX = "MODE_A_URL_BLACKBOX",
    MODE_B_SOURCE_WHITEBOX = "MODE_B_SOURCE_WHITEBOX"
}
export declare enum TestDepth {
    QUICK = "QUICK",
    STANDARD = "STANDARD",
    DEEP = "DEEP"
}
export declare enum TestStatus {
    PASS = "PASS",
    FAIL = "FAIL",
    BLOCKED = "BLOCKED",
    SKIPPED = "SKIPPED",
    ERROR = "ERROR",
    NOT_APPLICABLE = "NOT_APPLICABLE"
}
export declare enum TestRunStatus {
    REQUESTED = "REQUESTED",
    QUEUED = "QUEUED",
    RUNNING = "RUNNING",
    DISCOVERY = "DISCOVERY",
    EXECUTING = "EXECUTING",
    EVIDENCE_COLLECTION = "EVIDENCE_COLLECTION",
    ANALYSIS = "ANALYSIS",
    REPORT_GENERATION = "REPORT_GENERATION",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare enum Severity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
export declare enum ReleaseRisk {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare enum ReleaseRecommendation {
    APPROVED = "APPROVED",
    APPROVED_WITH_WARNINGS = "APPROVED_WITH_WARNINGS",
    REQUIRES_FIXES = "REQUIRES_FIXES",
    BLOCKED = "BLOCKED"
}
export declare enum UserPersonaView {
    BEGINNER = "BEGINNER",
    DEVELOPER = "DEVELOPER",
    MANAGER = "MANAGER"
}
export declare enum AIProviderType {
    OPENAI = "openai",
    GEMINI = "gemini",
    ANTHROPIC = "anthropic",
    LOCAL = "local"
}
export interface AIProviderConfig {
    provider: AIProviderType;
    model: string;
    apiKey?: string;
    temperature?: number;
    maxTokens?: number;
    baseUrl?: string;
}
export declare enum AIConfidence {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
export declare const UserRegistrationSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    fullName: z.ZodString;
    organizationName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    fullName: string;
    organizationName: string;
}, {
    email: string;
    password: string;
    fullName: string;
    organizationName: string;
}>;
export type UserRegistrationDTO = z.infer<typeof UserRegistrationSchema>;
export declare const UserLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type UserLoginDTO = z.infer<typeof UserLoginSchema>;
export declare const CreateProjectSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    targetUrl: z.ZodString;
    mode: z.ZodDefault<z.ZodNativeEnum<typeof TestingMode>>;
    repositoryUrl: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    targetUrl: string;
    name: string;
    mode: TestingMode;
    description?: string | undefined;
    branch?: string | undefined;
    repositoryUrl?: string | undefined;
}, {
    targetUrl: string;
    name: string;
    description?: string | undefined;
    branch?: string | undefined;
    mode?: TestingMode | undefined;
    repositoryUrl?: string | undefined;
}>;
export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export declare const StartTestRunSchema: z.ZodObject<{
    projectId: z.ZodString;
    depth: z.ZodDefault<z.ZodNativeEnum<typeof TestDepth>>;
    targetUrl: z.ZodOptional<z.ZodString>;
    customInstructions: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    depth: TestDepth;
    targetUrl?: string | undefined;
    customInstructions?: string | undefined;
}, {
    projectId: string;
    targetUrl?: string | undefined;
    depth?: TestDepth | undefined;
    customInstructions?: string | undefined;
}>;
export type StartTestRunDTO = z.infer<typeof StartTestRunSchema>;
export declare const DefectSchema: z.ZodObject<{
    defectId: z.ZodString;
    title: z.ZodString;
    severity: z.ZodNativeEnum<typeof Severity>;
    priority: z.ZodEnum<["CRITICAL", "HIGH", "MEDIUM", "LOW"]>;
    component: z.ZodString;
    requirementId: z.ZodOptional<z.ZodString>;
    testId: z.ZodString;
    url: z.ZodString;
    environment: z.ZodString;
    stepsToReproduce: z.ZodArray<z.ZodString, "many">;
    expectedResult: z.ZodString;
    actualResult: z.ZodString;
    evidenceUrls: z.ZodArray<z.ZodString, "many">;
    observedCause: z.ZodString;
    aiHypothesis: z.ZodString;
    aiConfidence: z.ZodNativeEnum<typeof AIConfidence>;
    recommendation: z.ZodString;
    retestStatus: z.ZodDefault<z.ZodEnum<["UNTESTED", "VERIFIED_FIXED", "STILL_FAILING"]>>;
    sourceLocation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url: string;
    title: string;
    severity: Severity;
    recommendation: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    expectedResult: string;
    testId: string;
    defectId: string;
    component: string;
    aiHypothesis: string;
    aiConfidence: AIConfidence;
    environment: string;
    stepsToReproduce: string[];
    actualResult: string;
    evidenceUrls: string[];
    observedCause: string;
    retestStatus: "UNTESTED" | "VERIFIED_FIXED" | "STILL_FAILING";
    requirementId?: string | undefined;
    sourceLocation?: string | undefined;
}, {
    url: string;
    title: string;
    severity: Severity;
    recommendation: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    expectedResult: string;
    testId: string;
    defectId: string;
    component: string;
    aiHypothesis: string;
    aiConfidence: AIConfidence;
    environment: string;
    stepsToReproduce: string[];
    actualResult: string;
    evidenceUrls: string[];
    observedCause: string;
    requirementId?: string | undefined;
    retestStatus?: "UNTESTED" | "VERIFIED_FIXED" | "STILL_FAILING" | undefined;
    sourceLocation?: string | undefined;
}>;
export type DefectDTO = z.infer<typeof DefectSchema>;
export interface QualityScoreBreakdown {
    overallScore: number;
    functionalQuality: number;
    reliability: number;
    performance: number;
    accessibility: number;
    apiQuality: number;
    visualStability: number;
    codeQuality?: number;
    requirementCoverage: number;
    testCoverage: number;
    formulaDescription: string;
}
