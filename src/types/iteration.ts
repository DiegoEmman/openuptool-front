import type { PhaseCode } from './artifact';

export type IterationStatus = 'Planeada' | 'En curso' | 'Finalizada';

export interface Iteration {
    id: string;
    projectId: string;
    name: string;
    objective?: string;
    phase: PhaseCode;
    startDate: string;
    endDate: string;
    status: IterationStatus;
}

export interface CreateIterationInput {
    name: string;
    objective?: string;
    phase: PhaseCode;
    startDate: string;
    endDate: string;
}
