'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/modal/CustomModal';
import { cn } from '@/lib/utils';
import { Member, grad, initials } from '../shared';

export const RemoveMemberModal = ({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) => (
  <CustomModal
    isOpen
    onClose={onClose}
    title="Remove Member"
    description={`Are you sure you want to remove ${member.user.name}?`}
    className="sm:max-w-sm"
  >
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#07112b] border border-[#1e2a4a] rounded-xl">
        <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold', grad(member.user.name))}>
          {initials(member.user.name)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{member.user.name}</p>
          <p className="text-xs text-[#6b7db3]">{member.user.email}</p>
        </div>
      </div>
      <p className="text-xs text-[#6b7db3]">
        This will revoke their workspace access. This action cannot be undone.
      </p>
      <div className="flex gap-2 pt-1 border-t border-[#1e2a4a]">
        <Button
          onClick={() => { }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold gap-2"
        >
          <Trash2 className="w-4 h-4" />Remove Member
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
