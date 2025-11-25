import type { Phase, UpdatePhaseInput, PhaseCode } from '../types/phase';
import { httpClient } from './api/httpClient';

export const phaseService = {
    /**
     * Obtiene todas las fases de un proyecto ordenadas
     */
    async getPhasesByProject(projectId: string): Promise<Phase[]> {
        return httpClient<Phase[]>(`/projects/${projectId}/phases`);
    },

    /**
     * Obtiene una fase específica por ID
     */
    async getPhase(phaseId: string, projectId: string): Promise<Phase | undefined> {
        try {
            const phases = await this.getPhasesByProject(projectId);
            return phases.find(p => p.id === phaseId);
        } catch (error) {
            console.error('Error fetching phase:', error);
            return undefined;
        }
    },

    /**
     * Obtiene una fase específica por proyecto y código
     */
    async getPhaseByCode(projectId: string, phaseCode: PhaseCode): Promise<Phase | undefined> {
        try {
            return await httpClient<Phase>(`/projects/${projectId}/phases/${phaseCode}`);
        } catch (error) {
            console.error('Error fetching phase by code:', error);
            return undefined;
        }
    },

    /**
     * Actualiza una fase existente
     */
    async updatePhase(projectId: string, phaseId: string, changes: UpdatePhaseInput): Promise<Phase | undefined> {
        try {
            return await httpClient<Phase>(`/projects/${projectId}/phases/${phaseId}`, {
                method: 'PATCH',
                body: JSON.stringify(changes),
            });
        } catch (error) {
            console.error('Error updating phase:', error);
            return undefined;
        }
    },

    /**
     * Actualiza el estado de una fase
     */
    async updatePhaseStatus(projectId: string, phaseId: string, status: Phase['status']): Promise<Phase | undefined> {
        return this.updatePhase(projectId, phaseId, { status });
    },

    /**
     * Establece fechas planificadas para una fase
     */
    async setPlannedDates(projectId: string, phaseId: string, startDate: string, endDate: string): Promise<Phase | undefined> {
        return this.updatePhase(projectId, phaseId, { startDate, endDate });
    },

    /**
     * Registra inicio real de una fase
     */
    async startPhase(projectId: string, phaseId: string): Promise<Phase | undefined> {
        try {
            return await httpClient<Phase>(`/projects/${projectId}/phases/${phaseId}/start`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Error starting phase:', error);
            return undefined;
        }
    },

    /**
     * Registra fin real de una fase
     */
    async completePhase(projectId: string, phaseId: string): Promise<Phase | undefined> {
        try {
            return await httpClient<Phase>(`/projects/${projectId}/phases/${phaseId}/complete`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Error completing phase:', error);
            return undefined;
        }
    },

    /**
     * Crea las fases por defecto (ahora manejado por el backend)
     */
    createDefaultPhases(projectId: string): Promise<Phase[]> {
        // Las fases se crean automáticamente al crear el proyecto en el backend
        return this.getPhasesByProject(projectId);
    },
};
     * Registra finalización real de una fase
     */
    completePhase(phaseId: string): Phase | undefined {
        const phase = this.getPhase(phaseId);
        if (!phase) return undefined;

        return this.updatePhase(phaseId, {
            actualEnd: new Date().toISOString().split('T')[0],
            status: 'COMPLETED',
        });
    },
};

// TODO: Reemplazar por llamadas HTTP al backend real cuando esté disponible.
// Endpoints sugeridos:
// GET    /api/projects/:projectId/phases
// GET    /api/phases/:id
// PATCH  /api/phases/:id
// POST   /api/phases/:id/start
// POST   /api/phases/:id/complete
