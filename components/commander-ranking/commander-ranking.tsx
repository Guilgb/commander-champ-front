"use client"

import { useState, useEffect, useContext } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SlidersHorizontal } from "lucide-react"
import { CommanderDetails } from "@/components/commander-details"
import { CommanderRankingResponse } from "./types"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import api from "@/service/api"
import { useCommanderFilters } from "@/app/contexts/filters-context"

export function CommanderRanking() {
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("winrate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedCommander, setSelectedCommander] = useState<string | null>(null)
  const [commanderRankingData, setCommanderRanking] = useState<CommanderRankingResponse[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [minWinrate, setMinWinrate] = useState(0)
  const [maxWinrate, setMaxWinrate] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    api.post(`/decks/statistics/commander-winrate`)
      .then((response) => {
        if (response.status !== 201) {
          throw new Error("Erro ao carregar o winrate dos comandantes");
        }

        const data = response.data.map((tournament: CommanderRankingResponse) => ({
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
        setCommanderRanking(data);
      })
      .catch((error) => {
        console.error("Erro ao carregar dados de torneios:", error);
      });
  }, []);

  useEffect(() => {
    if (commanderRankingData.length === 0) return;

    async function fetchCardData() {
      setLoading(true);
      const commanderNames = commanderRankingData.map((item) => item.commander);
      const cardDataMap: Record<string, ScryfallCard> = {};

      for (const commander of commanderNames) {
        try {
          const card = await getCardByName(commander);
          if (card) {
            cardDataMap[commander] = card;
          }
        } catch (error) {
          console.error(`Error fetching data for ${commander}:`, error);
        }
      }

      setCardData(cardDataMap);
      setLoading(false);
    }

    fetchCardData();
  }, [commanderRankingData]);

  const filteredCommanders = commanderRankingData.filter(
    (commander) =>
      commander.commander.toLowerCase().includes(searchTerm.toLowerCase()) &&
      commander.winrate >= minWinrate &&
      commander.winrate <= maxWinrate,
  )

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

  const totalPages = Math.ceil(sortedCommanders.length / itemsPerPage)
  const currentCommanders = sortedCommanders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => goToPage(1)
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToLastPage = () => goToPage(totalPages)


  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, minWinrate, maxWinrate, sortBy, sortOrder])


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

  const top10Commanders = commanderRankingData
    .filter((commander) => commander.entries > 0) // Filtra comandantes com entradas válidas
    .sort((a, b) => b.winrate - a.winrate) // Ordena pelo maior winrate
    .slice(0, 10) // Pega os 10 primeiros

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as "winrate" | "wins" | "tournaments" | "name")}
            >
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

        {showFilters && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-md mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="winrate-range">
                  Winrate: {minWinrate}% - {maxWinrate}%
                </Label>
              </div>
              <div className="pt-4">
                <Slider
                  id="winrate-range"
                  min={0}
                  max={100}
                  step={1}
                  value={[minWinrate, maxWinrate]}
                  onValueChange={(value) => {
                    setMinWinrate(value[0])
                    setMaxWinrate(value[1])
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMinWinrate(0)
                  setMaxWinrate(100)
                  setSearchTerm("")
                  setSortBy("winrate")
                  setSortOrder("desc")
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}

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
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-12 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : top10Commanders.length > 0 ? (
                top10Commanders.map((commander, index) => (
                  <TableRow
                    key={commander.id}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setSelectedCommander(commander.commander)}
                  >
                    <TableCell className="font-medium">#{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nenhum comandante encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {sortedCommanders.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, sortedCommanders.length)} de {sortedCommanders.length}
              </span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                title="Primeira página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="mx-2 text-sm">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToLastPage}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Mostrar detalhes do comandante quando um comandante for selecionado */}
        {selectedCommander && cardData[selectedCommander] && (
          <CommanderDetails
            commanderName={selectedCommander}
            cardData={cardData[selectedCommander]}
            onClose={() => setSelectedCommander(null)}
            winrateData={top10Commanders.find((c) => c.commander === selectedCommander)}
          />
        )}
      </CardContent>
    </Card>
  )
}

