import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="relative h-40 w-full sm:h-60">
          <Image src="/images/paper.png" alt="Dragon Ball Z Logo" fill className="object-contain" priority />
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Bienvenido a la Tienda de Dragon Ball Z</h1>

        <p className="max-w-[700px] text-lg text-muted-foreground">
          Explora nuestra colección de productos exclusivos de Dragon Ball Z. Contamos con una gran variedad de 
          figuras coleccionables.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
            <Link href="/productos">Ver Productos</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/acerca-de">Acerca de Nosotros</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
