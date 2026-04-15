import { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = ["Localización", "Características", "Estado y extras", "Resultado"];

export default function Valuation() {
  const [step, setStep] = useState(0);

  // Step 0
  const [municipio, setMunicipio] = useState("");
  const [barrio, setBarrio] = useState("");
  const [direccion, setDireccion] = useState("");

  // Step 1
  const [tipoInmueble, setTipoInmueble] = useState<string | null>(null);
  const [metros, setMetros] = useState("");
  const [habitaciones, setHabitaciones] = useState("");
  const [banos, setBanos] = useState("");
  const [anio, setAnio] = useState("");
  const [planta, setPlanta] = useState("");

  // Step 2
  const [estadoInmueble, setEstadoInmueble] = useState<string | null>(null);
  const [extras, setExtras] = useState<string[]>([]);
  const [operacion, setOperacion] = useState<string | null>(null);

  // Step 3 – lead form
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleExtra = (e: string) => {
    setExtras((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);
  };

  const chipClass = (selected: boolean) =>
    `px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
      selected
        ? "bg-primary text-primary-foreground border-primary"
        : "hover:bg-primary/10"
    }`;

  const submitLead = async () => {
    if (!nombre.trim() || !telefono.trim() || !email.trim()) {
      toast.error("Rellena todos los campos");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      origen: "valoracion",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Error al enviar los datos");
      console.error(error);
    } else {
      setLeadSubmitted(true);
      toast.success("¡Datos enviados! Aquí tienes tu valoración.");
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-dark-bg py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
            Descubre el valor real de tu propiedad en menos de 2 minutos.
          </h1>
          <p className="text-primary-foreground/70">Valoración inteligente basada en datos reales de mercado</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle className="h-5 w-5" /> : i + 1}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-muted-foreground">{s}</span>
                {i < steps.length - 1 && <div className={`w-8 md:w-16 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step 0 */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">¿Dónde está tu propiedad?</h2>
              <input value={municipio} onChange={(e) => setMunicipio(e.target.value)} placeholder="Municipio" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
              <input value={barrio} onChange={(e) => setBarrio(e.target.value)} placeholder="Barrio / Zona" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
              <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Características del inmueble</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Piso", "Casa", "Ático", "Dúplex", "Estudio", "Local"].map((t) => (
                  <button key={t} className={chipClass(tipoInmueble === t)} onClick={() => setTipoInmueble(t)}>{t}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input value={metros} onChange={(e) => setMetros(e.target.value)} placeholder="m²" className="border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input value={habitaciones} onChange={(e) => setHabitaciones(e.target.value)} placeholder="Habitaciones" className="border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input value={banos} onChange={(e) => setBanos(e.target.value)} placeholder="Baños" className="border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input value={anio} onChange={(e) => setAnio(e.target.value)} placeholder="Año construcción" className="border rounded-lg px-4 py-3 text-sm bg-muted" />
              </div>
              <input value={planta} onChange={(e) => setPlanta(e.target.value)} placeholder="Planta" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Estado y extras</h2>
              <p className="text-sm text-muted-foreground mb-2">Estado del inmueble</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["A estrenar", "Buen estado", "A reformar", "En construcción"].map((s) => (
                  <button key={s} className={chipClass(estadoInmueble === s)} onClick={() => setEstadoInmueble(s)}>{s}</button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-2">Extras</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Ascensor", "Garaje", "Terraza", "Piscina", "Aire acondicionado"].map((e) => (
                  <button key={e} className={chipClass(extras.includes(e))} onClick={() => toggleExtra(e)}>{e}</button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-2">Operación deseada</p>
              <div className="flex gap-2">
                {["Venta", "Alquiler"].map((o) => (
                  <button key={o} className={chipClass(operacion === o)} onClick={() => setOperacion(o)}>{o}</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="text-center space-y-6">
              {!leadSubmitted ? (
                <>
                  <h2 className="text-xl font-bold">Recibe tu valoración</h2>
                  <p className="text-sm text-muted-foreground">Introduce tus datos para ver el resultado de la valoración.</p>
                  <div className="space-y-3 text-left max-w-sm mx-auto">
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                    <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                    <Button className="w-full" onClick={submitLead} disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Ver mi valoración
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold">Valoración estimada</h2>
                  <div className="bg-primary/10 rounded-2xl p-8">
                    <p className="text-4xl font-extrabold text-primary">285.000 € — 320.000 €</p>
                    <p className="text-sm text-muted-foreground mt-2">Precio por m²: 2.850 €/m²</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Factores analizados: localización, superficie, estado, extras, demanda de zona</p>
                  <Button variant="outline" onClick={() => window.location.href = "/contacto"}>
                    Quiero que un experto contacte conmigo
                  </Button>
                </>
              )}
            </div>
          )}

          {step < 3 && (
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                Anterior
              </Button>
              <Button onClick={() => setStep(step + 1)}>Siguiente</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
