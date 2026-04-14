import { Building2, Users, TrendingUp, Activity } from "lucide-react";

const stats = [
  { label: "Inmuebles activos", value: "24", icon: Building2 },
  { label: "Leads hoy", value: "7", icon: Users },
  { label: "Leads del mes", value: "143", icon: TrendingUp },
  { label: "Operaciones en curso", value: "5", icon: Activity },
];

const recentActivity = [
  { text: "Nuevo lead desde valoración: Juan López", time: "Hace 12 min" },
  { text: "Propiedad REF-2024 marcada como vendida", time: "Hace 1h" },
  { text: "Lead cualificado: María Santos", time: "Hace 2h" },
  { text: "Nueva consulta desde contacto web", time: "Hace 3h" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border p-6">
            <s.icon className="h-5 w-5 text-primary mb-3" />
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-6">
        <h2 className="font-bold mb-4">Actividad reciente</h2>
        <div className="space-y-4">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span>{a.text}</span>
              <span className="text-muted-foreground text-xs">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
