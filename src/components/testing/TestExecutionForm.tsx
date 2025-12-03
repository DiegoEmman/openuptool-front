import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Typography,
    Paper,
} from "@mui/material";
import type {
    CreateTestExecutionInput,
    TestExecutionStatus,
} from "../../types/testExecution";
import { testExecutionService } from "../../services/testExecutionService";

interface TestExecutionFormProps {
    artifactId: string;
    onCreated: () => void;
    onCancel: () => void;
}

export function TestExecutionForm({
    artifactId,
    onCreated,
    onCancel,
}: TestExecutionFormProps) {
    const [formData, setFormData] = useState<Partial<CreateTestExecutionInput>>(
        {
            artifactId,
            testCaseId: "",
            testCaseName: "",
            status: "Not Run",
            duration: undefined,
            notes: "",
            environment: "",
            buildVersion: "",
        }
    );

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await testExecutionService.create(
                formData as CreateTestExecutionInput
            );
            onCreated();
        } catch (error) {
            console.error("Error creating test execution:", error);
            alert("Error al registrar la ejecución de prueba");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2}>
                Registrar Ejecución de Prueba
            </Typography>

            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="ID del Caso de Prueba"
                        required
                        fullWidth
                        value={formData.testCaseId}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                testCaseId: e.target.value,
                            })
                        }
                        placeholder="ej: TC-001"
                    />

                    <TextField
                        label="Nombre del Caso de Prueba"
                        required
                        fullWidth
                        value={formData.testCaseName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                testCaseName: e.target.value,
                            })
                        }
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={formData.status}
                            label="Estado"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target
                                        .value as TestExecutionStatus,
                                })
                            }
                        >
                            <MenuItem value="Passed">Pasó</MenuItem>
                            <MenuItem value="Failed">Falló</MenuItem>
                            <MenuItem value="Blocked">Bloqueado</MenuItem>
                            <MenuItem value="Not Run">No Ejecutado</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Duración (segundos)"
                        type="number"
                        fullWidth
                        value={formData.duration || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                duration: e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined,
                            })
                        }
                    />

                    <TextField
                        label="Ambiente"
                        fullWidth
                        value={formData.environment}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                environment: e.target.value,
                            })
                        }
                        placeholder="ej: QA, Production"
                    />

                    <TextField
                        label="Versión de Build"
                        fullWidth
                        value={formData.buildVersion}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                buildVersion: e.target.value,
                            })
                        }
                        placeholder="ej: 1.0.5"
                    />

                    <TextField
                        label="Notas"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.notes}
                        onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="Observaciones sobre la ejecución..."
                    />

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >
                        <Button onClick={onCancel} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                loading ||
                                !formData.testCaseId ||
                                !formData.testCaseName
                            }
                        >
                            Registrar Ejecución
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Paper>
    );
}
