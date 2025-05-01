"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useDebounce } from "@/hooks/use-debounce"

interface CardSearchProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string, cardData?: any) => void
  required?: boolean
}

export function CardSearch({ label, placeholder, value, onChange, required = false }: CardSearchProps) {
  const [searchTerm, setSearchTerm] = useState(value)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const searchCards = async () => {
      if (debouncedSearchTerm.length < 3) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        // Simulando uma busca na API do Scryfall
        // Em um ambiente real, você usaria a API do Scryfall para buscar cartas
        const response = await fetch(
          `https://api.scryfall.com/cards/search?q=${encodeURIComponent(debouncedSearchTerm)}+t:legendary+t:creature`,
        )
        const data = await response.json()

        if (data.data) {
          setResults(data.data.slice(0, 5))
        } else {
          setResults([])
        }
      } catch (error) {
        console.error("Erro ao buscar cartas:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    searchCards()
  }, [debouncedSearchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    onChange(e.target.value)
    setShowResults(true)
  }

  const handleSelectCard = (card: any) => {
    setSearchTerm(card.name)
    onChange(card.name, card)
    setShowResults(false)
  }

  const getCardImageUrl = (card: any) => {
    if (card.image_uris?.small) {
      return card.image_uris.small
    } else if (card.card_faces && card.card_faces[0].image_uris?.small) {
      return card.card_faces[0].image_uris.small
    }
    return "/placeholder.svg?height=100&width=75"
  }

  return (
    <div className="relative">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={label.toLowerCase().replace(/\s+/g, "-")}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.length >= 3 && setShowResults(true)}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {results.map((card) => (
            <div
              key={card.id}
              className="flex items-center p-2 hover:bg-accent cursor-pointer"
              onClick={() => handleSelectCard(card)}
            >
              <div className="flex-shrink-0 w-10 h-14 relative mr-2">
                <Image
                  src={getCardImageUrl(card) || "/placeholder.svg"}
                  alt={card.name}
                  fill
                  className="object-contain rounded-sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{card.name}</p>
                <p className="text-xs text-muted-foreground truncate">{card.type_line}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
