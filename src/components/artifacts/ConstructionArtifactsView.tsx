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
    Stack,
    Link as MuiLink,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    Divider,
    Switch,
    FormControlLabel,
    Tooltip,
} from "@mui/material";
import {
    Description as DocIcon,
    Download as DownloadIcon,
    GitHub as GitHubIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    BugReport as BugIcon,
    Science as ScienceIcon,
    History as HistoryIcon,
} from "@mui/icons-material";
import { InlineArtifactEditor } from "./InlineArtifactEditor";
import { ArtifactVersionHistory } from "./ArtifactVersionHistory";
import { artifactService } from "../../services/artifactService";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
    artifacts: Artifact[];
    projectId: string;
    onUpdate?: () => void;
}

export function ConstructionArtifactsView({
    artifacts,
    projectId,
    onUpdate,
}: Props) {
    const [filter, setFilter] = useState<string>("ALL");
    const [expandedArtifact, setExpandedArtifact] = useState<string | null>(
        null
    );
    const [showLinkRepoDialog, setShowLinkRepoDialog] = useState(false);
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
        null
    );
    const [repoUrl, setRepoUrl] = useState("");
    const [repoVersion, setRepoVersion] = useState("");
    const [buildNumber, setBuildNumber] = useState("");

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

    const handleOpenLinkRepo = (artifact: Artifact) => {
        setSelectedArtifact(artifact);
        setRepoUrl(artifact.repositoryUrl || "");
        setRepoVersion(artifact.repositoryVersion || "");
        setBuildNumber(artifact.buildNumber || "");
        setShowLinkRepoDialog(true);
    };

    const handleLinkRepository = async () => {
        if (!selectedArtifact || !repoUrl.trim()) {
            alert("La URL del repositorio es obligatoria");
            return;
        }

        try {
            await artifactService.linkRepository(
                projectId,
                selectedArtifact.id,
                {
                    repositoryUrl: repoUrl.trim(),
                    repositoryVersion: repoVersion.trim() || undefined,
                    buildNumber: buildNumber.trim() || undefined,
                }
            );
            setShowLinkRepoDialog(false);
            onUpdate?.();
        } catch (error) {
            console.error("Error linking repository:", error);
            alert("Error al vincular el repositorio");
        }
    };

    return (
        <Box>
            <Box mb={2} display="flex" gap={2} alignItems="center">
                <Typography variant="subtitle1">
                    Artefactos de Construcción ({filtered.length})
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
                        <TableCell>Tipo</TableCell>
                        <TableCell>Obligatorio</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Repositorio/Archivos</TableCell>
                        <TableCell>Acciones</TableCell>
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
                                <TableCell>
                                    <Chip
                                        label={a.artifactType?.name || "N/A"}
                                        size="small"
                                        variant="outlined"
                                    />
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
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >
                                        {a.repositoryUrl && (
                                            <Button
                                                size="small"
                                                startIcon={<GitHubIcon />}
                                                href={a.repositoryUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Repo
                                            </Button>
                                        )}
                                        {a.fileName && (
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
                                        )}
                                        {!a.repositoryUrl && !a.fileName && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Sin archivos
                                            </Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        {canEdit && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<GitHubIcon />}
                                                onClick={() =>
                                                    handleOpenLinkRepo(a)
                                                }
                                            >
                                                Vincular Repo
                                            </Button>
                                        )}
                                        <InlineArtifactEditor artifact={a} />
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    colSpan={7}
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
                                                Detalles del Artefacto
                                            </Typography>

                                            {/* Información del repositorio */}
                                            {a.repositoryUrl && (
                                                <Box mb={2}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        gutterBottom
                                                    >
                                                        <GitHubIcon fontSize="small" />{" "}
                                                        Repositorio
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        <Typography variant="body2">
                                                            <strong>
                                                                URL:
                                                            </strong>{" "}
                                                            <MuiLink
                                                                href={
                                                                    a.repositoryUrl
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {
                                                                    a.repositoryUrl
                                                                }
                                                            </MuiLink>
                                                        </Typography>
                                                        {a.repositoryVersion && (
                                                            <Typography variant="body2">
                                                                <strong>
                                                                    Versión:
                                                                </strong>{" "}
                                                                {
                                                                    a.repositoryVersion
                                                                }
                                                            </Typography>
                                                        )}
                                                        {a.buildNumber && (
                                                            <Typography variant="body2">
                                                                <strong>
                                                                    Build:
                                                                </strong>{" "}
                                                                {a.buildNumber}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            )}

                                            {/* Casos de prueba (si existen) */}
                                            {a.testCases &&
                                                a.testCases.length > 0 && (
                                                    <Box mb={2}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            gutterBottom
                                                        >
                                                            <ScienceIcon fontSize="small" />{" "}
                                                            Casos de Prueba
                                                        </Typography>
                                                        <List dense>
                                                            {a.testCases.map(
                                                                (tc, idx) => (
                                                                    <ListItem
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        <ListItemText
                                                                            primary={
                                                                                tc.title
                                                                            }
                                                                            secondary={
                                                                                tc.description
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                )
                                                            )}
                                                        </List>
                                                    </Box>
                                                )}

                                            {/* Resultados de pruebas (si existen) */}
                                            {a.testResults &&
                                                a.testResults.length > 0 && (
                                                    <Box mb={2}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            gutterBottom
                                                        >
                                                            <BugIcon fontSize="small" />{" "}
                                                            Resultados de
                                                            Pruebas
                                                        </Typography>
                                                        <List dense>
                                                            {a.testResults.map(
                                                                (tr, idx) => (
                                                                    <ListItem
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        <ListItemText
                                                                            primary={`Resultado: ${tr.result}`}
                                                                            secondary={
                                                                                tr.notes
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                )
                                                            )}
                                                        </List>
                                                    </Box>
                                                )}

                                            {/* Actividades de iteración (si existen) */}
                                            {a.iterationActivities &&
                                                a.iterationActivities.length >
                                                    0 && (
                                                    <Box mb={2}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            gutterBottom
                                                        >
                                                            <HistoryIcon fontSize="small" />{" "}
                                                            Actividades de
                                                            Iteración
                                                        </Typography>
                                                        <List dense>
                                                            {a.iterationActivities.map(
                                                                (act, idx) => (
                                                                    <ListItem
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        <ListItemText
                                                                            primary={`${act.type}: ${act.description}`}
                                                                            secondary={`Participantes: ${act.participants?.join(", ") || "N/A"}`}
                                                                        />
                                                                    </ListItem>
                                                                )
                                                            )}
                                                        </List>
                                                    </Box>
                                                )}

                                            {/* Contenido de texto */}
                                            {a.contentText && (
                                                <Box mb={2}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        gutterBottom
                                                    >
                                                        <DocIcon fontSize="small" />{" "}
                                                        Contenido
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="pre"
                                                        sx={{
                                                            whiteSpace:
                                                                "pre-wrap",
                                                            bgcolor: "grey.100",
                                                            p: 2,
                                                            borderRadius: 1,
                                                        }}
                                                    >
                                                        {a.contentText}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Sistema de versiones */}
                                            <Divider sx={{ my: 2 }} />
                                            <ArtifactVersionHistory
                                                projectId={projectId}
                                                artifactId={a.id}
                                                artifactTitle={a.title}
                                            />
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                    {filtered.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                Sin artefactos
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Diálogo para vincular repositorio */}
            <Dialog
                open={showLinkRepoDialog}
                onClose={() => setShowLinkRepoDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Vincular Repositorio</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="URL del Repositorio"
                            fullWidth
                            required
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/usuario/repo"
                        />
                        <TextField
                            label="Versión/Tag/Branch"
                            fullWidth
                            value={repoVersion}
                            onChange={(e) => setRepoVersion(e.target.value)}
                            placeholder="v1.0.0, main, commit-hash"
                        />
                        <TextField
                            label="Número de Build"
                            fullWidth
                            value={buildNumber}
                            onChange={(e) => setBuildNumber(e.target.value)}
                            placeholder="123, 2024-12-01-001"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowLinkRepoDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleLinkRepository}
                        disabled={!repoUrl.trim()}
                    >
                        Vincular
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
