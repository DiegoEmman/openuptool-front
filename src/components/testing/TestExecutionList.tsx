import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import {
    CheckCircle as PassedIcon,
    Cancel as FailedIcon,
    Block as BlockedIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import type {
    TestExecution,
    TestExecutionStatus,
    UpdateTestExecutionInput,
} from "../../types/testExecution";
import { testExecutionService } from "../../services/testExecutionService";

interface TestExecutionListProps {
    executions: TestExecution[];
    onUpdate: () => void;
}

export function TestExecutionList({
    executions,
    onUpdate,
}: TestExecutionListProps) {
    const [editDialog, setEditDialog] = useState(false);
    const [selectedExecution, setSelectedExecution] =
        useState<TestExecution | null>(null);
    const [editData, setEditData] = useState<UpdateTestExecutionInput>({});

    const getStatusColor = (status: TestExecutionStatus) => {
        switch (status) {
            case "Passed":
                return "success";
            case "Failed":
                return "error";
            case "Blocked":
                return "warning";
            case "Not Run":
                return "default";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status: TestExecutionStatus) => {
        switch (status) {
            case "Passed":
                return <PassedIcon color="success" />;
            case "Failed":
                return <FailedIcon color="error" />;
            case "Blocked":
                return <BlockedIcon color="warning" />;
            default:
                return null;
        }
    };

    const handleEdit = (execution: TestExecution) => {
        setSelectedExecution(execution);
        setEditData({
            status: execution.status,
            duration: execution.duration,
            notes: execution.notes,
            environment: execution.environment,
            buildVersion: execution.buildVersion,
        });
        setEditDialog(true);
    };

    const handleUpdate = async () => {
        if (!selectedExecution) return;

        try {
            await testExecutionService.update(selectedExecution.id, editData);
            setEditDialog(false);
            setSelectedExecution(null);
            onUpdate();
        } catch (error) {
            console.error("Error updating test execution:", error);
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "N/A";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <>
            <Stack spacing={2}>
                {executions.length === 0 && (
                    <Typography color="text.secondary" align="center">
                        No hay ejecuciones de pruebas registradas
                    </Typography>
                )}

                {executions.map((execution) => (
                    <Card key={execution.id}>
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                            >
                                <Box>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        mb={1}
                                    >
                                        {getStatusIcon(execution.status)}
                                        <Typography variant="h6">
                                            {execution.testCaseName}
                                        </Typography>
                                        <Chip
                                            label={execution.status}
                                            size="small"
                                            color={
                                                getStatusColor(
                                                    execution.status
                                                ) as any
                                            }
                                        />
                                    </Stack>

                                    <Stack direction="row" spacing={3} mt={2}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Ejecutado:{" "}
                                            {new Date(
                                                execution.executedAt
                                            ).toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Duración:{" "}
                                            {formatDuration(execution.duration)}
                                        </Typography>
                                        {execution.environment && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Ambiente:{" "}
                                                {execution.environment}
                                            </Typography>
                                        )}
                                        {execution.buildVersion && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Build: {execution.buildVersion}
                                            </Typography>
                                        )}
                                    </Stack>

                                    {execution.notes && (
                                        <Box
                                            mt={2}
                                            p={1}
                                            bgcolor="grey.100"
                                            borderRadius={1}
                                        >
                                            <Typography variant="caption">
                                                Notas:
                                            </Typography>
                                            <Typography variant="body2">
                                                {execution.notes}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Tooltip title="Editar">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEdit(execution)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Dialog
                open={editDialog}
                onClose={() => setEditDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Editar Ejecución de Prueba</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            select
                            label="Estado"
                            value={editData.status || "Not Run"}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    status: e.target
                                        .value as TestExecutionStatus,
                                })
                            }
                            SelectProps={{ native: true }}
                        >
                            <option value="Passed">Pasó</option>
                            <option value="Failed">Falló</option>
                            <option value="Blocked">Bloqueado</option>
                            <option value="Not Run">No Ejecutado</option>
                        </TextField>

                        <TextField
                            label="Duración (segundos)"
                            type="number"
                            value={editData.duration || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    duration:
                                        parseInt(e.target.value) || undefined,
                                })
                            }
                        />

                        <TextField
                            label="Ambiente"
                            value={editData.environment || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    environment: e.target.value,
                                })
                            }
                        />

                        <TextField
                            label="Versión de Build"
                            value={editData.buildVersion || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    buildVersion: e.target.value,
                                })
                            }
                        />

                        <TextField
                            label="Notas"
                            multiline
                            rows={4}
                            value={editData.notes || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    notes: e.target.value,
                                })
                            }
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleUpdate} variant="contained">
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
