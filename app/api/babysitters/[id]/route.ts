import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Obtener la babysitter específica desde Supabase
    const { data: babysitterData, error } = await supabase
      .from('Babysitters')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error("[babysitter individual API] Error obteniendo babysitter:", error)
      return NextResponse.json({ babysitter: null, error: "Babysitter no encontrada" }, { status: 404 })
    }

    // Obtener los comentarios de esta babysitter
    const { data: comentariosData, error: comentariosError } = await supabase
      .from('Comentarios')
      .select('*')
      .eq('babysitter_id', id)
      .order('id', { ascending: false })

    if (comentariosError) {
      console.error("[babysitter individual API] Error obteniendo comentarios:", comentariosError)
    }

    // Mapear los nombres de columnas de Supabase a los que espera el frontend
    const babysitter = {
      id: babysitterData.id,
      nombre: babysitterData.nombre,
      edad: babysitterData.edad,
      foto: babysitterData.foto,
      zona: babysitterData.zona,
      disponibilidad: babysitterData.disponibilidad,
      universidad: babysitterData.universidad,
      carrera: babysitterData.carrera,
      experiencia: babysitterData.experiencia,
      descripcion: babysitterData.descripcion,
      hobbies: typeof babysitterData.hobbies === 'string' 
        ? babysitterData.hobbies.split(',').map((h: string) => h.trim()).filter((h: string) => h.length > 0)
        : Array.isArray(babysitterData.hobbies) 
        ? babysitterData.hobbies 
        : [],
      precioPorHora: babysitterData.Precio_por_hora,
      contadorReservas: babysitterData.Contador_reservas,
      rating: 5, // Rating por defecto, después lo calcularemos desde comentarios
      comentarios: comentariosData || [] // Comentarios de la tabla relacionada
    }

    return NextResponse.json({ babysitter })
  } catch (e) {
    console.error("[babysitter individual API] Error:", e)
    return NextResponse.json({ babysitter: null, error: "Error interno del servidor" }, { status: 500 })
  }
} 