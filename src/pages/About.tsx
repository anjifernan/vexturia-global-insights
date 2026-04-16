import Layout from "@/components/layout/Layout";
import { Users, Lightbulb, Heart } from "lucide-react";
import fernandoImg from "@/assets/fernando-sanchez.png";
import angelImg from "@/assets/angel-jimenez.png";

const teamMembers = [
  { name: "Fernando Sánchez", role: "Gerente", image: fernandoImg },
  { name: "Ángel Jiménez", role: "Gestor IA", image: angelImg },
  { name: "Miembro del equipo", role: "Cargo", image: null },
  { name: "Miembro del equipo", role: "Cargo", image: null },
];

export default function About() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-extrabold text-center mb-4">Sobre Nosotros</h1>
          <p className="text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed">
            En Vexturia, no creemos que el sector inmobiliario deba ser un proceso lento, opaco o estresante.
            Nacimos de una visión clara: fusionar la experiencia humana en la gestión de propiedades con el poder
            transformador de la Inteligencia Artificial. No solo vendemos, compramos o alquilamos casas; construimos
            estructuras inteligentes que conectan a las personas con su espacio ideal de forma precisa, rápida y transparente.
          </p>

          {/* Pillars */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card rounded-xl border p-8">
              <Lightbulb className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-xl font-bold mb-3">Vexturia Global</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nuestra división de servicios inmobiliarios de alto nivel. Compra, venta, alquiler y gestión de patrimonio
                con un enfoque personalizado y resultados medibles.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-8">
              <Heart className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-xl font-bold mb-3">Vexturia Labs</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nuestro laboratorio de innovación donde diseñamos agentes de IA para transformar la experiencia
                inmobiliaria. Tecnología al servicio de personas.
              </p>
            </div>
          </div>

          {/* Philosophy */}
          <div className="bg-muted/50 rounded-2xl p-10 text-center mb-16">
            <p className="text-lg italic text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              "La tecnología no está aquí para sustituir al agente inmobiliario, sino para liberarlo de las tareas
              mecánicas y permitirle centrarse en lo más importante: escuchar y asesorar al cliente."
            </p>
          </div>

          {/* Team */}
          <h2 className="text-2xl font-extrabold text-center mb-10">Nuestro Equipo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
