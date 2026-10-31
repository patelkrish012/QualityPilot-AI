"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityGateEvaluationSchema = exports.GitHubWebhookPayloadSchema = exports.PipelineAction = exports.QualityGateStatus = void 0;
const zod_1 = require("zod");
var QualityGateStatus;
(function (QualityGateStatus) {
    QualityGateStatus["PASSED"] = "PASSED";
    QualityGateStatus["FAILED"] = "FAILED";
    QualityGateStatus["WARNING"] = "WARNING";
})(QualityGateStatus || (exports.QualityGateStatus = QualityGateStatus = {}));
var PipelineAction;
(function (PipelineAction) {
    PipelineAction["ALLOW_DEPLOYMENT"] = "ALLOW_DEPLOYMENT";
    PipelineAction["BLOCK_DEPLOYMENT"] = "BLOCK_DEPLOYMENT";
})(PipelineAction || (exports.PipelineAction = PipelineAction = {}));
exports.GitHubWebhookPayloadSchema = zod_1.z.object({
    action: zod_1.z.string(),
    repository: zod_1.z.object({
        name: zod_1.z.string(),
        full_name: zod_1.z.string(),
        clone_url: zod_1.z.string().optional(),
    }),
    pull_request: zod_1.z.object({
        number: zod_1.z.number(),
        title: zod_1.z.string(),
        head: zod_1.z.object({
            sha: zod_1.z.string(),
            ref: zod_1.z.string(),
        }),
        base: zod_1.z.object({
            ref: zod_1.z.string(),
        }),
    }).optional(),
    sender: zod_1.z.object({
        login: zod_1.z.string(),
    }),
});
exports.QualityGateEvaluationSchema = zod_1.z.object({
    gateId: zod_1.z.string(),
    repository: zod_1.z.string(),
    commitSha: zod_1.z.string(),
    branch: zod_1.z.string(),
    evaluatedAt: zod_1.z.string(),
    exitCode: zod_1.z.number().int(), // 0 for pass, 1 for fail
    status: zod_1.z.nativeEnum(QualityGateStatus),
    action: zod_1.z.nativeEnum(PipelineAction),
    thresholds: zod_1.z.object({
        minQualityScore: zod_1.z.number(),
        maxCriticalDefects: zod_1.z.number(),
        minTestPassRate: zod_1.z.number(),
    }),
    actualMetrics: zod_1.z.object({
        qualityScore: zod_1.z.number(),
        criticalDefectsFound: zod_1.z.number(),
        testPassRate: zod_1.z.number(),
        securityVulnerabilities: zod_1.z.number(),
    }),
    reasons: zod_1.z.array(zod_1.z.string()),
    markdownSummary: zod_1.z.string(),
});
