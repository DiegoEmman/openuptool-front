import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Alert,
    Divider,
} from "@mui/material";
import {
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Warning as WarningIcon,
    Description as DocIcon,
} from "@mui/icons-material";

interface MissingArtifact {
    artifactId: string;
    title: string;
    artifactType: string;
    status: string;
    hasVersions: boolean;
}

interface ValidationResult {
    canAdvance: boolean;
    phase: string;
    totalMandatoryArtifacts: number;
    completedMandatoryArtifacts: number;
    missingArtifacts: MissingArtifact[];
    message?: string;
}

interface PhaseValidationDialogProps {
    open: boolean;
    onClose: () => void;
    phaseName: string;
    result: ValidationResult | null;
}

export function PhaseValidationDialog({
    open,
    onClose,
    phaseName,
    result,
}: PhaseValidationDialogProps) {
    if (!result) return null;

    const missingCount = result.missingArtifacts?.length || 0;
    const completedPercentage =
        result.totalMandatoryArtifacts > 0
            ? Math.round(
                  (result.completedMandatoryArtifacts /
                      result.totalMandatoryArtifacts) *
                      100
              )
            : 100;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Validación de Fase: {phaseName}
                <Typography variant="body2" color="text.secondary">
                    Verificación de artefactos obligatorios
                </Typography>
            </DialogTitle>
            <DialogContent>
                {result.canAdvance ? (
                    <Alert
                        severity="success"
                        icon={<CheckIcon />}
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            ✅ La fase está completa
                        </Typography>
                        <Typography variant="body2">
                            Todos los artefactos obligatorios han sido
                            entregados. Puedes avanzar a la siguiente fase.
                        </Typography>
                    </Alert>
                ) : (
                    <Alert
                        severity="error"
                        icon={<WarningIcon />}
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            ⚠️ Fase incompleta
                        </Typography>
                        <Typography variant="body2">
                            Faltan {missingCount} artefacto
                            {missingCount !== 1 ? "s" : ""} obligatorio
                            {missingCount !== 1 ? "s" : ""} por entregar antes
                            de poder avanzar.
                        </Typography>
                    </Alert>
                )}

                {/* Estadísticas */}
                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Resumen de Artefactos
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 2,
                            my: 2,
                        }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "success.50",
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: "success.200",
                            }}
                        >
                            <Typography variant="h4" color="success.main">
                                {result.completedMandatoryArtifacts}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Completados
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                bgcolor:
                                    missingCount > 0 ? "error.50" : "grey.100",
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor:
                                    missingCount > 0 ? "error.200" : "grey.300",
                            }}
                        >
                            <Typography
                                variant="h4"
                                color={
                                    missingCount > 0
                                        ? "error.main"
                                        : "text.secondary"
                                }
                            >
                                {missingCount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Faltantes
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Progreso:
                        </Typography>
                        <Chip
                            label={`${completedPercentage}%`}
                            color={
                                completedPercentage === 100
                                    ? "success"
                                    : "warning"
                            }
                            size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                            ({result.completedMandatoryArtifacts} de{" "}
                            {result.totalMandatoryArtifacts} obligatorios)
                        </Typography>
                    </Box>
                </Box>

                {/* Lista de artefactos faltantes */}
                {missingCount > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                            Artefactos Obligatorios Faltantes
                        </Typography>
                        <List dense>
                            {result.missingArtifacts.map((artifact) => (
                                <ListItem key={artifact.artifactId}>
                                    <ListItemIcon>
                                        <CancelIcon color="error" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={artifact.title}
                                        secondary={`${artifact.artifactType} - ${artifact.status}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}

                {/* Nota informativa */}
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: "info.50",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "info.200",
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        <DocIcon
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 0.5 }}
                        />
                        Los artefactos deben tener al menos una versión
                        entregada para ser considerados completos.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
