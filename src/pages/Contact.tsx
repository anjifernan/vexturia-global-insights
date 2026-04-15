import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Contact() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoConsulta, setTipoConsulta] = useState("Tipo de consulta");
  const [mensaje, setMensaje] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Config from Supabase
  const [configTelefono, setConfigTelefono] = useState("+34 900 000 000");
  const [configEmail, setConfigEmail] = useState("info@vexturia.com");
  const [configDireccion, setConfigDireccion] = useState("Madrid, España");

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from("configuracion").select("*").limit(1).maybeSingle();
      if (data) {
        if (data.telefono) setConfigTelefono(data.telefono);
        if (data.email) setConfigEmail(data.email);
        if (data.direccion) setConfigDireccion(data.direccion);
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      toast.error("Nombre y email son obligatorios");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim() || null,
      origen: "contacto-web",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Error al enviar el formulario");
      console.error(error);
    } else {
      setSubmitted(true);
      toast.success("¡Mensaje enviado correctamente!");
    }
  };

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-center mb-4">Contacto</h1>
          <p className="text-center text-muted-foreground mb-16">Estamos aquí para ayudarte</p>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div>
              {!submitted ? (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                  <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                  <select value={tipoConsulta} onChange={(e) => setTipoConsulta(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-sm bg-muted">
                    <option>Tipo de consulta</option>
                    <option>Quiero comprar</option>
                    <option>Quiero vender</option>
                    <option>Quiero alquilar</option>
                    <option>Valoración</option>
                    <option>Inversión</option>
                    <option>Otro</option>
                  </select>
                  <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Mensaje" rows={5} className="w-full border rounded-lg px-4 py-3 text-sm bg-muted" />
                  <Button className="w-full" size="lg" type="submit" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Enviar mensaje
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">¡Mensaje enviado!</h3>
                  <p className="text-muted-foreground">Nos pondremos en contacto contigo lo antes posible.</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Dirección</h3>
                  <p className="text-sm text-muted-foreground">{configDireccion}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Teléfono</h3>
                  <p className="text-sm text-muted-foreground">{configTelefono}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">{configEmail}</p>
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
