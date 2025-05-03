"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getCardByName, getCardImageByName, getCardImageUrl, type ScryfallCard } from "@/lib/scryfall"
import { useEffect, useState } from "react"
import { BannedCardResponse } from "./types"
import api from "@/service/api"

// const bannedCards = [
//   {
//     name: "Sol Ring",
//     reason: "Poder excessivo nos primeiros turnos",
//     date: "01/01/2023",
//     imageUrl: "https://cards.scryfall.io/small/front/4/c/4cbc6901-6a4a-4d0a-83ea-7eefa3b35021.jpg",
//     color: "Colorless",
//   },
//   {
//     name: "Mana Crypt",
//     reason: "Poder excessivo nos primeiros turnos",
//     date: "01/01/2023",
//     imageUrl: "https://cards.scryfall.io/small/front/4/d/4d960186-4559-4af0-bd22-63baa15f8939.jpg",
//     color: "Colorless",
//   },
//   {
//     name: "Dockside Extortionist",
//     reason: "Geração de mana desproporcional",
//     date: "01/01/2023",
//     imageUrl: "https://cards.scryfall.io/small/front/9/e/9e2e3efb-75cb-430f-b9f4-cb58f3aeb91b.jpg",
//     color: "Red",
//   },
//   {
//     name: "Thassa's Oracle",
//     reason: "Combos fáceis de vitória instantânea",
//     date: "01/01/2023",
//     imageUrl: "https://cards.scryfall.io/small/front/7/2/726e8b29-13e9-4138-b6a9-d2a0d8188d1c.jpg",
//     color: "Blue",
//   },
//   {
//     name: "Demonic Consultation",
//     reason: "Combos fáceis de vitória instantânea",
//     date: "01/01/2023",
//     imageUrl: "https://cards.scryfall.io/small/front/1/d/1d779f19-3068-4976-b96b-8f93d156900b.jpg",
//     color: "Black",
//   },
// ]

export function BannedList() {
  const [bannedCards, setBannedCards] = useState<BannedCardResponse[]>([])

  useEffect(() => {
    async function fetchBannedCards() {
      const response = await api.get("/bans")
      const cardsData = response.data.map(async (card: BannedCardResponse) => {
        const cardImage = await Promise.resolve(getCardImageByName(card.name))
        return {
          date: card.date,
          reason: card.reason,
          name: card.name,
          imageUrl: cardImage,
        }
      })
      const resolvedCardsData = await Promise.all(cardsData)
      setBannedCards(resolvedCardsData)
    }

    fetchBannedCards()
  }, [])

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Card</TableHead>
            <TableHead>Nome do Card</TableHead>
            <TableHead>Motivo do Banimento</TableHead>
            <TableHead>Data do Banimento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bannedCards.map((card) => (
            <TableRow key={card.name}>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-12 w-12 rounded-sm cursor-pointer">
                      <AvatarImage src={card.imageUrl} alt={card.name} />
                      {/* <AvatarFallback className="rounded-sm">{card.name.charAt(0)}</AvatarFallback> */}
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <img
                      // src={card.imageUrl.replace("/small/", "/normal/") || "/placeholder.svg"}
                      alt={card.name}
                      className="rounded-md max-w-[200px]"
                    />
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="font-medium">
                {card.name}
                {/* <Badge
                  variant="outline"
                  className={`ml-2 ${
                    card.color === "Red"
                      ? "text-red-500 border-red-500"
                      : card.color === "Blue"
                        ? "text-blue-500 border-blue-500"
                        : card.color === "Black"
                          ? "text-gray-800 border-gray-800 dark:text-gray-300 dark:border-gray-300"
                          : card.color === "Colorless"
                            ? "text-gray-500 border-gray-500"
                            : ""
                  }`}
                >
                  {card.color}
                </Badge> */}
              </TableCell>
              <TableCell>{card.reason}</TableCell>
              <TableCell>{card.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}

