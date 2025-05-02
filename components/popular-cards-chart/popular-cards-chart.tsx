"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { CardDetails } from "@/components/card-details/card-details"
import { MostUsedCards, PopularCardData } from "./types"
import api from "@/service/api"
import { useCardFilters } from "@/app/contexts/filters-context"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <Card className="p-2 bg-background border shadow-md">
        <CardContent className="p-2">
          <p className="font-bold">{data.name}</p>
          <p>Quantidade: {data.quantity} decks</p>
          <p>Percentual: {data.percentage}% dos decks</p>
        </CardContent>
      </Card>
    )
  }
  return null
}

export function PopularCardsChart() {
  const [data, setData] = useState<MostUsedCards[]>([])
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)


  const { filters } = useCardFilters()
  useEffect(() => {
    async function fetchCardData() {
      setLoading(true)
      const { cardType, colors, cardCmc, cardName } = filters;
      const colorFilter = colors
      const mostUsedCards = await api.post<MostUsedCards[]>(`/cards/metrics/list`, {
        // start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        // end_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      })
      const filteredData = []
      for (const item of mostUsedCards.data) {
        const { cmc, name, type } = item;
        const isValid = (
          (cardName.length === 0 || !name || name.toLowerCase().includes(cardName.toLowerCase())) &&
          (cardType.length === 0 || !cardType || type.toLowerCase().includes(cardType.toLowerCase())) &&
          (
            cardCmc.length === 0 ||
            !cardCmc ||
            (
              cardCmc.length === 2 ?
                (item.cmc >= cardCmc[0] && item.cmc <= cardCmc[1]) :
                cardCmc.includes(item.cmc)
            )
          ) &&
          (colors.length === 0 || (colors.length === item.colors.length && colors.every(color => item.colors.includes(color))))
        );
        if (isValid) {
          filteredData.push(item);
        }
      }
      const filterList = ["Arcane Signet", "Sol Ring", "Fellwar Stone", "Fabled Passage", "Evolving Wilds"];

      const top10Cards = filteredData
        .filter(
          (card) =>
            (card.type !== "Land" || card.name === "Arcane Signet") &&
            !filterList.includes(card.name) &&
            card.colors.length === colorFilter.length
        )
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      setData(top10Cards)
      const cardNames = top10Cards.map((item) => item.name)

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
  }, [filters])

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
          <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} /> {/* Exibe valores como porcentagem */}
          <YAxis dataKey="name" type="category" width={90} tick={renderCustomAxisTick} interval={0} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="percentage" name="Porcentagem" fill="#60a5fa" /> {/* Usa o campo percentage */}
        </BarChart>
      </ResponsiveContainer>

      {selectedCard && (
        <CardDetails
          cardName={selectedCard}
          cardData={cardData[selectedCard]}
          onClose={() => setSelectedCard(null)}
          popularityData={data
            .filter((d) => d.name === selectedCard)
            .map((d) => ({ count: d.quantity, percentage: d.percentage }))[0]}
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
                    {card.quantity} decks
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

