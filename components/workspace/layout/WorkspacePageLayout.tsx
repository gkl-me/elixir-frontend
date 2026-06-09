"use client";

import { WorkspaceLayout } from "@/components/workspace/layout/WorkspaceLayout";
import { CreateRoleModal } from "@/components/workspace/modals/CreateRoleModal";
import { InviteMemberModal } from "@/components/workspace/modals/InviteMemberModal";
import React, { useState } from "react";

export default function WorkspacePageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);

    return (
        <>
            <WorkspaceLayout>{children}</WorkspaceLayout>

            {/* Exposing Modals globally for demo purposes */}
            <InviteMemberModal
                open={inviteModalOpen}
                onOpenChange={setInviteModalOpen}
            />
            <CreateRoleModal
                open={createRoleModalOpen}
                onOpenChange={setCreateRoleModalOpen}
            />
        </>
    );
}
