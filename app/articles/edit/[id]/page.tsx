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

// Mock articles data - same as in the articles page
const articles = [
  {
    id: "1",
    title: "Top 10 Comandantes Abaixo de R$10",
    excerpt: "Descubra comandantes poderosos que não vão pesar no seu bolso e ainda são competitivos.",
    content: `
# Top 10 Comandantes Abaixo de R$10

Construir um deck de Commander competitivo não precisa custar uma fortuna. Neste artigo, vamos explorar 10 comandantes que custam menos de R$10 e ainda assim podem liderar decks poderosos no formato Commander 500.

## 1. Zada, Hedron Grinder @{Zada, Hedron Grinder}

Este goblin de 3/3 por apenas 4 manas tem uma habilidade poderosa: quando você conjura uma mágica instantânea ou feitiço que tem como alvo apenas Zada, copie essa mágica para cada outra criatura que você controla. Cada uma dessas cópias tem como alvo a criatura correspondente.

Com mágicas baratas como @{Expedite}, @{Crimson Wisps} e @{Titan's Strength}, você pode transformar um exército de tokens em uma ameaça letal em um único turno.

## 2. Syr Konrad, the Grim @{Syr Konrad, the Grim}

Este cavaleiro negro causa 1 ponto de dano a cada oponente sempre que uma criatura morre ou um card de criatura sai do seu cemitério. Combine-o com efeitos de moer cards e sacrifício para causar danos massivos.

## 3. Tatyova, Benthic Druid @{Tatyova, Benthic Druid}

Esta druida permite que você compre um card e ganhe 1 ponto de vida sempre que um terreno entra em jogo sob seu controle. Em um deck focado em jogar terrenos adicionais, ela proporciona vantagem de card constante.

## 4. Feather, the Redeemed @{Feather, the Redeemed}

Feather permite que você recupere para sua mão mágicas instantâneas e feitiços que têm como alvo uma criatura que você controla. Isso cria um motor de vantagem de card incrível com mágicas baratas.

## 5. Talrand, Sky Summoner @{Talrand, Sky Summoner}

Este mago merfolk cria um token de Drake 2/2 voador sempre que você conjura uma mágica instantânea ou feitiço. Um deck cheio de contramágicas e remoções baratas pode rapidamente construir um exército aéreo.

## Conclusão

Estes comandantes provam que você não precisa gastar muito para ter um deck competitivo no Commander 500. Com a estratégia certa e cards de suporte bem escolhidos, estes líderes baratos podem proporcionar jogos divertidos e vitórias consistentes.
    `,
    date: "10/04/2023",
    author: {
      name: "João Silva",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["budget", "comandantes", "iniciantes"],
  },
  {
    id: "2",
    title: "Guia de Construção para Iniciantes",
    excerpt: "Aprenda a construir seu primeiro deck de Commander 500 com este guia passo a passo.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    date: "05/04/2023",
    author: {
      name: "Maria Souza",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["guia", "iniciantes", "construção"],
  },
  {
    id: "3",
    title: "Análise do Meta Pós-Banimentos",
    excerpt: "Como o meta evoluiu após os últimos banimentos e quais estratégias estão em alta.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    date: "01/04/2023",
    author: {
      name: "Carlos Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["meta", "análise", "banimentos"],
  },
]

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
    // Check if user is authenticated and has editor or admin role
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

    // In a real app, fetch article data based on params.id
    setIsLoading(true)
    const foundArticle = articles.find((a) => a.id === params.id)

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

