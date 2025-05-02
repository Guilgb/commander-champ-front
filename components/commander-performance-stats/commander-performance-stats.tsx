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
import { useCommanderFilters } from "@/app/contexts/filters-context"
import { isValid } from "date-fns"


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

  const { filters } = useCommanderFilters()
  useEffect(() => {
    async function fetchCommanderPerformanceData() {
      setLoading(true)
      try {
        const response = await api.post("/decks/statistics")
        const data = await response.data
        const { cmc: cardCmc, colors, commander, dataRange: dataRane, partner, playerName, selectedTournaments, title } = filters
        const filteredData = []
        for (const item of data) {
          const { cmc } = item;
          const isValid = (
            (commander.length === 0 || !item.commander || commander === item.commander) &&
            (partner.length === 0 || !item.partner || item.partner === partner) &&
            (
              cardCmc.length === 0 ||
              !cardCmc ||
              (
                cardCmc.length === 2 ?
                  (item.cmc >= cardCmc[0] && item.cmc <= cardCmc[1]) :
                  cardCmc.includes(item.cmc) 
              )
            ) &&
            (colors.length === 0 || (colors.length === item.colors.length && colors.every(color => item.colors.includes(color)))) &&
            // (dataRane === "all" || item.dataRane === dataRane) &&
            // (playerName === "all" || item.playerName.toLowerCase().includes(playerName.toLowerCase())) &&
            // (selectedTournaments.length === 0 || selectedTournaments.includes(item.tournament))
            (title === "all" || (title.toLowerCase() === "top4" ? item.top4 > 0 : title.toLowerCase() === "top8" ? item.top8 > 0 : item.top4.toLowerCase().includes(title.toLowerCase()) || item.top8.toLowerCase().includes(title.toLowerCase())))
          )
          if (isValid) {
            filteredData.push(item)
          }
        }
        filteredData.sort((a, b) => (b.champion / b.entries) - (a.champion / a.entries));
        const top10FilteredData = filteredData.slice(0, 10);
        setcommanderPerformanceData(top10FilteredData)
      } catch (error) {
        console.error("Error fetching commander performance data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCommanderPerformanceData()
  }, [filters]);

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
      </CardContent>
    </Card>
  )
}

