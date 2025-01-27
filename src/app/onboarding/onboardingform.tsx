"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import axios from "axios"
import { useSession } from "next-auth/react"
import { ProgressSteps } from "@/components/progressbar"
import Image from "next/image"

const steps = ["Your Name", "Your Mood", "Interests", "Preferences"]

const interests = [
  { id: "history", name: "History", icon: "/history.jpg" },
  { id: "art", name: "Art", icon: "/art.jpg" },
  { id: "articles", name: "Articles", icon: "/articles.webp" },
  { id: "tourism", name: "Tourism", icon: "/tourism.jpg" },
  { id: "sport", name: "Sport", icon: "/sport.png" },
]

export default function OnboardingForm() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    mood: "",
    interests: [] as string[],
    preferences: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleNext = () => {
    if (
      (step === 0 && !formData.name) ||
      (step === 1 && !formData.mood) ||
      (step === 2 && formData.interests.length === 0)
    ) {
      toast({
        title: "Required Field",
        description: "Please fill in this step before continuing",
        variant: "destructive"
      })
      return
    }
    setStep((prev) => prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.mood || !formData.interests.length || !formData.preferences) {
      toast({
        title: "Missing Information",
        description: "Please complete all steps before continuing",
        variant: "destructive"
      })
      return
    }
    setIsLoading(true)
    try {
      await axios.post("/api/onboarding", formData)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      toast({
        title: "Welcome aboard!",
        description: "Your journal journey begins now",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    }
    setIsLoading(false)
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <NameStep 
            value={formData.name}
            onChange={(name) => setFormData(prev => ({ ...prev, name }))}
          />
        )
      case 1:
        return (
          <MoodStep 
            value={formData.mood}
            onChange={(mood) => setFormData(prev => ({ ...prev, mood }))}
          />
        )
      case 2:
        return (
          <InterestsStep 
            selected={formData.interests}
            onChange={(interests) => setFormData(prev => ({ ...prev, interests }))}
          />
        )
      case 3:
        return (
          <PreferencesStep 
            value={formData.preferences}
            onChange={(preferences) => setFormData(prev => ({ ...prev, preferences }))}
          />
        )
      default:
        return null
    }
  }
  const isLastStep = step === steps.length - 1
  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressSteps currentStep={step} steps={steps} />
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 0 && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Back
              </Button>
            )}
             {isLastStep ? (
              <Button 
                type="submit"
                disabled={isLoading || !formData.preferences}
                className="ml-auto"
              >
                Complete
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleNext}
                className="ml-auto"
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Step Components
function NameStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-ink">What should we call you?</h2>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your name"
        className="text-lg font-handwritten"
      />
    </div>
  )
}

// Add these constants at the top with other constants
const moods = [
  { id: "happy", name: "Happy", icon: "😊" },
  { id: "neutral", name: "Neutral", icon: "😐" },
  { id: "sad", name: "Sad", icon: "😔" },
  { id: "excited", name: "Excited", icon: "🤩" },
  { id: "anxious", name: "Anxious", icon: "😰" }
]

const timePreferences = [
  { id: "morning", name: "Morning (6AM - 12PM)" },
  { id: "afternoon", name: "Afternoon (12PM - 5PM)" },
  { id: "evening", name: "Evening (5PM - 9PM)" },
  { id: "night", name: "Night (9PM - 12AM)" }
]

// Replace the existing MoodStep component
function MoodStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-ink">How are you feeling today?</h2>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-5 gap-4">
        {moods.map((mood) => (
          <div 
            key={mood.id}
            className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all
              ${value === mood.id ? 'border-accent bg-accent/10' : 'border-transparent hover:bg-muted'}`}
            onClick={() => onChange(mood.id)}
          >
            <span className="text-4xl mb-2">{mood.icon}</span>
            <span className="text-sm font-medium">{mood.name}</span>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

// Replace the existing InterestsStep component
function InterestsStep({ selected, onChange }: { selected: string[]; onChange: (value: string[]) => void }) {
  const toggleInterest = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(i => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-ink">What interests you?</h2>
      <div className="grid grid-cols-3 gap-4">
        {interests.map((interest) => (
          <div
            key={interest.id}
            onClick={() => toggleInterest(interest.id)}
            className={`relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all
              ${selected.includes(interest.id) ? 'border-accent bg-accent/10' : 'border-transparent hover:bg-muted'}`}
          >
            <Image
              src={interest.icon} 
              alt={interest.name} 
              className="rounded-lg object-cover mb-2" 
              width={64}
              height={64}


            />
            <span className="text-sm font-medium">{interest.name}</span>
            {selected.includes(interest.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-accent text-white rounded-full p-1"
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path
                    d="M3.5 6.5l2 2 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Replace the existing PreferencesStep component
function PreferencesStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-ink">When do you prefer to journal?</h2>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
        {timePreferences.map((pref) => (
          <div
            key={pref.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all
              ${value === pref.id ? 'border-accent bg-accent/10' : 'border-transparent hover:bg-muted'}`}
            onClick={() => onChange(pref.id)}
          >
            <RadioGroupItem value={pref.id} id={pref.id} className="hidden" />
            <span className="text-base font-medium">{pref.name}</span>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}