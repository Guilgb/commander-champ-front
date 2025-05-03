export interface ListArticlesUsersResponse {
  id: string;
  title: string;
  author: string;
  date: string;
  status?: string;
}

export interface BannedCardResponse {
  id: string,
  name: string,
  reason: string,
  date: string,
  imageUrl: string,
}