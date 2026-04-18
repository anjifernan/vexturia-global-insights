import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DEFAULT_VEX_PROMPT = `Eres VEX, el asistente inteligente de Vexturia, una plataforma inmobiliaria premium con tecnología de inteligencia artificial. Tu misión es atender, cualificar y asesorar a clientes de forma profesional y eficiente.

Personalidad: Profesional, ágil, directo y sofisticado. Sin emojis excesivos. Lenguaje claro y elegante. Te presentas siempre como "VEX, asistente inteligente de Vexturia".

Capacidades principales:
1. Atender consultas sobre compra, venta y alquiler de propiedades
2. Guiar al usuario por el proceso de valoración de su vivienda
3. Cualificar leads preguntando: tipo de operación, presupuesto, ubicación de interés y urgencia
4. Agendar llamadas con el equipo humano de Vexturia
5. Responder en el idioma del cliente automáticamente

Cuando el usuario te facilite su nombre y teléfono (o email), confírmale amablemente que un experto humano de Vexturia se pondrá en contacto en breve.

Nunca inventes precios ni datos de propiedades específicas.`;

export default function AdminConfig() {
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [vexPrompt, setVexPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [configId, setConfigId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("configuracion").select("*").limit(1);
      if (data && data.length > 0) {
        const c = data[0] as typeof data[0] & { vex_system_prompt?: string | null };
        setConfigId(c.id);
        setTelefono(c.telefono || "");
        setEmail(c.email || "");
        setDireccion(c.direccion || "");
        setVexPrompt(c.vex_system_prompt || "");
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

  const handleSavePrompt = async () => {
    setSavingPrompt(true);
    if (configId) {
      const { error } = await supabase
        .from("configuracion")
        .update({ vex_system_prompt: vexPrompt })
        .eq("id", configId);
      if (error) { toast.error("Error al guardar el prompt"); console.error(error); }
      else toast.success("System prompt de VEX guardado");
    } else {
      const { data, error } = await supabase
        .from("configuracion")
        .insert({ vex_system_prompt: vexPrompt })
        .select()
        .single();
      if (error) { toast.error("Error al guardar el prompt"); console.error(error); }
      else { setConfigId(data.id); toast.success("System prompt de VEX guardado"); }
    }
    setSavingPrompt(false);
  };

  const handleResetPrompt = () => {
    setVexPrompt(DEFAULT_VEX_PROMPT);
    toast.info("Prompt restablecido al valor por defecto. Pulsa guardar para aplicar.");
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

      <div className="bg-card rounded-xl border p-6 mb-8 max-w-3xl">
        <div className="flex items-start justify-between mb-2 gap-4">
          <div>
            <h2 className="font-bold">System Prompt de VEX</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Instrucciones que recibe el asistente en cada conversación. Se cargan dinámicamente desde la edge function <code className="bg-muted px-1 rounded">vex-chat</code>.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleResetPrompt}>
            Restablecer
          </Button>
        </div>
        <Textarea
          value={vexPrompt}
          onChange={(e) => setVexPrompt(e.target.value)}
          placeholder="Define aquí la personalidad, capacidades y flujo de cualificación de VEX..."
          className="min-h-[320px] font-mono text-xs bg-muted mt-3"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">{vexPrompt.length} caracteres</span>
          <Button type="button" onClick={handleSavePrompt} disabled={savingPrompt}>
            {savingPrompt && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Guardar prompt de VEX
          </Button>
        </div>
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
              <p className="font-medium text-sm">VEX</p>
              <p className="text-xs text-muted-foreground">Asistente IA</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent-foreground font-medium">Pendiente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
