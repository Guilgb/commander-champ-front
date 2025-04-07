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