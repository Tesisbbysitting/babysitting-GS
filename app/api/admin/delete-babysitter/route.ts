import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const filePath = path.join(process.cwd(), "data", "babysitters.json")
    const fileContent = fs.readFileSync(filePath, "utf8")
    let babysittersArr = JSON.parse(fileContent)
    babysittersArr = babysittersArr.filter((b: any) => b.id !== id)
    fs.writeFileSync(filePath, JSON.stringify(babysittersArr, null, 2), "utf8")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar babysitter:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 