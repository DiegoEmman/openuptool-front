import React from "react";
import type { ValidationResult } from "../../services/elaborationService";

interface ValidationModalProps {
    result: ValidationResult;
    onClose: () => void;
}

export function ValidationModal({ result, onClose }: ValidationModalProps) {
    const { allowAdvance, missingRequiredArtifacts } = result;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        {allowAdvance
                            ? "✅ Fase Válida"
                            : "⚠️ Validación de Fase"}
                    </h2>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {allowAdvance ? (
                        <div className="validation-success">
                            <p>
                                Todos los artefactos obligatorios están cumplidos.
                                La fase de Elaboración es válida y está lista para avanzar.
                            </p>
                        </div>
                    ) : (
                        <div className="validation-error">
                            <p className="error-message-main">
                                Faltan artefactos obligatorios para completar la fase de
                                Elaboración.
                            </p>

                            {missingRequiredArtifacts.length > 0 && (
                                <div className="missing-artifacts">
                                    <h3>Artefactos faltantes:</h3>
                                    <ul>
                                        {missingRequiredArtifacts.map((artifact) => (
                                            <li key={artifact.id}>
                                                <strong>{artifact.title}</strong>
                                                <div className="artifact-details">
                                                    <span className="artifact-type">
                                                        Tipo: {artifact.type}
                                                    </span>
                                                    <span
                                                        className={`artifact-status status-${artifact.status}`}
                                                    >
                                                        Estado: {getStatusLabel(artifact.status)}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

function getStatusLabel(
    status: "pending" | "in_review" | "delivered"
): string {
    const labels = {
        pending: "Pendiente",
        in_review: "En revisión",
        delivered: "Entregado",
    };
    return labels[status];
}
