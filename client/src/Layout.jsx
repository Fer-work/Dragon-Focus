import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function Layout() {
  return (
    <>
      <div className="app">
        <aside className="sidebar">
          <Sidebar />
        </aside>
        <main className="content">
          <Topbar></Topbar>
          <Outlet />
        </main>
      </div>
    </>
  );
}
