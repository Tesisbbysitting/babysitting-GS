import { NextResponse } from "next/server"

// API para obtener babysitters desde el archivo JSON estático
export async function GET() {
  try {
    // Detectar el dominio base según entorno
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
    const res = await fetch(`${baseUrl}/data/babysitters.json`)
    if (!res.ok) throw new Error("No se pudo leer babysitters.json")
    const babysittersArr = await res.json()
    const zonasDisponibles = Array.from(new Set(
      babysittersArr
        .map((b: any) => String(b.zona || "").trim())
        .filter((z: string) => z.length > 0)
    )) as string[]
    zonasDisponibles.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
    return NextResponse.json({ babysitters: babysittersArr, zonasDisponibles })
  } catch (e) {
    console.error("[babysitters API] Error leyendo babysitters.json:", e)
    return NextResponse.json({ babysitters: [], zonasDisponibles: [], error: "No se pudo leer el archivo" })
  }
} 