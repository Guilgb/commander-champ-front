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
import { MyDatePicker } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const mockTopics = [
  {
    id: "1",
    title: "Melhor comandante para iniciantes?",
    author: "Pedro Alves",
    date: "15/04/2023",
    replies: 12,
  }
]

export function ContentManagement() {
  const [articles, setArticles] = useState<ListArticlesUsersResponse[]>([])
  const [topics, setTopics] = useState(mockTopics)
  const [bannedCards, setBannedCards] = useState<(BannedCardResponse)[]>([])
  const [newBannedCard, setNewBannedCard] = useState({
    name: "",
    reason: "",
    ban_date: "",
  })
  const [selected, setSelected] = useState<Date>();
  const [deleteArticle, setDeleteArticle] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBannedCards() {
      const response = await api.get("/bans")
      setBannedCards(response.data)
    }
    async function fetchArticles() {
      const responseArticles = await api.get("/articles/users")
      setArticles(responseArticles.data)
    }
    fetchArticles()
    fetchBannedCards()
  }, [])

  const handleAddBannedCard = async () => {
    try {
      const response = await api.post("/bans", {
        card_name: newBannedCard.name,
        reason: newBannedCard.reason,
        ban_date: selected ? selected.toISOString().split("T")[0] : "",
      });

      if (response.status !== 201) {
        throw new Error("Failed to add banned card");
      }

      const newCard = response.data;
      setBannedCards([...bannedCards, newCard]);
      setNewBannedCard({ name: "", reason: "", ban_date: "" });
      setSelected(undefined);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar adicionar o card banido.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBannedCard = async (id: string) => {
    try {
      const response = await api.delete(`/bans`, {
        data: { id: id },
      });

      if (response.status !== 200) {
        throw new Error("Failed to delete banned card");
      }

      setBannedCards(bannedCards.filter((card) => card.id !== id));
      toast({
        title: "Card removido",
        description: "O card foi removido com sucesso.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar remover o card banido.",
        variant: "destructive",
      });
    }
  };

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
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="card-name">Nome do Card</Label>
                <Input
                  id="card-name"
                  value={newBannedCard.name}
                  onChange={(e) => setNewBannedCard({ ...newBannedCard, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Data do Banimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {selected ? (
                        <span>{selected.toLocaleDateString("pt-BR")}</span>
                      ) : (
                        <span className="text-muted-foreground">Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="transform scale-90 origin-top-left">
                      <MyDatePicker
                        selected={selected}
                        onSelect={setSelected}
                        mode="single"
                        className="max-w-[280px]"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="card-reason">Motivo do Banimento</Label>
              <Textarea
                id="card-reason"
                value={newBannedCard.reason}
                onChange={(e) => setNewBannedCard({ ...newBannedCard, reason: e.target.value })}
                className="min-h-[150px]"
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
                  <Button variant="outline" size="sm" onClick={() => handleDeleteBannedCard(card.id)}>
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