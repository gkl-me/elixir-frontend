"use client";

import React, { useState } from "react";
import { LogOut, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { handleLogoutAllDevicesAction } from "@/app/actions/auth.action";

interface SignoutAllDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignoutAllDevicesModal({
  isOpen,
  onClose,
}: SignoutAllDevicesModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSignoutAll = async () => {
    setLoading(true);
    await handleLogoutAllDevicesAction();
    setLoading(false);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign Out of All Devices"
      description="Are you sure you want to sign out of all active sessions?"
      className="sm:max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/20">
            <ShieldAlert className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Sign out everywhere
            </p>
            <p className="text-xs text-red-200/70">
              All active sessions on all browsers and devices will be
              terminated.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#6b7db3]">
          You will need to log back in on every device. This action cannot be
          undone.
        </p>

        <div className="flex gap-2 border-t border-[#1e2a4a] pt-3">
          <Button
            onClick={handleSignoutAll}
            disabled={loading}
            className="flex-1 gap-2 bg-red-500 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Sign Out All Devices
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
