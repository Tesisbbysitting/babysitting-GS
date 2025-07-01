import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

const CAMPOS_VALIDOS = [
  "nombre_completo",
  "dni",
  "telefono_celular",
  "correo_electronico",
  "zona",
  "barrio",
  "cantidad_hijos",
  "edades_hijos",
  "colegio_hijos",
  "especificaciones",
  "universidad_padres",
  "club",
  "colegio_padres",
  "contrasena"
];

export async function PUT(request: Request) {
  try {
    const updatedPadre = await request.json()
    const { id, ...fields } = updatedPadre
    // Filtrar solo los campos válidos
    const camposUpdate: any = {}
    for (const key of CAMPOS_VALIDOS) {
      if (fields[key] !== undefined) {
        camposUpdate[key] = fields[key]
      }
    }
    const { error } = await supabase
      .from('Padres')
      .update(camposUpdate)
      .eq('id', id)
    if (error) {
      console.error("Error al actualizar padre:", error.message, error.details, error.hint)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Error inesperado en el endpoint de edición de padre:", e)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 