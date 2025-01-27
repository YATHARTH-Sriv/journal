
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
    const { userId, content } = await req.json();

    try {
      // Save notification to the database
      const notification = await prisma.notification.create({
        data: {
          userId,
          content,
        },
      });

      // Send email (using nodemailer)
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const user = await prisma.user.findUnique({ where: { id: userId } });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user?.email,
        subject: "Daily Reminder",
        text: content,
      });

      return NextResponse.json({ message: "Notification scheduled and sent." },{ status: 200 });
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return NextResponse.json({error: "Failed to schedule notification."} ,{ status: 500 });
    }
}
