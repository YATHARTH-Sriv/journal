"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface RecommendedArticleProps {
  title: string
  description: string
  url: string
}

export default function RecommendedArticle({ title, description, url }: RecommendedArticleProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        setPosition((prevPosition) => ({
          x: prevPosition.x + info.offset.x,
          y: prevPosition.y + info.offset.y,
        }))
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, x: position.x, y: position.y }}
      className="bg-paper p-6 rounded-lg shadow-lg max-w-md mx-auto mt-8 cursor-move"
    >
      <h2 className="text-xl font-bold text-ink mb-2">Based on your thoughts last night:</h2>
      <h3 className="text-lg font-semibold text-accent mb-2">{title}</h3>
      <p className="text-ink mb-4">{description}</p>
      <Button asChild>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Read More
        </a>
      </Button>
    </motion.div>
  )
}

