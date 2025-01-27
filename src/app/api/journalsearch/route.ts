
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export default async function POST(req: NextRequest) {
    const { userId, query } = await req.json();

    try {
      const journals = await prisma.journal.findMany({
        where: {
          userId,
          content: {
            contains: query, // Full-text search
          },
        },
      });
      return NextResponse.json(journals,{ status: 200 });
    } catch (error) {
      console.error("Error searching journals:", error);
      return NextResponse.json({  error: "Failed to search journals." },{ status: 500 })
    }
}
