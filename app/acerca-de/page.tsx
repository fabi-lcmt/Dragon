"use client"
import Image from "next/image"

export default function AcercaDePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-orange-600">Acerca de Dragon Ball Z Store</h1>

      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl h-96"> 
          <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dragon-ball-bG5tsPW1mOpLAbxGdKvwxcFmfGieMi.png"
              alt="Dragon Ball Super Logo"
              className="w-full h-full object-contain" 
            />
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <p>
          Bienvenido a Dragon Ball Z Store, tu destino definitivo para todos los productos oficiales de Dragon Ball Z.
        </p>

        <p>
          Nuestra tienda está dedicada a los fans de la legendaria serie creada por Akira Toriyama. Ofrecemos una amplia
          gama de figuras coleccionables, todos inspirados en el universo de Dragon Ball.
        </p>

        <h2>Nuestra Misión</h2>
        <p>
          En Dragon Ball Z Store, nos esforzamos por proporcionar productos de la más alta calidad a precios accesibles
          para todos los fans. Nuestro objetivo es mantener viva la pasión por Dragon Ball Z y permitir a los fans
          mostrar su amor por la serie a través de productos exclusivos.
        </p>

        <h2>Contacto</h2>
        <p>Si tienes alguna pregunta o sugerencia, no dudes en contactarnos:</p>
        <ul>
          <li>Email: info@dragonballzstore.com</li>
          <li>Teléfono: (123) 456-7890</li>
        </ul>
      </div>
    </div>
  )
}