import React from 'react';
import type { Iteration } from '../../types/iteration';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Box,
    Chip,
} from '@mui/material';

interface Props {
    iterations: Iteration[];
}
export function IterationsTable({ iterations }: Props) {
    const active = iterations.filter((i) => i.status !== 'Finalizada');
    const past = iterations.filter((i) => i.status === 'Finalizada');

    function section(title: string, data: Iteration[]) {
        return (
            <Box mb={3}>
                <Typography variant="subtitle1" mb={1}>
                    {title}
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Fase</TableCell>
                            <TableCell>Fechas</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Objetivo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((i) => (
                            <TableRow key={i.id}>
                                <TableCell>{i.name}</TableCell>
                                <TableCell>{i.phase}</TableCell>
                                <TableCell>
                                    {i.startDate} - {i.endDate}
                                </TableCell>
                                <TableCell>
                                    <Chip label={i.status} size="small" />
                                </TableCell>
                                <TableCell>{i.objective || '-'}</TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Sin iteraciones
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        );
    }

    return (
        <Box>
            {section('Iteraciones activas', active)}
            {section('Iteraciones pasadas', past)}
        </Box>
    );
}
