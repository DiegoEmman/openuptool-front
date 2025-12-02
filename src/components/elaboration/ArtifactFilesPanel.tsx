import React, { useState, useEffect, useRef } from "react";
import {
    elaborationService,
    type ArtifactFile,
} from "../../services/elaborationService";

interface ArtifactFilesPanelProps {
    artifactId: string;
}

export function ArtifactFilesPanel({ artifactId }: ArtifactFilesPanelProps) {
    const [files, setFiles] = useState<ArtifactFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await elaborationService.getFiles(artifactId);
            setFiles(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al cargar archivos"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [artifactId]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !fileInputRef.current?.files ||
            fileInputRef.current.files.length === 0
        ) {
            setError("Seleccione al menos un archivo");
            return;
        }

        try {
            setUploading(true);
            setError(null);
            await elaborationService.uploadFiles(
                artifactId,
                fileInputRef.current.files
            );
            // Refrescar lista
            await fetchFiles();
            // Limpiar input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al subir archivos"
            );
        } finally {
            setUploading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("es-ES", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    if (loading) {
        return (
            <div className="files-panel loading">
                <p>Cargando archivos...</p>
            </div>
        );
    }

    return (
        <div className="files-panel">
            <h3>Archivos del Artefacto</h3>

            {error && <div className="error-message">{error}</div>}

            {files.length > 0 ? (
                <div className="files-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Fecha de subida</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file) => (
                                <tr key={file.id}>
                                    <td>{file.filename}</td>
                                    <td>{file.mimetype}</td>
                                    <td>{formatDate(file.uploadedAt)}</td>
                                    <td>
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-link"
                                        >
                                            Abrir
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-files">
                    No hay archivos asociados a este artefacto.
                </p>
            )}

            <form onSubmit={handleUpload} className="upload-form">
                <h4>Subir archivos</h4>
                <div className="form-group">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        disabled={uploading}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                >
                    {uploading ? "Subiendo..." : "Subir archivos"}
                </button>
            </form>
        </div>
    );
}
