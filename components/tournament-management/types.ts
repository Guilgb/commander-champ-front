export interface TournamentList {
  id: number;
  name: string;
  date: string;
  location: string;
  players: string;
  players_number: number;
  status: string;
}

interface Players {
  colors: string;
  commander: string;
  draws: number;
  id: number;
  isWinner: boolean;
  losses: number;
  name: string;
  partner: string | null;
  wins: number;
}
