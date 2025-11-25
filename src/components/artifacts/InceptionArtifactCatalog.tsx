import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Switch, TextField } from '@mui/material';
import type { ArtifactType } from '../../types/artifact';
import { artifactCatalogService } from '../../services/artifactCatalogService';

interface Props {
    types: ArtifactType[];
    onUpdate?: () => void;
}
export function InceptionArtifactCatalog({ types, onUpdate }: Props) {
    function toggleMandatory(t: ArtifactType) {
        artifactCatalogService.updateType(t.id, { isMandatory: !t.isMandatory });
        onUpdate?.();
    }
    function updateDescription(t: ArtifactType, value: string) {
        artifactCatalogService.updateType(t.id, { description: value });
        onUpdate?.();
    }
    return (
        <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
                <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Obligatorio</TableCell>
                    <TableCell>Formato</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {types.map((t) => (
                    <TableRow key={t.id}>
                        <TableCell>{t.name}</TableCell>
                        <TableCell>
                            <TextField
                                value={t.description}
                                size="small"
                                onChange={(e) => updateDescription(t, e.target.value)}
                            />
                        </TableCell>
                        <TableCell>
                            <Switch checked={t.isMandatory} onChange={() => toggleMandatory(t)} />
                        </TableCell>
                        <TableCell>{t.defaultFormat}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
