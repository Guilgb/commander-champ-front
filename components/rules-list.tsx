import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Book, FileText, Scale, Clock } from "lucide-react"

const rules = [
  {
    title: "Limite de Preço",
    description:
      "O deck completo, incluindo o comandante, não pode exceder o valor de R$ 500,00 baseado nos preços médios do mercado brasileiro.",
    icon: Coins,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  {
    title: "Regras de Commander",
    description:
      "Todas as regras oficiais de Commander se aplicam, com exceção das modificações específicas do Commander 500.",
    icon: Book,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    title: "Proxies",
    description: "Proxies são permitidas desde que representem cards que estejam dentro do limite de preço do formato.",
    icon: FileText,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    title: "Verificação de Preço",
    description:
      "Os preços são verificados usando a média de preços de sites brasileiros de venda de cards no momento do torneio.",
    icon: Scale,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    title: "Atualizações de Preço",
    description:
      "A cada 3 meses, os preços são reavaliados e os decks podem precisar ser ajustados para o próximo torneio oficial.",
    icon: Clock,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
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
            <p>{rule.description}</p>
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

