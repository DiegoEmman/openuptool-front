// HU-018: Tipos para configuración global del sistema

export interface GlobalConfiguration {
    id: string;
    name: string;
    description?: string;
    version: number;
    isActive: boolean;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface GlobalConfigurationDetail extends GlobalConfiguration {
    roles: RoleTemplate[];
    phases: PhaseTemplate[];
    artifactTypes: ArtifactTypeTemplate[];
    workflows: WorkflowTemplate[];
    customFields: CustomFieldDefinition[];
}

export interface CreateGlobalConfigurationInput {
    name: string;
    description?: string;
    isActive?: boolean;
    isDefault?: boolean;
}

export interface UpdateGlobalConfigurationInput {
    name?: string;
    description?: string;
    isActive?: boolean;
    isDefault?: boolean;
}

// Roles
export interface RoleTemplate {
    id: string;
    configurationId: string;
    name: string;
    description?: string;
    permissions: string[];
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoleTemplateInput {
    configurationId?: string;
    name: string;
    description?: string;
    permissions: string[];
    orderIndex?: number;
}

export interface UpdateRoleTemplateInput {
    name?: string;
    description?: string;
    permissions?: string[];
    orderIndex?: number;
}

// Phases
export interface PhaseTemplate {
    id: string;
    configurationId: string;
    name: string;
    code: string;
    phaseCode?: string; // Alias del backend
    description?: string;
    orderIndex: number;
    defaultDurationDays?: number;
    isMandatory: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePhaseTemplateInput {
    configurationId?: string;
    name: string;
    code: string;
    phaseCode?: string;
    description?: string;
    orderIndex?: number;
    defaultDurationDays?: number;
    isMandatory?: boolean;
}

export interface UpdatePhaseTemplateInput {
    name?: string;
    code?: string;
    phaseCode?: string;
    description?: string;
    orderIndex?: number;
    defaultDurationDays?: number;
    isMandatory?: boolean;
}

// Artifact Types
export interface ArtifactTypeTemplate {
    id: string;
    configurationId: string;
    name: string;
    code: string;
    description?: string;
    phaseCode: string;
    isRequired: boolean;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateArtifactTypeTemplateInput {
    configurationId?: string;
    name: string;
    code: string;
    description?: string;
    phaseCode: string;
    isRequired?: boolean;
    orderIndex?: number;
}

export interface UpdateArtifactTypeTemplateInput {
    name?: string;
    code?: string;
    description?: string;
    phaseCode?: string;
    isRequired?: boolean;
    orderIndex?: number;
}

// Workflow Templates
export interface WorkflowTemplate {
    id: string;
    configurationId: string;
    name: string;
    description?: string;
    applicablePhases: string[];
    isDefault: boolean;
    orderIndex: number;
    states: WorkflowStateTemplate[];
    createdAt: string;
    updatedAt: string;
}

export interface WorkflowStateTemplate {
    id: string;
    workflowTemplateId: string;
    name: string;
    description?: string;
    orderIndex: number;
    color?: string;
    isInitialState: boolean;
    isFinalState: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkflowTemplateInput {
    configurationId?: string;
    name: string;
    description?: string;
    applicablePhases: string[];
    isDefault?: boolean;
    orderIndex?: number;
}

export interface UpdateWorkflowTemplateInput {
    name?: string;
    description?: string;
    applicablePhases?: string[];
    isDefault?: boolean;
    orderIndex?: number;
}

export interface CreateWorkflowStateTemplateInput {
    workflowTemplateId?: string;
    name: string;
    description?: string;
    orderIndex?: number;
    color?: string;
    isInitialState?: boolean;
    isFinalState?: boolean;
}

export interface UpdateWorkflowStateTemplateInput {
    name?: string;
    description?: string;
    orderIndex?: number;
    color?: string;
    isInitialState?: boolean;
    isFinalState?: boolean;
}

// Custom Fields
export interface CustomFieldDefinition {
    id: string;
    configurationId: string;
    artifactTypeTemplateId: string;
    fieldName: string;
    displayName: string;
    fieldType: "text" | "number" | "date" | "boolean" | "select";
    isRequired: boolean;
    defaultValue?: string;
    options?: string[];
    validationRules?: Record<string, any>;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomFieldDefinitionInput {
    artifactTypeTemplateId: string;
    fieldName: string;
    displayName: string;
    fieldType: "text" | "number" | "date" | "boolean" | "select";
    isRequired?: boolean;
    defaultValue?: string;
    options?: string[];
    validationRules?: Record<string, any>;
    orderIndex?: number;
}

export interface UpdateCustomFieldDefinitionInput {
    fieldName?: string;
    displayName?: string;
    fieldType?: "text" | "number" | "date" | "boolean" | "select";
    isRequired?: boolean;
    defaultValue?: string;
    options?: string[];
    validationRules?: Record<string, any>;
    orderIndex?: number;
}

// Change History
export interface ConfigurationChangeHistory {
    id: string;
    configurationId: string;
    fromVersion: number;
    toVersion: number;
    changeType: string;
    entityType: string;
    entityId?: string;
    entityName?: string;
    oldValue?: string;
    newValue?: string;
    changeDescription?: string;
    changedBy: string;
    changedAt: string;
}

// Rollback
export interface RollbackConfigurationInput {
    targetVersion: number;
    reason?: string;
}

// Project Configuration
export interface ProjectConfiguration {
    id: string;
    projectId: string;
    configurationId: string;
    appliedAt: string;
    appliedBy: string;
}

// ========== HU-019: Template Management ==========

// Save As Template
export interface SaveAsTemplateInput {
    name: string;
    description?: string;
    tags?: string;
}

// Clone Template
export interface CloneTemplateInput {
    newName: string;
    newDescription?: string;
}

// Template List Item
export interface TemplateListItem {
    id: string;
    name: string;
    description?: string;
    version: number;
    isDefault: boolean;
    isActive: boolean;
    tags?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    rolesCount: number;
    phasesCount: number;
    artifactTypesCount: number;
    workflowsCount: number;
    projectsUsingCount: number;
}

// Template Comparison
export interface TemplateComparison {
    template1: TemplateMetadata;
    template2: TemplateMetadata;
    differences: ComparisonDifference[];
    summary: TemplateComparisonSummary;
}

export interface TemplateMetadata {
    id: string;
    name: string;
    description?: string;
    version: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    rolesCount: number;
    phasesCount: number;
    artifactTypesCount: number;
    workflowsCount: number;
    customFieldsCount: number;
}

export interface ComparisonDifference {
    entityType: string; // ROLE, PHASE, ARTIFACT_TYPE, WORKFLOW, CUSTOM_FIELD
    differenceType: string; // ADDED, REMOVED, MODIFIED
    entityName: string;
    template1Value?: string;
    template2Value?: string;
    propertyChanged?: string;
}

export interface TemplateComparisonSummary {
    totalDifferences: number;
    rolesDifferences: number;
    phasesDifferences: number;
    artifactTypesDifferences: number;
    workflowsDifferences: number;
    customFieldsDifferences: number;
    areIdentical: boolean;
}

// Template Export
export interface TemplateExport {
    originalId: string;
    name: string;
    description?: string;
    version: number;
    tags?: string;
    exportedAt: string;
    exportedBy: string;
    roles: RoleTemplate[];
    phases: PhaseTemplate[];
    artifactTypes: ArtifactTypeTemplate[];
    workflows: WorkflowTemplate[];
}

// Template Import
export interface TemplateImportInput {
    name: string;
    description?: string;
    tags?: string;
    roles?: RoleTemplate[];
    phases?: PhaseTemplate[];
    artifactTypes?: ArtifactTypeTemplate[];
    workflows?: WorkflowTemplate[];
}
