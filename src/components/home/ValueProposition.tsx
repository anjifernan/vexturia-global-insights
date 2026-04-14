import { Target, Zap, Globe } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "Precisión sobre intuición",
    desc: "Analizamos datos de mercado en tiempo real para que siempre tomes la mejor decisión.",
  },
  {
    icon: Zap,
    title: "Velocidad Exponencial",
    desc: "Automatización inteligente que reduce tiempos en visitas, trámites y cierres.",
  },
  {
    icon: Globe,
    title: "Alcance Global, Trato Local",
    desc: "Tecnología global con la cercanía y empatía que solo un experto humano puede dar.",
  },
];

export default function ValueProposition() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10">
          {items.map((item) => (
            <div key={item.title} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
