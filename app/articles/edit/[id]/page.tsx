"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { MarkdownEditor } from "@/components/markdown-editor"
import { HelpCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import api from "@/service/api"

const articlesApi = await api.get(`/articles`)
const articles = articlesApi.data


export default function EditArticlePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role !== "EDITOR" && user?.role !== "ADMIN") {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para editar artigos.",
          variant: "destructive",
        })
        router.push("/articles")
      }
    } else {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado como editor para editar artigos.",
        variant: "destructive",
      })
      router.push("/login")
    }

    setIsLoading(true)
    const foundArticle = articles.find((a: { id: string | string[] | undefined }) => a.id === params.id)

    if (foundArticle) {
      setArticle(foundArticle)
      setFormData({
        title: foundArticle.title,
        excerpt: foundArticle.excerpt,
        content: foundArticle.content,
        tags: foundArticle.tags.join(", "),
      })
    } else {
      // Article not found, redirect to articles page
      toast({
        title: "Artigo não encontrado",
        description: "O artigo que você está tentando editar não foi encontrado.",
        variant: "destructive",
      })
      router.push("/articles")
    }

    setIsLoading(false)
  }, [params.id, router, isAuthenticated, user, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSaving(false)

    toast({
      title: "Artigo atualizado",
      description: "O artigo foi atualizado com sucesso.",
    })

    router.push(`/articles/${params.id}`)
  }

  if (isLoading || !article) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Carregando artigo...</p>
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== "EDITOR" && user?.role !== "ADMIN")) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Artigo</h1>

      <Alert className="mb-6">
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>Dicas para edição de artigos</AlertTitle>
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
            <CardTitle>Editar Artigo</CardTitle>
            <CardDescription>Atualize as informações do artigo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Input id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <MarkdownEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Conteúdo do artigo..."
                minHeight="400px"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

