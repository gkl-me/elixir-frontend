'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { MainSidebar } from './MainSidebar';
import { ProjectSidebar } from './ProjectSidebar';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
}) => {
  // Desktop: expanded ↔ icon-only collapsed.  Mobile: hidden ↔ full overlay.
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState('owner');

  const pathname = usePathname();
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  // e.g. ['demo', 'projects', 'p1', 'backlogs']
  const isProjectView = pathParts[0] === 'demo' && pathParts[1] === 'projects' && pathParts.length > 2;
  const activeProjectId = isProjectView ? pathParts[2] : null;

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile]);

  const sidebarContent = isProjectView ? (
    <ProjectSidebar
      activeProjectId={activeProjectId}
      collapsed={!sidebarOpen && !isMobile}
    />
  ) : (
    <MainSidebar
      userRole={userRole}
      collapsed={!sidebarOpen && !isMobile}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#040A1D] text-white antialiased">
      {/* ── Mobile overlay backdrop ──────────────────────────────── */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={[
          'flex-shrink-0 flex flex-col border-r border-[#1e2a4a] overflow-hidden transition-all duration-300 ease-in-out',
          !isMobile && (sidebarOpen ? 'w-60' : 'w-[60px]'),
          isMobile
            ? `fixed left-0 top-0 h-full z-40 w-72 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`
            : 'relative',
        ].filter(Boolean).join(' ')}
      >
        {sidebarContent}
      </aside>

      {/* ── Main Area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#040A1D] min-w-0">
        <Navbar
          isProjectView={isProjectView}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => isMobile ? setMobileOpen(p => !p) : setSidebarOpen(p => !p)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};

