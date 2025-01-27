"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaTimes } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface AIAnalysisProps {
  content: string
  onClose: () => void
}

export default function AIAnalysis({ content, onClose }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [relatedEntries, setRelatedEntries] = useState<string[]>([])
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    // Simulating API call for AI analysis
    setTimeout(() => {
      setAnalysis(
        "Based on your journal entry, it seems you're feeling reflective today. Your writing shows a pattern of self-improvement and goal-setting, which is consistent with your past entries.",
      )
      setRelatedEntries(["Yesterday's entry about work stress", "Last week's entry on personal growth"])
      setImage("/placeholder.svg?height=200&width=200")
    }, 2000)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-x-4 bottom-4 bg-paper p-6 rounded-lg shadow-lg z-50 max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-ink">AI Analysis</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <FaTimes />
        </Button>
      </div>
      {analysis ? (
        <>
          <p className="text-ink mb-4">{analysis}</p>
          <h3 className="text-lg font-semibold text-ink mb-2">Related Entries:</h3>
          <ul className="list-disc list-inside mb-4">
            {relatedEntries.map((entry, index) => (
              <li key={index} className="text-ink">
                {entry}
              </li>
            ))}
          </ul>
          {image && (
            <div className="mt-4">
              <Image
                src={image || "/placeholder.svg"}
                alt="AI generated image"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <div className="h-4 bg-accent bg-opacity-20 rounded animate-pulse"></div>
          <div className="h-4 bg-accent bg-opacity-20 rounded animate-pulse"></div>
          <div className="h-4 bg-accent bg-opacity-20 rounded animate-pulse"></div>
        </div>
      )}
    </motion.div>
  )
}

