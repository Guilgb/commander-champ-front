"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { type ScryfallCard, getCardImageUrl, getCardNormalImageUrl } from "@/lib/scryfall"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { DeckList } from "@/components/deck-list"
import { ChevronDown, ChevronUp, Clock, Trophy, Calendar, Sparkles, ArrowUpDown } from "lucide-react"
import api from "@/service/api"
import { CommanderDeck } from "./types"

interface CommanderDetailsProps {
  commanderName: string
  cardData?: ScryfallCard
  onClose: () => void
  winrateData?: {
    wins: number
    losses: number
    draws: number
    winrate: number
  }
}


export function CommanderDetails({ commanderName, cardData, onClose, winrateData }: CommanderDetailsProps) {
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"winrate" | "recent" | "price">("winrate")

  if (!cardData) {
    return null
  }
  const [commanderDecks, setCommanderDecks] = useState<CommanderDeck[]>([])

  useEffect(() => {
    const fetchDecks = async () => {
      const response = await api.post<CommanderDeck[]>('/decks/commander', {
        "commander_name": commanderName,
      })
      setCommanderDecks(response.data.filter((deck) => deck.commander === commanderName))
    }
    fetchDecks()
  }, [commanderName])

  // Ordenar decks com base na opção selecionada
  const sortedDecks = [...commanderDecks].sort((a, b) => {
    if (sortOrder === "winrate") {
      return b.winrate - a.winrate
    } else if (sortOrder === "recent") {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    } else {
      return a.price - b.price
    }
  })

  // Função para formatar o texto do card com quebras de linha
  const formatOracleText = (text?: string) => {
    if (!text) return null
    return text.split("\n").map((line, i) => (
      <p key={i} className="mb-1">
        {line}
      </p>
    ))
  }

  // Função para obter o ícone de cor
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

  // Calcular estatísticas
  const totalGames = winrateData ? winrateData.wins + winrateData.losses + winrateData.draws : 0

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{cardData.name}</DialogTitle>
          <DialogDescription>{cardData.type_line}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="decks">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="decks">Decks ({commanderDecks.length})</TabsTrigger>
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
                  <h3 className="font-semibold mb-1">Identidade de Cor</h3>
                  <div className="flex space-x-2">
                    {cardData.color_identity.map((color) => {
                      const { symbol, bg, text } = getColorIcon(color)
                      return (
                        <Badge key={color} className={`${bg} ${text}`}>
                          {symbol} {color}
                        </Badge>
                      )
                    })}
                    {cardData.color_identity.length === 0 && <Badge>Incolor</Badge>}
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
                    {/* Preço estimado em BRL (simulado) */}
                    {cardData.prices.usd && (
                      <Badge variant="outline">BRL R${(Number.parseFloat(cardData.prices.usd) * 5.0).toFixed(2)}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {winrateData ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Taxa de Vitória</CardTitle>
                    <CardDescription>Baseado em {totalGames} jogos registrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Winrate</span>
                          <span className="font-bold">{winrateData.winrate}%</span>
                        </div>
                        <Progress value={winrateData.winrate} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-md">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{winrateData.wins}</p>
                          <p className="text-sm text-muted-foreground">Vitórias</p>
                        </div>
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{winrateData.losses}</p>
                          <p className="text-sm text-muted-foreground">Derrotas</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                          <p className="text-2xl font-bold">{winrateData.draws}</p>
                          <p className="text-sm text-muted-foreground">Empates</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho por Tipo de Mesa</CardTitle>
                    <CardDescription>Como este comandante se sai em diferentes ambientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Torneios Presenciais</span>
                          <span className="font-bold">62%</span>
                        </div>
                        <Progress value={62} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Torneios Online</span>
                          <span className="font-bold">58%</span>
                        </div>
                        <Progress value={58} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-md">
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">12</p>
                          <p className="text-xs text-muted-foreground">Torneios Presenciais</p>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">8</p>
                          <p className="text-xs text-muted-foreground">Torneios Online</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Não há dados estatísticos disponíveis para este comandante.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="decks" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Decks de {cardData.name}</CardTitle>
                    <CardDescription>{commanderDecks.length} decks registrados com este comandante</CardDescription>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder("winrate")}
                      className={sortOrder === "winrate" ? "bg-primary text-primary-foreground" : ""}
                    >
                      <Trophy className="h-4 w-4 mr-1" />
                      Winrate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder("recent")}
                      className={sortOrder === "recent" ? "bg-primary text-primary-foreground" : ""}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Recentes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder("price")}
                      className={sortOrder === "price" ? "bg-primary text-primary-foreground" : ""}
                    >
                      <ArrowUpDown className="h-4 w-4 mr-1" />
                      Preço
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedDecks.length > 0 ? (
                    sortedDecks.map((deck) => (
                      <Card key={deck.id} className={selectedDeck === deck.id ? "border-primary" : ""}>
                        <CardHeader className="p-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{deck.name}</CardTitle>
                              <Badge variant={deck.winrate >= 70 ? "default" : "outline"}>{deck.winrate}% WR</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">R${deck.price}</Badge>
                            </div>
                          </div>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-1">
                                <AvatarImage src={deck.owner.avatar} alt={deck.owner.name} />
                                <AvatarFallback>{deck.owner.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {deck.owner.name}
                            </div>
                            <span>•</span>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {deck.lastUpdated}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm">{deck.description}</p>
                          {/* <div className="flex flex-wrap gap-2 mt-2">
                            {deck.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div> */}

                          <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                              <p className="font-bold text-green-600 dark:text-green-400">{deck.wins}</p>
                              <p className="text-xs text-muted-foreground">Vitórias</p>
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
                              <p className="font-bold text-red-600 dark:text-red-400">{deck.losses}</p>
                              <p className="text-xs text-muted-foreground">Derrotas</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                              <p className="font-bold text-blue-600 dark:text-blue-400">{deck.draws}</p>
                              <p className="text-xs text-muted-foreground">Empates</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDeck(selectedDeck === deck.id ? null : deck.id)}
                          >
                            {selectedDeck === deck.id ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Esconder Decklist
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                Ver Decklist
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Sparkles className="h-4 w-4 mr-1" />
                            Copiar Deck
                          </Button>
                        </CardFooter>

                        {selectedDeck === deck.id && (
                          <div className="px-4 pb-4">
                            <Separator className="mb-4" />
                            <DeckList cards={deck.cards} />
                          </div>
                        )}
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p>Nenhum deck registrado com este comandante.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

