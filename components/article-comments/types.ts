export interface Comment {
  id: string
  author: {
    name: string
    avatar: string
  }
  date: string
  content: string
}

export interface ArticleCommentsProps {
  articleId: string
  initialComments: Comment[]
}