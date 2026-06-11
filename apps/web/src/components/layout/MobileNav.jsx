import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Wand2, CalendarDays,
  Users, Image, Settings, X, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Painel", path: "/" },
  { icon: Wand2, label: "Stencil IA", path: "/stencil" },
  { icon: CalendarDays, label: "Agenda", path: "/calendar" },
  { icon: Users, label: "Clientes", path: "/clients" },
  { icon: Image, label: "Galeria", path: "/flash-gallery" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export default function MobileNav({ open, setOpen }) {
  const location = useLocation();

  const currentPage = menuItems.find(item =>
    item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  );

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#080a0d]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Wand2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <span className="font-bold text-[14px] text-white tracking-tight">InkFlow</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentPage && (
            <span className="text-xs text-white/40 font-medium">{currentPage.label}</span>
          )}
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="h-14" />

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
              onClick={() => setOpen(false)}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#080a0d] border-r border-white/[0.06] z-[70] flex flex-col"
            >
              {/* Top line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {/* Header */}
              <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                    <Wand2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-white">InkFlow</p>
                    <p className="text-[9px] text-primary/50 font-mono uppercase tracking-[0.2em]">Studio Manager</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
                      )}
                      <item.icon className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive ? "text-primary" : "text-white/30"
                      )} />
                      <span>{item.label}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </nav>

              {/* User area */}
              <div className="p-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">MR</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate">Marcelo Ramos</p>
                    <p className="text-[10px] text-white/30 truncate">Tatuador</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
