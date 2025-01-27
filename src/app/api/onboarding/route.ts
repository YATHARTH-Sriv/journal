import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(req: NextRequest) {
  try {
    const { name, mood, interests, preferences } = await req.json();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ 
        error: "User not authenticated." 
      }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: {
          email: session.user.email
        },
        data: {
          name,
          mood,
          interests,
          preferences: JSON.stringify(preferences),
          isOnboarded: true
        }
      });
      return NextResponse.json({ 
        message: "User preferences updated successfully.",
        user: updatedUser 
      }, { status: 200 });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email: session.user.email,
        mood,
        interests,
        preferences: JSON.stringify(preferences),
        isOnboarded: true
      }
    });

    return NextResponse.json({ 
      message: "User created successfully.",
      user: newUser 
    }, { status: 201 });

  } catch (error) {
    console.error("Error in onboarding:", error);
    return NextResponse.json({ 
      error: "Failed to save user preferences" 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "Not authenticated" 
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    return NextResponse.json({ 
      isOnboarded: !!user?.isOnboarded 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.json({ 
      error: "Failed to check onboarding status" 
    }, { status: 500 });
  }
}