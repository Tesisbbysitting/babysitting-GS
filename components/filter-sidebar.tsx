"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FilterSidebarProps {
  filters: {
    edad: number[]
    zonas: string[]
    dias: string[]
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

  // Manejar cambios en los sliders
  const handleSliderChange = (name: string, value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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

      {/* Edad */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-2">Edad</h3>
        <Slider
          value={localFilters.edad}
          max={30}
          min={18}
          step={1}
          onValueChange={(value) => handleSliderChange("edad", value)}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{localFilters.edad[0]} años</span>
          <span>{localFilters.edad[1]} años</span>
        </div>
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disp-lunes"
              checked={localFilters.dias.includes("Lunes")}
              onCheckedChange={(checked) => handleDiaChange("Lunes", checked as boolean)}
            />
            <Label htmlFor="disp-lunes">Lunes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disp-martes"
              checked={localFilters.dias.includes("Martes")}
              onCheckedChange={(checked) => handleDiaChange("Martes", checked as boolean)}
            />
            <Label htmlFor="disp-martes">Martes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disp-miercoles"
              checked={localFilters.dias.includes("Miércoles")}
              onCheckedChange={(checked) => handleDiaChange("Miércoles", checked as boolean)}
            />
            <Label htmlFor="disp-miercoles">Miércoles</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disp-jueves"
              checked={localFilters.dias.includes("Jueves")}
              onCheckedChange={(checked) => handleDiaChange("Jueves", checked as boolean)}
            />
            <Label htmlFor="disp-jueves">Jueves</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disp-viernes"
              checked={localFilters.dias.includes("Viernes")}
              onCheckedChange={(checked) => handleDiaChange("Viernes", checked as boolean)}
            />
            <Label htmlFor="disp-viernes">Viernes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disp-sabado"
              checked={localFilters.dias.includes("Sábado")}
              onCheckedChange={(checked) => handleDiaChange("Sábado", checked as boolean)}
            />
            <Label htmlFor="disp-sabado">Sábado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disp-domingo"
              checked={localFilters.dias.includes("Domingo")}
              onCheckedChange={(checked) => handleDiaChange("Domingo", checked as boolean)}
            />
            <Label htmlFor="disp-domingo">Domingo</Label>
          </div>
        </div>
      </div>

      <Button className="w-full bg-goetheGreen hover:bg-goetheGreen/90" onClick={handleApplyFilters}>
        Aplicar Filtros
      </Button>
    </div>
  )
}
