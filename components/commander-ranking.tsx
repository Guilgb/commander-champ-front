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

// Mock data for commander ranking
const commanderRankingData = [
  {
    id: "1",
    name: "Yuriko, the Tiger's Shadow",
    winrate: 80,
    wins: 20,
    losses: 5,
    draws: 0,
    tournaments: 8,
    colors: "UB",
  },
  {
    id: "2",
    name: "Atraxa, Praetors' Voice",
    winrate: 69,
    wins: 18,
    losses: 7,
    draws: 1,
    tournaments: 7,
    colors: "WUBG",
  },
  {
    id: "3",
    name: "Omnath, Locus of Creation",
    winrate: 68,
    wins: 17,
    losses: 8,
    draws: 0,
    tournaments: 6,
    colors: "RGWU",
  },
  {
    id: "4",
    name: "Kaalia of the Vast",
    winrate: 64,
    wins: 16,
    losses: 9,
    draws: 0,
    tournaments: 6,
    colors: "RWB",
  },
  {
    id: "5",
    name: "Gishath, Sun's Avatar",
    winrate: 60,
    wins: 15,
    losses: 8,
    draws: 2,
    tournaments: 5,
    colors: "RGW",
  },
  {
    id: "6",
    name: "Krenko, Mob Boss",
    winrate: 56,
    wins: 14,
    losses: 11,
    draws: 0,
    tournaments: 5,
    colors: "R",
  },
  {
    id: "7",
    name: "Muldrotha, the Gravetide",
    winrate: 48,
    wins: 12,
    losses: 10,
    draws: 3,
    tournaments: 5,
    colors: "BUG",
  },
  {
    id: "8",
    name: "Talrand, Sky Summoner",
    winrate: 40,
    wins: 10,
    losses: 12,
    draws: 3,
    tournaments: 4,
    colors: "U",
  },
]

export function CommanderRanking() {
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("winrate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedCommander, setSelectedCommander] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCardData() {
      setLoading(true)
      const commanderNames = commanderRankingData.map((item) => item.name)
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
    commander.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
        comparison = a.tournaments - b.tournaments
        break
      case "name":
        comparison = a.name.localeCompare(b.name)
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
                <SelectItem value="tournaments">Torneios</SelectItem>
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
                <TableHead className="text-right">Winrate</TableHead>
                <TableHead className="text-right">V/D/E</TableHead>
                <TableHead className="text-right">Torneios</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCommanders.map((commander, index) => (
                <TableRow
                  key={commander.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedCommander(commander.name)}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {cardData[commander.name] ? (
                        <Avatar className="h-8 w-8 border-2 border-primary">
                          <AvatarImage
                            src={getCardImageUrl(cardData[commander.name], "small")}
                            alt={commander.name}
                            className="object-cover"
                          />
                          <AvatarFallback>{commander.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Skeleton className="h-8 w-8 rounded-full" />
                      )}
                      <span>{commander.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getColorBadge(commander.colors)}</TableCell>
                  <TableCell className="text-right font-medium">
                    <Badge variant={commander.winrate >= 60 ? "default" : "outline"}>{commander.winrate}%</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {commander.wins}/{commander.losses}/{commander.draws}
                  </TableCell>
                  <TableCell className="text-right">{commander.tournaments}</TableCell>
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
            winrateData={commanderRankingData.find((c) => c.name === selectedCommander)}
          />
        )}
      </CardContent>
    </Card>
  )
}

