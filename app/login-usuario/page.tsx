"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginUsuario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });
      const data = await response.json();
      if (data.success && data.session) {
        // Guardar token en localStorage
        localStorage.setItem("sb_token", data.session.access_token);
        // Forzar reload para que el Navbar detecte el login
        if (data.tipo === "padre") {
          window.location.href = "/perfiles";
        } else if (data.tipo === "babysitter") {
          window.location.href = "/mi-perfil";
        } else {
          window.location.href = "/";
        }
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-goetheGreen/10 to-white py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-goetheGreen">Iniciar sesión</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="Correo electrónico" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" placeholder="Contraseña" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button className="bg-goetheGreen hover:bg-goetheGreen/90 w-full" type="submit">
            Iniciar sesión
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/registro-usuario" className="text-goetheGreen hover:underline">
            ¿No tenés cuenta? Registrate
          </Link>
        </div>
      </div>
    </div>
  );
} 