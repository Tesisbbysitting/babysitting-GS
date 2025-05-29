import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "babysitters.json")
  let babysittersArr: any[] = []
  let zonasDisponibles: string[] = []
  try {
    const fileContent = fs.readFileSync(filePath, "utf8")
    babysittersArr = JSON.parse(fileContent)
    zonasDisponibles = Array.from(new Set(
      babysittersArr
        .map((b: any) => String(b.zona || "").trim())
        .filter((z: string) => z.length > 0)
    )).sort((a: string, b: string) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
  } catch (e) {
    console.error("[babysitters API] Error leyendo o parseando babysitters.json:", e)
    return NextResponse.json({ babysitters: [], zonasDisponibles: [], error: "No se pudo leer el archivo" })
  }
  return NextResponse.json({ babysitters: babysittersArr, zonasDisponibles })
} 