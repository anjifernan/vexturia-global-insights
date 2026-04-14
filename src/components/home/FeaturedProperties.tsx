import { Link } from "react-router-dom";
import { MapPin, Maximize, BedDouble, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";

const properties = [
  {
    id: 1,
    title: "Ático de lujo con vistas panorámicas",
    type: "Ático",
    location: "Madrid, Salamanca",
    m2: 180,
    rooms: 3,
    baths: 2,
    price: 1250000,
    premium: true,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Piso reformado en el centro",
    type: "Piso",
    location: "Barcelona, Eixample",
    m2: 110,
    rooms: 2,
    baths: 1,
    price: 425000,
    premium: false,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Villa con piscina privada",
    type: "Casa",
    location: "Marbella, Golden Mile",
    m2: 320,
    rooms: 5,
    baths: 4,
    price: 2100000,
    premium: true,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
  },
];

export default function FeaturedProperties() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center mb-2">
          Propiedades Destacadas
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Selección curada de las mejores oportunidades del mercado
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {properties.map((p) => (
            <div
              key={p.id}
              className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={600}
                  height={400}
                />
                {p.premium && (
                  <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-primary uppercase">
                  {p.type}
                </span>
                <h3 className="font-bold mt-1 mb-2 line-clamp-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="h-3.5 w-3.5" /> {p.location}
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Maximize className="h-3.5 w-3.5" /> {p.m2} m²
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5" /> {p.rooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" /> {p.baths}
                  </span>
                </div>
                <p className="text-lg font-extrabold text-primary">
                  {p.price.toLocaleString("es-ES")} €
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/propiedades">Ver todas las propiedades</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
