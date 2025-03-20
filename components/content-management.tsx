"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock articles data
const mockArticles = [
  {
    id: "1",
    title: "Top 10 Comandantes Abaixo de R$10",
    author: "João Silva",
    date: "10/04/2023",
    status: "published",
  },
  {
    id: "2",
    title: "Guia de Construção para Iniciantes",
    author: "Maria Souza",
    date: "05/04/2023",
    status: "published",
  },
  {
    id: "3",
    title: "Análise do Meta Pós-Banimentos",
    author: "Carlos Oliveira",
    date: "01/04/2023",
    status: "published",
  },
]

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
const mockBannedCards = [
  {
    id: "1",
    name: "Sol Ring",
    reason: "Poder excessivo nos primeiros turnos",
    date: "01/01/2023",
  },
  {
    id: "2",
    name: "Mana Crypt",
    reason: "Poder excessivo nos primeiros turnos",
    date: "01/01/2023",
  },
  {
    id: "3",
    name: "Dockside Extortionist",
    reason: "Geração de mana desproporcional",
    date: "01/01/2023",
  },
]

export function ContentManagement() {
  const [articles, setArticles] = useState(mockArticles)
  const [topics, setTopics] = useState(mockTopics)
  const [bannedCards, setBannedCards] = useState(mockBannedCards)
  const [newBannedCard, setNewBannedCard] = useState({
    name: "",
    reason: "",
  })

  const handleAddBannedCard = () => {
    const id = (bannedCards.length + 1).toString()
    const date = new Date().toLocaleDateString()

    setBannedCards([...bannedCards, { ...newBannedCard, id, date }])
    setNewBannedCard({ name: "", reason: "" })
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
          <Button>Criar Artigo</Button>
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
                      Editar
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
    </Tabs>
  )
}

