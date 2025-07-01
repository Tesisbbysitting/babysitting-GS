"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegistroUsuario() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-goetheGreen/10 to-white py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6 text-goetheGreen">Registrate</h1>
        <div className="flex flex-col gap-6">
          <Link href="/registro-babysitter">
            <Button className="bg-goetheGreen hover:bg-goetheGreen/90 w-full py-4 text-lg">Registrate como Babysitter</Button>
          </Link>
          <Link href="/registro-padre">
            <Button variant="outline" className="border-goetheGreen text-goetheGreen hover:bg-goetheGreen/10 w-full py-4 text-lg">Registrate como Padre</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 