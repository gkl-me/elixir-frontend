'use client';

import React from 'react';
import { z } from 'zod';
import { Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CustomForm } from '@/components/form/CustomForm';
import { demoUsers } from '../../../../data/demoData';
import { Section } from './shared';

// ─── Zod schema ───────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  email: z.string().email('Invalid email address'),
  timezone: z.string().min(1, 'Timezone is required'),
  bio: z.string().max(300, 'Bio must be 300 characters or less'),
});

type ProfileValues = z.infer<typeof profileSchema>;

// ─── Textarea custom field component ─────────────────────
const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={3}
    className={`w-full bg-[#07112b] border border-[#1e2a4a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4B5578] focus:outline-none focus:border-[#8735C9] focus:ring-1 focus:ring-[#8735C9] transition-colors resize-none ${className ?? ''}`}
    {...props}
  />
));
TextareaField.displayName = 'TextareaField';

// ─── ProfileTab ───────────────────────────────────────────
export const ProfileTab = () => {
  const user = demoUsers[0];

  const defaultValues: ProfileValues = {
    name: user.name,
    jobTitle: 'Product Manager',
    email: user.email ?? 'alice@acmecorp.com',
    timezone: 'Asia/Kolkata',
    bio: 'Building great products one sprint at a time.',
  };

  const handleSubmit = (values: ProfileValues) => {
    console.log('[API TODO] POST /api/users/me', values);
  };

  return (
    <div className="space-y-6">
      <Section
        title="Personal Information"
        description="Your public profile visible to teammates."
      >
        {/* Avatar row – not part of the form */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative group">
            <Avatar className="w-20 h-20 border-2 border-[#8735C9]/40">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              />
              <AvatarFallback className="bg-[#8735C9] text-white text-xl font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-[#6b7db3] mt-0.5">Owner</p>
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 h-7 text-xs text-[#8735C9] hover:text-white hover:bg-[#132353] px-3 border border-[#8735C9]/30"
            >
              Change avatar
            </Button>
          </div>
        </div>

        {/* Profile form */}
        <CustomForm<ProfileValues>
          schema={profileSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitText="Save Profile"
          fields={[
            {
              name: 'name',
              label: 'Full Name',
              placeholder: 'Your full name',
            },
            {
              name: 'jobTitle',
              label: 'Job Title',
              placeholder: 'e.g. Product Manager',
            },
            {
              name: 'email',
              label: 'Email Address',
              type: 'email',
              placeholder: 'you@example.com',
            },
            {
              name: 'timezone',
              label: 'Timezone',
              placeholder: 'e.g. Asia/Kolkata',
            },
            {
              name: 'bio',
              label: 'Bio',
              placeholder: 'Tell your teammates a bit about yourself…',
              // @ts-expect-error – TextareaField is compatible with the component slot
              component: TextareaField,
            },
          ]}
        />
      </Section>
    </div>
  );
};
