import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Typography,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import { configurationService } from "../../services/configurationService";
import type {
    RoleTemplate,
    CreateRoleTemplateInput,
    UpdateRoleTemplateInput,
} from "../../types/configuration";

interface RoleManagementProps {
    configId: string;
}

export function RoleManagement({ configId }: RoleManagementProps) {
    const [roles, setRoles] = useState<RoleTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleTemplate | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        permissions: "",
        orderIndex: 0,
    });

    useEffect(() => {
        loadRoles();
    }, [configId]);

    const loadRoles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await configurationService.getRoles(configId);
            setRoles(data.sort((a, b) => a.orderIndex - b.orderIndex));
        } catch (err) {
            setError("Error al cargar roles");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (role?: RoleTemplate) => {
        if (role) {
            setEditingRole(role);
            setFormData({
                name: role.name,
                description: role.description || "",
                permissions: role.permissions.join(", "),
                orderIndex: role.orderIndex,
            });
        } else {
            setEditingRole(null);
            setFormData({
                name: "",
                description: "",
                permissions: "",
                orderIndex: roles.length + 1,
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingRole(null);
        setFormData({
            name: "",
            description: "",
            permissions: "",
            orderIndex: 0,
        });
    };

    const handleSubmit = async () => {
        try {
            const permissions = formData.permissions
                .split(",")
                .map((p) => p.trim())
                .filter((p) => p);

            if (editingRole) {
                const input: UpdateRoleTemplateInput = {
                    name: formData.name,
                    description: formData.description || undefined,
                    permissions,
                    orderIndex: formData.orderIndex,
                };
                await configurationService.updateRole(
                    configId,
                    editingRole.id,
                    input
                );
            } else {
                const input: CreateRoleTemplateInput = {
                    name: formData.name,
                    description: formData.description || undefined,
                    permissions,
                    orderIndex: formData.orderIndex,
                };
                await configurationService.createRole(configId, input);
            }
            handleCloseDialog();
            loadRoles();
        } catch (err) {
            setError("Error al guardar rol");
            console.error(err);
        }
    };

    const handleDelete = async (roleId: string) => {
        if (!window.confirm("¿Estás seguro de eliminar este rol?")) return;

        try {
            await configurationService.deleteRole(configId, roleId);
            loadRoles();
        } catch (err) {
            setError("Error al eliminar rol");
            console.error(err);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Roles del Sistema</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Rol
                </Button>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Orden</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Permisos</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell>{role.orderIndex}</TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight="medium"
                                    >
                                        {role.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{role.description || "-"}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 0.5,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {role.permissions.map((perm, idx) => (
                                            <Chip
                                                key={idx}
                                                label={perm}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleOpenDialog(role)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(role.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {roles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay roles configurados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingRole ? "Editar Rol" : "Nuevo Rol"}
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <TextField
                            label="Nombre"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            required
                            fullWidth
                        />
                        <TextField
                            label="Descripción"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            multiline
                            rows={2}
                            fullWidth
                        />
                        <TextField
                            label="Permisos (separados por coma)"
                            value={formData.permissions}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    permissions: e.target.value,
                                })
                            }
                            placeholder="crear, editar, eliminar, aprobar"
                            helperText="Ejemplo: crear, editar, eliminar, aprobar"
                            fullWidth
                        />
                        <TextField
                            label="Orden"
                            type="number"
                            value={formData.orderIndex}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    orderIndex: parseInt(e.target.value),
                                })
                            }
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name.trim()}
                    >
                        {editingRole ? "Actualizar" : "Crear"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
