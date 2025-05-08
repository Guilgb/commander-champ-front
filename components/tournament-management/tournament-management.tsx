"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import api from "@/service/api"
import { TournamentList } from "./types"
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@radix-ui/react-alert-dialog"
import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog"
import { Trash2 } from "lucide-react"


const statusLabels = {
  completed: "Concluído",
  scheduled: "Agendado",
  canceled: "Cancelado",
}

const statusColors = {
  completed: "green",
  scheduled: "blue",
  canceled: "red",
}

export function TournamentManagement() {
  const [deleteTournament, setDeleteTournament] = useState<string | null>(null)
  const { toast } = useToast()

  const [tournaments, setTournaments] = useState<TournamentList[]>([])

  const handleDelete = (id: number) => {
    setDeleteTournament(id.toString())
  }

  const confirmDelete = async () => {
    if (!deleteTournament) return

    try {
      const id = Number(deleteTournament)

      const response = await api.delete(`/tournaments`, {
        data: { id },
      })

      if (response.status !== 200) {
        throw new Error("Erro ao excluir torneio")
      }

      setTournaments((prevTournaments) =>
        prevTournaments.filter((tournament) => tournament.id !== id)
      )

      toast({
        title: "Torneio removido",
        description: "O torneio foi removido com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir torneio:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar excluir o torneio.",
        variant: "destructive",
      })
    } finally {
      setDeleteTournament(null)
    }
  }

  const cancelDelete = () => {
    setDeleteTournament(null)
  }

  useEffect(() => {
    api.get(`/tournaments/list`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Erro ao carregar torneios");
        }
        setTournaments(
          response.data.map((tournament: any) => ({
            id: tournament.id,
            name: tournament.name,
            date: new Date(tournament.end_date).toLocaleDateString("pt-BR"),
          }))
        );
      })
      .catch((error) => {
        console.error("Erro ao carregar dados de torneios:", error);
      });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>Adicionar Torneio</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Jogadores</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments.map((tournament) => (
            <TableRow key={tournament.id}>
              <TableCell className="font-medium">{tournament.name}</TableCell>
              <TableCell>{tournament.date}</TableCell>
              <TableCell>{tournament.location}</TableCell>
              <TableCell>{tournament.players_number}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    tournament.status === "completed"
                      ? "default"
                      : tournament.status === "scheduled"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {statusLabels[tournament.status as keyof typeof statusLabels]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                  // disabled={editingUserEmail !== null}
                  >
                    <Link href={`/tournaments/edit/${tournament.id}`}>
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(tournament.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Deletar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteTournament !== null} onOpenChange={() => setDeleteTournament(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este torneio? Esta ação não pode ser desfeita.
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
    </div>
  )

}
