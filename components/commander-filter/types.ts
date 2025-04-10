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
  type_line?: string
  oracle_text?: string
}

export interface ScryfallResponse {
  data: ScryfallCard[]
  has_more: boolean
}