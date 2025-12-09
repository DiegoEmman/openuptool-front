import type { PhaseCode } from "./artifact";

export type IterationStatus = "Planeada" | "En curso" | "Finalizada";

export interface Iteration {
    id: string;
    projectId: string;
    name: string;
    objective?: string;
    phase: PhaseCode;
    startDate: string;
    endDate: string;
    status: IterationStatus;
    plannedCapacityHours?: number;
    teamSize?: number;
    plannedPoints?: number;
    completedPoints?: number;
    createdAt: string;
}

export interface CreateIterationInput {
    name: string;
    objective?: string;
    phase: PhaseCode;
    startDate: string;
    endDate: string;
    plannedCapacityHours?: number;
    teamSize?: number;
    plannedPoints?: number;
}

// HU-016: Capacidad y velocidad
export interface UpdateIterationCapacityInput {
    plannedCapacityHours?: number;
    teamSize?: number;
    plannedPoints?: number;
}

export interface UpdateIterationVelocityInput {
    plannedPoints?: number;
    completedPoints: number;
}

export interface IterationVelocityDto {
    iterationId: string;
    iterationName: string;
    phase: string;
    startDate: string;
    endDate: string;
    status: string;
    plannedCapacityHours?: number;
    teamSize?: number;
    plannedPoints?: number;
    completedPoints?: number;
    velocityPerHour?: number;
    pointsPerMember?: number;
}

export interface ProjectVelocityStats {
    projectId: string;
    projectName: string;
    totalIterations: number;
    totalIterationsWithData: number;
    averageVelocity: number;
    averageCapacityHours: number;
    averageTeamSize: number;
    suggestedPointsNextIteration: number;
    totalCompletedPoints: number;
    iterationHistory: IterationVelocityDto[];
}
