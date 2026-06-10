"use client";

import React, { useState, useRef, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  X,
  CheckCheck,
  FolderKanban,
  CheckSquare,
  Users,
  UserCircle,
  AtSign,
  Menu,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  demoNotifications,
  demoSearchIndex,
  SearchResult,
} from "../../../data/demoData";
import { cn } from "@/lib/utils";
import { NOTIFICATION_CONFIG, NotificationType } from "../../../lib/theme";
import { logoutAction } from "@/app/actions/auth.action";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";

const kindIcon: Record<SearchResult["kind"], React.ReactNode> = {
  project: <FolderKanban className="h-4 w-4 text-[#8735C9]" />,
  task: <CheckSquare className="h-4 w-4 text-sky-400" />,
  member: <UserCircle className="h-4 w-4 text-emerald-400" />,
  team: <Users className="h-4 w-4 text-amber-400" />,
};

interface NavbarProps {
  isProjectView: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results =
    query.length > 1
      ? demoSearchIndex
          .filter(
            (r) =>
              r.label.toLowerCase().includes(query.toLowerCase()) ||
              r.sublabel?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 8)
      : [];

  const [notifications, setNotifications] = useState(demoNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const userName = useWorkspaceStore((s) => s.context?.name);
  const userEmail = useWorkspaceStore((s) => s.context?.email);
  const userAvatar = useWorkspaceStore((s) => s.context?.avatarUrl);
  const workspaceSlug = useWorkspaceStore((s) => s.context?.workspaceSlug);

  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setSearchFocused(true);
      searchRef.current.focus();
      inputRef.current.focus();
    }
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <header className="relative z-20 flex h-14 flex-shrink-0 items-center gap-3 border-b border-[#1e2a4a] bg-[#07112b] px-3 md:px-4">
      {/* ── Hamburger toggle ───────────────────────────────────── */}
      <button
        onClick={onToggleSidebar}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[#6b7db3] transition-colors hover:bg-[#0f1d3d] hover:text-white"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* ── Search — centred in the header ─────────────────────── */}
      <div ref={searchRef} className="flex flex-1 justify-center">
        <div className="relative w-full max-w-md">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200",
              searchFocused
                ? "border-[#8735C9] bg-[#0C1635] shadow-[0_0_0_3px_rgba(135,53,201,0.15)]"
                : "border-[#1e2a4a] bg-[#0a1327] hover:border-[#293d6b]"
            )}
          >
            <Search className="h-4 w-4 flex-shrink-0 text-[#4B5578]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search projects, tasks, members..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#4B5578]"
            />
            <div className="flex flex-shrink-0 items-center gap-1.5">
              {query ? (
                <button onClick={() => setQuery("")}>
                  <X className="h-3.5 w-3.5 text-[#4B5578] hover:text-white" />
                </button>
              ) : (
                <kbd className="hidden rounded border border-[#1e2a4a] bg-[#132353] px-1.5 py-0.5 font-mono text-[10px] text-[#4B5578] sm:flex">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          {/* Search results dropdown */}
          {searchFocused && query.length > 1 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[#1e2a4a] bg-[#0C1635] shadow-2xl shadow-black/40">
              {results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[#4B5578]">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setQuery("");
                      setSearchFocused(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[#132353]"
                  >
                    {kindIcon[r.kind]}
                    <div className="min-w-0 flex-1 text-left">
                      <div className="truncate text-sm font-medium text-white">
                        {r.label}
                      </div>
                      {r.sublabel && (
                        <div className="truncate text-xs text-[#6b7db3]">
                          {r.sublabel}
                        </div>
                      )}
                    </div>
                    <span className="flex-shrink-0 text-[10px] capitalize text-[#4B5578]">
                      {r.kind}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right actions ──────────────────────────────────────── */}
      <div className="flex flex-shrink-0 items-center gap-1.5">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[#6b7db3] transition-colors hover:bg-[#0f1d3d] hover:text-white"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#8735C9] ring-2 ring-[#07112b]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0C1635] shadow-2xl shadow-black/50 sm:w-[380px]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1e2a4a] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#8735C9] px-2 py-0.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, read: true }))
                    )
                  }
                  className="flex items-center gap-1.5 text-[11px] text-[#6b7db3] transition-colors hover:text-white"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              </div>

              {/* List */}
              <div className="scrollbar-hide max-h-[320px] divide-y divide-[#1e2a4a] overflow-y-auto">
                {notifications.slice(0, 5).map((n) => {
                  const cfg = NOTIFICATION_CONFIG[n.type as NotificationType];
                  const Icon = cfg?.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 px-5 py-3.5 transition-colors",
                        n.read
                          ? "opacity-60 hover:opacity-80"
                          : "hover:bg-[#0f1d3d]"
                      )}
                    >
                      <div
                        className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: cfg?.bg ?? "#0C1635" }}
                      >
                        {Icon && (
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: cfg.color }}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-xs font-semibold leading-snug",
                            n.read ? "text-[#8b9cc8]" : "text-white"
                          )}
                        >
                          {n.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-[#6b7db3]">
                          {n.description}
                        </p>
                        <p className="mt-1 text-[10px] text-[#4B5578]">
                          {n.timestamp}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#8735C9]" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-[#1e2a4a] px-5 py-3 text-center">
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    router.push("/demo/notifications");
                  }}
                  className="hover:text-purple-300 text-xs font-medium text-[#8735C9] transition-colors"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar + User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((p) => !p)}
            className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-[#0f1d3d]"
          >
            <Avatar className="h-7 w-7 border border-[#4B2070]">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="bg-[#4B2070] text-xs">
                {userName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-xs font-semibold capitalize text-[#8b9cc8] sm:block">
              {userName}
            </span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 min-w-[200px] overflow-hidden rounded-xl border border-[#1e2a4a] bg-[#0C1635] shadow-xl">
              {/* User info header */}
              <div className="border-b border-[#1e2a4a] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 flex-shrink-0 border border-[#4B2070]">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback className="bg-[#4B2070] text-xs">
                      {userName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">
                      {userName}
                    </p>
                    <p className="truncate text-[10px] text-[#4B5578]">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav shortcuts */}
              <div className="p-1">
                {[
                  { label: "Profile", view: "settings", icon: UserCircle },
                  { label: "Settings", view: "settings", icon: AtSign },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        router.push(`/workspace/${workspaceSlug}/${item.view}`);
                        setUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#8b9cc8] transition-colors hover:bg-[#0f1d3d] hover:text-white"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#6b7db3]" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Logout */}
              <div className="border-t border-[#1e2a4a] p-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
