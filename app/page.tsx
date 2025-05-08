import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BannedList } from "@/components/banned-list/banned-list"
import { RulesList } from "@/components/rules-list"
import { RecentArticles } from "@/components/recent-articles"
import { UserPlus } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted rounded-lg"
        style={{
          backgroundImage: "url('https://cards.scryfall.io/art_crop/front/b/f/bf76c6a4-d6e8-4d50-b65f-020252f7b659.jpg?1682692625')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
        }}>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">Commander 500</h1>
              <p className="mx-auto max-w-[700px] text-white md:text-xl">
                O formato de Commander com limite de 500 reais por deck. Competitivo, acessível e divertido.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/articles">Artigos</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/metrics">Métricas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="rules" className="w-full" >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="banned">Lista de Banimentos</TabsTrigger>
          <TabsTrigger value="account-request">Solicitar Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="rules">
          <Card >
            <CardHeader className="bg-cover bg-center" >
              <CardTitle>Regras do Commander 500</CardTitle>
              <CardDescription>Regras específicas para o formato Commander 500</CardDescription>
            </CardHeader>
            <CardContent>
              <RulesList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="banned">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Cards Banidos</CardTitle>
              <CardDescription>Cards banidos específicos do formato Commander</CardDescription>
            </CardHeader>
            <CardContent>
              <BannedList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account-request">
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Conta de Administrador</CardTitle>
              <CardDescription>
                Deseja registrar torneios ou criar conteúdo para o Commander 500? Solicite uma conta de administrador.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Para organizar torneios oficiais do Commander 500 ou contribuir com conteúdo para o site, você precisa
                de uma conta com permissões especiais.
              </p>
              <p>
                Preencha o formulário de solicitação e nossa equipe analisará seu pedido. O processo geralmente leva até
                5 dias úteis.
              </p>
              <div className="flex justify-center mt-4">
                <Button asChild>
                  <Link href="/account-request" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Solicitar Conta
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Artigos Recentes</h2>
        <RecentArticles />
      </section> */}
    </div>
  )
}

