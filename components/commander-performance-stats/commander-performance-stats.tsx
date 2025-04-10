"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { use, useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CommanderPerformaceResponse } from "./types"
import api from "@/service/api"


// Componente personalizado para o tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border p-2 rounded-md shadow-md">
        <p className="font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
            <p style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function CommanderPerformanceStats() {
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [statType, setStatType] = useState<"absolute" | "percentage">("absolute")
  const [commanderPerformanceData, setcommanderPerformanceData] = useState<CommanderPerformaceResponse[]>([])

  useEffect(() => {
    async function fetchCommanderPerformanceData() {
      setLoading(true)
      try {
        const response = await api.post("/decks/statistics")
        const data = await response.data
        setcommanderPerformanceData(data)
      } catch (error) {
        console.error("Error fetching commander performance data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCommanderPerformanceData()
  }, []);

  useEffect(() => {
    if (commanderPerformanceData.length === 0) return;

    async function fetchCardData() {
      setLoading(true)
      const commanderNames = commanderPerformanceData.map((item) => item.commander)
      const cardDataMap: Record<string, ScryfallCard> = {}

      for (const name of commanderNames) {
        try {
          const formattedName = name.includes("+") ? name.split("+")[0].trim() : name;
          const card = await getCardByName(formattedName);
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
  }, [commanderPerformanceData])

  // Preparar dados para o gráfico
  const chartData = commanderPerformanceData.map((commander) => {
    if (statType === "absolute") {
      return {
        name: commander.commander,
        top8: commander.top8,
        top4: commander.top4,
        champion: commander.champion,
      }
    } else {
      return {
        name: commander.commander,
        top8: Math.round((commander.top8 / commander.entries) * 100),
        top4: Math.round((commander.top4 / commander.entries) * 100),
        champion: Math.round((commander.champion / commander.entries) * 100),
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

  const top10Commanders = commanderPerformanceData
    .filter((commander) => commander.entries > 0) 
    .map((commander) => ({
      ...commander,
      winrate: (commander.champion / commander.entries) * 100, 
    }))
    .sort((a, b) => b.winrate - a.winrate) 
    .slice(0, 10) 


  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Desempenho de Comandantes em Torneios</CardTitle>
            <CardDescription>Análise de resultados em torneios por comandante</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant={statType === "absolute" ? "default" : "outline"} onClick={() => setStatType("absolute")}>
              Valores Absolutos
            </Button>
            <Button
              variant={statType === "percentage" ? "default" : "outline"}
              onClick={() => setStatType("percentage")}
            >
              Porcentagem
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] border border-border rounded-md p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
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
          {top10Commanders.map((commander) => (
            <Card key={commander.id} className="w-full md:w-auto">
              <CardContent className="p-4 flex items-center gap-4">
                {cardData[commander.commander] ? (
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage
                      src={getCardImageUrl(cardData[commander.commander], "small")}
                      alt={commander.commander}
                      className="object-cover"
                    />
                    <AvatarFallback>{commander.commander.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Skeleton className="h-12 w-12 rounded-full" />
                )}
                <div>
                  <p className="font-medium text-sm">{commander.commander}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {commander.entries} Entradas
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-[#8884d8]/20">
                      Top 8: {commander.top8} ({Math.round((commander.top8 / commander.entries) * 100)}%)
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-[#82ca9d]/20">
                      Top 4: {commander.top4} ({Math.round((commander.top4 / commander.entries) * 100)}%)
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-[#ff7300]/20">
                      Campeão: {commander.champion} ({Math.round((commander.champion / commander.entries) * 100)}%)
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

