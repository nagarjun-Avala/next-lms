import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PUT(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const { courseId, chapterId } = params;
        const { isCompleted } = await req.json();

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                }
            },
            update: {
                isCompleted,
            },
            create: {
                userId,
                chapterId,
                isCompleted,
            }
        });

        return NextResponse.json(userProgress);

    } catch (err) {
        console.log("[CHAPTER_ID_PROGRESS]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
