import { useState, useEffect } from "react";
import { invitationService } from "../../services/invitationService";

interface InviteUserModalProps {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface Role {
    id: string;
    name: string;
}

export function InviteUserModal({
    projectId,
    isOpen,
    onClose,
    onSuccess,
}: InviteUserModalProps) {
    const [email, setEmail] = useState("");
    const [roleId, setRoleId] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen]);

    const fetchRoles = async () => {
        try {
            const token =
                localStorage.getItem("openuptool_token") ||
                localStorage.getItem("token") ||
                "";
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/Auth/roles`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!response.ok)
                throw new Error("No se pudieron obtener los roles");
            const data = (await response.json()) as Role[];
            setRoles(data);
            if (data.length > 0) setRoleId(data[0].id);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !roleId) {
            alert("Por favor completa todos los campos");
            return;
        }

        setLoading(true);
        try {
            await invitationService.create({
                projectId,
                email: email,
                roleId,
            });
            alert("Invitación enviada exitosamente");
            setEmail("");
            setRoleId(roles[0]?.id || "");
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Error sending invitation:", error);
            alert("Error al enviar la invitación");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        Invitar Usuario al Proyecto
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email del Usuario
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="usuario@ejemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rol en el Proyecto
                        </label>
                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "Enviando..." : "Enviar Invitación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
