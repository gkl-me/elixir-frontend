'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section, Toggle } from './shared';

type NotifPrefs = {
  taskAssigned: boolean;
  taskMentioned: boolean;
  sprintStart: boolean;
  sprintEnd: boolean;
  memberJoined: boolean;
  weeklyDigest: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  slackEnabled: boolean;
};

export const NotificationsTab = () => {
  const [prefs, setPrefs] = useState<NotifPrefs>({
    taskAssigned: true,
    taskMentioned: true,
    sprintStart: true,
    sprintEnd: true,
    memberJoined: false,
    weeklyDigest: true,
    emailEnabled: true,
    inAppEnabled: true,
    slackEnabled: false,
  });

  const toggle = (k: keyof NotifPrefs) =>
    setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-6">
      <Section title="Delivery Channels">
        <div className="divide-y divide-[#1e2a4a]">
          <Toggle
            label="In-App Notifications"
            description="Show notifications inside the app"
            checked={prefs.inAppEnabled}
            onChange={() => toggle('inAppEnabled')}
          />
          <Toggle
            label="Email Notifications"
            description="Receive notifications by email"
            checked={prefs.emailEnabled}
            onChange={() => toggle('emailEnabled')}
          />
          <Toggle
            label="Slack Integration"
            description="Forward notifications to Slack"
            checked={prefs.slackEnabled}
            onChange={() => toggle('slackEnabled')}
          />
        </div>
      </Section>

      <Section title="Event Preferences" description="Choose which events notify you.">
        <div className="divide-y divide-[#1e2a4a]">
          <Toggle
            label="Task Assigned to Me"
            checked={prefs.taskAssigned}
            onChange={() => toggle('taskAssigned')}
          />
          <Toggle
            label="Mentioned in a Task"
            checked={prefs.taskMentioned}
            onChange={() => toggle('taskMentioned')}
          />
          <Toggle
            label="Sprint Started"
            checked={prefs.sprintStart}
            onChange={() => toggle('sprintStart')}
          />
          <Toggle
            label="Sprint Ending Soon"
            checked={prefs.sprintEnd}
            onChange={() => toggle('sprintEnd')}
          />
          <Toggle
            label="New Member Joined"
            checked={prefs.memberJoined}
            onChange={() => toggle('memberJoined')}
          />
          <Toggle
            label="Weekly Summary Digest"
            description="Sent every Monday morning"
            checked={prefs.weeklyDigest}
            onChange={() => toggle('weeklyDigest')}
          />
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-[#1e2a4a]">
          <Button
            onClick={() =>
              console.log('[API TODO] PATCH /api/users/me/notification-prefs', prefs)
            }
            className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
        </div>
      </Section>
    </div>
  );
};
