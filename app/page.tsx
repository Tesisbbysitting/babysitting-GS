import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-goetheGreen/10 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-goetheGreen">
                  Babysitting para la Comunidad Goethe Schule
                </h1>
                <p className="max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Conectamos a padres con babysitters confiables de nuestra comunidad escolar.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Link href="/perfiles">
                  <Button className="bg-goetheGreen hover:bg-goetheGreen/90">Ver Perfiles</Button>
                </Link>
                <Link href="https://forms.gle/KVrErwn5bufVeuMa8" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-goetheGold text-goetheGold hover:bg-goetheGold/10">
                    Quiero ser Babysitter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Proceso de Verificación */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-goetheGreen">
                  Nuestro Proceso de Verificación
                </h2>
                <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Como ex alumnas del Colegio Goethe, nos encargamos personalmente de verificar a cada babysitter.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-goetheGreen text-white">
                  1
                </div>
                <h3 className="text-xl font-bold text-goetheGold">Solicitud</h3>
                <p className="text-center text-gray-700">
                  Las babysitters de la comunidad Goethe envían su solicitud con sus datos y experiencia.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-goetheGreen text-white">
                  2
                </div>
                <h3 className="text-xl font-bold text-goetheGold">Verificación</h3>
                <p className="text-center text-gray-700">
                  Verificamos que pertenezcan a la comunidad y evaluamos su perfil para garantizar seguridad.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-goetheGreen text-white">
                  3
                </div>
                <h3 className="text-xl font-bold text-goetheGold">Aprobación</h3>
                <p className="text-center text-gray-700">
                  Una vez aprobadas, las babysitters aparecen en nuestra plataforma para ser contactadas por padres.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Link href="/perfiles">
                <Button className="bg-goetheGreen hover:bg-goetheGreen/90">Ver Perfiles de Babysitters</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
