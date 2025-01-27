"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import confetti from "canvas-confetti"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingCard() {
  const [name, setName] = useState("")
  const [mood, setMood] = useState("")
  const [preference, setPreference] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Yay! You're onboarded!",
      description: "Welcome to your journaling journey!",
    })
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 1, x: 0 },
    })
    router.push("/dashboard")
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-paper p-8 rounded-lg shadow-lg max-w-md w-full space-y-6 transform rotate-1"
    >
      <h1 className="text-3xl font-bold text-center text-ink">Welcome to Your Journal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-ink">
            What should we call you?
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-background text-ink font-handwritten text-lg"
          />
        </div>
        <div>
          <Label className="text-ink">How are you feeling today?</Label>
          <RadioGroup value={mood} onValueChange={setMood} className="flex justify-around mt-2">
            <div className="flex flex-col items-center">
              <RadioGroupItem value="happy" id="happy" className="sr-only" />
              <Label htmlFor="happy" className="cursor-pointer">
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <FaSmile className="text-4xl text-accent" />
                </motion.div>
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <RadioGroupItem value="neutral" id="neutral" className="sr-only" />
              <Label htmlFor="neutral" className="cursor-pointer">
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <FaMeh className="text-4xl text-accent" />
                </motion.div>
              </Label>
            </div>
            <div className="flex flex-col items-center">
              <RadioGroupItem value="sad" id="sad" className="sr-only" />
              <Label htmlFor="sad" className="cursor-pointer">
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <FaFrown className="text-4xl text-accent" />
                </motion.div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="preference" className="text-ink">
            When do you prefer to journal?
          </Label>
          <Input
            id="preference"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            placeholder="e.g., morning, night"
            required
            className="w-full bg-background text-ink font-handwritten text-lg"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full bg-accent text-paper hover:bg-opacity-90">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-5 h-5 border-t-2 border-b-2 border-paper rounded-full"
            />
          ) : (
            "Let's Begin!"
          )}
        </Button>
      </form>
    </motion.div>
  )
}

