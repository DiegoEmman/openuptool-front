export interface PhaseScheduleItem {
    phaseName: string; // INCEPTION, ELABORATION, CONSTRUCTION, TRANSITION
    startDate: string; // ISO
    endDate: string; // ISO
    responsible?: string; // Responsable de la fase
}

export interface Milestone {
    id: string;
    name: string;
    date: string;
    description?: string;
}

export interface ProjectPlan {
    id: string;
    projectId: string;
    objectives: string;
    scope: string;
    initialSchedule: PhaseScheduleItem[];
    milestones: Milestone[];
    createdAt: string;
    version: number;
    observations?: string;
}

export interface CreateInitialPlanInput {
    objectives: string;
    scope: string;
    initialSchedule: PhaseScheduleItem[];
    milestones: Omit<Milestone, 'id'>[];
    observations?: string;
}
