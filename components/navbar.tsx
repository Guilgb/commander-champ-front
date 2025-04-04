"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/lib/auth"
import { UserNav } from "@/components/user-nav"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Início",
      active: pathname === "/",
    },
    // {
    //   href: "/forum",
    //   label: "Fórum",
    //   active: pathname === "/forum",
    // },
    {
      href: "/articles",
      label: "Artigos",
      active: pathname === "/articles" || pathname.startsWith("/articles/"),
    },
    {
      href: "/metrics",
      label: "Métricas",
      active: pathname === "/metrics",
    },
  ]

  // Editor routes
  const editorRoutes = [
    {
      href: "/articles/create",
      label: "Criar Artigo",
      active: pathname === "/articles/create",
    },
  ]

  // Tournament admin routes
  const tournamentAdminRoutes = [
    {
      href: "/tournaments/register",
      label: "Registrar Torneio",
      active: pathname === "/tournaments/register",
    },
  ]

  // Admin routes
  const adminRoutes = [
    {
      href: "/admin",
      label: "Admin",
      active: pathname === "/admin",
    },
  ]

  // Filter routes based on user role
  const userRoutes = [...routes]

  if (isAuthenticated) {
    if (user?.role === "EDITOR") {
      userRoutes.push(...editorRoutes)
    }
    if (user?.role === "TOURNAMENT_ADMIN") {
      userRoutes.push(...tournamentAdminRoutes)
    }
    if (user?.role === "ADMIN") {
      userRoutes.push(...editorRoutes, ...tournamentAdminRoutes, ...adminRoutes)
    }
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          Commander 500
        </Link>
        <nav className="hidden md:flex ml-auto items-center gap-6">
          <div className="flex gap-6">
            {userRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  route.active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>
          <ModeToggle />
          {isAuthenticated ? (
            <UserNav user={user} />
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
        <div className="flex md:hidden ml-auto items-center gap-4">
          <ModeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {userRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      route.active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Button asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

