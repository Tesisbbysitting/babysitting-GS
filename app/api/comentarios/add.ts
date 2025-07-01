import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { nombre, fecha, texto, babysitter_id } = await req.json();
    if (!nombre || !fecha || !texto || !babysitter_id) {
      return NextResponse.json({ success: false, error: "Faltan campos obligatorios" }, { status: 400 });
    }
    const { error } = await supabase.from("Comentarios").insert([
      { nombre, fecha, texto, babysitter_id }
    ]);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
} 