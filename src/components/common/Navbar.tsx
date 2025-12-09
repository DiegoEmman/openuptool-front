import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    AccountCircle,
    ExitToApp,
    Settings as SettingsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationsBell } from "../notifications/NotificationsBell";

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout, hasRole } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isAdmin = hasRole(["Admin"]);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    OpenUpTool
                </Typography>

                {user && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {isAdmin && (
                            <Button
                                color="inherit"
                                startIcon={<SettingsIcon />}
                                onClick={() => navigate("/configuration")}
                                sx={{ display: { xs: "none", md: "flex" } }}
                            >
                                Configuración
                            </Button>
                        )}

                        <Typography
                            variant="body2"
                            sx={{ display: { xs: "none", sm: "block" } }}
                        >
                            {user.firstName} {user.lastName} ({user.role})
                        </Typography>

                        <NotificationsBell />

                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem disabled>
                                <Typography variant="body2">
                                    {user.email}
                                </Typography>
                            </MenuItem>
                            {isAdmin && [
                                <MenuItem
                                    key="config"
                                    onClick={() => {
                                        handleClose();
                                        navigate("/configuration");
                                    }}
                                >
                                    <SettingsIcon
                                        sx={{ mr: 1 }}
                                        fontSize="small"
                                    />
                                    Configuración Global
                                </MenuItem>,
                                <MenuItem
                                    key="templates"
                                    onClick={() => {
                                        handleClose();
                                        navigate("/configuration/templates");
                                    }}
                                >
                                    <SettingsIcon
                                        sx={{ mr: 1 }}
                                        fontSize="small"
                                    />
                                    Plantillas OpenUP
                                </MenuItem>,
                            ]}
                            <MenuItem onClick={handleLogout}>
                                <ExitToApp sx={{ mr: 1 }} fontSize="small" />
                                Cerrar Sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};
