import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Bot, Brain, Globe, Clock, Calendar, BarChart3 } from "lucide-react";

const capabilities = [
  { icon: BarChart3, title: "Valoración automática", desc: "Estimaciones precisas basadas en datos de mercado actualizados en tiempo real." },
  { icon: Brain, title: "Cualificación de leads", desc: "Identifica y prioriza clientes con mayor potencial de conversión." },
  { icon: Clock, title: "Atención 24/7", desc: "Atiende consultas y resuelve dudas en cualquier momento del día." },
  { icon: Globe, title: "Multilingüe", desc: "Comunicación fluida en múltiples idiomas para clientes internacionales." },
  { icon: Calendar, title: "Agendamiento automático", desc: "Programa visitas y reuniones directamente con tu calendario." },
];

export default function VexturiaLabs() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-dark-bg overflow-hidden">
        {/* Neural network visual effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-primary animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full border border-primary animate-pulse delay-300" />
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full border border-primary animate-pulse delay-700" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Bot className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-primary-foreground mb-4">Vexturia Labs</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
            Donde la inteligencia artificial se pone al servicio del sector inmobiliario.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl font-extrabold mb-4">Conoce a Vexta-1</h2>
            <p className="text-muted-foreground">
              Vexta-1 es nuestro agente de inteligencia artificial diseñado específicamente para el sector inmobiliario.
              Atiende, cualifica y asesora a clientes de forma autónoma, liberando a los profesionales para centrarse
              en lo que realmente importa: cerrar operaciones.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {capabilities.map((c) => (
              <div key={c.title} className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
                <c.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg">Probar Vexta-1</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
