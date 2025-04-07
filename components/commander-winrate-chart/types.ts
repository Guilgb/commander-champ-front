export interface CommanderWinrateData {
  id: string
  name: string
  wins: number
  losses: number
  draws: number
  winrate: number
  colors: string
}

export interface CommanderRankingResponse {
  id: string
  commander: string,
  winrate: number,
  wins: number,
  losses: number,
  draws: number,
  entries: number,
  colors: string,
  partner: string,
}


const mockData: CommanderWinrateData[] = [
  {
    id: "1",
    name: "Omnath, Locus of Creation",
    wins: 17,
    losses: 8,
    draws: 0,
    winrate: 68,
    colors: "RGWU",
  },
]
