import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Wand2, FolderKanban, CalendarDays,
  Users, Image, Settings, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Painel", path: "/" },
  { icon: CalendarDays, label: "Agenda", path: "/calendar" },
  { icon: Users, label: "Clientes", path: "/clients" },
  { icon: FolderKanban, label: "Projetos", path: "/projects" },
  { icon: Wand2, label: "Stencil IA", path: "/stencil" },
  { icon: Image, label: "Galeria", path: "/flash-gallery" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-[#0c0e12] border-r border-white/[0.06] flex flex-col z-50 transition-all duration-300 overflow-hidden",
      collapsed ? "w-[68px]" : "w-[220px]"
    )}>

      {/* Linha verde topo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Logo */}
      <div className={cn(
        "h-[60px] flex items-center border-b border-white/[0.05] flex-shrink-0",
        collapsed ? "justify-center px-0" : "px-5"
      )}>
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Ícone logo */}
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Wand2 className="w-3.5 h-3.5 text-[#080a0d]" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-bold text-[14px] text-white leading-tight tracking-tight">InkFlow</p>
              <p className="text-[9px] text-white/25 uppercase tracking-[0.18em] font-medium">Studio</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[9px] font-bold text-white/15 uppercase tracking-[0.2em] px-3 pb-2.5">
            Navegação
          </p>
        )}
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center rounded-xl text-sm font-medium transition-all duration-150 group",
                collapsed ? "justify-center w-full py-3 px-0" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-primary/[0.12] text-primary"
                  : "text-white/45 hover:bg-white/[0.04] hover:text-white/75"
              )}
            >
              {/* Indicador lateral */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-primary rounded-r-full" />
              )}
              <item.icon className={cn(
                "flex-shrink-0 transition-none",
                collapsed ? "w-[18px] h-[18px]" : "w-[16px] h-[16px]",
                isActive ? "text-primary" : "text-white/30 group-hover:text-white/60"
              )} />
              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="border-t border-white/[0.05] flex-shrink-0">
        {/* Configurações */}
        <div className={cn("px-2.5 pt-3 pb-1", collapsed && "flex justify-center")}>
          <Link
            to="/settings"
            title={collapsed ? "Configurações" : undefined}
            className={cn(
              "flex items-center rounded-xl text-sm font-medium text-white/25 hover:text-white/55 hover:bg-white/[0.04] transition-all",
              collapsed ? "justify-center py-2.5 w-10 h-10" : "gap-3 px-3 py-2.5"
            )}
          >
            <Settings className={cn("flex-shrink-0", collapsed ? "w-[18px] h-[18px]" : "w-[16px] h-[16px]")} />
            {!collapsed && <span>Configurações</span>}
          </Link>
        </div>

        {/* Perfil artista */}
        <div className={cn(
          "flex items-center pb-4 pt-1",
          collapsed ? "justify-center px-0" : "gap-3 px-4"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-primary">MR</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white/70 truncate">Marcelo Ramos</p>
              <p className="text-[10px] text-white/25 truncate">Tatuador</p>
            </div>
          )}
        </div>

        {/* Colapsar */}
        <div className={cn("px-2.5 pb-3", collapsed && "flex justify-center")}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center justify-center rounded-lg text-white/15 hover:text-white/40 hover:bg-white/[0.03] transition-colors",
              collapsed ? "w-10 h-7" : "w-full h-7"
            )}
          >
            {collapsed
              ? <ChevronRight className="w-3.5 h-3.5" />
              : <ChevronLeft className="w-3.5 h-3.5" />
            }
          </button>
        </div>
      </div>

    </aside>
  );
}
