import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María García",
    text: "Gracias a Vexturia vendí mi piso en tiempo récord y al mejor precio del mercado. Su tecnología marca la diferencia.",
  },
  {
    name: "Carlos Rodríguez",
    text: "El asistente VEX me ayudó a encontrar el hogar perfecto para mi familia sin perder tiempo en visitas innecesarias.",
  },
  {
    name: "Ana Martínez",
    text: "La valoración fue increíblemente precisa. Profesionalismo y tecnología de primer nivel. Totalmente recomendados.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center mb-12">
          Lo que dicen nuestros clientes
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card rounded-xl border p-6 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 italic">
                "{t.text}"
              </p>
              <p className="font-semibold text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
