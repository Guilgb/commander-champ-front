"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Player {
  id: string
  name: string
  commander: string
  partner?: string
  colors: string
  decklist?: string
  wins: number
  losses: number
  draws: number
  isWinner: boolean
}

interface TournamentResultsTableProps {
  players: Player[]
  onUpdateResults: (players: Player[]) => void
  onRemovePlayer?: (playerId: string) => void
  editable?: boolean
}

export function TournamentResultsTable({
  players,
  onUpdateResults,
  onRemovePlayer,
  editable = false,
}: TournamentResultsTableProps) {
  const handleResultChange = (playerId: string, field: "wins" | "losses" | "draws", value: number) => {
    const updatedPlayers = players.map((player) => {
      if (player.id === playerId) {
        return { ...player, [field]: value }
      }
      return player
    })

    onUpdateResults(updatedPlayers)
  }

  const handleWinnerChange = (playerId: string, checked: boolean) => {
    const updatedPlayers = players.map((player) => {
      if (player.id === playerId) {
        return { ...player, isWinner: checked }
      }
      return player
    })

    onUpdateResults(updatedPlayers)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Jogador</TableHead>
          <TableHead>Comandante</TableHead>
          <TableHead>Parceiro</TableHead>
          <TableHead>Cores</TableHead>
          <TableHead>Vitórias</TableHead>
          <TableHead>Derrotas</TableHead>
          <TableHead>Empates</TableHead>
          <TableHead>Campeão</TableHead>
          {editable && onRemovePlayer && <TableHead>Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.commander}</TableCell>
            <TableCell>{player.partner || "-"}</TableCell>
            <TableCell>{player.colors}</TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                value={player.wins || 0}
                onChange={(e) => handleResultChange(player.id, "wins", Number.parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                value={player.losses || 0}
                onChange={(e) => handleResultChange(player.id, "losses", Number.parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                value={player.draws || 0}
                onChange={(e) => handleResultChange(player.id, "draws", Number.parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`winner-${player.id}`}
                  checked={player.isWinner || false}
                  onCheckedChange={(checked) => handleWinnerChange(player.id, checked as boolean)}
                />
                <Label htmlFor={`winner-${player.id}`}>Campeão</Label>
              </div>
            </TableCell>
            {editable && onRemovePlayer && (
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
