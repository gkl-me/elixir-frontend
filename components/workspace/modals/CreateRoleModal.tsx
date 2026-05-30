import React from "react";
import { CustomModal } from "@/components/modal/CustomModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  open,
  onOpenChange,
}) => {
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
          <Label htmlFor="roleName" className="text-[#9ca3af]">
            Role Name
          </Label>
          <Input
            id="roleName"
            placeholder="e.g. Contract Designer"
            className="border-[#4B2070] bg-[#040A1D] text-white focus-visible:ring-[#8735C9]"
          />
        </div>
        <div className="mt-2 space-y-2">
          <Label className="text-[#9ca3af]">Permissions</Label>
          <div className="flex h-32 flex-col gap-2 overflow-y-auto rounded-md border border-[#4B2070] bg-[#040A1D] p-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-[#8735C9]" /> View
              Projects
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-[#8735C9]" /> Create
              Projects
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-[#8735C9]" /> Manage
              Members
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-[#8735C9]" /> Manage
              Billing
            </label>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2 border-t border-[#1e2a4a] pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="text-[#9ca3af] hover:bg-[#132353] hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#8735C9] text-white hover:bg-[#4B2070]"
        >
          Create Role
        </Button>
      </div>
    </CustomModal>
  );
};
