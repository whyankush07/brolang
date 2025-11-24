import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const bugs = await prisma.bug.findMany();
        return NextResponse.json({ success: true, bugs });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server Error!!" });
    }
}

export async function POST(req: NextRequest) {
    try {
        console.log("Received bug report request");
        const reqBody = await req.json();
        const { bugDescription } = reqBody;

        const createdBug = await prisma.bug.create({
            data: {
                bug: bugDescription,
            },
        });

        if (!createdBug) {
            return NextResponse.json({ success: false, message: "An error occurred while reporting the bug" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Bug reported successfully!" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server Error!!" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const authHeader = req.headers.get('x-auth-password');
    if (authHeader !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { bugId, status } = await req.json();
        const updatedBug = await prisma.bug.update({
            where: { id: bugId },
            data: { status }
        });
        return NextResponse.json({ success: true, bug: updatedBug });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const authHeader = req.headers.get('x-auth-password');
    if (authHeader !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const reqBody = await req.json();
        const { bugId } = reqBody;

        const deletedBug = await prisma.bug.delete({
            where: {
                id: bugId,
            },
        });

        if (!deletedBug) {
            return NextResponse.json({ success: false, message: "An error occurred while deleting the bug" }, { status: 500 });
        }

        const path = req.nextUrl.searchParams.get('path') || "/bugs";
        revalidatePath(path);

        return NextResponse.json({ success: true, message: "Bug deleted successfully!" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error in server!" }, { status: 500 });
    }
}