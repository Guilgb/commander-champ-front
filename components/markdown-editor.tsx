"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { getCardByName } from "@/lib/scryfall"
import { HelpCircle, Image, Link2, Bold, Italic, List, ListOrdered, Quote } from "lucide-react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function MarkdownEditor({ value, onChange, placeholder, minHeight = "300px" }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [renderedContent, setRenderedContent] = useState("")
  const [cardSuggestions, setCardSuggestions] = useState<string[]>([])
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Process content for preview
  useEffect(() => {
    const processContent = async () => {
      let content = value

      // Process @{card name} syntax
      const cardMatches = content.match(/@\{([^}]+)\}/g)

      if (cardMatches) {
        for (const match of cardMatches) {
          const cardName = match.slice(2, -1) // Remove @{ and }
          try {
            const card = await getCardByName(cardName)
            if (card) {
              const imageUrl = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal
              if (imageUrl) {
                // Include the tooltip HTML directly in the rendered content
                const cardHtml = `
            <span class="card-reference text-[#BF6060] font-medium cursor-pointer relative inline-block">
              ${cardName}
              <div class="card-tooltip hidden">
                <img src="${imageUrl}" alt="${cardName}" class="rounded-lg shadow-lg">
              </div>
            </span>
          `
                content = content.replace(match, cardHtml)
              }
            }
          } catch (error) {
            console.error(`Error fetching card: ${cardName}`, error)
          }
        }
      }

      // Basic markdown processing
      // Headers
      content = content.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      content = content.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
      content = content.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>')

      // Bold and Italic
      content = content.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      content = content.replace(/\*(.+?)\*/g, "<em>$1</em>")

      // Lists
      content = content.replace(/^\* (.+)$/gm, "<li>$1</li>")
      content = content.replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
      content = content.replace(/(<li>.+<\/li>\n)+/g, '<ul class="list-disc pl-6 my-2">$&</ul>')

      // Links
      content = content.replace(/\[(.+?)\]$$(.+?)$$/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>')

      // Images
      content = content.replace(/!\[(.+?)\]$$(.+?)$$/g, '<img src="$2" alt="$1" class="rounded-lg my-2 max-w-full" />')

      // Blockquotes
      content = content.replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">$1</blockquote>',
      )

      // Paragraphs
      content = content.replace(/^(?!<[a-z]).+$/gm, '<p class="my-2">$&</p>')

      // Fix empty paragraphs
      content = content.replace(/<p class="my-2"><\/p>/g, "")

      setRenderedContent(content)
    }

    processContent()
  }, [value, activeTab])

  // Handle card suggestions
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Check for @{ to show card suggestions
    const cursorPos = e.target.selectionStart
    const textBeforeCursor = newValue.substring(0, cursorPos)
    const match = textBeforeCursor.match(/@\{([^}]*)$/)

    if (match) {
      const searchTerm = match[1].trim()
      if (searchTerm.length > 1) {
        // Mock card suggestions - in a real app, you'd fetch from Scryfall API
        const mockCards = [
          "Sol Ring",
          "Arcane Signet",
          "Command Tower",
          "Cultivate",
          "Counterspell",
          "Swords to Plowshares",
          "Cyclonic Rift",
          "Demonic Tutor",
          "Birds of Paradise",
          "Rhystic Study",
          "Smothering Tithe",
          "Dockside Extortionist",
          "Dispel",
        ]

        const filteredCards = mockCards
          .filter((card) => card.toLowerCase().includes(searchTerm.toLowerCase()))
          .slice(0, 5)

        setCardSuggestions(filteredCards)
        setCursorPosition({ start: cursorPos - match[1].length, end: cursorPos })
      } else {
        setCardSuggestions([])
        setCursorPosition(null)
      }
    } else {
      setCardSuggestions([])
      setCursorPosition(null)
    }
  }

  // Insert card name
  const insertCard = (cardName: string) => {
    if (cursorPosition && textareaRef.current) {
      const newValue = value.substring(0, cursorPosition.start) + cardName + value.substring(cursorPosition.end)

      onChange(newValue)
      setCardSuggestions([])
      setCursorPosition(null)

      // Set focus back to textarea
      textareaRef.current.focus()
      const newCursorPos = cursorPosition.start + cardName.length + 1 // +1 for the closing }
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPos
          textareaRef.current.selectionEnd = newCursorPos
        }
      }, 0)
    }
  }

  // Insert markdown syntax
  const insertMarkdown = (syntax: string, placeholder: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selectedText = value.substring(start, end)

      let newText
      if (selectedText) {
        newText = value.substring(0, start) + syntax.replace("$1", selectedText) + value.substring(end)
      } else {
        newText = value.substring(0, start) + syntax.replace("$1", placeholder) + value.substring(end)
      }

      onChange(newText)

      // Set focus back to textarea
      textareaRef.current.focus()
      const newCursorPos = start + syntax.indexOf("$1") + (selectedText || placeholder).length
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPos
          textareaRef.current.selectionEnd = newCursorPos
        }
      }, 0)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
          <TabsList>
            <TabsTrigger value="write">Escrever</TabsTrigger>
            <TabsTrigger value="preview">Visualizar</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => insertMarkdown("**$1**", "texto em negrito")}
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => insertMarkdown("*$1*", "texto em itálico")}
            title="Itálico"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => insertMarkdown("[$1](https://exemplo.com)", "texto do link")}
            title="Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => insertMarkdown("![$1](https://exemplo.com/imagem.jpg)", "descrição da imagem")}
            title="Imagem"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => insertMarkdown("* $1", "item da lista")}
            title="Lista não ordenada"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => insertMarkdown("1. $1", "item da lista")}
            title="Lista ordenada"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => insertMarkdown("> $1", "citação")}
            title="Citação"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" type="button" asChild title="Ajuda com Markdown">
            <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer">
              <HelpCircle className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Envolvendo o conteúdo em um componente Tabs para resolver o erro */}
      <Tabs value={activeTab} className="mt-0">
        <TabsContent value="write">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={handleTextareaChange}
              placeholder={placeholder || "Escreva seu conteúdo aqui..."}
              className="min-h-[300px] font-mono"
              style={{ minHeight }}
            />

            {cardSuggestions.length > 0 && (
              <Card className="absolute z-10 w-64 max-h-60 overflow-y-auto">
                <CardContent className="p-1">
                  <ul className="divide-y">
                    {cardSuggestions.map((card, index) => (
                      <li key={index} className="p-2 hover:bg-muted cursor-pointer" onClick={() => insertCard(card)}>
                        {card}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Dica: Use @{"{nome do card}"} para inserir imagens de cards do Magic automaticamente.
          </p>
        </TabsContent>

        <TabsContent value="preview">
          <div
            className="border rounded-md p-4 min-h-[300px] overflow-auto bg-card preview-container"
            style={{ minHeight }}
          >
            <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

