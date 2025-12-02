import { useState, useCallback } from "react";
import {
    elaborationService,
    type ValidationResult,
} from "../services/elaborationService";

export function useValidateElaborationPhase(projectId: string) {
    const [validating, setValidating] = useState(false);
    const [validationResult, setValidationResult] =
        useState<ValidationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validate = useCallback(async () => {
        if (!projectId) return;

        try {
            setValidating(true);
            setError(null);
            const result = await elaborationService.validatePhase(projectId);
            setValidationResult(result);
            return result;
        } catch (err) {
            const errorMsg =
                err instanceof Error ? err.message : "Error al validar la fase";
            setError(errorMsg);
            throw err;
        } finally {
            setValidating(false);
        }
    }, [projectId]);

    return {
        validate,
        validating,
        validationResult,
        error,
    };
}
