"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { CardDetails } from "@/components/card-details"

// Tipo para os dados de cards populares
interface PopularCardData {
  id: string
  name: string
  count: number
  percentage: number
}

// Mock data for popular cards
const mockData: PopularCardData[] = [
  {
    id: "1",
    name: "Swords to Plowshares",
    count: 45,
    percentage: 75,
  },
  {
    id: "2",
    name: "Counterspell",
    count: 38,
    percentage: 63,
  },
  {
    id: "3",
    name: "Cultivate",
    count: 42,
    percentage: 70,
  },
  {
    id: "4",
    name: "Lightning Bolt",
    count: 36,
    percentage: 60,
  },
  {
    id: "5",
    name: "Demonic Tutor",
    count: 30,
    percentage: 50,
  },
  {
    id: "6",
    name: "Arcane Signet",
    count: 52,
    percentage: 87,
  },
  {
    id: "7",
    name: "Command Tower",
    count: 58,
    percentage: 97,
  },
  {
    id: "8",
    name: "Path to Exile",
    count: 40,
    percentage: 67,
  },
  {
    id: "9",
    name: "Cyclonic Rift",
    count: 32,
    percentage: 53,
  },
  {
    id: "10",
    name: "Farseek",
    count: 39,
    percentage: 65,
  },
]

// Componente personalizado para o tooltip do gráfico
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <Card className="p-2 bg-background border shadow-md">
        <CardContent className="p-2">
          <p className="font-bold">{data.name}</p>
          <p>Quantidade: {data.count} decks</p>
          <p>Percentual: {data.percentage}% dos decks</p>
        </CardContent>
      </Card>
    )
  }
  return null
}

export function PopularCardsChart() {
  const [data, setData] = useState(mockData)
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  useEffect(() => {
    // Em uma aplicação real, você buscaria os dados de cards populares da API
    // e então buscaria os dados dos cards do Scryfall

    async function fetchCardData() {
      setLoading(true)

      // Extrair os nomes dos cards
      const cardNames = data.map((item) => item.name)

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
  }, [data])

  // Função para renderizar o rótulo do eixo Y com imagens
  const renderCustomAxisTick = (props: any) => {
    const { x, y, payload } = props
    const cardName = payload.value
    const card = cardData[cardName]

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject width={40} height={40} x={-45} y={-20}>
          {card ? (
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={getCardImageUrl(card, "small")} alt={cardName} className="object-cover" />
              <AvatarFallback>{cardName.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="h-10 w-10 rounded-full" />
          )}
        </foreignObject>
      </g>
    )
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 100,
            bottom: 5,
          }}
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload[0]) {
              setSelectedCard(data.activePayload[0].payload.name)
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={90} tick={renderCustomAxisTick} interval={0} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="count" name="Quantidade" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>

      {selectedCard && (
        <CardDetails
          cardName={selectedCard}
          cardData={cardData[selectedCard]}
          onClose={() => setSelectedCard(null)}
          popularityData={data.find((d) => d.name === selectedCard)}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((card) => (
          <Card
            key={card.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedCard(card.name)}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              {cardData[card.name] ? (
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage
                    src={getCardImageUrl(cardData[card.name], "small")}
                    alt={card.name}
                    className="object-cover"
                  />
                  <AvatarFallback>{card.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <Skeleton className="h-12 w-12 rounded-full" />
              )}
              <div>
                <p className="font-medium text-sm line-clamp-1">{card.name}</p>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="text-xs">
                    {card.percentage}%
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {card.count} decks
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

