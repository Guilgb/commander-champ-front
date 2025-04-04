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

// Adicionar os novos imports
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import api from "@/service/api"

// Atualizar o componente RegisterTournamentPage
export default function RegisterTournamentPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [tournamentLink, setTournamentLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tournamentData, setTournamentData] = useState<any>(null)

  // Adicionar novos estados para os campos solicitados
  const [tournamentName, setTournamentName] = useState("")
  const [tournamentType, setTournamentType] = useState("presencial")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })

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

    // const response = await api.post(`/tournaments/`, {
    //   name: tournamentName,
    //   type: tournamentType,
    //   start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    //   end_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    //   link: tournamentLink,
    //   user_id: Number(user?.id),
    //   online: tournamentType,
    //   format: "EDH",
    // })
    // if (response.status !== 201) {
    //   toast({
    //     title: "Erro ao carregar torneio",
    //     description: "Não foi possível carregar os dados do torneio. Tente novamente.",
    //     variant: "destructive",
    //   })
    //   setIsLoading(false)
    //   return
    // }

    // if(response.data.id) {
    //   console.log("Tournament ID:", response.data.id)
    //   const saveDecks = await api.post(`/decks/save`, {
    //     url: tournamentLink,
    //     tournament_id: response.data.id,
    //   })
    //   if (saveDecks.status !== 201) {
    //     toast({
    //       title: "Erro ao carregar torneio",
    //       description: "Não foi possível carregar os dados do torneio. Tente novamente.",
    //       variant: "destructive",
    //     })
    //     setIsLoading(false)
    //     return
    //   }
    // }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock tournament data
    const tournamentData = await api.post(`/tournaments/load-decks`, {
      tournament_id: 31,
    })

    console.log(tournamentData.data)
    setTournamentData(tournamentData.data)
    setIsLoading(false)

    toast({
      title: "Torneio carregado",
      description: "Os dados do torneio foram carregados com sucesso.",
    })
  }

  const handleSaveTournament = async () => {
    console.log(tournamentData)
    setIsLoading(true)

    // Validate that all players have results
    const allPlayersHaveResults = tournamentData.players.every(
      (player: any) => player.wins > 0 || player.losses > 0 || player.draws > 0,
    )

    // Check if exactly one player is marked as winner
    const winnerCount = tournamentData.players.filter((player: any) => player.isWinner).length
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

    // Simulate API call to save tournament results
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Registrar Resultados de Torneio</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Torneio</CardTitle>
          <CardDescription>Preencha os dados do torneio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo: Nome do torneio */}
            <div className="space-y-2">
              <Label htmlFor="tournament-name">Nome do Torneio</Label>
              <Input
                id="tournament-name"
                placeholder="Commander 500 - Torneio Mensal"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
              />
            </div>

            {/* Campo: Tipo de torneio (Presencial ou Online) */}
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

          {/* Campo: Data de início e fim */}
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
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tournament-link">Link do Torneio</Label>
            <Input
              id="tournament-link"
              placeholder="https://topdeck.gg/tournaments/..."
              value={tournamentLink}
              onChange={(e) => setTournamentLink(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleFetchTournament} disabled={isLoading}>
            {isLoading ? "Carregando..." : "Carregar Dados do Torneio"}
          </Button>
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
                players={tournamentData.players}
                onUpdateResults={(updatedPlayers) => {
                  setTournamentData({
                    ...tournamentData,
                    players: updatedPlayers,
                  })
                }}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveTournament} disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Resultados"}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

