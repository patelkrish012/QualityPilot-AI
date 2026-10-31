import { z } from 'zod';
export declare const StructuredRequirementSchema: z.ZodObject<{
    code: z.ZodString;
    title: z.ZodString;
    isAmbiguous: z.ZodBoolean;
    detectedAmbiguities: z.ZodArray<z.ZodString, "many">;
    structuredRules: z.ZodArray<z.ZodObject<{
        ruleText: z.ZodString;
        isMeasurable: z.ZodBoolean;
        category: z.ZodEnum<["VALIDATION", "AUTHENTICATION", "SECURITY", "ACCESSIBILITY", "EDGE_CASE"]>;
    }, "strip", z.ZodTypeAny, {
        ruleText: string;
        isMeasurable: boolean;
        category: "VALIDATION" | "AUTHENTICATION" | "SECURITY" | "ACCESSIBILITY" | "EDGE_CASE";
    }, {
        ruleText: string;
        isMeasurable: boolean;
        category: "VALIDATION" | "AUTHENTICATION" | "SECURITY" | "ACCESSIBILITY" | "EDGE_CASE";
    }>, "many">;
    suggestedClearRequirement: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    title: string;
    isAmbiguous: boolean;
    detectedAmbiguities: string[];
    structuredRules: {
        ruleText: string;
        isMeasurable: boolean;
        category: "VALIDATION" | "AUTHENTICATION" | "SECURITY" | "ACCESSIBILITY" | "EDGE_CASE";
    }[];
    suggestedClearRequirement: string;
}, {
    code: string;
    title: string;
    isAmbiguous: boolean;
    detectedAmbiguities: string[];
    structuredRules: {
        ruleText: string;
        isMeasurable: boolean;
        category: "VALIDATION" | "AUTHENTICATION" | "SECURITY" | "ACCESSIBILITY" | "EDGE_CASE";
    }[];
    suggestedClearRequirement: string;
}>;
export type StructuredRequirementDTO = z.infer<typeof StructuredRequirementSchema>;
export declare const GeneratedTestCaseSchema: z.ZodObject<{
    identifier: z.ZodString;
    title: z.ZodString;
    category: z.ZodEnum<["Positive", "Negative", "Boundary", "EquivalencePartition", "Authentication", "Authorization", "Accessibility", "Performance", "EdgeCase"]>;
    priority: z.ZodEnum<["CRITICAL", "HIGH", "MEDIUM", "LOW"]>;
    requirementRuleRef: z.ZodString;
    preconditions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    testData: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    steps: z.ZodArray<z.ZodObject<{
        stepNumber: z.ZodNumber;
        action: z.ZodString;
        target: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodString>;
        expectedResult: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        stepNumber: number;
        action: string;
        expectedResult: string;
        value?: string | undefined;
        target?: string | undefined;
    }, {
        stepNumber: number;
        action: string;
        expectedResult: string;
        value?: string | undefined;
        target?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    steps: {
        stepNumber: number;
        action: string;
        expectedResult: string;
        value?: string | undefined;
        target?: string | undefined;
    }[];
    title: string;
    category: "Positive" | "Negative" | "Boundary" | "EquivalencePartition" | "Authentication" | "Authorization" | "Accessibility" | "Performance" | "EdgeCase";
    identifier: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    requirementRuleRef: string;
    preconditions: string[];
    testData: Record<string, any>;
}, {
    steps: {
        stepNumber: number;
        action: string;
        expectedResult: string;
        value?: string | undefined;
        target?: string | undefined;
    }[];
    title: string;
    category: "Positive" | "Negative" | "Boundary" | "EquivalencePartition" | "Authentication" | "Authorization" | "Accessibility" | "Performance" | "EdgeCase";
    identifier: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    requirementRuleRef: string;
    preconditions?: string[] | undefined;
    testData?: Record<string, any> | undefined;
}>;
export type GeneratedTestCaseDTO = z.infer<typeof GeneratedTestCaseSchema>;
export declare const TestMatrixGenerationSchema: z.ZodObject<{
    requirementCode: z.ZodString;
    totalGenerated: z.ZodNumber;
    testCases: z.ZodArray<z.ZodObject<{
        identifier: z.ZodString;
        title: z.ZodString;
        category: z.ZodEnum<["Positive", "Negative", "Boundary", "EquivalencePartition", "Authentication", "Authorization", "Accessibility", "Performance", "EdgeCase"]>;
        priority: z.ZodEnum<["CRITICAL", "HIGH", "MEDIUM", "LOW"]>;
        requirementRuleRef: z.ZodString;
        preconditions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        testData: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
        steps: z.ZodArray<z.ZodObject<{
            stepNumber: z.ZodNumber;
            action: z.ZodString;
            target: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodString>;
            expectedResult: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            stepNumber: number;
            action: string;
            expectedResult: string;
            value?: string | undefined;
            target?: string | undefined;
        }, {
            stepNumber: number;
            action: string;
            expectedResult: string;
            value?: string | undefined;
            target?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        steps: {
            stepNumber: number;
            action: string;
            expectedResult: string;
            value?: string | undefined;
            target?: string | undefined;
        }[];
        title: string;
        category: "Positive" | "Negative" | "Boundary" | "EquivalencePartition" | "Authentication" | "Authorization" | "Accessibility" | "Performance" | "EdgeCase";
        identifier: string;
        priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        requirementRuleRef: string;
        preconditions: string[];
        testData: Record<string, any>;
    }, {
        steps: {
            stepNumber: number;
            action: string;
            expectedResult: string;
            value?: string | undefined;
            target?: string | undefined;
        }[];
        title: string;
        category: "Positive" | "Negative" | "Boundary" | "EquivalencePartition" | "Authentication" | "Authorization" | "Accessibility" | "Performance" | "EdgeCase";
        identifier: string;
        priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        requirementRuleRef: string;
        preconditions?: string[] | undefined;
        testData?: Record<string, any> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    requirementCode: string;
    totalGenerated: number;
    testCases: {
        steps: {
            stepNumber: number;
            action: string;
            expectedResult: string;
            value?: string | undefined;
            target?: string | undefined;
        }[];
        title: string;
        category: "Positive" | "Negative" | "Boundary" | "EquivalencePartition" | "Authentication" | "Authorization" | "Accessibility" | "Performance" | "EdgeCase";
        identifier: string;
        priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        requirementRuleRef: string;
        preconditions: string[];
        testData: Record<string, any>;
    }[];
}, {
    requirementCode: string;
    totalGenerated: number;
    testCases: {
        steps: {
            stepNumber: number;
            action: string;
            expectedResult: string;
            value?: string | undefined;
            target?: string | undefined;
        }[];
        title: string;
        category: "Positive" | "Negative" | "Boundary" | "EquivalencePartition" | "Authentication" | "Authorization" | "Accessibility" | "Performance" | "EdgeCase";
        identifier: string;
        priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        requirementRuleRef: string;
        preconditions?: string[] | undefined;
        testData?: Record<string, any> | undefined;
    }[];
}>;
export type TestMatrixGenerationDTO = z.infer<typeof TestMatrixGenerationSchema>;
