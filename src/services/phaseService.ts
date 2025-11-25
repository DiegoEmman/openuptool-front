import { nanoid } from 'nanoid';
import type { Phase, CreatePhaseInput, UpdatePhaseInput, PhaseCode } from '../types/phase';

// Almacenamiento en memoria (temporal hasta integración con backend)
const phases: Phase[] = [];

const PHASE_DEFINITIONS: Array<{ code: PhaseCode; name: string; order: number }> = [
    { code: 'INCEPTION', name: 'Incepción', order: 1 },
    { code: 'ELABORATION', name: 'Elaboración', order: 2 },
    { code: 'CONSTRUCTION', name: 'Construcción', order: 3 },
    { code: 'TRANSITION', name: 'Transición', order: 4 },
];

export const phaseService = {
    /**
     * Crea las 4 fases estándar de OpenUP para un proyecto
     */
    createDefaultPhases(projectId: string): Phase[] {
        // Verificar que no existan fases para este proyecto
        const existing = phases.filter((p) => p.projectId === projectId);
        if (existing.length > 0) {
            console.warn(`Fases ya existen para proyecto ${projectId}`);
            return existing;
        }

        const newPhases: Phase[] = PHASE_DEFINITIONS.map((def) => ({
            id: nanoid(),
            projectId,
            phaseCode: def.code,
            name: def.name,
            status: 'PENDING',
            orderIndex: def.order,
        }));

        phases.push(...newPhases);
        return newPhases;
    },

    /**
     * Obtiene todas las fases de un proyecto ordenadas
     */
    getPhasesByProject(projectId: string): Phase[] {
        return phases
            .filter((p) => p.projectId === projectId)
            .sort((a, b) => a.orderIndex - b.orderIndex);
    },

    /**
     * Obtiene una fase específica por ID
     */
    getPhase(phaseId: string): Phase | undefined {
        return phases.find((p) => p.id === phaseId);
    },

    /**
     * Obtiene una fase específica por proyecto y código
     */
    getPhaseByCode(projectId: string, phaseCode: PhaseCode): Phase | undefined {
        return phases.find((p) => p.projectId === projectId && p.phaseCode === phaseCode);
    },

    /**
     * Actualiza una fase existente
     */
    updatePhase(phaseId: string, changes: UpdatePhaseInput): Phase | undefined {
        const idx = phases.findIndex((p) => p.id === phaseId);
        if (idx === -1) return undefined;

        phases[idx] = { ...phases[idx], ...changes };
        return phases[idx];
    },

    /**
     * Actualiza el estado de una fase
     */
    updatePhaseStatus(phaseId: string, status: Phase['status']): Phase | undefined {
        return this.updatePhase(phaseId, { status });
    },

    /**
     * Establece fechas planificadas para una fase
     */
    setPlannedDates(phaseId: string, startDate: string, endDate: string): Phase | undefined {
        return this.updatePhase(phaseId, { startDate, endDate });
    },

    /**
     * Registra inicio real de una fase
     */
    startPhase(phaseId: string): Phase | undefined {
        const phase = this.getPhase(phaseId);
        if (!phase) return undefined;

        return this.updatePhase(phaseId, {
            actualStart: new Date().toISOString().split('T')[0],
            status: 'IN_PROGRESS',
        });
    },

    /**
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
