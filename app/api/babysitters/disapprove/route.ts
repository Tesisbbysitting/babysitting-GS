import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function PUT(request: Request) {
  try {
    const { id } = await request.json()
    const { error } = await supabase
      .from('Babysitters')
      .update({ aprobado: false })
      .eq('id', id)
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 