import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const { courseId, chapterId } = params;

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const unPublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                isPublished: false,
            },
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                id: chapterId,
                courseId,
                isPublished: true
            },
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                    userId,
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(unPublishedChapter);

    } catch (err) {
        console.log("[CHAPTER_ID_UNPUBLISH]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
