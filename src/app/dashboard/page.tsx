"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "@/components/Sidebar"
import NewNoteButton from "@/components/newnotebtn"
import StickyNote from "@/components/stickynote"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

interface Note {
  id: string
  content: string
  position: { x: number; y: number }
  createdAt: string | Date
}

interface Journal {
  id: string
  content: string
  position: string
  createdAt: string | Date
  aiAnalysis?: any
}

export default function Dashboard() {
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [journals, setJournals] = useState<Journal[]>([])
  const [zoom, setZoom] = useState(1)
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    }
  })

  // Fetch journals on mount
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await fetch('/api/journal')
        const data = await response.json()
        if (data.journals) {
          setJournals(data.journals)
        }
      } catch (error) {
        console.error('Failed to fetch journals:', error)
      }
    }
    fetchJournals()
  }, [])

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      setZoom(z => {
        const newZoom = z - (e.deltaY * 0.001)
        return Math.min(Math.max(newZoom, 0.5), 1.5)
      })
    }
  }

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  const addNote = async () => {
    try {
      const position = {
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * (window.innerHeight - 300)
      }

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: "New note",
          position: position
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Ensure the position is properly stringified
        const newJournal = {
          ...data.journal,
          position: JSON.stringify(position)
        }
        setJournals(prev => [...prev, newJournal])
      }
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const updateNote = async (id: string, content: string, position?: {x: number, y: number}) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, position })
      })
      
      if (response.ok) {
        setJournals(prev => prev.map(journal => 
          journal.id === id ? { ...journal, content, position: JSON.stringify(position) } : journal
        ))
      }
    } catch (error) {
      console.error('Failed to update note:', error)
    }
  }

  // Helper function to safely convert dates to ISO string
  const getISOString = (date: string | Date) => {
    if (date instanceof Date) {
      return date.toISOString()
    }
    return new Date(date).toISOString()
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden relative">
      <div 
        className="absolute inset-0 bg-notebook-grid opacity-5"
        style={{
          backgroundImage: 'linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      <Sidebar 
        dates={journals.map(journal => getISOString(journal.createdAt))}
        selectedDate={selectedDate as string} 
        onSelectDate={setSelectedDate}
      />

      <motion.div 
        className="ml-80 p-8 h-screen"
        style={{ scale: zoom }}
      >
        <AnimatePresence>
          {journals.map((journal) => (
            <StickyNote 
              key={journal.id} 
              note={{
                ...journal,
                position: typeof journal.position === 'string' 
                  ? JSON.parse(journal.position)
                  : journal.position
              }} 
              onUpdate={updateNote} 
            />
          ))}
        </AnimatePresence>
        
        <NewNoteButton onClick={addNote} />
      </motion.div>
    </main>
  )
}