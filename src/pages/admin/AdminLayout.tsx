import { useState } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import { LayoutDashboard, Users, Building2, Settings, LogOut } from "lucide-react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminLeads from "./AdminLeads";
import AdminProperties from "./AdminProperties";
import AdminConfig from "./AdminConfig";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Leads", path: "/admin/leads", icon: Users },
  { label: "Inmuebles", path: "/admin/inmuebles", icon: Building2 },
  { label: "Configuración", path: "/admin/configuracion", icon: Settings },
];

export default function AdminLayout() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r shrink-0 p-6 flex flex-col">
        <h2 className="text-lg font-extrabold mb-8">VEXTURIA</h2>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setAuthenticated(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="inmuebles" element={<AdminProperties />} />
          <Route path="configuracion" element={<AdminConfig />} />
        </Routes>
      </main>
    </div>
  );
}
