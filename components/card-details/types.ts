import { type ScryfallCard, getCardImageUrl } from "@/lib/scryfall"

export interface CardDetailsProps {
  cardName: string
  cardData?: ScryfallCard
  onClose: () => void
  popularityData?: {
    count: number
    percentage: number
  }
}

export interface CardsDataResponse {
  card_name: string
  commander: string
  color: string[]
  winrate: string
  popularityDatas: {
    decks_card_count: number
    decks_count: number
    use_percent: number
  }
}