"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function AccountRequestPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    store: "",
    city: "",
    state: "",
    role: "",
    experience: "",
    reason: "",
    termsAccepted: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.role || !formData.reason || !formData.termsAccepted) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)

    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação foi enviada com sucesso. Entraremos em contato em breve.",
    })
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
            <CardTitle>Solicitação Enviada</CardTitle>
          </div>
          <CardDescription>Sua solicitação foi enviada com sucesso e está em análise.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Obrigado por seu interesse em se tornar um administrador de torneios do Commander 500. Nossa equipe irá
            analisar sua solicitação e entraremos em contato através do e-mail fornecido.
          </p>
          <p>
            O processo de aprovação geralmente leva até 5 dias úteis. Caso tenha alguma dúvida, entre em contato conosco
            pelo e-mail <span className="font-medium">contato@commander500.com.br</span>.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <a href="/">Voltar para a página inicial</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Solicitação de Conta de Administrador</h1>
        <p className="text-muted-foreground mt-2">
          Preencha o formulário abaixo para solicitar uma conta de administrador de torneios.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Forneça suas informações para que possamos avaliar sua solicitação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store">Loja/Estabelecimento</Label>
                <Input
                  id="store"
                  name="store"
                  placeholder="Nome da loja (se aplicável)"
                  value={formData.store}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Sua cidade"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="Seu estado"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Conta Solicitada *</Label>
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione o tipo de conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOURNAMENT_ADMIN">Administrador de Torneios</SelectItem>
                  <SelectItem value="EDITOR">Editor de Conteúdo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experiência com Magic/Commander</Label>
              <Textarea
                id="experience"
                name="experience"
                placeholder="Descreva sua experiência com Magic e Commander"
                value={formData.experience}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Por que você deseja ser um administrador de torneios? *</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Explique por que você deseja se tornar um administrador de torneios do Commander 500"
                value={formData.reason}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" checked={formData.termsAccepted} onCheckedChange={handleCheckboxChange} required />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Aceito os termos e condições *
                </label>
                <p className="text-sm text-muted-foreground">
                  Ao marcar esta caixa, você concorda em seguir as regras e diretrizes do formato Commander 500.
                </p>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Todas as solicitações passam por um processo de aprovação. Você receberá um e-mail com o resultado da
                sua solicitação em até 5 dias úteis.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">* Campos obrigatórios</p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

