"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  ChevronLeft,
  Check,
  Trash2,
  X,
  UserPlus,
  ArrowRight,
  Settings,
  Crown,
  Shield,
} from "lucide-react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { DataTable } from "@/components/table/DataTable";
import { demoTeams, demoMembers } from "../../../data/demoData";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────
type TeamType = (typeof demoTeams)[0];

// ─── Helpers ──────────────────────────────────────────────
const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
const GRADS = [
  "from-[#8735C9] to-[#6a29a0]",
  "from-[#3b82f6] to-[#1d4ed8]",
  "from-[#10b981] to-[#059669]",
  "from-[#f59e0b] to-[#d97706]",
];
const grad = (name: string) => GRADS[name.charCodeAt(0) % GRADS.length];

const ROLE_BADGE: Record<
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

// ─── Create Team Modal ─────────────────────────────────────
const CreateTeamModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    memberIds: [] as string[],
  });
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const filteredMembers = demoMembers.filter(
    (m) =>
      !q ||
      m.user.name.toLowerCase().includes(q.toLowerCase()) ||
      m.user.email.toLowerCase().includes(q.toLowerCase())
  );
  const toggle = (id: string) =>
    setForm((f) => ({
      ...f,
      memberIds: f.memberIds.includes(id)
        ? f.memberIds.filter((m) => m !== id)
        : [...f.memberIds, id],
    }));

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Create Team"
      description="Organise members into a focused team."
      className="sm:max-w-lg"
    >
      <div className="flex flex-col gap-4">
        <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                setErr("");
              }}
              placeholder="e.g. Frontend Guild"
              className={cn(
                "w-full rounded-xl border bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578]",
                err
                  ? "border-red-400/50"
                  : "border-[#1e2a4a] focus:border-[#8735C9]"
              )}
            />
            {err && <p className="mt-1 text-[11px] text-red-400">{err}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
              Description{" "}
              <span className="font-normal normal-case text-[#4B5578]">
                (optional)
              </span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="What does this team work on?"
              rows={2}
              className="w-full resize-none rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#4B5578] focus:border-[#8735C9]"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
              Add Members{" "}
              <span className="font-normal normal-case text-[#4B5578]">
                (optional)
              </span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search members…"
                className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] py-2 pl-9 pr-4 text-xs text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
              />
            </div>
            <div className="max-h-[180px] space-y-1 overflow-y-auto pr-0.5">
              {filteredMembers.map((m) => {
                const sel = form.memberIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggle(m.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all",
                      sel
                        ? "border-[#8735C9] bg-[#8735C9]/10"
                        : "border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white",
                        grad(m.user.name)
                      )}
                    >
                      {initials(m.user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-xs font-medium",
                          sel ? "text-white" : "text-[#8b9cc8]"
                        )}
                      >
                        {m.user.name}
                      </p>
                      <p className="truncate text-[10px] text-[#4B5578]">
                        {m.user.email}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all",
                        sel
                          ? "border-[#8735C9] bg-[#8735C9]"
                          : "border-[#293d6b]"
                      )}
                    >
                      {sel && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {form.memberIds.length > 0 && (
              <p className="mt-2 text-[11px] text-[#c084fc]">
                {form.memberIds.length} selected
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-2">
          <Button
            onClick={() => {
              if (!form.name.trim()) {
                setErr("Team name is required");
                return;
              }
              onClose();
            }}
            className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90"
          >
            <Users className="h-4 w-4" />
            Create Team
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

// ─── Add Members Modal (reusable) ─────────────────────────
const AddMembersModal = ({
  excludeIds,
  onAdd,
  onClose,
}: {
  excludeIds: string[];
  onAdd: (id: string) => void;
  onClose: () => void;
}) => {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const available = demoMembers
    .filter((m) => !excludeIds.includes(m.id))
    .filter(
      (m) =>
        !q ||
        m.user.name.toLowerCase().includes(q.toLowerCase()) ||
        m.user.email.toLowerCase().includes(q.toLowerCase())
    );

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const handleAdd = () => {
    selected.forEach((id) => onAdd(id));
    onClose();
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Add Members"
      description="Select workspace members to add to this team."
      className="sm:max-w-lg"
    >
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search members…"
            className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] py-2.5 pl-9 pr-4 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
          />
        </div>

        {/* Member checklist — scrollable */}
        <div className="max-h-[50vh] space-y-1.5 overflow-y-auto pr-0.5">
          {available.length === 0 && (
            <p className="py-6 text-center text-[11px] text-[#4B5578]">
              {demoMembers.filter((m) => !excludeIds.includes(m.id)).length ===
              0
                ? "All workspace members are already in this team."
                : "No members match your search."}
            </p>
          )}
          {available.map((m) => {
            const sel = selected.includes(m.id);
            const badge = ROLE_BADGE[m.role] ?? ROLE_BADGE.member;
            const Icon = badge.icon;
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                  sel
                    ? "border-[#8735C9] bg-[#8735C9]/10"
                    : "border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
                    grad(m.user.name)
                  )}
                >
                  {initials(m.user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      sel ? "text-white" : "text-[#8b9cc8]"
                    )}
                  >
                    {m.user.name}
                  </p>
                  <p className="truncate text-[11px] text-[#4B5578]">
                    {m.user.email}
                  </p>
                </div>
                <span
                  className={cn(
                    "mr-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
                    badge.bg
                  )}
                  style={{ color: badge.color }}
                >
                  <Icon className="h-2.5 w-2.5" />
                  {m.role}
                </span>
                <div
                  className={cn(
                    "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all",
                    sel ? "border-[#8735C9] bg-[#8735C9]" : "border-[#293d6b]"
                  )}
                >
                  {sel && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pinned footer */}
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-2">
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0}
            className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            <UserPlus className="h-4 w-4" />
            Add{" "}
            {selected.length > 0
              ? `${selected.length} Member${selected.length > 1 ? "s" : ""}`
              : "Members"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

// ─── Member cell renderer (shared) ───────────────────────
type MemberRow = (typeof demoMembers)[0];

const MemberCell = ({ m }: { m: MemberRow }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
          grad(m.user.name)
        )}
      >
        {initials(m.user.name)}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">
          {m.user.name}
        </p>
        <p className="truncate text-[11px] text-[#6b7db3]">{m.user.email}</p>
      </div>
    </div>
  );
};

const RoleCell = ({ m }: { m: MemberRow }) => {
  const badge = ROLE_BADGE[m.role] ?? ROLE_BADGE.member;
  const Icon = badge.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize",
        badge.bg
      )}
      style={{ color: badge.color }}
    >
      <Icon className="h-2.5 w-2.5" />
      {m.role}
    </span>
  );
};

// ─── Remove Team Member Confirm Modal ─────────────────────
const RemoveTeamMemberModal = ({
  member,
  teamName,
  onConfirm,
  onClose,
}: {
  member: MemberRow;
  teamName: string;
  onConfirm: () => void;
  onClose: () => void;
}) => (
  <CustomModal
    isOpen
    onClose={onClose}
    title="Remove from Team"
    description={`Remove ${member.user.name} from ${teamName}?`}
    className="sm:max-w-sm"
  >
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
            grad(member.user.name)
          )}
        >
          {initials(member.user.name)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{member.user.name}</p>
          <p className="text-xs text-[#6b7db3]">{member.user.email}</p>
        </div>
      </div>
      <p className="text-xs text-[#6b7db3]">
        They will lose access to all team resources but remain a workspace
        member.
      </p>
      <div className="flex gap-2 border-t border-[#1e2a4a] pt-1">
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 gap-2 bg-red-500 font-semibold text-white hover:bg-red-600"
        >
          <X className="h-4 w-4" />
          Remove from Team
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </div>
  </CustomModal>
);

// ─── Team Manage Page ──────────────────────────────────────
const TeamManagePage = ({
  team,
  onBack,
}: {
  team: TeamType;
  onBack: () => void;
}) => {
  const [memberIds, setMemberIds] = useState([...team.memberIds]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<MemberRow | null>(null);

  const PAGE = 5;

  const currentMembers = useMemo(
    () => demoMembers.filter((m) => memberIds.includes(m.id)),
    [memberIds]
  );

  // Filtered + paginated — current members
  const [memberSearch, setMemberSearch] = useState("");
  const [memberPage, setMemberPage] = useState(0);
  const [memberSort, setMemberSort] = useState<SortingState>([]);

  const filteredCurrent = useMemo(
    () =>
      currentMembers.filter(
        (m) =>
          !memberSearch ||
          m.user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
          m.user.email.toLowerCase().includes(memberSearch.toLowerCase())
      ),
    [currentMembers, memberSearch]
  );
  const pagedCurrent = useMemo(
    () => filteredCurrent.slice(memberPage * PAGE, (memberPage + 1) * PAGE),
    [filteredCurrent, memberPage]
  );

  const removeMember = (id: string) =>
    setMemberIds((ids) => ids.filter((m) => m !== id));

  // Columns — current members
  const currentCols: ColumnDef<MemberRow>[] = [
    {
      accessorKey: "user.name",
      header: "Member",
      cell: ({ row }) => <MemberCell m={row.original} />,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <RoleCell m={row.original} />,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const m = row.original;
        return (
          <button
            onClick={() => setRemoveTarget(m)}
            className="hover:bg-red-400/08 flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-red-400/70 transition-all hover:border-red-400/20 hover:text-red-400"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        );
      },
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {/* Back header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 text-sm font-medium text-[#6b7db3] transition-colors hover:text-white"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Teams
        </button>
        <span className="text-[#1e2a4a]">/</span>
        <span className="text-sm font-bold text-white">{team.name}</span>
      </div>

      {/* Team header card */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#1e2a4a] bg-[#0C1635] p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] shadow-[0_4px_16px_rgba(135,53,201,0.35)]">
          <Users className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-black text-white">{team.name}</h1>
          <p className="mt-0.5 text-sm text-[#6b7db3]">
            {currentMembers.length} member
            {currentMembers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex -space-x-2">
          {currentMembers.slice(0, 4).map((m, i) => (
            <div
              key={m.id}
              title={m.user.name}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0C1635] bg-gradient-to-br text-[10px] font-bold text-white",
                grad(m.user.name)
              )}
              style={{ zIndex: 10 - i }}
            >
              {initials(m.user.name)}
            </div>
          ))}
          {currentMembers.length > 4 && (
            <div className="z-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0C1635] bg-[#132353]">
              <span className="text-[9px] font-bold text-[#8b9cc8]">
                +{currentMembers.length - 4}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Members section */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0C1635]">
        <div className="flex items-center justify-between border-b border-[#1e2a4a] px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-white">Members</h2>
            <p className="mt-0.5 text-[11px] text-[#6b7db3]">
              {currentMembers.length} in this team
            </p>
          </div>
          <Button
            onClick={() => setAddModalOpen(true)}
            size="sm"
            className="h-8 gap-1.5 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-xs font-semibold text-white hover:opacity-90"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add Member
          </Button>
        </div>

        {/* Current members DataTable */}
        <div className="px-5 py-4">
          <DataTable
            columns={currentCols}
            data={pagedCurrent}
            totalCount={filteredCurrent.length}
            pageIndex={memberPage}
            pageSize={PAGE}
            search={memberSearch}
            sorting={memberSort}
            onPageChange={setMemberPage}
            onSearchChange={(v) => {
              setMemberSearch(v);
              setMemberPage(0);
            }}
            onSortingChange={setMemberSort}
          />
        </div>

        {/* Save footer */}
        <div className="flex items-center justify-between border-t border-[#1e2a4a] bg-[#07112b]/30 px-5 py-4">
          <p className="text-[11px] text-[#4B5578]">
            Changes will be saved when you click Save.
          </p>
          <Button
            onClick={() => {
              onBack();
            }}
            size="sm"
            className="h-8 gap-1.5 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-xs font-semibold text-white hover:opacity-90"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Add Members modal */}
      {addModalOpen && (
        <AddMembersModal
          excludeIds={memberIds}
          onAdd={(id) => setMemberIds((ids) => [...ids, id])}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {/* Remove confirm modal */}
      {removeTarget && (
        <RemoveTeamMemberModal
          member={removeTarget}
          teamName={team.name}
          onConfirm={() => removeMember(removeTarget.id)}
          onClose={() => setRemoveTarget(null)}
        />
      )}

      {/* Danger zone */}
      <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-[#0C1635]">
        <div className="border-b border-red-500/10 px-5 py-4">
          <h2 className="text-sm font-bold text-red-400">Danger Zone</h2>
          <p className="mt-0.5 text-[11px] text-[#6b7db3]">
            Irreversible actions for this team.
          </p>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs font-semibold text-white">Delete this team</p>
            <p className="mt-0.5 text-[11px] text-[#6b7db3]">
              Permanently deletes the team. Members will not be removed from the
              workspace.
            </p>
          </div>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="ml-4 flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Team
            </button>
          ) : (
            <div className="ml-4 flex flex-shrink-0 items-center gap-2">
              <button
                onClick={() => {
                  onBack();
                }}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-[#6b7db3] transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Team Card (simplified) ────────────────────────────────
const TeamCard = ({
  team,
  onManage,
}: {
  team: TeamType;
  onManage: () => void;
}) => {
  const members = demoMembers.filter((m) => team.memberIds.includes(m.id));
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0C1635] transition-all duration-200 hover:border-[#293d6b]">
      <div className="h-0.5 w-full bg-gradient-to-r from-[#8735C9] to-[#60a5fa] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] shadow-[0_2px_8px_rgba(135,53,201,0.3)]">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white transition-colors group-hover:text-[#c084fc]">
                {team.name}
              </p>
              <p className="mt-0.5 text-[10px] text-[#4B5578]">
                {members.length} member{members.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Avatar stack */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((m, i) => (
              <div
                key={m.id}
                title={m.user.name}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0C1635] bg-gradient-to-br text-[10px] font-bold text-white",
                  grad(m.user.name)
                )}
                style={{ zIndex: 10 - i }}
              >
                {initials(m.user.name)}
              </div>
            ))}
            {members.length > 5 && (
              <div className="z-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0C1635] bg-[#132353]">
                <span className="text-[9px] font-bold text-[#8b9cc8]">
                  +{members.length - 5}
                </span>
              </div>
            )}
          </div>
          {members.length === 0 && (
            <p className="text-[11px] italic text-[#4B5578]">No members yet</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e2a4a] px-5 py-3">
        <button
          onClick={onManage}
          className="group/btn flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold text-[#8b9cc8] transition-all hover:bg-[#1e2a4a] hover:text-white"
        >
          <Settings className="h-3.5 w-3.5 text-[#8735C9] transition-colors group-hover/btn:text-[#c084fc]" />
          Manage Team
          <ArrowRight className="ml-auto h-3 w-3 opacity-0 transition-all group-hover/btn:translate-x-0.5 group-hover/btn:opacity-100" />
        </button>
      </div>
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────
export const TeamsView = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [managingTeam, setManagingTeam] = useState<TeamType | null>(null);
  const [search, setSearch] = useState("");

  if (managingTeam) {
    return (
      <TeamManagePage
        team={managingTeam}
        onBack={() => setManagingTeam(null)}
      />
    );
  }

  const filtered = demoTeams.filter(
    (t) => !search || t.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalMembers = new Set(demoTeams.flatMap((t) => t.memberIds)).size;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Teams
          </h1>
          <p className="mt-0.5 text-sm text-[#6b7db3]">
            {demoTeams.length} team{demoTeams.length !== 1 ? "s" : ""} ·{" "}
            {totalMembers} member{totalMembers !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-9 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-sm text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)] hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teams…"
          className="w-full rounded-xl border border-[#1e2a4a] bg-[#0C1635] py-2 pl-9 pr-4 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
        />
      </div>

      {/* Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onManage={() => setManagingTeam(team)}
          />
        ))}
        <button
          onClick={() => setCreateOpen(true)}
          className="group flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#1e2a4a] bg-[#0C1635] p-6 transition-all hover:border-[#8735C9]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-[#1e2a4a] transition-colors group-hover:border-[#8735C9]">
            <Plus className="h-5 w-5 text-[#4B5578] group-hover:text-[#8735C9]" />
          </div>
          <span className="text-xs font-medium text-[#6b7db3] transition-colors group-hover:text-white">
            New team
          </span>
        </button>
      </div>

      {createOpen && <CreateTeamModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
};
