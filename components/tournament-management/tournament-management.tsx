"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import api from "@/service/api"
import { TournamentList } from "./types"


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
  {
    const [tournaments, setTournaments] = useState<TournamentList[]>([])

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
                    <Button variant="outline" size="sm">
                      <Link href={`/tournaments/edit/${tournament.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver Resultados
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}
