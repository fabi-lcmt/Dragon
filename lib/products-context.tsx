"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { products as initialProducts, updateProductStock } from "@/lib/products"
import type { Product } from "@/lib/types"

interface ProductsContextType {
  products: Product[]
  updateStock: (productId: number, newStock: number) => void
  getProduct: (productId: number) => Product | undefined
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const updateStock = (productId: number, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === productId ? { ...product, stock: newStock } : product)),
    )

    // También actualizamos en la "API"
    updateProductStock(productId, newStock)
  }

  const getProduct = (productId: number) => {
    return products.find((product) => product.id === productId)
  }

  return <ProductsContext.Provider value={{ products, updateStock, getProduct }}>{children}</ProductsContext.Provider>
}
