import Layout from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl prose prose-sm">
          <h1 className="text-3xl font-extrabold mb-8">Política de Privacidad</h1>

          <p>En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales, le informamos de lo siguiente:</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Responsable del tratamiento</h2>
          <p>Vexturia · Huelva, España · info@vexturia.com</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Finalidad del tratamiento</h2>
          <p>Los datos personales que nos facilite serán tratados con las siguientes finalidades:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Gestionar consultas y solicitudes de información.</li>
            <li>Prestar los servicios inmobiliarios solicitados.</li>
            <li>Enviar comunicaciones comerciales previo consentimiento.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-3">Legitimación</h2>
          <p>El consentimiento del interesado, la ejecución de un contrato o el interés legítimo del responsable.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Destinatarios</h2>
          <p>No se cederán datos a terceros salvo obligación legal o necesidad para la prestación del servicio.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Derechos</h2>
          <p>Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a info@vexturia.com.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">Conservación</h2>
          <p>Los datos se conservarán mientras sea necesario para la finalidad para la que fueron recogidos y durante los plazos legalmente establecidos.</p>
        </div>
      </section>
    </Layout>
  );
}
