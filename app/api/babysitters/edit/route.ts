import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function PUT(request: Request) {
  try {
    const updatedBabysitter = await request.json()
    const { id, ...fields } = updatedBabysitter
    // Solo permitir edición si está aprobada
    const { data, error: getError } = await supabase
      .from('Babysitters')
      .select('aprobado')
      .eq('id', id)
      .single()
    if (getError || !data || !data.aprobado) {
      return NextResponse.json({ success: false, error: "No autorizado o perfil no aprobado" }, { status: 403 })
    }
    const { error } = await supabase
      .from('Babysitters')
      .update(fields)
      .eq('id', id)
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 