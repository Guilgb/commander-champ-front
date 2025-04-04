"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, Calendar, Edit } from "lucide-react"
import Link from "next/link"
import { ArticleComments } from "@/components/article-comments"
import api from "@/service/api"

const articlesApi = await api.get(`/articles`)
console.log(articlesApi.data)
const articles = articlesApi.data

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const foundArticle = articles.find((a: { id: string | string[] | undefined }) => a.id === params.id)

    if (foundArticle) {
      setArticle(foundArticle)
    } else {
      router.push("/articles")
    }

    setIsLoading(false)
  }, [params.id, router])

  if (isLoading || !article) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Carregando artigo...</p>
      </div>
    )
  }

  const canEdit = isAuthenticated && (user?.role === "EDITOR" || user?.role === "ADMIN")

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold">{article.title}</h1>
          {canEdit && (
            <Button asChild>
              <Link href={`/articles/edit/${article.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Artigo
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{article.author.name}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{article.date}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div
            className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <h2 className="text-2xl font-bold mb-4">Comentários</h2>
      <ArticleComments articleId={article.id} initialComments={article.comments || []} />
    </div>
  )
}

