"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { FeaturedArticles } from "@/components/featured-articles"
import { Bookmark, Calendar, Clock, Eye, MessageSquare, Search, Tag } from "lucide-react"
import { useState } from "react"
import api from '@/service/api'
import { Articles } from "./types"
import { useEffect } from "react"

const categories = [
  { id: "all", name: "Todos" },
  { id: "strategy", name: "Estratégia" },
  { id: "deck-tech", name: "Deck Tech" },
  { id: "meta", name: "Meta" },
  { id: "budget", name: "Budget" },
  { id: "community", name: "Comunidade" },
]

export default function ArticlesPage() {
  // todo tipar o article
  const [articles, setArticles] = useState<Articles[] | undefined>()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    api
      .get("/articles")
      .then((res) => {
        setArticles(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Filtrar artigos em destaque
  const featuredArticles = articles?.filter((article) => article.featured)

  // Ordenar artigos por data (mais recentes primeiro)
  const latestArticles = [...(articles ?? [])].sort(
    (a, b) =>
      new Date(b.date.split("/").reverse().join("-")).getTime() -
      new Date(a.date.split("/").reverse().join("-")).getTime(),
  )

  // Filter articles based on search term
  const filteredArticles = latestArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Artigos</h1>
          <p className="text-muted-foreground">Conteúdo exclusivo sobre o formato Commander 500</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar artigos por título, conteúdo ou tags..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Seção de artigos em destaque - só mostrar se não estiver pesquisando */}
      {!searchTerm && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Em Destaque</h2>
          <FeaturedArticles articles={featuredArticles ?? []} />
        </section>
      )}

      {/* Navegação por categorias */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Tag className="h-4 w-4 mr-1" />
              Tags
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Data
            </Button>
          </div>
        </div>

        {/* Conteúdo das abas */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles
                .filter((article) => category.id === "all" || article.tags.includes(category.id))
                .map((article) => (
                  <Card key={article.id} className="flex flex-col h-full overflow-hidden group">
                    <div className="relative overflow-hidden">
                      <img
                        src={article.coverImage || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-sm">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 2 && (
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                              +{article.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/articles/${article.id}`} className="hover:underline">
                          {article.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime}
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow">
                      <p className="line-clamp-3 text-sm">{article.excerpt}</p>
                    </CardContent>

                    <CardFooter className="pt-0 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={article.author.avatar} alt={article.author.name} />
                          <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{article.author.name}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.views}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {article.comments}
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>

            {filteredArticles.filter((article) => category.id === "all" || article.tags.includes(category.id))
              .length === 0 && (
                <div className="text-center p-8 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `Nenhum artigo encontrado para "${searchTerm}" nesta categoria.`
                      : "Nenhum artigo encontrado nesta categoria."}
                  </p>
                </div>
              )}

            {filteredArticles.filter((article) => category.id === "all" || article.tags.includes(category.id)).length >
              0 && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline">Carregar mais artigos</Button>
                </div>
              )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

