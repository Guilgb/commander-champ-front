export interface CommanderRankingResponse {
  id: string;
  name: string;
  username: string;
  commander: string;
  champion: number;
  winrate: number;
  wins: number;
  losses: number;
  draws: number;
  entries: number;
  colors: string;
  partner: string;
  start_date: string;
  end_date: string;
}