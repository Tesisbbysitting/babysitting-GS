"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FilterSidebarProps {
  filters: {
    zonas: string[]
    dias: string[]
    turnos?: string[]
  }
  onFilterChange: (filters: any) => void
  onResetFilters: () => void
  zonasDisponibles: string[]
}

export function FilterSidebar({ filters, onFilterChange, onResetFilters, zonasDisponibles }: FilterSidebarProps) {
  // Estado local para los filtros
  const [localFilters, setLocalFilters] = useState(filters)

  // Actualizar estado local cuando cambian los props
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // Manejar cambios en los checkboxes de zona
  const handleZonaChange = (zona: string, checked: boolean) => {
    setLocalFilters((prev) => {
      if (checked) {
        return {
          ...prev,
          zonas: [...prev.zonas, zona],
        }
      } else {
        return {
          ...prev,
          zonas: prev.zonas.filter((z) => z !== zona),
        }
      }
    })
  }

  // Manejar cambios en los checkboxes de días
  const handleDiaChange = (dia: string, checked: boolean) => {
    setLocalFilters((prev) => {
      if (checked) {
        return {
          ...prev,
          dias: [...prev.dias, dia],
        }
      } else {
        return {
          ...prev,
          dias: prev.dias.filter((d) => d !== dia),
        }
      }
    })
  }

  // Manejar cambios en los checkboxes de turnos
  const handleTurnoChange = (turno: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const turnos = prev.turnos || [];
      if (checked) {
        return {
          ...prev,
          turnos: [...turnos, turno],
        }
      } else {
        return {
          ...prev,
          turnos: turnos.filter((t: string) => t !== turno),
        }
      }
    })
  }

  // Aplicar filtros
  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }

  // Resetear filtros
  const handleResetFilters = () => {
    onResetFilters()
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-goetheGreen">Filtros</h2>
        <button onClick={handleResetFilters} className="text-sm text-gray-500 hover:text-goetheGreen">
          Borrar filtros
        </button>
      </div>

      {/* Zona */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-2">Zona</h3>
        <div className="space-y-2">
          {zonasDisponibles.map((zona) => (
            <div className="flex items-center space-x-2" key={zona}>
            <Checkbox
                id={`zona-${zona}`}
                checked={localFilters.zonas.includes(zona)}
                onCheckedChange={(checked) => handleZonaChange(zona, checked as boolean)}
            />
              <Label htmlFor={`zona-${zona}`}>{zona}</Label>
          </div>
          ))}
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-2">Disponibilidad</h3>
        <div className="space-y-2">
          {["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].map((dia) => (
            <div className="flex items-center space-x-2" key={dia}>
              <Checkbox
                id={`disp-${dia.toLowerCase()}`}
                checked={localFilters.dias.includes(dia)}
                onCheckedChange={(checked) => handleDiaChange(dia, checked as boolean)}
              />
              <Label htmlFor={`disp-${dia.toLowerCase()}`}>{dia}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Turno */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-2">Turno</h3>
        <div className="space-y-2">
          {["Mañana","Tarde","Noche"].map((turno) => (
            <div className="flex items-center space-x-2" key={turno}>
              <Checkbox
                id={`turno-${turno.toLowerCase()}`}
                checked={localFilters.turnos?.includes(turno) || false}
                onCheckedChange={(checked) => handleTurnoChange(turno, checked as boolean)}
              />
              <Label htmlFor={`turno-${turno.toLowerCase()}`}>{turno}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full bg-goetheGreen hover:bg-goetheGreen/90" onClick={handleApplyFilters}>
        Aplicar Filtros
      </Button>
    </div>
  )
}
