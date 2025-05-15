import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/components/cart-provider"
import { ProductsProvider } from "@/lib/products-context"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dragon Ball Z Store",
  description: "Tienda de productos de Dragon Ball Z",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ProductsProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                  
                </footer>
              </div>
              <Toaster />
            </CartProvider>
          </ProductsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
