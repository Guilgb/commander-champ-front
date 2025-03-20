"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"

interface Article {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  coverImage: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
}

interface FeaturedArticlesProps {
  articles: Article[]
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      handleNext()
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right
      handlePrev()
    }
  }

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(() => {
      handleNext()
    }, 5000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [handleNext])

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const handleMouseLeave = () => {
    timerRef.current = setInterval(() => {
      handleNext()
    }, 5000)
  }

  if (articles.length === 0) {
    return null
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {articles.map((article, index) => (
          <div key={article.id} className="w-full flex-shrink-0">
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
              <img
                src={article.coverImage || "/placeholder.svg"}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-foreground">
                  <Link href={`/articles/${article.id}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h3>

                <p className="text-sm md:text-base mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 text-foreground/90">
                  {article.excerpt}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src={article.author.avatar} alt={article.author.name} />
                      <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm md:text-base font-medium">{article.author.name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground flex items-center">
                        {article.date} • <Clock className="h-3 w-3 mx-1" /> {article.readTime}
                      </p>
                    </div>
                  </div>

                  <Button asChild>
                    <Link href={`/articles/${article.id}`}>Ler artigo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegação */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm ml-2"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm mr-2"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {articles.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-primary" : "w-2 bg-primary/50"
            }`}
            onClick={() => {
              setCurrentIndex(index)
            }}
          />
        ))}
      </div>
    </div>
  )
}

