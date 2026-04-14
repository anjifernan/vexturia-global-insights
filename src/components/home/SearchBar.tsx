import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
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
              placeholder="¿Dónde quieres empezar tu nueva etapa?"
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="w-full lg:w-40">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Operación
            </label>
            <select className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted outline-none focus:ring-2 focus:ring-primary">
              <option>Compra</option>
              <option>Alquiler</option>
            </select>
          </div>
          <div className="w-full lg:w-48">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Tipo
            </label>
            <select className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted outline-none focus:ring-2 focus:ring-primary">
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
            <select className="w-full border rounded-lg px-4 py-2.5 text-sm bg-muted outline-none focus:ring-2 focus:ring-primary">
              <option>Sin límite</option>
              <option>150.000 €</option>
              <option>300.000 €</option>
              <option>500.000 €</option>
              <option>1.000.000 €</option>
            </select>
          </div>
          <Button className="gap-2 w-full lg:w-auto">
            <Search className="h-4 w-4" />
            Búsqueda Inteligente
          </Button>
        </div>
      </div>
    </section>
  );
}
