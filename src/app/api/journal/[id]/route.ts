import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { content, position } = await req.json();
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { id } = await params; // Await the params here

        // First verify the journal belongs to the user
        const existingJournal = await prisma.journal.findFirst({
            where: {
                id: id,
                user: {
                    email: session.user.email
                }
            }
        });

        if (!existingJournal) {
            return NextResponse.json({ error: "Journal not found or unauthorized" }, { status: 404 });
        }

        const journal = await prisma.journal.update({
            where: { id: id },
            data: {
                content,
                position: position ? JSON.stringify(position) : undefined
            }
        });

        return NextResponse.json({ success: true, journal });
    } catch (error) {
        console.error("Error updating journal:", error);
        return NextResponse.json({ error: "Failed to update journal" }, { status: 500 });
    }
}