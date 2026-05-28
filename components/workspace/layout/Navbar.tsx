'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell, Search, X, CheckCheck,
  FolderKanban, CheckSquare, Users, UserCircle,
  AtSign, Zap, Timer, Menu, LogOut
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { demoNotifications, demoSearchIndex, demoUsers, Notification, SearchResult } from '../../../data/demoData';
import { cn } from '@/lib/utils';
import { NOTIFICATION_CONFIG, NotificationType } from '../../../lib/theme';

const kindIcon: Record<SearchResult['kind'], React.ReactNode> = {
  project: <FolderKanban className="w-4 h-4 text-[#8735C9]" />,
  task: <CheckSquare className="w-4 h-4 text-sky-400" />,
  member: <UserCircle className="w-4 h-4 text-emerald-400" />,
  team: <Users className="w-4 h-4 text-amber-400" />,
};

interface NavbarProps {
  isProjectView: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sidebarOpen,
  onToggleSidebar,
}) => {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length > 1
    ? demoSearchIndex.filter(r =>
      r.label.toLowerCase().includes(query.toLowerCase()) ||
      r.sublabel?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8)
    : [];

  const [notifications, setNotifications] = useState(demoNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const currentUser = demoUsers[0];

  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setSearchFocused(true)
      searchRef.current.focus()
      inputRef.current.focus()
    }
  }


  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, []);

  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <header className="h-14 flex-shrink-0 flex items-center gap-3 px-3 md:px-4 border-b border-[#1e2a4a] bg-[#07112b] relative z-20">

      {/* ── Hamburger toggle ───────────────────────────────────── */}
      <button
        onClick={onToggleSidebar}
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7db3] hover:bg-[#0f1d3d] hover:text-white transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* ── Search — centred in the header ─────────────────────── */}
      <div ref={searchRef} className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200',
            searchFocused
              ? 'bg-[#0C1635] border-[#8735C9] shadow-[0_0_0_3px_rgba(135,53,201,0.15)]'
              : 'bg-[#0a1327] border-[#1e2a4a] hover:border-[#293d6b]'
          )}>
            <Search className="w-4 h-4 text-[#4B5578] flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search projects, tasks, members..."
              className="bg-transparent text-sm text-white placeholder:text-[#4B5578] outline-none w-full"
            />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {query ? (
                <button onClick={() => setQuery('')}>
                  <X className="w-3.5 h-3.5 text-[#4B5578] hover:text-white" />
                </button>
              ) : (
                <kbd className="hidden sm:flex text-[10px] text-[#4B5578] bg-[#132353] border border-[#1e2a4a] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
              )}
            </div>
          </div>

          {/* Search results dropdown */}
          {searchFocused && query.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0C1635] border border-[#1e2a4a] rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
              {results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[#4B5578]">No results for &ldquo;{query}&rdquo;</div>
              ) : results.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setQuery(''); setSearchFocused(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-[#132353] transition-colors"
                >
                  {kindIcon[r.kind]}
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm text-white font-medium truncate">{r.label}</div>
                    {r.sublabel && <div className="text-xs text-[#6b7db3] truncate">{r.sublabel}</div>}
                  </div>
                  <span className="text-[10px] text-[#4B5578] capitalize flex-shrink-0">{r.kind}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right actions ──────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 flex-shrink-0">

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(p => !p)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#6b7db3] hover:bg-[#0f1d3d] hover:text-white transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8735C9] rounded-full ring-2 ring-[#07112b]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] bg-[#0C1635] border border-[#1e2a4a] rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a4a]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-[#8735C9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                  )}
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="flex items-center gap-1.5 text-[11px] text-[#6b7db3] hover:text-white transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              </div>

              {/* List */}
              <div className="max-h-[320px] overflow-y-auto scrollbar-hide divide-y divide-[#1e2a4a]">
                {notifications.slice(0, 5).map(n => {
                  const cfg = NOTIFICATION_CONFIG[n.type as NotificationType];
                  const Icon = cfg?.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        'flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors',
                        n.read ? 'opacity-60 hover:opacity-80' : 'hover:bg-[#0f1d3d]'
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: cfg?.bg ?? '#0C1635' }}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-xs font-semibold leading-snug', n.read ? 'text-[#8b9cc8]' : 'text-white')}>{n.title}</p>
                        <p className="text-[11px] text-[#6b7db3] mt-0.5 line-clamp-2">{n.description}</p>
                        <p className="text-[10px] text-[#4B5578] mt-1">{n.timestamp}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#8735C9] flex-shrink-0 mt-1.5" />}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-[#1e2a4a] text-center">
                <button
                  onClick={() => { setNotifOpen(false); router.push('/demo/notifications'); }}
                  className="text-xs text-[#8735C9] hover:text-purple-300 transition-colors font-medium"
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
            onClick={() => setUserMenuOpen(p => !p)}
            className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-[#0f1d3d] transition-colors"
          >
            <Avatar className="w-7 h-7 border border-[#4B2070]">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`} />
              <AvatarFallback className="bg-[#4B2070] text-xs">{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-xs font-semibold text-[#8b9cc8] capitalize">{currentUser.name}</span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[#0C1635] border border-[#1e2a4a] rounded-xl shadow-xl z-50 overflow-hidden min-w-[200px]">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-[#1e2a4a]">
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8 border border-[#4B2070] flex-shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`} />
                    <AvatarFallback className="bg-[#4B2070] text-xs">{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#4B5578] truncate">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Nav shortcuts */}
              <div className="p-1">
                {[
                  { label: 'Profile', view: 'settings', icon: UserCircle },
                  { label: 'Settings', view: 'settings', icon: AtSign },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { router.push(`/workspace/${item.view}`); setUserMenuOpen(false); }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white rounded-lg transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#6b7db3]" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Logout */}
              <div className="border-t border-[#1e2a4a] p-1">
                <button
                  onClick={() => { /* TODO: POST /api/auth/logout */ console.log('[API TODO] Logout'); setUserMenuOpen(false); alert('Logout called — wire up POST /api/auth/logout'); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
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
