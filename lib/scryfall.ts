// Tipos para os dados do Scryfall
export interface ScryfallCard {
  id: string
  name: string
  image_uris?: {
    small: string
    normal: string
    large: string
    png: string
    art_crop: string
    border_crop: string
  }
  card_faces?: Array<{
    name: string
    image_uris?: {
      small: string
      normal: string
      large: string
      png: string
      art_crop: string
      border_crop: string
    }
  }>
  mana_cost: string
  type_line: string
  oracle_text?: string
  colors: string[]
  color_identity: string[]
  rarity: string
  prices: {
    usd?: string
    usd_foil?: string
    eur?: string
    tix?: string
  }
  legalities: Record<string, string>
  set_name: string
  set: string
}

export async function getCardByName(cardName: string): Promise<ScryfallCard | null> {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`)

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Card not found: ${cardName}`)
        return null
      }
      throw new Error(`Scryfall API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching card data:", error)
    return null
  }
}

export async function getCardsByNames(cardNames: string[]): Promise<Record<string, ScryfallCard>> {
  const result: Record<string, ScryfallCard> = {}

  const batchSize = 5

  for (let i = 0; i < cardNames.length; i += batchSize) {
    const batch = cardNames.slice(i, i + batchSize)
    const promises = batch.map((name) => getCardByName(name))

    const cards = await Promise.all(promises)

    cards.forEach((card, index) => {
      if (card) {
        result[batch[index]] = card
      }
    })

    if (i + batchSize < cardNames.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  return result
}


export function getCardPriceBRL(card: ScryfallCard): number {
  const usdPrice = Number.parseFloat(card.prices.usd || "0")
  const conversionRate = 5.0
  return usdPrice * conversionRate
}

export function getCardImageUrl(card: ScryfallCard, size: "small" | "normal" | "large" = "normal"): string {
  if (!card.image_uris && card.card_faces && card.card_faces[0].image_uris) {
    return card.card_faces[0].image_uris.art_crop
  }

  return card.image_uris?.art_crop || "/placeholder.svg?height=300&width=215"
}

export function getCardNormalImageUrl(card: ScryfallCard, size: "small" | "normal" | "large" = "normal"): string {
  if (!card.image_uris && card.card_faces && card.card_faces[0].image_uris) {
    return card.card_faces[0].image_uris.normal
  }

  return card.image_uris?.normal || "/placeholder.svg?height=300&width=215"
}

export function getCardColor(card: ScryfallCard): string {
  const colorMap: Record<string, string> = {
    W: "#F9FAF4", // Branco
    U: "#0E68AB", // Azul
    B: "#150B00", // Preto
    R: "#D3202A", // Vermelho
    G: "#00733E", // Verde
    multi: "#BFA575", // Multicolorido
    colorless: "#A9A9A9", // Incolor
  }

  if (card.color_identity.length === 0) {
    return colorMap.colorless
  } else if (card.color_identity.length > 1) {
    return colorMap.multi
  } else {
    return colorMap[card.color_identity[0]] || colorMap.colorless
  }
}

export async function getCardImageByName(cardName: string, size: "small" | "normal" | "large" = "normal"): Promise<string | null> {
  const card = await getCardByName(cardName)
  if (!card) {
    return null
  }
  return getCardImageUrl(card, size)
}