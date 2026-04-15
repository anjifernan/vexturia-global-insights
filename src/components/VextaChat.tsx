import { useState, useEffect } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "./ui/button";

export default function VextaChat() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-vexta-chat", handler);
    return () => window.removeEventListener("open-vexta-chat", handler);
  }, []);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Abrir chat Vexta-1"
        >
          <Bot className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-background rounded-xl shadow-2xl border flex flex-col overflow-hidden animate-fade-in">
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <span className="font-semibold text-sm text-primary-foreground">Vexta-1</span>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>
          <div className="flex-1 p-4 min-h-[250px] max-h-[350px] overflow-y-auto">
            <div className="bg-muted rounded-lg p-3 text-sm max-w-[80%]">
              Hola, soy <strong>Vexta-1</strong>. ¿En qué puedo ayudarte hoy?
            </div>
          </div>
          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              className="flex-1 text-sm bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              disabled
            />
            <Button size="icon" variant="default" disabled>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
