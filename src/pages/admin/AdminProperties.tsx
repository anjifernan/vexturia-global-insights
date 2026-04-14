import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const properties = [
  { id: 1, ref: "REF-2024-001", title: "Ático de lujo — Salamanca", price: 1250000, status: "Activo", premium: true, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop" },
  { id: 2, ref: "REF-2024-002", title: "Piso reformado — Eixample", price: 425000, status: "Activo", premium: false, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&h=100&fit=crop" },
  { id: 3, ref: "REF-2024-003", title: "Villa con piscina — Marbella", price: 2100000, status: "Vendido", premium: true, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=100&h=100&fit=crop" },
];

export default function AdminProperties() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4">Gestión de Inmuebles</h1>
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground mb-8">
        La gestión completa de inmuebles se realiza desde Mobilia CRM. Esta sección muestra el estado de sincronización.
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-semibold">Inmueble</th>
              <th className="text-left p-4 font-semibold">Ref.</th>
              <th className="text-left p-4 font-semibold">Precio</th>
              <th className="text-left p-4 font-semibold">Estado</th>
              <th className="text-left p-4 font-semibold">Premium</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" loading="lazy" width={100} height={100} />
                    <span className="font-medium">{p.title}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{p.ref}</td>
                <td className="p-4 font-medium">{p.price.toLocaleString("es-ES")} €</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.status === "Activo" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                  }`}>{p.status}</span>
                </td>
                <td className="p-4">
                  <Button variant={p.premium ? "default" : "outline"} size="sm" className="gap-1">
                    <Star className={`h-3.5 w-3.5 ${p.premium ? "fill-current" : ""}`} />
                    {p.premium ? "Premium" : "Marcar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        Conexión con API de Mobilia: pendiente de configuración
      </div>
    </div>
  );
}
