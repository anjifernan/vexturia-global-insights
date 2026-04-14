import { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { CheckCircle } from "lucide-react";

const steps = ["Localización", "Características", "Estado y extras", "Resultado"];

export default function Valuation() {
  const [step, setStep] = useState(0);

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

          {/* Step content */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">¿Dónde está tu propiedad?</h2>
              <input placeholder="Municipio" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
              <input placeholder="Barrio / Zona" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
              <input placeholder="Dirección" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Características del inmueble</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Piso", "Casa", "Ático", "Dúplex", "Estudio", "Local"].map((t) => (
                  <button key={t} className="px-4 py-2 rounded-full border text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">{t}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="m²" className="border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input placeholder="Habitaciones" className="border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input placeholder="Baños" className="border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input placeholder="Año construcción" className="border rounded-lg px-4 py-3 text-sm bg-muted" />
              </div>
              <input placeholder="Planta" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Estado y extras</h2>
              <p className="text-sm text-muted-foreground mb-2">Estado del inmueble</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["A estrenar", "Buen estado", "A reformar", "En construcción"].map((s) => (
                  <button key={s} className="px-4 py-2 rounded-full border text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">{s}</button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-2">Extras</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Ascensor", "Garaje", "Terraza", "Piscina", "Aire acondicionado"].map((e) => (
                  <button key={e} className="px-4 py-2 rounded-full border text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">{e}</button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-2">Operación deseada</p>
              <div className="flex gap-2">
                {["Venta", "Alquiler"].map((o) => (
                  <button key={o} className="px-6 py-2 rounded-full border text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">{o}</button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <h2 className="text-xl font-bold">Valoración estimada</h2>
              <div className="bg-primary/10 rounded-2xl p-8">
                <p className="text-4xl font-extrabold text-primary">285.000 € — 320.000 €</p>
                <p className="text-sm text-muted-foreground mt-2">Precio por m²: 2.850 €/m²</p>
              </div>
              <p className="text-sm text-muted-foreground">Factores analizados: localización, superficie, estado, extras, demanda de zona</p>
              <div className="border-t pt-6 space-y-3 text-left max-w-sm mx-auto">
                <p className="font-semibold text-sm">Recibe tu informe completo:</p>
                <input placeholder="Nombre" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input placeholder="Email" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input placeholder="Teléfono" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                <Button className="w-full">Quiero que un experto contacte conmigo</Button>
              </div>
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
