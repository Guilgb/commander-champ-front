import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Book, FileText, Scale, Clock, Users, Ban, Award, Calculator } from "lucide-react"

const rules = [
  {
    title: "Limite de Preço",
    description: `O valor máximo do deck, excluindo o(s) comandante(s), deve ser igual ou inferior a R$ 500,00.
A consulta de valores é realizada pela plataforma Ligamagic, levando em consideração o menor valor para cada carta, onde a coleção ou os adicionais 
que a carta possua não são considerados.
`,
    icon: Coins,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  {
    title: "Regras do Formato",
    description:
      `O Commander 500 segue todas as regras estabelecidas para o formato Commander com o adicional de limitação de valor do baralho. Todas as regras 
oficiais podem ser encontradas através da página de regras da Wizards (colocar o link na palavra "wizards" https://magic.wizards.com/en/rules) no 
documento de regras Comprehensive Rules(colocar em itálico "Comprehensive Rules") no item 9, subitem 903.Você também pode conferir as regras 
do formato Commander (inserir link na expressão "formato commander" https://mtg.wiki/page/Commander_(format)  ), e todas as outras regras, através
da MTG Wiki (colocar o link https://mtg.wiki/page/Main_Page na palavra "MTG Wiki").`,
    icon: Book,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    title: "Validade das Listas",
    description:
      `Por o Commander 500 ser um formato onde o valor do seu baralho é importante, é necessária a validação de sua lista baseado na data de criação da mesma. 
Cada evento pode possuir uma janela de validação específica, recomendamos ler as regras do(s) evento(s) que pretende participar ou conversar diretamente
com a organização para que seja informada a data de validade para as listas. Alguns modelos de datas utilizados com maior frequência são:

    - Semanal: Listas criadas com até 07 dias anteriores ao evento; 
    - Mensal: Listas criadas com até 30 dias anteriores ao evento;
    - Temporadas: Listas criadas entre 01/Janeiro e 30/Junho são válidas para eventos iniciados dentro deste mesmo período. O mesmo se aplica para 
      01/Julho a 31/Dezembro.`,
    icon: Clock,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    title: "Verificação de Preços",
    description:
      `Os preços das listas são verificados utilizando o valor mínimo registrado no Preço Original da lista na plataforma Ligamagic.
Qualquer variação após a criação da lista não afeta o seu valor original, e por consequência, não afetam sua legalidade.`,
    icon: Calculator,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    title: "Banimentos Específicos",
    description:
      `O Commander 500 segue a lista de Banidas e Restritas do formato Commander disponível no link https://magic.wizards.com/en/banned-restricted-list.`,
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
