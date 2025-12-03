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
        if (!projectId) {
            console.warn("⚠️ [useElaborationArtifacts] No projectId provided");
            return;
        }

        try {
            console.log("🔄 [useElaborationArtifacts] Starting fetch...");
            console.log("🔍 [useElaborationArtifacts] Project ID:", projectId);

            setLoading(true);
            setError(null);

            const data = await elaborationService.getArtifacts(projectId);

            console.log(
                "✅ [useElaborationArtifacts] Fetch complete:",
                data.length,
                "artifacts"
            );
            setArtifacts(data);
        } catch (err) {
            console.error("❌ [useElaborationArtifacts] Fetch failed:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Error al cargar artefactos";
            console.error(
                "❌ [useElaborationArtifacts] Error message:",
                errorMessage
            );
            setError(errorMessage);
        } finally {
            console.log(
                "🏁 [useElaborationArtifacts] Setting loading to false"
            );
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
