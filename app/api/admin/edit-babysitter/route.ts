import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function PUT(request: Request) {
  try {
    const updatedBabysitter = await request.json()

    // Convertir hobbies array a string si es necesario
    const hobbiesString = Array.isArray(updatedBabysitter.hobbies) 
      ? updatedBabysitter.hobbies.join(', ')
      : updatedBabysitter.hobbies || ''

    // Actualizar la babysitter en Supabase (sin comentarios)
    const { data: babysitterData, error: babysitterError } = await supabase
      .from('Babysitters')
      .update({
        nombre: updatedBabysitter.nombre,
        edad: updatedBabysitter.edad,
        foto: updatedBabysitter.foto,
        zona: updatedBabysitter.zona,
        disponibilidad: updatedBabysitter.disponibilidad,
        hobbies: hobbiesString,
        universidad: updatedBabysitter.universidad,
        carrera: updatedBabysitter.carrera,
        experiencia: updatedBabysitter.experiencia,
        descripcion: updatedBabysitter.descripcion,
        Precio_por_hora: updatedBabysitter.precioPorHora || updatedBabysitter.precio_por_hora || updatedBabysitter.Precio_por_hora,
        Contador_reservas: updatedBabysitter.contadorReservas || updatedBabysitter.contador_reservas || updatedBabysitter.Contador_reservas || 0
      })
      .eq('id', updatedBabysitter.id)
      .select()

    if (babysitterError) {
      console.error("Error al editar babysitter:", babysitterError)
      return NextResponse.json({ success: false, error: babysitterError.message }, { status: 500 })
    }

    // Manejar comentarios: eliminar los existentes y agregar los nuevos
    if (updatedBabysitter.comentarios && Array.isArray(updatedBabysitter.comentarios)) {
      // Primero eliminar comentarios existentes
      await supabase
        .from('Comentarios')
        .delete()
        .eq('babysitter_id', updatedBabysitter.id)

      // Luego insertar los nuevos comentarios (si hay)
      if (updatedBabysitter.comentarios.length > 0) {
        const comentariosToInsert = updatedBabysitter.comentarios.map((comentario: any) => ({
          babysitter_id: updatedBabysitter.id,
          nombre: comentario.nombre,
          fecha: comentario.fecha,
          rating: comentario.rating,
          texto: comentario.texto
        }))

        const { error: comentariosError } = await supabase
          .from('Comentarios')
          .insert(comentariosToInsert)

        if (comentariosError) {
          console.error("Error al actualizar comentarios:", comentariosError)
          // No retornamos error aquí, porque la babysitter ya se actualizó correctamente
        }
      }
    }

    return NextResponse.json({ success: true, data: babysitterData })
  } catch (error) {
    console.error("Error al editar babysitter:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 