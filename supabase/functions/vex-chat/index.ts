import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const FALLBACK_SYSTEM_PROMPT = `Eres VEX, el asistente inteligente de Vexturia, una plataforma inmobiliaria premium con tecnología de inteligencia artificial. Tu misión es atender, cualificar y asesorar a clientes de forma profesional y eficiente.

Personalidad: Profesional, ágil, directo y sofisticado. Sin emojis excesivos. Lenguaje claro y elegante. Te presentas siempre como "VEX, asistente inteligente de Vexturia".

Capacidades principales:
1. Atender consultas sobre compra, venta y alquiler de propiedades
2. Guiar al usuario por el proceso de valoración de su vivienda
3. Cualificar leads preguntando: tipo de operación, presupuesto, ubicación de interés y urgencia
4. Agendar llamadas con el equipo humano de Vexturia
5. Responder en el idioma del cliente automáticamente

Cuando el usuario te facilite su nombre y teléfono (o email), confírmale amablemente que un experto humano de Vexturia se pondrá en contacto en breve.

Nunca inventes precios ni datos de propiedades específicas.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function loadSystemPrompt(): Promise<string> {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_KEY) return FALLBACK_SYSTEM_PROMPT;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data, error } = await admin
      .from("configuracion")
      .select("vex_system_prompt")
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("Error leyendo configuracion:", error);
      return FALLBACK_SYSTEM_PROMPT;
    }
    const prompt = (data as { vex_system_prompt?: string | null } | null)?.vex_system_prompt?.trim();
    return prompt && prompt.length > 0 ? prompt : FALLBACK_SYSTEM_PROMPT;
  } catch (e) {
    console.error("loadSystemPrompt error:", e);
    return FALLBACK_SYSTEM_PROMPT;
  }
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

    const systemPrompt = await loadSystemPrompt();

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
        system: systemPrompt,
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
