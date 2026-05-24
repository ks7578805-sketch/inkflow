import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { useState, createContext, useContext } from "react";

const SidebarContext = createContext();
export const useSidebarContext = () => useContext(SidebarContext);

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      <div className="min-h-screen bg-background">

        {/* ── Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* ── Mobile top bar + drawer */}
        <div className="md:hidden">
          <MobileNav open={mobileOpen} setOpen={setMobileOpen} />
        </div>

        {/* ── Page content */}
        {/* Desktop: offset left by sidebar width */}
        <main
          className="hidden md:block min-h-screen transition-[margin] duration-300"
          style={{ marginLeft: collapsed ? 72 : 240 }}
        >
          <Outlet />
        </main>

        {/* Mobile: full width, already pushed down by 56px top bar (h-14) in MobileNav */}
        <main className="md:hidden min-h-screen">
          <Outlet />
        </main>

      </div>
    </SidebarContext.Provider>
  );
}