import React from "react";
import { CustomModal } from "@/components/modal/CustomModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <CustomModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Invite Member"
      description="Send an email invitation to add a new member to your workspace."
      className="sm:max-w-[425px]"
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right text-[#9ca3af]">
            Email
          </Label>
          <Input
            id="email"
            placeholder="colleague@company.com"
            className="col-span-3 border-[#4B2070] bg-[#040A1D] text-white focus-visible:ring-[#8735C9]"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="text-right text-[#9ca3af]">
            Role
          </Label>
          <div className="col-span-3">
            <Select defaultValue="member">
              <SelectTrigger className="w-full border-[#4B2070] bg-[#040A1D] text-white focus:ring-[#8735C9]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="border-[#4B2070] bg-[#0C1635] text-white">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="guest">Guest Developer (Custom)</SelectItem>
              </SelectContent>
            </Select>
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
          Send Invite
        </Button>
      </div>
    </CustomModal>
  );
};
