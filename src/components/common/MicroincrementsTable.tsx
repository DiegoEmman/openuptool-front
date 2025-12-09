import React, { useState } from "react";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Chip,
    Box,
    Typography,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
    Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import LinkIcon from "@mui/icons-material/Link";
import type {
    Microincrement,
    MicroincrementFilters,
} from "../../types/microincrement";
import type { Iteration, Artifact } from "../../types";

interface MicroincrementsTableProps {
    microincrements: Microincrement[];
    iterations: Iteration[];
    artifacts: Artifact[];
    onEdit?: (microincrement: Microincrement) => void;
    onDelete?: (id: string) => void;
    onFilterChange?: (filters: MicroincrementFilters) => void;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function getTypeColor(type: string): "default" | "primary" | "secondary" {
    return type === "tecnico" ? "primary" : "secondary";
}

export function MicroincrementsTable({
    microincrements,
    iterations,
    artifacts,
    onEdit,
    onDelete,
    onFilterChange,
}: MicroincrementsTableProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [filterIterationId, setFilterIterationId] = useState("");
    const [filterArtifactId, setFilterArtifactId] = useState("");
    const [filterAuthor, setFilterAuthor] = useState("");
    const [filterType, setFilterType] = useState<"" | "tecnico" | "funcional">(
        ""
    );

    const handleApplyFilters = () => {
        const filters: MicroincrementFilters = {};
        if (filterIterationId) filters.iterationId = filterIterationId;
        if (filterArtifactId) filters.artifactId = filterArtifactId;
        if (filterAuthor) filters.author = filterAuthor;
        if (filterType) filters.type = filterType;
        onFilterChange?.(filters);
    };

    const handleClearFilters = () => {
        setFilterIterationId("");
        setFilterArtifactId("");
        setFilterAuthor("");
        setFilterType("");
        onFilterChange?.({});
    };

    return (
        <Paper>
            <Box p={2}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h6">
                        Microincrementos ({microincrements.length})
                    </Typography>
                    <Button
                        startIcon={<FilterListIcon />}
                        onClick={() => setShowFilters(!showFilters)}
                        variant={showFilters ? "contained" : "outlined"}
                        size="small"
                    >
                        Filtros
                    </Button>
                </Stack>

                {showFilters && (
                    <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Iteración</InputLabel>
                            <Select
                                value={filterIterationId}
                                label="Iteración"
                                onChange={(e) =>
                                    setFilterIterationId(e.target.value)
                                }
                            >
                                <MenuItem value="">
                                    <em>Todas</em>
                                </MenuItem>
                                {iterations.map((iter) => (
                                    <MenuItem key={iter.id} value={iter.id}>
                                        {iter.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Artefacto</InputLabel>
                            <Select
                                value={filterArtifactId}
                                label="Artefacto"
                                onChange={(e) =>
                                    setFilterArtifactId(e.target.value)
                                }
                            >
                                <MenuItem value="">
                                    <em>Todos</em>
                                </MenuItem>
                                {artifacts.map((art) => (
                                    <MenuItem key={art.id} value={art.id}>
                                        {art.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            size="small"
                            label="Autor"
                            value={filterAuthor}
                            onChange={(e) => setFilterAuthor(e.target.value)}
                            sx={{ minWidth: 200 }}
                        />

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={filterType}
                                label="Tipo"
                                onChange={(e) =>
                                    setFilterType(
                                        e.target.value as
                                            | ""
                                            | "tecnico"
                                            | "funcional"
                                    )
                                }
                            >
                                <MenuItem value="">
                                    <em>Todos</em>
                                </MenuItem>
                                <MenuItem value="funcional">Funcional</MenuItem>
                                <MenuItem value="tecnico">Técnico</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleApplyFilters}
                        >
                            Aplicar
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleClearFilters}
                        >
                            Limpiar
                        </Button>
                    </Box>
                )}
            </Box>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Título</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Artefacto</TableCell>
                        <TableCell>Iteración</TableCell>
                        <TableCell>Autor</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Evidencia</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {microincrements.map((micro) => (
                        <TableRow key={micro.id} hover>
                            <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                    {micro.title}
                                </Typography>
                                {micro.description && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                    >
                                        {micro.description.length > 60
                                            ? `${micro.description.substring(0, 60)}...`
                                            : micro.description}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={
                                        micro.type === "tecnico"
                                            ? "Técnico"
                                            : "Funcional"
                                    }
                                    color={getTypeColor(micro.type)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{micro.artifactTitle}</TableCell>
                            <TableCell>
                                {micro.iterationName || (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        -
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell>{micro.author}</TableCell>
                            <TableCell>{formatDate(micro.date)}</TableCell>
                            <TableCell>
                                {micro.evidenceUrl ? (
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        component="a"
                                        href={micro.evidenceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Ver evidencia"
                                    >
                                        <LinkIcon fontSize="small" />
                                    </IconButton>
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        -
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell align="center">
                                {onEdit && (
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit(micro)}
                                        color="primary"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                                {onDelete && (
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    "¿Estás seguro de eliminar este microincremento?"
                                                )
                                            ) {
                                                onDelete(micro.id);
                                            }
                                        }}
                                        color="error"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {microincrements.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                align="center"
                                sx={{ py: 4 }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    No hay microincrementos registrados
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
}
