import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    TextField,
    FormControlLabel,
    Checkbox,
    Alert,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import type {
    Artifact,
    PhaseCode,
    ValidateReassignmentInput,
    ReassignmentValidationResult,
    ReassignArtifactInput,
    ReassignmentViolation,
} from "../../types/artifact";
import { artifactService } from "../../services/artifactService";

interface ReassignArtifactDialogProps {
    artifact: Artifact;
    projectId: string;
    availablePhases: { code: PhaseCode; name: string }[];
    open: boolean;
    onClose: () => void;
    onReassigned: () => void;
}

export function ReassignArtifactDialog({
    artifact,
    projectId,
    availablePhases,
    open,
    onClose,
    onReassigned,
}: ReassignArtifactDialogProps) {
    const [selectedPhase, setSelectedPhase] = useState<PhaseCode | "">("");
    const [reason, setReason] = useState("");
    const [validationResult, setValidationResult] =
        useState<ReassignmentValidationResult | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isReassigning, setIsReassigning] = useState(false);
    const [showWarnings, setShowWarnings] = useState(false);
    const [forceReassignment, setForceReassignment] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filtrar fases disponibles (excluir la fase actual)
    const filteredPhases = availablePhases.filter(
        (phase) => phase.code !== artifact.phaseId
    );

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setSelectedPhase("");
            setReason("");
            setValidationResult(null);
            setShowWarnings(false);
            setForceReassignment(false);
            setError(null);
        }
    }, [open]);

    // Validar automáticamente cuando se selecciona una fase
    useEffect(() => {
        if (selectedPhase && selectedPhase !== artifact.phaseId) {
            validateReassignment();
        } else {
            setValidationResult(null);
            setShowWarnings(false);
        }
    }, [selectedPhase]);

    const validateReassignment = async () => {
        if (!selectedPhase) return;

        setIsValidating(true);
        setError(null);

        try {
            const input: ValidateReassignmentInput = {
                artifactId: artifact.id,
                toPhaseId: selectedPhase,
            };

            const result = await artifactService.validateReassignment(
                projectId,
                input
            );
            setValidationResult(result);

            if (result.violations.length > 0) {
                setShowWarnings(true);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al validar la reasignación"
            );
        } finally {
            setIsValidating(false);
        }
    };

    const handleReassign = async () => {
        if (!selectedPhase || !reason.trim()) {
            setError("Por favor complete todos los campos requeridos");
            return;
        }

        if (
            validationResult &&
            !validationResult.canProceed &&
            !forceReassignment
        ) {
            setError(
                "No se puede proceder con la reasignación debido a violaciones críticas"
            );
            return;
        }

        setIsReassigning(true);
        setError(null);

        try {
            const input: ReassignArtifactInput = {
                artifactId: artifact.id,
                toPhaseId: selectedPhase,
                reason: reason.trim(),
                forceReassignment: forceReassignment,
            };

            await artifactService.reassignArtifact(projectId, input);
            onReassigned();
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al reasignar el artefacto"
            );
        } finally {
            setIsReassigning(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { maxHeight: "90vh" },
            }}
        >
            <DialogTitle>Reasignar Artefacto</DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Información del artefacto */}
                    <Box
                        sx={{
                            bgcolor: "action.hover",
                            p: 2,
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            Artefacto a reasignar:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Título:</strong> {artifact.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Fase actual:</strong> {artifact.phaseId}
                        </Typography>
                        {artifact.artifactType && (
                            <Typography variant="body2" color="text.secondary">
                                <strong>Tipo:</strong>{" "}
                                {artifact.artifactType.name}
                            </Typography>
                        )}
                    </Box>

                    {/* Selector de fase destino */}
                    <Box>
                        <Typography variant="body2" gutterBottom>
                            Fase destino <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedPhase}
                            onChange={(e) =>
                                setSelectedPhase(e.target.value as PhaseCode)
                            }
                            disabled={isValidating || isReassigning}
                            size="small"
                        >
                            <MenuItem value="">Seleccione una fase</MenuItem>
                            {filteredPhases.map((phase) => (
                                <MenuItem key={phase.code} value={phase.code}>
                                    {phase.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* Validación en progreso */}
                    {isValidating && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                py: 2,
                            }}
                        >
                            <CircularProgress size={24} />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 2 }}
                            >
                                Validando reasignación...
                            </Typography>
                        </Box>
                    )}

                    {/* Resultados de validación */}
                    {validationResult && showWarnings && (
                        <Box
                            sx={{
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,
                                p: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Resultado de validación
                                </Typography>
                                {validationResult.isValid ? (
                                    <Typography
                                        variant="body2"
                                        color="success.main"
                                    >
                                        ✓ Válido
                                    </Typography>
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="error.main"
                                    >
                                        ✗ No válido
                                    </Typography>
                                )}
                            </Box>

                            {validationResult.violations.length > 0 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                    }}
                                >
                                    {validationResult.violations.map(
                                        (
                                            violation: ReassignmentViolation,
                                            index: number
                                        ) => (
                                            <Alert
                                                key={index}
                                                severity={
                                                    violation.severity ===
                                                    "ERROR"
                                                        ? "error"
                                                        : "warning"
                                                }
                                                icon={
                                                    violation.severity ===
                                                    "ERROR"
                                                        ? "❌"
                                                        : "⚠️"
                                                }
                                            >
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="medium"
                                                >
                                                    {violation.rule}
                                                </Typography>
                                                <Typography variant="caption">
                                                    {violation.message}
                                                </Typography>
                                            </Alert>
                                        )
                                    )}
                                </Box>
                            )}

                            {!validationResult.canProceed && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 1.5,
                                        bgcolor: "action.hover",
                                        borderRadius: 1,
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={forceReassignment}
                                                onChange={(e) =>
                                                    setForceReassignment(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        }
                                        label="Forzar reasignación (ignorar violaciones)"
                                    />
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Razón de la reasignación */}
                    <Box>
                        <Typography variant="body2" gutterBottom>
                            Razón de la reasignación{" "}
                            <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explique brevemente por qué se reasigna este artefacto..."
                            disabled={isReassigning}
                            helperText="Mínimo 10 caracteres"
                        />
                    </Box>

                    {/* Error message */}
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={isReassigning}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleReassign}
                    disabled={
                        !selectedPhase ||
                        !reason.trim() ||
                        reason.trim().length < 10 ||
                        isValidating ||
                        isReassigning ||
                        (validationResult !== null &&
                            !validationResult.canProceed &&
                            !forceReassignment)
                    }
                    variant="contained"
                    color="primary"
                >
                    {isReassigning ? "Reasignando..." : "Reasignar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
