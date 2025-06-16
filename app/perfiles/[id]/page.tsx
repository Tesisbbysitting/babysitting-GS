"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Calendar, GraduationCap, Heart } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Babysitter } from "@/types/babysitter"

function calcularRating(b: Babysitter) {
  if (!b.comentarios || b.comentarios.length === 0) return null
  const sum = b.comentarios.reduce((acc, c) => acc + (typeof c.rating === "number" ? c.rating : 0), 0)
  return Math.round((sum / b.comentarios.length) * 10) / 10
}

function getImageUrl(url: string) {
  url = url.startsWith("@") ? url.slice(1) : url;
  const match = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }
  return url
}

export default function PerfilPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const [babysitter, setBabysitter] = useState<Babysitter | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBabysitter() {
      const res = await fetch(`/api/babysitters/${id}`)
      const data = await res.json()
      setBabysitter(data.babysitter || null)
      setLoading(false)
    }
    if (id) fetchBabysitter()
  }, [id])

  if (loading) {
    return <div className="flex min-h-screen flex-col"><Navbar /><main className="flex-1 flex items-center justify-center">Cargando...</main><Footer /></div>
  }
  if (!babysitter) {
    return <div className="flex min-h-screen flex-col"><Navbar /><main className="flex-1 flex items-center justify-center">Babysitter no encontrada</main><Footer /></div>
  }

  const ratingPromedio = calcularRating(babysitter)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-0">
                  <div className="relative h-80 w-full">
                    <Image
                      src={getImageUrl(babysitter.foto || "/placeholder.svg")}
                      alt={babysitter.nombre}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h1 className="text-2xl font-bold">{babysitter.nombre}</h1>
                        <p className="text-gray-500">{babysitter.edad} años</p>
                      </div>
                      <div className="flex items-center bg-goetheGold/10 px-2 py-1 rounded">
                        {babysitter.comentarios && babysitter.comentarios.length > 0 ? (
                          <>
                            <Star className="h-4 w-4 fill-goetheGold text-goetheGold" />
                            <span className="ml-1 font-medium">{ratingPromedio}</span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-goetheGreen" />
                        <span>{babysitter.zona}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-goetheGreen" />
                        <span>{babysitter.disponibilidad}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <GraduationCap className="h-4 w-4 mr-2 text-goetheGreen" />
                        <span>
                          {babysitter.universidad} - {babysitter.carrera}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-2">Precio por hora:</span>
                        <span>{babysitter.precioPorHora ? `$${babysitter.precioPorHora}/h` : "-"}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-2">Reservas:</span>
                        <span>{babysitter.contadorReservas ?? 0}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {babysitter.hobbies.map((hobby, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-goetheGreen/10 text-goetheGreen border-goetheGreen/20"
                        >
                          {hobby}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <Link
                        href="https://forms.gle/qVyWVDapSywmzwfF9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button className="w-full bg-goetheGreen hover:bg-goetheGreen/90">Reservar Babysitter</Button>
                      </Link>

                      <Link href="/perfiles" className="block w-full">
                        <Button variant="outline" className="w-full">
                          Volver a Perfiles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-goetheGreen mb-4">Sobre mí</h2>
              <p className="text-gray-700 whitespace-pre-line">{babysitter.descripcion}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-goetheGreen mb-4">Experiencia</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-goetheGreen/10 p-2 rounded mr-4">
                    <Heart className="h-5 w-5 text-goetheGreen" />
                  </div>
                  <div>
                    <h3 className="font-medium">Nivel de experiencia</h3>
                    <p className="text-gray-700">{babysitter.experiencia}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-goetheGreen mb-4">Comentarios</h2>
              <div className="space-y-4">
                {babysitter.comentarios.map((comentario, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{comentario.nombre}</h4>
                          <p className="text-sm text-gray-500">{comentario.fecha}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-goetheGold text-goetheGold" />
                          <span className="ml-1 text-sm font-medium">{comentario.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{comentario.texto}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
