"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefectSchema = exports.StartTestRunSchema = exports.CreateProjectSchema = exports.UserLoginSchema = exports.UserRegistrationSchema = exports.AIConfidence = exports.AIProviderType = exports.UserPersonaView = exports.ReleaseRecommendation = exports.ReleaseRisk = exports.Severity = exports.TestRunStatus = exports.TestStatus = exports.TestDepth = exports.TestingMode = exports.OrgRole = void 0;
const zod_1 = require("zod");
__exportStar(require("./requirements"), exports);
__exportStar(require("./defects"), exports);
__exportStar(require("./audit"), exports);
__exportStar(require("./code-analysis"), exports);
__exportStar(require("./digital-twin"), exports);
__exportStar(require("./api-testing"), exports);
__exportStar(require("./visual-regression"), exports);
__exportStar(require("./dev-intelligence"), exports);
__exportStar(require("./auth-matrix"), exports);
__exportStar(require("./cicd-gate"), exports);
// ==========================================
// 1. SYSTEM ROLES & PERMISSIONS
// ==========================================
var OrgRole;
(function (OrgRole) {
    OrgRole["OWNER"] = "OWNER";
    OrgRole["ADMIN"] = "ADMIN";
    OrgRole["MEMBER"] = "MEMBER";
    OrgRole["VIEWER"] = "VIEWER";
})(OrgRole || (exports.OrgRole = OrgRole = {}));
// ==========================================
// 2. TESTING MODES & SCOPE
// ==========================================
var TestingMode;
(function (TestingMode) {
    TestingMode["MODE_A_URL_BLACKBOX"] = "MODE_A_URL_BLACKBOX";
    TestingMode["MODE_B_SOURCE_WHITEBOX"] = "MODE_B_SOURCE_WHITEBOX";
})(TestingMode || (exports.TestingMode = TestingMode = {}));
var TestDepth;
(function (TestDepth) {
    TestDepth["QUICK"] = "QUICK";
    TestDepth["STANDARD"] = "STANDARD";
    TestDepth["DEEP"] = "DEEP";
})(TestDepth || (exports.TestDepth = TestDepth = {}));
var TestStatus;
(function (TestStatus) {
    TestStatus["PASS"] = "PASS";
    TestStatus["FAIL"] = "FAIL";
    TestStatus["BLOCKED"] = "BLOCKED";
    TestStatus["SKIPPED"] = "SKIPPED";
    TestStatus["ERROR"] = "ERROR";
    TestStatus["NOT_APPLICABLE"] = "NOT_APPLICABLE";
})(TestStatus || (exports.TestStatus = TestStatus = {}));
var TestRunStatus;
(function (TestRunStatus) {
    TestRunStatus["REQUESTED"] = "REQUESTED";
    TestRunStatus["QUEUED"] = "QUEUED";
    TestRunStatus["RUNNING"] = "RUNNING";
    TestRunStatus["DISCOVERY"] = "DISCOVERY";
    TestRunStatus["EXECUTING"] = "EXECUTING";
    TestRunStatus["EVIDENCE_COLLECTION"] = "EVIDENCE_COLLECTION";
    TestRunStatus["ANALYSIS"] = "ANALYSIS";
    TestRunStatus["REPORT_GENERATION"] = "REPORT_GENERATION";
    TestRunStatus["COMPLETED"] = "COMPLETED";
    TestRunStatus["FAILED"] = "FAILED";
    TestRunStatus["CANCELLED"] = "CANCELLED";
})(TestRunStatus || (exports.TestRunStatus = TestRunStatus = {}));
var Severity;
(function (Severity) {
    Severity["CRITICAL"] = "CRITICAL";
    Severity["HIGH"] = "HIGH";
    Severity["MEDIUM"] = "MEDIUM";
    Severity["LOW"] = "LOW";
    Severity["INFO"] = "INFO";
})(Severity || (exports.Severity = Severity = {}));
var ReleaseRisk;
(function (ReleaseRisk) {
    ReleaseRisk["LOW"] = "LOW";
    ReleaseRisk["MEDIUM"] = "MEDIUM";
    ReleaseRisk["HIGH"] = "HIGH";
    ReleaseRisk["CRITICAL"] = "CRITICAL";
})(ReleaseRisk || (exports.ReleaseRisk = ReleaseRisk = {}));
var ReleaseRecommendation;
(function (ReleaseRecommendation) {
    ReleaseRecommendation["APPROVED"] = "APPROVED";
    ReleaseRecommendation["APPROVED_WITH_WARNINGS"] = "APPROVED_WITH_WARNINGS";
    ReleaseRecommendation["REQUIRES_FIXES"] = "REQUIRES_FIXES";
    ReleaseRecommendation["BLOCKED"] = "BLOCKED";
})(ReleaseRecommendation || (exports.ReleaseRecommendation = ReleaseRecommendation = {}));
var UserPersonaView;
(function (UserPersonaView) {
    UserPersonaView["BEGINNER"] = "BEGINNER";
    UserPersonaView["DEVELOPER"] = "DEVELOPER";
    UserPersonaView["MANAGER"] = "MANAGER";
})(UserPersonaView || (exports.UserPersonaView = UserPersonaView = {}));
// ==========================================
// 3. AI PROVIDER CONTRACTS & ABSTRACTIONS
// ==========================================
var AIProviderType;
(function (AIProviderType) {
    AIProviderType["OPENAI"] = "openai";
    AIProviderType["GEMINI"] = "gemini";
    AIProviderType["ANTHROPIC"] = "anthropic";
    AIProviderType["LOCAL"] = "local";
})(AIProviderType || (exports.AIProviderType = AIProviderType = {}));
var AIConfidence;
(function (AIConfidence) {
    AIConfidence["HIGH"] = "HIGH";
    AIConfidence["MEDIUM"] = "MEDIUM";
    AIConfidence["LOW"] = "LOW";
})(AIConfidence || (exports.AIConfidence = AIConfidence = {}));
// ==========================================
// 4. ZOD VALIDATION SCHEMAS FOR CONTRACTS
// ==========================================
exports.UserRegistrationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
    fullName: zod_1.z.string().min(2, 'Full name required'),
    organizationName: zod_1.z.string().min(2, 'Organization name required'),
});
exports.UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1, 'Password required'),
});
exports.CreateProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    targetUrl: zod_1.z.string().url('A valid target website URL is required'),
    mode: zod_1.z.nativeEnum(TestingMode).default(TestingMode.MODE_A_URL_BLACKBOX),
    repositoryUrl: zod_1.z.string().url().optional(),
    branch: zod_1.z.string().optional(),
});
exports.StartTestRunSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid(),
    depth: zod_1.z.nativeEnum(TestDepth).default(TestDepth.STANDARD),
    targetUrl: zod_1.z.string().url().optional(),
    customInstructions: zod_1.z.string().optional(),
});
// Defect Schema conforming to requirement Section 48
exports.DefectSchema = zod_1.z.object({
    defectId: zod_1.z.string(),
    title: zod_1.z.string(),
    severity: zod_1.z.nativeEnum(Severity),
    priority: zod_1.z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    component: zod_1.z.string(),
    requirementId: zod_1.z.string().optional(),
    testId: zod_1.z.string(),
    url: zod_1.z.string().url(),
    environment: zod_1.z.string(),
    stepsToReproduce: zod_1.z.array(zod_1.z.string()),
    expectedResult: zod_1.z.string(),
    actualResult: zod_1.z.string(),
    evidenceUrls: zod_1.z.array(zod_1.z.string()),
    observedCause: zod_1.z.string(),
    aiHypothesis: zod_1.z.string(),
    aiConfidence: zod_1.z.nativeEnum(AIConfidence),
    recommendation: zod_1.z.string(),
    retestStatus: zod_1.z.enum(['UNTESTED', 'VERIFIED_FIXED', 'STILL_FAILING']).default('UNTESTED'),
    sourceLocation: zod_1.z.string().optional(),
});
