import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const articles = [
  {
    id: "1",
    title: "Top 11 Comandantes Abaixo de R$11",
    excerpt: "Descubra comandantes poderosos que não vão pesar no seu bolso e ainda são competitivos.",
    date: "10/04/2023",
    author: {
      name: "João Silva",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "2",
    title: "Guia de Construção para Iniciantes",
    excerpt: "Aprenda a construir seu primeiro deck de Commander 500 com este guia passo a passo.",
    date: "05/04/2023",
    author: {
      name: "Maria Souza",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "3",
    title: "Análise do Meta Pós-Banimentos",
    excerpt: "Como o meta evoluiu após os últimos banimentos e quais estratégias estão em alta.",
    date: "01/04/2023",
    author: {
      name: "Carlos Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export function RecentArticles() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Card key={article.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription>{article.date}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>{article.excerpt}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={article.author.avatar} alt={article.author.name} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{article.author.name}</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/articles/${article.id}`}>Ler mais</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

