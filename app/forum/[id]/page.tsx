"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

// Mock data for a forum topic
const mockTopic = {
  id: "1",
  title: "Melhor comandante para iniciantes?",
  content:
    "Estou começando no formato Commander 500 e gostaria de recomendações de comandantes que sejam fáceis de jogar e montar dentro do orçamento. Idealmente algo que não seja muito complexo de pilotar mas que ainda seja competitivo nos torneios locais. Alguma sugestão?",
  date: "15/04/2023",
  author: {
    name: "Pedro Alves",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  replies: [
    {
      id: "r1",
      content:
        "Recomendo fortemente o Gishath, Sun's Avatar para iniciantes. É um deck de dinossauros tribal que é muito direto: bater com o comandante e colocar dinossauros em jogo. A estratégia é simples e divertida!",
      date: "15/04/2023",
      author: {
        name: "Rafael Oliveira",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "r2",
      content:
        "Atraxa, Praetors' Voice é uma ótima opção também. Você pode construir um deck de contadores que é relativamente barato e tem um bom poder de escala no jogo.",
      date: "16/04/2023",
      author: {
        name: "Ana Costa",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "r3",
      content:
        "Se você gosta de controle, Talrand, Sky Summoner é uma excelente opção budget. Você pode construir um deck cheio de instants e sorceries baratos e gerar valor com os drakes.",
      date: "16/04/2023",
      author: {
        name: "Lucas Mendes",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ],
}

export default function ForumTopicPage() {
  const params = useParams()
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const [topic, setTopic] = useState(mockTopic)
  const [newReply, setNewReply] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
  }, [params.id])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para responder a este tópico.",
        variant: "destructive",
      })
      return
    }

    if (!newReply.trim()) {
      toast({
        title: "Resposta vazia",
        description: "Por favor, escreva uma resposta antes de enviar.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add the new reply to the topic
    const newReplyObj = {
      id: `r${topic.replies.length + 1}`,
      content: newReply,
      date: new Date().toLocaleDateString(),
      author: {
        name: user?.name || "Usuário",
        avatar: user?.image || "/placeholder.svg?height=40&width=40",
      },
    }

    setTopic((prev) => ({
      ...prev,
      replies: [...prev.replies, newReplyObj],
    }))

    setNewReply("")
    setIsSubmitting(false)

    toast({
      title: "Resposta enviada",
      description: "Sua resposta foi publicada com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{topic.title}</CardTitle>
          <CardDescription>
            {topic.date} • por {topic.author.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
              <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p>{topic.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mt-8">Respostas ({topic.replies.length})</h2>

      <div className="space-y-4">
        {topic.replies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader className="py-4">
              <CardDescription>
                {reply.date} • por {reply.author.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                  <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <p>{reply.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Responder</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmitReply}>
          <CardContent>
            <Textarea
              placeholder="Escreva sua resposta aqui..."
              className="min-h-[100px]"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              disabled={!isAuthenticated || isSubmitting}
            />
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-2">
                Você precisa estar logado para responder a este tópico.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!isAuthenticated || isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Resposta"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

