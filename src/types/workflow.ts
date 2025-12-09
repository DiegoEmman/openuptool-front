// ========== WORKFLOW TYPES ==========

export interface Workflow {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    states: WorkflowState[];
}

export interface CreateWorkflowInput {
    projectId: string;
    name: string;
    description?: string;
}

export interface UpdateWorkflowInput {
    name: string;
    description?: string;
    isActive: boolean;
}

// ========== WORKFLOW STATE TYPES ==========

export interface WorkflowState {
    id: string;
    workflowId: string;
    name: string;
    description?: string;
    order: number;
    color?: string;
    isInitialState: boolean;
    isFinalState: boolean;
    requiredActions?: string;
    createdAt: string;
    updatedAt: string;
    responsibles: WorkflowStateResponsible[];
}

export interface CreateWorkflowStateInput {
    workflowId: string;
    name: string;
    description?: string;
    order: number;
    color?: string;
    isInitialState: boolean;
    isFinalState: boolean;
    requiredActions?: string;
}

export interface UpdateWorkflowStateInput {
    name: string;
    description?: string;
    order: number;
    color?: string;
    isInitialState: boolean;
    isFinalState: boolean;
    requiredActions?: string;
}

// ========== RESPONSIBLE TYPES ==========

export interface WorkflowStateResponsible {
    id: string;
    workflowStateId: string;
    userId: string;
    userName: string;
    userEmail: string;
    role?: string;
    assignedAt: string;
}

export interface CreateWorkflowStateResponsibleInput {
    workflowStateId: string;
    userId?: string;
    userEmail?: string;
    role?: string;
}

// ========== ARTIFACT STATE HISTORY TYPES ==========

export interface ArtifactStateHistory {
    id: string;
    artifactId: string;
    fromStateId?: string;
    fromStateName?: string;
    toStateId: string;
    toStateName: string;
    changedByUserId: string;
    changedByUserName: string;
    changedAt: string;
    comments?: string;
    metadata?: string;
}

export interface ChangeArtifactStateInput {
    artifactId: string;
    toStateId: string;
    comments?: string;
    metadata?: string;
}

// ========== COMBINED TYPES ==========

export interface WorkflowWithStates {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    states: WorkflowState[];
    totalArtifacts: number;
}

export interface ArtifactWithWorkflow {
    id: string;
    title: string;
    workflowId?: string;
    workflowName?: string;
    currentStateId?: string;
    currentStateName?: string;
    currentStateColor?: string;
    stateHistory: ArtifactStateHistory[];
}

// ========== WORKFLOW PERMISSION TYPES (HU-013) ==========

export interface WorkflowPermission {
    id: string;
    workflowId: string;
    role: string; // autor, revisor, PO, admin
    action: string; // crear, editar, aprobar, cambiar_estado
    isAllowed: boolean;
    createdAt: string;
}

export interface CreateWorkflowPermissionInput {
    workflowId: string;
    role: string;
    action: string;
    isAllowed: boolean;
}

export interface UpdateWorkflowPermissionInput {
    isAllowed: boolean;
}

export interface PermissionRoleDto {
    role: string;
    actions: Record<string, boolean>; // { crear: true, editar: false, ... }
}

export interface WorkflowPermissionMatrix {
    workflowId: string;
    workflowName: string;
    permissions: PermissionRoleDto[];
}

export interface CheckPermissionResult {
    hasPermission: boolean;
    workflowId: string;
    role: string;
    action: string;
}
