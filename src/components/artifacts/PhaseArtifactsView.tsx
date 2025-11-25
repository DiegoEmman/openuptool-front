import React, { useState } from 'react';
import type { Artifact } from '../../types/artifact';
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
} from '@mui/material';
import { InlineArtifactEditor } from './InlineArtifactEditor';

interface Props {
    artifacts: Artifact[];
}
export function PhaseArtifactsView({ artifacts }: Props) {
    const [filter, setFilter] = useState<string>('ALL');
    const filtered = artifacts.filter((a) => filter === 'ALL' || a.status === filter);

    return (
        <Box>
            <Box mb={1} display="flex" gap={2} alignItems="center">
                <Typography variant="subtitle1">Artefactos Incepción</Typography>
                <Select size="small" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                    <MenuItem value="En revisión">En revisión</MenuItem>
                    <MenuItem value="Aprobado">Aprobado</MenuItem>
                </Select>
            </Box>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Título</TableCell>
                        <TableCell>Autor</TableCell>
                        <TableCell>Obligatorio</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Contenido</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filtered.map((a) => (
                        <TableRow key={a.id}>
                            <TableCell>{a.title}</TableCell>
                            <TableCell>{a.author || '-'}</TableCell>
                            <TableCell>{a.isMandatory ? 'Sí' : 'No'}</TableCell>
                            <TableCell>
                                <Chip
                                    label={a.status}
                                    color={
                                        a.status === 'Aprobado'
                                            ? 'success'
                                            : a.status === 'En revisión'
                                              ? 'warning'
                                              : 'default'
                                    }
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <InlineArtifactEditor artifact={a} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {filtered.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                Sin artefactos
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );
}
