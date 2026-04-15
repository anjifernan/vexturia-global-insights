import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  Nuevo: "bg-primary/10 text-primary",
  Contactado: "bg-accent/20 text-accent-foreground",
  Cualificado: "bg-green-100 text-green-700",
  Descartado: "bg-muted text-muted-foreground",
};

interface Lead {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  origen: string;
  estado: string;
  created_at: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      setLeads((data as Lead[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const fmtDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-8">Gestión de Leads</h1>

      {leads.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No hay leads registrados todavía.</p>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Nombre</th>
                  <th className="text-left p-4 font-semibold">Teléfono</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-left p-4 font-semibold">Origen</th>
                  <th className="text-left p-4 font-semibold">Fecha</th>
                  <th className="text-left p-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b hover:bg-muted/30 cursor-pointer transition-colors">
                    <td className="p-4 font-medium">{l.nombre}</td>
                    <td className="p-4 text-muted-foreground">{l.telefono || "—"}</td>
                    <td className="p-4 text-muted-foreground">{l.email || "—"}</td>
                    <td className="p-4 text-muted-foreground">{l.origen}</td>
                    <td className="p-4 text-muted-foreground">{fmtDate(l.created_at)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[l.estado] || "bg-muted text-muted-foreground"}`}>{l.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
