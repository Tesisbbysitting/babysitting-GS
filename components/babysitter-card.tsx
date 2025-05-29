import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Babysitter } from "@/types/babysitter"

interface BabysitterCardProps {
  babysitter: Babysitter
}

export function BabysitterCard({ babysitter }: BabysitterCardProps) {
  // Calcular el rating promedio de los comentarios
  const calcularRating = (b: Babysitter) => {
    if (!b.comentarios || b.comentarios.length === 0) return 0
    const sum = b.comentarios.reduce((acc, c) => acc + (typeof c.rating === "number" ? c.rating : 0), 0)
    return Math.round((sum / b.comentarios.length) * 10) / 10
  }
  const ratingPromedio = calcularRating(babysitter)

  function getImageUrl(url: string) {
    url = url.startsWith("@") ? url.slice(1) : url;
    const match = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`
    }
    return url
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={getImageUrl(babysitter.foto || "/placeholder.svg")} alt={babysitter.nombre} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{babysitter.nombre}</h3>
            <p className="text-sm text-gray-500">{babysitter.edad} años</p>
          </div>
          <div className="flex items-center">
            {babysitter.comentarios && babysitter.comentarios.length > 0 ? (
              <>
                <Star className="h-4 w-4 fill-goetheGold text-goetheGold" />
                <span className="ml-1 text-sm font-medium">{ratingPromedio}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          <Badge variant="outline" className="mr-1 bg-goetheGreen/10 text-goetheGreen border-goetheGreen/20">
            {babysitter.zona}
          </Badge>
          {babysitter.precioPorHora && (
            <Badge variant="outline" className="bg-goetheGold/10 text-goetheGold border-goetheGold/20">
              {`$${babysitter.precioPorHora}/h`}
            </Badge>
          )}
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            {babysitter.contadorReservas} reservas
          </Badge>
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-medium mb-1">Disponibilidad:</h4>
          <p className="text-sm text-gray-600">{babysitter.disponibilidad}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/perfiles/${babysitter.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-goetheGreen text-goetheGreen hover:bg-goetheGreen hover:text-white"
          >
            Ver Perfil
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
