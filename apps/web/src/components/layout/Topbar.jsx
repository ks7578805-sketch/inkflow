import { Bell, Search, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function Topbar({ title, subtitle }) {
  return (
    <header className="h-14 md:h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-base md:text-lg font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search — desktop only */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="w-64 pl-9 h-9 bg-secondary/50 border-border/50 text-sm focus:bg-secondary"
          />
        </div>

        {/* Quick action */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 md:h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1 px-3">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo</span>
              <ChevronDown className="w-3 h-3 opacity-60 hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Nova sessão</DropdownMenuItem>
            <DropdownMenuItem>Novo cliente</DropdownMenuItem>
            <DropdownMenuItem>Novo projeto</DropdownMenuItem>
            <DropdownMenuItem>Novo stencil</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Novo flash</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9 text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </Button>

        {/* Profile — desktop */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden md:flex items-center gap-2 pl-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">MR</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Meu perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}