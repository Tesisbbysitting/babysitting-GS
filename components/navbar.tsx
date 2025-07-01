'use client';
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("sb_token") : null;
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setIsLoggedIn(!!(data && data.success && data.user));
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

  const handleLoginClick = () => {
    router.push("/login-usuario")
  }

  const handleProfileClick = () => {
    router.push("/mi-perfil")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 min-w-0 flex-shrink">
          <Image
            src="/bumi.jpg"
            alt="Logo BUMI"
            width={80}
            height={80}
            className="h-10 w-auto sm:h-12"
          />
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold text-goetheGreen hover:text-goetheGreen/80 px-2 py-1 rounded-md transition-colors">
            Inicio
          </Link>
          <Link href="/perfiles" className="text-lg font-semibold text-goetheGreen hover:text-goetheGreen/80 px-2 py-1 rounded-md transition-colors">
            Perfiles
          </Link>
          <Link
            href="/registro-babysitter"
            className="text-lg font-semibold text-goetheGreen hover:text-goetheGreen/80 px-2 py-1 rounded-md transition-colors"
          >
            Ser Babysitter
          </Link>
          {!isLoggedIn ? (
            <Button className="bg-goetheGreen hover:bg-goetheGreen/90 text-white px-8 py-3 text-lg font-semibold" onClick={handleLoginClick}>
              Iniciar sesión
            </Button>
          ) : (
            <Button variant="outline" className="border-goetheGreen text-goetheGreen hover:bg-goetheGreen/10 px-8 py-3 text-lg font-semibold" onClick={handleProfileClick}>
              Mi Perfil
            </Button>
          )}
        </nav>
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <svg className="w-7 h-7 text-goetheGreen" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        {/* Sidebar */}
        <aside className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 md:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-lg font-bold text-goetheGold">Menú</span>
            <button onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
              <svg className="w-6 h-6 text-goetheGreen" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-4 p-4">
            <Link href="/" className="text-base font-medium text-goetheGreen" onClick={() => setSidebarOpen(false)}>
              Inicio
            </Link>
            <Link href="/perfiles" className="text-base font-medium text-goetheGreen" onClick={() => setSidebarOpen(false)}>
              Perfiles
            </Link>
            <Link
              href="/registro-babysitter"
              className="text-base font-medium text-goetheGreen"
              onClick={() => setSidebarOpen(false)}
            >
              Ser Babysitter
            </Link>
            <div className="ml-auto flex items-center gap-4">
              {!isLoggedIn ? (
                <Button className="bg-goetheGreen hover:bg-goetheGreen/90 text-white w-full" onClick={handleLoginClick}>
                  Iniciar sesión
                </Button>
              ) : (
                <Button variant="outline" className="border-goetheGreen text-goetheGreen hover:bg-goetheGreen/10 w-full" onClick={handleProfileClick}>
                  Mi Perfil
                </Button>
              )}
            </div>
          </nav>
        </aside>
      </div>
    </header>
  )
}
