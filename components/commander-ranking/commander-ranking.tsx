"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"
import { CommanderDetails } from "@/components/commander-details"
import { CommanderRankingResponse } from "./types"
import api from "@/service/api"

export function CommanderRanking() {
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("winrate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedCommander, setSelectedCommander] = useState<string | null>(null)
  const [commanderRankingData, setCommanderRanking] = useState<CommanderRankingResponse[]>([])

  useEffect(() => {
    api.post(`/decks/statistics/commander-winrate`)
      .then((response) => {
        if (response.status !== 201) {
          throw new Error("Erro ao carregar o winrate dos comandantes");
        }
        setCommanderRanking(
          response.data.map((tournament: CommanderRankingResponse) => ({
            id: tournament.id,
            commander: tournament.commander,
            winrate: tournament.winrate,
            wins: tournament.wins,
            losses: tournament.losses,
            draws: tournament.draws,
            entries: tournament.entries,
            colors: tournament.colors,
            partner: tournament.partner,
          }))
        );
      })
      .catch((error) => {
        console.error("Erro ao carregar dados de torneios:", error);
      });
  }, []);

  useEffect(() => {
    async function fetchCardData() {
      setLoading(true)
      const commanderNames = commanderRankingData.map((item) => item.commander)
      const cardDataMap: Record<string, ScryfallCard> = {}

      for (const name of commanderNames) {
        try {
          const card = await getCardByName(name)
          if (card) {
            cardDataMap[name] = card
          }
        } catch (error) {
          console.error(`Error fetching data for ${name}:`, error)
        }
      }

      setCardData(cardDataMap)
      setLoading(false)
    }

    fetchCardData()
  }, [])

  // Filter commanders based on search term
  const filteredCommanders = commanderRankingData.filter((commander) =>
    commander.commander.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort commanders based on selected criteria
  const sortedCommanders = [...filteredCommanders].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "winrate":
        comparison = a.winrate - b.winrate
        break
      case "wins":
        comparison = a.wins - b.wins
        break
      case "tournaments":
        comparison = a.entries - b.entries
        break
      case "name":
        comparison = a.commander.localeCompare(b.commander)
        break
      default:
        comparison = a.winrate - b.winrate
    }

    return sortOrder === "desc" ? -comparison : comparison
  })

  // Function to get color badge for commander
  const getColorBadge = (colors: string) => {
    const colorMap: Record<string, string> = {
      W: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      U: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      B: "bg-gray-800 text-gray-100 dark:bg-gray-900 dark:text-gray-100",
      R: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      G: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    }

    return (
      <div className="flex gap-1">
        {colors.split("").map((color) => (
          <Badge key={color} variant="outline" className={`${colorMap[color] || ""}`}>
            {color}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking de Comandantes por Winrate</CardTitle>
        <CardDescription>Classificação dos comandantes com melhor desempenho em torneios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comandante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="winrate">Winrate</SelectItem>
                <SelectItem value="wins">Vitórias</SelectItem>
                <SelectItem value="tournaments">Entradas</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ordem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Decrescente</SelectItem>
                <SelectItem value="asc">Crescente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Comandante</TableHead>
                <TableHead>Cores</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead className="text-right">Winrate</TableHead>
                <TableHead className="text-right">V/D/E</TableHead>
                <TableHead className="text-right">Entradas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCommanders.map((commander, index) => (
                <TableRow
                  key={commander.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedCommander(commander.commander)}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {cardData[commander.commander] ? (
                        <Avatar className="h-8 w-8 border-2 border-primary">
                          <AvatarImage
                            src={getCardImageUrl(cardData[commander.commander], "small")}
                            alt={commander.commander}
                            className="object-cover"
                          />
                          <AvatarFallback>{commander.commander.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Skeleton className="h-8 w-8 rounded-full" />
                      )}
                      <span>{commander.commander}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getColorBadge(commander.colors)}</TableCell>
                  <TableCell>
                    {commander.partner ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <span>Partner com</span>
                          <span className="font-semibold">{commander.partner}</span>
                        </Badge>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <Badge variant={commander.winrate >= 60 ? "default" : "outline"}>{commander.winrate}%</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {commander.wins}/{commander.losses}/{commander.draws}
                  </TableCell>
                  <TableCell className="text-right">{commander.entries}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mostrar detalhes do comandante quando um comandante for selecionado */}
        {selectedCommander && cardData[selectedCommander] && (
          <CommanderDetails
            commanderName={selectedCommander}
            cardData={cardData[selectedCommander]}
            onClose={() => setSelectedCommander(null)}
            winrateData={commanderRankingData.find((c) => c.commander === selectedCommander)}
          />
        )}
      </CardContent>
    </Card>
  )
}

