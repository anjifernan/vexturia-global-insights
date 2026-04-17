import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { nombre, telefono, email } = await req.json();

    if (!nombre || (!telefono && !email)) {
      return new Response(
        JSON.stringify({ error: "Se requiere nombre y al menos teléfono o email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("leads")
      .insert({
        nombre: String(nombre).slice(0, 200),
        telefono: telefono ? String(telefono).slice(0, 50) : null,
        email: email ? String(email).slice(0, 200) : null,
        origen: "vex-chat",
      })
      .select()
      .single();

    if (error) {
      console.error("Insert lead error:", error);
      return new Response(
        JSON.stringify({ error: "No se pudo guardar el lead" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true, lead: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("vex-save-lead error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
