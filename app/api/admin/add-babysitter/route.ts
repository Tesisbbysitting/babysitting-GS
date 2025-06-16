import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    const newBabysitter = await request.json()

    // Convertir hobbies array a string si es necesario
    const hobbiesString = Array.isArray(newBabysitter.hobbies) 
      ? newBabysitter.hobbies.join(', ')
      : newBabysitter.hobbies || ''

    // Insertar la nueva babysitter en Supabase (sin comentarios)
    const { data: babysitterData, error: babysitterError } = await supabase
      .from('Babysitters')
      .insert([{
        nombre: newBabysitter.nombre,
        edad: newBabysitter.edad,
        foto: newBabysitter.foto,
        zona: newBabysitter.zona,
        disponibilidad: newBabysitter.disponibilidad,
        hobbies: hobbiesString,
        universidad: newBabysitter.universidad,
        carrera: newBabysitter.carrera,
        experiencia: newBabysitter.experiencia,
        descripcion: newBabysitter.descripcion,
        Precio_por_hora: newBabysitter.precioPorHora || newBabysitter.precio_por_hora || newBabysitter.Precio_por_hora,
        Contador_reservas: newBabysitter.contadorReservas || newBabysitter.contador_reservas || newBabysitter.Contador_reservas || 0
      }])
      .select()
      .single()

    if (babysitterError) {
      console.error("Error al agregar babysitter:", babysitterError)
      return NextResponse.json({ success: false, error: babysitterError.message }, { status: 500 })
    }

    // Si hay comentarios, guardarlos en la tabla Comentarios
    if (newBabysitter.comentarios && Array.isArray(newBabysitter.comentarios) && newBabysitter.comentarios.length > 0) {
      const comentariosToInsert = newBabysitter.comentarios.map((comentario: any) => ({
        babysitter_id: babysitterData.id,
        nombre: comentario.nombre,
        fecha: comentario.fecha,
        rating: comentario.rating,
        texto: comentario.texto
      }))

      const { error: comentariosError } = await supabase
        .from('Comentarios')
        .insert(comentariosToInsert)

      if (comentariosError) {
        console.error("Error al agregar comentarios:", comentariosError)
        // No retornamos error aquí, porque la babysitter ya se guardó correctamente
      }
    }

    return NextResponse.json({ success: true, data: babysitterData })
  } catch (error) {
    console.error("Error al agregar babysitter:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 