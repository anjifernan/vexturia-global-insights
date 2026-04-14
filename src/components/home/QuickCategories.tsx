import { Building2, TrendingUp, Home } from "lucide-react";

const categories = [
  {
    icon: Building2,
    title: "Viviendas de Estreno",
    desc: "Obra nueva con las últimas calidades",
    premium: false,
  },
  {
    icon: TrendingUp,
    title: "Oportunidades de Inversión",
    desc: "Activos con alto potencial de rentabilidad",
    premium: true,
  },
  {
    icon: Home,
    title: "Alquiler Residencial",
    desc: "Tu hogar ideal, sin compromiso de compra",
    premium: false,
  },
];

export default function QuickCategories() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center mb-12">
          Explora por categoría
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group relative bg-card rounded-xl border p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              {cat.premium && (
                <span className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Inversión
                </span>
              )}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
                <cat.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{cat.title}</h3>
              <p className="text-sm text-muted-foreground">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
