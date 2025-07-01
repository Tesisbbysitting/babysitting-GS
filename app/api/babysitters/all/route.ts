import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET() {
  try {
    const { data: babysittersData, error } = await supabase
      .from('Babysitters')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      return NextResponse.json({ babysitters: [], error: error.message }, { status: 500 })
    }

    // Obtener todos los comentarios
    const { data: comentariosData, error: comentariosError } = await supabase
      .from('Comentarios')
      .select('*')
      .order('id', { ascending: false })

    // Agrupar comentarios por babysitter_id
    const comentariosPorBabysitter: { [key: string]: any[] } = {}
    if (comentariosData) {
      comentariosData.forEach(comentario => {
        const babysitterId = comentario.babysitter_id?.toString()
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
      aprobado: babysitter.aprobado,
      correo: babysitter.correo,
      comentarios: comentariosPorBabysitter[babysitter.id?.toString()] || []
    }))

    return NextResponse.json({ babysitters: babysittersArr })
  } catch (e) {
    return NextResponse.json({ babysitters: [], error: "Error interno del servidor" }, { status: 500 })
  }
} 