import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminConfig() {
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configId, setConfigId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("configuracion").select("*").limit(1);
      if (data && data.length > 0) {
        const c = data[0];
        setConfigId(c.id);
        setTelefono(c.telefono || "");
        setEmail(c.email || "");
        setDireccion(c.direccion || "");
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (configId) {
      const { error } = await supabase.from("configuracion").update({ telefono, email, direccion }).eq("id", configId);
      if (error) { toast.error("Error al guardar"); console.error(error); }
      else toast.success("Configuración guardada");
    } else {
      const { data, error } = await supabase.from("configuracion").insert({ telefono, email, direccion }).select().single();
      if (error) { toast.error("Error al guardar"); console.error(error); }
      else { setConfigId(data.id); toast.success("Configuración guardada"); }
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-8">Configuración</h1>

      <div className="bg-card rounded-xl border p-6 mb-8 max-w-lg">
        <h2 className="font-bold mb-4">Datos de contacto</h2>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Teléfono</label>
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Dirección</label>
            <input value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted" />
          </div>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Guardar cambios
          </Button>
        </form>
      </div>

      <div className="bg-card rounded-xl border p-6 max-w-lg">
        <h2 className="font-bold mb-4">Integraciones</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">Mobilia API</p>
              <p className="text-xs text-muted-foreground">Sincronización de inmuebles</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent-foreground font-medium">Pendiente</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">Vexta-1</p>
              <p className="text-xs text-muted-foreground">Asistente IA</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent-foreground font-medium">Pendiente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
