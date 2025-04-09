"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { getCardByName, type ScryfallCard } from "@/lib/scryfall"
import { CardDetails } from "@/components/card-details"
import api from "@/service/api"
import { MostUsedCards } from "./types"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CardRanking() {
  const [searchTerm, setSearchTerm] = useState("")
  const [minPercentage, setMinPercentage] = useState(1)
  const [maxPercentage, setMaxPercentage] = useState(87)
  const [sortBy, setSortBy] = useState<"rank" | "name" | "percentage">("rank")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [mostUsedCards, setMostUsedCards] = useState<MostUsedCards[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Buscar dados dos cards quando o componente for montado
  useEffect(() => {
    const fetchCardData = async () => {
      setIsLoading(true)

      const mostUsedCards = await api.post<MostUsedCards[]>(`/cards/metrics/list`, {
        // start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        // end_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      })

      const filterList = ["Arcane Signet", "Sol Ring", "Fellwar Stone", "Fabled Passage", "Evolving Wilds"];

      const filteredCards = mostUsedCards.data.filter(
        (card) =>
          (card.type !== "Land" || card.name === "Arcane Signet") &&
          !filterList.includes(card.name)
      )

      setMostUsedCards(filteredCards)

      const cardNames = filteredCards?.map((card) => card.name)
      const cardDataMap: Record<string, ScryfallCard> = {}

      for (const name of cardNames) {
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
      setIsLoading(false)
    }

    fetchCardData()
  }, [])
  // Filter cards based on search term
  const filteredCards = mostUsedCards
    .filter(
      (card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        card.percentage >= minPercentage &&
        card.percentage <= maxPercentage,
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "percentage") {
        return b.percentage - a.percentage
      } else {
        // Default sort by rank (index)
        return mostUsedCards.indexOf(a) - mostUsedCards.indexOf(b)
      }
    })

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage)
  const currentCards = filteredCards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }
  const goToFirstPage = () => goToPage(1)
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToLastPage = () => goToPage(totalPages)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, minPercentage, maxPercentage, sortBy])
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Cards Mais Utilizados</CardTitle>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cards por nome..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "rank" | "name" | "percentage")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">Ordenar por Rank</SelectItem>
                <SelectItem value="name">Ordenar por Nome</SelectItem>
                <SelectItem value="percentage">Ordenar por Porcentagem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showFilters && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-md">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="percentage-range">
                    Porcentagem de Aparição: {minPercentage}% - {maxPercentage}%
                  </Label>
                </div>
                <div className="pt-4">
                  <Slider
                    id="percentage-range"
                    min={0}
                    max={100}
                    step={1}
                    value={[minPercentage, maxPercentage]}
                    onValueChange={(value) => {
                      setMinPercentage(value[0])
                      setMaxPercentage(value[1])
                    }}
                    className="w-full" // Adiciona largura total para garantir que a barra seja renderizada corretamente
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMinPercentage(0)
                    setMaxPercentage(100)
                    setSearchTerm("")
                    setSortBy("rank")
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentCards.map((card, index) => (
            <div
              key={card.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              onClick={() => setSelectedCard(card.name)}
            >
              <div className="flex-shrink-0 w-8 text-center font-bold text-muted-foreground">
                #{(currentPage - 1) * itemsPerPage + index + 1}
              </div>
              <Avatar className="h-12 w-12 rounded-md border">
                <AvatarImage src={cardData[card.name]?.image_uris?.small} alt={card.name} />
                <AvatarFallback className="rounded-md">{card.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-medium">{card.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {card.percentage}% dos decks
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {card.quantity} decks
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {filteredCards.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">Nenhum card encontrado com os filtros atuais.</div>
          )}

          {/* Paginação */}
          {filteredCards.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredCards.length)} de {filteredCards.length}
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
        </div>

        {/* Mostrar detalhes do card quando um card for selecionado */}
        {selectedCard && cardData[selectedCard] && (
          <CardDetails
            cardName={selectedCard}
            cardData={cardData[selectedCard]}
            onClose={() => setSelectedCard(null)}
            popularityData={{
              count: mostUsedCards.find((card) => card?.name === selectedCard)?.quantity ?? 0,
              percentage: mostUsedCards.find((card) => card?.name === selectedCard)?.percentage ?? 0,
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}