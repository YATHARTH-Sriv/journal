"use client"

import { motion } from "framer-motion"
import { ArrowRight, Cloud, Moon, Sun, Heart, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted overflow-hidden relative flex flex-col">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      <motion.div
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-24 left-10 pointer-events-none"
      >
        <Cloud className="w-12 h-12 text-accent/20" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-32 right-10 pointer-events-none"
      >
        <Moon className="w-16 h-16 text-accent/20" />
      </motion.div>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-foreground/90 leading-tight">
            Welcome to <span className="text-accent">JournalAI</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Unleash your thoughts and let AI guide your journey of self-discovery
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-center pt-8"
          >
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 transition-transform hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="transition-transform hover:scale-105">
                Login
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Section */}
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  )
}

// Navbar Component
function Navbar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  return (
    <header className="relative z-50 bg-white/70 backdrop-blur-sm border-b border-accent/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-ink cursor-pointer">JournalAI</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/dashboard" className="hover:text-accent transition-colors">
            Dashboard
          </Link>
          <Link href="/onboarding" className="hover:text-accent transition-colors">
            Onboarding
          </Link>
          <Link href="/login" className="hover:text-accent transition-colors">
            Login
          </Link>
        </nav>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center text-ink"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {menuOpen && (
        <motion.nav
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white border-t border-accent/10"
        >
          <ul className="flex flex-col px-4 py-2 space-y-2">
            <li>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block w-full hover:text-accent transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/onboarding"
                onClick={() => setMenuOpen(false)}
                className="block w-full hover:text-accent transition-colors"
              >
                Onboarding
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full hover:text-accent transition-colors"
              >
                Login
              </Link>
            </li>
          </ul>
        </motion.nav>
      )}
    </header>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-accent" />,
      title: "Emotional Intelligence",
      description: "Track your moods and uncover emotional patterns with AI."
    },
    {
      icon: <Sun className="w-8 h-8 text-accent" />,
      title: "Daily Insights",
      description: "Receive personalized recommendations based on your journals."
    },
    {
      icon: <Moon className="w-8 h-8 text-accent" />,
      title: "Reflect & Grow",
      description: "Analyze past entries for deeper insights into your journey."
    },
  ]

  return (
    <section className="mt-32">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center text-ink mb-8"
      >
        What JournalAI Offers
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 shadow-md text-center"
          >
            <div className="mb-4 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur-sm mt-20 border-t border-accent/10">
      <div className="container mx-auto p-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <span className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} JournalAI. All rights reserved.</span>
        <div className="flex space-x-4 text-black">
          <SocialIcon link="https://github.com/YATHARTH-Sriv" label="GitHub" icon="github" />
          <SocialIcon link="https://www.instagram.com/yatharth_sriv/" label="Instagram" icon="instagram" />
          <SocialIcon link="https://www.linkedin.com/in/yatharth-srivastava-0b0382261/" label="LinkedIn" icon="linkedin" />
          <SocialIcon link="https://twitter.com/yatharth_sriv" label="Twitter" icon="twitter" />
        </div>
      </div>
    </footer>
  )
}

// Social Icon
function SocialIcon({ link, label, icon }: { link: string; label: string; icon: string }) {
  return (
    <motion.a
      whileHover={{ scale: 1.1 }}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ink hover:text-accent transition-colors"
      aria-label={label}
    >
      {label === "GitHub" && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 ..."
      /></svg>}
      {label === "Instagram" && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7.75 2h8.5A5.75 5.75 0 0 1..." 
      /></svg>}
      {label === "LinkedIn" && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.452 20.452h-3.808..." 
      /></svg>}
      {label === "Twitter" && <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.954 4.569c-..." 
      /></svg>}
    </motion.a>
  )
}