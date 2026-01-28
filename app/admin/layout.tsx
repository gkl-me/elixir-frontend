import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-navyDark flex flex-col">
      
      {/* Top header */}
      <Header />

      {/* Body */}
      <div className="flex flex-1 min-w-0">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}
