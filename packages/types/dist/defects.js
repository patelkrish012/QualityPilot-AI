"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprehensiveDefectSchema = exports.SuggestedCodePatchSchema = exports.DefectAnalysisRequestSchema = void 0;
const zod_1 = require("zod");
const index_1 = require("./index");
exports.DefectAnalysisRequestSchema = zod_1.z.object({
    testId: zod_1.z.string(),
    testTitle: zod_1.z.string(),
    targetUrl: zod_1.z.string().url(),
    observedFact: zod_1.z.string(),
    errorMessage: zod_1.z.string().optional(),
    consoleErrors: zod_1.z.array(zod_1.z.string()).default([]),
    statusCode: zod_1.z.number().optional(),
    sourceSnippet: zod_1.z.string().optional(),
    screenshotUrl: zod_1.z.string().optional(),
});
exports.SuggestedCodePatchSchema = zod_1.z.object({
    targetFile: zod_1.z.string(),
    explanation: zod_1.z.string(),
    riskLevel: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']),
    diff: zod_1.z.string(),
    testsToRerun: zod_1.z.array(zod_1.z.string()),
});
exports.ComprehensiveDefectSchema = zod_1.z.object({
    defectId: zod_1.z.string(),
    title: zod_1.z.string(),
    severity: zod_1.z.nativeEnum(index_1.Severity),
    priority: zod_1.z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    component: zod_1.z.string(),
    url: zod_1.z.string(),
    observedFact: zod_1.z.string(), // DETERMINISTIC FACT
    aiHypothesis: zod_1.z.string(), // AI REASONING
    aiConfidence: zod_1.z.nativeEnum(index_1.AIConfidence),
    businessImpact: zod_1.z.string(),
    suggestedPatch: exports.SuggestedCodePatchSchema.optional(),
    retestVerification: zod_1.z.object({
        beforeFixStatus: zod_1.z.string().default('FAIL'),
        afterFixStatus: zod_1.z.string().default('PENDING'),
        regressionStatus: zod_1.z.string().default('PENDING'),
        isVerified: zod_1.z.boolean().default(false),
    }),
});
