import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    BugReport as BugIcon,
    Edit as EditIcon,
    CheckCircle as ResolveIcon,
    Cancel as CloseIcon,
    Refresh as ReopenIcon,
} from "@mui/icons-material";
import type { Defect } from "../../types/defect";
import { defectService } from "../../services/defectService";

interface DefectListProps {
    defects: Defect[];
    onUpdate: () => void;
}

export function DefectList({ defects, onUpdate }: DefectListProps) {
    const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
    const [resolveDialog, setResolveDialog] = useState(false);
    const [resolution, setResolution] = useState("");

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "Critical":
                return "error";
            case "High":
                return "warning";
            case "Medium":
                return "info";
            case "Low":
                return "success";
            default:
                return "default";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open":
                return "error";
            case "In Progress":
                return "warning";
            case "Resolved":
                return "success";
            case "Closed":
                return "default";
            case "Reopened":
                return "error";
            default:
                return "default";
        }
    };

    const handleResolve = async () => {
        if (!selectedDefect) return;
        try {
            await defectService.resolve(selectedDefect.id, resolution);
            setResolveDialog(false);
            setResolution("");
            setSelectedDefect(null);
            onUpdate();
        } catch (error) {
            console.error("Error resolving defect:", error);
        }
    };

    const handleClose = async (defectId: string) => {
        try {
            await defectService.close(defectId);
            onUpdate();
        } catch (error) {
            console.error("Error closing defect:", error);
        }
    };

    const handleReopen = async (defectId: string) => {
        try {
            await defectService.reopen(defectId);
            onUpdate();
        } catch (error) {
            console.error("Error reopening defect:", error);
        }
    };

    return (
        <>
            <Stack spacing={2}>
                {defects.length === 0 && (
                    <Typography color="text.secondary" align="center">
                        No hay defectos registrados
                    </Typography>
                )}

                {defects.map((defect) => (
                    <Card key={defect.id}>
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                mb={2}
                            >
                                <Box>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        mb={1}
                                    >
                                        <BugIcon fontSize="small" />
                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                        >
                                            {defect.defectNumber}
                                        </Typography>
                                        <Chip
                                            label={defect.severity}
                                            size="small"
                                            color={
                                                getSeverityColor(
                                                    defect.severity
                                                ) as any
                                            }
                                        />
                                        <Chip
                                            label={defect.status}
                                            size="small"
                                            color={
                                                getStatusColor(
                                                    defect.status
                                                ) as any
                                            }
                                            variant="outlined"
                                        />
                                    </Stack>
                                    <Typography variant="h6">
                                        {defect.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        mt={1}
                                    >
                                        {defect.description}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={1}>
                                    {defect.status === "Open" ||
                                    defect.status === "In Progress" ? (
                                        <Tooltip title="Resolver">
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => {
                                                    setSelectedDefect(defect);
                                                    setResolveDialog(true);
                                                }}
                                            >
                                                <ResolveIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}

                                    {defect.status === "Resolved" ? (
                                        <Tooltip title="Cerrar">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleClose(defect.id)
                                                }
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}

                                    {defect.status === "Closed" ||
                                    defect.status === "Resolved" ? (
                                        <Tooltip title="Reabrir">
                                            <IconButton
                                                size="small"
                                                color="warning"
                                                onClick={() =>
                                                    handleReopen(defect.id)
                                                }
                                            >
                                                <ReopenIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}
                                </Stack>
                            </Stack>

                            <Stack direction="row" spacing={2} mt={2}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Reportado:{" "}
                                    {new Date(
                                        defect.reportedAt
                                    ).toLocaleDateString()}
                                </Typography>
                                {defect.assignedTo && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Asignado a: {defect.assignedTo}
                                    </Typography>
                                )}
                                {defect.priority && (
                                    <Chip
                                        label={`Prioridad: ${defect.priority}`}
                                        size="small"
                                    />
                                )}
                            </Stack>

                            {defect.resolution && (
                                <Box
                                    mt={2}
                                    p={1}
                                    bgcolor="success.light"
                                    borderRadius={1}
                                >
                                    <Typography
                                        variant="caption"
                                        fontWeight="bold"
                                    >
                                        Resolución:
                                    </Typography>
                                    <Typography variant="body2">
                                        {defect.resolution}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Dialog
                open={resolveDialog}
                onClose={() => setResolveDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Resolver Defecto</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Resolución"
                        multiline
                        rows={4}
                        fullWidth
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Describe cómo se resolvió el defecto..."
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResolveDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleResolve}
                        variant="contained"
                        color="success"
                        disabled={!resolution.trim()}
                    >
                        Resolver
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
