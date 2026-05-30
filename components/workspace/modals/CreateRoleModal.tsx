import React from 'react';
import { CustomModal } from '@/components/modal/CustomModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({ open, onOpenChange }) => {
  return (
    <CustomModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Create Custom Role"
      description="Define a custom role with granular permissions for your workspace."
      className="sm:max-w-[425px]"
    >
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="roleName" className="text-[#9ca3af]">Role Name</Label>
          <Input id="roleName" placeholder="e.g. Contract Designer" className="bg-[#040A1D] border-[#4B2070] text-white focus-visible:ring-[#8735C9]" />
        </div>
        <div className="space-y-2 mt-2">
          <Label className="text-[#9ca3af]">Permissions</Label>
          <div className="flex flex-col gap-2 p-3 bg-[#040A1D] border border-[#4B2070] rounded-md h-32 overflow-y-auto">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#8735C9]" /> View Projects</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#8735C9]" /> Create Projects</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#8735C9]" /> Manage Members</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#8735C9]" /> Manage Billing</label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#1e2a4a]">
        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-[#9ca3af] hover:text-white hover:bg-[#132353]">Cancel</Button>
        <Button type="submit" className="bg-[#8735C9] hover:bg-[#4B2070] text-white">Create Role</Button>
      </div>
    </CustomModal>
  );
};
