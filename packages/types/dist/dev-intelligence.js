"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestReviewResultSchema = exports.PullRequestReviewInputSchema = exports.GitCommitAnalysisSchema = exports.GitRiskLevel = exports.AuthorType = void 0;
const zod_1 = require("zod");
var AuthorType;
(function (AuthorType) {
    AuthorType["HUMAN"] = "HUMAN";
    AuthorType["AI_ASSISTED"] = "AI_ASSISTED";
    AuthorType["COLLABORATIVE_MIXED"] = "COLLABORATIVE_MIXED";
})(AuthorType || (exports.AuthorType = AuthorType = {}));
var GitRiskLevel;
(function (GitRiskLevel) {
    GitRiskLevel["LOW"] = "LOW";
    GitRiskLevel["MEDIUM"] = "MEDIUM";
    GitRiskLevel["HIGH"] = "HIGH";
})(GitRiskLevel || (exports.GitRiskLevel = GitRiskLevel = {}));
exports.GitCommitAnalysisSchema = zod_1.z.object({
    commitHash: zod_1.z.string(),
    authorName: zod_1.z.string(),
    authorEmail: zod_1.z.string(),
    message: zod_1.z.string(),
    timestamp: zod_1.z.string(),
    stats: zod_1.z.object({
        filesChanged: zod_1.z.number(),
        insertions: zod_1.z.number(),
        deletions: zod_1.z.number(),
    }),
    aiAuthorshipIndicators: zod_1.z.object({
        estimatedType: zod_1.z.nativeEnum(AuthorType),
        confidencePercentage: zod_1.z.number().min(0).max(100),
        evidenceFactors: zod_1.z.array(zod_1.z.string()),
        disclaimer: zod_1.z.string().default('Heuristic estimate based on commit semantics, comment patterns, and diff velocity. Not a cryptographic or infallible proof of authorship.'),
    }),
    qualityRisk: zod_1.z.object({
        riskLevel: zod_1.z.nativeEnum(GitRiskLevel),
        hallucinatedApiSignaturesDetected: zod_1.z.boolean(),
        missingErrorHandling: zod_1.z.boolean(),
        missingUnitTests: zod_1.z.boolean(),
        suspiciousBoilerplateDetected: zod_1.z.boolean(),
        flags: zod_1.z.array(zod_1.z.string()),
    }),
    reviewerRecommendations: zod_1.z.array(zod_1.z.string()),
});
exports.PullRequestReviewInputSchema = zod_1.z.object({
    prNumber: zod_1.z.number().optional(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    changedFiles: zod_1.z.array(zod_1.z.object({
        filename: zod_1.z.string(),
        status: zod_1.z.enum(['added', 'modified', 'removed', 'renamed']),
        additions: zod_1.z.number(),
        deletions: zod_1.z.number(),
        patch: zod_1.z.string().optional(),
    })),
    commitMessages: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.PullRequestReviewResultSchema = zod_1.z.object({
    summary: zod_1.z.string(),
    overallRiskLevel: zod_1.z.nativeEnum(GitRiskLevel),
    estimatedAuthorshipDistribution: zod_1.z.object({
        humanPercentage: zod_1.z.number(),
        aiAssistedPercentage: zod_1.z.number(),
    }),
    automatedChecklist: zod_1.z.array(zod_1.z.object({
        category: zod_1.z.string(),
        passed: zod_1.z.boolean(),
        details: zod_1.z.string(),
    })),
    criticalReviewFindings: zod_1.z.array(zod_1.z.object({
        file: zod_1.z.string(),
        line: zod_1.z.number().optional(),
        finding: zod_1.z.string(),
        suggestedFix: zod_1.z.string().optional(),
        severity: zod_1.z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
    })),
    mergeApprovalRecommendation: zod_1.z.enum(['READY_TO_MERGE', 'REQUIRES_MANUAL_REVIEW', 'BLOCK_MERGE']),
});
