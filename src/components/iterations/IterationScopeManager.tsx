import { useState, useEffect } from "react";
import { iterationScopeService } from "../../services/iterationScopeService";
import { userStoryService } from "../../services/userStoryService";
import { artifactService } from "../../services/artifactService";
import type { IterationScope, AddToScope } from "../../types/iterationScope";
import type { UserStory } from "../../types/userStory";
import type { Artifact } from "../../types/artifact";

interface IterationScopeManagerProps {
    iterationId: string;
    projectId: string;
}

export function IterationScopeManager({
    iterationId,
    projectId,
}: IterationScopeManagerProps) {
    const [scopeItems, setScopeItems] = useState<IterationScope[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"stories" | "artifacts">(
        "stories"
    );
    const [stories, setStories] = useState<UserStory[]>([]);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScopeItems();
    }, [iterationId]);

    const fetchScopeItems = async () => {
        setLoading(true);
        try {
            const data =
                await iterationScopeService.getByIteration(iterationId);
            setScopeItems(data);
        } catch (error) {
            console.error("Error fetching scope items:", error);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = async () => {
        setShowAddModal(true);
        try {
            const [storiesData, artifactsData] = await Promise.all([
                userStoryService.getByProject(projectId),
                artifactService.getAll(projectId),
            ]);
            setStories(storiesData);
            setArtifacts(artifactsData);
        } catch (error) {
            console.error("Error loading items:", error);
        }
    };

    const handleAddToScope = async (
        itemType: "story" | "artifact",
        itemId: string
    ) => {
        try {
            const data: AddToScope = {
                iterationId,
                itemType,
                itemId,
                description: "",
                estimatedHours: 0,
            };

            await iterationScopeService.addToScope(data);
            alert(
                `${itemType === "story" ? "Historia" : "Artefacto"} agregado al alcance`
            );
            fetchScopeItems();
            setShowAddModal(false);
        } catch (error) {
            console.error("Error adding to scope:", error);
            alert("Error al agregar al alcance");
        }
    };

    const handleRemoveFromScope = async (id: string) => {
        if (!confirm("¿Eliminar este ítem del alcance?")) return;

        try {
            await iterationScopeService.removeFromScope(id);
            fetchScopeItems();
        } catch (error) {
            console.error("Error removing from scope:", error);
            alert("Error al eliminar del alcance");
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            not_started: "bg-gray-100 text-gray-800",
            in_progress: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            blocked: "bg-red-100 text-red-800",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.not_started}`}
            >
                {status.replace("_", " ")}
            </span>
        );
    };

    const getTypeBadge = (type: string) => {
        return type === "story" ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                📖 Historia
            </span>
        ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                📎 Artefacto
            </span>
        );
    };

    if (loading) {
        return <div className="text-center py-8">⏳ Cargando alcance...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                    Alcance de la Iteración
                </h3>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    ➕ Agregar al Alcance
                </button>
            </div>

            {scopeItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No hay ítems en el alcance de esta iteración
                </div>
            ) : (
                <div className="space-y-3">
                    {scopeItems.map((item) => (
                        <div
                            key={item.id}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        {getTypeBadge(item.itemType)}
                                        {getStatusBadge(item.status)}
                                    </div>
                                    <h4 className="font-medium text-gray-900">
                                        {item.itemTitle}
                                    </h4>
                                    {item.description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <span>
                                            ⏱️ {item.estimatedHours}h estimadas
                                        </span>
                                        {item.assignedUserName && (
                                            <span>
                                                👤 {item.assignedUserName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        handleRemoveFromScope(item.id)
                                    }
                                    className="ml-4 text-red-600 hover:text-red-800"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add to Scope Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">
                                Agregar al Alcance
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex space-x-2 mb-4 border-b">
                            <button
                                onClick={() => setActiveTab("stories")}
                                className={`px-4 py-2 font-medium ${
                                    activeTab === "stories"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                📖 Historias de Usuario
                            </button>
                            <button
                                onClick={() => setActiveTab("artifacts")}
                                className={`px-4 py-2 font-medium ${
                                    activeTab === "artifacts"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                📎 Artefactos
                            </button>
                        </div>

                        <div className="space-y-2">
                            {activeTab === "stories" ? (
                                stories.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        No hay historias disponibles
                                    </p>
                                ) : (
                                    stories.map((story) => (
                                        <div
                                            key={story.id}
                                            className="border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium">
                                                    {story.title}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {story.description}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                                        Prioridad:{" "}
                                                        {story.priority}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                                        {story.storyPoints} pts
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleAddToScope(
                                                        "story",
                                                        story.id
                                                    )
                                                }
                                                className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    ))
                                )
                            ) : artifacts.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">
                                    No hay artefactos disponibles
                                </p>
                            ) : (
                                artifacts.map((artifact) => (
                                    <div
                                        key={artifact.id}
                                        className="border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium">
                                                {artifact.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {artifact.description}
                                            </p>
                                            <span className="text-xs px-2 py-1 bg-gray-100 rounded mt-1 inline-block">
                                                {artifact.isMandatory
                                                    ? "Obligatorio"
                                                    : "Opcional"}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleAddToScope(
                                                    "artifact",
                                                    artifact.id
                                                )
                                            }
                                            className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
