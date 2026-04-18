import { useState, useEffect, useRef } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const INITIAL_MESSAGE: Msg = {
  role: "assistant",
  content:
    "Hola, soy VEX, asistente inteligente de Vexturia. ¿Buscas comprar, vender, alquilar o invertir?",
};

// Heurística: detectar nombre + teléfono o email en el mensaje del usuario
function extractContact(text: string): { nombre?: string; telefono?: string; email?: string } {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
  // Nombre: busca patrón "me llamo X" o "soy X" o "mi nombre es X"
  const nameMatch =
    text.match(/(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ]+)?)/i);
  return {
    nombre: nameMatch?.[1]?.trim(),
    telefono: phoneMatch?.[1]?.replace(/\s+/g, " ").trim(),
    email: emailMatch?.[0]?.trim(),
  };
}

export default function VextaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-vexta-chat", handler);
    return () => window.removeEventListener("open-vexta-chat", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const trySaveLead = async (text: string, history: Msg[]) => {
    if (leadSaved) return;
    const { nombre, telefono, email } = extractContact(text);
    if (nombre && (telefono || email)) {
      try {
        const conversacion = history
          .map((m) => `${m.role === "user" ? "Cliente" : "VEX"}: ${m.content}`)
          .join("\n\n");
        const { error } = await supabase.functions.invoke("vex-save-lead", {
          body: { nombre, telefono, email, conversacion },
        });
        if (!error) setLeadSaved(true);
      } catch (e) {
        console.error("save lead error", e);
      }
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);

    trySaveLead(text);

    try {
      const { data, error } = await supabase.functions.invoke("vex-chat", {
        body: { messages: next.map(({ role, content }) => ({ role, content })) },
      });
      if (error) throw error;
      const reply = (data as { reply?: string })?.reply ?? "Lo siento, no he podido responder.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "No se pudo conectar con VEX. Inténtalo de nuevo.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Disculpa, ha habido un problema técnico. Vuelve a intentarlo en un momento." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Abrir chat VEX"
        >
          <Bot className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-background rounded-xl shadow-2xl border flex flex-col overflow-hidden animate-fade-in">
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <span className="font-semibold text-sm text-primary-foreground">VEX · Asistente Vexturia</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar">
              <X className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 text-sm max-w-[85%] whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-muted rounded-lg p-3 text-sm max-w-[85%] inline-flex gap-1">
                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escribe tu mensaje..."
              className="flex-1 text-sm bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <Button size="icon" variant="default" onClick={send} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
