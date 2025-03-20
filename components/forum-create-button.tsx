"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function ForumCreateButton() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleClick = () => {
    if (isAuthenticated) {
      router.push("/forum/create")
    } else {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para criar um tópico no fórum.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }

  return <Button onClick={handleClick}>Criar Tópico</Button>
}

