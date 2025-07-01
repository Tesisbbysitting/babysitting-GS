import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    const { correo, contrasena } = await request.json()
    // 1. Login con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    })
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    // 2. Buscar tipo de usuario
    let tipo = null
    let perfil = null
    const { data: padre } = await supabase.from("Padres").select("*").eq("correo_electronico", correo).single()
    if (padre) {
      tipo = "padre"
      perfil = padre
    } else {
      const { data: babysitter } = await supabase.from("Babysitters").select("*").eq("correo", correo).single()
      if (babysitter) {
        tipo = "babysitter"
        perfil = babysitter
      }
    }
    return NextResponse.json({ success: true, session: data.session, user: data.user, tipo, perfil })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 