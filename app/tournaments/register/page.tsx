"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { TournamentResultsTable } from "@/components/tournament-results-table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MyDatePicker } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CardSearch } from "@/components/card-search"
import { ColorSelector } from "@/components/color-selector"
import { LoadingOverlay } from "@/components/loading-overlay"
import api from "@/service/api"
import { TournamentResponse } from "./types"

export default function RegisterTournamentPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [tournamentLink, setTournamentLink] = useState("")
  const [tournamentRounds, setTournamentsRounds] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [tournamentData, setTournamentData] = useState<TournamentResponse>()
  const [tournamentName, setTournamentName] = useState("")
  const [tournamentType, setTournamentType] = useState("presencial")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })
  const [registrationMode, setRegistrationMode] = useState("topdeck")
  const [manualPlayers, setManualPlayers] = useState<any[]>([])

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    commander: "",
    partner: "",
    position: 0,
    colors: "",
    decklist: "",
    wins: 0,
    losses: 0,
    draws: 0,
    isWinner: false,
  })

  const addPlayer = () => {
    if (!newPlayer.name || !newPlayer.commander || !newPlayer.decklist) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome do jogador e comandante são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setManualPlayers([
      ...manualPlayers,
      {
        id: `p${manualPlayers.length + 1}`,
        ...newPlayer,
      },
    ])

    setNewPlayer({
      name: "",
      commander: "",
      partner: "",
      position: 0,
      colors: "",
      decklist: "",
      wins: 0,
      losses: 0,
      draws: 0,
      isWinner: false,
    })
  }

  const removePlayer = (playerId: string) => {
    setManualPlayers(manualPlayers.filter((player) => player.id !== playerId))
  }

  const useManualPlayers = () => {
    if (manualPlayers.length < 4) {
      toast({
        title: "Jogadores insuficientes",
        description: "Adicione pelo menos 4 jogadores para criar um torneio.",
        variant: "destructive",
      })
      return
    }

    setTournamentData({
      name: tournamentName || "Commander 500 - Torneio Manual",
      date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "2023-04-15",
      endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "2023-04-15",
      location: tournamentType === "presencial" ? "Loja Mágica - São Paulo" : "Online - Discord",
      players: manualPlayers,
    })

    toast({
      title: "Torneio criado",
      description: "Os dados do torneio foram carregados com sucesso.",
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role !== "TOURNAMENT_ADMIN" && user?.role !== "ADMIN") {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para registrar resultados de torneios.",
          variant: "destructive",
        })
        router.push("/")
      }
    } else {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado como administrador de torneios para registrar resultados.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [isAuthenticated, user, router, toast])

  const handleFetchTournament = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tournamentLink) {
      toast({
        title: "Link vazio",
        description: "Por favor, insira um link de torneio válido.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const loadTournament = await api.post(`/tournaments/load-decks`, {
        url: tournamentLink,
        rounds: tournamentRounds,
      })

      const playersWithWinnerProperty = loadTournament.data.players.map((player: any) => ({
        ...player,
        isWinner: player.isWinner || false
      }))

      const updatedTournamentData = {
        ...loadTournament.data,
        players: playersWithWinnerProperty
      }

      setTournamentData(updatedTournamentData)
      setIsLoading(false)
      toast({
        title: "Torneio carregado",
        description: "Os dados do torneio foram carregados com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao carregar torneio",
        description: "Não foi possível carregar os dados do torneio. Tente novamente. Se o erro persistir, tente de maneira manual.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSaveTournament = async () => {
    try {
      if (!tournamentLink) {
        setIsLoading(true)
        toast({
          title: "Link do torneio obrigatório",
          description: "Por favor, insira um link válido para o torneio.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const playersWithPosition = tournamentData?.players.map(player => ({
        ...player,
        position: player.position ?? 0,
      })) || []

      const response = await api.post(`/tournaments/`, {
        name: tournamentName,
        type: tournamentType,
        start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        end_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        link: tournamentLink,
        user_id: Number(user?.id),
        online: tournamentType,
        format: "EDH",
        registration_mode: registrationMode,
        rounds: tournamentRounds,
        players: playersWithPosition
      })
      if (response.status !== 201) {
        toast({
          title: "Erro ao carregar torneio",
          description: "Não foi possível carregar os dados do torneio. Tente novamente.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    } catch (error) {
      toast({
        title: "Torneio não salvo",
        description: "Os dados do torneio não foram carregados com sucesso.",
      })
    }
    setIsLoading(true)

    const allPlayersHaveResults = tournamentData?.players.every(
      (player: any) => player.wins > 0 || player.losses > 0 || player.draws > 0,
    )

    const winnerCount = tournamentData?.players.filter((player: any) => player.isWinner).length
    const hasOneWinner = winnerCount === 1

    if (!allPlayersHaveResults) {
      toast({
        title: "Resultados incompletos",
        description: "Por favor, preencha os resultados para todos os jogadores.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!hasOneWinner) {
      toast({
        title: "Campeão não definido",
        description: "Por favor, selecione exatamente um jogador como campeão.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)

    toast({
      title: "Torneio registrado",
      description: "Os resultados do torneio foram registrados com sucesso.",
    })

    router.push("/metrics")
  }

  if (!isAuthenticated || (user?.role !== "TOURNAMENT_ADMIN" && user?.role !== "ADMIN")) {
    return null
  }

  const handleCommanderSelect = (name: string, cardData?: any) => {
    let colors = newPlayer.colors

    if (cardData) {
      colors = cardData.color_identity?.join("") || ""
    }

    setNewPlayer({
      ...newPlayer,
      commander: name,
      colors: colors,
    })
  }

  const handlePartnerSelect = (name: string, cardData?: any) => {
    let colors = newPlayer.colors

    if (cardData) {
      const currentColors = new Set(newPlayer.colors.split(""))
      const partnerColors = cardData.color_identity || []

      partnerColors.forEach((color: string) => currentColors.add(color))
      colors = Array.from(currentColors).join("")
    }

    setNewPlayer({
      ...newPlayer,
      partner: name,
      colors: colors,
    })
  }

  return (
    <div className="space-y-6">
      {isLoading && <LoadingOverlay message="Salvando dados do torneio..." />}
      <h1 className="text-3xl font-bold">Registrar Resultados de Torneio</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Torneio</CardTitle>
          <CardDescription>Preencha os dados do torneio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Modo de Registro</Label>
              <RadioGroup value={registrationMode} onValueChange={setRegistrationMode} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="topdeck" id="topdeck" />
                  <Label htmlFor="topdeck" className="cursor-pointer">
                    Via TopDeck.gg
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual" className="cursor-pointer">
                    Registro Manual
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="tournament-name">Nome do Torneio</Label>
              <Input
                id="tournament-name"
                placeholder="Commander 500 - Torneio Mensal"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Torneio</Label>
              <RadioGroup value={tournamentType} onValueChange={setTournamentType} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="presencial" id="presencial" />
                  <Label htmlFor="presencial" className="cursor-pointer">
                    Presencial
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="cursor-pointer">
                    Online
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data do Torneio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange?.from && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    "Selecionar data do torneio"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <MyDatePicker
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                />
              </PopoverContent>
            </Popover>
          </div>

          {registrationMode === "topdeck" ? (
            <div className="space-y-2">
              <Label htmlFor="tournament-link">Link do Torneio</Label>
              <Input
                id="tournament-link"
                placeholder="https://topdeck.gg/tournaments/..."
                value={tournamentLink}
                onChange={(e) => setTournamentLink(e.target.value)}
              />
              <Label htmlFor="tournament-rounds">Numero de Rodadas</Label>
              <Input
                id="tournament-rounds"
                type="number"
                min="0"
                value={tournamentRounds}
                onChange={(e) => setTournamentsRounds(Number(e.target.value))}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="tournament-link">Link do Torneio</Label>
              <Input
                id="tournament-link"
                placeholder="https://topdeck.gg/tournaments/..."
                value={tournamentLink}
                onChange={(e) => setTournamentLink(e.target.value)}
              />
              <Label htmlFor="tournament-rounds">Numero de Rodadas</Label>
              <Input
                id="tournament-rounds"
                type="number"
                min="0"
                value={tournamentRounds}
                onChange={(e) => setTournamentsRounds(Number(e.target.value))}
              />
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Adicionar Jogadores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="player-name">Nome do Jogador*</Label>
                    <Input
                      id="player-name"
                      placeholder="Nome do jogador"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player-position">Posição*</Label>
                    <Input
                      id="player-position"
                      type="number"
                      min="0"
                      value={newPlayer.position}
                      onChange={(e) => setNewPlayer({ ...newPlayer, position: Number(e.target.value) })}
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
                      value={newPlayer.partner}
                      onChange={handlePartnerSelect}
                    />
                  </div>
                  <div className="space-y-2">
                    <ColorSelector
                      value={newPlayer.colors}
                      onChange={(colors) => setNewPlayer({ ...newPlayer, colors })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player-wins">Vitórias</Label>
                    <Input
                      id="player-wins"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newPlayer.wins}
                      onChange={(e) => setNewPlayer({ ...newPlayer, wins: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player-losses">Derrotas</Label>
                    <Input
                      id="player-losses"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newPlayer.losses}
                      onChange={(e) => setNewPlayer({ ...newPlayer, losses: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="player-draws">Empates</Label>
                    <Input
                      id="player-draws"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newPlayer.draws}
                      onChange={(e) => setNewPlayer({ ...newPlayer, draws: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 h-full pt-6">
                      <Checkbox
                        id="player-winner"
                        checked={newPlayer.isWinner}
                        onCheckedChange={(checked) => setNewPlayer({ ...newPlayer, isWinner: checked as boolean })}
                      />
                      <Label htmlFor="player-winner">Campeão</Label>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="player-decklist">Decklist*</Label>
                    <Textarea
                      id="player-decklist"
                      placeholder="Cole a decklist aqui..."
                      value={newPlayer.decklist}
                      onChange={(e) => setNewPlayer({ ...newPlayer, decklist: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <Button onClick={addPlayer}>Adicionar Jogador</Button>
              </div>

              {manualPlayers.length > 0 && (
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Jogadores Adicionados ({manualPlayers.length})</h3>
                  <div className="space-y-4">
                    {manualPlayers.map((player) => (
                      <div key={player.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Comandante: {player.commander}
                            {player.partner && ` / Parceiro: ${player.partner}`}
                          </p>
                          <p className="text-sm text-muted-foreground">Cores: {player.colors || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">
                            Resultados: {player.wins}W / {player.losses}L / {player.draws}D
                            {player.isWinner && " • Campeão"}
                          </p>
                          {player.decklist && (
                            <details className="mt-1">
                              <summary className="text-sm cursor-pointer hover:text-primary">Ver decklist</summary>
                              <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-auto max-h-[200px]">
                                {player.decklist}
                              </pre>
                            </details>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removePlayer(player.id)}>
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          {registrationMode === "topdeck" ? (
            <Button onClick={handleFetchTournament} disabled={isLoading}>
              {isLoading ? "Carregando..." : "Carregar Dados do Torneio"}
            </Button>
          ) : (
            <Button onClick={useManualPlayers} disabled={manualPlayers.length < 4}>
              {isLoading ? "Carregando..." : "Criar Torneio"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {tournamentData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{tournamentData.name}</CardTitle>
              <CardDescription>
                Data: {dateRange?.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : tournamentData.date} •
                Local: {tournamentData.location} • Tipo: {tournamentType === "presencial" ? "Presencial" : "Online"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TournamentResultsTable
                players={tournamentData.players.map(player => ({
                  ...player,
                  position: player.position ?? 0,
                }))}
                onUpdateResults={(updatedPlayers) => {
                  const newWinner = updatedPlayers.find(player => player.isWinner);
                  const prevWinner = tournamentData.players.find(player => player.isWinner);
                  if (newWinner && (!prevWinner || newWinner.id !== prevWinner.id)) {
                    updatedPlayers = updatedPlayers.map(player => ({
                      ...player,
                      isWinner: player.id === newWinner.id
                    }));
                  }
                  setTournamentData({
                    ...tournamentData,
                    players: updatedPlayers.map((player) => ({
                      ...player,
                      decklist: player.decklist || "",
                    })),
                  })
                }}
              />
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  setIsLoading(true)
                  handleSaveTournament().finally(() => setIsLoading(false))
                }}
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Resultados"}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}