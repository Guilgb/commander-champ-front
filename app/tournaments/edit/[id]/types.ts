export interface Player {
  id: string
  name: string
  commander: string
  partner?: string
  colors: string
  decklist?: string
  wins: number
  losses: number
  draws: number
  isWinner: boolean
}

export interface Tournament {
  id: string
  name: string
  date: Date
  location: string
  organizer: string
  format: string
  players: Player[]
}