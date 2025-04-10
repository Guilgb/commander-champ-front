export interface ScryfallCard {
  name: string
  image_uris?: {
    small: string
  }
  card_faces?: Array<{
    name: string
    image_uris?: {
      small: string
    }
  }>
}

export interface ScryfallResponse {
  data: ScryfallCard[]
  has_more: boolean
}