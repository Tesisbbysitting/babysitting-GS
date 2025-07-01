export interface Comentario {
  nombre: string
  fecha: string
  rating: number
  texto: string
}

export interface Babysitter {
  id: string
  nombre: string
  edad: number
  foto: string
  zona: string
  rating: number
  disponibilidad: string
  universidad: string
  carrera: string
  experiencia: string
  descripcion: string
  hobbies: string[]
  comentarios: Comentario[]
  precioPorHora: string
  contadorReservas: number
  aprobado?: boolean
}
