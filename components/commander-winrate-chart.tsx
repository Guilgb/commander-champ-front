"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { CommanderDetails } from "@/components/commander-details"

// Tipo para os dados de winrate do comandante
interface CommanderWinrateData {
  id: string
  name: string
  wins: number
  losses: number
  draws: number
  winrate: number
  colors: string
}

// Mock data for commander winrates
const mockData: CommanderWinrateData[] = [
  {
    id: "1",
    name: "Gishath, Sun's Avatar",
    wins: 15,
    losses: 8,
    draws: 2,
    winrate: 60,
    colors: "RGW",
  },
  {
    id: "2",
    name: "Atraxa, Praetors' Voice",
    wins: 18,
    losses: 7,
    draws: 1,
    winrate: 69,
    colors: "WUBG",
  },
  {
    id: "3",
    name: "Muldrotha, the Gravetide",
    wins: 12,
    losses: 10,
    draws: 3,
    winrate: 48,
    colors: "BUG",
  },
  {
    id: "4",
    name: "Yuriko, the Tiger's Shadow",
    wins: 20,
    losses: 5,
    draws: 0,
    winrate: 80,
    colors: "UB",
  },
  {
    id: "5",
    name: "Krenko, Mob Boss",
    wins: 14,
    losses: 11,
    draws: 0,
    winrate: 56,
    colors: "R",
  },
  {
    id: "6",
    name: "Talrand, Sky Summoner",
    wins: 10,
    losses: 12,
    draws: 3,
    winrate: 40,
    colors: "U",
  },
  {
    id: "7",
    name: "Kaalia of the Vast",
    wins: 16,
    losses: 9,
    draws: 0,
    winrate: 64,
    colors: "RWB",
  },
  {
    id: "8",
    name: "Omnath, Locus of Creation",
    wins: 17,
    losses: 8,
    draws: 0,
    winrate: 68,
    colors: "RGWU",
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
          <p>Vitórias: {data.wins}</p>
          <p>Derrotas: {data.losses}</p>
          <p>Empates: {data.draws}</p>
          <p className="font-semibold">Winrate: {data.winrate}%</p>
        </CardContent>
      </Card>
    )
  }
  return null
}

export function CommanderWinrateChart() {
  const [data, setData] = useState(mockData)
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [selectedCommander, setSelectedCommander] = useState<string | null>(null)

  useEffect(() => {
    // Em uma aplicação real, você buscaria os dados de winrate da API
    // e então buscaria os dados dos cards do Scryfall

    async function fetchCardData() {
      setLoading(true)

      // Extrair os nomes dos comandantes
      const commanderNames = data.map((item) => item.name)

      // Buscar dados dos cards no Scryfall
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
  }, [data])

  // Função para renderizar o rótulo do eixo X com imagens
  const renderCustomAxisTick = (props: any) => {
    const { x, y, payload } = props
    const commanderName = payload.value
    const card = cardData[commanderName]

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject width={40} height={40} x={-20} y={5}>
          {card ? (
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={getCardImageUrl(card, "small")} alt={commanderName} className="object-cover" />
              <AvatarFallback>{commanderName.charAt(0)}</AvatarFallback>
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
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload[0]) {
              setSelectedCommander(data.activePayload[0].payload.name)
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={renderCustomAxisTick} interval={0} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="wins" name="Vitórias" fill="#4ade80" />
          <Bar dataKey="losses" name="Derrotas" fill="#f87171" />
          <Bar dataKey="draws" name="Empates" fill="#a3a3a3" />
        </BarChart>
      </ResponsiveContainer>

      {selectedCommander && (
        <CommanderDetails
          commanderName={selectedCommander}
          cardData={cardData[selectedCommander]}
          onClose={() => setSelectedCommander(null)}
          winrateData={data.find((d) => d.name === selectedCommander)}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((commander) => (
          <Card
            key={commander.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedCommander(commander.name)}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              {cardData[commander.name] ? (
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage
                    src={getCardImageUrl(cardData[commander.name], "small")}
                    alt={commander.name}
                    className="object-cover"
                  />
                  <AvatarFallback>{commander.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <Skeleton className="h-12 w-12 rounded-full" />
              )}
              <div>
                <p className="font-medium text-sm line-clamp-1">{commander.name}</p>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="text-xs">
                    {commander.winrate}% WR
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {commander.wins}W/{commander.losses}L
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

