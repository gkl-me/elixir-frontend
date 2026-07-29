"use client";

import React, { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { logoutAction } from "@/app/actions/auth.action";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logoutAction();
    setLoading(false);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Logout"
      description="Are you sure you want to log out of your account?"
      className="sm:max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#8735C9]/15">
            <LogOut className="h-4 w-4 text-[#c084fc]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              End current session
            </p>
            <p className="text-xs text-[#6b7db3]">
              You will be signed out on this device and redirected to login.
            </p>
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#1e2a4a] pt-3">
          <Button
            onClick={handleLogout}
            disabled={loading}
            className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Log Out
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
