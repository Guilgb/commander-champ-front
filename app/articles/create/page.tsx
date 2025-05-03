"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { MarkdownEditor } from "@/components/markdown-editor"
import { HelpCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/service/api"

export default function CreateArticlePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    topic_id: 2, // Valor padrão
    read_time: "5 min", // Valor padrão
    featured: false,
    cover_image: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role !== "EDITOR" && user?.role !== "ADMIN") {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para criar artigos.",
          variant: "destructive",
        })
        router.push("/")
      }
    } else {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado como editor para criar artigos.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [isAuthenticated, user, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.excerpt || !formData.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const articleData = {
      ...formData,
      user_id: user?.id || 4,
      views: 1,
      comments: 0,
    }
    try {
      const {
        content,
        title,
        topic_id,
        excerpt,
        read_time,
        featured,
        cover_image,
        tags,
      } = formData

      const response = await api.post(`/articles`, {
        content,
        title,
        user_id: user?.id,
        excerpt,
        topic_id,
        read_time,
        views: 0,
        comments: 0,
        featured,
        cover_image,
        tags
      })

    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar criar o artigo.",
        variant: "destructive",
      })

    }
    await new Promise((resolve) => setTimeout(resolve, 1500))


    setIsSubmitting(false)
    // Limpar o formulário para permitir a criação de um novo artigo
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      topic_id: 2,
      read_time: "5 min",
      featured: false,
      cover_image: "",
    })

    toast({
      title: "Artigo criado",
      description:
        "Seu artigo foi publicado com sucesso. Você pode criar outro artigo ou navegar para a lista de artigos.",
    })
  }

  if (!isAuthenticated || (user?.role !== "EDITOR" && user?.role !== "ADMIN")) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Criar Artigo</h1>

      <Alert className="mb-6">
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>Dicas para criação de artigos</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              Use <strong>@{"{nome do card}"}</strong> para inserir imagens de cards automaticamente.
            </li>
            <li>Utilize a barra de ferramentas para formatar seu texto com Markdown.</li>
            <li>Alterne entre as abas "Escrever" e "Visualizar" para ver como seu artigo ficará.</li>
            <li>
              Clique no ícone <HelpCircle className="inline h-3 w-3" /> para acessar a documentação completa do
              Markdown.
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Novo Artigo</CardTitle>
            <CardDescription>Crie um novo artigo para o Commander 500</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Título do artigo"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Input
                id="excerpt"
                name="excerpt"
                placeholder="Um breve resumo do artigo"
                value={formData.excerpt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <MarkdownEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Escreva o conteúdo do seu artigo aqui..."
                minHeight="400px"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="commander, budget, estratégia"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic_id">Tópico</Label>
              <Select
                value={formData.topic_id.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, topic_id: Number.parseInt(value) }))}
              >
                <SelectTrigger id="topic_id">
                  <SelectValue placeholder="Selecione um tópico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">Estratégia</SelectItem>
                  <SelectItem value="5">Deck Tech</SelectItem>
                  <SelectItem value="7">Meta</SelectItem>
                  <SelectItem value="8">Budget</SelectItem>
                  <SelectItem value="9">Comunidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="read_time">Tempo de Leitura</Label>
              <Input
                id="read_time"
                name="read_time"
                placeholder="5 min"
                value={formData.read_time}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">URL da Imagem de Capa</Label>
              <Input
                id="cover_image"
                name="cover_image"
                placeholder="https://exemplo.com/imagem.jpg"
                value={formData.cover_image}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked === true }))}
              />
              <Label htmlFor="featured">Destacar artigo na página inicial</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publicando..." : "Publicar Artigo"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}