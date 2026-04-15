import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Introduce email y contraseña");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Revisa tu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        onLogin();
      }
    } catch (err: any) {
      toast.error(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="bg-card rounded-xl border p-8 shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <Lock className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-xl font-extrabold">VEXTURIA Admin</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Crear cuenta de administrador" : "Panel de administración"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm bg-muted"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm bg-muted"
            minLength={6}
            required
          />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Cargando..." : isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground transition-colors"
        >
          {isSignUp ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>
    </div>
  );
}
