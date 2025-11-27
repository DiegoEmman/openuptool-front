import React from "react";
import { Navbar } from "../../components/common/Navbar";
import { InvitationsList } from "../../components/invitations/InvitationsList";
import { Container, Typography, Box } from "@mui/material";

export function MyInvitationsPage() {
    return (
        <>
            <Navbar />
            <Container sx={{ py: 4 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Mis Invitaciones Pendientes
                </Typography>
                <Box>
                    <InvitationsList showMyInvitations={true} />
                </Box>
            </Container>
        </>
    );
}
