import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, X, CalendarDays, Home, BarChart3 } from "lucide-react";
import { toast } from "sonner";

// Types
interface Property {
  id: string;
  nombre: string;
  direccion: string;
  descripcion: string;
  capacidad: number;
  activa: boolean;
  created_at: string;
}

interface Reservation {
  id: string;
  propiedad_id: string;
  huesped_nombre: string;
  huesped_telefono: string;
  huesped_email: string;
  huesped_nacionalidad: string;
  num_huespedes: number;
  fecha_entrada: string;
  fecha_salida: string;
  num_noches: number;
  precio_noche: number;
  importe_total: number;
  estado: "confirmada" | "cancelada";
  notas: string;
  created_at: string;
}

// Helper: generate id
const uid = () => crypto.randomUUID();

// Helper: days in month
const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

// Helper: diff days
const diffDays = (a: string, b: string) => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(ms / 86400000));
};

// Format date
const fmtDate = (d: string) => {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

// Format currency
const fmtCur = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

// ---- SAMPLE DATA ----
const SAMPLE_PROPERTIES: Property[] = [
  { id: "p1", nombre: "Apartamento Sol", direccion: "Calle Sol 12, Málaga", descripcion: "Estudio frente al mar", capacidad: 4, activa: true, created_at: new Date().toISOString() },
  { id: "p2", nombre: "Villa Luna", direccion: "Av. de la Costa 45, Marbella", descripcion: "Villa con piscina privada", capacidad: 8, activa: true, created_at: new Date().toISOString() },
];

export default function AdminRentals() {
  // State
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || "");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("calendario");

  // Dialogs
  const [propDialog, setPropDialog] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [resDialog, setResDialog] = useState(false);
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);
  const [detailRes, setDetailRes] = useState<Reservation | null>(null);

  // Form state - property
  const [propForm, setPropForm] = useState({ nombre: "", direccion: "", descripcion: "", capacidad: 4 });

  // Form state - reservation
  const [resForm, setResForm] = useState({
    propiedad_id: "",
    huesped_nombre: "",
    huesped_telefono: "",
    huesped_email: "",
    huesped_nacionalidad: "",
    num_huespedes: 1,
    fecha_entrada: "",
    fecha_salida: "",
    precio_noche: 0,
    notas: "",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  // Filter reservations for selected property & month
  const monthReservations = useMemo(() => {
    const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const monthEnd = `${year}-${String(month + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;
    return reservations.filter(
      (r) =>
        r.propiedad_id === selectedPropertyId &&
        r.estado === "confirmada" &&
        r.fecha_entrada <= monthEnd &&
        r.fecha_salida >= monthStart
    );
  }, [reservations, selectedPropertyId, year, month, totalDays]);

  // Day status for calendar
  const getDayStatus = (day: number): "libre" | "ocupado" | "entrada_salida" => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    for (const r of monthReservations) {
      if (r.fecha_entrada === dateStr || r.fecha_salida === dateStr) return "entrada_salida";
      if (dateStr > r.fecha_entrada && dateStr < r.fecha_salida) return "ocupado";
    }
    return "libre";
  };

  // Get reservation for a day (for click)
  const getReservationForDay = (day: number): Reservation | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return monthReservations.find(
      (r) => dateStr >= r.fecha_entrada && dateStr <= r.fecha_salida
    );
  };

  // Stats
  const stats = useMemo(() => {
    let occupiedDays = 0;
    for (let d = 1; d <= totalDays; d++) {
      if (getDayStatus(d) !== "libre") occupiedDays++;
    }
    const freeDays = totalDays - occupiedDays;
    const occupancyPct = Math.round((occupiedDays / totalDays) * 100);
    const totalIncome = monthReservations.reduce((s, r) => s + r.importe_total, 0);
    return { occupiedDays, freeDays, occupancyPct, totalIncome, count: monthReservations.length };
  }, [monthReservations, totalDays, year, month]);

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  // ---- Property CRUD ----
  const openNewProp = () => {
    if (properties.length >= 5) { toast.error("Máximo 5 propiedades"); return; }
    setEditingProp(null);
    setPropForm({ nombre: "", direccion: "", descripcion: "", capacidad: 4 });
    setPropDialog(true);
  };
  const openEditProp = (p: Property) => {
    setEditingProp(p);
    setPropForm({ nombre: p.nombre, direccion: p.direccion, descripcion: p.descripcion, capacidad: p.capacidad });
    setPropDialog(true);
  };
  const saveProp = () => {
    if (!propForm.nombre.trim()) { toast.error("El nombre es obligatorio"); return; }
    if (editingProp) {
      setProperties((prev) => prev.map((p) => (p.id === editingProp.id ? { ...p, ...propForm } : p)));
      toast.success("Propiedad actualizada");
    } else {
      const newP: Property = { id: uid(), ...propForm, activa: true, created_at: new Date().toISOString() };
      setProperties((prev) => [...prev, newP]);
      if (!selectedPropertyId) setSelectedPropertyId(newP.id);
      toast.success("Propiedad añadida");
    }
    setPropDialog(false);
  };
  const deleteProp = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setReservations((prev) => prev.filter((r) => r.propiedad_id !== id));
    if (selectedPropertyId === id) setSelectedPropertyId(properties.find((p) => p.id !== id)?.id || "");
    toast.success("Propiedad eliminada");
  };

  // ---- Reservation CRUD ----
  const openNewRes = () => {
    setEditingRes(null);
    setResForm({
      propiedad_id: selectedPropertyId,
      huesped_nombre: "", huesped_telefono: "", huesped_email: "",
      huesped_nacionalidad: "", num_huespedes: 1,
      fecha_entrada: "", fecha_salida: "", precio_noche: 0, notas: "",
    });
    setResDialog(true);
  };
  const openEditRes = (r: Reservation) => {
    setEditingRes(r);
    setResForm({
      propiedad_id: r.propiedad_id,
      huesped_nombre: r.huesped_nombre, huesped_telefono: r.huesped_telefono,
      huesped_email: r.huesped_email, huesped_nacionalidad: r.huesped_nacionalidad,
      num_huespedes: r.num_huespedes, fecha_entrada: r.fecha_entrada,
      fecha_salida: r.fecha_salida, precio_noche: r.precio_noche, notas: r.notas,
    });
    setResDialog(true);
    setDetailRes(null);
  };
  const saveRes = () => {
    if (!resForm.huesped_nombre.trim() || !resForm.fecha_entrada || !resForm.fecha_salida) {
      toast.error("Completa los campos obligatorios"); return;
    }
    if (resForm.fecha_salida <= resForm.fecha_entrada) {
      toast.error("La fecha de salida debe ser posterior a la entrada"); return;
    }
    const nights = diffDays(resForm.fecha_entrada, resForm.fecha_salida);
    const total = nights * resForm.precio_noche;
    if (editingRes) {
      setReservations((prev) =>
        prev.map((r) => (r.id === editingRes.id ? { ...r, ...resForm, num_noches: nights, importe_total: total } : r))
      );
      toast.success("Reserva actualizada");
    } else {
      const newR: Reservation = {
        id: uid(), ...resForm,
        num_noches: nights, importe_total: total,
        estado: "confirmada", created_at: new Date().toISOString(),
      };
      setReservations((prev) => [...prev, newR]);
      toast.success("Reserva creada");
    }
    setResDialog(false);
  };
  const deleteRes = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    setDetailRes(null);
    toast.success("Reserva eliminada");
  };
  const cancelRes = (id: string) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, estado: "cancelada" as const } : r)));
    setDetailRes(null);
    toast.success("Reserva cancelada");
  };

  const numNights = resForm.fecha_entrada && resForm.fecha_salida && resForm.fecha_salida > resForm.fecha_entrada
    ? diffDays(resForm.fecha_entrada, resForm.fecha_salida) : 0;
  const totalAmount = numNights * resForm.precio_noche;

  const selectedPropName = properties.find((p) => p.id === selectedPropertyId)?.nombre || "—";
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // All reservations for list (including cancelled)
  const monthAllReservations = reservations
    .filter((r) => {
      const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const monthEnd = `${year}-${String(month + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;
      return r.propiedad_id === selectedPropertyId && r.fecha_entrada <= monthEnd && r.fecha_salida >= monthStart;
    })
    .sort((a, b) => a.fecha_entrada.localeCompare(b.fecha_entrada));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Alquileres Turísticos</h1>
        <Button onClick={openNewRes} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Nueva Reserva
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calendario"><CalendarDays className="h-4 w-4 mr-1" /> Calendario</TabsTrigger>
          <TabsTrigger value="propiedades"><Home className="h-4 w-4 mr-1" /> Mis Propiedades</TabsTrigger>
        </TabsList>

        {/* ===== CALENDARIO TAB ===== */}
        <TabsContent value="calendario" className="space-y-6">
          {/* Property selector + month nav */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Selecciona propiedad" />
              </SelectTrigger>
              <SelectContent>
                {properties.filter((p) => p.activa).map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm font-semibold capitalize min-w-[160px] text-center">{monthName}</span>
              <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Calendar grid */}
          <Card>
            <CardContent className="p-4">
              {/* Legend */}
              <div className="flex gap-4 mb-4 text-xs flex-wrap">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-200 border border-green-400" /> Libre</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#00BABA" }} /> Ocupado</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#D4AF37" }} /> Entrada/Salida</span>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {weekDays.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: totalDays }).map((_, i) => {
                  const day = i + 1;
                  const status = getDayStatus(day);
                  const reservation = getReservationForDay(day);
                  let bgClass = "bg-green-100 hover:bg-green-200 text-green-800";
                  if (status === "ocupado") bgClass = "text-white hover:opacity-90";
                  if (status === "entrada_salida") bgClass = "text-white hover:opacity-90";

                  return (
                    <button
                      key={day}
                      onClick={() => reservation && setDetailRes(reservation)}
                      className={`aspect-square rounded-md text-xs font-medium flex items-center justify-center transition-colors ${bgClass} ${reservation ? "cursor-pointer" : "cursor-default"}`}
                      style={
                        status === "ocupado" ? { backgroundColor: "#00BABA" } :
                        status === "entrada_salida" ? { backgroundColor: "#D4AF37" } : undefined
                      }
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#00BABA" }}>{stats.occupiedDays}</p>
              <p className="text-xs text-muted-foreground">Días ocupados</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.freeDays}</p>
              <p className="text-xs text-muted-foreground">Días libres</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.occupancyPct}%</p>
              <p className="text-xs text-muted-foreground">Ocupación</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#D4AF37" }}>{fmtCur(stats.totalIncome)}</p>
              <p className="text-xs text-muted-foreground">Ingresos</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.count}</p>
              <p className="text-xs text-muted-foreground">Reservas</p>
            </CardContent></Card>
          </div>

          {/* Reservations list */}
          <Card>
            <CardHeader><CardTitle className="text-base">Reservas del mes — {selectedPropName}</CardTitle></CardHeader>
            <CardContent>
              {monthAllReservations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay reservas para este mes.</p>
              ) : (
                <div className="space-y-2">
                  {monthAllReservations.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setDetailRes(r)}
                      className="w-full text-left flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold">{r.huesped_nombre}</p>
                        <p className="text-xs text-muted-foreground">{fmtDate(r.fecha_entrada)} → {fmtDate(r.fecha_salida)} · {r.num_noches} noches</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{fmtCur(r.importe_total)}</p>
                        <Badge variant={r.estado === "confirmada" ? "default" : "destructive"} className="text-[10px]">
                          {r.estado}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== PROPIEDADES TAB ===== */}
        <TabsContent value="propiedades" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Gestiona tus propiedades turísticas (máx. 5)</p>
            <Button onClick={openNewProp} variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Añadir</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {properties.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm">{p.nombre}</h3>
                      <p className="text-xs text-muted-foreground">{p.direccion}</p>
                      <p className="text-xs mt-1">{p.descripcion}</p>
                      <p className="text-xs text-muted-foreground mt-1">Capacidad: {p.capacidad} huéspedes</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProp(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteProp(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ===== PROPERTY DIALOG ===== */}
      <Dialog open={propDialog} onOpenChange={setPropDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingProp ? "Editar propiedad" : "Nueva propiedad"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nombre</Label><Input value={propForm.nombre} onChange={(e) => setPropForm({ ...propForm, nombre: e.target.value })} /></div>
            <div><Label>Dirección</Label><Input value={propForm.direccion} onChange={(e) => setPropForm({ ...propForm, direccion: e.target.value })} /></div>
            <div><Label>Descripción corta</Label><Input value={propForm.descripcion} onChange={(e) => setPropForm({ ...propForm, descripcion: e.target.value })} /></div>
            <div><Label>Capacidad máxima</Label><Input type="number" min={1} max={20} value={propForm.capacidad} onChange={(e) => setPropForm({ ...propForm, capacidad: Number(e.target.value) })} /></div>
          </div>
          <DialogFooter><Button onClick={saveProp}>Guardar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== RESERVATION DIALOG ===== */}
      <Dialog open={resDialog} onOpenChange={setResDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingRes ? "Editar reserva" : "Nueva reserva"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Propiedad</Label>
              <Select value={resForm.propiedad_id} onValueChange={(v) => setResForm({ ...resForm, propiedad_id: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {properties.filter((p) => p.activa).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><Label>Fecha entrada</Label><Input type="date" value={resForm.fecha_entrada} onChange={(e) => setResForm({ ...resForm, fecha_entrada: e.target.value })} /></div>
              <div><Label>Fecha salida</Label><Input type="date" value={resForm.fecha_salida} onChange={(e) => setResForm({ ...resForm, fecha_salida: e.target.value })} /></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div><Label>Noches</Label><Input readOnly value={numNights} className="bg-muted" /></div>
              <div><Label>Precio/noche (€)</Label><Input type="number" min={0} value={resForm.precio_noche} onChange={(e) => setResForm({ ...resForm, precio_noche: Number(e.target.value) })} /></div>
              <div><Label>Total (€)</Label><Input readOnly value={totalAmount.toFixed(2)} className="bg-muted font-bold" /></div>
            </div>

            <hr />
            <p className="text-sm font-semibold">Datos del huésped</p>
            <div><Label>Nombre completo</Label><Input value={resForm.huesped_nombre} onChange={(e) => setResForm({ ...resForm, huesped_nombre: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Teléfono</Label><Input value={resForm.huesped_telefono} onChange={(e) => setResForm({ ...resForm, huesped_telefono: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={resForm.huesped_email} onChange={(e) => setResForm({ ...resForm, huesped_email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nacionalidad</Label><Input value={resForm.huesped_nacionalidad} onChange={(e) => setResForm({ ...resForm, huesped_nacionalidad: e.target.value })} /></div>
              <div><Label>Nº huéspedes</Label><Input type="number" min={1} value={resForm.num_huespedes} onChange={(e) => setResForm({ ...resForm, num_huespedes: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Notas internas</Label><Textarea value={resForm.notas} onChange={(e) => setResForm({ ...resForm, notas: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={saveRes}>Guardar reserva</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== RESERVATION DETAIL DIALOG ===== */}
      <Dialog open={!!detailRes} onOpenChange={() => setDetailRes(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Detalle de reserva</DialogTitle></DialogHeader>
          {detailRes && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Propiedad</span>
                <span className="font-medium">{properties.find((p) => p.id === detailRes.propiedad_id)?.nombre}</span>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Huésped</span><span className="font-medium">{detailRes.huesped_nombre}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Teléfono</span><span>{detailRes.huesped_telefono || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{detailRes.huesped_email || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Nacionalidad</span><span>{detailRes.huesped_nacionalidad || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Huéspedes</span><span>{detailRes.num_huespedes}</span></div>
              <hr />
              <div className="flex justify-between"><span className="text-muted-foreground">Entrada</span><span>{fmtDate(detailRes.fecha_entrada)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Salida</span><span>{fmtDate(detailRes.fecha_salida)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Noches</span><span>{detailRes.num_noches}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Precio/noche</span><span>{fmtCur(detailRes.precio_noche)}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>{fmtCur(detailRes.importe_total)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estado</span>
                <Badge variant={detailRes.estado === "confirmada" ? "default" : "destructive"}>{detailRes.estado}</Badge>
              </div>
              {detailRes.notas && <div><span className="text-muted-foreground">Notas:</span><p className="mt-1">{detailRes.notas}</p></div>}
              <hr />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditRes(detailRes)}><Pencil className="h-3.5 w-3.5 mr-1" /> Editar</Button>
                {detailRes.estado === "confirmada" && (
                  <Button size="sm" variant="outline" onClick={() => cancelRes(detailRes.id)}>Cancelar reserva</Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => deleteRes(detailRes.id)}><Trash2 className="h-3.5 w-3.5 mr-1" /> Eliminar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
