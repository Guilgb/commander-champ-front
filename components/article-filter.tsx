"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown, Search, Tag, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Lista de tags disponíveis
const availableTags = [
  "budget",
  "comandantes",
  "iniciantes",
  "guia",
  "construção",
  "meta",
  "análise",
  "banimentos",
  "tribal",
  "estratégia",
  "avançado",
  "remoção",
  "staples",
  "comunidade",
  "etiqueta",
  "equilíbrio",
  "mana base",
  "terras",
  "combo",
  "infinito",
]

export function ArticleFilter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [author, setAuthor] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [sortBy, setSortBy] = useState("date-desc")
  const [tagsOpen, setTagsOpen] = useState(false)

  const handleReset = () => {
    setSearchTerm("")
    setAuthor("")
    setSelectedTags([])
    setDate(undefined)
    setSortBy("date-desc")
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                <Tag className="mr-2 h-4 w-4" />
                <span>{selectedTags.length > 0 ? `${selectedTags.length} tags` : "Tags"}</span>
                {selectedTags.length > 0 ? (
                  <X
                    className="ml-2 h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTags([])
                    }}
                  />
                ) : (
                  <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar tag..." />
                <CommandList>
                  <CommandEmpty>Nenhuma tag encontrada.</CommandEmpty>
                  <CommandGroup>
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag}
                        onSelect={() => toggleTag(tag)}
                        className="flex items-center justify-between"
                      >
                        <span>{tag}</span>
                        {selectedTags.includes(tag) && <Check className="h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Data"}
                {date && (
                  <X
                    className="ml-2 h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDate(undefined)
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Mais recentes</SelectItem>
              <SelectItem value="date-asc">Mais antigos</SelectItem>
              <SelectItem value="views-desc">Mais visualizados</SelectItem>
              <SelectItem value="comments-desc">Mais comentados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Exibir tags selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
            </Badge>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  )
}

