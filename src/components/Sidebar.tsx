"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Search, Calendar, ChevronRight } from "lucide-react"
import { Input } from "./ui/input"

interface SidebarProps {
  dates: string[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

export default function Sidebar({ dates, selectedDate, onSelectDate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [journalDates, setJournalDates] = useState<string[]>([])

  // Fetch journal entries from API
  useEffect(() => {
    const fetchJournalDates = async () => {
      try {
        const response = await fetch('/api/journal')
        const data = await response.json()
        if (data.journals) {
          // Extract unique dates from journal entries
          const dates = [...new Set(data.journals.map((journal: any) => 
            format(new Date(journal.createdAt), "dd MMM yyyy")
          ))] as string[]
          setJournalDates(dates)
        }
      } catch (error) {
        console.error("Failed to fetch journal dates:", error)
      }
    }

    fetchJournalDates()
  }, [])

  // Group dates by month
  const groupedDates = (journalDates.length ? journalDates : dates).reduce((acc, date) => {
    const month = format(new Date(date), "MMMM yyyy")
    if (!acc[month]) acc[month] = []
    acc[month].push(date)
    return acc
  }, {} as Record<string, string[]>)

  // Filter dates based on search
  const filteredDates: Record<string, string[]> = searchTerm 
    ? Object.fromEntries(
        Object.entries(groupedDates).map(([month, dates]) => [
          month,
          dates.filter(date => 
            date.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ]).filter(([_, dates]) => dates.length > 0)
      ) as Record<string, string[]>
    : groupedDates

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full bg-card/95 backdrop-blur-sm border-r border-accent/10 shadow-lg z-40 flex"
    >
      <div className="w-80 p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Journal History</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-accent/10 rounded-full">
            <ChevronRight />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(filteredDates).map(([month, monthDates]: [string, string[]]) => (
            <div key={month} className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {month}
              </h3>
              <div className="space-y-1">
                {monthDates.map((date: string) => (
                  <motion.button
                    key={date}
                    whileHover={{ x: 4 }}
                    onClick={() => onSelectDate(date)}
                    className={`w-full p-2 text-left rounded-lg transition-colors ${
                      date === selectedDate 
                        ? "bg-accent text-accent-foreground" 
                        : "hover:bg-accent/10"
                    }`}
                  >
                    <span className="text-sm">{format(new Date(date), "dd MMM")}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className={`absolute -right-10 top-1/2 transform -translate-y-1/2 
          bg-card/95 p-2 rounded-r-lg shadow-md border border-l-0 border-accent/10
          ${isOpen ? 'opacity-0' : 'opacity-100'}`}
      >
        <ChevronRight />
      </button>
    </motion.div>
  )
}