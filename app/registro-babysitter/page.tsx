"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

export default function RegistroBabysitter() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    edad: "",
    zona: "",
    disponibilidad: "",
    universidad: "",
    carrera: "",
    experiencia: "",
    descripcion: "",
    hobbies: "",
    precio: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [comentario, setComentario] = useState({ nombre: "", fecha: "", texto: "" });
  const [comentarios, setComentarios] = useState<{ nombre: string; fecha: string; texto: string }[]>([]);
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const TURNOS = ["Mañana", "Tarde", "Noche"];
  const [disponibilidadTable, setDisponibilidadTable] = useState<{[dia: string]: {[turno: string]: boolean}}>(() => {
    const obj: any = {};
    DIAS.forEach(dia => {
      obj[dia] = {};
      TURNOS.forEach(turno => { obj[dia][turno] = false });
    });
    return obj;
  });
  const [hobbyInput, setHobbyInput] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }
    setStep(2);
  };

  const handleDisponibilidadChange = (dia: string, turno: string) => {
    setDisponibilidadTable(prev => ({
      ...prev,
      [dia]: { ...prev[dia], [turno]: !prev[dia][turno] }
    }))
  };

  const disponibilidadToString = () => {
    const seleccionados: string[] = [];
    DIAS.forEach(dia => {
      TURNOS.forEach(turno => {
        if (disponibilidadTable[dia]?.[turno]) {
          seleccionados.push(`${dia}: ${turno}`)
        }
      })
    })
    return seleccionados.join(", ")
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.nombre || !form.edad || !form.zona || !form.universidad || !form.carrera || !form.experiencia || !form.descripcion || hobbies.length === 0 || !form.precio) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    const disponibilidad = disponibilidadToString();
    try {
      // 1. Crear babysitter
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "babysitter",
          correo: form.email,
          contrasena: form.password,
          nombre: form.nombre,
          edad: Number(form.edad),
          zona: form.zona,
          disponibilidad,
          universidad: form.universidad,
          carrera: form.carrera,
          experiencia: form.experiencia,
          descripcion: form.descripcion,
          hobbies,
          Precio_por_hora: Number(form.precio),
          foto: ""
        })
      });
      const data = await res.json();
      if (data.success && data.id) {
        // 2. Si hay comentarios, agregarlos a la tabla Comentarios
        if (comentarios.length > 0) {
          for (const c of comentarios) {
            await fetch("/api/comentarios/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nombre: c.nombre,
                fecha: c.fecha,
                texto: c.texto,
                babysitter_id: data.id
              })
            });
          }
        }
        setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
        setTimeout(() => router.push("/login-usuario"), 1500);
      } else if (data.success) {
        setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
        setTimeout(() => router.push("/login-usuario"), 1500);
      } else {
        setError(data.error || "Error al registrar");
      }
    } catch (err) {
      setError("Error al registrar");
    }
  };

  const handleAddComentario = () => {
    if (comentario.nombre && comentario.fecha && comentario.texto) {
      setComentarios((prev) => [...prev, comentario]);
      setComentario({ nombre: "", fecha: "", texto: "" });
    }
  };

  const handleRemoveComentario = (idx: number) => {
    setComentarios((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddHobby = () => {
    if (hobbyInput.trim()) {
      setHobbies((prev) => [...prev, hobbyInput.trim()]);
      setHobbyInput("");
    }
  };

  const handleRemoveHobby = (hobby: string) => {
    setHobbies((prev) => prev.filter((h) => h !== hobby));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-goetheGreen/10 to-white py-12">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-goetheGreen">Registro Babysitter</h1>
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
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" type="text" placeholder="Nombre" required value={form.nombre} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="edad">Edad</Label>
              <Input id="edad" type="number" placeholder="Edad" required value={form.edad} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="zona">Zona</Label>
              <Input id="zona" type="text" placeholder="Zona" required value={form.zona} onChange={handleChange} />
            </div>
            <div className="mb-4">
              <Label className="font-semibold mb-1 block">Disponibilidad</Label>
              <div className="overflow-x-auto">
                <table className="min-w-max border-separate border-spacing-0 rounded-xl shadow-md bg-white">
                  <thead>
                    <tr>
                      <th className="bg-goetheGreen/10 text-goetheGreen border-b px-3 py-2 rounded-tl-xl"></th>
                      {DIAS.map((dia, idx) => (
                        <th key={dia} className={`bg-goetheGreen/10 text-goetheGreen border-b px-3 py-2 font-semibold ${idx === DIAS.length-1 ? 'rounded-tr-xl' : ''}`}>{dia}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TURNOS.map((turno, tIdx) => (
                      <tr key={turno} className="even:bg-gray-50">
                        <td className="font-semibold text-gray-700 px-3 py-2 border-b border-r min-w-[80px]">{turno}</td>
                        {DIAS.map((dia, dIdx) => (
                          <td key={dia} className={`border-b border-r px-3 py-2 text-center transition-colors hover:bg-goetheGreen/5 ${tIdx === TURNOS.length-1 ? 'last:rounded-bl-xl' : ''} ${dIdx === DIAS.length-1 && tIdx === TURNOS.length-1 ? 'rounded-br-xl' : ''}`}> 
                            <input
                              type="checkbox"
                              className="w-5 h-5 accent-goetheGreen cursor-pointer"
                              checked={!!disponibilidadTable[dia]?.[turno]}
                              onChange={() => handleDisponibilidadChange(dia, turno)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <Label htmlFor="universidad">Universidad</Label>
              <Input id="universidad" type="text" placeholder="Universidad" required value={form.universidad} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="carrera">Carrera</Label>
              <Input id="carrera" type="text" placeholder="Carrera" required value={form.carrera} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="experiencia">Experiencia</Label>
              <Textarea id="experiencia" placeholder="Experiencia" required value={form.experiencia} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" placeholder="Descripción" required value={form.descripcion} onChange={handleChange} />
            </div>
            <div>
              <Label className="font-semibold mb-1 block">Hobbies</Label>
              <div className="flex gap-2 mb-2">
                <Input value={hobbyInput} onChange={e => setHobbyInput(e.target.value)} placeholder="Agregar hobby" className="border p-2 rounded flex-1" />
                <Button type="button" onClick={handleAddHobby}>Agregar</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((h, idx) => (
                  <span key={idx} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">{h} <button type="button" onClick={() => handleRemoveHobby(h)} className="text-red-500">x</button></span>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="precio">Precio por hora</Label>
              <Input id="precio" type="number" placeholder="Precio por hora" required value={form.precio} onChange={handleChange} />
            </div>
            {/* Sección de comentarios */}
            <div className="border-t pt-2 mt-2">
              <h3 className="font-semibold">Comentarios (opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <Input value={comentario.nombre} onChange={e => setComentario({ ...comentario, nombre: e.target.value })} placeholder="Nombre" className="border p-2 rounded" />
                <Input type="date" value={comentario.fecha} onChange={e => setComentario({ ...comentario, fecha: e.target.value })} placeholder="Fecha" className="border p-2 rounded" />
                <Textarea value={comentario.texto} onChange={e => setComentario({ ...comentario, texto: e.target.value })} placeholder="Texto" className="border p-2 rounded min-h-[40px] md:min-h-[40px] w-full col-span-1 md:col-span-3" />
                <Button type="button" onClick={handleAddComentario}>Agregar comentario</Button>
              </div>
              <ul>
                {comentarios.map((c, idx) => (
                  <li key={idx} className="flex gap-2 items-center mb-1">
                    <span>{c.nombre} ({c.fecha}): {c.texto}</span>
                    <button type="button" onClick={() => handleRemoveComentario(idx)} className="text-red-500">x</button>
                  </li>
                ))}
              </ul>
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