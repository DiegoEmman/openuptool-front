import React, { useState } from "react";
import type { Artifact, PhaseCode } from "../../types/artifact";
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
    Stack,
    Link as MuiLink,
    Switch,
    FormControlLabel,
    Tooltip,
    Tabs,
    Tab,
} from "@mui/material";
import {
    Description as DocIcon,
    Image as ImageIcon,
    Code as CodeIcon,
    Download as DownloadIcon,
    Folder as FolderIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    SwapHoriz as ReassignIcon,
} from "@mui/icons-material";
import { InlineArtifactEditor } from "./InlineArtifactEditor";
import { ArtifactVersionHistory } from "./ArtifactVersionHistory";
import { ArtifactWorkflowPanel } from "./ArtifactWorkflowPanel";
import { ReassignArtifactDialog } from "./ReassignArtifactDialog";
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
    const [expandedTab, setExpandedTab] = useState<number>(0);
    const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
        null
    );
    const { hasRole } = useAuth();
    const canEdit = hasRole(["Admin", "Manager", "Developer"]);

    // Fases disponibles para reasignación
    const availablePhases: { code: PhaseCode; name: string }[] = [
        { code: "INCEPTION", name: "Inception" },
        { code: "ELABORATION", name: "Elaboration" },
        { code: "CONSTRUCTION", name: "Construction" },
        { code: "TRANSITION", name: "Transition" },
    ];

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

    const handleMandatoryChange = async (
        artifactId: string,
        isMandatory: boolean
    ) => {
        try {
            await artifactService.updateArtifact(projectId, artifactId, {
                isMandatory,
            });
            onUpdate?.();
        } catch (error) {
            console.error("Error updating mandatory status:", error);
            alert("Error al actualizar el estado obligatorio/opcional");
        }
    };

    const handleOpenReassignDialog = (artifact: Artifact) => {
        setSelectedArtifact(artifact);
        setReassignDialogOpen(true);
    };

    const handleCloseReassignDialog = () => {
        setReassignDialogOpen(false);
        setSelectedArtifact(null);
    };

    const handleReassigned = () => {
        onUpdate?.();
    };

    const handleDownload = async (artifactId: string, fileName: string) => {
        try {
            const blob = await artifactService.downloadFile(
                projectId,
                artifactId
            );
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Error al descargar el archivo");
        }
    };

    const getCategoryIcon = (category?: string) => {
        switch (category) {
            case "DIAGRAM":
                return <ImageIcon fontSize="small" />;
            case "PROTOTYPE":
                return <CodeIcon fontSize="small" />;
            case "DOCUMENT":
                return <DocIcon fontSize="small" />;
            default:
                return <FolderIcon fontSize="small" />;
        }
    };

    const getCategoryLabel = (category?: string) => {
        switch (category) {
            case "DIAGRAM":
                return "Diagrama";
            case "PROTOTYPE":
                return "Prototipo";
            case "DOCUMENT":
                return "Documento";
            default:
                return "Archivo";
        }
    };

    return (
        <Box>
            <Box mb={2} display="flex" gap={2} alignItems="center">
                <Typography variant="subtitle1">
                    Artefactos ({filtered.length})
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
                        <TableCell>Archivos</TableCell>
                        <TableCell>Contenido</TableCell>
                        {canEdit && <TableCell>Acciones</TableCell>}
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
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight="medium"
                                    >
                                        {a.title}
                                    </Typography>
                                    {a.description && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {a.description}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>{a.author || "-"}</TableCell>
                                <TableCell>
                                    {canEdit ? (
                                        <Tooltip title="Marcar como obligatorio u opcional">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={a.isMandatory}
                                                        onChange={(e) =>
                                                            handleMandatoryChange(
                                                                a.id,
                                                                e.target.checked
                                                            )
                                                        }
                                                        color="error"
                                                        size="small"
                                                    />
                                                }
                                                label={
                                                    a.isMandatory
                                                        ? "Obligatorio"
                                                        : "Opcional"
                                                }
                                            />
                                        </Tooltip>
                                    ) : a.isMandatory ? (
                                        <Chip
                                            icon={<CheckIcon />}
                                            label="Obligatorio"
                                            color="error"
                                            size="small"
                                        />
                                    ) : (
                                        <Chip
                                            icon={<CancelIcon />}
                                            label="Opcional"
                                            size="small"
                                        />
                                    )}
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
                                    {a.fileName ? (
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <Chip
                                                icon={getCategoryIcon(
                                                    a.fileCategory
                                                )}
                                                label={getCategoryLabel(
                                                    a.fileCategory
                                                )}
                                                size="small"
                                                variant="outlined"
                                            />
                                            <Button
                                                size="small"
                                                startIcon={<DownloadIcon />}
                                                onClick={() =>
                                                    handleDownload(
                                                        a.id,
                                                        a.fileName!
                                                    )
                                                }
                                            >
                                                {a.fileName}
                                            </Button>
                                        </Stack>
                                    ) : a.repositoryUrl ? (
                                        <MuiLink
                                            href={a.repositoryUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ver repositorio
                                        </MuiLink>
                                    ) : (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Sin archivo
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <InlineArtifactEditor artifact={a} />
                                </TableCell>
                                {canEdit && (
                                    <TableCell>
                                        <Tooltip title="Reasignar artefacto a otra fase">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<ReassignIcon />}
                                                onClick={() =>
                                                    handleOpenReassignDialog(a)
                                                }
                                            >
                                                Reasignar
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    colSpan={canEdit ? 8 : 7}
                                    style={{ paddingBottom: 0, paddingTop: 0 }}
                                >
                                    <Collapse
                                        in={expandedArtifact === a.id}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <Box sx={{ margin: 2 }}>
                                            <Tabs
                                                value={expandedTab}
                                                onChange={(_, v) =>
                                                    setExpandedTab(v)
                                                }
                                                sx={{
                                                    borderBottom: 1,
                                                    borderColor: "divider",
                                                    mb: 2,
                                                }}
                                            >
                                                <Tab label="Versiones" />
                                                <Tab label="Workflow" />
                                            </Tabs>

                                            {expandedTab === 0 && (
                                                <ArtifactVersionHistory
                                                    projectId={projectId}
                                                    artifactId={a.id}
                                                    artifactTitle={a.title}
                                                />
                                            )}

                                            {expandedTab === 1 && (
                                                <ArtifactWorkflowPanel
                                                    artifactId={a.id}
                                                    artifactName={a.title}
                                                    projectId={projectId}
                                                    onUpdate={onUpdate}
                                                />
                                            )}
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                    {filtered.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={canEdit ? 8 : 7} align="center">
                                Sin artefactos
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Diálogo de reasignación */}
            {selectedArtifact && (
                <ReassignArtifactDialog
                    artifact={selectedArtifact}
                    projectId={projectId}
                    availablePhases={availablePhases}
                    open={reassignDialogOpen}
                    onClose={handleCloseReassignDialog}
                    onReassigned={handleReassigned}
                />
            )}
        </Box>
    );
}
