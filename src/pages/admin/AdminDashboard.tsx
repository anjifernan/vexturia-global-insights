import { useEffect, useState } from "react";
import { Building2, Users, TrendingUp, Activity, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ inmuebles: 0, leadsHoy: 0, leadsMes: 0, operaciones: 0 });
  const [recentLeads, setRecentLeads] = useState<{ nombre: string; origen: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      const [propRes, leadsHoyRes, leadsMesRes, recentRes] = await Promise.all([
        supabase.from("propiedades_turisticas").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", today),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
        supabase.from("leads").select("nombre, origen, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        inmuebles: propRes.count || 0,
        leadsHoy: leadsHoyRes.count || 0,
        leadsMes: leadsMesRes.count || 0,
        operaciones: 0,
      });
      setRecentLeads(recentRes.data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const statCards = [
    { label: "Inmuebles activos", value: stats.inmuebles, icon: Building2 },
    { label: "Leads hoy", value: stats.leadsHoy, icon: Users },
    { label: "Leads del mes", value: stats.leadsMes, icon: TrendingUp },
    { label: "Operaciones en curso", value: stats.operaciones, icon: Activity },
  ];

  const timeAgo = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (diff < 1) return "Ahora";
    if (diff < 60) return `Hace ${diff} min`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
    return `Hace ${Math.floor(diff / 1440)}d`;
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border p-6">
            <s.icon className="h-5 w-5 text-primary mb-3" />
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-6">
        <h2 className="font-bold mb-4">Actividad reciente</h2>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
        ) : (
          <div className="space-y-4">
            {recentLeads.map((l, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span>Nuevo lead desde {l.origen}: {l.nombre}</span>
                <span className="text-muted-foreground text-xs">{timeAgo(l.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
