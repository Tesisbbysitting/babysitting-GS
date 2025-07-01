import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipo, correo, contrasena, ...rest } = body

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: correo,
      password: contrasena,
    })
    if (authError) {
      return NextResponse.json({ success: false, error: authError.message }, { status: 400 })
    }

    // 2. Guardar datos extra en la tabla correspondiente
    if (tipo === "padre") {
      const { error: padreError } = await supabase.from("Padres").insert([
        { correo_electronico: correo, contrasena, ...rest }
      ])
      if (padreError) {
        return NextResponse.json({ success: false, error: padreError.message }, { status: 400 })
      }
    } else if (tipo === "babysitter") {
      const { error: babysitterError } = await supabase.from("Babysitters").insert([
        { correo, contrasena, aprobado: false, ...rest }
      ])
      if (babysitterError) {
        return NextResponse.json({ success: false, error: babysitterError.message }, { status: 400 })
      }
    } else {
      return NextResponse.json({ success: false, error: "Tipo de usuario inválido" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 