import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(request: Request) {
  try {
    // Obtener el token de la cookie (o header Authorization)
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }
    const token = authHeader.replace("Bearer ", "")
    // Obtener usuario de Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }
    // Buscar perfil extendido
    let tipo = null
    let perfil = null
    const { data: padre } = await supabase.from("Padres").select("*").eq("correo_electronico", user.email).single()
    if (padre) {
      tipo = "padre"
      perfil = padre
    } else {
      const { data: babysitter } = await supabase.from("Babysitters").select("*").eq("correo", user.email).single()
      if (babysitter) {
        tipo = "babysitter"
        perfil = babysitter
      }
    }
    return NextResponse.json({ success: true, user, tipo, perfil })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 