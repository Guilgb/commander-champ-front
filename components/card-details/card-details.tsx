"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getCardImageUrl, getCardNormalImageUrl } from "@/lib/scryfall"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardDetailsProps, CardsDataResponse } from "./types"
import api from "@/service/api"
import { useEffect, useState } from "react"


export function CardDetails({ cardName, cardData, onClose, popularityData }: CardDetailsProps) {
  const [cardsData, setCardsData] = useState<CardsDataResponse[]>([])
  if (!cardData) {
    return null
  }

  useEffect(() => {
    async function fetchCardData() {
      try {
        const response = await api.post(`/cards/popular-decks`, {
          card_name: cardName,
        })
        setCardsData(response.data)
      } catch (error) {
        console.error("Erro ao buscar dados do card:", error)
      }
    }

    fetchCardData()
  }, [cardsData])

  const formatOracleText = (text?: string) => {
    if (!text) return null
    return text.split("\n").map((line, i) => (
      <p key={i} className="mb-1">
        {line}
      </p>
    ))
  }

  const getColorIcon = (color: string) => {
    const colorIcons: Record<string, { symbol: string; bg: string; text: string }> = {
      W: { symbol: "☀️", bg: "bg-amber-50", text: "text-amber-900" },
      U: { symbol: "💧", bg: "bg-blue-100", text: "text-blue-900" },
      B: { symbol: "💀", bg: "bg-gray-900", text: "text-gray-100" },
      R: { symbol: "🔥", bg: "bg-red-100", text: "text-red-900" },
      G: { symbol: "🌳", bg: "bg-green-100", text: "text-green-900" },
    }

    return colorIcons[color] || { symbol: "⚪", bg: "bg-gray-100", text: "text-gray-900" }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{cardData.name}</DialogTitle>
          <DialogDescription>{cardData.type_line}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="commanders">Comandantes Populares</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img
                  src={getCardNormalImageUrl(cardData, "normal") || "/placeholder.svg"}
                  alt={cardData.name}
                  className="rounded-lg w-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Custo de Mana</h3>
                  <p className="text-lg">{cardData.mana_cost}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Cores</h3>
                  <div className="flex space-x-2">
                    {cardData.colors &&
                      cardData.colors.map((color) => {
                        const { symbol, bg, text } = getColorIcon(color)
                        return (
                          <Badge key={color} className={`${bg} ${text}`}>
                            {symbol} {color}
                          </Badge>
                        )
                      })}
                    {(!cardData.colors || cardData.colors.length === 0) && <Badge>Incolor</Badge>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Texto</h3>
                  <div className="text-sm bg-muted p-3 rounded-md">{formatOracleText(cardData.oracle_text)}</div>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Raridade</h3>
                  <Badge variant="outline" className="capitalize">
                    {cardData.rarity}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Coleção</h3>
                  <p>
                    {cardData.set_name} ({cardData.set.toUpperCase()})
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Preço Estimado</h3>
                  <div className="flex space-x-4">
                    {cardData.prices.usd && <Badge variant="outline">USD ${cardData.prices.usd}</Badge>}
                    {cardData.prices.eur && <Badge variant="outline">EUR €{cardData.prices.eur}</Badge>}
                    {cardData.prices.usd && (
                      <Badge variant="outline">BRL R${(Number.parseFloat(cardData.prices.usd) * 5.0).toFixed(2)}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {popularityData ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Popularidade</CardTitle>
                    <CardDescription>Presença em decks do formato Commander 500</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Percentual de Uso</span>
                          <span className="font-bold">{popularityData.percentage}%</span>
                        </div>
                        <Progress value={popularityData.percentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 gap-4 text-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{popularityData.count}</p>
                          <p className="text-sm text-muted-foreground">Decks que utilizam este card</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardHeader>
                    <CardTitle>Uso por Cores</CardTitle>
                    <CardDescription>Como este card é utilizado em diferentes identidades de cor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Mono-Branco (W)</span>
                          <span className="font-bold">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Azorius (WU)</span>
                          <span className="font-bold">68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Bant (WUG)</span>
                          <span className="font-bold">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Não há dados estatísticos disponíveis para este card.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="commanders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comandantes Populares</CardTitle>
                <CardDescription>Comandantes que mais utilizam {cardData.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cardsData.map((card, index) => (
                    <Card key={index}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{card.commander}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">Cores: {card.color}</Badge>
                          <Badge variant="outline">Winrate: {card.winrate}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}