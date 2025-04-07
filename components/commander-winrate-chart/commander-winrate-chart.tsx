"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { CommanderDetails } from "@/components/commander-details"
import { CommanderRankingResponse, CommanderWinrateData } from "./types"
import api from "@/service/api"

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
  const [data, setData] = useState<CommanderRankingResponse[]>([])
  const [cardData, setCardData] = useState<Record<string, ScryfallCard>>({})
  const [loading, setLoading] = useState(true)
  const [selectedCommander, setSelectedCommander] = useState<string | null>(null)

  useEffect(() => {
    // e então buscaria os dados dos cards do Scryfall

    async function fetchCardData() {
      setLoading(true)
      api.post(`/decks/statistics/commander-winrate`)
        .then((response) => {
          if (response.status !== 201) {
            throw new Error("Erro ao carregar o winrate dos comandantes");
          }
          setData(
            response.data.map((tournament: CommanderRankingResponse) => ({
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
          );
        })
        .catch((error) => {
          console.error("Erro ao carregar dados dos decks:", error);
        });
      // Extrair os nomes dos comandantes
      const commanderNames = data.map((item) => item.commander)

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
    console.log(commanderName)
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
          winrateData={data.find((d) => d.commander === selectedCommander)}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((commander) => (
          <Card
            key={commander.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedCommander(commander.commander)}
          >
            <CardContent className="p-4 flex items-center space-x-4">
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
                <p className="font-medium text-sm line-clamp-1">{commander.commander}</p>
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

