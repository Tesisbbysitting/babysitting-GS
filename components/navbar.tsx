import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/bumi.jpg"
            alt="Logo BUMI"
            width={80}
            height={80}
          />
          <span className="text-xl font-bold text-goetheGold">Babysitting Goethe Schule</span>
        </Link>
        <nav className="ml-auto flex gap-4">
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
      </div>
    </header>
  )
}
