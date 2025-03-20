"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"

// Mock data para porcentagem de top
const topPercentageData = [
  { month: "Jan", top8: 25, top4: 12, champion: 5 },
  { month: "Fev", top8: 28, top4: 15, champion: 4 },
  { month: "Mar", top8: 32, top4: 18, champion: 6 },
  { month: "Abr", top8: 30, top4: 14, champion: 3 },
  { month: "Mai", top8: 35, top4: 20, champion: 7 },
  { month: "Jun", top8: 40, top4: 22, champion: 8 },
  { month: "Jul", top8: 38, top4: 19, champion: 6 },
  { month: "Ago", top8: 42, top4: 24, champion: 9 },
  { month: "Set", top8: 45, top4: 26, champion: 10 },
  { month: "Out", top8: 48, top4: 28, champion: 12 },
  { month: "Nov", top8: 50, top4: 30, champion: 15 },
  { month: "Dez", top8: 55, top4: 35, champion: 18 },
]

// Mock data para vitórias por mês
const winsByMonthData = [
  { month: "Jan", wins: 45, totalGames: 120, winRate: 37.5 },
  { month: "Fev", wins: 52, totalGames: 130, winRate: 40.0 },
  { month: "Mar", wins: 60, totalGames: 140, winRate: 42.9 },
  { month: "Abr", wins: 58, totalGames: 135, winRate: 43.0 },
  { month: "Mai", wins: 65, totalGames: 145, winRate: 44.8 },
  { month: "Jun", wins: 70, totalGames: 150, winRate: 46.7 },
  { month: "Jul", wins: 68, totalGames: 142, winRate: 47.9 },
  { month: "Ago", wins: 75, totalGames: 155, winRate: 48.4 },
  { month: "Set", wins: 80, totalGames: 160, winRate: 50.0 },
  { month: "Out", wins: 85, totalGames: 165, winRate: 51.5 },
  { month: "Nov", wins: 90, totalGames: 170, winRate: 52.9 },
  { month: "Dez", wins: 95, totalGames: 175, winRate: 54.3 },
]

// Mock data para títulos por ano
const titlesByYearData = [
  { year: "2018", titles: 3 },
  { year: "2019", titles: 5 },
  { year: "2020", titles: 4 },
  { year: "2021", titles: 7 },
  { year: "2022", titles: 10 },
  { year: "2023", titles: 12 },
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
                {entry.name === "winRate" ? "%" : ""}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
  return null
}

export function TopPercentageChart() {
  const [timeRange, setTimeRange] = useState("year")

  // Filtrar dados com base no período selecionado
  const filteredTopData = timeRange === "year" ? topPercentageData : topPercentageData.slice(-3) // últimos 3 meses para "quarter"

  const filteredWinsData = timeRange === "year" ? winsByMonthData : winsByMonthData.slice(-3)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Desempenho ao Longo do Tempo</CardTitle>
            <CardDescription>Análise de resultados em torneios por período</CardDescription>
          </div>
          <Tabs defaultValue="top" className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="top">Top %</TabsTrigger>
              <TabsTrigger value="wins">Vitórias</TabsTrigger>
              <TabsTrigger value="titles">Títulos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="quarter">Trimestre</TabsTrigger>
              <TabsTrigger value="year">Ano</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs defaultValue="top" className="space-y-4">
          <TabsContent value="top" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredTopData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="top8" name="Top 8" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="top4" name="Top 4" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="champion" name="Campeão" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-[#8884d8] mr-2"></div>
                Top 8: {filteredTopData.reduce((sum, item) => sum + item.top8, 0)} ocorrências
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-[#82ca9d] mr-2"></div>
                Top 4: {filteredTopData.reduce((sum, item) => sum + item.top4, 0)} ocorrências
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-[#ff7300] mr-2"></div>
                Campeão: {filteredTopData.reduce((sum, item) => sum + item.champion, 0)} ocorrências
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="wins" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredWinsData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="wins"
                    name="Vitórias"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="totalGames" name="Total de Jogos" stroke="#82ca9d" />
                  <Line yAxisId="right" type="monotone" dataKey="winRate" name="Taxa de Vitória" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-[#8884d8] mr-2"></div>
                Total de Vitórias: {filteredWinsData.reduce((sum, item) => sum + item.wins, 0)}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-[#82ca9d] mr-2"></div>
                Total de Jogos: {filteredWinsData.reduce((sum, item) => sum + item.totalGames, 0)}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-[#ff7300] mr-2"></div>
                Taxa Média:{" "}
                {(filteredWinsData.reduce((sum, item) => sum + item.winRate, 0) / filteredWinsData.length).toFixed(1)}%
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="titles" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={titlesByYearData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="titles" name="Títulos" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-[#8884d8] mr-2"></div>
                Total de Títulos: {titlesByYearData.reduce((sum, item) => sum + item.titles, 0)}
              </Badge>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

