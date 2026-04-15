import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Footer() {
  const [telefono, setTelefono] = useState("+34 661 404 384");
  const [email, setEmail] = useState("info@vexturia.com");
  const [direccion, setDireccion] = useState("Huelva, España");

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from("configuracion").select("*").limit(1).maybeSingle();
      if (data) {
        if (data.telefono) setTelefono(data.telefono);
        if (data.email) setEmail(data.email);
        if (data.direccion) setDireccion(data.direccion);
      }
    };
    fetchConfig();
  }, []);

  return (
    <footer className="bg-dark-bg text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-extrabold mb-2">VEXTURIA</h3>
            <p className="text-sm text-primary-foreground/70">
              Global Real Estate Management | IA Labs
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link to="/propiedades" className="hover:text-primary transition-colors">Propiedades</Link></li>
              <li><Link to="/valoracion" className="hover:text-primary transition-colors">Valoración</Link></li>
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Servicios
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/global" className="hover:text-primary transition-colors">Vexturia Global</Link></li>
              <li><Link to="/labs" className="hover:text-primary transition-colors">Vexturia Labs</Link></li>
              <li><Link to="/valoracion" className="hover:text-primary transition-colors">Valoración Inteligente</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>{email}</li>
              <li>{telefono}</li>
              <li>{direccion}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Vexturia. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-xs text-primary-foreground/50">
            <span>Política de Privacidad</span>
            <span>Aviso Legal</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
