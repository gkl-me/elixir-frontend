'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/modal/CustomModal';
import { Member, allRoles } from '../shared';
import { RoleSelector } from '../RoleSelector';

export const EditMemberRoleModal = ({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) => {
  const roles = allRoles();
  const [role, setRole] = useState(member.role === 'owner' ? 'admin' : member.role);

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Edit Role"
      description={`Changing role for ${member.user.name}`}
      className="sm:max-w-sm"
    >
      <div className="space-y-4">
        <div className="overflow-y-auto max-h-[50vh]">
          <RoleSelector roles={roles} value={role} onChange={setRole} />
        </div>
        <div className="flex gap-2 pt-1 border-t border-[#1e2a4a]">
          <Button
            onClick={() => { console.log('[API TODO] PATCH /api/members/', member.id, { role }); onClose(); }}
            className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold"
          >
            Save Role
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};
