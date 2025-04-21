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