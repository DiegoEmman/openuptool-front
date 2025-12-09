import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Typography,
    Tooltip,
    Link,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Description as DescriptionIcon,
} from "@mui/icons-material";
import type { FinalBuild } from "../../types/transition";

interface FinalBuildsTableProps {
    builds: FinalBuild[];
    onEdit: (build: FinalBuild) => void;
    onDelete: (build: FinalBuild) => void;
}

export function FinalBuildsTable({
    builds,
    onEdit,
    onDelete,
}: FinalBuildsTableProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getTestsStatus = (passed?: number, total?: number) => {
        if (!passed || !total) return null;
        const percentage = (passed / total) * 100;
        const color =
            percentage >= 90
                ? "success"
                : percentage >= 70
                  ? "warning"
                  : "error";
        return (
            <Chip
                label={`${passed}/${total} (${percentage.toFixed(0)}%)`}
                color={color}
                size="small"
            />
        );
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Build</TableCell>
                        <TableCell>Versión</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Estable</TableCell>
                        <TableCell>Pruebas</TableCell>
                        <TableCell>Cobertura</TableCell>
                        <TableCell>Enlaces</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {builds.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                <Typography color="textSecondary" py={2}>
                                    No hay builds finales registrados
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        builds.map((build) => (
                            <TableRow key={build.id} hover>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                    >
                                        {build.buildNumber}
                                    </Typography>
                                    {build.buildTag && (
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                        >
                                            {build.buildTag}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={build.version}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    {formatDate(build.buildDate)}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            build.isStable
                                                ? "Estable"
                                                : "No estable"
                                        }
                                        color={
                                            build.isStable
                                                ? "success"
                                                : "default"
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {getTestsStatus(
                                        build.testsPassed,
                                        build.testsTotal
                                    )}
                                </TableCell>
                                <TableCell>
                                    {build.codeCoverage && (
                                        <Chip
                                            label={`${build.codeCoverage.toFixed(1)}%`}
                                            color={
                                                build.codeCoverage >= 80
                                                    ? "success"
                                                    : build.codeCoverage >= 60
                                                      ? "warning"
                                                      : "error"
                                            }
                                            size="small"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {build.mainDownloadUrl && (
                                        <Tooltip title="Descargar">
                                            <IconButton
                                                size="small"
                                                component={Link}
                                                href={build.mainDownloadUrl}
                                                target="_blank"
                                            >
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {build.documentationUrl && (
                                        <Tooltip title="Documentación">
                                            <IconButton
                                                size="small"
                                                component={Link}
                                                href={build.documentationUrl}
                                                target="_blank"
                                            >
                                                <DescriptionIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar">
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(build)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            size="small"
                                            onClick={() => onDelete(build)}
                                            color="error"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
