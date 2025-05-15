import type { Product } from "./types"

const dbzProducts: Product[] = [
  {
    id: 1,
    name: "Figura Goku",
    description: "Figura de acción de Goku, con detalles precisos y alta calidad de materiales.",
    price: 2999,
    image: "https://dragonball-api.com/characters/goku_normal.webp",
    stock: 12,
  },
  {
    id: 2,
    name: "Figura de Piccolo",
    description: "",
    price: 599,
    image: "https://dragonball-api.com/characters/picolo_normal.webp",
    stock: 8,
  },
  {
    id: 3,
    name: "Figura de Freezer",
    description: "",
    price: 1499,
    image: "https://dragonball-api.com/characters/Freezer.webp",
    stock: 5,
  },
  {
    id: 4,
    name: "Funko Pop! Vegeta",
    description: "Figura coleccionable Funko Pop! de Vegeta en su pose característica.",
    price: 399,
    image: "https://dragonball-api.com/characters/vegeta_normal.webp",
    stock: 20,
  },
  {
    id: 5,
    name: "Figura de Gohan",
    description: "",
    price: 349,
    image: "https://dragonball-api.com/characters/gohan.webp",
    stock: 15,
  },
  {
    id: 6,
    name: "Figura de Krillin",
    description: "",
    price: 249,
    image: "https://dragonball-api.com/characters/Krilin_Universo7.webp",
    stock: 10,
  },
  {
    id: 7,
    name: "Figura de Android 17",
    description: "",
    price: 2499,
    image: "https://dragonball-api.com/characters/17_Artwork.webp",
    stock: 3,
  },
  {
    id: 8,
    name: "Figura de Bills",
    description: "",
    price: 899,
    image: "https://dragonball-api.com/characters/Beerus_DBS_Broly_Artwork.webp",
    stock: 7,
  },
  {
    id: 9,
    name: "Figura de Whis",
    description: "",
    price: 7999,
    image: "https://dragonball-api.com/characters/Whis_DBS_Broly_Artwork.webp",
    stock: 2,
  },
  {
    id: 10,
    name: "Figura de Zeno",
    description: "",
    price: 2799,
    image: "https://dragonball-api.com/characters/Zeno_Artwork.webp",
    stock: 4,
  },
  {
    id: 11,
    name: "Figura de Jiren",
    description: "",
    price: 349,
    image: "https://dragonball-api.com/characters/Jiren.webp",
    stock: 9,
  },
  {
    id: 12,
    name: "Figura Majin Buu",
    description: "Figura de Majin Buu con detalles precisos y acabado de alta calidad.",
    price: 2599,
    image: "https://dragonball-api.com/characters/BuuGordo_Universo7.webp",
    stock: 6,
  },
  {
    id: 13,
    name: "Figura de Marcarita",
    description: "",
    price: 199,
    image: "https://dragonball-api.com/characters/Marcarita.webp",
    stock: 18,
  },
  {
    id: 14,
    name: "Figura de Kaio-shin del Este",
    description: "",
    price: 899,
    image: "https://dragonball-api.com/characters/Kaio-shin_del_este_Artwork.webp",
    stock: 11,
  },
  {
    id: 15,
    name: "Figura Cell",
    description: "Figura de Cell en su forma perfecta, con base especial y efectos de energía.",
    price: 2699,
    image: "https://dragonball-api.com/characters/celula.webp",
    stock: 5,
  },
]

// Función para obtener todos los productos
export async function getProducts(): Promise<Product[]> {
  // Simulamos una llamada a API con un pequeño retraso
  await new Promise((resolve) => setTimeout(resolve, 500))

  return dbzProducts
}

// Función para obtener un producto específico por ID
export async function getProduct(id: string): Promise<Product> {
  // Simulamos una llamada a API con un pequeño retraso
  await new Promise((resolve) => setTimeout(resolve, 300))

  const product = dbzProducts.find((p) => p.id === Number.parseInt(id))

  if (!product) {
    throw new Error(`Producto con ID ${id} no encontrado`)
  }

  return product
}

// Función para actualizar el stock de un producto
export async function updateProductStock(id: number, newStock: number): Promise<void> {
  // Simulamos una llamada a API con un pequeño retraso
  await new Promise((resolve) => setTimeout(resolve, 300))

  const productIndex = dbzProducts.findIndex((p) => p.id === id)
  if (productIndex !== -1) {
    dbzProducts[productIndex].stock = newStock
  }
}

// Exportamos también la lista completa para uso directo
export const products = dbzProducts
