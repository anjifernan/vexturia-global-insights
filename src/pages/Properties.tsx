import { useState } from "react";
import { Search, MapPin, Maximize, BedDouble, Bath, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const allProperties = [
  { id: 1, title: "Ático de lujo con vistas panorámicas", type: "Ático", operation: "Venta", location: "Madrid, Salamanca", m2: 180, rooms: 3, baths: 2, price: 1250000, premium: true, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop" },
  { id: 2, title: "Piso reformado en el centro", type: "Piso", operation: "Venta", location: "Barcelona, Eixample", m2: 110, rooms: 2, baths: 1, price: 425000, premium: false, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop" },
  { id: 3, title: "Villa con piscina privada", type: "Casa", operation: "Venta", location: "Marbella, Golden Mile", m2: 320, rooms: 5, baths: 4, price: 2100000, premium: true, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop" },
  { id: 4, title: "Apartamento luminoso junto al mar", type: "Piso", operation: "Alquiler", location: "Valencia, Malvarrosa", m2: 85, rooms: 2, baths: 1, price: 950, premium: false, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop" },
  { id: 5, title: "Loft industrial reformado", type: "Loft", operation: "Venta", location: "Madrid, Lavapiés", m2: 95, rooms: 1, baths: 1, price: 310000, premium: false, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop" },
  { id: 6, title: "Chalet adosado con jardín", type: "Casa", operation: "Venta", location: "Pozuelo de Alarcón", m2: 220, rooms: 4, baths: 3, price: 680000, premium: true, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop" },
];

export default function Properties() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-8">Propiedades</h1>

          {/* Filters */}
          <div className="bg-muted/50 rounded-xl p-6 mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            <select className="border rounded-lg px-3 py-2 text-sm bg-background">
              <option>Operación</option><option>Compra</option><option>Alquiler</option>
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm bg-background">
              <option>Tipo</option><option>Piso</option><option>Casa</option><option>Ático</option>
            </select>
            <input placeholder="Localización" className="border rounded-lg px-3 py-2 text-sm bg-background" />
            <input placeholder="Precio máx." className="border rounded-lg px-3 py-2 text-sm bg-background" />
            <Button className="gap-2"><Search className="h-4 w-4" />Filtrar</Button>
          </div>

          {/* View toggle */}
          <div className="flex justify-end gap-2 mb-6">
            <button onClick={() => setView("grid")} className={`p-2 rounded ${view === "grid" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-2 rounded ${view === "list" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className={view === "grid" ? "grid md:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
            {allProperties.map((p) => (
              <Link
                to={`/propiedades/${p.id}`}
                key={p.id}
                className={`group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border ${
                  view === "list" ? "flex" : ""
                }`}
              >
                <div className={`relative overflow-hidden ${view === "list" ? "w-48 shrink-0" : ""}`}>
                  <img src={p.image} alt={p.title} className={`object-cover group-hover:scale-105 transition-transform duration-500 ${view === "list" ? "h-full w-full" : "w-full h-56"}`} loading="lazy" width={600} height={400} />
                  {p.premium && (
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">Premium</span>
                  )}
                </div>
                <div className="p-5 flex-1">
                  <span className="text-xs font-semibold text-primary uppercase">{p.type} · {p.operation}</span>
                  <h3 className="font-bold mt-1 mb-2 line-clamp-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3"><MapPin className="h-3.5 w-3.5" />{p.location}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{p.m2} m²</span>
                    <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{p.rooms}</span>
                    <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{p.baths}</span>
                  </div>
                  <p className="text-lg font-extrabold text-primary">{p.price.toLocaleString("es-ES")} {p.operation === "Alquiler" ? "€/mes" : "€"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
