"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import api from "@/service/api"
import { BannedCardResponse, ListArticlesUsersResponse } from "./types"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog"
import { Calendar } from "@/components/ui/calendar"
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

// Mock articles data
const articlesApi = await api.get(`/articles/users`)
const mockArticles: ListArticlesUsersResponse[] = articlesApi.data

// Mock forum topics data
const mockTopics = [
  {
    id: "1",
    title: "Melhor comandante para iniciantes?",
    author: "Pedro Alves",
    date: "15/04/2023",
    replies: 12,
  },
  {
    id: "2",
    title: "Dúvida sobre regra de substituição",
    author: "Ana Costa",
    date: "12/04/2023",
    replies: 8,
  },
  {
    id: "3",
    title: "Alternativas budget para Rhystic Study",
    author: "Lucas Mendes",
    date: "10/04/2023",
    replies: 15,
  },
]

// Mock banned cards data
// const mockBannedCards = [
//   {
//     id: "1",
//     name: "Sol Ring",
//     reason: "Poder excessivo nos primeiros turnos",
//     date: "01/01/2023",
//   },
//   {
//     id: "2",
//     name: "Mana Crypt",
//     reason: "Poder excessivo nos primeiros turnos",
//     date: "01/01/2023",
//   },
//   {
//     id: "3",
//     name: "Dockside Extortionist",
//     reason: "Geração de mana desproporcional",
//     date: "01/01/2023",
//   },
// ]

export function ContentManagement() {
  const [articles, setArticles] = useState(mockArticles)
  const [topics, setTopics] = useState(mockTopics)
  const [bannedCards, setBannedCards] = useState<(BannedCardResponse)[]>([])
  const [newBannedCard, setNewBannedCard] = useState({
    name: "",
    reason: "",
  })
  const [selected, setSelected] = useState<Date>();
  const [deleteArticle, setDeleteArticle] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBannedCards() {
      const response = await api.get("/bans")
      setBannedCards(response.data)
    }

    fetchBannedCards()
  }, [])

  const handleAddBannedCard = async () => {
    const id = (bannedCards.length + 1).toString()
    const date = new Date().toLocaleDateString()

    setBannedCards([...bannedCards, { ...newBannedCard, id, date } as BannedCardResponse & { id: string; date: string }])
    setNewBannedCard({ name: "", reason: "" })
  }

  const handleDelete = async (id: string) => {
    setDeleteArticle(id)
  }

  const cancelDelete = () => {
    setDeleteArticle(null)
  }

  const confirmDelete = async () => {
    if (deleteArticle) {
      const articleToDelete = articles?.find((a) => a.id === deleteArticle)
      try {
        const response = await api.delete(`/articles`, {
          data: { id: articleToDelete?.id },
        })

        if (response.status !== 200) {
          throw new Error("Failed to delete article")
        }

      } catch (error) {
        console.error(error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao tentar excluir o usuário.",
          variant: "destructive",
        })
      }
      setArticles(articles?.filter((a) => a.id !== deleteArticle))
      toast({
        title: "Artigo removido",
        description: `${deleteArticle} foi removido com sucesso.`,
      })
      setDeleteArticle(null)
    }
  }

  return (
    <Tabs defaultValue="articles">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="articles">Artigos</TabsTrigger>
        <TabsTrigger value="forum">Fórum</TabsTrigger>
        <TabsTrigger value="banned">Lista de Banimentos</TabsTrigger>
      </TabsList>

      <TabsContent value="articles" className="space-y-4">
        <div className="flex justify-end">
          <Button>
            <Link href={`/articles/create`}>
              Criar Artigo
            </Link>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.author}</TableCell>
                <TableCell>{article.date}</TableCell>
                <TableCell>{article.status === "published" ? "Publicado" : "Rascunho"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Link href={`/articles/edit/${article.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="forum" className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Respostas</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.title}</TableCell>
                <TableCell>{topic.author}</TableCell>
                <TableCell>{topic.date}</TableCell>
                <TableCell>{topic.replies}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="banned" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Card Banido</CardTitle>
            <CardDescription>Adicione um novo card à lista de banimentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Nome do Card</Label>
              <Input
                id="card-name"
                value={newBannedCard.name}
                onChange={(e) => setNewBannedCard({ ...newBannedCard, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-reason">Motivo do Banimento</Label>
              <Textarea
                id="card-reason"
                value={newBannedCard.reason}
                onChange={(e) => setNewBannedCard({ ...newBannedCard, reason: e.target.value })}
              />
            </div>
            <div className="flex justify-center border rounded-md p-1">
              <DayPicker
              animate
              mode="single"
              selected={selected}
              onSelect={setSelected}
              footer={
                selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
              }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddBannedCard}>Adicionar à Lista</Button>
          </CardFooter>
        </Card>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Card</TableHead>
              <TableHead>Motivo do Banimento</TableHead>
              <TableHead>Data do Banimento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bannedCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell className="font-medium">{card.name}</TableCell>
                <TableCell>{card.reason}</TableCell>
                <TableCell>{card.date}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <AlertDialog open={deleteArticle !== null} onOpenChange={() => setDeleteArticle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}