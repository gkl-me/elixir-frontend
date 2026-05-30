"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  FolderKanban,
  Users,
  UserSquare2,
  Workflow,
  MessageSquare,
  HardDrive,
  Settings,
  ChevronDown,
  Zap,
  Plus,
  Check,
  Bell,
  Search,
  X,
} from "lucide-react";
import {
  demoWorkspaceList,
  demoProjects,
  WorkspaceSummary,
} from "../../../data/demoData";
import { PLAN_CONFIG } from "../../../lib/theme";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────
interface NavLinkType {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title?: string;
  links: NavLinkType[];
}

interface MainSidebarProps {
  collapsed?: boolean;
}

// ─── Workspace Switcher Dropdown ─────────────────────────
const SHOW_SEARCH_THRESHOLD = 4;

const WorkspaceSwitcherDropdown: React.FC<{
  workspaces: WorkspaceSummary[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}> = ({ workspaces, activeId, onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const showSearch = workspaces.length > SHOW_SEARCH_THRESHOLD;

  const filtered = query.trim()
    ? workspaces.filter(
        (w) =>
          w.name.toLowerCase().includes(query.toLowerCase()) ||
          w.plan.toLowerCase().includes(query.toLowerCase())
      )
    : workspaces;

  const active = filtered.filter((w) => w.id === activeId);
  const others = filtered.filter((w) => w.id !== activeId);
  const ordered = [...active, ...others];

  return (
    <div className="absolute left-2 right-2 top-full z-50 mt-1 flex flex-col overflow-hidden rounded-xl border border-[#1e2a4a] bg-[#0C1635] shadow-2xl shadow-black/60">
      {showSearch && (
        <div className="border-b border-[#1e2a4a] p-2">
          <div className="flex items-center gap-2 rounded-lg border border-[#1e2a4a] bg-[#07112b] px-2 py-1.5 transition-colors focus-within:border-[#8735C9]">
            <Search className="h-3 w-3 flex-shrink-0 text-[#4B5578]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workspaces…"
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#4B5578]"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="h-3 w-3 text-[#4B5578] hover:text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="px-3 pb-0.5 pt-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4B5578]">
          {query
            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
            : `${workspaces.length} workspaces`}
        </p>
      </div>

      <div className="scrollbar-hide max-h-[220px] space-y-0.5 overflow-y-auto p-1.5">
        {ordered.length === 0 ? (
          <div className="py-4 text-center text-xs text-[#4B5578]">
            No workspaces match &ldquo;{query}&rdquo;
          </div>
        ) : (
          ordered.map((ws) => {
            const planCfg = PLAN_CONFIG[ws.plan];
            const isActive = ws.id === activeId;
            return (
              <button
                key={ws.id}
                onClick={() => onSelect(ws.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors",
                  isActive ? "bg-[#132353]" : "hover:bg-[#0f1d3d]"
                )}
              >
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-md"
                  style={{ backgroundColor: ws.avatarColor }}
                >
                  {ws.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div
                    className={cn(
                      "truncate text-sm font-semibold leading-tight",
                      isActive
                        ? "text-white"
                        : "text-[#c9d3ed] group-hover:text-white"
                    )}
                  >
                    {ws.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        color: planCfg?.textColor ?? "#9ca3af",
                        backgroundColor: planCfg?.bg ?? "transparent",
                      }}
                    >
                      {ws.plan}
                    </span>
                    <span className="text-[10px] text-[#4B5578]">
                      · {ws.memberCount} member{ws.memberCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                {isActive && (
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-[#8735C9]" />
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="border-t border-[#1e2a4a] p-1.5">
        <button
          onClick={onClose}
          className="hover:text-purple-300 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[#8735C9] transition-colors hover:bg-[#132353]"
        >
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-[#8735C9]/30 bg-[#8735C9]/10">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-medium">Create new workspace</span>
        </button>
      </div>
    </div>
  );
};

// ─── Main Sidebar ─────────────────────────────────────────
export const MainSidebar: React.FC<MainSidebarProps> = ({
  collapsed = false,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathParts = pathname?.split("/").filter(Boolean) || [];
  const activeView = pathParts[1] || "home";

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("ws1");
  const switcherRef = useRef<HTMLDivElement>(null);

  const activeWorkspace =
    demoWorkspaceList.find((w) => w.id === activeWorkspaceId) ??
    demoWorkspaceList[0];
  const planCfg = PLAN_CONFIG[activeWorkspace.plan];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(e.target as Node)
      ) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // When collapsed, also close projects
  useEffect(() => {
    if (collapsed) {
      setSwitcherOpen(false);
    }
  }, [collapsed]);

  // Categorized nav sections
  const sections: NavSection[] = [
    {
      links: [{ id: "home", label: "Home", icon: Home }],
    },
    {
      title: "Work",
      links: [
        {
          id: "projects",
          label: "Projects",
          icon: FolderKanban,
          badge: demoProjects.length,
        },
        { id: "automation", label: "Automation", icon: Workflow },
      ],
    },
    {
      title: "People",
      links: [
        { id: "teams", label: "Teams", icon: Users },
        { id: "members", label: "Members", icon: UserSquare2 },
      ],
    },
    {
      title: "Communication",
      links: [
        { id: "chat", label: "Chat", icon: MessageSquare },
        { id: "notifications", label: "Inbox", icon: Bell, badge: 3 },
      ],
    },
    {
      title: "Resources",
      links: [{ id: "storage", label: "Storage", icon: HardDrive }],
    },
  ];

  const bottomLinks: NavLinkType[] = [
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Nav button — adapts to collapsed icon-only mode
  const NavButton = ({ link }: { link: NavLinkType }) => {
    const Icon = link.icon;
    const isActive =
      activeView === link.id || (activeView === "home" && link.id === "home");

    // If id is 'home', we navigate to '/demo', otherwise '/demo/[id]'
    const navigateTo =
      link.id === "home" ? "/workspace" : `/workspace/${link.id}`;

    return (
      <div>
        <button
          onClick={() => {
            router.push(navigateTo);
          }}
          title={collapsed ? link.label : undefined}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
            collapsed
              ? "justify-center px-2 py-2.5"
              : "justify-between px-3 py-2",
            isActive
              ? "bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)]"
              : "text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
          )}
        >
          <div
            className={cn("flex items-center gap-3", collapsed && "relative")}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                isActive
                  ? "text-white"
                  : "group-hover:text-purple-300 text-[#6b7db3] transition-colors"
              )}
            />
            {!collapsed && <span>{link.label}</span>}
            {/* Collapsed badge dot */}
            {collapsed && link.badge !== undefined && link.badge > 0 && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#8735C9]" />
            )}
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-[#07112b]">
      {/* ── Workspace Switcher ─────────────────────────── */}
      <div ref={switcherRef} className="relative border-b border-[#1e2a4a] p-2">
        <button
          onClick={() => setSwitcherOpen((p) => !p)}
          className={cn(
            "group flex w-full items-center rounded-xl transition-colors hover:bg-[#0f1d3d]",
            collapsed ? "justify-center p-2" : "gap-2.5 p-2"
          )}
          title={collapsed ? activeWorkspace.name : undefined}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-base font-bold shadow-lg"
            style={{ backgroundColor: activeWorkspace.avatarColor }}
          >
            {activeWorkspace.name.charAt(0)}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-sm font-bold leading-tight text-white">
                  {activeWorkspace.name}
                </div>
                <div
                  className="mt-0.5 flex items-center gap-1"
                  style={{ color: planCfg?.textColor ?? "#9ca3af" }}
                >
                  <Zap className="h-3 w-3" />
                  <span className="text-[11px] font-medium">
                    {activeWorkspace.plan} Plan
                  </span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 flex-shrink-0 text-[#4B5578] transition-all duration-200 group-hover:text-[#8b9cc8]",
                  switcherOpen ? "rotate-180" : ""
                )}
              />
            </>
          )}
        </button>

        {switcherOpen && !collapsed && (
          <WorkspaceSwitcherDropdown
            workspaces={demoWorkspaceList}
            activeId={activeWorkspaceId}
            onSelect={(id) => {
              setActiveWorkspaceId(id);
              setSwitcherOpen(false);
            }}
            onClose={() => setSwitcherOpen(false)}
          />
        )}
      </div>

      {/* ── Categorized Nav ───────────────────────────── */}
      <div className="scrollbar-hide flex flex-1 flex-col gap-3 overflow-y-auto px-2 py-3">
        {sections.map((section, si) => (
          <div key={si}>
            {/* Section title — hidden in collapsed mode */}
            {section.title && !collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#4B5578]">
                {section.title}
              </p>
            )}
            {/* Divider in collapsed mode */}
            {section.title && collapsed && si > 0 && (
              <div className="my-1 border-t border-[#1e2a4a]" />
            )}
            <div className="flex flex-col gap-0.5">
              {section.links.map((link) => (
                <NavButton key={link.id} link={link} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Nav ────────────────────────────────── */}
      <div
        className={cn(
          "flex flex-col gap-0.5 border-t border-[#1e2a4a] px-2 py-2"
        )}
      >
        {bottomLinks.map((link) => (
          <NavButton key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
};
