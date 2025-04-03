"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MessageSquare, Clock, Calendar, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UserArticlesProps {
  userId: string
}

// Mock data para artigos do usuário
const mockUserArticles = [
  {
    id: "1",
    title: "Top 1 Comandantes Abaixo de R$11",
    excerpt: "Descubra comandantes poderosos que não vão pesar no seu bolso e ainda são competitivos.",
    date: "10/04/2025",
    readTime: "8 min",
    views: 1250,
    comments: 24,
    status: "published",
    coverImage: "/placeholder.svg?height=400&width=800",
    tags: ["budget", "comandantes", "iniciantes"],
  },
  {
    id: "2",
    title: "Guia de Construção para Iniciantes",
    excerpt: "Aprenda a construir seu primeiro deck de Commander 500 com este guia passo a passo.",
    date: "05/04/2023",
    readTime: "12 min",
    views: 980,
    comments: 18,
    status: "published",
    coverImage: "/placeholder.svg?height=400&width=800",
    tags: ["guia", "iniciantes", "construção"],
  },
  {
    id: "3",
    title: "Análise do Meta Pós-Banimentos",
    excerpt: "Como o meta evoluiu após os últimos banimentos e quais estratégias estão em alta.",
    date: "01/04/2023",
    readTime: "10 min",
    views: 850,
    comments: 15,
    status: "published",
    coverImage: "/placeholder.svg?height=400&width=800",
    tags: ["meta", "análise", "banimentos"],
  },
  {
    id: "4",
    title: "Estratégias Avançadas com Yuriko",
    excerpt: "Técnicas e dicas para maximizar o potencial de Yuriko, the Tiger's Shadow.",
    date: "20/03/2023",
    readTime: "15 min",
    views: 720,
    comments: 12,
    status: "draft",
    coverImage: "/placeholder.svg?height=400&width=800",
    tags: ["estratégia", "avançado", "ninjas"],
  },
]

export function UserArticles({ userId }: UserArticlesProps) {
  const [articles, setArticles] = useState(mockUserArticles)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const { toast } = useToast()

  // Filtrar artigos com base nos critérios
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || article.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Ordenar artigos
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.date.split("/").reverse().join("-")).getTime() -
        new Date(a.date.split("/").reverse().join("-")).getTime()
      )
    } else if (sortBy === "views") {
      return b.views - a.views
    } else if (sortBy === "comments") {
      return b.comments - a.comments
    }
    return 0
  })

  const handleDeleteArticle = (articleId: string) => {
    setArticles(articles.filter((article) => article.id !== articleId))
    toast({
      title: "Artigo excluído",
      description: "O artigo foi excluído com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar artigos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="published">Publicados</SelectItem>
              <SelectItem value="draft">Rascunhos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="views">Visualizações</SelectItem>
              <SelectItem value="comments">Comentários</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Seus Artigos ({filteredArticles.length})</h2>
        <Button asChild>
          <Link href="/articles/create">Criar Novo Artigo</Link>
        </Button>
      </div>

      {sortedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedArticles.map((article) => (
            <Card key={article.id} className="flex flex-col h-full overflow-hidden">
              <div className="relative">
                <img
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />
                {article.status === "draft" && <Badge className="absolute top-2 right-2 bg-yellow-500">Rascunho</Badge>}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">
                  <Link href={`/articles/${article.id}`} className="hover:underline">
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {article.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.readTime}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="line-clamp-2 text-sm">{article.excerpt}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {article.views}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {article.comments}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/articles/edit/${article.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir artigo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteArticle(article.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="mb-4 text-muted-foreground">Nenhum artigo encontrado com os filtros atuais.</p>
            {searchTerm || statusFilter !== "all" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Limpar filtros
              </Button>
            ) : (
              <Button asChild>
                <Link href="/articles/create">Criar seu primeiro artigo</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}