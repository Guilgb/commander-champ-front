"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

// Tipos para os filtros de comandante
export interface CommanderFilters {
  colors: string[]
  cmc: number[]
  playerName: string
  dataRange: string
  selectedTournaments: string[]
  title: string
  commander: string
  partner: string
}

// Tipos para os filtros de carta
export interface CardFilters {
  colors: string[]
  cardType: string
  cardName: string
  cardCmc: number[]
  format: string
}

// Contexto para filtros de comandante
const CommanderFiltersContext = createContext<{
  filters: CommanderFilters
  setFilters: React.Dispatch<React.SetStateAction<CommanderFilters>>
}>({
  filters: {
    colors: [],
    cmc: [1, 20],
    playerName: "all",
    dataRange: "all",
    selectedTournaments: [],
    title: "all",
    commander: "all",
    partner: "all",
  },
  setFilters: () => { },
})

// Contexto para filtros de carta
const CardFiltersContext = createContext<{
  filters: CardFilters
  setFilters: React.Dispatch<React.SetStateAction<CardFilters>>
}>({
  filters: {
    colors: [],
    cardType: "all",
    cardName: "all",
    cardCmc: [1, 20],
    format: "all",
  },
  setFilters: () => { },
})

// Provider para filtros de comandante
export function CommanderFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CommanderFilters>({
    colors: [],
    cmc: [1, 20],
    playerName: "all",
    dataRange: "all",
    selectedTournaments: [],
    title: "all",
    commander: "all",
    partner: "all",
  })

  return <CommanderFiltersContext.Provider value={{ filters, setFilters }}>{children}</CommanderFiltersContext.Provider>
}

// Provider para filtros de carta
export function CardFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CardFilters>({
    colors: [],
    cardType: "all",
    cardName: "all",
    cardCmc: [1, 20],
    format: "all",
  })

  return <CardFiltersContext.Provider value={{ filters, setFilters }}>{children}</CardFiltersContext.Provider>
}

// Hooks para usar os contextos
export const useCommanderFilters = () => useContext(CommanderFiltersContext)
export const useCardFilters = () => useContext(CardFiltersContext)
