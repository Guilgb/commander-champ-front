"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"

interface DeckCard {
  name: string
  quantity: number
  category: string
}

interface DeckListProps {
  cards: DeckCard[]
}

export function DeckList({ cards }: DeckListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Agrupar cards por categoria
  const categories = ["all", ...Array.from(new Set(cards.map((card) => card.category)))]

  // Filtrar cards com base na pesquisa e categoria
  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || card.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Ordenar cards por categoria e depois por nome
  const sortedCards = [...filteredCards].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.name.localeCompare(b.name)
  })

  // Contar cards por categoria
  const categoryCounts: Record<string, number> = { all: cards.length }
  cards.forEach((card) => {
    if (!categoryCounts[card.category]) {
      categoryCounts[card.category] = 0
    }
    categoryCounts[card.category] += card.quantity
  })

  useEffect(() => {
    async function fetchCardData() {
      setLoading(true)

      // Extrair os nomes únicos dos cards
      const cardNames = Array.from(new Set(cards.map((card) => card.name)))

      // Buscar dados dos cards no Scryfall
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
      setLoading(false)
    }

    fetchCardData()
  }, [cards])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex-shrink-0">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid grid-flow-col auto-cols-fr">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryCounts[category] || 0})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {sortedCards.map((card, index) => (
          <Card key={`${card.name}-${index}`} className="overflow-hidden">
            <div className="flex items-center p-2">
              <div className="w-8 h-8 flex-shrink-0 mr-2 relative">
                {cardData[card.name] ? (
                  <img
                    src={getCardImageUrl(cardData[card.name], "small") || "/placeholder.svg"}
                    alt={card.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <Skeleton className="w-full h-full rounded" />
                )}
                <div className="absolute top-0 left-0 bg-background/80 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {card.quantity}
                </div>
              </div>

              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium truncate">{card.name}</p>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs">
                    {card.category}
                  </Badge>
                  {cardData[card.name] && cardData[card.name].prices.usd && (
                    <span className="text-xs text-muted-foreground ml-2">${cardData[card.name].prices.usd}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sortedCards.length === 0 && (
        <div className="text-center p-4 bg-muted rounded-md">
          <p>Nenhum card encontrado com os filtros atuais.</p>
        </div>
      )}
    </div>
  )
}

