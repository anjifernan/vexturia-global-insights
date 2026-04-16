import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [operacion, setOperacion] = useState("Compra");
  const [tipo, setTipo] = useState("Todos");
  const [precioMax, setPrecioMax] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("ubicacion", location);
    if (operacion) params.set("operacion", operacion);
    if (tipo && tipo !== "Todos") params.set("tipo", tipo);
    if (precioMax) params.set("precioMax", precioMax);
    navigate(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="relative -mt-8 z-20">
      <div className="container mx-auto px-4">
        <div className="bg-background rounded-xl shadow-xl p-6 flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Localización
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="¿Dónde quieres empezar tu nueva etapa?"
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="w-full lg:w-40">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Operación
            </label>
            <select
              value={operacion}
              onChange={(e) => setOperacion(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Compra</option>
              <option>Alquiler</option>
            </select>
          </div>
          <div className="w-full lg:w-48">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Tipo
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Todos</option>
              <option>Piso</option>
              <option>Casa</option>
              <option>Ático</option>
              <option>Local</option>
            </select>
          </div>
          <div className="w-full lg:w-44">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Precio máx.
            </label>
            <select
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sin límite</option>
              <option value="150000">150.000 €</option>
              <option value="300000">300.000 €</option>
              <option value="500000">500.000 €</option>
              <option value="1000000">1.000.000 €</option>
            </select>
          </div>
          <Button className="gap-2 w-full lg:w-auto" onClick={handleSearch}>
            <Search className="h-4 w-4" />
            Búsqueda Inteligente
          </Button>
        </div>
      </div>
    </section>
  );
}
