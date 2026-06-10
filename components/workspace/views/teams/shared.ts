import { Crown, Shield, Users } from "lucide-react";
import React from "react";
import { WorkspaceTeamsList } from "@/types/IWorkspaceType";
import { Member } from "../members/shared";

export type TeamType = WorkspaceTeamsList;
export type MemberRow = Member;

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export const GRADS = [
  "from-[#8735C9] to-[#6a29a0]",
  "from-[#3b82f6] to-[#1d4ed8]",
  "from-[#10b981] to-[#059669]",
  "from-[#f59e0b] to-[#d97706]",
];

export const grad = (name: string) => GRADS[name.charCodeAt(0) % GRADS.length];

export const ROLE_BADGE: Record<
  string,
  { color: string; bg: string; icon: React.ElementType }
> = {
  owner: {
    color: "#f59e0b",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: Crown,
  },
  admin: {
    color: "#60a5fa",
    bg: "bg-blue-500/10  border-blue-500/30",
    icon: Shield,
  },
  member: {
    color: "#8b9cc8",
    bg: "bg-[#1e2a4a]    border-[#293d6b]",
    icon: Users,
  },
};
