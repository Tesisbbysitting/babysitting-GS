"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegistroPadre() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    dni: "",
    telefono: "",
    zona: "",
    barrio: "",
    cantidad_hijos: "",
    edades_hijos: "",
    colegio_hijos: "",
    especificaciones: "",
    universidad_padres: "",
    club: "",
    colegio_padres: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleStep1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validar campos
    if (!form.nombre || !form.dni || !form.telefono || !form.zona || !form.barrio || !form.cantidad_hijos || !form.edades_hijos || !form.colegio_hijos) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "padre",
          correo: form.email,
          contrasena: form.password,
          nombre_completo: form.nombre,
          dni: form.dni,
          telefono_celular: form.telefono,
          zona: form.zona,
          barrio: form.barrio,
          cantidad_hijos: form.cantidad_hijos,
          edades_hijos: form.edades_hijos,
          colegio_hijos: form.colegio_hijos,
          especificaciones: form.especificaciones,
          universidad_padres: form.universidad_padres,
          club: form.club,
          colegio_padres: form.colegio_padres
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
        setTimeout(() => router.push("/login-usuario"), 1500);
      } else {
        setError(data.error || "Error al registrar");
      }
    } catch (err) {
      setError("Error al registrar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-goetheGreen/10 to-white py-12">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-goetheGreen">Registro Padre</h1>
        {step === 1 ? (
          <form className="flex flex-col gap-4" onSubmit={handleStep1}>
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="Correo electrónico" required value={form.email} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="Contraseña" required value={form.password} onChange={handleChange} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button className="bg-goetheGreen hover:bg-goetheGreen/90 w-full" type="submit">
              Siguiente
            </Button>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" type="text" placeholder="Nombre completo" required value={form.nombre} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" type="number" placeholder="DNI" required value={form.dni} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono celular</Label>
              <Input id="telefono" type="text" placeholder="Teléfono celular" required value={form.telefono} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="zona">Zona</Label>
              <Input id="zona" type="text" placeholder="Zona" required value={form.zona} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="barrio">Barrio</Label>
              <Input id="barrio" type="text" placeholder="Barrio" required value={form.barrio} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="cantidad_hijos">Cantidad de hijos</Label>
              <Input id="cantidad_hijos" type="number" placeholder="Cantidad de hijos" required value={form.cantidad_hijos} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="edades_hijos">Edades de hijos</Label>
              <Input id="edades_hijos" type="text" placeholder="Edades de hijos" required value={form.edades_hijos} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="colegio_hijos">Colegio de hijos</Label>
              <Input id="colegio_hijos" type="text" placeholder="Colegio de hijos" required value={form.colegio_hijos} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="especificaciones">Especificaciones</Label>
              <Input id="especificaciones" type="text" placeholder="Especificaciones" value={form.especificaciones} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="universidad_padres">Universidad padres</Label>
              <Input id="universidad_padres" type="text" placeholder="Universidad padres" value={form.universidad_padres} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="club">Club</Label>
              <Input id="club" type="text" placeholder="Club" value={form.club} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="colegio_padres">Colegio padres</Label>
              <Input id="colegio_padres" type="text" placeholder="Colegio padres" value={form.colegio_padres} onChange={handleChange} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button className="bg-goetheGreen hover:bg-goetheGreen/90 w-full" type="submit">
              Crear cuenta
            </Button>
          </form>
        )}
      </div>
    </div>
  );
} 