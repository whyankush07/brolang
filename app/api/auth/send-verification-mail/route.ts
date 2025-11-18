import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sendVerificationEmail from "@/helpers/SendVerificationEmail";
import generateToken from "@/utils/GenerateToken";

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { email } = reqBody;

        const token = generateToken();
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    name: email.split("@")[0],
                    verificationCode: token,
                }
            });
            sendVerificationEmail(newUser.name, email, token || newUser.verificationCode);
        } else {
            await prisma.user.update({
                where: { email },
                data: { verificationCode: token }
            });
            sendVerificationEmail(user.name, email, token || user.verificationCode);
        }

        return NextResponse.json({ message: "Verification Email Sent" }, { status: 200 });

    } catch (error) {
        console.error("Error in verification route:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}