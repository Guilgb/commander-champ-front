export interface PopularCardData {
  id: string
  name: string
  count: number
  percentage: number
}

export interface MostUsedCards {
  id: number;
  name: string;
  colors: string[];
  cmc: number;
  type: string;
  quantity: number;
  percentage: number;
  date: string;
}