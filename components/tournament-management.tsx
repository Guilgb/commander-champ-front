"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock tournament data
const mockTournaments = [
  {
    id: "1",
    name: "Commander 500 - Torneio Mensal",
    date: "15/04/2023",
    location: "Loja Mágica - São Paulo",
    players: 8,
    status: "completed",
  },
  {
    id: "2",
    name: "Commander 500 - Campeonato Regional",
    date: "01/05/2023",
    location: "Centro de Eventos - Rio de Janeiro",
    players: 16,
    status: "scheduled",
  },
  {
    id: "3",
    name: "Commander 500 - Torneio Beneficente",
    date: "10/05/2023",
    location: "Clube de Cartas - Belo Horizonte",
    players: 12,
    status: "scheduled",
  },
  {
    id: "4",
    name: "Commander 500 - Torneio Online",
    date: "20/03/2023",
    location: "Online - Discord",
    players: 24,
    status: "completed",
  },
]

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
  const [tournaments, setTournaments] = useState(mockTournaments)

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
              <TableCell>{tournament.players}</TableCell>
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
                    Editar
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

