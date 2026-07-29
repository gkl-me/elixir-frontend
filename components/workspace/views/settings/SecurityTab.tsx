"use client";

import React, { startTransition, useEffect } from "react";
import { z } from "zod";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomForm } from "@/components/form/CustomForm";
import { PasswordInput } from "@/components/ui/password-input";
import { Section } from "./shared";
import {
  handleChangePassword,
  handleRevokeSessionAction,
} from "@/app/actions/user.action";
import { toastHandler } from "@/lib/toastHandler";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { RevokeSessionData } from "@/types/IUserType";
import { handleLogoutAllDevicesAction } from "@/app/actions/auth.action";
import { formatUserAgent } from "@/lib/formatAgent";
import { SignoutAllDevicesModal } from "@/components/modal/SignoutAllDevicesModal";

// ─── Zod schema ───────────────────────────────────────────
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Must contain at least one symbol"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

// ─── SecurityTab ──────────────────────────────────────────
export const SecurityTab = () => {
  const handlePasswordSubmit = (values: PasswordValues) => {
    startTransition(async () => {
      const res = await handleChangePassword(values.newPassword);

      toastHandler({
        success: res.success,
        message: res.message,
      });
    });
  };

  const handleSession = (data: RevokeSessionData) => {
    startTransition(async () => {
      const res = await handleRevokeSessionAction(data);
      toastHandler({
        success: res.success,
        message: res.message,
      });
      if (res.success) {
        await fetchSessions();
      }
    });
  };

  const handleLogoutAllDevices = () => {
    startTransition(async () => {
      const res = await handleLogoutAllDevicesAction();
    });
  };

  const { execute } = useApi({
    url: NEXT_API_ROUTES.LIST_ACTIVE_SESSIONS,
    method: "GET",
  });

  const [sessions, setSessions] = React.useState([]);

  const fetchSessions = async () => {
    const res = await execute();
    setSessions(res.data.activeSessions);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const [showSignoutAllModal, setShowSignoutAllModal] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Section
        title="Change Password"
        description="Use a strong, unique password."
      >
        <CustomForm<PasswordValues>
          schema={passwordSchema}
          defaultValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          onSubmit={handlePasswordSubmit}
          submitText="Update Password"
          resetOnSubmit={true}
          fields={[
            {
              name: "newPassword",
              label: "New Password",
              placeholder: "••••••••",
              component: PasswordInput,
            },
            {
              name: "confirmPassword",
              label: "Confirm New Password",
              placeholder: "••••••••",
              component: PasswordInput,
            },
          ]}
        />
      </Section>

      {/* Active Sessions */}
      <Section
        title="Active Sessions"
        description="Devices currently signed in."
      >
        <div className="divide-y divide-[#1e2a4a]">
          {JSON.stringify(sessions) === "[]"}
          {sessions.map((s, i) => {
            const device = formatUserAgent(s.userAgent);
            const DeviceIcon = device?.icon;

            console.log("ssss", s.ip);

            return (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#132353]">
                    <DeviceIcon className="h-4 w-4 text-[#6b7db3]" />
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-white">
                      {device.name}
                      {s.isCurrentSession && (
                        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#6b7db3]">
                      {s.ip || "127.0.0.1"}
                    </p>
                  </div>
                </div>
                {!s.isCurrentSession && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleSession({ sessionId: s.sessionId });
                    }}
                    className="h-7 px-2 text-xs text-red-400 hover:bg-red-500/20 hover:text-white"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Sign out all */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowSignoutAllModal(true)}
          className="gap-2 border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign Out of All Devices
        </Button>
      </div>

      <SignoutAllDevicesModal
        isOpen={showSignoutAllModal}
        onClose={() => setShowSignoutAllModal(false)}
      />
    </div>
  );
};
