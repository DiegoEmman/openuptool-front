// Iteration Progress types based on backend DTOs

export interface IterationProgress {
    id: string;
    iterationId: string;
    recordDate: string;
    completionPercentage: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    blockers?: string;
    observations?: string;
    createdAt: string;
}

export interface CreateIterationProgressInput {
    recordDate: string;
    completionPercentage: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    blockers?: string;
    observations?: string;
}

export interface UpdateIterationProgressInput {
    completionPercentage?: number;
    totalTasks?: number;
    completedTasks?: number;
    inProgressTasks?: number;
    blockedTasks?: number;
    blockers?: string;
    observations?: string;
}

export interface IterationSummary {
    iterationId: string;
    iterationName: string;
    phase: string;
    startDate: string;
    endDate: string;
    status: string;
    completionPercentage: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    latestProgress?: IterationProgress;
}

export interface BurndownData {
    iterationId: string;
    iterationName: string;
    startDate: string;
    endDate: string;
    dataPoints: BurndownPoint[];
}

export interface BurndownPoint {
    date: string;
    remainingTasks: number;
    idealRemaining: number;
    completedTasks: number;
}

export interface IterationTask {
    id: string;
    iterationId: string;
    name: string;
    description?: string;
    status: string;
    estimatedHours?: number;
    actualHours?: number;
    assignedTo?: string;
    assignedToName?: string;
    startDate?: string;
    endDate?: string;
    priority: number;
    blockerDescription?: string;
    createdAt: string;
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked";

export interface CreateIterationTaskInput {
    name: string;
    description?: string;
    estimatedHours?: number;
    assignedTo?: string;
    startDate?: string;
    endDate?: string;
    priority?: number;
}

export interface UpdateIterationTaskInput {
    name?: string;
    description?: string;
    status?: string;
    estimatedHours?: number;
    actualHours?: number;
    assignedTo?: string;
    startDate?: string;
    endDate?: string;
    priority?: number;
    blockerDescription?: string;
}
