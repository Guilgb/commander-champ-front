import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Book, FileText, Scale, Clock } from "lucide-react"

const rules = [
  {
    title: "Limite de Preço",
    description:
      "O deck completo, excluindo o comandante, não pode exceder o valor de R$ 500,00 baseado nos preço mínimo pela plataforma LigaMagic.",
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
    title: "Validade das Listas",
    description:
      `A verificação da validade da data de criação das listas pode variar de acordo com as regras de cada local/evento. \n\nDentre as possibilidades comumente adotadas há:\n\n- Listas devem possuir data igual ou inferior a 07 dias anterior a data do evento.\n\n- Listas devem possuir data igual ou inferior a 30 dias anterior a data do evento.\n\n- Listas possuem validade de Janeiro a Junho pra eventos que se iniciem no mesmo período. Assim como listas possuem validade de Julho a Dezembro para eventos que se iniciam no mesmo período.`,
    icon: FileText,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
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
