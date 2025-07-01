"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, UserCircle, Mail, MapPin, Phone, Users, School, BookOpen, Info, Baby, Home, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function MiPerfil() {
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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

  useEffect(() => {
    const fetchUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("sb_token") : null;
      if (!token) {
        router.push("/login-usuario");
        return;
      }
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success || !data.user) {
          router.push("/login-usuario");
          return;
        }
        setUsuario({ ...data.perfil, tipo: data.tipo, correo: data.user.email, aprobado: data.perfil?.aprobado });
        setEditForm({ ...data.perfil, correo: data.user.email });
      } catch {
        router.push("/login-usuario");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (editForm) {
      // Inicializar grilla de disponibilidad desde string
      const obj: any = {};
      DIAS.forEach(dia => {
        obj[dia] = {};
        TURNOS.forEach(turno => { obj[dia][turno] = false });
      });
      if (editForm.disponibilidad) {
        editForm.disponibilidad.split(",").forEach((item: string) => {
          const [dia, turno] = item.split(":").map((s: string) => s.trim());
          if (obj[dia] && turno && obj[dia][turno] !== undefined) {
            obj[dia][turno] = true;
          }
        });
      }
      setDisponibilidadTable(obj);
      setHobbies(Array.isArray(editForm.hobbies) ? editForm.hobbies : (typeof editForm.hobbies === "string" ? JSON.parse(editForm.hobbies) : []));
    }
  }, [editando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.id]: e.target.value });
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

  const handleAddHobby = () => {
    if (hobbyInput.trim()) {
      setHobbies((prev) => [...prev, hobbyInput.trim()]);
      setHobbyInput("");
    }
  };

  const handleRemoveHobby = (hobby: string) => {
    setHobbies((prev) => prev.filter((h) => h !== hobby));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = typeof window !== 'undefined' ? localStorage.getItem("sb_token") : null;
    if (!token) return;
    try {
      let endpoint = "";
      let body: any = {};
      if (usuario.tipo === "padre") {
        endpoint = "/api/padres/edit";
        body = { ...editForm };
      } else if (usuario.tipo === "babysitter" && usuario.aprobado) {
        endpoint = "/api/babysitters/edit";
        body = { ...editForm, disponibilidad: disponibilidadToString(), hobbies: hobbies.join(", ") };
      }
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Perfil actualizado correctamente");
        setEditando(false);
        setUsuario({ ...usuario, ...editForm, disponibilidad: disponibilidadToString(), hobbies: hobbies.join(", ") });
      } else {
        setError(data.error || "Error al actualizar");
      }
    } catch {
      setError("Error al actualizar");
    }
  };

  if (loading) return <div className="flex min-h-screen flex-col"><main className="flex-1 flex items-center justify-center">Cargando...</main><Footer /></div>;
  if (!usuario) return null;

  // Babysitter no aprobada: solo lectura
  if (usuario.tipo === "babysitter" && !usuario.aprobado) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-goetheGreen/10 to-white py-12">
          <Card className="w-full max-w-2xl p-0 bg-white rounded-2xl shadow-2xl border-0">
            <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
              <Avatar className="h-28 w-28 border-4 border-goetheGreen shadow-lg mb-2">
                <AvatarImage src={usuario.foto || "/placeholder-user.jpg"} alt={usuario.nombre} />
                <AvatarFallback>{usuario.nombre?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-bold text-goetheGreen text-center">{usuario.nombre}</CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge className="bg-goetheGreen/10 text-goetheGreen border-goetheGreen/20 flex items-center gap-1"><UserCircle className="w-4 h-4" />Babysitter</Badge>
                {usuario.zona && <Badge className="bg-goetheGold/10 text-goetheGold border-goetheGold/20 flex items-center gap-1"><MapPin className="w-4 h-4" />{usuario.zona}</Badge>}
                {usuario.Precio_por_hora && <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"><DollarSign className="w-4 h-4" />${usuario.Precio_por_hora}/h</Badge>}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-8 pb-8">
              <div className="mb-2 text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-2 text-center">Tu perfil está pendiente de aprobación. No puedes editarlo hasta que sea aprobado.</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<Mail className="w-4 h-4" />} label="Correo" value={usuario.correo} />
                <InfoItem icon={<School className="w-4 h-4" />} label="Universidad" value={usuario.universidad} />
                <InfoItem icon={<BookOpen className="w-4 h-4" />} label="Carrera" value={usuario.carrera} />
                <InfoItem icon={<Info className="w-4 h-4" />} label="Experiencia" value={usuario.experiencia} />
                <InfoItem icon={<Info className="w-4 h-4" />} label="Descripción" value={usuario.descripcion} />
                <InfoItem icon={<Users className="w-4 h-4" />} label="Hobbies" value={Array.isArray(usuario.hobbies) ? usuario.hobbies.join(", ") : usuario.hobbies} />
              </div>
            </CardContent>
          </Card>
        </main>
        <div className="flex justify-center my-6">
          <Button
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
            onClick={async () => {
              await supabase.auth.signOut();
              if (typeof window !== 'undefined') {
                localStorage.removeItem("sb_token");
              }
              window.location.href = "/";
            }}
          >
            Cerrar sesión
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Formulario editable para padre o babysitter aprobada
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-goetheGreen/10 to-white py-12">
        <Card className="w-full max-w-2xl p-0 bg-white rounded-2xl shadow-2xl border-0">
          <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
            <Avatar className="h-28 w-28 border-4 border-goetheGreen shadow-lg mb-2">
              <AvatarImage src={usuario.foto || "/placeholder-user.jpg"} alt={usuario.nombre || usuario.nombre_completo || "Usuario"} />
              <AvatarFallback>{(usuario.nombre || usuario.nombre_completo || "U")[0]}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold text-goetheGreen text-center">{usuario.nombre || usuario.nombre_completo}</CardTitle>
            <div className="flex gap-2 mt-1 flex-wrap justify-center">
              <Badge className="bg-goetheGreen/10 text-goetheGreen border-goetheGreen/20 flex items-center gap-1"><UserCircle className="w-4 h-4" />{usuario.tipo === "padre" ? "Padre" : "Babysitter"}</Badge>
              {usuario.zona && <Badge className="bg-goetheGold/10 text-goetheGold border-goetheGold/20 flex items-center gap-1"><MapPin className="w-4 h-4" />{usuario.zona}</Badge>}
              {usuario.Precio_por_hora && <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"><DollarSign className="w-4 h-4" />${usuario.Precio_por_hora}/h</Badge>}
              {usuario.barrio && <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"><Home className="w-4 h-4" />{usuario.barrio}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-8 pb-8">
            {!editando ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InfoItem icon={<Mail className="w-4 h-4" />} label="Correo" value={usuario.correo} />
                {usuario.telefono_celular && <InfoItem icon={<Phone className="w-4 h-4" />} label="Teléfono" value={usuario.telefono_celular} />}
                {usuario.edad && <InfoItem icon={<Baby className="w-4 h-4" />} label="Edad" value={usuario.edad} />}
                {usuario.universidad && <InfoItem icon={<School className="w-4 h-4" />} label="Universidad" value={usuario.universidad} />}
                {usuario.carrera && <InfoItem icon={<BookOpen className="w-4 h-4" />} label="Carrera" value={usuario.carrera} />}
                {usuario.experiencia && <InfoItem icon={<Info className="w-4 h-4" />} label="Experiencia" value={usuario.experiencia} />}
                {usuario.descripcion && <InfoItem icon={<Info className="w-4 h-4" />} label="Descripción" value={usuario.descripcion} />}
                {usuario.hobbies && <InfoItem icon={<Users className="w-4 h-4" />} label="Hobbies" value={Array.isArray(usuario.hobbies) ? usuario.hobbies.join(", ") : usuario.hobbies} />}
                {usuario.cantidad_hijos && <InfoItem icon={<Users className="w-4 h-4" />} label="Cantidad de hijos" value={usuario.cantidad_hijos} />}
                {usuario.edades_hijos && <InfoItem icon={<Baby className="w-4 h-4" />} label="Edades de hijos" value={usuario.edades_hijos} />}
                {usuario.colegio_hijos && <InfoItem icon={<School className="w-4 h-4" />} label="Colegio de hijos" value={usuario.colegio_hijos} />}
                {usuario.dni && <InfoItem icon={<User className="w-4 h-4" />} label="DNI" value={usuario.dni} />}
                {usuario.universidad_padres && <InfoItem icon={<School className="w-4 h-4" />} label="Universidad (Padres)" value={usuario.universidad_padres} />}
                {usuario.club && <InfoItem icon={<Users className="w-4 h-4" />} label="Club" value={usuario.club} />}
                {usuario.colegio_padres && <InfoItem icon={<School className="w-4 h-4" />} label="Colegio (Padres)" value={usuario.colegio_padres} />}
                {usuario.especificaciones && <InfoItem icon={<Info className="w-4 h-4" />} label="Especificaciones" value={usuario.especificaciones} />}
              </div>
            ) : (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSave}>
                {Object.keys(editForm).map((key) => {
                  // Si es babysitter, ocultar los campos 'foto' y 'Contador_reservas'
                  if (
                    usuario.tipo === "babysitter" &&
                    (key === "foto" || key === "Contador_reservas")
                  ) {
                    return null;
                  }
                  return (
                    key !== "correo" && key !== "id" && key !== "tipo" && key !== "aprobado" && (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="font-semibold capitalize text-sm text-gray-700" htmlFor={key}>{key.replace(/_/g, ' ')}:</label>
                        {key === "descripcion" || key === "experiencia" || key === "especificaciones" ? (
                          <Textarea id={key} value={editForm[key] || ""} onChange={handleChange} placeholder={`Ingrese ${key.replace(/_/g, ' ')}`} />
                        ) : key === "disponibilidad" ? (
                          <div className="mb-2 col-span-1 md:col-span-2">
                            <label className="font-semibold mb-1 block">Disponibilidad</label>
                            <div className="overflow-x-auto">
                              <table className="min-w-max border-separate border-spacing-0 rounded-xl shadow-md bg-white text-xs md:text-sm">
                                <thead>
                                  <tr>
                                    <th className="bg-goetheGreen/10 text-goetheGreen border-b px-2 py-1 rounded-tl-xl"></th>
                                    {DIAS.map((dia, idx) => (
                                      <th key={dia} className={`bg-goetheGreen/10 text-goetheGreen border-b px-2 py-1 font-semibold ${idx === DIAS.length-1 ? 'rounded-tr-xl' : ''}`}>{dia}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {TURNOS.map((turno, tIdx) => (
                                    <tr key={turno} className="even:bg-gray-50">
                                      <td className="font-semibold text-gray-700 px-2 py-1 border-b border-r min-w-[60px]">{turno}</td>
                                      {DIAS.map((dia, dIdx) => (
                                        <td key={dia} className={`border-b border-r px-2 py-1 text-center transition-colors hover:bg-goetheGreen/5 ${tIdx === TURNOS.length-1 ? 'last:rounded-bl-xl' : ''} ${dIdx === DIAS.length-1 && tIdx === TURNOS.length-1 ? 'rounded-br-xl' : ''}`}> 
                                          <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-goetheGreen cursor-pointer"
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
                        ) : key === "hobbies" ? (
                          <div className="mb-2 col-span-1 md:col-span-2">
                            <label className="font-semibold mb-1 block">Hobbies</label>
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
                        ) : (
                          <Input id={key} value={editForm[key] || ""} onChange={handleChange} placeholder={`Ingrese ${key.replace(/_/g, ' ')}`} />
                        )}
                      </div>
                    )
                  );
                })}
                <div className="col-span-1 md:col-span-2 flex gap-2 mt-2">
                  <Button type="submit" className="bg-goetheGreen hover:bg-goetheGreen/90 w-full">Guardar</Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => { setEditando(false); setEditForm(usuario); }}>Cancelar</Button>
                </div>
              </form>
            )}
            {!editando && (
              <Button className="bg-goetheGreen hover:bg-goetheGreen/90 w-full mt-4 text-lg py-6 font-bold" onClick={() => setEditando(true)}>
                Editar perfil
              </Button>
            )}
            {success && <div className="text-green-600 text-sm mt-2 text-center">{success}</div>}
            {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
          </CardContent>
        </Card>
      </main>
      <div className="flex justify-center my-6">
        <Button
          variant="outline"
          className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
          onClick={async () => {
            await supabase.auth.signOut();
            if (typeof window !== 'undefined') {
              localStorage.removeItem("sb_token");
            }
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </Button>
      </div>
      <Footer />
    </div>
  );
}

// Componente auxiliar para mostrar info con ícono y label
function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: any }) {
  if (value === null || value === undefined || value === "") return null;
  let displayValue = value;
  if (label.toLowerCase() === "hobbies") {
    let hobbiesArr: string[] = [];
    if (Array.isArray(value)) {
      hobbiesArr = value;
    } else if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          hobbiesArr = parsed;
        } else {
          hobbiesArr = value.split(",").map((h: string) => h.trim());
        }
      } catch {
        hobbiesArr = value.split(",").map((h: string) => h.trim());
      }
    }
    displayValue = (
      <div className="flex flex-wrap gap-2">
        {hobbiesArr.map((h, idx) => (
          <span key={idx} className="bg-goetheGreen/10 text-goetheGreen px-2 py-1 rounded text-xs font-semibold border border-goetheGreen/20">{h}</span>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
      <span className="text-goetheGreen mt-1">{icon}</span>
      <div>
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</div>
        <div className="text-base font-medium text-gray-800 break-words">{displayValue}</div>
      </div>
    </div>
  );
} 