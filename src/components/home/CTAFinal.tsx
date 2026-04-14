import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CTAFinal() {
  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold text-primary-foreground mb-8">
          ¿Listo para dar el siguiente paso?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="font-semibold"
            asChild
          >
            <Link to="/propiedades">Ver propiedades</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-semibold"
            asChild
          >
            <Link to="/contacto">Contactar con un experto</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
