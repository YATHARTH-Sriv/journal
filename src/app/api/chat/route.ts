import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, journalId } = body;

    if (!content || !journalId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const journal = await prisma.journal.findUnique({
      where: { 
        id: journalId,
      },
      include: {
        chats: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
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

    const chatContext = journal.chats.length > 0
      ? `Previous conversation context: ${journal.chats.reverse().map(chat => 
          `User: ${chat.content}\nAI: ${chat.response}`
        ).join('\n')}`
      : 'No previous conversation';

    const analysisContext = journal.aiAnalysis
      ? `Analysis summary: ${journal.aiAnalysis.summary || ''}\nSentiment: ${journal.aiAnalysis.sentiment || ''}\nTopics: ${journal.aiAnalysis.topics?.join(', ') || ''}`
      : 'No analysis available';

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    // Prepare the prompt
    const prompt = `You are an empathetic AI journaling assistant. Help the user reflect on their journal entries and provide thoughtful insights.
                   Current journal entry: "${journal.content}"
                   ${analysisContext}
                   ${chatContext}
                   User query: ${content}`;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    if (!aiResponse) {
      throw new Error("Invalid response from Gemini");
    }

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