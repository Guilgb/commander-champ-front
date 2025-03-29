"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, MapPin, Users, Trophy, Medal, Info } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface UserTournamentsProps {
  userId: string
}

// Mock data para torneios do usuário
const mockUserTournaments = [
  {
    id: "1",
    name: "Commander 500 - Torneio Mensal Abril",
    date: "15/04/2023",
    location: "Loja Mágica - São Paulo",
    type: "presencial",
    players: 16,
    position: 1,
    commander: "Yuriko, the Tiger's Shadow",
    wins: 4,
    losses: 0,
    draws: 0,
    commanderImage: "https://cards.scryfall.io/small/front/7/5/75c31c0b-e8ff-4abc-a173-c8be1819447a.jpg",
  },
  {
    id: "2",
    name: "Commander 500 - Campeonato Regional",
    date: "01/05/2023",
    location: "Centro de Eventos - Rio de Janeiro",
    type: "presencial",
    players: 32,
    position: 4,
    commander: "Atraxa, Praetors' Voice",
    wins: 3,
    losses: 1,
    draws: 0,
    commanderImage: "https://cards.scryfall.io/small/front/d/0/d0d33d52-3d28-4635-b985-51e126289259.jpg",
  },
  {
    id: "3",
    name: "Commander 500 - Torneio Beneficente",
    date: "10/05/2023",
    location: "Clube de Cartas - Belo Horizonte",
    type: "presencial",
    players: 24,
    position: 8,
    commander: "Muldrotha, the Gravetide",
    wins: 2,
    losses: 2,
    draws: 0,
    commanderImage: "https://cards.scryfall.io/small/front/c/6/c654737d-34ac-42ff-ae27-3a3bbb930fc1.jpg",
  },
  {
    id: "4",
    name: "Commander 500 - Torneio Online",
    date: "20/03/2023",
    location: "Online - Discord",
    type: "online",
    players: 24,
    position: 2,
    commander: "Gishath, Sun's Avatar",
    wins: 3,
    losses: 1,
    draws: 0,
    commanderImage: "https://cards.scryfall.io/small/front/7/3/7335e500-342d-476d-975c-817512e6e3d6.jpg",
  },
  {
    id: "5",
    name: "Commander 500 - Torneio Mensal Maio",
    date: "15/05/2023",
    location: "Loja Mágica - São Paulo",
    type: "presencial",
    players: 16,
    position: 3,
    commander: "Yuriko, the Tiger's Shadow",
    wins: 3,
    losses: 1,
    draws: 0,
    commanderImage: "https://cards.scryfall.io/small/front/7/5/75c31c0b-e8ff-4abc-a173-c8be1819447a.jpg",
  },
]

export function UserTournaments({ userId }: UserTournamentsProps) {
  const [tournaments, setTournaments] = useState(mockUserTournaments)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Filtrar torneios com base nos critérios
  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.commander.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || tournament.type === typeFilter

    return matchesSearch && matchesType
  })

  // Ordenar torneios
  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.date.split("/").reverse().join("-")).getTime() -
        new Date(a.date.split("/").reverse().join("-")).getTime()
      )
    } else if (sortBy === "position") {
      return a.position - b.position
    } else if (sortBy === "wins") {
      return b.wins - a.wins
    }
    return 0
  })

  // Calcular estatísticas
  const totalTournaments = tournaments.length
  const totalWins = tournaments.reduce((sum, t) => sum + t.wins, 0)
  const totalLosses = tournaments.reduce((sum, t) => sum + t.losses, 0)
  const totalDraws = tournaments.reduce((sum, t) => sum + t.draws, 0)
  const winrate = totalWins + totalLosses > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0
  const championships = tournaments.filter((t) => t.position === 1).length
  const top4s = tournaments.filter((t) => t.position <= 4).length
  const top8s = tournaments.filter((t) => t.position <= 8).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Torneios</p>
              <p className="text-2xl font-bold">{totalTournaments}</p>
            </div>
            <Trophy className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Winrate</p>
              <p className="text-2xl font-bold">{winrate}%</p>
              <p className="text-xs text-muted-foreground">
                {totalWins}W-{totalLosses}L-{totalDraws}D
              </p>
            </div>
            <Medal className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Campeonatos</p>
              <p className="text-2xl font-bold">{championships}</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Top 8s</p>
              <p className="text-2xl font-bold">{top8s}</p>
              <p className="text-xs text-muted-foreground">Top 4: {top4s}</p>
            </div>
            <Medal className="h-8 w-8 text-blue-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar torneios..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="position">Posição</SelectItem>
              <SelectItem value="wins">Vitórias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Torneios</CardTitle>
          <CardDescription>Seus resultados em torneios do Commander 500</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Torneio</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Comandante</TableHead>
                  <TableHead className="text-center">Posição</TableHead>
                  <TableHead className="text-center">Resultado</TableHead>
                  <TableHead className="text-center">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tournament.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {tournament.location}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {tournament.players} jogadores
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {tournament.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-sm">
                          <AvatarImage src={tournament.commanderImage} alt={tournament.commander} />
                          <AvatarFallback>{tournament.commander.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{tournament.commander}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          tournament.position === 1
                            ? "default"
                            : tournament.position <= 4
                              ? "secondary"
                              : tournament.position <= 8
                                ? "outline"
                                : "outline"
                        }
                      >
                        {tournament.position === 1
                          ? "Campeão"
                          : tournament.position === 2
                            ? "2º lugar"
                            : tournament.position === 3
                              ? "3º lugar"
                              : tournament.position === 4
                                ? "4º lugar"
                                : tournament.position <= 8
                                  ? "Top 8"
                                  : `${tournament.position}º lugar`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">
                        {tournament.wins}W-{tournament.losses}L-{tournament.draws}D
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/tournaments/${tournament.id}`}>
                                <Info className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver detalhes do torneio</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {sortedTournaments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhum torneio encontrado com os filtros atuais.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setTypeFilter("all")
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

