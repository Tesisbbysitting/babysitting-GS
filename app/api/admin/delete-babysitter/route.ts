import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    // Eliminar la babysitter de Supabase
    const { data, error } = await supabase
      .from('Babysitters')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      console.error("Error al eliminar babysitter:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error al eliminar babysitter:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 