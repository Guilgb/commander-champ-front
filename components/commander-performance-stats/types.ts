export type CommanderPerformaceResponse = {
  id: string
  commander: string
  tournament_id: number
  entries: number
  top8: number
  top4: number
  champion: number
  colors: string
  winrate: number
}

export interface ItensResponse {
  id: number;
  commander: string;
  partner: string;
  tournament_id: number;
  entries: number;
  top8: number;
  top4: number;
  champion: number;
  cmc: number;
  colors: string[];
  date: string;
}