import { z } from 'zod';
export declare enum QualityGateStatus {
    PASSED = "PASSED",
    FAILED = "FAILED",
    WARNING = "WARNING"
}
export declare enum PipelineAction {
    ALLOW_DEPLOYMENT = "ALLOW_DEPLOYMENT",
    BLOCK_DEPLOYMENT = "BLOCK_DEPLOYMENT"
}
export declare const GitHubWebhookPayloadSchema: z.ZodObject<{
    action: z.ZodString;
    repository: z.ZodObject<{
        name: z.ZodString;
        full_name: z.ZodString;
        clone_url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        full_name: string;
        clone_url?: string | undefined;
    }, {
        name: string;
        full_name: string;
        clone_url?: string | undefined;
    }>;
    pull_request: z.ZodOptional<z.ZodObject<{
        number: z.ZodNumber;
        title: z.ZodString;
        head: z.ZodObject<{
            sha: z.ZodString;
            ref: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha: string;
            ref: string;
        }, {
            sha: string;
            ref: string;
        }>;
        base: z.ZodObject<{
            ref: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            ref: string;
        }, {
            ref: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        number: number;
        title: string;
        head: {
            sha: string;
            ref: string;
        };
        base: {
            ref: string;
        };
    }, {
        number: number;
        title: string;
        head: {
            sha: string;
            ref: string;
        };
        base: {
            ref: string;
        };
    }>>;
    sender: z.ZodObject<{
        login: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        login: string;
    }, {
        login: string;
    }>;
}, "strip", z.ZodTypeAny, {
    action: string;
    repository: {
        name: string;
        full_name: string;
        clone_url?: string | undefined;
    };
    sender: {
        login: string;
    };
    pull_request?: {
        number: number;
        title: string;
        head: {
            sha: string;
            ref: string;
        };
        base: {
            ref: string;
        };
    } | undefined;
}, {
    action: string;
    repository: {
        name: string;
        full_name: string;
        clone_url?: string | undefined;
    };
    sender: {
        login: string;
    };
    pull_request?: {
        number: number;
        title: string;
        head: {
            sha: string;
            ref: string;
        };
        base: {
            ref: string;
        };
    } | undefined;
}>;
export type GitHubWebhookPayload = z.infer<typeof GitHubWebhookPayloadSchema>;
export declare const QualityGateEvaluationSchema: z.ZodObject<{
    gateId: z.ZodString;
    repository: z.ZodString;
    commitSha: z.ZodString;
    branch: z.ZodString;
    evaluatedAt: z.ZodString;
    exitCode: z.ZodNumber;
    status: z.ZodNativeEnum<typeof QualityGateStatus>;
    action: z.ZodNativeEnum<typeof PipelineAction>;
    thresholds: z.ZodObject<{
        minQualityScore: z.ZodNumber;
        maxCriticalDefects: z.ZodNumber;
        minTestPassRate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        minQualityScore: number;
        maxCriticalDefects: number;
        minTestPassRate: number;
    }, {
        minQualityScore: number;
        maxCriticalDefects: number;
        minTestPassRate: number;
    }>;
    actualMetrics: z.ZodObject<{
        qualityScore: z.ZodNumber;
        criticalDefectsFound: z.ZodNumber;
        testPassRate: z.ZodNumber;
        securityVulnerabilities: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        qualityScore: number;
        criticalDefectsFound: number;
        testPassRate: number;
        securityVulnerabilities: number;
    }, {
        qualityScore: number;
        criticalDefectsFound: number;
        testPassRate: number;
        securityVulnerabilities: number;
    }>;
    reasons: z.ZodArray<z.ZodString, "many">;
    markdownSummary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: QualityGateStatus;
    action: PipelineAction;
    repository: string;
    gateId: string;
    commitSha: string;
    branch: string;
    evaluatedAt: string;
    exitCode: number;
    thresholds: {
        minQualityScore: number;
        maxCriticalDefects: number;
        minTestPassRate: number;
    };
    actualMetrics: {
        qualityScore: number;
        criticalDefectsFound: number;
        testPassRate: number;
        securityVulnerabilities: number;
    };
    reasons: string[];
    markdownSummary: string;
}, {
    status: QualityGateStatus;
    action: PipelineAction;
    repository: string;
    gateId: string;
    commitSha: string;
    branch: string;
    evaluatedAt: string;
    exitCode: number;
    thresholds: {
        minQualityScore: number;
        maxCriticalDefects: number;
        minTestPassRate: number;
    };
    actualMetrics: {
        qualityScore: number;
        criticalDefectsFound: number;
        testPassRate: number;
        securityVulnerabilities: number;
    };
    reasons: string[];
    markdownSummary: string;
}>;
export type QualityGateEvaluation = z.infer<typeof QualityGateEvaluationSchema>;
