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
} from "@mui/material";
import { Link } from "react-router";
import type { Project, ProjectStatus } from "../../types/project";

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

export function ProjectsListPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        projectService
            .list()
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading projects:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Container
                sx={{ py: 4, display: "flex", justifyContent: "center" }}
            >
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4">Proyectos</Typography>
                <Button component={Link} to="/projects/new" variant="contained">
                    Nuevo Proyecto
                </Button>
            </Box>
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
                            <TableCell>{p.startDate}</TableCell>
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
                                    No hay proyectos creados
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mb={2}
                                >
                                    Comienza creando tu primer proyecto OpenUP
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/projects/new"
                                    variant="contained"
                                >
                                    Crear Primer Proyecto
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Container>
    );
}

export default ProjectsListPage;
