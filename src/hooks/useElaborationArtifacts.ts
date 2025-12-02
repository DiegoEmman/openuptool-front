import { useState, useEffect, useCallback } from "react";
import {
    elaborationService,
    type ElaborationArtifact,
} from "../services/elaborationService";

export function useElaborationArtifacts(projectId: string) {
    const [artifacts, setArtifacts] = useState<ElaborationArtifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArtifacts = useCallback(async () => {
        if (!projectId) return;

        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Fetching artifacts for project:', projectId);
            const data = await elaborationService.getArtifacts(projectId);
            console.log('✅ Artifacts received:', data.length, 'items');
            setArtifacts(data);
        } catch (err) {
            console.error('❌ Error loading artifacts:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al cargar artefactos"
            );
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchArtifacts();
    }, [fetchArtifacts]);

    const refetch = useCallback(() => {
        fetchArtifacts();
    }, [fetchArtifacts]);

    return { artifacts, loading, error, refetch };
}
