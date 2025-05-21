import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Book, FileText, Scale, Clock, Users, Ban, Award, Calculator } from "lucide-react"

const rules = [
  {
    title: "Limite de Preço",
    description:
      "O deck completo, excluindo o comandante, não pode exceder o valor de R$ 500,00 baseado nos preços mínimos da plataforma LigaMagic. O valor do comandante não é contabilizado neste limite nem os terrenos básicos.",
    icon: Coins,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  {
    title: "Regras Base de Commander",
    description:
      "Todas as regras oficiais de Commander se aplicam como base, incluindo vida inicial de 40, dano de comandante e singleton. Consulte as regras oficiais para mais detalhes.",
    icon: Book,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    title: "Validade das Listas",
    description:
      "A verificação dos preços e validade das listas segue três modelos principais:\n\n- Semanal: Lista com até 7 dias antes do evento\n- Mensal: Lista com até 30 dias antes do evento\n- Semestral: Janeiro-Junho ou Julho-Dezembro",
    icon: Clock,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    title: "Verificação de Preços",
    description:
      "Os preços são verificados usando o valor mínimo da LigaMagic no momento da criação da lista. Cartas que ultrapassem o limite durante o período de validade da lista não afetam sua legalidade.",
    icon: Calculator,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    title: "Banimentos Específicos",
    description:
      "O formato não possui banimentos específicos além dos banimentos do commander. Consulte a lista completa na aba de banimentos.",
    icon: Ban,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  {
    title: "Espírito do Formato",
    description:
      "O Commander 500 busca criar um ambiente competitivo e acessível, onde estratégia e criatividade se destacam mais que o poder aquisitivo. Incentivamos a diversidade de estratégias e o respeito entre os jogadores.",
    icon: Award,
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
]

export function RulesList() {
  return (
    <div className="grid gap-4">
      {rules.map((rule, index) => (
        <Card
          key={index}
          className="overflow-hidden border-l-4"
          style={{ borderLeftColor: `var(--${rule.color.split(" ")[1]})` }}
        >
          <CardHeader className="py-4 flex flex-row items-center gap-4">
            <div className={`p-2 rounded-full ${rule.color}`}>
              <rule.icon className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg">{rule.title}</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p style={{ whiteSpace: "pre-wrap" }}>{rule.description}</p>
          </CardContent>
        </Card>
      ))}

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Observações Importantes:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>As regras podem ser atualizadas periodicamente. Consulte sempre a versão mais recente.</li>
          <li>Em caso de dúvidas, consulte um juiz ou administrador do torneio.</li>
          <li>Lembre-se que o objetivo principal é proporcionar um ambiente divertido e competitivo para todos.</li>
        </ul>
      </div>
    </div>
  )
}
