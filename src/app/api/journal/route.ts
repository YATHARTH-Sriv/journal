// app/api/journal/route.ts
import prisma from "@/lib/prisma";
import { OpenAIApi, Configuration } from "openai-edge";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
    try {
        const { content, tags, mood, position } = await req.json();
        
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate embeddings if content is present
        let embedding;
        if (content) {
            const embeddingResponse = await openai.createEmbedding({
                model: "text-embedding-ada-002",
                input: content,
            });
            const result = await embeddingResponse.json();
            embedding = result.data[0].embedding;
        }

        // Create journal entry
        const journal = await prisma.journal.create({
            data: {
                userId: user.id,
                content,
                tags: tags || [],
                mood: mood || null,
                embedding: embedding || [],
                position: position ? JSON.stringify(position) : null,
            },
        });

        return NextResponse.json({ success: true, journal }, { status: 201 });
        
    } catch (error) {
        console.error("Error creating journal:", error);
        return NextResponse.json({ error: "Failed to create journal" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const journals = await prisma.journal.findMany({
            where: {
                user: {
                    email: session.user.email
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ journals });
    } catch (error) {
        console.error("Error fetching journals:", error);
        return NextResponse.json({ error: "Failed to fetch journals" }, { status: 500 });
    }
}