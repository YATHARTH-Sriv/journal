import { OpenAIApi, Configuration } from "openai-edge";
import { NextRequest, NextResponse } from "next/server";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  try {
    const recommendation = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Based on this journal entry, recommend relevant articles, books, or activities."
      }, {
        role: "user",
        content
      }]
    });
    const res = await recommendation.json();

    return NextResponse.json({ recommendations: res?.choices[0]?.message?.content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 });
  }
}