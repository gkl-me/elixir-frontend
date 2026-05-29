'use client';

import React from 'react';
import { Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/modal/CustomModal';
import { CustomRole } from '../shared';

export const DeleteRoleModal = ({
  role,
  onClose,
}: {
  role: CustomRole;
  onClose: () => void;
}) => (
  <CustomModal
    isOpen
    onClose={onClose}
    title="Delete Role"
    description={`Are you sure you want to delete "${role.name}"?`}
    className="sm:max-w-sm"
  >
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#07112b] border border-[#1e2a4a] rounded-xl">
        <div className="w-9 h-9 rounded-xl bg-[#8735C9]/15 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-[#c084fc]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{role.name}</p>
          <p className="text-xs text-[#6b7db3]">{role.permissions.length} permissions</p>
        </div>
      </div>
      <p className="text-xs text-[#6b7db3]">
        Members assigned this role will fall back to the default Member role. This action cannot be undone.
      </p>
      <div className="flex gap-2 pt-1 border-t border-[#1e2a4a]">
        <Button
          onClick={() => { console.log('[API TODO] DELETE /api/roles/', role.id); onClose(); }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold gap-2"
        >
          <Trash2 className="w-4 h-4" />Delete Role
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
