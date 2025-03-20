"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data para desempenho de comandantes em torneios
const commanderPerformanceData = [
  {
    id: "1",
    name: "Gishath, Sun's Avatar",
    tournaments: 8,
    top8: 6,
    top4: 4,
    champion: 2,
    colors: "RGW",
  },
  {
    id: "2",
    name: "Atraxa, Praetors' Voice",
    tournaments: 10,
    top8: 8,
    top4: 5,
    champion: 3,
    colors: "WUBG",
  },
  {
    id: "3",
    name: "Muldrotha, the Gravetide",
    tournaments: 7,
    top8: 5,
    top4: 3,
    champion: 1,
    colors: "BUG",
  },
  {
    id: "4",
    name: "Yuriko, the Tiger's Shadow",
    tournaments: 12,
    top8: 10,
    top4: 7,
    champion: 4,
    colors: "UB",
  },
  {
    id: "5",
    name: "Krenko, Mob Boss",
    tournaments: 6,
    top8: 4,
    top4: 2,
    champion: 1,
    colors: "R",
  },
]

// Componente personalizado para o tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-2 bg-background border shadow-md">
        <CardContent className="p-2">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
              <p style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
  return null
}

export function CommanderPerformanceStats() {
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [statType, setStatType] = useState<"absolute" | "percentage">("absolute")

  useEffect(() => {
    async function fetchCardData() {
      setLoading(true)
      const commanderNames = commanderPerformanceData.map((item) => item.name)
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

  // Preparar dados para o gráfico
  const chartData = commanderPerformanceData.map((commander) => {
    if (statType === "absolute") {
      return {
        name: commander.name,
        top8: commander.top8,
        top4: commander.top4,
        champion: commander.champion,
      }
    } else {
      return {
        name: commander.name,
        top8: Math.round((commander.top8 / commander.tournaments) * 100),
        top4: Math.round((commander.top4 / commander.tournaments) * 100),
        champion: Math.round((commander.champion / commander.tournaments) * 100),
      }
    }
  })

  // Função para renderizar o rótulo do eixo Y com imagens
  const renderCustomAxisTick = (props: any) => {
    const { x, y, payload } = props
    const commanderName = payload.value
    const card = cardData[commanderName]

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject width={40} height={40} x={-45} y={-20}>
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
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Desempenho de Comandantes em Torneios</CardTitle>
            <CardDescription>Análise de resultados em torneios por comandante</CardDescription>
          </div>
          <Tabs value={statType} onValueChange={setStatType as any}>
            <TabsList>
              <TabsTrigger value="absolute">Valores Absolutos</TabsTrigger>
              <TabsTrigger value="percentage">Porcentagem</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={statType === "percentage" ? [0, 100] : [0, "auto"]} />
              <YAxis dataKey="name" type="category" width={90} tick={renderCustomAxisTick} interval={0} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="top8" name="Top 8" fill="#8884d8" />
              <Bar dataKey="top4" name="Top 4" fill="#82ca9d" />
              <Bar dataKey="champion" name="Campeão" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {commanderPerformanceData.map((commander) => (
            <Card key={commander.id} className="w-full md:w-auto">
              <CardContent className="p-4 flex items-center gap-4">
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
                  <p className="font-medium text-sm">{commander.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {commander.tournaments} torneios
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-[#8884d8]/20">
                      Top 8: {commander.top8} ({Math.round((commander.top8 / commander.tournaments) * 100)}%)
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-[#82ca9d]/20">
                      Top 4: {commander.top4} ({Math.round((commander.top4 / commander.tournaments) * 100)}%)
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-[#ff7300]/20">
                      Campeão: {commander.champion} ({Math.round((commander.champion / commander.tournaments) * 100)}%)
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

