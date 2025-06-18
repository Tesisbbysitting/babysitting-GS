import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/bumi.jpg"
            alt="Logo BUMI"
            width={80}
            height={80}
          />
          <span className="text-xl font-bold text-goetheGold whitespace-nowrap">Babysitting Goethe Schule</span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4">
          <Link href="/" className="text-sm font-medium text-goetheGreen hover:text-goetheGreen/80">
            Inicio
          </Link>
          <Link href="/perfiles" className="text-sm font-medium text-goetheGreen hover:text-goetheGreen/80">
            Perfiles
          </Link>
          <Link
            href="https://forms.gle/KVrErwn5bufVeuMa8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-goetheGreen hover:text-goetheGreen/80"
          >
            Ser Babysitter
          </Link>
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
              href="https://forms.gle/KVrErwn5bufVeuMa8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-goetheGreen"
              onClick={() => setSidebarOpen(false)}
            >
              Ser Babysitter
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  )
}
