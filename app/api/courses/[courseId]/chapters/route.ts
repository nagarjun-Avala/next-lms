import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const { courseId } = params;
        const { title } = await req.json();


        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId
            },
            orderBy: {
                position: "desc"
            },
        });

        const newPosition = lastChapter?.position ? lastChapter?.position + 1 : 0;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId,
                position: newPosition
            },
        });

        return NextResponse.json(chapter);

    } catch (err) {
        console.log("[CHAPTERS]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}