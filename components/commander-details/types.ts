import { type ScryfallCard } from "@/lib/scryfall"

export interface DeckCard {
  name: string
  quantity: number
  category: string
}

export interface DeckOwner {
  id: string
  name: string
  avatar: string
}

export interface CommanderDeck {
  id: string
  name: string
  commander: string
  owner: DeckOwner
  decklist: string;
  winrate: number
  wins: number
  losses: number
  draws: number
  tournaments: number
  lastUpdated: string
  price: number
  tags: string[]
  description: string
  cards: DeckCard[]
}

export interface CommanderDetailsProps {
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