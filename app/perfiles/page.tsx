"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { BabysitterCard } from "@/components/babysitter-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import type { Babysitter } from "@/types/babysitter"

export default function PerfilesPage() {
  const [babysitters, setBabysitters] = useState<Babysitter[]>([])
  const [filteredBabysitters, setFilteredBabysitters] = useState<Babysitter[]>([])
  const [filters, setFilters] = useState({
    zonas: [] as string[],
    dias: [] as string[],
    turnos: [] as string[],
  })
  const [zonasDisponibles, setZonasDisponibles] = useState<string[]>([])

  useEffect(() => {
    async function fetchBabysitters() {
      const res = await fetch("/api/babysitters")
      const data = await res.json()
      // Ordenar por contadorReservas de mayor a menor
      const ordenadas = [...data.babysitters].sort((a, b) => (b.contadorReservas || 0) - (a.contadorReservas || 0))
      setBabysitters(ordenadas)
      setFilteredBabysitters(ordenadas)
      setZonasDisponibles(data.zonasDisponibles)
    }
    fetchBabysitters()
  }, [])

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let result = [...babysitters]

    // Filtrar por zona
    if (filters.zonas.length > 0) {
      result = result.filter((babysitter) => filters.zonas.includes(babysitter.zona))
    }

    // Filtrar por días disponibles
    if (filters.dias.length > 0) {
      result = result.filter((babysitter) => {
        return filters.dias.some((dia) => babysitter.disponibilidad.toLowerCase().includes(dia.toLowerCase()))
      })
    }

    // Filtrar por turnos (mañana, tarde, noche)
    if (filters.turnos && filters.turnos.length > 0) {
      result = result.filter((babysitter) => {
        return filters.turnos.some((turno) => babysitter.disponibilidad.toLowerCase().includes(turno.toLowerCase()))
      })
    }

    setFilteredBabysitters(result)
  }, [filters])

  // Calcular zonas disponibles dinámicamente según las babysitters filtradas
  // Función para actualizar los filtros
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  // Función para resetear los filtros
  const handleResetFilters = () => {
    setFilters({
      zonas: [],
      dias: [],
      turnos: [],
    })
    setFilteredBabysitters(babysitters)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-goetheGreen mb-8">Perfiles de Babysitters</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} zonasDisponibles={Array.isArray(zonasDisponibles) ? zonasDisponibles : []} />
          </div>

          <div className="w-full md:w-3/4">
            {Array.isArray(filteredBabysitters) && filteredBabysitters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBabysitters.map((babysitter) => (
                  <BabysitterCard key={babysitter.id} babysitter={babysitter} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">No se encontraron babysitters con los filtros seleccionados.</p>
                <button onClick={handleResetFilters} className="mt-4 text-goetheGreen hover:underline">
                  Borrar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
