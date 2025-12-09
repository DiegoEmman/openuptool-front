import React, { useEffect, useState } from "react";
import { projectService } from "../../services/projectService";
import {
    Box,
    Button,
    Container,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    CircularProgress,
    Tabs,
    Tab,
} from "@mui/material";
import { Link } from "react-router";
import type { Project, ProjectStatus } from "../../types/project";
import { Navbar } from "../../components/common/Navbar";
import { useAuth } from "../../contexts/AuthContext";

function getStatusColor(
    status: ProjectStatus
): "default" | "primary" | "success" | "warning" {
    switch (status) {
        case "Creado":
            return "default";
        case "Planificado":
            return "primary";
        case "En curso":
            return "warning";
        case "Cerrado":
            return "success";
        default:
            return "default";
    }
}

function formatDate(dateString: string | undefined): string {
    if (!dateString) return "-";
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
}

export function ProjectsListPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const { hasRole } = useAuth();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        setLoading(true);
        Promise.all([
            projectService.list(),
            projectService.getArchivedProjects(),
        ])
            .then(([activeProjects, archived]) => {
                // Filter out archived projects from the main list
                setProjects(activeProjects.filter((p) => !p.isArchived));
                setArchivedProjects(archived);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading projects:", error);
                setLoading(false);
            });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container
                    sx={{ py: 4, display: "flex", justifyContent: "center" }}
                >
                    <CircularProgress />
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container sx={{ py: 4 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography variant="h4">Proyectos</Typography>
                    {hasRole(["Admin", "Manager"]) && (
                        <Button
                            component={Link}
                            to="/projects/new"
                            variant="contained"
                        >
                            Nuevo Proyecto
                        </Button>
                    )}
                </Box>

                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                    <Tab label={`Activos (${projects.length})`} />
                    <Tab label={`Archivados (${archivedProjects.length})`} />
                </Tabs>

                {tab === 0 && (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Identificador</TableCell>
                                <TableCell>Inicio</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.map((p) => (
                                <TableRow key={p.id} hover>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.identifier}</TableCell>
                                    <TableCell>
                                        {formatDate(p.startDate)}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.status}
                                            color={getStatusColor(p.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            component={Link}
                                            to={`/projects/${p.id}`}
                                            size="small"
                                        >
                                            Detalle
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {projects.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{ py: 8 }}
                                    >
                                        <Typography
                                            variant="h6"
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            No hay proyectos activos
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            mb={2}
                                        >
                                            Comienza creando tu primer proyecto
                                            OpenUP
                                        </Typography>
                                        {hasRole(["Admin", "Manager"]) && (
                                            <Button
                                                component={Link}
                                                to="/projects/new"
                                                variant="contained"
                                            >
                                                Crear Primer Proyecto
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}

                {tab === 1 && (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Identificador</TableCell>
                                <TableCell>Inicio</TableCell>
                                <TableCell>Archivado el</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {archivedProjects.map((p) => (
                                <TableRow key={p.id} hover>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.identifier}</TableCell>
                                    <TableCell>
                                        {formatDate(p.startDate)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(p.archivedAt)}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.status}
                                            color={getStatusColor(p.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            component={Link}
                                            to={`/projects/${p.id}`}
                                            size="small"
                                        >
                                            Detalle
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {archivedProjects.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                        sx={{ py: 8 }}
                                    >
                                        <Typography
                                            variant="h6"
                                            color="text.secondary"
                                        >
                                            No hay proyectos archivados
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </Container>
        </>
    );
}

export default ProjectsListPage;
