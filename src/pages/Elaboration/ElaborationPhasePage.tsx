import React, { useState } from "react";
import { useParams } from "react-router";
import { useElaborationArtifacts } from "../../hooks/useElaborationArtifacts";
import { useValidateElaborationPhase } from "../../hooks/useValidateElaborationPhase";
import {
    elaborationService,
    type ElaborationArtifact,
    type CreateElaborationArtifactInput,
    type UpdateElaborationArtifactInput,
} from "../../services/elaborationService";
import { ArtifactForm } from "../../components/elaboration/ArtifactForm";
import { ArtifactFilesPanel } from "../../components/elaboration/ArtifactFilesPanel";
import { ValidationModal } from "../../components/elaboration/ValidationModal";
import "./ElaborationPhasePage.css";

type ModalMode =
    | { type: "none" }
    | { type: "create" }
    | { type: "edit"; artifact: ElaborationArtifact }
    | { type: "files"; artifactId: string };

export function ElaborationPhasePage() {
    const { projectId } = useParams<{ projectId: string }>();
    const { artifacts, loading, error, refetch } = useElaborationArtifacts(
        projectId!
    );
    const { validate, validating, validationResult } =
        useValidateElaborationPhase(projectId!);

    const [modalMode, setModalMode] = useState<ModalMode>({ type: "none" });
    const [showValidation, setShowValidation] = useState(false);

    console.log('🚀 ElaborationPhasePage loaded - Artifacts:', artifacts.length);

    const handleCreate = async (data: CreateElaborationArtifactInput) => {
        await elaborationService.createArtifact(projectId!, data);
        setModalMode({ type: "none" });
        refetch();
    };

    const handleUpdate = async (
        artifactId: string,
        data: UpdateElaborationArtifactInput
    ) => {
        await elaborationService.updateArtifact(artifactId, data);
        setModalMode({ type: "none" });
        refetch();
    };

    const handleValidate = async () => {
        await validate();
        setShowValidation(true);
    };

    const getStatusLabel = (
        status: "pending" | "in_review" | "delivered"
    ): string => {
        const labels = {
            pending: "Pendiente",
            in_review: "En revisión",
            delivered: "Entregado",
        };
        return labels[status];
    };

    const getRequirementBadge = (
        required: boolean,
        status: "pending" | "in_review" | "delivered"
    ) => {
        if (required) {
            if (status === "delivered") {
                return (
                    <span className="badge badge-success">
                        Obligatorio (cumplido)
                    </span>
                );
            }
            return (
                <span className="badge badge-danger">
                    Obligatorio (no entregado)
                </span>
            );
        }
        return <span className="badge badge-neutral">Opcional</span>;
    };

    if (loading) {
        return (
            <div className="elaboration-page loading">
                <p>Cargando artefactos de Elaboración...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="elaboration-page error">
                <p>Error: {error}</p>
                <button onClick={refetch} className="btn btn-primary">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="elaboration-page">
            <header className="page-header">
                <h1>Fase de Elaboración</h1>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleValidate}
                        disabled={validating}
                    >
                        {validating ? "Validando..." : "Validar fase de Elaboración"}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setModalMode({ type: "create" })}
                    >
                        + Nuevo artefacto
                    </button>
                </div>
            </header>

            <div className="artifacts-table-container">
                {artifacts.length === 0 ? (
                    <div className="no-artifacts">
                        <p>No hay artefactos registrados en esta fase.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setModalMode({ type: "create" })}
                        >
                            Crear primer artefacto
                        </button>
                    </div>
                ) : (
                    <table className="artifacts-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Tipo de entrega</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artifacts.map((artifact) => (
                                <tr key={artifact.id}>
                                    <td>
                                        <strong>{artifact.title}</strong>
                                        {artifact.description && (
                                            <div className="artifact-description">
                                                {artifact.description}
                                            </div>
                                        )}
                                    </td>
                                    <td>{artifact.type}</td>
                                    <td>
                                        <span
                                            className={`status-badge status-${artifact.status}`}
                                        >
                                            {getStatusLabel(artifact.status)}
                                        </span>
                                    </td>
                                    <td>
                                        {getRequirementBadge(
                                            artifact.required,
                                            artifact.status
                                        )}
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() =>
                                                setModalMode({
                                                    type: "edit",
                                                    artifact,
                                                })
                                            }
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() =>
                                                setModalMode({
                                                    type: "files",
                                                    artifactId: artifact.id,
                                                })
                                            }
                                        >
                                            Archivos
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal para crear/editar */}
            {(modalMode.type === "create" || modalMode.type === "edit") && (
                <div
                    className="modal-overlay"
                    onClick={() => setModalMode({ type: "none" })}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>
                                {modalMode.type === "create"
                                    ? "Nuevo Artefacto"
                                    : "Editar Artefacto"}
                            </h2>
                            <button
                                className="modal-close"
                                onClick={() => setModalMode({ type: "none" })}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <ArtifactForm
                                mode={modalMode.type}
                                projectId={projectId!}
                                artifact={
                                    modalMode.type === "edit"
                                        ? modalMode.artifact
                                        : undefined
                                }
                                onSubmit={(data) =>
                                    modalMode.type === "create"
                                        ? handleCreate(
                                              data as CreateElaborationArtifactInput
                                          )
                                        : handleUpdate(
                                              modalMode.artifact.id,
                                              data as UpdateElaborationArtifactInput
                                          )
                                }
                                onCancel={() => setModalMode({ type: "none" })}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Panel de archivos */}
            {modalMode.type === "files" && (
                <div
                    className="modal-overlay"
                    onClick={() => setModalMode({ type: "none" })}
                >
                    <div
                        className="modal-content modal-large"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Archivos del Artefacto</h2>
                            <button
                                className="modal-close"
                                onClick={() => setModalMode({ type: "none" })}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <ArtifactFilesPanel
                                artifactId={modalMode.artifactId}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de validación */}
            {showValidation && validationResult && (
                <ValidationModal
                    result={validationResult}
                    onClose={() => setShowValidation(false)}
                />
            )}
        </div>
    );
}
