// Test Execution types based on backend DTOs

export interface TestExecution {
    id: string;
    artifactId: string;
    testCaseId: string;
    testCaseName: string;
    executedBy: string;
    executedAt: string;
    status: TestExecutionStatus;
    duration?: number;
    notes?: string;
    defectsFound?: number;
    environment?: string;
    buildVersion?: string;
}

export type TestExecutionStatus = "Passed" | "Failed" | "Blocked" | "Not Run";

export interface CreateTestExecutionInput {
    artifactId: string;
    testCaseId: string;
    testCaseName: string;
    status: TestExecutionStatus;
    duration?: number;
    notes?: string;
    environment?: string;
    buildVersion?: string;
}

export interface UpdateTestExecutionInput {
    status?: TestExecutionStatus;
    duration?: number;
    notes?: string;
    environment?: string;
    buildVersion?: string;
}

export interface TestExecutionSummary {
    totalExecutions: number;
    passed: number;
    failed: number;
    blocked: number;
    notRun: number;
    passRate: number;
    totalDefectsFound: number;
    averageDuration?: number;
}
