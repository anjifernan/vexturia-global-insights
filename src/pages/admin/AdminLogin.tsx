import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="bg-card rounded-xl border p-8 shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <Lock className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-xl font-extrabold">VEXTURIA Admin</h1>
          <p className="text-sm text-muted-foreground">Panel de administración</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm bg-muted"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm bg-muted"
          />
          <Button className="w-full" type="submit">Iniciar sesión</Button>
        </form>
      </div>
    </div>
  );
}
