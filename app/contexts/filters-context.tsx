"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

// Tipos para os filtros de comandante
export interface CommanderFilters {
  colors: string[]
  powerLevel: [number, number]
  timeFrame: string
  format: string
}

// Tipos para os filtros de carta
export interface CardFilters {
  colors: string[]
  cardType: string
  rarity: string
  timeFrame: string
  format: string
}

// Contexto para filtros de comandante
const CommanderFiltersContext = createContext<{
  filters: CommanderFilters
  setFilters: React.Dispatch<React.SetStateAction<CommanderFilters>>
}>({
  filters: {
    colors: [],
    powerLevel: [1, 10],
    timeFrame: "all",
    format: "all",
  },
  setFilters: () => {},
})

// Contexto para filtros de carta
const CardFiltersContext = createContext<{
  filters: CardFilters
  setFilters: React.Dispatch<React.SetStateAction<CardFilters>>
}>({
  filters: {
    colors: [],
    cardType: "all",
    rarity: "all",
    timeFrame: "all",
    format: "all",
  },
  setFilters: () => {},
})

// Provider para filtros de comandante
export function CommanderFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CommanderFilters>({
    colors: [],
    powerLevel: [1, 10],
    timeFrame: "all",
    format: "all",
  })

  return <CommanderFiltersContext.Provider value={{ filters, setFilters }}>{children}</CommanderFiltersContext.Provider>
}

// Provider para filtros de carta
export function CardFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CardFilters>({
    colors: [],
    cardType: "all",
    rarity: "all",
    timeFrame: "all",
    format: "all",
  })

  return <CardFiltersContext.Provider value={{ filters, setFilters }}>{children}</CardFiltersContext.Provider>
}

// Hooks para usar os contextos
export const useCommanderFilters = () => useContext(CommanderFiltersContext)
export const useCardFilters = () => useContext(CardFiltersContext)
