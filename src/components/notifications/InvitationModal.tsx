import { useState } from "react";
import { invitationService } from "../../services/invitationService";
import { notificationService } from "../../services/notificationService";
import type { Notification } from "../../types/notification";

interface InvitationModalProps {
    notification: Notification;
    onClose: () => void;
    onSuccess: () => void;
}

export function InvitationModal({
    notification,
    onClose,
    onSuccess,
}: InvitationModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Extraer el token de la URL de acción
    const extractToken = (actionUrl?: string): string | null => {
        if (!actionUrl) return null;
        // Formato esperado: /invitations/accept/{token}
        const parts = actionUrl.split("/");
        return parts[parts.length - 1] || null;
    };

    const token = extractToken(notification.actionUrl);

    const handleAccept = async () => {
        if (!token) {
            setError("Token de invitación no válido");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await invitationService.accept(token);

            // Intentar marcar como leída, pero no fallar si hay error
            try {
                await notificationService.markAsRead(notification.id);
            } catch (err) {
                console.warn(
                    "No se pudo marcar la notificación como leída:",
                    err
                );
            }

            onSuccess();
            onClose();

            // Redirigir al inicio después de cerrar el modal
            setTimeout(() => {
                window.location.href = "/projects";
            }, 100);
        } catch (err: any) {
            console.error("Error al aceptar invitación:", err);
            const errorMsg =
                err.response?.data?.message ||
                err.message ||
                "Error desconocido";
            setError(
                `Error al aceptar la invitación: ${errorMsg}. Por favor, intenta nuevamente.`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!token) {
            setError("Token de invitación no válido");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await invitationService.reject(token);

            // Intentar marcar como leída, pero no fallar si hay error
            try {
                await notificationService.markAsRead(notification.id);
            } catch (err) {
                console.warn(
                    "No se pudo marcar la notificación como leída:",
                    err
                );
            }

            onSuccess();
            onClose();

            // Redirigir al inicio después de cerrar el modal
            setTimeout(() => {
                window.location.href = "/projects";
            }, 100);
        } catch (err: any) {
            console.error("Error al rechazar invitación:", err);
            const errorMsg =
                err.response?.data?.message ||
                err.message ||
                "Error desconocido";
            setError(
                `Error al rechazar la invitación: ${errorMsg}. Por favor, intenta nuevamente.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <span className="text-4xl mr-3">📧</span>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Invitación a Proyecto
                        </h2>
                    </div>

                    <div className="mb-6">
                        <p className="text-lg font-semibold text-gray-800 mb-2">
                            {notification.title}
                        </p>
                        <p className="text-gray-600">{notification.message}</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800">
                            ¿Qué deseas hacer con esta invitación?
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleAccept}
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "⏳ Procesando..." : "✓ Aceptar"}
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={loading}
                            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "⏳ Procesando..." : "✗ Rechazar"}
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2 text-sm disabled:text-gray-400"
                    >
                        Decidir más tarde
                    </button>
                </div>
            </div>
        </div>
    );
}
