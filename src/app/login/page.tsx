"use client"
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Continue your journaling journey</p>
        </div>
        <Button
          onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
          className="w-full flex items-center justify-center gap-2"
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          Continue with Google
        </Button>
      </div>
    </div>
  )
}