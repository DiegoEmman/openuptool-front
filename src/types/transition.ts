// ============= FINAL BUILD =============

export interface BinaryArtifact {
    name: string;
    type: "EXECUTABLE" | "LIBRARY" | "PACKAGE" | "INSTALLER";
    filePath?: string;
    downloadUrl?: string;
    size?: number;
    checksum?: string;
    checksumType?: "MD5" | "SHA256";
}

export interface FinalBuild {
    id: string;
    projectId: string;
    projectName: string;
    buildNumber: string;
    version: string;
    buildTag?: string;
    commitHash?: string;
    buildDate: string;
    builtBy: string;
    buildEnvironment?: string;
    buildConfiguration?: string;
    binaryArtifacts: BinaryArtifact[];
    mainDownloadUrl?: string;
    documentationUrl?: string;
    releaseNotesUrl?: string;
    targetPlatform?: string;
    dependencies?: string;
    systemRequirements?: string;
    isStable: boolean;
    testsPassed?: number;
    testsTotal?: number;
    codeCoverage?: number;
    qualityGateStatus?: string;
    closureId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFinalBuildInput {
    projectId: string;
    buildNumber: string;
    version: string;
    buildTag?: string;
    commitHash?: string;
    buildEnvironment?: string;
    buildConfiguration?: string;
    binaryArtifacts: BinaryArtifact[];
    mainDownloadUrl?: string;
    documentationUrl?: string;
    releaseNotesUrl?: string;
    targetPlatform?: string;
    dependencies?: string;
    systemRequirements?: string;
    isStable: boolean;
    testsPassed?: number;
    testsTotal?: number;
    codeCoverage?: number;
    qualityGateStatus?: string;
    closureId?: string;
}

export interface UpdateFinalBuildInput {
    buildNumber?: string;
    version?: string;
    buildTag?: string;
    commitHash?: string;
    buildEnvironment?: string;
    buildConfiguration?: string;
    binaryArtifacts?: BinaryArtifact[];
    mainDownloadUrl?: string;
    documentationUrl?: string;
    releaseNotesUrl?: string;
    targetPlatform?: string;
    dependencies?: string;
    systemRequirements?: string;
    isStable?: boolean;
    testsPassed?: number;
    testsTotal?: number;
    codeCoverage?: number;
    qualityGateStatus?: string;
    closureId?: string;
}

// ============= PROJECT CLOSURE =============

export interface ClosureCriteria {
    criteriaId: string;
    name: string;
    isMandatory: boolean;
    isCompleted: boolean;
    notes?: string;
}

export interface ProjectClosure {
    id: string;
    projectId: string;
    projectName: string;
    closedBy: string;
    closureDate: string;
    summary?: string;
    lessonsLearned?: string;
    recommendations?: string;
    checklist: ClosureCriteria[];
    allMandatoryCriteriaMet: boolean;
    totalCriteria: number;
    completedCriteria: number;
    mandatoryCriteria: number;
    completedMandatoryCriteria: number;
    status: "Draft" | "PendingApproval" | "Approved" | "Rejected";
    rejectionReason?: string;
    approvedAt?: string;
    approvedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectClosureInput {
    projectId: string;
    summary?: string;
    lessonsLearned?: string;
    recommendations?: string;
    checklist: ClosureCriteria[];
}

export interface UpdateProjectClosureInput {
    summary?: string;
    lessonsLearned?: string;
    recommendations?: string;
    checklist?: ClosureCriteria[];
}

export interface ApproveClosureInput {
    approve: boolean;
    rejectionReason?: string;
}

export interface ClosureValidation {
    canClose: boolean;
    missingMandatoryCriteria: string[];
    totalMandatory: number;
    completedMandatory: number;
    checklistPreview: ClosureCriteria[];
}
