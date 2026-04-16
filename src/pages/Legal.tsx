import Layout from "@/components/layout/Layout";

export default function Legal() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl prose prose-sm">
          <h1 className="text-3xl font-extrabold mb-8">Aviso Legal</h1>

          <h2 className="text-xl font-bold mt-8 mb-3">Identificación</h2>
          <p>Titular: Vexturia<br />Domicilio: Huelva, España<br />Correo electrónico: info@vexturia.com</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Objeto</h2>
          <p>El presente aviso legal regula el uso del sitio web vexturia.com. El acceso y uso del sitio atribuye la condición de usuario e implica la aceptación de las condiciones aquí recogidas.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Propiedad intelectual</h2>
          <p>Todos los contenidos del sitio web — textos, imágenes, diseño gráfico, logotipos, código fuente — son propiedad de Vexturia o de sus legítimos titulares y están protegidos por la legislación vigente en materia de propiedad intelectual e industrial.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Responsabilidad</h2>
          <p>Vexturia no se hace responsable de los daños que pudieran derivarse del uso del sitio web, incluyendo errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Legislación aplicable</h2>
          <p>La relación entre Vexturia y el usuario se regirá por la legislación española. Para cualquier controversia, las partes se someterán a los Juzgados y Tribunales de Huelva.</p>
        </div>
      </section>
    </Layout>
  );
}
