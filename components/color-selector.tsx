"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ColorSelectorProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function ColorSelector({ value, onChange, label = "Cores" }: ColorSelectorProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>(value.split(""))

  const colors = [
    { id: "W", name: "Branco", bgClass: "bg-[#F9FAF4]", textClass: "text-black", borderClass: "border-gray-300" },
    { id: "U", name: "Azul", bgClass: "bg-[#0E68AB]", textClass: "text-white", borderClass: "border-blue-700" },
    { id: "B", name: "Preto", bgClass: "bg-[#150B00]", textClass: "text-white", borderClass: "border-gray-800" },
    { id: "R", name: "Vermelho", bgClass: "bg-[#D3202A]", textClass: "text-white", borderClass: "border-red-700" },
    { id: "G", name: "Verde", bgClass: "bg-[#00733E]", textClass: "text-white", borderClass: "border-green-700" },
  ]

  const toggleColor = (colorId: string) => {
    let newSelectedColors

    if (selectedColors.includes(colorId)) {
      newSelectedColors = selectedColors.filter((c) => c !== colorId)
    } else {
      newSelectedColors = [...selectedColors, colorId]
    }

    setSelectedColors(newSelectedColors)
    onChange(newSelectedColors.join(""))
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => toggleColor(color.id)}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
              color.bgClass,
              color.textClass,
              selectedColors.includes(color.id) ? "ring-2 ring-offset-2 ring-primary" : "opacity-70 hover:opacity-100",
              color.borderClass,
            )}
            title={color.name}
          >
            {color.id}
          </button>
        ))}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        Selecionadas: {selectedColors.length > 0 ? selectedColors.join("") : "Nenhuma"}
      </div>
    </div>
  )
}
