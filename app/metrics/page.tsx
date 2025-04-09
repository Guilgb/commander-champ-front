import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommanderFilter } from "@/components/commander-filter"
import { CardFilter } from "@/components/card-filter"
import { CommanderWinrateChart } from "@/components/commander-winrate-chart/commander-winrate-chart"
import { PopularCardsChart } from "@/components/popular-cards-chart"
import { TopPercentageChart } from "@/components/top-percentage-chart"
import { CommanderPerformanceStats } from "@/components/commander-performance-stats/commander-performance-stats"
import { CommanderRanking } from "@/components/commander-ranking/commander-ranking"
import { CardRanking } from "@/components/card-ranking/card-ranking"
import { CardFiltersProvider, CommanderFiltersProvider } from "../contexts/filters-context"

export default function MetricsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Métricas de Torneios</h1>

      <Tabs defaultValue="commanders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="commanders">Comandantes</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="commanders" className="space-y-8">
          <CommanderFiltersProvider>
            <CommanderFilter />

            <div className="space-y-8">
              <TopPercentageChart />
              <CommanderPerformanceStats />
            </div>

            <CommanderRanking />
          </CommanderFiltersProvider>
        </TabsContent>

        <TabsContent value="cards" className="space-y-8">
          <CardFiltersProvider>
            <CardFilter />
            <PopularCardsChart />
            <CardRanking />
          </CardFiltersProvider>
        </TabsContent>
      </Tabs>
    </div>
  )
}