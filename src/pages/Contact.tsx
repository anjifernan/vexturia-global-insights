import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-center mb-4">Contacto</h1>
          <p className="text-center text-muted-foreground mb-16">Estamos aquí para ayudarte</p>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div>
              <form className="space-y-4">
                <input placeholder="Nombre" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input placeholder="Email" type="email" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                <input placeholder="Teléfono" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                <select className="w-full border rounded-lg px-4 py-3 text-sm bg-muted">
                  <option>Tipo de consulta</option>
                  <option>Quiero comprar</option>
                  <option>Quiero vender</option>
                  <option>Quiero alquilar</option>
                  <option>Valoración</option>
                  <option>Inversión</option>
                  <option>Otro</option>
                </select>
                <textarea placeholder="Mensaje" rows={5} className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                <Button className="w-full" size="lg">Enviar mensaje</Button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Dirección</h3>
                  <p className="text-sm text-muted-foreground">Madrid, España</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Teléfono</h3>
                  <p className="text-sm text-muted-foreground">+34 900 000 000</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">info@vexturia.com</p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-muted rounded-xl h-64 flex items-center justify-center text-muted-foreground text-sm">
                Mapa de Google Maps (integración pendiente)
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
