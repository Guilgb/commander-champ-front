"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import type { DateRange } from "react-day-picker"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/service/api"
import { ScryfallCard, ScryfallResponse } from "./types"



export function CommanderFilter() {
  const [name, setName] = useState("")
  const [colors, setColors] = useState<string[]>([])
  const [type, setType] = useState("")
  const [cmc, setCmc] = useState([0, 10])
  const [playerName, setPlayerName] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([])
  const [tournamentsOpen, setTournamentsOpen] = useState(false)
  const [titleFilter, setTitleFilter] = useState("all")

  const [commander, setCommander] = useState("")
  const [partner, setPartner] = useState("")
  const [commanderSuggestions, setCommanderSuggestions] = useState<ScryfallCard[]>([])
  const [partnerSuggestions, setPartnerSuggestions] = useState<ScryfallCard[]>([])
  const [isLoadingCommander, setIsLoadingCommander] = useState(false)
  const [isLoadingPartner, setIsLoadingPartner] = useState(false)
  const [showCommanderSuggestions, setShowCommanderSuggestions] = useState(false)
  const [showPartnerSuggestions, setShowPartnerSuggestions] = useState(false)

  const commanderInputRef = useRef<HTMLInputElement>(null)
  const partnerInputRef = useRef<HTMLInputElement>(null)
  const commanderSuggestionsRef = useRef<HTMLDivElement>(null)
  const partnerSuggestionsRef = useRef<HTMLDivElement>(null)

  const [tournaments, setTournaments] = useState<{ id: string; name: string; date: string }[]>([]);

  useEffect(() => {
    api.get(`/tournaments/list`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Erro ao carregar torneios");
        }
        setTournaments(
          response.data.map((tournament: any) => ({
            id: tournament.id,
            name: tournament.name,
            date: new Date(tournament.end_date).toLocaleDateString("pt-BR"),
          }))
        );
      })
      .catch((error) => {
        console.error("Erro ao carregar dados de torneios:", error);
      });
  }, []);

  const handleReset = () => {
    setName("")
    setColors([])
    setType("")
    setCmc([0, 10])
    setPlayerName("")
    setDateRange(undefined)
    setSelectedTournaments([])
    setTitleFilter("all")
    setCommander("")
    setPartner("")
  }

  const toggleTournament = (tournamentId: string) => {
    setSelectedTournaments((prev) =>
      prev.includes(tournamentId) ? prev.filter((id) => id !== tournamentId) : [...prev, tournamentId],
    )
  }

  // Função para buscar comandantes da API do Scryfall
  const fetchCommanders = async (searchTerm: string, isPartner = false) => {
    if (searchTerm.length < 2) {
      isPartner ? setPartnerSuggestions([]) : setCommanderSuggestions([])
      return
    }

    isPartner ? setIsLoadingPartner(true) : setIsLoadingCommander(true)

    try {
      // Buscar cards que são comandantes (legendary creatures ou planeswalkers com "can be your commander")
      const query = `${searchTerm} (t:legendary t:creature OR o:"can be your commander")`
      const response = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=name&unique=cards`,
      )

      if (response.status === 404) {
        // Scryfall retorna 404 quando não encontra resultados
        isPartner ? setPartnerSuggestions([]) : setCommanderSuggestions([])
        return
      }

      if (!response.ok) {
        throw new Error(`Erro na API do Scryfall: ${response.status}`)
      }

      const data: ScryfallResponse = await response.json()

      isPartner ? setPartnerSuggestions(data.data.slice(0, 5)) : setCommanderSuggestions(data.data.slice(0, 5))
    } catch (error) {
      console.error("Erro ao buscar comandantes:", error)
      isPartner ? setPartnerSuggestions([]) : setCommanderSuggestions([])
    } finally {
      isPartner ? setIsLoadingPartner(false) : setIsLoadingCommander(false)
    }
  }

  // Adicione esta nova função abaixo da função fetchCommanders existente:

  // Função alternativa para buscar comandantes usando a API de autocomplete
  const fetchCommanderSuggestions = async (searchTerm: string, isPartner = false) => {
    if (searchTerm.length < 2) {
      isPartner ? setPartnerSuggestions([]) : setCommanderSuggestions([])
      return
    }

    isPartner ? setIsLoadingPartner(true) : setIsLoadingCommander(true)

    try {
      // Usar a API de autocomplete do Scryfall
      const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(searchTerm)}`)

      if (!response.ok) {
        throw new Error(`Erro na API do Scryfall: ${response.status}`)
      }

      const data = await response.json()

      if (!data.data || data.data.length === 0) {
        isPartner ? setPartnerSuggestions([]) : setCommanderSuggestions([])
        return
      }

      // Para cada nome de card sugerido, buscar os detalhes do card
      const cardPromises = data.data.slice(0, 5).map(async (cardName: string) => {
        try {
          const cardResponse = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`)

          if (!cardResponse.ok) return null

          const cardData = await cardResponse.json()

          // Verificar se é um comandante válido
          const isLegendary = cardData.type_line?.includes("Legendary") && cardData.type_line?.includes("Creature")
          const canBeCommander = cardData.oracle_text?.includes("can be your commander")

          if (isLegendary || canBeCommander) {
            return cardData
          }

          return null
        } catch (error) {
          console.error(`Erro ao buscar detalhes do card ${cardName}:`, error)
          return null
        }
      })

      const cards = (await Promise.all(cardPromises)).filter((card) => card !== null) as ScryfallCard[]

      isPartner ? setPartnerSuggestions(cards) : setCommanderSuggestions(cards)
    } catch (error) {
      console.error("Erro ao buscar sugestões de comandantes:", error)
      isPartner ? setPartnerSuggestions([]) : setCommanderSuggestions([])
    } finally {
      isPartner ? setIsLoadingPartner(false) : setIsLoadingCommander(false)
    }
  }

  // Modifique os useEffect para usar a nova função:

  // Debounce para as buscas
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showCommanderSuggestions && commander.length >= 2) {
        fetchCommanderSuggestions(commander)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [commander, showCommanderSuggestions])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showPartnerSuggestions && partner.length >= 2) {
        fetchCommanderSuggestions(partner, true)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [partner, showPartnerSuggestions])

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commanderSuggestionsRef.current &&
        !commanderSuggestionsRef.current.contains(event.target as Node) &&
        commanderInputRef.current &&
        !commanderInputRef.current.contains(event.target as Node)
      ) {
        setShowCommanderSuggestions(false)
      }

      if (
        partnerSuggestionsRef.current &&
        !partnerSuggestionsRef.current.contains(event.target as Node) &&
        partnerInputRef.current &&
        !partnerInputRef.current.contains(event.target as Node)
      ) {
        setShowPartnerSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Selecionar um comandante das sugestões
  const selectCommander = (cardName: string) => {
    setCommander(cardName)
    setShowCommanderSuggestions(false)
  }

  // Selecionar um parceiro das sugestões
  const selectPartner = (cardName: string) => {
    setPartner(cardName)
    setShowPartnerSuggestions(false)
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="commander-name">Nome do Comandante</Label>
          <div className="relative">
            <Input
              id="commander-name"
              ref={commanderInputRef}
              placeholder="Pesquisar comandante..."
              value={commander}
              onChange={(e) => setCommander(e.target.value)}
              onFocus={() => setShowCommanderSuggestions(true)}
            />
            {showCommanderSuggestions && (
              <div ref={commanderSuggestionsRef} className="absolute z-50 w-full mt-1">
                <Card>
                  <CardContent className="p-1">
                    {isLoadingCommander ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">Carregando...</div>
                    ) : commanderSuggestions.length > 0 ? (
                      <ul className="divide-y">
                        {commanderSuggestions.map((card, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                            onClick={() => selectCommander(card.name)}
                          >
                            <img
                              src={
                                card.image_uris?.small ||
                                card.card_faces?.[0]?.image_uris?.small ||
                                "/placeholder.svg?height=30&width=30" ||
                                "/placeholder.svg"
                              }
                              alt={card.name}
                              className="h-8 w-8 rounded-sm object-cover"
                            />
                            <span>{card.name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : commander.length >= 2 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">Nenhum comandante encontrado</div>
                    ) : (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Digite pelo menos 2 caracteres
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="partner-name">Parceiro</Label>
          <div className="relative">
            <Input
              id="partner-name"
              ref={partnerInputRef}
              placeholder="Pesquisar parceiro..."
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              onFocus={() => setShowPartnerSuggestions(true)}
            />
            {showPartnerSuggestions && (
              <div ref={partnerSuggestionsRef} className="absolute z-50 w-full mt-1">
                <Card>
                  <CardContent className="p-1">
                    {isLoadingPartner ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">Carregando...</div>
                    ) : partnerSuggestions.length > 0 ? (
                      <ul className="divide-y">
                        {partnerSuggestions.map((card, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                            onClick={() => selectPartner(card.name)}
                          >
                            <img
                              src={
                                card.image_uris?.small ||
                                card.card_faces?.[0]?.image_uris?.small ||
                                "/placeholder.svg?height=30&width=30" ||
                                "/placeholder.svg"
                              }
                              alt={card.name}
                              className="h-8 w-8 rounded-sm object-cover"
                            />
                            <span>{card.name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : partner.length >= 2 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">Nenhum comandante encontrado</div>
                    ) : (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Digite pelo menos 2 caracteres
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="commander-colors">Cores</Label>
          <Select value={colors.join("")} onValueChange={(value) => setColors(value.split(""))}>
            <SelectTrigger id="commander-colors">
              <SelectValue placeholder="Selecionar cores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cores</SelectItem>
              <SelectItem value="W">Branco (W)</SelectItem>
              <SelectItem value="U">Azul (U)</SelectItem>
              <SelectItem value="B">Preto (B)</SelectItem>
              <SelectItem value="R">Vermelho (R)</SelectItem>
              <SelectItem value="G">Verde (G)</SelectItem>
              <SelectItem value="WU">Azorius (WU)</SelectItem>
              <SelectItem value="WB">Orzhov (WB)</SelectItem>
              <SelectItem value="UB">Dimir (UB)</SelectItem>
              <SelectItem value="UR">Izzet (UR)</SelectItem>
              <SelectItem value="BR">Rakdos (BR)</SelectItem>
              <SelectItem value="BG">Golgari (BG)</SelectItem>
              <SelectItem value="RG">Gruul (RG)</SelectItem>
              <SelectItem value="WG">Selesnya (WG)</SelectItem>
              <SelectItem value="WR">Boros (WR)</SelectItem>
              <SelectItem value="UG">Simic (UG)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="commander-type">Tipo</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="commander-type">
              <SelectValue placeholder="Selecionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="creature">Criatura</SelectItem>
              <SelectItem value="planeswalker">Planeswalker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Custo de Mana (CMC)</Label>
          <div className="pt-4 px-2">
            <Slider defaultValue={[0, 10]} max={15} step={1} value={cmc} onValueChange={setCmc} />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{cmc[0]}</span>
              <span>{cmc[1]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="player-name">Nome do Jogador</Label>
          <Input
            id="player-name"
            placeholder="Pesquisar por jogador..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Período</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                  )
                ) : (
                  "Selecionar período"
                )}
                {dateRange?.from && (
                  <X
                    className="ml-auto h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDateRange(undefined)
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Torneios</Label>
          <Popover open={tournamentsOpen} onOpenChange={setTournamentsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  {selectedTournaments.length > 0 ? `${selectedTournaments.length} torneios` : "Selecionar torneios"}
                </span>
                {selectedTournaments.length > 0 ? (
                  <X
                    className="h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTournaments([])
                    }}
                  />
                ) : (
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar torneio..." />
                <CommandList>
                  <CommandEmpty>Nenhum torneio encontrado.</CommandEmpty>
                  <CommandGroup>
                    {tournaments.map((tournament) => (
                      <CommandItem
                        key={tournament.id}
                        onSelect={() => toggleTournament(tournament.id)}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <span>{tournament.name}</span>
                          <p className="text-xs text-muted-foreground">{tournament.date}</p>
                        </div>
                        {selectedTournaments.includes(tournament.id) && <Check className="h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title-filter">Filtro de Títulos</Label>
          <Select value={titleFilter} onValueChange={setTitleFilter}>
            <SelectTrigger id="title-filter">
              <SelectValue placeholder="Filtrar por títulos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os resultados</SelectItem>
              <SelectItem value="champion">Apenas campeões</SelectItem>
              <SelectItem value="top4">Top 4</SelectItem>
              <SelectItem value="top8">Top 8</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end space-x-2">
          <Button className="flex-1">Aplicar Filtros</Button>
          <Button variant="outline" onClick={handleReset}>
            Limpar
          </Button>
        </div>
      </div>

      {/* Exibir torneios selecionados */}
      {selectedTournaments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTournaments.map((tournamentId) => {
            const tournament = tournaments.find((t) => t.id === tournamentId)
            return tournament ? (
              <Badge key={tournamentId} variant="secondary" className="flex items-center gap-1">
                {tournament.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTournament(tournamentId)} />
              </Badge>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

