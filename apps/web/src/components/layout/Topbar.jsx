import { Bell, Search, Plus, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function Topbar({ title, subtitle }) {
  const { logout } = useAuth() ?? {};

  return (
    <header className="h-14 md:h-[60px] border-b border-white/[0.06] bg-[#080a0d]/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-[15px] md:text-base font-semibold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-[10px] text-white/30 hidden sm:block mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 md:gap-2.5">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <Input
            placeholder="Buscar..."
            className="w-56 pl-9 h-9 bg-white/[0.04] border-white/[0.07] text-sm text-white placeholder:text-white/25 focus:bg-white/[0.06] focus:border-primary/30"
          />
        </div>

        {/* Quick action */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 md:h-9 bg-primary hover:bg-primary/90 text-[#080a0d] font-semibold gap-1.5 px-3 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Novo</span>
              <ChevronDown className="w-3 h-3 opacity-60 hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#0f1115] border-white/[0.08]">
            <DropdownMenuItem className="text-white/70 hover:text-white" asChild>
              <Link to="/calendar">Nova sessão</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white/70 hover:text-white" asChild>
              <Link to="/clients">Novo cliente</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white/70 hover:text-white" asChild>
              <Link to="/projects">Novo projeto</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white/70 hover:text-white" asChild>
              <Link to="/stencil">Novo stencil</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.07] transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">MR</span>
              </div>
              <span className="hidden md:block text-[12px] font-medium text-white/60">Marcelo</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#0f1115] border-white/[0.08]">
            <DropdownMenuItem className="text-white/70 hover:text-white gap-2">
              <User className="w-3.5 h-3.5" /> Meu perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white/70 hover:text-white gap-2" asChild>
              <Link to="/settings"><Settings className="w-3.5 h-3.5" /> Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              className="text-red-400 hover:text-red-300 gap-2"
              onClick={() => logout?.()}
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
