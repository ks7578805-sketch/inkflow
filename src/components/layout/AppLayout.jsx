import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, createContext, useContext } from "react";

const SidebarContext = createContext();
export const useSidebarContext = () => useContext(SidebarContext);

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen bg-background">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`${collapsed ? "ml-[72px]" : "ml-[240px]"} min-h-screen transition-all duration-300`}>
          <Outlet />
        </main>
      </div>
    </SidebarContext.Provider>
  );
}