"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TournamentResultsTable } from "@/components/tournament-results-table"
import { useToast } from "@/components/ui/use-toast"
import { LoadingOverlay } from "@/components/loading-overlay"
import { CardSearch } from "@/components/card-search"
import { ColorSelector } from "@/components/color-selector"
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuidv4 } from "uuid"
import { AlertCircle, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DatePicker } from "@/components/ui/date-picker"
import api from "@/service/api"
import { Player, Tournament } from "./types"

export default function EditTournamentPage() {
  const params = useParams()
  const tournamentId = params.id as string
  const router = useRouter()
  const { toast } = useToast()

  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [newPlayer, setNewPlayer] = useState<Omit<Player, "id">>({
    name: "",
    commander: "",
    partner: "",
    colors: "",
    decklist: "",
    wins: 0,
    losses: 0,
    draws: 0,
    isWinner: false,
  })

  useEffect(() => {
    const fetchTournament = async () => {
      setIsLoading(true)
      try {
        const response = await api.post(`/tournaments/info`, {
          id: tournamentId,
        })
        if (!response.data) {
          throw new Error("Falha ao carregar dados do torneio")
        }
        setTournament(response.data)
      } catch (error) {
        console.error("Erro ao carregar torneio:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do torneio.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchTournament()
  }, [tournamentId, toast])

  const handleTournamentChange = (field: keyof Tournament, value: any) => {
    if (!tournament) return
    setTournament({ ...tournament, [field]: value })
  }

  const handlePlayersChange = (players: Player[]) => {
    if (!tournament) return
    setTournament({ ...tournament, players })
  }

  const handleAddPlayer = () => {
    if (!tournament) return

    const player: Player = {
      id: uuidv4(),
      ...newPlayer,
    }

    setTournament({
      ...tournament,
      players: [...tournament.players, player],
    })

    setNewPlayer({
      name: "",
      commander: "",
      partner: "",
      colors: "",
      decklist: "",
      wins: 0,
      losses: 0,
      draws: 0,
      isWinner: false,
    })
  }

  const handleRemovePlayer = (playerId: string) => {
    if (!tournament) return

    setTournament({
      ...tournament,
      players: tournament.players.filter((player) => player.id !== playerId),
    })
  }

  const handleNewPlayerChange = (field: keyof Omit<Player, "id">, value: any) => {
    setNewPlayer({ ...newPlayer, [field]: value })
  }

  const handleCommanderSelect = (_name: string, cardData: any) => {
    if (cardData) {
      const colors = cardData.color_identity?.join("") || ""
      handleNewPlayerChange("commander", cardData.name)
      handleNewPlayerChange("colors", colors)
    }
  }

  const handlePartnerSelect = (_name: string, cardData: any) => {
    if (cardData) {
      const currentColors = newPlayer.colors.split("")
      const partnerColors = cardData.color_identity || []

      const combinedColors = [...new Set([...currentColors, ...partnerColors])].join("")

      handleNewPlayerChange("partner", cardData.name)
      handleNewPlayerChange("colors", combinedColors)
    }
  }

  const handleSaveTournament = async () => {
    if (!tournament) return

    setIsSubmitLoading(true)

    try {
      // Em um ambiente real, você faria uma chamada à API
      // Aqui estamos simulando o salvamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Sucesso",
        description: "Torneio atualizado com sucesso!",
      })

      // Redirecionar para a página de detalhes do torneio
      router.push(`/tournaments/${tournamentId}`)
    } catch (error) {
      console.error("Erro ao salvar torneio:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações do torneio.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitLoading(false)
    }
  }

  const handleDeleteTournament = async () => {
    setIsDeleteLoading(true)

    try {
      //todo implmenter o delete tournament
      // Em um ambiente real, você faria uma chamada à API
      // Aqui estamos simulando a exclusão
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Sucesso",
        description: "Torneio excluído com sucesso!",
      })

      // Redirecionar para a lista de torneios
      router.push("/tournaments")
    } catch (error) {
      console.error("Erro ao excluir torneio:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o torneio.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingOverlay message="Carregando dados do torneio..." />
  }

  if (!tournament) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os dados do torneio. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/tournaments")}>
          Voltar para a lista de torneios
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      {isSubmitLoading && <LoadingOverlay message="Salvando alterações..." />}
      {isDeleteLoading && <LoadingOverlay message="Excluindo torneio..." />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Torneio</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/tournaments/${tournamentId}`)}>Cancelar</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Torneio
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente o torneio e todos os seus dados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTournament} className="bg-red-600 hover:bg-red-700">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Detalhes do Torneio</TabsTrigger>
          <TabsTrigger value="players">Jogadores</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Torneio</CardTitle>
              <CardDescription>Edite os detalhes básicos do torneio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Torneio</Label>
                  <Input
                    id="name"
                    value={tournament.name}
                    onChange={(e) => handleTournamentChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <DatePicker date={tournament.date} setDate={(date) => handleTournamentChange("date", date)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    value={tournament.location}
                    onChange={(e) => handleTournamentChange("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizador</Label>
                  <Input
                    id="organizer"
                    value={tournament.organizer}
                    onChange={(e) => handleTournamentChange("organizer", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Formato</Label>
                  <Input
                    id="format"
                    value={tournament.format}
                    onChange={(e) => handleTournamentChange("format", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveTournament}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle>Jogadores</CardTitle>
              <CardDescription>Gerencie os jogadores e resultados do torneio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Adicionar Novo Jogador</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="player-name">Nome do Jogador</Label>
                    <Input
                      id="player-name"
                      value={newPlayer.name}
                      onChange={(e) => handleNewPlayerChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <CardSearch
                      label="Comandante"
                      placeholder="Buscar comandante..."
                      value={newPlayer.commander}
                      onChange={handleCommanderSelect}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <CardSearch
                      label="Parceiro (opcional)"
                      placeholder="Buscar parceiro..."
                      value={newPlayer.partner || ""}
                      onChange={handlePartnerSelect}
                    />
                  </div>
                  <div className="space-y-2">
                    <ColorSelector
                      value={newPlayer.colors}
                      onChange={(colors) => handleNewPlayerChange("colors", colors)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="decklist">Decklist (opcional)</Label>
                    <Textarea
                      id="decklist"
                      placeholder="Cole o link ou texto da decklist aqui..."
                      value={newPlayer.decklist || ""}
                      onChange={(e) => handleNewPlayerChange("decklist", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <Button onClick={handleAddPlayer}>
                  Adicionar Jogador
                </Button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Jogadores Registrados</h3>
                {tournament.players.length > 0 ? (
                  <div className="overflow-x-auto">
                    <TournamentResultsTable
                      players={tournament.players}
                      onUpdateResults={handlePlayersChange}
                      onRemovePlayer={handleRemovePlayer}
                      editable={true}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum jogador registrado ainda.</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveTournament}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
