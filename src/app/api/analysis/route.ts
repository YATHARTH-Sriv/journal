import { NextRequest, NextResponse } from "next/server";
import { OpenAIApi, Configuration } from "openai-edge";
import prisma from "@/lib/prisma";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  const { content, journalId } = await req.json();

  try {
    // Generate analysis
    const analysis = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Analyze this journal entry for emotional patterns, key insights, and provide constructive feedback."
      }, {
        role: "user",
        content
      }]
    });
    const res = await analysis.json();

    // Store analysis
    await prisma.journal.update({
      where: { id: journalId },
      data: {
        aiAnalysis: res?.choices[0]?.message?.content
      }
    });

    return NextResponse.json({ analysis: res?.choices[0]?.message?.content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze journal" }, { status: 500 });
  }
}