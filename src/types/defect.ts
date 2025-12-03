// Defect types based on backend DTOs

export interface Defect {
    id: string;
    projectId: string;
    defectNumber: string;
    title: string;
    description: string;
    severity: DefectSeverity;
    priority: DefectPriority;
    type: string;
    status: DefectStatus;
    artifactId?: string;
    artifactVersionId?: string;
    testExecutionId?: string;
    reportedBy: string;
    assignedTo?: string;
    reportedAt: string;
    assignedAt?: string;
    resolvedAt?: string;
    resolvedBy?: string;
    resolution?: string;
    environment?: string;
    stepsToReproduce?: string;
    expectedResult?: string;
    actualResult?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    artifactTitle?: string;
    testCaseName?: string;
}

export type DefectSeverity = "Critical" | "High" | "Medium" | "Low";
export type DefectPriority = "Urgent" | "High" | "Medium" | "Low";
export type DefectStatus =
    | "Open"
    | "In Progress"
    | "Resolved"
    | "Closed"
    | "Reopened";

export interface CreateDefectInput {
    projectId: string;
    title: string;
    description: string;
    severity: DefectSeverity;
    priority: DefectPriority;
    type: string; // Required by backend
    reportedBy: string; // Required by backend
    artifactId?: string;
    artifactVersionId?: string;
    testExecutionId?: string;
    assignedTo?: string;
    environment?: string;
    stepsToReproduce?: string;
    expectedResult?: string; // Changed from expectedBehavior
    actualResult?: string; // Changed from actualBehavior
    tags?: string[];
}

export interface UpdateDefectInput {
    title?: string;
    description?: string;
    severity?: DefectSeverity;
    priority?: DefectPriority;
    type?: string;
    status?: DefectStatus;
    assignedTo?: string;
    resolution?: string;
    environment?: string;
    stepsToReproduce?: string;
    expectedResult?: string;
    actualResult?: string;
    tags?: string[];
}

export interface DefectSummary {
    totalDefects: number;
    openDefects: number;
    inProgressDefects: number;
    resolvedDefects: number;
    closedDefects: number;
    criticalDefects: number;
    highSeverityDefects: number;
    averageResolutionTime?: number;
}
