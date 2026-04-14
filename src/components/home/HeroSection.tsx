import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Edificio urbano moderno"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-foreground/60" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground mb-6 leading-tight">
          Inteligencia Global,
          <br />
          Propiedad Real.
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
          Simplificamos la compra, venta y gestión de propiedades con tecnología
          de vanguardia e inteligencia artificial.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/propiedades">Encuentra tu próximo hogar</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link to="/valoracion">¿Cuánto vale tu vivienda?</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
