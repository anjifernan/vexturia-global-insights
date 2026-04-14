const leads = [
  { id: 1, name: "Juan López", phone: "+34 612 345 678", email: "juan@email.com", origin: "Valoración", date: "2026-04-14", status: "Nuevo" },
  { id: 2, name: "María Santos", phone: "+34 623 456 789", email: "maria@email.com", origin: "Contacto", date: "2026-04-13", status: "Contactado" },
  { id: 3, name: "Pedro Gómez", phone: "+34 634 567 890", email: "pedro@email.com", origin: "Vexta-1", date: "2026-04-13", status: "Cualificado" },
  { id: 4, name: "Laura Fernández", phone: "+34 645 678 901", email: "laura@email.com", origin: "Valoración", date: "2026-04-12", status: "Nuevo" },
  { id: 5, name: "Carlos Díaz", phone: "+34 656 789 012", email: "carlos@email.com", origin: "Contacto", date: "2026-04-11", status: "Descartado" },
];

const statusColors: Record<string, string> = {
  Nuevo: "bg-primary/10 text-primary",
  Contactado: "bg-accent/20 text-accent-foreground",
  Cualificado: "bg-green-100 text-green-700",
  Descartado: "bg-muted text-muted-foreground",
};

export default function AdminLeads() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-8">Gestión de Leads</h1>

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
                  <td className="p-4 font-medium">{l.name}</td>
                  <td className="p-4 text-muted-foreground">{l.phone}</td>
                  <td className="p-4 text-muted-foreground">{l.email}</td>
                  <td className="p-4 text-muted-foreground">{l.origin}</td>
                  <td className="p-4 text-muted-foreground">{l.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[l.status]}`}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
