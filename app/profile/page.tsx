"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { UserArticles } from "@/components/profile/user-articles"
import { UserTournaments } from "@/components/profile/user-tournaments"
import { AccountSettings } from "@/components/profile/account-settings"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Trophy, FileText, Settings } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("articles")

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para acessar seu perfil.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [isAuthenticated, router, toast])

  if (!isAuthenticated || !user) {
    return null
  }

  const roleLabels = {
    USER: "Usuário",
    EDITOR: "Editor",
    TOURNAMENT_ADMIN: "Admin de Torneios",
    ADMIN: "Administrador",
  }

  // Estatísticas do usuário (mock)
  const userStats = {
    articlesCount: 8,
    tournamentsCount: 12,
    tournamentsWon: 3,
    lastActive: "15/04/2023",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary">{roleLabels[user.role as keyof typeof roleLabels] || "Usuário"}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Ativo desde 01/01/2023
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{userStats.articlesCount}</p>
                  <p className="text-xs text-muted-foreground">Artigos</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{userStats.tournamentsCount}</p>
                  <p className="text-xs text-muted-foreground">Torneios</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{userStats.tournamentsWon}</p>
                  <p className="text-xs text-muted-foreground">Vitórias</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">
                    {Math.round((userStats.tournamentsWon / userStats.tournamentsCount) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Winrate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Meus Artigos</span>
            <span className="sm:hidden">Artigos</span>
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Meus Torneios</span>
            <span className="sm:hidden">Torneios</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Configurações</span>
            <span className="sm:hidden">Config.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          <UserArticles userId={user.id} />
        </TabsContent>

        <TabsContent value="tournaments" className="mt-6">
          <UserTournaments userId={user.id} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <AccountSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}