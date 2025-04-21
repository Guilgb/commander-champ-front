"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import api from "@/service/api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import { Search, Save, X, Edit2, Trash2 } from "lucide-react"
import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog"
import { User, UserList } from "./types"

export function UserManagement() {
  const [users, setUsers] = useState<UserList[] | undefined>()
  const [filteredUsers, setFilteredUsers] = useState<UserList[] | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUserEmail, setEditingUserEmail] = useState<any>(null)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [deleteUserEmail, setDeleteUserEmail] = useState<string | null>(null)
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

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleRoleChange = (userEmail: string, role: string) => {
    if (editingUserEmail === userEmail && editedUser) {
      setEditedUser({ ...editedUser, role })
    } else {
      setUsers(users?.map((user) => (user.email === userEmail ? { ...user, role } : user)) || [])
    }
  }

  const handleEdit = (user: User) => {
    setEditingUserEmail(user.email)
    setEditedUser({ ...user })
  }

  const handleSave = async () => {
    if (editedUser) {
      setUsers(users?.map((user) =>
        user.email === editedUser.email
          ? { ...editedUser, created_at: user.created_at }
          : user
      ))

      try {
        const response = await api.post(`/user-roles/user`, {
          data: { user_id: editedUser?.id },
        })

        const { role_name } = response.data

        if (response.status !== 201) {
          throw new Error("Failed to fetch user role")
        }

        const update = await api.put(`/user-roles/update`, {
          data: {
            user_id: editedUser.id,
            role_name: role_name,
            new_role_name: editedUser.role,
          },
        })

        if (update.status !== 200) {
          throw new Error("Failed to update user role")
        }
        setUsers(users?.map((user) =>
          user.email === editedUser.email
            ? { ...editedUser, created_at: user.created_at }
            : user
        ))

      } catch (error) {
        console.error(error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao tentar atualizar o usuário.",
          variant: "destructive",
        })

      }
      toast({
        title: "Usuário atualizado",
        description: `As informações de ${editedUser.name} foram atualizadas com sucesso.`,
      })
      setEditingUserEmail(null)
      setEditedUser(null)
    }
  }

  const handleCancel = () => {
    setEditingUserEmail(null)
    setEditedUser(null)
  }

  const handleDelete = async (email: string) => {
    setDeleteUserEmail(email)
  }

  const confirmDelete = async () => {
    if (deleteUserEmail) {
      const userToDelete = users?.find((user) => user.email === deleteUserEmail)
      try {
        const response = await api.delete(`/user`, {
          data: { email: userToDelete?.email },
        })

        if (response.status !== 200) {
          throw new Error("Failed to delete user")
        }

      } catch (error) {
        console.error(error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao tentar excluir o usuário.",
          variant: "destructive",
        })
      }
      setUsers(users?.filter((user) => user.email !== deleteUserEmail))
      toast({
        title: "Usuário removido",
        description: `${userToDelete?.name} foi removido com sucesso.`,
      })
      setDeleteUserEmail(null)
    }
  }

  const cancelDelete = () => {
    setDeleteUserEmail(null)
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
                {editingUserEmail === user.id.toString() ? (
                  <Input
                    value={editedUser?.name || ""}
                    onChange={(e) => setEditedUser({ ...editedUser!, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingUserEmail === user.id.toString() ? (
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
                  value={editingUserEmail === user.id ? editedUser?.role || user.role : user.role}
                  onValueChange={(value) => handleRoleChange(user.email, value)}
                  disabled={editingUserEmail !== user.email && editingUserEmail !== null}
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
                  {editingUserEmail === user.email ? (
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
                        onClick={() => handleEdit(user)}
                        disabled={editingUserEmail !== null}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.email)}
                        disabled={editingUserEmail !== null}
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

      <AlertDialog open={deleteUserEmail !== null} onOpenChange={() => setDeleteUserEmail(null)}>
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

