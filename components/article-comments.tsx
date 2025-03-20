"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
  }
  date: string
  content: string
}

interface ArticleCommentsProps {
  articleId: string
  initialComments: Comment[]
}

export function ArticleComments({ articleId, initialComments }: ArticleCommentsProps) {
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para comentar neste artigo.",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Comentário vazio",
        description: "Por favor, escreva um comentário antes de enviar.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add the new comment
    const newCommentObj: Comment = {
      id: `c${comments.length + 1}`,
      content: newComment,
      date: new Date().toLocaleDateString(),
      author: {
        name: user?.name || "Usuário",
        avatar: user?.image || "/placeholder.svg?height=40&width=40",
      },
    }

    setComments([...comments, newCommentObj])
    setNewComment("")
    setIsSubmitting(false)

    toast({
      title: "Comentário enviado",
      description: "Seu comentário foi publicado com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="p-4 pb-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-sm text-muted-foreground">{comment.date}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p>{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </CardContent>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmitComment}>
          <CardContent className="p-4">
            <Textarea
              placeholder="Escreva seu comentário aqui..."
              className="min-h-[100px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!isAuthenticated || isSubmitting}
            />
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-2">
                Você precisa estar logado para comentar neste artigo.
              </p>
            )}
          </CardContent>
          <CardFooter className="px-4 pb-4 pt-0">
            <Button type="submit" disabled={!isAuthenticated || isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Comentário"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

