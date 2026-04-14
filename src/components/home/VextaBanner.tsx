import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VextaBanner() {
  return (
    <section className="bg-dark-bg py-20">
      <div className="container mx-auto px-4 text-center">
        <Bot className="h-12 w-12 text-primary mx-auto mb-6" />
        <h2 className="text-3xl font-extrabold text-primary-foreground mb-4">
          Vexta-1 trabaja por ti las 24 horas
        </h2>
        <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
          Nuestro asistente inteligente atiende, filtra y asesora a tus clientes
          mientras tú te centras en cerrar operaciones.
        </p>
        <Button size="lg">Probar Vexta-1 ahora</Button>
      </div>
    </section>
  );
}
