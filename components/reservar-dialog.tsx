"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Babysitter } from "@/types/babysitter"

interface ReservarDialogProps {
  babysitter: Babysitter
}

export function ReservarDialog({ babysitter }: ReservarDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    cantidadHijos: "",
    edadesHijos: "",
    zona: "",
    necesidadesEspeciales: "",
    aclaraciones: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const resetForm = () => {
    setSubmitted(false)
    setFormData({
      nombre: "",
      telefono: "",
      cantidadHijos: "",
      edadesHijos: "",
      zona: "",
      necesidadesEspeciales: "",
      aclaraciones: "",
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          // Reset form when dialog closes
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full bg-goetheGreen hover:bg-goetheGreen/90">Reservar Babysitter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Reservar a {babysitter.nombre}</DialogTitle>
              <DialogDescription>Complete sus datos para solicitar una reserva con esta babysitter.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input id="nombre" className="col-span-3" required value={formData.nombre} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="telefono" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    className="col-span-3"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cantidadHijos" className="text-right">
                    Cantidad de hijos
                  </Label>
                  <Input
                    id="cantidadHijos"
                    type="number"
                    min="1"
                    className="col-span-3"
                    required
                    value={formData.cantidadHijos}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edadesHijos" className="text-right">
                    Edades
                  </Label>
                  <Input
                    id="edadesHijos"
                    placeholder="Ej: 3, 5, 7"
                    className="col-span-3"
                    required
                    value={formData.edadesHijos}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="zona" className="text-right">
                    Zona
                  </Label>
                  <Input id="zona" className="col-span-3" required value={formData.zona} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="necesidadesEspeciales" className="text-right">
                    Necesidades especiales
                  </Label>
                  <Textarea
                    id="necesidadesEspeciales"
                    className="col-span-3"
                    value={formData.necesidadesEspeciales}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="aclaraciones" className="text-right">
                    Aclaraciones
                  </Label>
                  <Textarea
                    id="aclaraciones"
                    className="col-span-3"
                    value={formData.aclaraciones}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-goetheGreen hover:bg-goetheGreen/90">
                  Enviar Solicitud
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>¡Solicitud Enviada!</DialogTitle>
              <DialogDescription>Su solicitud ha sido enviada a {babysitter.nombre}.</DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <p className="text-center mb-4">
                La propuesta ya se le envió a la babysitter y se le va a estar comunicando vía WhatsApp si acepta o no.
              </p>
              <p className="text-center text-sm text-gray-500">
                En caso de que la babysitter acepte, se va a estar comunicando con usted vía WhatsApp también.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)} className="bg-goetheGreen hover:bg-goetheGreen/90">
                Entendido
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
