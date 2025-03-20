"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { getCardByName, type ScryfallCard } from "@/lib/scryfall"
import { CardDetails } from "@/components/card-details"

// Mock data for most used cards
const mostUsedCards = [
  {
    id: "1",
    name: "Command Tower",
    percentage: 97,
    count: 58,
    imageUrl: "https://cards.scryfall.io/small/front/7/8/78a179b6-41a8-4e2e-a73e-98bb1b597f25.jpg",
  },
  {
    id: "2",
    name: "Arcane Signet",
    percentage: 87,
    count: 52,
    imageUrl: "https://cards.scryfall.io/small/front/5/b/5b245a5b-c20a-4035-9143-b5ef6f784b35.jpg",
  },
  {
    id: "3",
    name: "Swords to Plowshares",
    percentage: 75,
    count: 45,
    imageUrl: "https://cards.scryfall.io/small/front/f/5/f51f8b98-6f8e-4fba-9b1d-fc0be0ce5732.jpg",
  },
  {
    id: "4",
    name: "Cultivate",
    percentage: 70,
    count: 42,
    imageUrl: "https://cards.scryfall.io/small/front/6/d/6d204fda-c4c4-456c-900a-a67fa9ce3b5d.jpg",
  },
  {
    id: "5",
    name: "Path to Exile",
    percentage: 67,
    count: 40,
    imageUrl: "https://cards.scryfall.io/small/front/6/2/624d9708-1047-4f7d-a1a4-5a1cf63ce595.jpg",
  },
  {
    id: "6",
    name: "Farseek",
    percentage: 65,
    count: 39,
    imageUrl: "https://cards.scryfall.io/small/front/3/d/3dbd7f11-01d2-4bb1-9f49-dd72d1afb3e5.jpg",
  },
  {
    id: "7",
    name: "Counterspell",
    percentage: 63,
    count: 38,
    imageUrl: "https://cards.scryfall.io/small/front/1/b/1b73577a-8ca1-41d7-9b2b-7300286fde43.jpg",
  },
  {
    id: "8",
    name: "Lightning Bolt",
    percentage: 60,
    count: 36,
    imageUrl: "https://cards.scryfall.io/small/front/f/2/f29ba16f-c8fb-42fe-aabf-87089cb214a7.jpg",
  },
  {
    id: "9",
    name: "Cyclonic Rift",
    percentage: 53,
    count: 32,
    imageUrl: "https://cards.scryfall.io/small/front/f/f/ff08e5ed-f47b-4d8e-8b8b-41675dccef8b.jpg",
  },
  {
    id: "10",
    name: "Demonic Tutor",
    percentage: 50,
    count: 30,
    imageUrl: "https://cards.scryfall.io/small/front/3/b/3bdbc231-5316-4abd-9d8d-d87cff2c9847.jpg",
  },
]

export function CardRanking() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Buscar dados dos cards quando o componente for montado
  useEffect(() => {
    const fetchCardData = async () => {
      setIsLoading(true)
      const cardNames = mostUsedCards.map((card) => card.name)
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
  const filteredCards = mostUsedCards.filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Cards Mais Utilizados</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cards..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCards.map((card, index) => (
            <div
              key={card.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              onClick={() => setSelectedCard(card.name)}
            >
              <div className="flex-shrink-0 w-8 text-center font-bold text-muted-foreground">#{index + 1}</div>
              <Avatar className="h-12 w-12 rounded-md border">
                <AvatarImage src={card.imageUrl} alt={card.name} />
                <AvatarFallback className="rounded-md">{card.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-medium">{card.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {card.percentage}% dos decks
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {card.count} decks
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {filteredCards.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              Nenhum card encontrado com o termo "{searchTerm}"
            </div>
          )}
        </div>

        {/* Mostrar detalhes do card quando um card for selecionado */}
        {selectedCard && cardData[selectedCard] && (
          <CardDetails
            cardName={selectedCard}
            cardData={cardData[selectedCard]}
            onClose={() => setSelectedCard(null)}
            popularityData={mostUsedCards.find((card) => card.name === selectedCard)}
          />
        )}
      </CardContent>
    </Card>
  )
}

