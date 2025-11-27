import { useState, useEffect } from "react";

interface Version {
    id: string;
    versionNumber: number;
    fileName?: string;
    fileSize?: number;
    uploadedBy?: string;
    uploadedAt: string;
    changeDescription?: string;
}

interface VersionHistoryProps {
    projectId: string;
    artifactId: string;
}

export function VersionHistory({ projectId, artifactId }: VersionHistoryProps) {
    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVersions();
    }, [projectId, artifactId]);

    const fetchVersions = async () => {
        try {
            const token =
                localStorage.getItem("openuptool_token") ||
                localStorage.getItem("token") ||
                "";
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/projects/${projectId}/artifacts/${artifactId}/versions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setVersions(data);
            }
        } catch (error) {
            console.error("Error fetching versions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (versionId: string, fileName: string) => {
        try {
            const token =
                localStorage.getItem("openuptool_token") ||
                localStorage.getItem("token") ||
                "";
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/projects/${projectId}/artifacts/${artifactId}/versions/${versionId}/download`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Error al descargar el archivo");
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "N/A";
        const mb = bytes / 1024 / 1024;
        return `${mb.toFixed(2)} MB`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return <div className="text-center py-4">Cargando versiones...</div>;
    }

    if (versions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-2">📦</p>
                <p>No hay versiones disponibles</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-3">
                Historial de Versiones
            </h3>
            {versions.map((version) => (
                <div
                    key={version.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    v{version.versionNumber}
                                </span>
                                {version.fileName && (
                                    <span className="text-sm font-medium text-gray-900">
                                        {version.fileName}
                                    </span>
                                )}
                            </div>

                            {version.changeDescription && (
                                <p className="mt-2 text-sm text-gray-600">
                                    {version.changeDescription}
                                </p>
                            )}

                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                {version.uploadedBy && (
                                    <span>👤 {version.uploadedBy}</span>
                                )}
                                <span>📅 {formatDate(version.uploadedAt)}</span>
                                {version.fileSize && (
                                    <span>
                                        📦 {formatFileSize(version.fileSize)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {version.fileName && (
                            <button
                                onClick={() =>
                                    handleDownload(
                                        version.id,
                                        version.fileName!
                                    )
                                }
                                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-1"
                            >
                                <span>⬇️</span>
                                <span>Descargar</span>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
