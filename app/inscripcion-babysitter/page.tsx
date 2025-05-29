"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function InscripcionBabysitterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir al formulario de Google
    window.location.href = "https://forms.gle/KVrErwn5bufVeuMa8"
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p className="text-lg">Redirigiendo al formulario de inscripción...</p>
    </div>
  )
}
