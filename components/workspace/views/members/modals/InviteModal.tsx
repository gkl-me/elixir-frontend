'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import { CustomModal } from '@/components/modal/CustomModal';
import { CustomForm } from '@/components/form/CustomForm';
import { Button } from '@/components/ui/button';
import { allRoles } from '../shared';
import { RoleSelector } from '../RoleSelector';

const inviteSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type InviteValues = z.infer<typeof inviteSchema>;

export const InviteModal = ({ onClose }: { onClose: () => void }) => {
  const [role, setRole] = useState('member');
  const roles = allRoles();

  const handleSubmit = (values: InviteValues) => {
    console.log('[API TODO] POST /api/members/invite', { email: values.email, role });
    onClose();
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Invite Member"
      description="Send an invitation to join this workspace."
      className="sm:max-w-md"
    >
      <div className="space-y-5">
        {/* Email — CustomForm with zod validation */}
        <CustomForm<InviteValues>
          schema={inviteSchema}
          defaultValues={{ email: '' }}
          onSubmit={handleSubmit}
          submitText="Send Invitation"
          fields={[
            {
              name: 'email',
              label: 'Email Address',
              type: 'email',
              placeholder: 'colleague@company.com',
            },
          ]}
        />

        {/* Role selector — outside the form since it's custom UI */}
        <div>
          <label className="block text-xs font-semibold text-[#8b9cc8] mb-2 uppercase tracking-wider">
            Assign Role
          </label>
          <div className="overflow-y-auto max-h-[30vh]">
            <RoleSelector roles={roles} value={role} onChange={setRole} />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onClose}
          className="w-full border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]"
        >
          Cancel
        </Button>
      </div>
    </CustomModal>
  );
};
