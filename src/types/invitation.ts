export interface ProjectInvitation {
    id: string;
    projectId: string;
    projectName: string;
    invitedEmail: string;
    roleId: string;
    roleName: string;
    invitedBy: string;
    inviterName: string;
    invitationToken: string;
    status: "pending" | "accepted" | "rejected" | "expired";
    expiresAt: string;
    createdAt: string;
}

export interface CreateInvitation {
    projectId: string;
    invitedEmail: string;
    roleId: string;
}
