import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

// API para obtener babysitters desde Supabase
export async function GET() {
  try {
    // Obtener babysitters desde Supabase
    const { data: babysittersData, error } = await supabase
      .from('Babysitters')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error("[babysitters API] Error obteniendo babysitters:", error)
      return NextResponse.json({ babysitters: [], zonasDisponibles: [], error: "Error obteniendo babysitters" })
    }

    // Obtener todos los comentarios
    const { data: comentariosData, error: comentariosError } = await supabase
      .from('Comentarios')
      .select('*')
      .order('id', { ascending: false })

    if (comentariosError) {
      console.error("[babysitters API] Error obteniendo comentarios:", comentariosError)
    }

    // Agrupar comentarios por babysitter_id
    const comentariosPorBabysitter: { [key: string]: any[] } = {}
    if (comentariosData) {
      comentariosData.forEach(comentario => {
        const babysitterId = comentario.babysitter_id.toString()
        if (!comentariosPorBabysitter[babysitterId]) {
          comentariosPorBabysitter[babysitterId] = []
        }
        comentariosPorBabysitter[babysitterId].push(comentario)
      })
    }

    // Mapear los nombres de columnas de Supabase a los que espera el frontend
    const babysittersArr = babysittersData.map((babysitter: any) => ({
      id: babysitter.id,
      nombre: babysitter.nombre,
      edad: babysitter.edad,
      foto: babysitter.foto,
      zona: babysitter.zona,
      disponibilidad: babysitter.disponibilidad,
      universidad: babysitter.universidad,
      carrera: babysitter.carrera,
      experiencia: babysitter.experiencia,
      descripcion: babysitter.descripcion,
      hobbies: typeof babysitter.hobbies === 'string' 
        ? babysitter.hobbies.split(',').map((h: string) => h.trim()).filter((h: string) => h.length > 0)
        : Array.isArray(babysitter.hobbies) 
        ? babysitter.hobbies 
        : [],
      precioPorHora: babysitter.Precio_por_hora,
      contadorReservas: babysitter.Contador_reservas,
      rating: 5, // Rating por defecto, después lo calcularemos desde comentarios
      comentarios: comentariosPorBabysitter[babysitter.id.toString()] || [] // Comentarios relacionados
    }))

    // Generar zonas disponibles
    const zonasDisponibles = Array.from(new Set(
      babysittersArr
        .map((b: any) => String(b.zona || "").trim())
        .filter((z: string) => z.length > 0)
    )) as string[]
    zonasDisponibles.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))

    return NextResponse.json({ babysitters: babysittersArr, zonasDisponibles })
  } catch (e) {
    console.error("[babysitters API] Error:", e)
    return NextResponse.json({ babysitters: [], zonasDisponibles: [], error: "Error interno del servidor" })
  }
} 