import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    const credentialsPath = path.join(process.cwd(), "data", "credentials.txt")
    const fileContent = fs.readFileSync(credentialsPath, "utf8")
    const lines = fileContent.trim().split("\n")
    const storedUsername = lines[0].trim()
    const storedPassword = lines[1].trim()

    if (username === storedUsername && password === storedPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false })
    }
  } catch (error) {
    console.error("Error al verificar credenciales:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
} 