import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface NewNoteButtonProps {
  onClick: () => void
}

export default function NewNoteButton({ onClick }: NewNoteButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-accent text-white 
        flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors"
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  )
}