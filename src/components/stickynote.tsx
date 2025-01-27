"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Save } from "lucide-react"
import { Button } from "./ui/button"

interface StickyNoteProps {
  note: {
    id: string;
    content: string;
    position: { x: number; y: number };
    aiAnalysis?: any;
  };
  onUpdate: (id: string, content: string, position?: { x: number, y: number }) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function StickyNote({ note, onUpdate }: StickyNoteProps) {
  const [content, setContent] = useState(note.content)
  const [isEditing, setIsEditing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [position, setPosition] = useState(() => {
    return note.position || { x: 0, y: 0 }
  })

  const handleDragEnd = (event: any) => {
    const newPosition = { x: event.x, y: event.y }
    setPosition(newPosition)
    onUpdate(note.id, content, newPosition)
  }

  const handleSave = async () => {
    try {
      await onUpdate(note.id, content, position)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save note:', error)
    }
  }

  const handleChat = async (message: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          journalId: note.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setChatMessages(prev => [
          ...prev,
          { role: 'user', content: message, timestamp: new Date() },
          { role: 'assistant', content: data.response, timestamp: new Date() }
        ])
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      className="absolute bg-white rounded-lg shadow-lg p-4"
      style={{
        left: position.x,
        top: position.y,
        width: isChatOpen ? '400px' : '250px',
        zIndex: isChatOpen ? 50 : 1
      }}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsEditing(true)}
        className="w-full resize-none bg-transparent outline-none"
        rows={5}
      />
      
      <div className="flex justify-between mt-2">
        {isEditing && (
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>

      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 border-t pt-4"
        >
          <div className="max-h-60 overflow-y-auto space-y-4">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-accent text-white ml-4' 
                    : 'bg-muted mr-4'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          
          {isLoading && (
            <div className="text-sm text-muted-foreground animate-pulse">
              AI is thinking...
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const input = form.elements.namedItem('message') as HTMLInputElement
              if (input.value.trim()) {
                handleChat(input.value)
                input.value = ''
              }
            }}
            className="mt-4 flex gap-2"
          >
            <input
              name="message"
              className="flex-1 p-2 rounded-md border"
              placeholder="Ask me anything about your journal..."
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </motion.div>
      )}
    </motion.div>
  )
}