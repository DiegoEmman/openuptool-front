export interface Notification {
    id: string;
    type:
        | "invitation"
        | "invitation_accepted"
        | "artifact_uploaded"
        | "plan_updated"
        | "iteration_created"
        | "comment_added"
        | "mention";
    title: string;
    message: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    isRead: boolean;
    readAt?: string;
    actionUrl?: string;
    createdAt: string;
}
