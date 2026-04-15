import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Printer, FileDown, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusOptions = ["Nuevo", "Contactado", "Agenda visita", "Visita realizada", "Finalizado"];

const statusColors: Record<string, string> = {
  Nuevo: "bg-primary/10 text-primary",
  Contactado: "bg-accent/20 text-accent-foreground",
  "Agenda visita": "bg-blue-100 text-blue-700",
  "Visita realizada": "bg-green-100 text-green-700",
  Finalizado: "bg-muted text-muted-foreground",
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");

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

  // Status update
  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("leads").update({ estado: newStatus }).eq("id", id);
    if (error) {
      toast.error("Error al actualizar estado");
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, estado: newStatus } : l)));
  };

  // Selection
  const allSelected = leads.length > 0 && selected.size === leads.length;
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(leads.map((l) => l.id)));
  };
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bulk status change
  const handleBulkStatus = async () => {
    if (!bulkStatus) return;
    const ids = Array.from(selected);
    const { error } = await supabase.from("leads").update({ estado: bulkStatus }).in("id", ids);
    if (error) {
      toast.error("Error al actualizar");
      return;
    }
    setLeads((prev) => prev.map((l) => (ids.includes(l.id) ? { ...l, estado: bulkStatus } : l)));
    toast.success(`${ids.length} leads actualizados`);
    setBulkStatus("");
  };

  // Print
  const handlePrint = () => {
    const selectedLeads = leads.filter((l) => selected.has(l.id));
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Leads Vexturia</title><style>
      body{font-family:sans-serif;padding:20px}
      h1{color:#00BABA;font-size:22px}
      table{width:100%;border-collapse:collapse;margin-top:16px}
      th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:13px}
      th{background:#00BABA;color:#fff}
    </style></head><body>
      <h1>VEXTURIA — Leads</h1>
      <table><thead><tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Origen</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>
      ${selectedLeads.map((l) => `<tr><td>${l.nombre}</td><td>${l.telefono || "—"}</td><td>${l.email || "—"}</td><td>${l.origen}</td><td>${l.estado}</td><td>${fmtDate(l.created_at)}</td></tr>`).join("")}
      </tbody></table></body></html>`);
    w.document.close();
    w.print();
  };

  // PDF download
  const handleDownloadPDF = () => {
    const selectedLeads = leads.filter((l) => selected.has(l.id));
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Leads Vexturia</title><style>
      @page{margin:20mm}
      body{font-family:sans-serif;padding:0}
      .header{background:#00BABA;color:#fff;padding:20px 24px;margin:-20mm -20mm 20px -20mm;padding-top:30px}
      .header h1{margin:0;font-size:24px;font-weight:800}
      .header p{margin:4px 0 0;font-size:12px;opacity:.8}
      table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #e5e7eb;padding:8px;text-align:left;font-size:12px}
      th{background:#f3f4f6;font-weight:600}
      .footer{margin-top:24px;text-align:center;font-size:10px;color:#999}
    </style></head><body>
      <div class="header"><h1>VEXTURIA</h1><p>Informe de Leads · ${new Date().toLocaleDateString("es-ES")}</p></div>
      <table><thead><tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Origen</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>
      ${selectedLeads.map((l) => `<tr><td>${l.nombre}</td><td>${l.telefono || "—"}</td><td>${l.email || "—"}</td><td>${l.origen}</td><td>${l.estado}</td><td>${fmtDate(l.created_at)}</td></tr>`).join("")}
      </tbody></table>
      <div class="footer">Generado por Vexturia · ${new Date().toLocaleString("es-ES")}</div>
    </body></html>`);
    w.document.close();
    w.print();
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-8">Gestión de Leads</h1>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">{selected.size} seleccionado{selected.size > 1 ? "s" : ""}</span>
          <Button size="sm" variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> Imprimir
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
            <FileDown className="h-4 w-4 mr-1" /> Descargar PDF
          </Button>
          <div className="flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm bg-muted"
            >
              <option value="">Cambiar estado…</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {bulkStatus && (
              <Button size="sm" onClick={handleBulkStatus}>
                <RefreshCw className="h-4 w-4 mr-1" /> Aplicar
              </Button>
            )}
          </div>
        </div>
      )}

      {leads.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No hay leads registrados todavía.</p>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 w-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                  </th>
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
                  <tr key={l.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <Checkbox checked={selected.has(l.id)} onCheckedChange={() => toggleOne(l.id)} />
                    </td>
                    <td className="p-4 font-medium">{l.nombre}</td>
                    <td className="p-4 text-muted-foreground">{l.telefono || "—"}</td>
                    <td className="p-4 text-muted-foreground">{l.email || "—"}</td>
                    <td className="p-4 text-muted-foreground">{l.origen}</td>
                    <td className="p-4 text-muted-foreground">{fmtDate(l.created_at)}</td>
                    <td className="p-4">
                      <select
                        value={l.estado}
                        onChange={(e) => handleStatusChange(l.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[l.estado] || "bg-muted text-muted-foreground"}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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
