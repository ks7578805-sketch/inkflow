import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Wand2, ScanEye, FolderKanban, CalendarDays,
  Users, Image, DollarSign, Package,
  BarChart3, Settings, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Painel", path: "/" },
  { icon: Wand2, label: "Stencil IA", path: "/stencil" },
  { icon: ScanEye, label: "Prévia no Corpo", path: "/placement" },
  { icon: FolderKanban, label: "Projetos", path: "/projects" },
  { icon: CalendarDays, label: "Agenda", path: "/calendar" },
  { icon: Users, label: "Clientes", path: "/clients" },
  { icon: Image, label: "Galeria", path: "/flash-gallery" },
  { icon: DollarSign, label: "Financeiro", path: "/finance" },
  { icon: Package, label: "Estoque", path: "/inventory" },
  { icon: BarChart3, label: "Análises", path: "/analytics" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen border-r border-sidebar-border flex flex-col z-50 transition-all duration-300 overflow-hidden",
      collapsed ? "w-[72px]" : "w-[240px]"
    )}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/studio-bg-vertical.png')" }}
      />
      {/* Dark overlay — 90% opacity */}
      <div className="absolute inset-0 bg-[#0d0f14]/90" />

      {/* Content above overlay */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Wand2 className="w-4 h-4 text-primary" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-white tracking-tight whitespace-nowrap">
                InkFlow
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-[18px] h-[18px] flex-shrink-0",
                  isActive ? "text-primary" : "text-white/40 group-hover:text-white"
                )} />
                {!collapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </aside>
  );
}