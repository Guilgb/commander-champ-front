"use client"

import { useEffect, useState } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import api from "@/service/api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import { Search, Save, X, Edit2, Trash2 } from "lucide-react"
import { AlertDialogHeader, AlertDialogFooter } from "./ui/alert-dialog"

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    role: "USER",
    createdAt: "01/01/2023",
  }
]

export interface UserList {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

type User = {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

const roleLabels = {
  USER: "Usuário",
  EDITOR: "Editor",
  TOURNAMENT_ADMIN: "Admin de Torneios",
  ADMIN: "Administrador",
}

export function UserManagement() {
  const [users, setUsers] = useState<UserList[] | undefined>()
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<UserList[] | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUserId, setEditingUserId] = useState<any>(null)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    api
      .get("/user/list")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleRoleChange = (userId: number, role: string) => {
    setUsers(users?.map((user) => (user.id === userId ? { ...user, role } : user)))
  }

  const handleAddUser = () => {
    const id = ((users?.length ?? 0) + 1).toString()
    const createdAt = new Date().toLocaleDateString()

    // setUsers([...(users ?? []), { ...newUser, id: Number(id), created_at: createdAt }])
    // setNewUser({ name: "", email: "", role: "USER" })
    setIsAddUserOpen(false)
  }

  const handleEdit = (user: User) => {
    setEditingUserId(user.id)
    setEditedUser({ ...user })
  }

  const handleSave = () => {
    if (editedUser) {
      setUsers(users?.map((user) => 
        user.id === editedUser.id 
          ? { ...editedUser, created_at: user.created_at } 
          : user
      ))
      toast({
        title: "Usuário atualizado",
        description: `As informações de ${editedUser.name} foram atualizadas com sucesso.`,
      })
      setEditingUserId(null)
      setEditedUser(null)
    }
  }

  const handleCancel = () => {
    setEditingUserId(null)
    setEditedUser(null)
  }

  const handleDelete = (userId: number) => {
    setDeleteUserId(userId)
  }

  const confirmDelete = () => {
    if (deleteUserId) {
      const userToDelete = users?.find((user) => user.id === deleteUserId)
      setUsers(users?.filter((user) => user.id !== deleteUserId))
      toast({
        title: "Usuário removido",
        description: `${userToDelete?.name} foi removido com sucesso.`,
      })
      setDeleteUserId(null)
    }
  }

  const cancelDelete = () => {
    setDeleteUserId(null)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por email ou nome..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          {filteredUsers?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {editingUserId === user.id.toString() ? (
                  <Input
                    value={editedUser?.name || ""}
                    onChange={(e) => setEditedUser({ ...editedUser!, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id.toString() ? (
                  <Input
                    value={editedUser?.email || ""}
                    onChange={(e) => setEditedUser({ ...editedUser!, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={editingUserId === user.id ? editedUser?.role || user.role : user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                  disabled={editingUserId !== user.id.toString() && editingUserId !== null}
                >
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
              <TableCell>{user.created_at}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {editingUserId === user.id.toString() ? (
                    <>
                      <Button variant="outline" size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        // onClick={() => handleEdit(user)}
                        disabled={editingUserId !== null}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={editingUserId !== null}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Deletar
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteUserId !== null} onOpenChange={() => setDeleteUserId(null)}>
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
    </div>
  )
}

