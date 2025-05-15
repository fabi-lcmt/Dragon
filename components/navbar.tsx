"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "./cart-provider"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Acerca de", href: "/acerca-de" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { items } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <Image src="/images/esfera.png" alt="Dragon Ball" fill className="object-contain" />
            </div>
            <span className="hidden font-bold sm:inline-block">Dragon Ball Z Store</span>
          </Link>

          <nav className="hidden md:flex md:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-orange-500",
                  pathname === item.href ? "text-orange-500" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/carrito">
            <Button variant="outline" size="icon" className="relative" aria-label="Carrito">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => document.body.click()}>
                  <div className="relative h-8 w-8">
                    <Image src="/images/dragon-ball.png" alt="Dragon Ball" fill className="object-contain" />
                  </div>
                  <span className="font-bold">Dragon Ball Z Store</span>
                </Link>

                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-orange-500",
                        pathname === item.href ? "text-orange-500" : "text-muted-foreground",
                      )}
                      onClick={() => document.body.click()}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/carrito"
                    className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-orange-500"
                    onClick={() => document.body.click()}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Carrito
                    {totalItems > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
