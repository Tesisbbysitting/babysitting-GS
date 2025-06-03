import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function PUT(request: Request) {
  try {
    const updatedBabysitter = await request.json()
    const filePath = path.join(process.cwd(), "public", "data", "babysitters.json")
    
    // Asegurarse de que el directorio existe
    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    const fileContent = fs.readFileSync(filePath, "utf8")
    let babysittersArr = JSON.parse(fileContent)
    babysittersArr = babysittersArr.map((b: any) => b.id === updatedBabysitter.id ? updatedBabysitter : b)
    fs.writeFileSync(filePath, JSON.stringify(babysittersArr, null, 2), "utf8")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al editar babysitter:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 