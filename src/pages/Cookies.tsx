import Layout from "@/components/layout/Layout";

export default function Cookies() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl prose prose-sm">
          <h1 className="text-3xl font-extrabold mb-8">Política de Cookies</h1>

          <h2 className="text-xl font-bold mt-8 mb-3">¿Qué son las cookies?</h2>
          <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo cuando los visita. Se utilizan para recordar preferencias, mejorar la experiencia de navegación y recopilar información estadística.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Tipos de cookies que utilizamos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Cookies técnicas:</strong> necesarias para el funcionamiento básico del sitio.</li>
            <li><strong>Cookies analíticas:</strong> nos ayudan a entender cómo los usuarios interactúan con el sitio web.</li>
            <li><strong>Cookies de preferencias:</strong> permiten recordar sus opciones de configuración.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-3">Gestión de cookies</h2>
          <p>Puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envíe una cookie. Sin embargo, si rechaza las cookies, es posible que algunas funciones del sitio no estén disponibles.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Más información</h2>
          <p>Para cualquier duda sobre nuestra política de cookies, puede contactarnos en info@vexturia.com.</p>
        </div>
      </section>
    </Layout>
  );
}
