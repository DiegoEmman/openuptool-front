import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Breadcrumbs,
    Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router";
import { Navbar } from "../../components/common/Navbar";
import { configurationService } from "../../services/configurationService";
import type { GlobalConfiguration } from "../../types/configuration";
import { RoleManagement } from "../../components/configuration/RoleManagement";
import { PhaseManagement } from "../../components/configuration/PhaseManagement";
import { ArtifactTypeManagement } from "../../components/configuration/ArtifactTypeManagement";
import { WorkflowManagement } from "../../components/configuration/WorkflowManagement";
import { CustomFieldManagement } from "../../components/configuration/CustomFieldManagement";
import { ChangeHistoryView } from "../../components/configuration/ChangeHistoryView";

export function GlobalConfigPage() {
    const [configurations, setConfigurations] = useState<GlobalConfiguration[]>(
        []
    );
    const [selectedConfig, setSelectedConfig] =
        useState<GlobalConfiguration | null>(null);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadConfigurations();
    }, []);

    const loadConfigurations = async () => {
        setLoading(true);
        setError(null);
        try {
            const configs = await configurationService.getAll();
            setConfigurations(configs);

            // Seleccionar la configuración por defecto
            const defaultConfig = configs.find((c) => c.isDefault);
            if (defaultConfig) {
                setSelectedConfig(defaultConfig);
            } else if (configs.length > 0) {
                setSelectedConfig(configs[0]);
            }
        } catch (err) {
            console.error("Error loading configurations:", err);
            setError("Error al cargar configuraciones");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink
                        component={Link}
                        to="/"
                        underline="hover"
                        color="inherit"
                    >
                        Inicio
                    </MuiLink>
                    <Typography color="text.primary">
                        Configuración Global
                    </Typography>
                </Breadcrumbs>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Typography variant="h4">
                        Configuración Global del Sistema
                    </Typography>
                    <Button
                        component={Link}
                        to="/configuration/templates"
                        variant="outlined"
                    >
                        Gestionar Plantillas
                    </Button>
                </Box>

                {loading && (
                    <Box
                        sx={{ display: "flex", justifyContent: "center", p: 4 }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <>
                        {/* Lista de configuraciones */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Configuraciones Disponibles
                                </Typography>
                                {configurations.map((config) => (
                                    <Box
                                        key={config.id}
                                        sx={{
                                            p: 2,
                                            mb: 1,
                                            border: "1px solid",
                                            borderColor:
                                                selectedConfig?.id === config.id
                                                    ? "primary.main"
                                                    : "divider",
                                            borderRadius: 1,
                                            cursor: "pointer",
                                            backgroundColor:
                                                selectedConfig?.id === config.id
                                                    ? "action.selected"
                                                    : "transparent",
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                            },
                                        }}
                                        onClick={() =>
                                            setSelectedConfig(config)
                                        }
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight="medium"
                                                >
                                                    {config.name}
                                                    {config.isDefault && (
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                ml: 1,
                                                                color: "primary.main",
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            (Por defecto)
                                                        </Typography>
                                                    )}
                                                </Typography>
                                                {config.description && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {config.description}
                                                    </Typography>
                                                )}
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Versión {config.version} •
                                                    Estado:{" "}
                                                    {config.isActive
                                                        ? "Activa"
                                                        : "Inactiva"}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedConfig(config);
                                                    setTab(0);
                                                }}
                                            >
                                                Gestionar
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>

                        {selectedConfig && (
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Gestionar: {selectedConfig.name}
                                    </Typography>

                                    <Tabs
                                        value={tab}
                                        onChange={(_, v) => setTab(v)}
                                        sx={{
                                            mb: 3,
                                            borderBottom: 1,
                                            borderColor: "divider",
                                        }}
                                    >
                                        <Tab label="Roles" />
                                        <Tab label="Etapas" />
                                        <Tab label="Tipos de Artefactos" />
                                        <Tab label="Flujos de Trabajo" />
                                        <Tab label="Campos Personalizados" />
                                        <Tab label="Historial" />
                                    </Tabs>

                                    {tab === 0 && (
                                        <RoleManagement
                                            configId={selectedConfig.id}
                                        />
                                    )}

                                    {tab === 1 && (
                                        <PhaseManagement
                                            configId={selectedConfig.id}
                                        />
                                    )}

                                    {tab === 2 && (
                                        <ArtifactTypeManagement
                                            configId={selectedConfig.id}
                                        />
                                    )}

                                    {tab === 3 && (
                                        <WorkflowManagement
                                            configId={selectedConfig.id}
                                        />
                                    )}

                                    {tab === 4 && (
                                        <CustomFieldManagement
                                            configId={selectedConfig.id}
                                        />
                                    )}

                                    {tab === 5 && (
                                        <ChangeHistoryView
                                            configId={selectedConfig.id}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </Container>
        </>
    );
}
