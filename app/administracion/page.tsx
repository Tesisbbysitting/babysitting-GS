"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Babysitter, Comentario } from "@/types/babysitter"

function isAuthenticated() {
  if (typeof document === "undefined") return false
  return document.cookie.split(";").some((c) => c.trim() === "auth=ok")
}

function emptyBabysitter(): Babysitter {
  return {
    id: "",
    nombre: "",
    edad: undefined as any,
    foto: "",
    zona: "",
    rating: undefined as any,
    disponibilidad: "",
    universidad: "",
    carrera: "",
    experiencia: "",
    descripcion: "",
    hobbies: [],
    comentarios: [],
    precioPorHora: "",
    contadorReservas: 0
  }
}

function getNextId(babysitters: Babysitter[]): string {
  if (babysitters.length === 0) return "1"
  const maxId = Math.max(...babysitters.map(b => Number(b.id)))
  return String(maxId + 1)
}

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const TURNOS = ["Mañana", "Tarde", "Noche"];

export default function AdministracionPage() {
  const router = useRouter()
  const [babysitters, setBabysitters] = useState<Babysitter[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<Babysitter>(emptyBabysitter())
  const [comentario, setComentario] = useState<Comentario>({ nombre: "", fecha: "", rating: 5, texto: "" })
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [hobbyInput, setHobbyInput] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [disponibilidadTable, setDisponibilidadTable] = useState<{[dia: string]: {[turno: string]: boolean}}>({})
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login")
    }
  }, [])

  useEffect(() => {
    // Cargar babysitters desde la API (todas)
    async function fetchBabysitters() {
      const res = await fetch("/api/babysitters/all")
      const data = await res.json()
      setBabysitters(data.babysitters)
    }
    fetchBabysitters()
  }, [showModal])

  useEffect(() => {
    // Cuando se abre el modal, setear el ID automáticamente con un valor único SOLO si no es edición
    if (showModal && !editMode) {
      setForm(f => ({ ...emptyBabysitter(), id: Date.now().toString() }))
      setComentarios([])
    }
  }, [showModal, editMode])

  useEffect(() => {
    // Solo limpiar disponibilidad si no es edición
    if (showModal && !editMode) {
      setDisponibilidadTable(() => {
        const obj: any = {}
        DIAS.forEach(dia => {
          obj[dia] = {}
          TURNOS.forEach(turno => { obj[dia][turno] = false })
        })
        return obj
      })
    }
  }, [showModal, editMode])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddHobby = () => {
    if (hobbyInput.trim()) {
      setForm((prev) => ({ ...prev, hobbies: [...prev.hobbies, hobbyInput.trim()] }))
      setHobbyInput("")
    }
  }

  const handleRemoveHobby = (hobby: string) => {
    setForm((prev) => ({ ...prev, hobbies: prev.hobbies.filter((h) => h !== hobby) }))
  }

  const handleAddComentario = () => {
    if (comentario.nombre && comentario.fecha && comentario.rating && comentario.texto) {
      setComentarios((prev) => [...prev, comentario])
      setComentario({ nombre: "", fecha: "", rating: 5, texto: "" })
    }
  }

  const handleRemoveComentario = (idx: number) => {
    setComentarios((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleDisponibilidadChange = (dia: string, turno: string) => {
    setDisponibilidadTable(prev => ({
      ...prev,
      [dia]: { ...prev[dia], [turno]: !prev[dia][turno] }
    }))
  }

  const disponibilidadToString = () => {
    const seleccionados: string[] = []
    DIAS.forEach(dia => {
      TURNOS.forEach(turno => {
        if (disponibilidadTable[dia]?.[turno]) {
          seleccionados.push(`${dia}: ${turno}`)
        }
      })
    })
    return seleccionados.join(", ")
  }

  const parseDisponibilidad = (disponibilidadStr: string) => {
    const obj: { [dia: string]: { [turno: string]: boolean } } = {};
    DIAS.forEach(dia => {
      obj[dia] = {};
      TURNOS.forEach(turno => {
        obj[dia][turno] = false;
      });
    });
    if (disponibilidadStr) {
      disponibilidadStr.split(",").forEach(item => {
        const [dia, turno] = item.split(":").map(s => s.trim());
        if (obj[dia] && turno && obj[dia][turno] !== undefined) {
          obj[dia][turno] = true;
        }
      });
    }
    return obj;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!form.nombre || !form.edad || !form.foto || !form.zona || !form.universidad || !form.carrera || !form.experiencia || !form.descripcion) {
      setError("Por favor, completá todos los campos obligatorios.")
      return
    }
    const nuevaBabysitter = {
      ...form,
      id: form.id || Date.now().toString(),
      edad: Number(form.edad),
      disponibilidad: disponibilidadToString(),
      comentarios
    }
    if (editMode && editId) {
      // Editar
      await fetch("/api/admin/edit-babysitter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaBabysitter)
      })
    } else {
      // Crear
      await fetch("/api/admin/add-babysitter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaBabysitter)
      })
    }
    setShowModal(false)
    setForm(emptyBabysitter())
    setComentarios([])
    setEditMode(false)
    setEditId(null)
    // Refrescar el listado
    const res = await fetch("/api/babysitters/all")
    const data = await res.json()
    setBabysitters(data.babysitters)
    setTimeout(() => setSuccess(""), 2000)
  }

  // Separar aprobadas y no aprobadas
  const aprobadas = (babysitters || []).filter(b => b.aprobado)
  const noAprobadas = (babysitters || []).filter(b => !b.aprobado)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración de Babysitters</h1>
        <Button className="mb-6" onClick={() => setShowModal(true)}>
          Nueva Babysitter
        </Button>
        <h2 className="text-xl font-semibold mb-2 mt-6">Perfiles NO Aprobados</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 w-16">ID</th>
                <th className="border px-2 py-1 w-40">Nombre</th>
                <th className="border px-2 py-1 w-20">Edad</th>
                <th className="border px-2 py-1 w-40">Zona</th>
                <th className="border px-2 py-1 min-w-[180px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noAprobadas.map((b) => (
                <tr key={b.id}>
                  <td className="border px-2 py-1">{b.id}</td>
                  <td className="border px-2 py-1">{b.nombre}</td>
                  <td className="border px-2 py-1">{b.edad}</td>
                  <td className="border px-2 py-1">{b.zona}</td>
                  <td className="border px-2 py-1 min-w-[180px] flex gap-2">
                    <Button size="sm" onClick={() => {
                      setEditMode(true)
                      setEditId(b.id)
                      setForm(b)
                      setDisponibilidadTable(parseDisponibilidad(b.disponibilidad))
                      setComentarios(b.comentarios || [])
                      setShowModal(true)
                    }}>Editar</Button>
                    <Button size="sm" onClick={async () => {
                      await fetch("/api/babysitters/approve", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: b.id })
                      })
                      // Refrescar
                      const res = await fetch("/api/babysitters/all")
                      const data = await res.json()
                      setBabysitters(data.babysitters)
                    }}>Aprobar</Button>
                    <Button size="sm" variant="destructive" onClick={async () => {
                      if (window.confirm("¿Seguro que querés eliminar esta babysitter?")) {
                        await fetch("/api/admin/delete-babysitter", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: b.id })
                        })
                        // Refrescar
                        const res = await fetch("/api/babysitters/all")
                        const data = await res.json()
                        setBabysitters(data.babysitters)
                      }
                    }}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-xl font-semibold mb-2 mt-6">Perfiles Aprobados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 w-16">ID</th>
                <th className="border px-2 py-1 w-40">Nombre</th>
                <th className="border px-2 py-1 w-20">Edad</th>
                <th className="border px-2 py-1 w-40">Zona</th>
                <th className="border px-2 py-1 min-w-[180px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {aprobadas.map((b) => (
                <tr key={b.id}>
                  <td className="border px-2 py-1">{b.id}</td>
                  <td className="border px-2 py-1">{b.nombre}</td>
                  <td className="border px-2 py-1">{b.edad}</td>
                  <td className="border px-2 py-1">{b.zona}</td>
                  <td className="border px-2 py-1 min-w-[180px] flex gap-2">
                    <Button size="sm" onClick={() => {
                      setEditMode(true)
                      setEditId(b.id)
                      setForm(b)
                      setDisponibilidadTable(parseDisponibilidad(b.disponibilidad))
                      setComentarios(b.comentarios || [])
                      setShowModal(true)
                    }}>Editar</Button>
                    <Button size="sm" variant="outline" onClick={async () => {
                      if (window.confirm("¿Seguro que querés desaprobar esta babysitter? Su perfil dejará de ser visible.")) {
                        await fetch("/api/babysitters/disapprove", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: b.id })
                        })
                        // Refrescar
                        const res = await fetch("/api/babysitters/all")
                        const data = await res.json()
                        setBabysitters(data.babysitters)
                      }
                    }}>Desaprobar</Button>
                    <Button size="sm" variant="destructive" onClick={async () => {
                      if (window.confirm("¿Seguro que querés eliminar esta babysitter?")) {
                        await fetch("/api/admin/delete-babysitter", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: b.id })
                        })
                        // Refrescar
                        const res = await fetch("/api/babysitters/all")
                        const data = await res.json()
                        setBabysitters(data.babysitters)
                      }
                    }}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold mb-4">Nueva Babysitter</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="nombre" value={form.nombre || ""} onChange={handleFormChange} placeholder="Nombre" className="border p-2 rounded" required />
                  <input name="edad" type="number" value={form.edad || ""} onChange={handleFormChange} placeholder="Edad" className="border p-2 rounded" required />
                  <input name="foto" value={form.foto || ""} onChange={handleFormChange} placeholder="URL de foto" className="border p-2 rounded" required />
                  <input name="zona" value={form.zona || ""} onChange={handleFormChange} placeholder="Zona" className="border p-2 rounded" required />
                  <input name="precioPorHora" value={form.precioPorHora || ""} onChange={handleFormChange} placeholder="Precio por hora" className="border p-2 rounded" />
                  <input name="contadorReservas" type="number" value={form.contadorReservas || 0} onChange={handleFormChange} placeholder="Contador de reservas" className="border p-2 rounded" />
                </div>
                <div>
                  <label className="font-semibold mb-1 block">Disponibilidad</label>
                  <table className="border mb-2">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1"></th>
                        {DIAS.map(dia => (
                          <th key={dia} className="border px-2 py-1">{dia}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TURNOS.map(turno => (
                        <tr key={turno}>
                          <td className="border px-2 py-1 font-semibold">{turno}</td>
                          {DIAS.map(dia => (
                            <td key={dia} className="border px-2 py-1 text-center">
                              <input
                                type="checkbox"
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
                <input name="universidad" value={form.universidad || ""} onChange={handleFormChange} placeholder="Universidad" className="border p-2 rounded" required />
                <input name="carrera" value={form.carrera || ""} onChange={handleFormChange} placeholder="Carrera" className="border p-2 rounded" required />
                <textarea name="experiencia" value={form.experiencia || ""} onChange={handleFormChange} placeholder="Experiencia" className="border p-2 rounded w-full" required />
                <textarea name="descripcion" value={form.descripcion || ""} onChange={handleFormChange} placeholder="Descripción" className="border p-2 rounded w-full" required />
                {/* Hobbies */}
                <div>
                  <div className="flex gap-2 mb-2">
                    <input value={hobbyInput} onChange={e => setHobbyInput(e.target.value)} placeholder="Agregar hobby" className="border p-2 rounded flex-1" />
                    <Button type="button" onClick={handleAddHobby}>Agregar</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.hobbies.map((h, idx) => (
                      <span key={idx} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">{h} <button type="button" onClick={() => handleRemoveHobby(h)} className="text-red-500">x</button></span>
                    ))}
                  </div>
                </div>
                {/* Comentarios */}
                <div className="border-t pt-2 mt-2">
                  <h3 className="font-semibold">Comentarios (opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                    <input value={comentario.nombre} onChange={e => setComentario({ ...comentario, nombre: e.target.value })} placeholder="Nombre" className="border p-2 rounded" />
                    <input value={comentario.fecha} onChange={e => setComentario({ ...comentario, fecha: e.target.value })} placeholder="Fecha" className="border p-2 rounded" />
                    <input type="number" value={comentario.rating} onChange={e => setComentario({ ...comentario, rating: Number(e.target.value) })} placeholder="Rating" className="border p-2 rounded" />
                    <textarea value={comentario.texto} onChange={e => setComentario({ ...comentario, texto: e.target.value })} placeholder="Texto" className="border p-2 rounded min-h-[60px] md:min-h-[80px] w-full col-span-1 md:col-span-4" />
                    <Button type="button" onClick={handleAddComentario}>Agregar comentario</Button>
                  </div>
                  <ul>
                    {comentarios.map((c, idx) => (
                      <li key={idx} className="flex gap-2 items-center mb-1">
                        <span>{c.nombre} ({c.fecha}) - {c.rating}: {c.texto}</span>
                        <button type="button" onClick={() => handleRemoveComentario(idx)} className="text-red-500">x</button>
                      </li>
                    ))}
                  </ul>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2 mt-4">
                  <Button type="submit" className="bg-goetheGreen">Crear</Button>
                  <Button variant="outline" className="mt-4" onClick={() => { setShowModal(false); setEditMode(false); setEditId(null); }}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
} 