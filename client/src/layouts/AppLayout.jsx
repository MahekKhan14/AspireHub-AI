import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppLayout({ authUser, onLogout }) {
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden mesh-bg">
      <Sidebar authUser={authUser} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
