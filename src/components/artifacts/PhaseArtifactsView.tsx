import React, { useState } from "react";
import type { Artifact } from "../../types/artifact";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Select,
    MenuItem,
    Box,
    Typography,
    Button,
    Collapse,
    IconButton,
} from "@mui/material";
import { InlineArtifactEditor } from "./InlineArtifactEditor";
import { ArtifactFileUpload } from "./ArtifactFileUpload";
import { VersionHistory } from "./VersionHistory";
import { artifactService } from "../../services/artifactService";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
    artifacts: Artifact[];
    projectId: string;
    onUpdate?: () => void;
}
export function PhaseArtifactsView({ artifacts, projectId, onUpdate }: Props) {
    const [filter, setFilter] = useState<string>("ALL");
    const [expandedArtifact, setExpandedArtifact] = useState<string | null>(
        null
    );
    const { hasRole } = useAuth();
    const canEdit = hasRole(["Admin", "Manager", "Developer"]);

    const filtered = artifacts.filter(
        (a) => filter === "ALL" || a.status === filter
    );

    const handleStatusChange = async (
        artifactId: string,
        newStatus: string
    ) => {
        try {
            await artifactService.updateArtifact(projectId, artifactId, {
                status: newStatus as "Pendiente" | "En revisión" | "Aprobado",
            });
            onUpdate?.();
        } catch (error) {
            console.error("Error updating artifact status:", error);
        }
    };

    return (
        <Box>
            <Box mb={1} display="flex" gap={2} alignItems="center">
                <Typography variant="subtitle1">
                    Artefactos Incepción
                </Typography>
                <Select
                    size="small"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                    <MenuItem value="En revisión">En revisión</MenuItem>
                    <MenuItem value="Aprobado">Aprobado</MenuItem>
                </Select>
            </Box>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width="30px"></TableCell>
                        <TableCell>Título</TableCell>
                        <TableCell>Autor</TableCell>
                        <TableCell>Obligatorio</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Contenido</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filtered.map((a) => (
                        <React.Fragment key={a.id}>
                            <TableRow>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setExpandedArtifact(
                                                expandedArtifact === a.id
                                                    ? null
                                                    : a.id
                                            )
                                        }
                                    >
                                        {expandedArtifact === a.id ? "▼" : "▶"}
                                    </IconButton>
                                </TableCell>
                                <TableCell>{a.title}</TableCell>
                                <TableCell>{a.author || "-"}</TableCell>
                                <TableCell>
                                    {a.isMandatory ? "Sí" : "No"}
                                </TableCell>
                                <TableCell>
                                    {canEdit ? (
                                        <Select
                                            size="small"
                                            value={a.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    a.id,
                                                    e.target.value
                                                )
                                            }
                                            sx={{ minWidth: 120 }}
                                        >
                                            <MenuItem value="Pendiente">
                                                Pendiente
                                            </MenuItem>
                                            <MenuItem value="En revisión">
                                                En revisión
                                            </MenuItem>
                                            <MenuItem value="Aprobado">
                                                Aprobado
                                            </MenuItem>
                                        </Select>
                                    ) : (
                                        <Chip
                                            label={a.status}
                                            color={
                                                a.status === "Aprobado"
                                                    ? "success"
                                                    : a.status === "En revisión"
                                                      ? "warning"
                                                      : "default"
                                            }
                                            size="small"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <InlineArtifactEditor artifact={a} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    style={{ paddingBottom: 0, paddingTop: 0 }}
                                >
                                    <Collapse
                                        in={expandedArtifact === a.id}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <Box sx={{ margin: 2 }}>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                            >
                                                📎 Versiones del Artefacto
                                            </Typography>
                                            {canEdit && (
                                                <ArtifactFileUpload
                                                    projectId={projectId}
                                                    artifactId={a.id}
                                                    onUploadSuccess={onUpdate}
                                                />
                                            )}
                                            <VersionHistory
                                                projectId={projectId}
                                                artifactId={a.id}
                                            />
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                    {filtered.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                Sin artefactos
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );
}
