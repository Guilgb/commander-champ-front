"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { UserManagement } from "@/components/user-management"
import { TournamentManagement } from "@/components/tournament-management"
import { ContentManagement } from "@/components/content-management"
import api from "@/service/api";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await api.post("/user-roles/authentication", {
          email: user?.email,
        })

        if (response.status !== 201) {
          throw new Error("Failed to authenticate")
        }
        const data = response.data
        // if (!data.isAuthenticated || data.role !== "ADMIN") {
        if (data.role !== "ADMIN") {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar o painel de administração.",
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        toast({
          title: "Erro de autenticação",
          description: "Ocorreu um erro ao verificar a autenticação.",
          variant: "destructive",
        })
        router.push("/login")
      }
    }

    authenticateUser()
    if (isAuthenticated) {
      if (user?.role !== "ADMIN") {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel de administração.",
          variant: "destructive",
        })
        router.push("/")
      }
    } else {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado como administrador para acessar esta página.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [isAuthenticated, user, router, toast])

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel de Administração</h1>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="tournaments">Torneios</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Gerencie os usuários e suas permissões</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Torneios</CardTitle>
              <CardDescription>Gerencie os torneios e seus resultados</CardDescription>
            </CardHeader>
            <CardContent>
              <TournamentManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Conteúdo</CardTitle>
              <CardDescription>Gerencie artigos, fórum e regras do formato</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

