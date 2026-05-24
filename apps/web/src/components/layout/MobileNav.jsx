import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Wand2, ScanEye, FolderKanban, CalendarDays,
  Users, Image, DollarSign, Package, ShieldCheck, HeartPulse,
  BarChart3, Settings, X, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Wand2, label: "Stencil AI", path: "/stencil" },
  { icon: ScanEye, label: "Placement Preview", path: "/placement" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: CalendarDays, label: "Calendar", path: "/calendar" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: Image, label: "Flash Gallery", path: "/flash-gallery" },
  { icon: DollarSign, label: "Finance", path: "/finance" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: ShieldCheck, label: "Compliance", path: "/compliance" },
  { icon: HeartPulse, label: "Aftercare", path: "/aftercare" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function MobileNav({ open, setOpen }) {
  const location = useLocation();

  const currentPage = menuItems.find(item =>
    item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  );

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Wand2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-bold text-base text-foreground tracking-tight">InkFlow</span>
        </div>

        <div className="flex items-center gap-2">
          {currentPage && (
            <span className="text-xs text-muted-foreground font-medium">{currentPage.label}</span>
          )}
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 rounded-xl bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar border-r border-sidebar-border z-[70] flex flex-col"
            >
              {/* Drawer header */}
              <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Wand2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-bold text-base text-foreground tracking-tight">InkFlow</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
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
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span>{item.label}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </nav>

              {/* User area */}
              <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">MR</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">Marcelo Ramos</p>
                    <p className="text-[10px] text-muted-foreground truncate">Tatuador</p>
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