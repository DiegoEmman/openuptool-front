import React, { useState } from "react";
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { projectService } from "../../services/projectService";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { useNavigate } from "react-router";
import type { Project } from "../../types/project";

interface ProjectActionsMenuProps {
    project: Project;
    onProjectUpdated?: (project: Project) => void;
    onProjectDeleted?: () => void;
}

export function ProjectActionsMenu({
    project,
    onProjectUpdated,
    onProjectDeleted,
}: ProjectActionsMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleArchive = async () => {
        handleClose();
        setLoading(true);
        try {
            const updatedProject = await projectService.archive(project.id);
            onProjectUpdated?.(updatedProject);
        } catch (error) {
            console.error("Error archiving project:", error);
            alert("Error al archivar el proyecto");
        } finally {
            setLoading(false);
        }
    };

    const handleUnarchive = async () => {
        handleClose();
        setLoading(true);
        try {
            const updatedProject = await projectService.unarchive(project.id);
            onProjectUpdated?.(updatedProject);
        } catch (error) {
            console.error("Error unarchiving project:", error);
            alert("Error al desarchivar el proyecto");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = () => {
        handleClose();
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await projectService.deletePermanently(project.id);
            setDeleteDialogOpen(false);
            onProjectDeleted?.();
            navigate("/projects");
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Error al eliminar el proyecto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                disabled={loading}
                aria-label="project actions"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                {!project.isArchived ? (
                    <MenuItem onClick={handleArchive}>
                        <ListItemIcon>
                            <ArchiveIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Archivar proyecto</ListItemText>
                    </MenuItem>
                ) : (
                    <MenuItem onClick={handleUnarchive}>
                        <ListItemIcon>
                            <UnarchiveIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Desarchivar proyecto</ListItemText>
                    </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: "error.main" }}>
                        Eliminar permanentemente
                    </ListItemText>
                </MenuItem>
            </Menu>
            <DeleteProjectDialog
                open={deleteDialogOpen}
                projectName={project.name}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={loading}
            />
        </>
    );
}
