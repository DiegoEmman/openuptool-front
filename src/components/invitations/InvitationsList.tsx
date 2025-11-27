import { useState, useEffect } from "react";
import { invitationService } from "../../services/invitationService";
import type { ProjectInvitation } from "../../types/invitation";

interface InvitationsListProps {
    projectId?: string;
    showMyInvitations?: boolean;
}

export function InvitationsList({
    projectId,
    showMyInvitations = false,
}: InvitationsListProps) {
    const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvitations();
    }, [projectId, showMyInvitations]);

    const fetchInvitations = async () => {
        setLoading(true);
        try {
            const data = showMyInvitations
                ? await invitationService.getMyPending()
                : projectId
                  ? await invitationService.getByProject(projectId)
                  : [];

            setInvitations(data);
        } catch (error) {
            console.error("Error fetching invitations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (token: string) => {
        try {
            await invitationService.accept(token);
            alert("Invitación aceptada exitosamente");
            fetchInvitations();
        } catch (error) {
            console.error("Error accepting invitation:", error);
            alert("Error al aceptar la invitación");
        }
    };

    const handleReject = async (token: string) => {
        if (!confirm("¿Estás seguro de rechazar esta invitación?")) return;

        try {
            await invitationService.reject(token);
            alert("Invitación rechazada");
            fetchInvitations();
        } catch (error) {
            console.error("Error rejecting invitation:", error);
            alert("Error al rechazar la invitación");
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm("¿Cancelar esta invitación?")) return;

        try {
            await invitationService.cancel(id);
            alert("Invitación cancelada");
            fetchInvitations();
        } catch (error) {
            console.error("Error canceling invitation:", error);
            alert("Error al cancelar la invitación");
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            accepted: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            expired: "bg-gray-100 text-gray-800",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.pending}`}
            >
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="text-center py-8">⏳ Cargando invitaciones...</div>
        );
    }

    if (invitations.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                {showMyInvitations
                    ? "No tienes invitaciones pendientes"
                    : "No hay invitaciones para este proyecto"}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b">
                        {showMyInvitations && (
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                Proyecto
                            </th>
                        )}
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Rol
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Invitado Por
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Expira
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Estado
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {invitations.map((invitation) => (
                        <tr
                            key={invitation.id}
                            className="border-b hover:bg-gray-50"
                        >
                            {showMyInvitations && (
                                <td className="px-4 py-3 text-sm">
                                    {invitation.projectName}
                                </td>
                            )}
                            <td className="px-4 py-3 text-sm">
                                {invitation.invitedEmail}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {invitation.roleName}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {invitation.inviterName}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {formatDate(invitation.expiresAt)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {getStatusBadge(invitation.status)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {showMyInvitations &&
                                invitation.status === "pending" ? (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleAccept(
                                                    invitation.invitationToken
                                                )
                                            }
                                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                        >
                                            ✓ Aceptar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleReject(
                                                    invitation.invitationToken
                                                )
                                            }
                                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                        >
                                            ✕ Rechazar
                                        </button>
                                    </div>
                                ) : !showMyInvitations &&
                                  invitation.status === "pending" ? (
                                    <button
                                        onClick={() =>
                                            handleCancel(invitation.id)
                                        }
                                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                                    >
                                        Cancelar
                                    </button>
                                ) : (
                                    <span className="text-gray-400 text-xs">
                                        -
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
