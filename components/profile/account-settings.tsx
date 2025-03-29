"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { User, Lock, Bell, Upload, Loader2 } from "lucide-react"

interface AccountSettingsProps {
  user: any
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Estados para os formulários
  const [profileForm, setProfileForm] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: "Jogador de Commander 500 desde 2020. Especialista em estratégias de controle e midrange.",
    location: "São Paulo, SP",
    website: "https://mtgcommander500.com.br/user/joaosilva",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    tournamentReminders: true,
    articleComments: true,
    forumReplies: true,
    newArticles: false,
    newTournaments: true,
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    // Simular atualização
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsUpdating(false)
    toast({
      title: "Perfil atualizado",
      description: "Suas informações de perfil foram atualizadas com sucesso.",
    })
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Erro ao alterar senha",
        description: "As senhas não coincidem. Por favor, verifique e tente novamente.",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)

    // Simular atualização
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsChangingPassword(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    })
  }

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value,
    })

    toast({
      title: "Preferências atualizadas",
      description: "Suas preferências de notificação foram atualizadas.",
    })
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)

    // Simular upload
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsUploading(false)
    toast({
      title: "Foto atualizada",
      description: "Sua foto de perfil foi atualizada com sucesso.",
    })
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Perfil</span>
          <span className="sm:hidden">Perfil</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Segurança</span>
          <span className="sm:hidden">Segurança</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notificações</span>
          <span className="sm:hidden">Notif.</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais e como você aparece na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="text-2xl">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="relative" disabled={isUploading}>
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={isUploading}
                        />
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Alterar foto
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Input
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Localização</Label>
                        <Input
                          id="location"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website/Perfil</Label>
                        <Input
                          id="website"
                          value={profileForm.website}
                          onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar alterações"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Segurança da Conta</CardTitle>
            <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Alterando...
                      </>
                    ) : (
                      "Alterar senha"
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Sessões ativas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Este dispositivo</p>
                    <p className="text-sm text-muted-foreground">São Paulo, Brasil • Última atividade: Agora</p>
                  </div>
                  <Badge>Atual</Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Chrome em Windows</p>
                    <p className="text-sm text-muted-foreground">
                      Rio de Janeiro, Brasil • Última atividade: 2 dias atrás
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Encerrar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Notificação</CardTitle>
            <CardDescription>Escolha como e quando deseja receber notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Notificações por email</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate("emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tournament-reminders">Lembretes de torneios</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber lembretes sobre torneios que você se inscreveu
                    </p>
                  </div>
                  <Switch
                    id="tournament-reminders"
                    checked={notificationSettings.tournamentReminders}
                    onCheckedChange={(checked) => handleNotificationUpdate("tournamentReminders", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="article-comments">Comentários em artigos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações quando alguém comentar em seus artigos
                    </p>
                  </div>
                  <Switch
                    id="article-comments"
                    checked={notificationSettings.articleComments}
                    onCheckedChange={(checked) => handleNotificationUpdate("articleComments", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="forum-replies">Respostas no fórum</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações quando alguém responder aos seus tópicos no fórum
                    </p>
                  </div>
                  <Switch
                    id="forum-replies"
                    checked={notificationSettings.forumReplies}
                    onCheckedChange={(checked) => handleNotificationUpdate("forumReplies", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-articles">Novos artigos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações quando novos artigos forem publicados
                    </p>
                  </div>
                  <Switch
                    id="new-articles"
                    checked={notificationSettings.newArticles}
                    onCheckedChange={(checked) => handleNotificationUpdate("newArticles", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-tournaments">Novos torneios</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações sobre novos torneios</p>
                  </div>
                  <Switch
                    id="new-tournaments"
                    checked={notificationSettings.newTournaments}
                    onCheckedChange={(checked) => handleNotificationUpdate("newTournaments", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Suas preferências de notificação são atualizadas automaticamente.
            </p>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}