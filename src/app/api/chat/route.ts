import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const body = await req.json();
    const { content, journalId } = body;

    if (!content || !journalId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get journal and previous chats
    const journal = await prisma.journal.findUnique({
      where: { 
        id: journalId,
      },
      include: {
        chats: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Get last 5 messages for context
        },
        aiAnalysis: true
      }
    });

    if (!journal) {
      return NextResponse.json(
        { error: "Journal not found" },
        { status: 404 }
      );
    }

    // Prepare context from previous chats
    const chatContext = journal.chats.length > 0
      ? `Previous conversation context: ${journal.chats.reverse().map(chat => 
          `User: ${chat.content}\nAI: ${chat.response}`
        ).join('\n')}`
      : 'No previous conversation';

    // Get AI analysis context if available
    const analysisContext = journal.aiAnalysis
      ? `Analysis summary: ${journal.aiAnalysis.summary || ''}\nSentiment: ${journal.aiAnalysis.sentiment || ''}\nTopics: ${journal.aiAnalysis.topics?.join(', ') || ''}`
      : 'No analysis available';

    // Create chat completion using Gemini API
    const response = await fetch('https://api.gemini.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an empathetic AI journaling assistant. Help the user reflect on their journal entries and provide thoughtful insights. Current journal entry: "${journal.content}". ${analysisContext}. ${chatContext}`
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const result = await response.json();

    if (!result.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from Gemini");
    }

    const aiResponse = result.choices[0].message.content;

    // Create new chat message
    const newChat = await prisma.chat.create({
      data: {
        content: content,
        response: aiResponse,
        journal: {
          connect: { id: journalId }
        },
        user: {
          connect: { email: session.user.email }
        }
      }
    });

    // Update or create AI analysis if it doesn't exist
    if (!journal.aiAnalysis) {
      await prisma.aiAnalysis.create({
        data: {
          journalId: journalId,
          summary: "Initial analysis pending",
          sentiment: "neutral",
          topics: [],
          insights: {}
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      response: aiResponse,
      timestamp: newChat.createdAt
    });

  } catch (error: any) {
    console.error("Chat error:", error);
    
    const errorMessage = error.code === 'GEMINI_API_ERROR' 
      ? 'Failed to get AI response'
      : error.code === 'P2002' 
        ? 'Database constraint violation'
        : 'Internal server error';

    return NextResponse.json(
      { error: errorMessage }, 
      { status: error.status || 500 }
    );
  }
}