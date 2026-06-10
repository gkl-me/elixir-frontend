"use client";

import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomForm } from "@/components/form/CustomForm";
import { Section } from "./shared";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { handleUpdateProfile } from "@/app/actions/user.action";
import { toastHandler } from "@/lib/toastHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";

// ─── Zod schema ───────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  bio: z.string().max(300, "Bio must be 300 characters or less"),
});

type ProfileValues = z.infer<typeof profileSchema>;

// ─── Textarea custom field component ─────────────────────
const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={3}
    className={`w-full resize-none rounded-lg border border-[#1e2a4a] bg-[#07112b] px-3 py-2 text-sm text-white transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9] focus:outline-none focus:ring-1 focus:ring-[#8735C9] ${className ?? ""}`}
    {...props}
  />
));
TextareaField.displayName = "TextareaField";

// ─── ProfileTab ───────────────────────────────────────────
export const ProfileTab = () => {
  const userName = useWorkspaceStore((s) => s.context?.name);
  const userEmail = useWorkspaceStore((s) => s.context?.email);
  const userAvatarUrl = useWorkspaceStore((s) => s.context?.avatarUrl);
  const updateUser = useWorkspaceStore((s) => s.updateUser);

  const [userDetails, setUserDetails] = useState({
    name: userName,
    email: userEmail,
    avatarUrl: userAvatarUrl,
    jobTitle: "",
    bio: "",
  });

  const [loaded, setLoaded] = useState(false);

  const defaultValues: ProfileValues = {
    name: userDetails.name || "",
    jobTitle: userDetails.jobTitle || "",
    bio: userDetails.bio || "",
  };

  const { execute } = useApi({
    url: NEXT_API_ROUTES.GET_USER_ME,
    method: "GET",
  });

  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await execute();
      if (res.success) {
        setUserDetails({
          name: res.data.name || "",
          email: res.data.email || "",
          avatarUrl: res.data.avatarUrl || "",
          jobTitle: res.data.jobTitle || "",
          bio: res.data.bio || "",
        });
        updateUser({
          name: res.data.name,
          avatarUrl: res.data.avatarUrl,
          email: res.data.email,
        });
      }
    } catch (error) {
      toastHandler({
        success: false,
        message: AxiosErrorHandler(error).message,
      });
    } finally {
      setLoaded(true);
    }
  }, [execute, updateUser]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleSubmit = async (values: ProfileValues) => {
    const res = await handleUpdateProfile(values);
    if (res.success) {
      toastHandler({
        success: true,
        message: res.message,
      });
      updateUser({
        name: values.name,
      });
      await fetchUserDetails();
    } else {
      toastHandler({
        success: false,
        message: res.error,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Section
        title="Personal Information"
        description="Your public profile visible to teammates."
      >
        {/* Avatar row – not part of the form */}
        <div className="mb-6 flex items-center gap-5">
          <div className="group relative">
            <Avatar className="h-20 w-20 border-2 border-[#8735C9]/40">
              <AvatarImage src={userDetails.avatarUrl} />
              <AvatarFallback className="bg-[#8735C9] text-xl font-bold text-white">
                {userDetails.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {userDetails.name}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 h-7 border border-[#8735C9]/30 px-3 text-xs text-[#8735C9] hover:bg-[#132353] hover:text-white"
            >
              Change avatar
            </Button>
          </div>
        </div>

        {/* Profile form */}
        {loaded ? (
          <CustomForm<ProfileValues>
            schema={profileSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitText="Save Profile"
            resetOnSubmit={false}
            fields={[
              {
                name: "name",
                label: "Full Name",
                placeholder: "Your full name",
              },
              {
                name: "jobTitle",
                label: "Job Title",
                placeholder: "e.g. Product Manager",
              },
              {
                name: "bio",
                label: "Bio",
                placeholder: "Tell your teammates a bit about yourself…",
                // @ts-expect-error – TextareaField is compatible with the component slot
                component: TextareaField,
              },
            ]}
          />
        ) : (
          <div className="animate-pulse py-8 text-center text-sm text-[#4B5578]">
            Loading profile information...
          </div>
        )}
      </Section>
    </div>
  );
};
