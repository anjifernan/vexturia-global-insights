import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { LayoutDashboard, Users, Building2, Settings, LogOut, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminLeads from "./AdminLeads";
import AdminProperties from "./AdminProperties";
import AdminConfig from "./AdminConfig";
import AdminRentals from "./AdminRentals";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Leads", path: "/admin/leads", icon: Users },
  { label: "Inmuebles", path: "/admin/inmuebles", icon: Building2 },
  { label: "Alquileres Turísticos", path: "/admin/alquileres", icon: CalendarDays },
  { label: "Configuración", path: "/admin/configuracion", icon: Settings },
];

export default function AdminLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
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
        <div className="text-xs text-muted-foreground mb-2 truncate">
          {session.user.email}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="inmuebles" element={<AdminProperties />} />
          <Route path="alquileres" element={<AdminRentals />} />
          <Route path="configuracion" element={<AdminConfig />} />
        </Routes>
      </main>
    </div>
  );
}
