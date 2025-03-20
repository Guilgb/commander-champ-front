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

// Mock articles data - same as in the articles page
const articles = [
  {
    id: "1",
    title: "Top 10 Comandantes Abaixo de R$10",
    excerpt: "Descubra comandantes poderosos que não vão pesar no seu bolso e ainda são competitivos.",
    content: `
      <h2>Introdução</h2>
      <p>Construir um deck de Commander competitivo não precisa custar uma fortuna. Neste artigo, vamos explorar 10 comandantes que custam menos de R$10 e ainda assim podem liderar decks poderosos no formato Commander 500.</p>
      
      <h2>1. Zada, Hedron Grinder</h2>
      <p>Este goblin de 3/3 por apenas 4 manas tem uma habilidade poderosa: quando você conjura uma mágica instantânea ou feitiço que tem como alvo apenas Zada, copie essa mágica para cada outra criatura que você controla. Cada uma dessas cópias tem como alvo a criatura correspondente.</p>
      <p>Com mágicas baratas como Expedite, Crimson Wisps e Titan's Strength, você pode transformar um exército de tokens em uma ameaça letal em um único turno.</p>
      
      <h2>2. Syr Konrad, the Grim</h2>
      <p>Este cavaleiro negro causa 1 ponto de dano a cada oponente sempre que uma criatura morre ou um card de criatura sai do seu cemitério. Combine-o com efeitos de moer cards e sacrifício para causar danos massivos.</p>
      
      <h2>3. Tatyova, Benthic Druid</h2>
      <p>Esta druida permite que você compre um card e ganhe 1 ponto de vida sempre que um terreno entra em jogo sob seu controle. Em um deck focado em jogar terrenos adicionais, ela proporciona vantagem de card constante.</p>
      
      <h2>4. Feather, the Redeemed</h2>
      <p>Feather permite que você recupere para sua mão mágicas instantâneas e feitiços que têm como alvo uma criatura que você controla. Isso cria um motor de vantagem de card incrível com mágicas baratas.</p>
      
      <h2>5. Talrand, Sky Summoner</h2>
      <p>Este mago merfolk cria um token de Drake 2/2 voador sempre que você conjura uma mágica instantânea ou feitiço. Um deck cheio de contramágicas e remoções baratas pode rapidamente construir um exército aéreo.</p>
      
      <h2>6. Sram, Senior Edificer</h2>
      <p>Sram permite que você compre um card sempre que conjura um card de aura, equipamento ou veículo. Um deck cheio de equipamentos e auras baratas pode gerar muita vantagem de card.</p>
      
      <h2>7. Shirei, Shizo's Caretaker</h2>
      <p>Este espírito devolve ao campo de batalha criaturas com poder 1 ou menos que morreram neste turno. Combine com criaturas que têm efeitos ao entrar em jogo ou serem sacrificadas para criar loops poderosos.</p>
      
      <h2>8. Adeliz, the Cinder Wind</h2>
      <p>Esta feiticeira dá +1/+1 a todos os seus magos sempre que você conjura uma mágica instantânea ou feitiço. Um deck cheio de magos baratos e mágicas instantâneas pode rapidamente criar ameaças letais.</p>
      
      <h2>9. Siona, Captain of the Pyleas</h2>
      <p>Esta capitã permite que você olhe os sete cards do topo do seu grimório e coloque uma aura entre eles na sua mão. Além disso, sempre que uma aura entra em jogo anexada a uma criatura que você controla, você cria um token de soldado 1/1.</p>
      
      <h2>10. Eutropia the Twice-Favored</h2>
      <p>Esta ninfa dá um contador +1/+1 e voo até o final do turno a uma criatura alvo que você controla sempre que um encantamento entra em jogo sob seu controle. Um deck cheio de encantamentos baratos pode rapidamente transformar criaturas pequenas em ameaças aéreas.</p>
      
      <h2>Conclusão</h2>
      <p>Estes comandantes provam que você não precisa gastar muito para ter um deck competitivo no Commander 500. Com a estratégia certa e cards de suporte bem escolhidos, estes líderes baratos podem proporcionar jogos divertidos e vitórias consistentes.</p>
    `,
    date: "10/04/2023",
    author: {
      name: "João Silva",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["budget", "comandantes", "iniciantes"],
    comments: [
      {
        id: "c1",
        author: {
          name: "Pedro Alves",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        date: "11/04/2023",
        content:
          "Excelente artigo! Já montei um deck com Zada e realmente funciona muito bem mesmo com um orçamento limitado.",
      },
      {
        id: "c2",
        author: {
          name: "Ana Costa",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        date: "12/04/2023",
        content:
          "Adorei as sugestões! Você poderia fazer um artigo sobre as melhores cartas de suporte para esses comandantes?",
      },
    ],
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
    comments: [],
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
    comments: [],
  },
]

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch article data based on params.id
    setIsLoading(true)
    const foundArticle = articles.find((a) => a.id === params.id)

    if (foundArticle) {
      setArticle(foundArticle)
    } else {
      // Article not found, redirect to articles page
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

