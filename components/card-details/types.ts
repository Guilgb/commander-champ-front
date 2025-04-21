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