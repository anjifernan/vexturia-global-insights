import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { MapPin, Maximize, BedDouble, Bath, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const property = {
  id: 1,
  title: "Ático de lujo con vistas panorámicas",
  type: "Ático",
  operation: "Venta",
  location: "Madrid, Salamanca",
  address: "Calle Serrano 45, 28001 Madrid",
  m2: 180,
  rooms: 3,
  baths: 2,
  price: 1250000,
  premium: true,
  year: 2020,
  floor: "8ª planta",
  description: "Espectacular ático en pleno barrio de Salamanca con acabados de primer nivel. Amplia terraza con vistas panorámicas a la ciudad. Cocina de diseño totalmente equipada, suelos de mármol y domótica integrada. Garaje y trastero incluidos.",
  extras: ["Ascensor", "Garaje", "Terraza", "Aire acondicionado", "Domótica", "Trastero"],
  images: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
  ],
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      nombre: nombre.trim(),
      email: email.trim() || null,
      telefono: telefono.trim() || null,
      origen: "detalle-inmueble",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Error al enviar");
      console.error(error);
    } else {
      setSubmitted(true);
      toast.success("¡Solicitud enviada!");
    }
  };

  const openVextaChat = () => {
    // Trigger Vexta chat by dispatching a custom event
    window.dispatchEvent(new CustomEvent("open-vexta-chat"));
  };

  return (
    <Layout>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Link to="/propiedades" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" /> Volver a propiedades
          </Link>

          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <div className="md:col-span-2">
              <img src={property.images[0]} alt={property.title} className="w-full h-[400px] object-cover rounded-xl" width={1200} height={600} />
            </div>
            <div className="grid grid-rows-2 gap-3">
              {property.images.slice(1).map((img, i) => (
                <img key={i} src={img} alt="" className="w-full h-full object-cover rounded-xl" loading="lazy" width={600} height={400} />
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                {property.premium && (
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">Premium</span>
                )}
                <span className="text-xs font-semibold text-primary uppercase">{property.type} · {property.operation}</span>
              </div>
              <h1 className="text-3xl font-extrabold mb-2">{property.title}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mb-6"><MapPin className="h-4 w-4" />{property.address}</p>

              <div className="flex gap-6 mb-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Maximize className="h-4 w-4" />{property.m2} m²</span>
                <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{property.rooms} hab.</span>
                <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.baths} baños</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{property.year}</span>
              </div>

              <p className="text-2xl font-extrabold text-primary mb-8">{property.price.toLocaleString("es-ES")} €</p>

              <h2 className="text-lg font-bold mb-3">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{property.description}</p>

              <h2 className="text-lg font-bold mb-3">Extras</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {property.extras.map((e) => (
                  <span key={e} className="bg-muted px-3 py-1.5 rounded-full text-xs font-medium">{e}</span>
                ))}
              </div>

              <h2 className="text-lg font-bold mb-3">Localización</h2>
              <div className="bg-muted rounded-xl h-64 flex items-center justify-center text-muted-foreground text-sm">
                Mapa de Google Maps (integración pendiente)
              </div>
            </div>

            {/* Contact sidebar */}
            <div>
              <div className="sticky top-24 space-y-4">
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                  <h3 className="font-bold mb-4">¿Te interesa esta propiedad?</h3>
                  {!submitted ? (
                    <form className="space-y-3" onSubmit={handleSubmit}>
                      <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre"
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-muted"
                      />
                      <input
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Teléfono"
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-muted"
                      />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-muted"
                      />
                      <textarea
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Mensaje"
                        rows={3}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-muted"
                      />
                      <Button className="w-full" type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Solicitar información
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-primary font-semibold mb-1">¡Solicitud enviada!</p>
                      <p className="text-sm text-muted-foreground">Te contactaremos pronto.</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={openVextaChat}
                  className="w-full bg-[#00BABA] hover:bg-[#00BABA]/90 text-white font-semibold"
                  size="lg"
                >
                  Agendar visita con Vexta-1
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
