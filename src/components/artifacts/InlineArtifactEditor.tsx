import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import type { Artifact } from '../../types/artifact';
import { artifactService } from '../../services/artifactService';

interface Props {
    artifact: Artifact;
}
export function InlineArtifactEditor({ artifact }: Props) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(artifact.contentText || '');

    function save() {
        artifactService.updateArtifact(artifact.id, { contentText: text });
        setEditing(false);
    }

    if (artifact.contentText === undefined) return null;

    return (
        <Box my={1}>
            {!editing && (
                <Box>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                        {text || '(Sin contenido)'}
                    </pre>
                    <Button onClick={() => setEditing(true)} size="small">
                        Editar
                    </Button>
                </Box>
            )}
            {editing && (
                <Box>
                    <TextField
                        multiline
                        fullWidth
                        minRows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Button variant="contained" onClick={save} size="small" sx={{ mt: 1, mr: 1 }}>
                        Guardar
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {
                            setEditing(false);
                            setText(artifact.contentText || '');
                        }}
                    >
                        Cancelar
                    </Button>
                </Box>
            )}
        </Box>
    );
}
