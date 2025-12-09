import { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    Alert,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    HourglassEmpty as HourglassIcon,
    Edit as EditIcon,
    Check as CheckIcon,
} from "@mui/icons-material";
import type {
    ProjectClosure,
    ClosureValidation,
    ApproveClosureInput,
} from "../../types/transition";
import { projectClosureService } from "../../services/transitionService";

interface ProjectClosureViewProps {
    projectId: string;
    closure?: ProjectClosure;
    onEdit: () => void;
    onRefresh: () => void;
}

export function ProjectClosureView({
    projectId,
    closure,
    onEdit,
    onRefresh,
}: ProjectClosureViewProps) {
    const [validation, setValidation] = useState<ClosureValidation | null>(
        null
    );
    const [loadingValidation, setLoadingValidation] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [approvingClosure, setApprovingClosure] = useState(false);

    useEffect(() => {
        if (!closure) {
            loadValidation();
        }
    }, [projectId, closure]);

    const loadValidation = async () => {
        setLoadingValidation(true);
        try {
            const result = await projectClosureService.validate(projectId);
            setValidation(result);
        } catch (error) {
            console.error("Error loading validation:", error);
        } finally {
            setLoadingValidation(false);
        }
    };

    const handleApprove = async (approve: boolean) => {
        if (!closure) return;

        setApprovingClosure(true);
        try {
            const input: ApproveClosureInput = {
                approve,
                rejectionReason: approve ? undefined : rejectionReason,
            };
            await projectClosureService.approve(closure.id, input);
            setApproveDialogOpen(false);
            setRejectionReason("");
            onRefresh();
        } catch (error) {
            console.error("Error approving closure:", error);
        } finally {
            setApprovingClosure(false);
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusChip = (status?: string) => {
        const statusMap = {
            Draft: {
                label: "Borrador",
                color: "default" as const,
                icon: <HourglassIcon />,
            },
            PendingApproval: {
                label: "Pendiente",
                color: "warning" as const,
                icon: <HourglassIcon />,
            },
            Approved: {
                label: "Aprobado",
                color: "success" as const,
                icon: <CheckCircleIcon />,
            },
            Rejected: {
                label: "Rechazado",
                color: "error" as const,
                icon: <CancelIcon />,
            },
        };

        const config =
            statusMap[status as keyof typeof statusMap] || statusMap.Draft;
        return (
            <Chip
                icon={config.icon}
                label={config.label}
                color={config.color}
                sx={{ fontWeight: "bold" }}
            />
        );
    };

    if (!closure) {
        return (
            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Cierre de Proyecto
                    </Typography>

                    {loadingValidation ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                py: 4,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : validation ? (
                        <>
                            {validation.canClose ? (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    ✓ El proyecto está listo para cerrar
                                </Alert>
                            ) : (
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                    >
                                        Criterios obligatorios pendientes:
                                    </Typography>
                                    <ul
                                        style={{
                                            marginTop: 8,
                                            marginBottom: 0,
                                        }}
                                    >
                                        {validation.missingMandatoryCriteria.map(
                                            (err, i) => (
                                                <li key={i}>{err}</li>
                                            )
                                        )}
                                    </ul>
                                </Alert>
                            )}

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Estado de Validación:
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Paper
                                            variant="outlined"
                                            sx={{ p: 2, textAlign: "center" }}
                                        >
                                            <Typography variant="h4">
                                                {validation.completedMandatory}/
                                                {validation.totalMandatory}
                                            </Typography>
                                            <Typography variant="caption">
                                                Criterios Obligatorios
                                                Completados
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Paper
                                            variant="outlined"
                                            sx={{ p: 2, textAlign: "center" }}
                                        >
                                            <Typography variant="h4">
                                                {
                                                    validation.checklistPreview
                                                        .length
                                                }
                                            </Typography>
                                            <Typography variant="caption">
                                                Total de Criterios
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ mt: 3, textAlign: "center" }}>
                                <Button variant="contained" onClick={onEdit}>
                                    Iniciar Cierre de Proyecto
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography color="textSecondary">
                            No se pudo cargar la validación
                        </Typography>
                    )}
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="h6">Cierre de Proyecto</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {getStatusChip(closure.status)}
                        {closure.status !== "Approved" && (
                            <Button
                                startIcon={<EditIcon />}
                                onClick={onEdit}
                                size="small"
                            >
                                Editar
                            </Button>
                        )}
                        {closure.status === "PendingApproval" && (
                            <Button
                                startIcon={<CheckIcon />}
                                variant="contained"
                                onClick={() => setApproveDialogOpen(true)}
                                size="small"
                                color="success"
                            >
                                Aprobar
                            </Button>
                        )}
                    </Box>
                </Box>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Fecha de Cierre
                        </Typography>
                        <Typography variant="body1">
                            {formatDate(closure.closureDate)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Cerrado Por
                        </Typography>
                        <Typography variant="body1">
                            {closure.closedBy || "N/A"}
                        </Typography>
                    </Grid>
                </Grid>

                {closure.summary && (
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Resumen
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="body2">
                                {closure.summary}
                            </Typography>
                        </Paper>
                    </Box>
                )}

                {closure.lessonsLearned && (
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Lecciones Aprendidas
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography
                                variant="body2"
                                sx={{ whiteSpace: "pre-wrap" }}
                            >
                                {closure.lessonsLearned}
                            </Typography>
                        </Paper>
                    </Box>
                )}

                {closure.recommendations && (
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Recomendaciones
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography
                                variant="body2"
                                sx={{ whiteSpace: "pre-wrap" }}
                            >
                                {closure.recommendations}
                            </Typography>
                        </Paper>
                    </Box>
                )}

                {closure.checklist && closure.checklist.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Criterios de Cierre (
                            {closure.completedMandatoryCriteria}/
                            {closure.mandatoryCriteria} obligatorios)
                        </Typography>
                        <Paper variant="outlined">
                            <List>
                                {closure.checklist.map((criterion, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            bgcolor: criterion.isCompleted
                                                ? "success.light"
                                                : "inherit",
                                        }}
                                    >
                                        <ListItemIcon>
                                            {criterion.isCompleted ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <CancelIcon color="error" />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <>
                                                    {criterion.name}
                                                    {criterion.isMandatory && (
                                                        <Chip
                                                            label="Obligatorio"
                                                            size="small"
                                                            color="error"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </>
                                            }
                                            secondary={criterion.notes}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Box>
                )}

                {closure.status === "Approved" && (
                    <Alert severity="success">
                        <Typography variant="subtitle2" fontWeight="bold">
                            Aprobado por {closure.approvedBy || "N/A"}
                        </Typography>
                        <Typography variant="caption">
                            {formatDate(closure.approvedAt)}
                        </Typography>
                    </Alert>
                )}

                {closure.status === "Rejected" && closure.rejectionReason && (
                    <Alert severity="error">
                        <Typography variant="subtitle2" fontWeight="bold">
                            Rechazado
                        </Typography>
                        <Typography variant="body2">
                            {closure.rejectionReason}
                        </Typography>
                    </Alert>
                )}
            </Paper>

            <Dialog
                open={approveDialogOpen}
                onClose={() => setApproveDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Aprobar o Rechazar Cierre</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Razón de Rechazo (opcional)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{ mt: 2 }}
                        helperText="Solo si vas a rechazar"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setApproveDialogOpen(false)}
                        disabled={approvingClosure}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => handleApprove(false)}
                        color="error"
                        disabled={approvingClosure || !rejectionReason}
                    >
                        Rechazar
                    </Button>
                    <Button
                        onClick={() => handleApprove(true)}
                        variant="contained"
                        color="success"
                        disabled={approvingClosure}
                    >
                        {approvingClosure ? "Procesando..." : "Aprobar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
