import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Printer, Download, CalendarDays, Home, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type DBProperty = Tables<"propiedades_turisticas">;
type DBReservation = Tables<"reservas_turisticas">;

// Local interfaces mapped from DB
interface Property {
  id: string;
  nombre: string;
  direccion: string;
  notas: string;
  capacidad_maxima: number;
  estado: string;
  num_habitaciones: number;
  precio_noche: number;
}

interface Reservation {
  id: string;
  propiedad_id: string;
  nombre_huesped: string;
  telefono_huesped: string;
  email_huesped: string;
  nacionalidad: string;
  num_adultos: number;
  num_ninos: number;
  direccion_huesped: string;
  fecha_entrada: string;
  fecha_salida: string;
  num_noches: number;
  precio_noche: number;
  importe_total: number;
  importe_anticipo: number;
  importe_pendiente: number;
  estado: string;
  notas: string;
}

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const diffDays = (a: string, b: string) => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(ms / 86400000));
};

const fmtDate = (d: string) => {
  const parts = d.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return d;
};

const fmtCur = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

export default function AdminRentals() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("calendario");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [propDialog, setPropDialog] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [resDialog, setResDialog] = useState(false);
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);
  const [detailRes, setDetailRes] = useState<Reservation | null>(null);

  const [propForm, setPropForm] = useState({ nombre: "", direccion: "", notas: "", capacidad_maxima: 4, precio_noche: 0 });
  const [resForm, setResForm] = useState({
    propiedad_id: "",
    nombre_huesped: "", telefono_huesped: "", email_huesped: "",
    nacionalidad: "",
    num_adultos: 1, num_ninos: 0,
    direccion_huesped: "",
    fecha_entrada: "", fecha_salida: "",
    precio_noche: 0, importe_anticipo: 0,
    notas: "",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  // ---- FETCH DATA ----
  const fetchProperties = useCallback(async () => {
    const { data, error } = await supabase.from("propiedades_turisticas").select("*").order("created_at");
    if (error) { toast.error("Error cargando propiedades"); return; }
    const mapped: Property[] = (data || []).map((p) => ({
      id: p.id, nombre: p.nombre, direccion: p.direccion,
      notas: p.notas || "", capacidad_maxima: p.capacidad_maxima,
      estado: p.estado, num_habitaciones: p.num_habitaciones, precio_noche: Number(p.precio_noche),
    }));
    setProperties(mapped);
    if (mapped.length > 0 && !selectedPropertyId) setSelectedPropertyId(mapped[0].id);
  }, []);

  const fetchReservations = useCallback(async () => {
    const { data, error } = await supabase.from("reservas_turisticas").select("*").order("fecha_entrada");
    if (error) { toast.error("Error cargando reservas"); return; }
    const mapped: Reservation[] = (data || []).map((r) => ({
      id: r.id, propiedad_id: r.propiedad_id,
      nombre_huesped: r.nombre_huesped, telefono_huesped: r.telefono_huesped || "",
      email_huesped: r.email_huesped || "", nacionalidad: r.nacionalidad || "",
      num_adultos: r.num_adultos, num_ninos: r.num_ninos,
      direccion_huesped: r.direccion_huesped || "",
      fecha_entrada: r.fecha_entrada, fecha_salida: r.fecha_salida,
      num_noches: diffDays(r.fecha_entrada, r.fecha_salida),
      precio_noche: Number(r.precio_noche), importe_total: Number(r.importe_total),
      importe_anticipo: Number(r.importe_anticipo), importe_pendiente: Number(r.importe_pendiente),
      estado: r.estado, notas: r.notas || "",
    }));
    setReservations(mapped);
  }, []);

  useEffect(() => {
    Promise.all([fetchProperties(), fetchReservations()]).finally(() => setLoading(false));
  }, [fetchProperties, fetchReservations]);

  // ---- COMPUTED ----
  const activeProperties = properties.filter((p) => p.estado === "disponible");

  const monthReservations = useMemo(() => {
    const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const monthEnd = `${year}-${String(month + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;
    return reservations.filter(
      (r) => r.propiedad_id === selectedPropertyId && r.estado === "confirmada" && r.fecha_entrada <= monthEnd && r.fecha_salida >= monthStart
    );
  }, [reservations, selectedPropertyId, year, month, totalDays]);

  const yearReservations = useMemo(() => {
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;
    return reservations.filter(
      (r) => r.propiedad_id === selectedPropertyId && r.estado === "confirmada" && r.fecha_entrada <= yearEnd && r.fecha_salida >= yearStart
    );
  }, [reservations, selectedPropertyId, year]);

  const getDayStatus = (day: number): "libre" | "ocupado" | "entrada_salida" => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    for (const r of monthReservations) {
      if (r.fecha_entrada === dateStr || r.fecha_salida === dateStr) return "entrada_salida";
      if (dateStr > r.fecha_entrada && dateStr < r.fecha_salida) return "ocupado";
    }
    return "libre";
  };

  const getReservationForDay = (day: number): Reservation | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return monthReservations.find((r) => dateStr >= r.fecha_entrada && dateStr <= r.fecha_salida);
  };

  const stats = useMemo(() => {
    let occupiedDays = 0;
    for (let d = 1; d <= totalDays; d++) { if (getDayStatus(d) !== "libre") occupiedDays++; }
    const freeDays = totalDays - occupiedDays;
    const occupancyPct = totalDays > 0 ? Math.round((occupiedDays / totalDays) * 100) : 0;
    const totalIncome = monthReservations.reduce((s, r) => s + r.importe_total, 0);
    return { occupiedDays, freeDays, occupancyPct, totalIncome, count: monthReservations.length };
  }, [monthReservations, totalDays, year, month]);

  const yearStats = useMemo(() => {
    const totalDaysYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
    let occupiedDays = 0;
    for (let m = 0; m < 12; m++) {
      const md = daysInMonth(year, m);
      for (let d = 1; d <= md; d++) {
        const dateStr = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        for (const r of yearReservations) {
          if (dateStr >= r.fecha_entrada && dateStr <= r.fecha_salida) { occupiedDays++; break; }
        }
      }
    }
    const freeDays = totalDaysYear - occupiedDays;
    const occupancyPct = Math.round((occupiedDays / totalDaysYear) * 100);
    const totalIncome = yearReservations.reduce((s, r) => s + r.importe_total, 0);
    return { occupiedDays, freeDays, occupancyPct, totalIncome, count: yearReservations.length };
  }, [yearReservations, year]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  // ---- PROPERTY CRUD (Supabase) ----
  const openNewProp = () => {
    if (properties.length >= 5) { toast.error("Máximo 5 propiedades"); return; }
    setEditingProp(null);
    setPropForm({ nombre: "", direccion: "", notas: "", capacidad_maxima: 4, precio_noche: 0 });
    setPropDialog(true);
  };
  const openEditProp = (p: Property) => {
    setEditingProp(p);
    setPropForm({ nombre: p.nombre, direccion: p.direccion, notas: p.notas, capacidad_maxima: p.capacidad_maxima, precio_noche: p.precio_noche });
    setPropDialog(true);
  };
  const saveProp = async () => {
    if (!propForm.nombre.trim()) { toast.error("El nombre es obligatorio"); return; }
    setSaving(true);
    if (editingProp) {
      const { error } = await supabase.from("propiedades_turisticas").update({
        nombre: propForm.nombre, direccion: propForm.direccion,
        notas: propForm.notas, capacidad_maxima: propForm.capacidad_maxima, precio_noche: propForm.precio_noche,
      }).eq("id", editingProp.id);
      if (error) { toast.error("Error actualizando"); setSaving(false); return; }
      toast.success("Propiedad actualizada");
    } else {
      const { error } = await supabase.from("propiedades_turisticas").insert({
        nombre: propForm.nombre, direccion: propForm.direccion,
        notas: propForm.notas, capacidad_maxima: propForm.capacidad_maxima, precio_noche: propForm.precio_noche,
      });
      if (error) { toast.error("Error creando propiedad"); setSaving(false); return; }
      toast.success("Propiedad añadida");
    }
    setPropDialog(false);
    setSaving(false);
    await fetchProperties();
  };
  const deleteProp = async (id: string) => {
    const { error } = await supabase.from("propiedades_turisticas").delete().eq("id", id);
    if (error) { toast.error("Error eliminando"); return; }
    toast.success("Propiedad eliminada");
    if (selectedPropertyId === id) setSelectedPropertyId(properties.find((p) => p.id !== id)?.id || "");
    await Promise.all([fetchProperties(), fetchReservations()]);
  };

  // ---- RESERVATION CRUD (Supabase) ----
  const openNewRes = () => {
    setEditingRes(null);
    setResForm({
      propiedad_id: selectedPropertyId,
      nombre_huesped: "", telefono_huesped: "", email_huesped: "",
      nacionalidad: "", num_adultos: 1, num_ninos: 0,
      direccion_huesped: "",
      fecha_entrada: "", fecha_salida: "", precio_noche: 0, importe_anticipo: 0, notas: "",
    });
    setResDialog(true);
  };
  const openEditRes = (r: Reservation) => {
    setEditingRes(r);
    setResForm({
      propiedad_id: r.propiedad_id,
      nombre_huesped: r.nombre_huesped, telefono_huesped: r.telefono_huesped,
      email_huesped: r.email_huesped, nacionalidad: r.nacionalidad,
      num_adultos: r.num_adultos, num_ninos: r.num_ninos,
      direccion_huesped: r.direccion_huesped,
      fecha_entrada: r.fecha_entrada, fecha_salida: r.fecha_salida,
      precio_noche: r.precio_noche, importe_anticipo: r.importe_anticipo, notas: r.notas,
    });
    setResDialog(true);
    setDetailRes(null);
  };
  const saveRes = async () => {
    if (!resForm.nombre_huesped.trim() || !resForm.fecha_entrada || !resForm.fecha_salida) {
      toast.error("Completa los campos obligatorios"); return;
    }
    if (resForm.fecha_salida <= resForm.fecha_entrada) {
      toast.error("La fecha de salida debe ser posterior a la entrada"); return;
    }
    const nights = diffDays(resForm.fecha_entrada, resForm.fecha_salida);
    const total = nights * resForm.precio_noche;
    const pendiente = Math.max(0, total - resForm.importe_anticipo);
    setSaving(true);

    const payload = {
      propiedad_id: resForm.propiedad_id,
      nombre_huesped: resForm.nombre_huesped,
      telefono_huesped: resForm.telefono_huesped || null,
      email_huesped: resForm.email_huesped || null,
      nacionalidad: resForm.nacionalidad || null,
      num_adultos: resForm.num_adultos,
      num_ninos: resForm.num_ninos,
      direccion_huesped: resForm.direccion_huesped || null,
      fecha_entrada: resForm.fecha_entrada,
      fecha_salida: resForm.fecha_salida,
      precio_noche: resForm.precio_noche,
      importe_total: total,
      importe_anticipo: resForm.importe_anticipo,
      importe_pendiente: pendiente,
      notas: resForm.notas || null,
    };

    if (editingRes) {
      const { error } = await supabase.from("reservas_turisticas").update(payload).eq("id", editingRes.id);
      if (error) { toast.error("Error actualizando reserva"); setSaving(false); return; }
      toast.success("Reserva actualizada");
    } else {
      const { error } = await supabase.from("reservas_turisticas").insert(payload);
      if (error) { toast.error("Error creando reserva"); setSaving(false); return; }
      toast.success("Reserva creada");
    }
    setResDialog(false);
    setSaving(false);
    await fetchReservations();
  };
  const deleteRes = async (id: string) => {
    const { error } = await supabase.from("reservas_turisticas").delete().eq("id", id);
    if (error) { toast.error("Error eliminando reserva"); return; }
    setDetailRes(null);
    toast.success("Reserva eliminada");
    await fetchReservations();
  };
  const cancelRes = async (id: string) => {
    const { error } = await supabase.from("reservas_turisticas").update({ estado: "cancelada" }).eq("id", id);
    if (error) { toast.error("Error cancelando reserva"); return; }
    setDetailRes(null);
    toast.success("Reserva cancelada");
    await fetchReservations();
  };

  const numNights = resForm.fecha_entrada && resForm.fecha_salida && resForm.fecha_salida > resForm.fecha_entrada
    ? diffDays(resForm.fecha_entrada, resForm.fecha_salida) : 0;
  const totalAmount = numNights * resForm.precio_noche;
  const pendingAmount = Math.max(0, totalAmount - resForm.importe_anticipo);

  const selectedPropName = properties.find((p) => p.id === selectedPropertyId)?.nombre || "—";
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const monthAllReservations = reservations
    .filter((r) => {
      const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const monthEnd = `${year}-${String(month + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;
      return r.propiedad_id === selectedPropertyId && r.fecha_entrada <= monthEnd && r.fecha_salida >= monthStart;
    })
    .sort((a, b) => a.fecha_entrada.localeCompare(b.fecha_entrada));

  // ---- VOUCHER ----
  const generateVoucherHTML = (r: Reservation) => {
    const prop = properties.find((p) => p.id === r.propiedad_id);
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Voucher ${r.id.slice(0,8)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;color:#333;padding:40px}
.header{text-align:center;border-bottom:3px solid #00BABA;padding-bottom:20px;margin-bottom:30px}
.logo{font-size:28px;font-weight:900;color:#00BABA;letter-spacing:2px}
.subtitle{font-size:12px;color:#666;margin-top:4px}
.voucher-id{font-size:11px;color:#999;margin-top:8px}
.section{margin-bottom:20px}
.section-title{font-size:13px;font-weight:700;color:#00BABA;text-transform:uppercase;border-bottom:1px solid #eee;padding-bottom:4px;margin-bottom:10px}
.row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}
.row .label{color:#666}
.row .value{font-weight:600}
.total-row{font-size:15px;font-weight:700;border-top:2px solid #00BABA;padding-top:8px;margin-top:8px}
.footer{text-align:center;border-top:2px solid #00BABA;padding-top:20px;margin-top:40px;font-size:11px;color:#666}
@media print{body{padding:20px}}
</style></head><body>
<div class="header">
  <div class="logo">VEXTURIA</div>
  <div class="subtitle">Alquileres Turísticos Premium</div>
  <div class="voucher-id">Nº Reserva: ${r.id.slice(0,8).toUpperCase()}</div>
</div>
<div class="section">
  <div class="section-title">Datos del huésped</div>
  <div class="row"><span class="label">Nombre</span><span class="value">${r.nombre_huesped}</span></div>
  <div class="row"><span class="label">Dirección</span><span class="value">${r.direccion_huesped || "—"}</span></div>
  <div class="row"><span class="label">Teléfono</span><span class="value">${r.telefono_huesped || "—"}</span></div>
  <div class="row"><span class="label">Email</span><span class="value">${r.email_huesped || "—"}</span></div>
</div>
<div class="section">
  <div class="section-title">Datos de la reserva</div>
  <div class="row"><span class="label">Propiedad</span><span class="value">${prop?.nombre || "—"}</span></div>
  <div class="row"><span class="label">Entrada</span><span class="value">${fmtDate(r.fecha_entrada)}</span></div>
  <div class="row"><span class="label">Salida</span><span class="value">${fmtDate(r.fecha_salida)}</span></div>
  <div class="row"><span class="label">Noches</span><span class="value">${r.num_noches}</span></div>
  <div class="row"><span class="label">Adultos</span><span class="value">${r.num_adultos}</span></div>
  <div class="row"><span class="label">Niños</span><span class="value">${r.num_ninos}</span></div>
</div>
<div class="section">
  <div class="section-title">Desglose económico</div>
  <div class="row"><span class="label">Precio/noche</span><span class="value">${fmtCur(r.precio_noche)}</span></div>
  <div class="row total-row"><span class="label">Importe total</span><span class="value">${fmtCur(r.importe_total)}</span></div>
  <div class="row"><span class="label">Anticipo pagado</span><span class="value">${fmtCur(r.importe_anticipo)}</span></div>
  <div class="row" style="color:#c00;font-weight:700"><span class="label">Pendiente de pago</span><span class="value">${fmtCur(r.importe_pendiente)}</span></div>
</div>
${r.notas ? `<div class="section"><div class="section-title">Notas</div><p style="font-size:13px">${r.notas}</p></div>` : ""}
<div class="footer">
  <strong>VEXTURIA</strong> — Alquileres Turísticos Premium<br/>
  info@vexturia.com · +34 600 000 000 · www.vexturia.com
</div>
</body></html>`;
  };

  const printVoucher = (r: Reservation) => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(generateVoucherHTML(r));
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  const downloadVoucherPDF = (r: Reservation) => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(generateVoucherHTML(r));
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  const StatsPanel = ({ title, data }: { title: string; data: typeof stats }) => (
    <div>
      <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: "#00BABA" }}>{data.occupiedDays}</p>
          <p className="text-xs text-muted-foreground">Días ocupados</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{data.freeDays}</p>
          <p className="text-xs text-muted-foreground">Días libres</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold">{data.occupancyPct}%</p>
          <p className="text-xs text-muted-foreground">Ocupación</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: "#D4AF37" }}>{fmtCur(data.totalIncome)}</p>
          <p className="text-xs text-muted-foreground">Ingresos</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold">{data.count}</p>
          <p className="text-xs text-muted-foreground">Reservas</p>
        </CardContent></Card>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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

        <TabsContent value="calendario" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Selecciona propiedad" />
              </SelectTrigger>
              <SelectContent>
                {activeProperties.map((p) => (
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

          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 mb-4 text-xs flex-wrap">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-200 border border-green-400" /> Libre</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#00BABA" }} /> Ocupado</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#D4AF37" }} /> Entrada/Salida</span>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {weekDays.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: totalDays }).map((_, i) => {
                  const day = i + 1;
                  const status = getDayStatus(day);
                  const reservation = getReservationForDay(day);
                  let bgClass = "bg-green-100 hover:bg-green-200 text-green-800";
                  if (status === "ocupado") bgClass = "text-white hover:opacity-90";
                  if (status === "entrada_salida") bgClass = "text-white hover:opacity-90";
                  return (
                    <button key={day} onClick={() => reservation && setDetailRes(reservation)}
                      className={`aspect-square rounded-md text-xs font-medium flex items-center justify-center transition-colors ${bgClass} ${reservation ? "cursor-pointer" : "cursor-default"}`}
                      style={status === "ocupado" ? { backgroundColor: "#00BABA" } : status === "entrada_salida" ? { backgroundColor: "#D4AF37" } : undefined}
                    >{day}</button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <StatsPanel title={`Resumen mensual — ${monthName}`} data={stats} />
          <StatsPanel title={`Resumen anual — ${year}`} data={yearStats} />

          <Card>
            <CardHeader><CardTitle className="text-base">Reservas del mes — {selectedPropName}</CardTitle></CardHeader>
            <CardContent>
              {monthAllReservations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay reservas para este mes.</p>
              ) : (
                <div className="space-y-2">
                  {monthAllReservations.map((r) => (
                    <button key={r.id} onClick={() => setDetailRes(r)}
                      className="w-full text-left flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-semibold">{r.nombre_huesped}</p>
                        <p className="text-xs text-muted-foreground">{fmtDate(r.fecha_entrada)} → {fmtDate(r.fecha_salida)} · {r.num_noches} noches</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{fmtCur(r.importe_total)}</p>
                        <Badge variant={r.estado === "confirmada" ? "default" : "destructive"} className="text-[10px]">{r.estado}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
                      {p.notas && <p className="text-xs mt-1">{p.notas}</p>}
                      <p className="text-xs text-muted-foreground mt-1">Capacidad: {p.capacidad_maxima} huéspedes · {fmtCur(p.precio_noche)}/noche</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProp(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteProp(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {properties.length === 0 && <p className="text-sm text-muted-foreground col-span-2">No hay propiedades. Añade una para empezar.</p>}
          </div>
        </TabsContent>
      </Tabs>

      {/* Property Dialog */}
      <Dialog open={propDialog} onOpenChange={setPropDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingProp ? "Editar propiedad" : "Nueva propiedad"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nombre</Label><Input value={propForm.nombre} onChange={(e) => setPropForm({ ...propForm, nombre: e.target.value })} /></div>
            <div><Label>Dirección</Label><Input value={propForm.direccion} onChange={(e) => setPropForm({ ...propForm, direccion: e.target.value })} /></div>
            <div><Label>Notas / descripción</Label><Input value={propForm.notas} onChange={(e) => setPropForm({ ...propForm, notas: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Capacidad máxima</Label><Input type="number" min={1} max={20} value={propForm.capacidad_maxima} onChange={(e) => setPropForm({ ...propForm, capacidad_maxima: Number(e.target.value) })} /></div>
              <div><Label>Precio/noche (€)</Label><Input type="number" min={0} value={propForm.precio_noche} onChange={(e) => setPropForm({ ...propForm, precio_noche: Number(e.target.value) })} /></div>
            </div>
          </div>
          <DialogFooter><Button onClick={saveProp} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Guardar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reservation Dialog */}
      <Dialog open={resDialog} onOpenChange={setResDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingRes ? "Editar reserva" : "Nueva reserva"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Propiedad</Label>
              <Select value={resForm.propiedad_id} onValueChange={(v) => setResForm({ ...resForm, propiedad_id: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {activeProperties.map((p) => (
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
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Anticipo / señal (€)</Label><Input type="number" min={0} value={resForm.importe_anticipo} onChange={(e) => setResForm({ ...resForm, importe_anticipo: Number(e.target.value) })} /></div>
              <div><Label>Pendiente de pago (€)</Label><Input readOnly value={pendingAmount.toFixed(2)} className="bg-muted font-bold text-red-600" /></div>
            </div>
            <hr />
            <p className="text-sm font-semibold">Datos del huésped</p>
            <div><Label>Nombre completo</Label><Input value={resForm.nombre_huesped} onChange={(e) => setResForm({ ...resForm, nombre_huesped: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Teléfono</Label><Input value={resForm.telefono_huesped} onChange={(e) => setResForm({ ...resForm, telefono_huesped: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={resForm.email_huesped} onChange={(e) => setResForm({ ...resForm, email_huesped: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nacionalidad</Label><Input value={resForm.nacionalidad} onChange={(e) => setResForm({ ...resForm, nacionalidad: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Adultos</Label><Input type="number" min={1} value={resForm.num_adultos} onChange={(e) => setResForm({ ...resForm, num_adultos: Math.max(1, Number(e.target.value)) })} /></div>
                <div><Label>Niños</Label><Input type="number" min={0} value={resForm.num_ninos} onChange={(e) => setResForm({ ...resForm, num_ninos: Math.max(0, Number(e.target.value)) })} /></div>
              </div>
            </div>
            <div><Label>Dirección del huésped</Label><Textarea placeholder="Calle, número, ciudad, provincia, código postal, país" value={resForm.direccion_huesped} onChange={(e) => setResForm({ ...resForm, direccion_huesped: e.target.value })} /></div>
            <div><Label>Notas internas</Label><Textarea value={resForm.notas} onChange={(e) => setResForm({ ...resForm, notas: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={saveRes} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Guardar reserva</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reservation Detail */}
      <Dialog open={!!detailRes} onOpenChange={() => setDetailRes(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Detalle de reserva</DialogTitle></DialogHeader>
          {detailRes && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Propiedad</span><span className="font-medium">{properties.find((p) => p.id === detailRes.propiedad_id)?.nombre}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Huésped</span><span className="font-medium">{detailRes.nombre_huesped}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Teléfono</span><span>{detailRes.telefono_huesped || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{detailRes.email_huesped || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Nacionalidad</span><span>{detailRes.nacionalidad || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Adultos</span><span>{detailRes.num_adultos}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Niños</span><span>{detailRes.num_ninos}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dirección</span><span className="text-right max-w-[200px]">{detailRes.direccion_huesped || "—"}</span></div>
              <hr />
              <div className="flex justify-between"><span className="text-muted-foreground">Entrada</span><span>{fmtDate(detailRes.fecha_entrada)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Salida</span><span>{fmtDate(detailRes.fecha_salida)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Noches</span><span>{detailRes.num_noches}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Precio/noche</span><span>{fmtCur(detailRes.precio_noche)}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>{fmtCur(detailRes.importe_total)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Anticipo pagado</span><span>{fmtCur(detailRes.importe_anticipo)}</span></div>
              <div className="flex justify-between font-bold text-red-600"><span>Pendiente</span><span>{fmtCur(detailRes.importe_pendiente)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estado</span>
                <Badge variant={detailRes.estado === "confirmada" ? "default" : "destructive"}>{detailRes.estado}</Badge>
              </div>
              {detailRes.notas && <div><span className="text-muted-foreground">Notas:</span><p className="mt-1">{detailRes.notas}</p></div>}
              <hr />
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => openEditRes(detailRes)}><Pencil className="h-3.5 w-3.5 mr-1" /> Editar</Button>
                <Button size="sm" variant="outline" onClick={() => printVoucher(detailRes)}><Printer className="h-3.5 w-3.5 mr-1" /> Imprimir voucher</Button>
                <Button size="sm" variant="outline" onClick={() => downloadVoucherPDF(detailRes)}><Download className="h-3.5 w-3.5 mr-1" /> Descargar PDF</Button>
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
