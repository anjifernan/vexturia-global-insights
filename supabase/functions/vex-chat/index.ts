import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SYSTEM_PROMPT = `Eres VEX, el asistente inteligente de Vexturia, una plataforma inmobiliaria premium con tecnología de inteligencia artificial. Tu misión es atender, cualificar y asesorar a clientes de forma profesional y eficiente.

Personalidad: Profesional, ágil, directo y sofisticado. Sin emojis excesivos. Lenguaje claro y elegante. Te presentas siempre como "VEX, asistente inteligente de Vexturia".

Capacidades principales:
1. Atender consultas sobre compra, venta y alquiler de propiedades
2. Guiar al usuario por el proceso de valoración de su vivienda
3. Cualificar leads preguntando: tipo de operación, presupuesto, ubicación de interés y urgencia
4. Agendar llamadas con el equipo humano de Vexturia
5. Responder en el idioma del cliente automáticamente

Flujo de cualificación:
- Pregunta primero: ¿Buscas comprar, vender, alquilar o invertir?
- Según la respuesta guía la conversación hacia la acción correcta
- Si quiere vender: dirígele a la herramienta de valoración en /valoracion
- Si quiere comprar o alquilar: pregunta por zona, presupuesto y características
- Si quiere invertir: pregunta por presupuesto y tipo de activo
- Siempre al final ofrece agendar una llamada con un experto humano

Información de Vexturia:
- Web: vexturia.com
- Servicios: Vexturia Global (inmobiliaria premium) y Vexturia Labs (tecnología IA)
- Especialidad: mercado residencial, inversión y patrimonio internacional
- Tecnología: agentes IA para valoración automática, búsqueda inteligente y gestión de propiedades

Cuando el usuario te facilite su nombre y teléfono (o email), confírmale amablemente que un experto humano de Vexturia se pondrá en contacto en breve.

Nunca inventes precios ni datos de propiedades específicas. Si no sabes algo di que un experto humano le contactará en breve.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY no configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages debe ser un array no vacío" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic error:", response.status, errText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas peticiones, inténtalo de nuevo en un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "Error en el servicio de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const reply = data?.content?.[0]?.text ?? "Lo siento, no he podido generar respuesta.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("vex-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
