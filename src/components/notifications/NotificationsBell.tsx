import { useState, useEffect } from "react";
import { notificationService } from "../../services/notificationService";
import { NotificationsDropdown } from "./NotificationsDropdown";

export function NotificationsBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchUnreadCount();

        // Poll every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleNotificationRead = () => {
        fetchUnreadCount();
    };

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <NotificationsDropdown
                    onClose={() => setIsOpen(false)}
                    onNotificationRead={handleNotificationRead}
                />
            )}
        </div>
    );
}
