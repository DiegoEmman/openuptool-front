import { useState, useEffect } from "react";
import { notificationService } from "../../services/notificationService";
import { InvitationModal } from "./InvitationModal";
import type { Notification } from "../../types/notification";

interface NotificationsDropdownProps {
    onClose: () => void;
    onNotificationRead: () => void;
}

export function NotificationsDropdown({
    onClose,
    onNotificationRead,
}: NotificationsDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInvitationModal, setShowInvitationModal] = useState(false);
    const [selectedNotification, setSelectedNotification] =
        useState<Notification | null>(null);

    useEffect(() => {
        fetchNotifications();

        // Close dropdown when clicking outside
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".notifications-dropdown")) {
                onClose();
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [onClose]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getAll();
            setNotifications(data.slice(0, 10)); // Show last 10
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(
                notifications.map((n) =>
                    n.id === id
                        ? {
                              ...n,
                              isRead: true,
                              readAt: new Date().toISOString(),
                          }
                        : n
                )
            );
            onNotificationRead();
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(
                notifications.map((n) => ({
                    ...n,
                    isRead: true,
                    readAt: new Date().toISOString(),
                }))
            );
            onNotificationRead();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        // Si es una invitación, mostrar el modal de confirmación
        if (notification.type === "invitation") {
            setSelectedNotification(notification);
            setShowInvitationModal(true);
            return;
        }

        // Para otros tipos de notificación, comportamiento normal
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }

        if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
        }
    };

    const handleInvitationSuccess = () => {
        fetchNotifications();
        onNotificationRead();
    };

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            invitation_received: "📧",
            invitation_accepted: "✅",
            invitation_rejected: "❌",
            user_added_to_project: "👥",
            artifact_uploaded: "📎",
            iteration_updated: "🔄",
            project_updated: "📋",
        };
        return icons[type] || "📬";
    };

    const formatTimeAgo = (date: string) => {
        const seconds = Math.floor(
            (new Date().getTime() - new Date(date).getTime()) / 1000
        );

        if (seconds < 60) return "hace un momento";
        if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`;
        if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`;
        return `hace ${Math.floor(seconds / 86400)} días`;
    };

    return (
        <div className="notifications-dropdown absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Notificaciones</h3>
                {notifications.some((n) => !n.isRead) && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        ⏳ Cargando...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No tienes notificaciones
                    </div>
                ) : (
                    <div>
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() =>
                                    handleNotificationClick(notification)
                                }
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                    !notification.isRead ? "bg-blue-50" : ""
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <span className="text-2xl">
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {notification.title}
                                            </p>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(
                                                            notification.id
                                                        );
                                                    }}
                                                    className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                                                >
                                                    ✓
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatTimeAgo(
                                                notification.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="p-3 text-center border-t border-gray-200">
                    <a
                        href="/notifications"
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Ver todas las notificaciones
                    </a>
                </div>
            )}

            {showInvitationModal && selectedNotification && (
                <InvitationModal
                    notification={selectedNotification}
                    onClose={() => {
                        setShowInvitationModal(false);
                        setSelectedNotification(null);
                    }}
                    onSuccess={handleInvitationSuccess}
                />
            )}
        </div>
    );
}
