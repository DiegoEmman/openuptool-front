import React, { useState } from "react";
import type {
    ElaborationArtifact,
    CreateElaborationArtifactInput,
    UpdateElaborationArtifactInput,
} from "../../services/elaborationService";

interface ArtifactFormProps {
    mode: "create" | "edit";
    projectId: string;
    artifact?: ElaborationArtifact;
    onSubmit: (
        data: CreateElaborationArtifactInput | UpdateElaborationArtifactInput
    ) => Promise<void>;
    onCancel: () => void;
}

const ELABORATION_ARTIFACT_TYPES = [
    { value: "UseCaseModel_Detailed", label: "Modelo de Casos de Uso Detallado" },
    { value: "DomainModel", label: "Modelo de Dominio" },
    { value: "SupplementaryRequirements", label: "Requisitos Suplementarios" },
    { value: "NonFunctionalRequirements", label: "Requisitos No Funcionales" },
    { value: "ArchitectureDocument", label: "Documento de Arquitectura" },
    { value: "TechnicalDiagram", label: "Diagrama Técnico" },
    { value: "IterationPlan", label: "Plan de Iteración" },
    { value: "UIPrototype", label: "Prototipo de Interfaz de Usuario" },
];

export function ArtifactForm({
    mode,
    projectId,
    artifact,
    onSubmit,
    onCancel,
}: ArtifactFormProps) {
    const [formData, setFormData] = useState<{
        type: string;
        title: string;
        description: string;
        authorId: string;
        required: boolean;
    }>({
        type: artifact?.type || "",
        title: artifact?.title || "",
        description: artifact?.description || "",
        authorId: artifact?.authorId || "",
        required: artifact?.required || false,
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError("El título es obligatorio");
            return;
        }

        if (!formData.type) {
            setError("El tipo es obligatorio");
            return;
        }

        try {
            setSubmitting(true);
            await onSubmit(formData);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al guardar el artefacto"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="artifact-form">
            <div className="form-group">
                <label htmlFor="title">
                    Título <span className="required">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ingrese el título del artefacto"
                    disabled={submitting}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="type">
                    Tipo <span className="required">*</span>
                </label>
                <select
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                    }
                    disabled={submitting}
                    required
                >
                    <option value="">Seleccione un tipo</option>
                    {ELABORATION_ARTIFACT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Ingrese una descripción detallada"
                    rows={4}
                    disabled={submitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="authorId">Autor</label>
                <input
                    id="authorId"
                    type="text"
                    value={formData.authorId}
                    onChange={(e) =>
                        setFormData({ ...formData, authorId: e.target.value })
                    }
                    placeholder="ID o nombre del autor"
                    disabled={submitting}
                />
            </div>

            <div className="form-group checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={formData.required}
                        onChange={(e) =>
                            setFormData({ ...formData, required: e.target.checked })
                        }
                        disabled={submitting}
                    />
                    <span>Marcar como obligatorio</span>
                </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                    disabled={submitting}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                >
                    {submitting
                        ? "Guardando..."
                        : mode === "create"
                        ? "Crear Artefacto"
                        : "Guardar Cambios"}
                </button>
            </div>
        </form>
    );
}
