import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const newBabysitter = await request.json()
    const filePath = path.join(process.cwd(), "data", "babysitters.json")
    let babysittersArr = []
    try {
      const fileContent = fs.readFileSync(filePath, "utf8")
      babysittersArr = JSON.parse(fileContent)
    } catch (e) {
      // Si el archivo no existe o está vacío, empezamos con un array vacío
      babysittersArr = []
    }
    babysittersArr.push(newBabysitter)
    fs.writeFileSync(filePath, JSON.stringify(babysittersArr, null, 2), "utf8")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al agregar babysitter:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 