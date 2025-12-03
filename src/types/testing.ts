// Test Execution Types
export type TestExecutionResult =
    | "Pending"
    | "Passed"
    | "Failed"
    | "Blocked"
    | "Skipped";

export interface TestExecutionDto {
    id: string;
    artifactId: string;
    testCaseId: string;
    testCaseName: string;
    result: TestExecutionResult;
    executedBy: string;
    executedAt: string;
    durationSeconds?: number;
    evidence?: string; // JSON array
    notes?: string;
    artifactVersionId?: string;
    environment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTestExecutionDto {
    artifactId: string;
    testCaseId: string;
    testCaseName: string;
    result: TestExecutionResult;
    durationSeconds?: number;
    evidence?: string;
    notes?: string;
    artifactVersionId?: string;
    environment?: string;
}

export interface UpdateTestExecutionDto {
    result?: TestExecutionResult;
    durationSeconds?: number;
    evidence?: string;
    notes?: string;
    environment?: string;
}

export interface TestExecutionSummaryDto {
    totalExecutions: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
    pending: number;
    passRate: number;
    lastExecutionDate?: string;
}

// Defect Types
export type DefectSeverity = "Critical" | "High" | "Medium" | "Low";
export type DefectStatus =
    | "Open"
    | "InProgress"
    | "Resolved"
    | "Closed"
    | "Reopened";
export type DefectPriority = "Critical" | "High" | "Medium" | "Low";
export type DefectType =
    | "Bug"
    | "Regression"
    | "Performance"
    | "Security"
    | "UI"
    | "Other";

export interface DefectDto {
    id: string;
    defectNumber: string;
    title: string;
    description?: string;
    severity: DefectSeverity;
    status: DefectStatus;
    priority?: DefectPriority;
    type?: DefectType;
    projectId: string;
    artifactId?: string;
    artifactVersionId?: string;
    testExecutionId?: string;
    reportedBy: string;
    reportedAt: string;
    assignedTo?: string;
    assignedAt?: string;
    resolvedAt?: string;
    resolvedBy?: string;
    resolution?: string;
    stepsToReproduce?: string;
    expectedResult?: string;
    actualResult?: string;
    environment?: string;
    tags?: string; // JSON array
    createdAt: string;
    updatedAt: string;
}

export interface CreateDefectDto {
    title: string;
    description?: string;
    severity: DefectSeverity;
    priority?: DefectPriority;
    type?: DefectType;
    projectId: string;
    artifactId?: string;
    artifactVersionId?: string;
    testExecutionId?: string;
    stepsToReproduce?: string;
    expectedResult?: string;
    actualResult?: string;
    environment?: string;
    tags?: string[];
}

export interface UpdateDefectDto {
    title?: string;
    description?: string;
    severity?: DefectSeverity;
    priority?: DefectPriority;
    type?: DefectType;
    stepsToReproduce?: string;
    expectedResult?: string;
    actualResult?: string;
    environment?: string;
    tags?: string[];
}

export interface DefectSummaryDto {
    totalDefects: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    reopened: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    resolvedRate: number;
}
