import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "vexturiaglobal@gmail.com";
const FROM_LEAD = "Vexturia <hola@vexturia.com>";
const FROM_NOTIFY = "Vexturia Alerts <hola@vexturia.com>";

type EmailType = "admin_lead" | "client_confirmation" | "admin_valuation";

interface RequestBody {
  type: EmailType;
  // common
  nombre?: string;
  email?: string;
  telefono?: string;
  origen?: string;
  conversacion?: string;
  // valuation extras
  valoracion?: Record<string, unknown>;
}

const escape = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const wrap = (title: string, bodyHtml: string) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>${escape(title)}</title></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Montserrat',Arial,sans-serif;color:#1A223B;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(26,34,59,0.08);">
        <tr><td style="background:#1A223B;padding:24px 32px;">
          <h1 style="margin:0;color:#00BABA;font-size:24px;font-weight:800;letter-spacing:-0.5px;">VEXTURIA</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="background:#f4f5f7;padding:16px 32px;text-align:center;font-size:12px;color:#6B7280;">
          © ${new Date().getFullYear()} Vexturia · Inteligencia inmobiliaria
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

async function sendEmail(opts: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string;
}) {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY no configurada");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(opts),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Resend error:", res.status, text);
    throw new Error(`Resend ${res.status}: ${text}`);
  }
  return JSON.parse(text);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as RequestBody;
    const { type, nombre, email, telefono, origen, valoracion } = body;

    if (!type) {
      return new Response(JSON.stringify({ error: "type requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fecha = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
    const results: unknown[] = [];

    if (type === "admin_lead") {
      if (!nombre) throw new Error("nombre requerido");
      const html = wrap(
        "Nuevo lead",
        `
        <h2 style="margin:0 0 16px;font-size:20px;color:#1A223B;">Nuevo lead recibido</h2>
        <p style="margin:0 0 24px;color:#4B5563;">Se ha registrado un nuevo contacto en Vexturia.</p>
        <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;">
          <tr><td style="font-weight:600;width:140px;">Nombre</td><td>${escape(nombre)}</td></tr>
          <tr><td style="font-weight:600;">Teléfono</td><td>${escape(telefono || "—")}</td></tr>
          <tr><td style="font-weight:600;">Email</td><td>${escape(email || "—")}</td></tr>
          <tr><td style="font-weight:600;">Origen</td><td>${escape(origen || "—")}</td></tr>
          <tr><td style="font-weight:600;">Fecha</td><td>${escape(fecha)}</td></tr>
        </table>`
      );
      results.push(
        await sendEmail({
          from: FROM_NOTIFY,
          to: ADMIN_EMAIL,
          subject: `Nuevo lead en Vexturia — ${nombre}`,
          html,
          reply_to: email || undefined,
        })
      );
    }

    if (type === "client_confirmation") {
      if (!email) throw new Error("email requerido");
      const html = wrap(
        "Hemos recibido tu consulta",
        `
        <h2 style="margin:0 0 16px;font-size:22px;color:#1A223B;">Hola${nombre ? `, ${escape(nombre)}` : ""} 👋</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
          Gracias por contactar con <strong style="color:#00BABA;">Vexturia</strong>. Hemos recibido tu consulta correctamente.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
          Uno de nuestros expertos inmobiliarios revisará tu solicitud y se pondrá en contacto contigo en
          <strong>menos de 24 horas</strong> para ofrecerte el mejor asesoramiento personalizado.
        </p>
        <div style="background:linear-gradient(135deg,#00BABA 0%,#008f8f 100%);border-radius:10px;padding:20px;text-align:center;margin:24px 0;">
          <p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">Inteligencia inmobiliaria al servicio de tu inversión</p>
        </div>
        <p style="margin:0;font-size:13px;color:#6B7280;">Si necesitas ayuda inmediata, escríbenos a <a href="mailto:hola@vexturia.com" style="color:#00BABA;text-decoration:none;">hola@vexturia.com</a>.</p>`
      );
      results.push(
        await sendEmail({
          from: FROM_LEAD,
          to: email,
          subject: "Hemos recibido tu consulta — Vexturia",
          html,
        })
      );
    }

    if (type === "admin_valuation") {
      const v = valoracion || {};
      const direccion = (v as any).direccion || (v as any).municipio || "Sin dirección";
      const rows = Object.entries(v)
        .map(
          ([k, val]) =>
            `<tr><td style="font-weight:600;width:180px;text-transform:capitalize;">${escape(k)}</td><td>${escape(
              Array.isArray(val) ? val.join(", ") : (val as any) ?? "—"
            )}</td></tr>`
        )
        .join("");
      const html = wrap(
        "Nueva valoración",
        `
        <h2 style="margin:0 0 16px;font-size:20px;color:#1A223B;">Nueva solicitud de valoración</h2>
        <p style="margin:0 0 24px;color:#4B5563;">Inmueble: <strong>${escape(direccion)}</strong></p>
        <h3 style="margin:24px 0 8px;font-size:15px;color:#1A223B;">Datos del inmueble</h3>
        <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;">
          ${rows || '<tr><td>Sin datos</td></tr>'}
        </table>
        <h3 style="margin:24px 0 8px;font-size:15px;color:#1A223B;">Datos de contacto</h3>
        <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;">
          <tr><td style="font-weight:600;width:140px;">Nombre</td><td>${escape(nombre || "—")}</td></tr>
          <tr><td style="font-weight:600;">Teléfono</td><td>${escape(telefono || "—")}</td></tr>
          <tr><td style="font-weight:600;">Email</td><td>${escape(email || "—")}</td></tr>
          <tr><td style="font-weight:600;">Fecha</td><td>${escape(fecha)}</td></tr>
        </table>`
      );
      results.push(
        await sendEmail({
          from: FROM_NOTIFY,
          to: ADMIN_EMAIL,
          subject: `Nueva solicitud de valoración — ${direccion}`,
          html,
          reply_to: email || undefined,
        })
      );
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-resend-email error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
