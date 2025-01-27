import { motion } from "framer-motion"

interface ProgressStepsProps {
  currentStep: number
  steps: string[]
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between relative">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: currentStep >= index ? 1 : 0.5 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                ${currentStep >= index ? 'bg-accent text-white' : 'bg-gray-200'}`}
            >
              {currentStep > index ? '✓' : index + 1}
            </motion.div>
            <span className="text-xs text-gray-500">{step}</span>
          </div>
        ))}
        <div className="absolute top-4 left-0 h-[2px] bg-gray-200 w-full -z-10" />
        <motion.div 
          className="absolute top-4 left-0 h-[2px] bg-accent"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}