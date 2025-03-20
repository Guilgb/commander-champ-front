"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    role: "USER",
    createdAt: "01/01/2023",
  },
  {
    id: "2",
    name: "Maria Souza",
    email: "maria@example.com",
    role: "EDITOR",
    createdAt: "15/01/2023",
  },
  {
    id: "3",
    name: "Pedro Alves",
    email: "pedro@example.com",
    role: "TOURNAMENT_ADMIN",
    createdAt: "20/02/2023",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@example.com",
    role: "USER",
    createdAt: "05/03/2023",
  },
  {
    id: "5",
    name: "Carlos Oliveira",
    email: "carlos@example.com",
    role: "ADMIN",
    createdAt: "10/03/2023",
  },
]

const roleLabels = {
  USER: "Usuário",
  EDITOR: "Editor",
  TOURNAMENT_ADMIN: "Admin de Torneios",
  ADMIN: "Administrador",
}

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "USER",
  })

  const handleRoleChange = (userId: string, role: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role } : user)))
  }

  const handleAddUser = () => {
    const id = (users.length + 1).toString()
    const createdAt = new Date().toLocaleDateString()

    setUsers([...users, { ...newUser, id, createdAt }])
    setNewUser({ name: "", email: "", role: "USER" })
    setIsAddUserOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Usuário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>Preencha os dados para adicionar um novo usuário ao sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Função</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecionar função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuário</SelectItem>
                    <SelectItem value="EDITOR">Editor</SelectItem>
                    <SelectItem value="TOURNAMENT_ADMIN">Admin de Torneios</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddUser}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecionar função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuário</SelectItem>
                    <SelectItem value="EDITOR">Editor</SelectItem>
                    <SelectItem value="TOURNAMENT_ADMIN">Admin de Torneios</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

