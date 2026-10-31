"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSessionMatrixResultSchema = exports.AuthStateMatrixStepSchema = exports.StepOutcome = exports.AuthStepType = void 0;
const zod_1 = require("zod");
var AuthStepType;
(function (AuthStepType) {
    AuthStepType["CREDENTIAL_SUBMISSION"] = "CREDENTIAL_SUBMISSION";
    AuthStepType["PROTECTED_ROUTE_ACCESS"] = "PROTECTED_ROUTE_ACCESS";
    AuthStepType["BROWSER_BACK_BUTTON"] = "BROWSER_BACK_BUTTON";
    AuthStepType["PAGE_REFRESH"] = "PAGE_REFRESH";
    AuthStepType["SESSION_LOGOUT"] = "SESSION_LOGOUT";
    AuthStepType["POST_LOGOUT_BACK_NAV"] = "POST_LOGOUT_BACK_NAV";
    AuthStepType["TAMPERED_COOKIE_ATTEMPT"] = "TAMPERED_COOKIE_ATTEMPT";
})(AuthStepType || (exports.AuthStepType = AuthStepType = {}));
var StepOutcome;
(function (StepOutcome) {
    StepOutcome["PASSED"] = "PASSED";
    StepOutcome["FAILED"] = "FAILED";
    StepOutcome["BLOCKED"] = "BLOCKED";
})(StepOutcome || (exports.StepOutcome = StepOutcome = {}));
exports.AuthStateMatrixStepSchema = zod_1.z.object({
    stepNumber: zod_1.z.number(),
    stepType: zod_1.z.nativeEnum(AuthStepType),
    actionDescription: zod_1.z.string(),
    expectedState: zod_1.z.string(),
    actualObservedState: zod_1.z.string(),
    outcome: zod_1.z.nativeEnum(StepOutcome),
    vulnerabilityDetected: zod_1.z.boolean(),
    notes: zod_1.z.string().optional(),
});
exports.AuthSessionMatrixResultSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    sessionSecurityScore: zod_1.z.number().min(0).max(100),
    totalStepsExecuted: zod_1.z.number(),
    passedSteps: zod_1.z.number(),
    failedSteps: zod_1.z.number(),
    steps: zod_1.z.array(exports.AuthStateMatrixStepSchema),
    securityFindings: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        title: zod_1.z.string(),
        severity: zod_1.z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
        recommendation: zod_1.z.string(),
    })),
    overallVerdict: zod_1.z.enum(['SECURE_SESSION_LIFECYCLE', 'SESSION_VULNERABILITY_DETECTED']),
});
