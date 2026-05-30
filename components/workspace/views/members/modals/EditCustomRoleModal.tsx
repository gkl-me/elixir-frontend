'use client';

import React from 'react';
import { CustomModal } from '@/components/modal/CustomModal';
import { RoleForm } from '../RoleForm';
import { CustomRole } from '../shared';

export const EditCustomRoleModal = ({
  role,
  onClose,
}: {
  role: CustomRole;
  onClose: () => void;
}) => (
  <CustomModal
    isOpen
    onClose={onClose}
    title={`Edit Role · ${role.name}`}
    description="Update role name and permissions."
    className="sm:max-w-xl"
  >
    <RoleForm
      initialName={role.name}
      initialPerms={role.permissions}
      onSave={(name, perms) => {
        console.log('[API TODO] PATCH /api/roles/', role.id, { name, permissions: perms });
        onClose();
      }}
      onClose={onClose}
      saveLabel="Save Changes"
    />
  </CustomModal>
);
