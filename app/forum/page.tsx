"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ForumCreateButton } from "@/components/forum-create-button"
import { Search } from "lucide-react"
import { useState } from "react"

const forumTopics = [
  {
    id: "1",
    title: "Melhor comandante para iniciantes?",
    excerpt: "Estou começando no formato e gostaria de recomendações de comandantes fáceis de jogar e montar.",
    date: "15/04/2023",
    author: {
      name: "Pedro Alves",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    replies: 12,
    views: 156,
  },
  {
    id: "2",
    title: "Dúvida sobre regra de substituição",
    excerpt: "Como funciona exatamente a regra de substituição de comandante no Commander 500?",
    date: "12/04/2023",
    author: {
      name: "Ana Costa",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    replies: 8,
    views: 94,
  },
  {
    id: "3",
    title: "Alternativas budget para Rhystic Study",
    excerpt: "Quais são as melhores alternativas de baixo custo para Rhystic Study no formato?",
    date: "10/04/2023",
    author: {
      name: "Lucas Mendes",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    replies: 15,
    views: 203,
  },
  {
    id: "4",
    title: "Próximo torneio em São Paulo",
    excerpt: "Alguém sabe quando será o próximo torneio de Commander 500 em São Paulo?",
    date: "08/04/2023",
    author: {
      name: "Juliana Santos",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    replies: 6,
    views: 87,
  },
  {
    id: "5",
    title: "Deck tech: Gishath, Sun's Avatar",
    excerpt: "Compartilhando meu deck de dinossauros com Gishath que ficou abaixo de R$450.",
    date: "05/04/2023",
    author: {
      name: "Rafael Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    replies: 9,
    views: 142,
  },
]

export default function ForumPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter topics based on search term
  const filteredTopics = forumTopics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fórum</h1>
        <ForumCreateButton />
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar tópicos..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <Card key={topic.id}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/forum/${topic.id}`} className="hover:underline">
                    {topic.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {topic.date} • {topic.replies} respostas • {topic.views} visualizações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">{topic.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                    <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{topic.author.name}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/forum/${topic.id}`}>Ver discussão</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Nenhum tópico encontrado para "{searchTerm}"</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

