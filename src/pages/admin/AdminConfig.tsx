import { Button } from "@/components/ui/button";

export default function AdminConfig() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-8">Configuración</h1>

      <div className="bg-card rounded-xl border p-6 mb-8 max-w-lg">
        <h2 className="font-bold mb-4">Datos de contacto</h2>
        <form className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Teléfono</label>
            <input defaultValue="+34 900 000 000" className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Email</label>
            <input defaultValue="info@vexturia.com" className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Dirección</label>
            <input defaultValue="Madrid, España" className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted" />
          </div>
          <Button>Guardar cambios</Button>
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
