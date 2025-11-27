import { useState } from "react";
import { apiClient } from "../../services/api/apiClient";

interface ArtifactFileUploadProps {
    projectId: string;
    artifactId: string;
    onUploadSuccess?: () => void;
}

export function ArtifactFileUpload({
    projectId,
    artifactId,
    onUploadSuccess,
}: ArtifactFileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [changeDescription, setChangeDescription] = useState("");
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("changeDescription", changeDescription);
            formData.append(
                "uploadedBy",
                localStorage.getItem("userEmail") || "Unknown"
            );
            // Use apiClient to handle token and FormData correctly
            await apiClient.post(
                `/projects/${projectId}/artifacts/${artifactId}/versions`,
                formData
            );

            setFile(null);
            setChangeDescription("");
            onUploadSuccess?.();
            alert("Archivo subido exitosamente");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error al subir el archivo");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {!file ? (
                    <div>
                        <div className="text-6xl mb-2">📤</div>
                        <p className="mt-2 text-sm text-gray-600">
                            Arrastra un archivo aquí o{" "}
                            <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                selecciona uno
                            </label>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (máx. 10MB)
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-center space-x-3">
                        <span className="text-4xl">📄</span>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {file && (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción de cambios
                        </label>
                        <textarea
                            value={changeDescription}
                            onChange={(e) =>
                                setChangeDescription(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Describe los cambios de esta versión..."
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {uploading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                <span>Subiendo...</span>
                            </>
                        ) : (
                            <>
                                <span>📤</span>
                                <span>Subir Versión</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
