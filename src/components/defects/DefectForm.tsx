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
    CreateDefectInput,
    DefectSeverity,
    DefectPriority,
} from "../../types/defect";
import { defectService } from "../../services/defectService";

interface DefectFormProps {
    projectId: string;
    artifactId?: string;
    testExecutionId?: string;
    onCreated: () => void;
    onCancel: () => void;
}

export function DefectForm({
    projectId,
    artifactId,
    testExecutionId,
    onCreated,
    onCancel,
}: DefectFormProps) {
    const [formData, setFormData] = useState<Partial<CreateDefectInput>>({
        projectId,
        artifactId,
        testExecutionId,
        title: "",
        description: "",
        severity: "Medium",
        priority: "Medium",
        type: "Functional", // Default type
        environment: "",
        stepsToReproduce: "",
        expectedResult: "",
        actualResult: "",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get userId from localStorage or auth context
            const userId = localStorage.getItem("userId") || "";

            await defectService.create({
                ...formData,
                reportedBy: userId,
            } as CreateDefectInput);
            onCreated();
        } catch (error) {
            console.error("Error creating defect:", error);
            alert("Error al crear el defecto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2}>
                Reportar Nuevo Defecto
            </Typography>

            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Título"
                        required
                        fullWidth
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />

                    <TextField
                        label="Descripción"
                        required
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                    />

                    <Stack direction="row" spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel>Severidad</InputLabel>
                            <Select
                                value={formData.severity}
                                label="Severidad"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        severity: e.target
                                            .value as DefectSeverity,
                                    })
                                }
                            >
                                <MenuItem value="Critical">Crítica</MenuItem>
                                <MenuItem value="High">Alta</MenuItem>
                                <MenuItem value="Medium">Media</MenuItem>
                                <MenuItem value="Low">Baja</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Prioridad</InputLabel>
                            <Select
                                value={formData.priority}
                                label="Prioridad"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        priority: e.target
                                            .value as DefectPriority,
                                    })
                                }
                            >
                                <MenuItem value="Urgent">Urgente</MenuItem>
                                <MenuItem value="High">Alta</MenuItem>
                                <MenuItem value="Medium">Media</MenuItem>
                                <MenuItem value="Low">Baja</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

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
                        placeholder="ej: Windows 11, Chrome 120"
                    />

                    <TextField
                        label="Pasos para Reproducir"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.stepsToReproduce}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                stepsToReproduce: e.target.value,
                            })
                        }
                    />

                    <FormControl fullWidth>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            value={formData.type}
                            label="Tipo"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    type: e.target.value,
                                })
                            }
                        >
                            <MenuItem value="Functional">Funcional</MenuItem>
                            <MenuItem value="Performance">Rendimiento</MenuItem>
                            <MenuItem value="Security">Seguridad</MenuItem>
                            <MenuItem value="UI">Interfaz</MenuItem>
                            <MenuItem value="Usability">Usabilidad</MenuItem>
                            <MenuItem value="Compatibility">
                                Compatibilidad
                            </MenuItem>
                            <MenuItem value="Other">Otro</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Resultado Esperado"
                        fullWidth
                        multiline
                        rows={2}
                        value={formData.expectedResult}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                expectedResult: e.target.value,
                            })
                        }
                    />

                    <TextField
                        label="Resultado Actual"
                        fullWidth
                        multiline
                        rows={2}
                        value={formData.actualResult}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                actualResult: e.target.value,
                            })
                        }
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
                                !formData.title ||
                                !formData.description
                            }
                        >
                            Reportar Defecto
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Paper>
    );
}
