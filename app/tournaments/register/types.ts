export interface TournamentResponse {
  name: string
  date: string
  endDate: string
  location: string
  players: Players[]
}

interface Players {
  id: string
  name: string
  commander: string
  partner?: string
  colors: string
  decklist: string
  wins: number
  losses: number
  draws: number
  isWinner: boolean
}