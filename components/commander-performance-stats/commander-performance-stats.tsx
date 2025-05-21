"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCardByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { use, useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CommanderPerformaceResponse, ItensResponse } from "./types"
import api from "@/service/api"
import { useCommanderFilters } from "@/app/contexts/filters-context"
import { isValid } from "date-fns"

// Hook para detectar o tamanho da tela
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Handler para chamar ao redimensionar a janela
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Adicionar event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      // Chamar handler imediatamente para que o estado reflita o tamanho inicial da janela
      handleResize();

      // Remover event listener ao desmontar
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Array vazio garante que o efeito só é executado na montagem e desmontagem

  return windowSize;
}


// Componente personalizado para o tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border p-2 rounded-md shadow-md text-sm">
        <p className="font-bold text-xs md:text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-1 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3" style={{ backgroundColor: entry.color }}></div>
            <p style={{ color: entry.color }} className="text-xs md:text-sm whitespace-nowrap">
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
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const { filters } = useCommanderFilters()
  useEffect(() => {
    async function fetchCommanderPerformanceData() {
      setLoading(true)
      try {
        const response = await api.post("/decks/statistics")
        const data = await response.data
        const { cmc: cardCmc, colors, commander, start_date, end_date, partner, playerName, selectedTournaments, title } = filters

        const startDate = start_date !== 'all' ? new Date(start_date) : null;
        const endDate = end_date !== 'all' ? new Date(end_date) : null;

        const filteredData = data.filter((item: ItensResponse) => {
          if (commander && commander !== 'all' && item.commander !== commander) {
            return false;
          }

          if (item.commander === '- + -') {
            return false;
          }

          if (colors?.length > 0 && (!item.colors || item.colors.length !== colors.length || !colors.every(c => item.colors.includes(c)))) {
            return false;
          }

          if (cardCmc?.length === 2 && (item.cmc < cardCmc[0] || item.cmc > cardCmc[1])) {
            return false;
          }

          if (commander && commander !== 'all' && item.commander !== commander) {
            return false;
          }

          if (partner && partner.length > 0 && item.partner !== partner) {
            return false;
          }

          if (start_date && end_date) {
            const parseDate = (dateString: string) => {
              const [day, month, year] = dateString.split('/').map(Number);
              return new Date(year, month - 1, day);
            };

            const itemDate = parseDate(item.date);
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);

            if (isNaN(itemDate.getTime()) || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              console.warn("Invalid date detected in filtering:", { itemDate: item.date, start_date, end_date });
              return false;
            }

            if (itemDate < startDate || itemDate > endDate) {
              return false;
            }
          }
          if (title == 'top4' && item.top4 === 0) {
            return false;
          }

          if (title == 'top8' && item.top8 === 0) {
            return false;
          }

          if (title == 'champion' && item.champion === 0) {
            return false;
          }

          if (selectedTournaments && selectedTournaments.length > 0) {
            if (!item.tournament_ids || !selectedTournaments.some(tournamentId => item.tournament_ids.includes(tournamentId))) {
              return false;
            }
          }
          return true
        })

        // Limitar o número de comandantes exibidos com base no tamanho da tela
        const maxItems = width < 768 ? 6 : 10;
        const topFilteredData = filteredData.slice(0, maxItems);
        setcommanderPerformanceData(topFilteredData)
      } catch (error) {
        console.error("Error fetching commander performance data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCommanderPerformanceData()
  }, [filters, width]);

  useEffect(() => {
    if (commanderPerformanceData.length === 0) return;

    async function fetchCardData() {
      setLoading(true)
      const cardDataMap: Record<string, ScryfallCard> = {}

      for (const item of commanderPerformanceData) {
        try {
          // Buscar o comandante principal
          const card = await getCardByName(item.commander);
          if (card) {
            cardDataMap[item.commander] = card
          }

          // Se houver partner, buscar também
          if (item.partner) {
            const partnerCard = await getCardByName(item.partner);
            if (partnerCard) {
              cardDataMap[item.partner] = partnerCard
            }
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
    const commanderName = commander.partner ? `${commander.commander} + ${commander.partner}` : commander.commander;
    if (statType === "absolute") {
      return {
        name: commanderName,
        top8: commander.top8,
        top4: commander.top4,
        champion: commander.champion,
      }
    } else {
      return {
        name: commanderName,
        top8: commander.entries > 0 ? Math.round((commander.top8 / commander.entries) * 100) : 0,
        top4: commander.entries > 0 ? Math.round((commander.top4 / commander.entries) * 100) : 0,
        champion: commander.entries > 0 ? Math.round((commander.champion / commander.entries) * 100) : 0,
      }
    }
  })

  const renderCustomAxisTick = (props: any) => {
    const { x, y, payload, viewBox } = props
    const commanderName = payload.value
    const hasPartner = commanderName.includes("+")
    const [mainCommander, partner] = hasPartner ? commanderName.split("+").map(name => name.trim()) : [commanderName, null]
    const mainCard = cardData[mainCommander]
    const partnerCard = partner ? cardData[partner] : null

    // Ajustar tamanhos para mobile usando o hook de tamanho da janela
    const avatarSize = isMobile ? "h-6 w-6" : "h-10 w-10"
    const foreignWidth = hasPartner ? (isMobile ? 60 : 85) : (isMobile ? 35 : 45)
    const foreignHeight = isMobile ? 35 : 50
    const foreignX = hasPartner ? (isMobile ? -50 : -70) : (isMobile ? -40 : -55)
    const foreignY = isMobile ? -18 : -25

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject width={foreignWidth} height={foreignHeight} x={foreignX} y={foreignY}>
          <div className="relative">
            <div className="absolute top-0 left-0">
              {mainCard ? (
                <Avatar className={`${avatarSize} border-2 border-primary`}>
                  <AvatarImage src={getCardImageUrl(mainCard, "small")} alt={mainCommander} className="object-cover" />
                  <AvatarFallback>{mainCommander.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <Skeleton className={avatarSize + " rounded-full"} />
              )}
            </div>
            {hasPartner && (
              <div className={`absolute ${isMobile ? "top-1 left-4" : "top-2 left-6"}`}>
                {partnerCard ? (
                  <Avatar className={`${avatarSize} border-2 border-primary`}>
                    <AvatarImage src={getCardImageUrl(partnerCard, "small")} alt={partner} className="object-cover" />
                    <AvatarFallback>{partner?.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Skeleton className={avatarSize + " rounded-full"} />
                )}
              </div>
            )}
          </div>
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
          <div className="flex space-x-1 md:space-x-2">
            <Button
              variant={statType === "absolute" ? "default" : "outline"}
              onClick={() => setStatType("absolute")}
              size="sm"
              className="text-xs md:text-sm"
            >
              <span className="hidden md:inline">Valores Absolutos</span>
              <span className="md:hidden">Absolutos</span>
            </Button>
            <Button
              variant={statType === "percentage" ? "default" : "outline"}
              onClick={() => setStatType("percentage")}
              size="sm"
              className="text-xs md:text-sm"
            >
              <span className="hidden md:inline">Porcentagem</span>
              <span className="md:hidden">%</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] md:h-[400px] border border-border rounded-md p-2 md:p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={statType === "percentage" ? [0, 100] : [0, "auto"]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={isMobile ? 70 : 90} tick={renderCustomAxisTick} interval={0} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
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

