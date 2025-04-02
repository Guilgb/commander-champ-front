"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { verifyToken, isTokenExpired, type JWTPayload } from "./jwt"
import api from "@/service/api"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie";


type User = {
  id: string
  name: string
  email: string
  role: "USER" | "EDITOR" | "TOURNAMENT_ADMIN" | "ADMIN"
  image?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  getToken: () => Promise<string | null>
  register: (name: string, email: string, password: string) => Promise<void>
}

type UserRolesType = {
  id: number
  name: string
  email: string
  role: "USER" | "EDITOR" | "TOURNAMENT_ADMIN" | "ADMIN"
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { },
  logout: () => { },
  getToken: async () => null,
  register: async () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token") ? localStorage.getItem("auth_token") : Cookies.get("auth_token")

      if (!token) {
        setIsLoading(false)
        return
      }

      if (isTokenExpired(token)) {
        localStorage.removeItem("auth_token")
        setIsLoading(false)
        return
      }

      try {
        const payload = await verifyToken(token)
        setUser({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role as User["role"],
        })
      } catch (error) {
        localStorage.removeItem("auth_token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const userData: User = response.data
      setUser(userData)

      Cookies.set("auth_token", response.data.access_token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      localStorage.setItem("auth_token", response.data.access_token)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const user_roles = await api.post<UserRolesType>("/user-roles/authentication", {
        email,
      })

      let role: User["role"] = "USER"

      if (user_roles.data.role === "ADMIN") {
        role = "ADMIN"
      } else if (user_roles.data.role === "EDITOR") {
        role = "EDITOR"
      } else if (user_roles.data.role === "TOURNAMENT_ADMIN") {
        role = "TOURNAMENT_ADMIN"
      }

      const userData: User = {
        id: user_roles.data.id.toString(),
        name: user_roles.data.name,
        email,
        role,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      setIsLoading(false)
    } catch (error) {
      throw new Error("Failed to authenticate")
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/login")
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    await api.post<UserRolesType>("/user", {
      name,
      email,
      password,
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser(null)
    router.push("/login")
  }

  const getToken = async (): Promise<string | null> => {
    const token = localStorage.getItem("auth_token")

    if (!token) return null

    if (isTokenExpired(token)) {
      logout()
      return null
    }

    return token
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getToken,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

