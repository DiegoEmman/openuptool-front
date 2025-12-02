import { httpClient } from "./api/httpClient";

// Flag para activar datos mock (cambiar a false cuando el backend esté listo)
const USE_MOCK_DATA = true;

// Datos mock para pruebas
const mockArtifacts: ElaborationArtifact[] = [
    {
        id: "1",
        projectId: "11111111-2222-3333-4444-555555555555",
        phase: "Elaboration",
        type: "UseCaseModel_Detailed",
        title: "Modelo de Casos de Uso Detallado",
        description: "Modelo completo de casos de uso con todos los actores y escenarios detallados",
        authorId: "user1",
        required: true,
        status: "delivered",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        projectId: "11111111-2222-3333-4444-555555555555",
        phase: "Elaboration",
        type: "DomainModel",
        title: "Modelo de Dominio",
        description: "Diagrama de clases conceptuales del dominio del problema",
        authorId: "user1",
        required: true,
        status: "in_review",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3",
        projectId: "11111111-2222-3333-4444-555555555555",
        phase: "Elaboration",
        type: "ArchitectureDocument",
        title: "Documento de Arquitectura de Software",
        description: "Especificación de la arquitectura del sistema",
        authorId: "user2",
        required: true,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "4",
        projectId: "11111111-2222-3333-4444-555555555555",
        phase: "Elaboration",
        type: "UIPrototype",
        title: "Prototipo de Interfaz de Usuario",
        description: "Wireframes y mockups de la interfaz principal",
        authorId: "user2",
        required: false,
        status: "delivered",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

const mockFiles: Record<string, ArtifactFile[]> = {
    "1": [
        {
            id: "f1",
            artifactId: "1",
            filename: "casos_uso_detallados.pdf",
            url: "/files/casos_uso_detallados.pdf",
            mimetype: "application/pdf",
            uploadedAt: new Date().toISOString(),
        },
        {
            id: "f2",
            artifactId: "1",
            filename: "diagrama_casos_uso.png",
            url: "/files/diagrama_casos_uso.png",
            mimetype: "image/png",
            uploadedAt: new Date().toISOString(),
        },
    ],
    "2": [
        {
            id: "f3",
            artifactId: "2",
            filename: "modelo_dominio.png",
            url: "/files/modelo_dominio.png",
            mimetype: "image/png",
            uploadedAt: new Date().toISOString(),
        },
    ],
};

export interface ElaborationArtifact {
    id: string;
    projectId: string;
    phase: "Elaboration";
    type: string;
    title: string;
    description: string;
    authorId: string;
    required: boolean;
    status: "pending" | "in_review" | "delivered";
    createdAt: string;
    updatedAt: string;
}

export interface CreateElaborationArtifactInput {
    type: string;
    title: string;
    description: string;
    authorId: string;
    required: boolean;
}

export interface UpdateElaborationArtifactInput {
    type?: string;
    title?: string;
    description?: string;
    required?: boolean;
    status?: "pending" | "in_review" | "delivered";
}

export interface ArtifactFile {
    id: string;
    artifactId: string;
    filename: string;
    url: string;
    mimetype: string;
    uploadedAt: string;
}

export interface ValidationResult {
    allowAdvance: boolean;
    missingRequiredArtifacts: Array<{
        id: string;
        title: string;
        type: string;
        status: "pending" | "in_review" | "delivered";
    }>;
}

export const elaborationService = {
    async getArtifacts(projectId: string): Promise<ElaborationArtifact[]> {
        if (USE_MOCK_DATA) {
            // Simular delay de red
            await new Promise((resolve) => setTimeout(resolve, 500));
            return mockArtifacts.filter((a) => a.projectId === projectId);
        }
        return httpClient<ElaborationArtifact[]>(
            `/projects/${projectId}/elaboration/artifacts`
        );
    },

    async createArtifact(
        projectId: string,
        input: CreateElaborationArtifactInput
    ): Promise<ElaborationArtifact> {
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const newArtifact: ElaborationArtifact = {
                id: String(mockArtifacts.length + 1),
                projectId,
                phase: "Elaboration",
                type: input.type,
                title: input.title,
                description: input.description,
                authorId: input.authorId,
                required: input.required,
                status: "pending",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            mockArtifacts.push(newArtifact);
            return newArtifact;
        }
        return httpClient<ElaborationArtifact>(
            `/projects/${projectId}/elaboration/artifacts`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async updateArtifact(
        artifactId: string,
        changes: UpdateElaborationArtifactInput
    ): Promise<ElaborationArtifact> {
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const artifact = mockArtifacts.find((a) => a.id === artifactId);
            if (!artifact) throw new Error("Artifact not found");
            
            Object.assign(artifact, changes, {
                updatedAt: new Date().toISOString(),
            });
            return artifact;
        }
        return httpClient<ElaborationArtifact>(`/artifacts/${artifactId}`, {
            method: "PUT",
            body: JSON.stringify(changes),
        });
    },

    async uploadFiles(
        artifactId: string,
        files: FileList
    ): Promise<ArtifactFile[]> {
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const newFiles: ArtifactFile[] = Array.from(files).map(
                (file, idx) => ({
                    id: `f${Date.now()}-${idx}`,
                    artifactId,
                    filename: file.name,
                    url: `/files/${file.name}`,
                    mimetype: file.type,
                    uploadedAt: new Date().toISOString(),
                })
            );
            
            if (!mockFiles[artifactId]) {
                mockFiles[artifactId] = [];
            }
            mockFiles[artifactId].push(...newFiles);
            return newFiles;
        }

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("files", file);
        });

        const response = await fetch(`/artifacts/${artifactId}/upload`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Error uploading files");
        }

        return response.json();
    },

    async getFiles(artifactId: string): Promise<ArtifactFile[]> {
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return mockFiles[artifactId] || [];
        }
        return httpClient<ArtifactFile[]>(`/artifacts/${artifactId}/files`);
    },

    async validatePhase(projectId: string): Promise<ValidationResult> {
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, 400));
            const artifacts = mockArtifacts.filter(
                (a) => a.projectId === projectId
            );
            const missingRequired = artifacts.filter(
                (a) => a.required && a.status !== "delivered"
            );

            return {
                allowAdvance: missingRequired.length === 0,
                missingRequiredArtifacts: missingRequired.map((a) => ({
                    id: a.id,
                    title: a.title,
                    type: a.type,
                    status: a.status,
                })),
            };
        }
        return httpClient<ValidationResult>(
            `/projects/${projectId}/phase/Elaboration/validate`
        );
    },
};
