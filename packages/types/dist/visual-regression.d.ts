import { z } from 'zod';
export declare const VisualComparisonSchema: z.ZodObject<{
    testId: z.ZodString;
    url: z.ZodString;
    baselineScreenshotBase64: z.ZodString;
    currentScreenshotBase64: z.ZodString;
    diffScreenshotBase64: z.ZodOptional<z.ZodString>;
    mismatchPercentage: z.ZodNumber;
    isShiftDetected: z.ZodBoolean;
    viewport: z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        deviceType: z.ZodEnum<["DESKTOP", "TABLET", "MOBILE"]>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        deviceType: "DESKTOP" | "TABLET" | "MOBILE";
    }, {
        width: number;
        height: number;
        deviceType: "DESKTOP" | "TABLET" | "MOBILE";
    }>;
    status: z.ZodEnum<["MATCH", "VISUAL_DIFF_WARNING", "REGRESSION_DETECTED"]>;
    detectedDiffAreas: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    status: "MATCH" | "VISUAL_DIFF_WARNING" | "REGRESSION_DETECTED";
    url: string;
    testId: string;
    baselineScreenshotBase64: string;
    currentScreenshotBase64: string;
    mismatchPercentage: number;
    isShiftDetected: boolean;
    viewport: {
        width: number;
        height: number;
        deviceType: "DESKTOP" | "TABLET" | "MOBILE";
    };
    detectedDiffAreas: string[];
    diffScreenshotBase64?: string | undefined;
}, {
    status: "MATCH" | "VISUAL_DIFF_WARNING" | "REGRESSION_DETECTED";
    url: string;
    testId: string;
    baselineScreenshotBase64: string;
    currentScreenshotBase64: string;
    mismatchPercentage: number;
    isShiftDetected: boolean;
    viewport: {
        width: number;
        height: number;
        deviceType: "DESKTOP" | "TABLET" | "MOBILE";
    };
    detectedDiffAreas: string[];
    diffScreenshotBase64?: string | undefined;
}>;
export type VisualComparisonDTO = z.infer<typeof VisualComparisonSchema>;
export declare const VisualRegressionSuiteResultSchema: z.ZodObject<{
    targetUrl: z.ZodString;
    totalScreensCompared: z.ZodNumber;
    passedScreens: z.ZodNumber;
    regressedScreens: z.ZodNumber;
    visualStabilityScore: z.ZodNumber;
    comparisons: z.ZodArray<z.ZodObject<{
        testId: z.ZodString;
        url: z.ZodString;
        baselineScreenshotBase64: z.ZodString;
        currentScreenshotBase64: z.ZodString;
        diffScreenshotBase64: z.ZodOptional<z.ZodString>;
        mismatchPercentage: z.ZodNumber;
        isShiftDetected: z.ZodBoolean;
        viewport: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
            deviceType: z.ZodEnum<["DESKTOP", "TABLET", "MOBILE"]>;
        }, "strip", z.ZodTypeAny, {
            width: number;
            height: number;
            deviceType: "DESKTOP" | "TABLET" | "MOBILE";
        }, {
            width: number;
            height: number;
            deviceType: "DESKTOP" | "TABLET" | "MOBILE";
        }>;
        status: z.ZodEnum<["MATCH", "VISUAL_DIFF_WARNING", "REGRESSION_DETECTED"]>;
        detectedDiffAreas: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        status: "MATCH" | "VISUAL_DIFF_WARNING" | "REGRESSION_DETECTED";
        url: string;
        testId: string;
        baselineScreenshotBase64: string;
        currentScreenshotBase64: string;
        mismatchPercentage: number;
        isShiftDetected: boolean;
        viewport: {
            width: number;
            height: number;
            deviceType: "DESKTOP" | "TABLET" | "MOBILE";
        };
        detectedDiffAreas: string[];
        diffScreenshotBase64?: string | undefined;
    }, {
        status: "MATCH" | "VISUAL_DIFF_WARNING" | "REGRESSION_DETECTED";
        url: string;
        testId: string;
        baselineScreenshotBase64: string;
        currentScreenshotBase64: string;
        mismatchPercentage: number;
        isShiftDetected: boolean;
        viewport: {
            width: number;
            height: number;
            deviceType: "DESKTOP" | "TABLET" | "MOBILE";
        };
        detectedDiffAreas: string[];
        diffScreenshotBase64?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    targetUrl: string;
    totalScreensCompared: number;
    passedScreens: number;
    regressedScreens: number;
    visualStabilityScore: number;
    comparisons: {
        status: "MATCH" | "VISUAL_DIFF_WARNING" | "REGRESSION_DETECTED";
        url: string;
        testId: string;
        baselineScreenshotBase64: string;
        currentScreenshotBase64: string;
        mismatchPercentage: number;
        isShiftDetected: boolean;
        viewport: {
            width: number;
            height: number;
            deviceType: "DESKTOP" | "TABLET" | "MOBILE";
        };
        detectedDiffAreas: string[];
        diffScreenshotBase64?: string | undefined;
    }[];
}, {
    targetUrl: string;
    totalScreensCompared: number;
    passedScreens: number;
    regressedScreens: number;
    visualStabilityScore: number;
    comparisons: {
        status: "MATCH" | "VISUAL_DIFF_WARNING" | "REGRESSION_DETECTED";
        url: string;
        testId: string;
        baselineScreenshotBase64: string;
        currentScreenshotBase64: string;
        mismatchPercentage: number;
        isShiftDetected: boolean;
        viewport: {
            width: number;
            height: number;
            deviceType: "DESKTOP" | "TABLET" | "MOBILE";
        };
        detectedDiffAreas: string[];
        diffScreenshotBase64?: string | undefined;
    }[];
}>;
export type VisualRegressionSuiteResultDTO = z.infer<typeof VisualRegressionSuiteResultSchema>;
