import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, TrendingUp, Briefcase, Globe, ArrowRight } from "lucide-react";

const services = [
  { icon: Home, title: "Venta residencial", desc: "Vendemos tu propiedad al mejor precio con estrategia de marketing digital avanzada." },
  { icon: Home, title: "Compra asesorada", desc: "Te acompañamos desde la búsqueda hasta la firma, negociando siempre en tu favor." },
  { icon: Briefcase, title: "Alquiler gestionado", desc: "Gestión integral del alquiler: inquilinos cualificados, contratos y mantenimiento." },
  { icon: TrendingUp, title: "Inversión inmobiliaria", desc: "Identificamos oportunidades de alto rendimiento en mercados nacionales e internacionales.", premium: true },
  { icon: Globe, title: "Patrimonio internacional", desc: "Asesoramiento en compra de activos inmobiliarios en los principales mercados globales.", premium: true },
];

const steps = [
  { num: "01", title: "Análisis", desc: "Evaluamos tus necesidades y objetivos" },
  { num: "02", title: "Estrategia", desc: "Diseñamos un plan personalizado" },
  { num: "03", title: "Ejecución", desc: "Implementamos con tecnología y experiencia" },
  { num: "04", title: "Cierre", desc: "Acompañamiento hasta la firma y más allá" },
];

export default function VexturiaGlobal() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-center mb-4">Vexturia Global</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">Servicios inmobiliarios de primer nivel, respaldados por tecnología e inteligencia de datos.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((s) => (
              <div key={s.title} className="relative bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
                {s.premium && <span className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">Inversores</span>}
                <s.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-extrabold text-center mb-12">Nuestro proceso de trabajo</h2>
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <span className="text-4xl font-extrabold text-primary/20">{s.num}</span>
                <h3 className="font-bold mt-2 mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild><Link to="/contacto">Contactar con un experto <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
