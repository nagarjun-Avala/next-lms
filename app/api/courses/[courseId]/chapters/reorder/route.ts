import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const { courseId } = params;
        const { list } = await req.json();


        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        for (let item of list) {

            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            });
        }


        return new NextResponse("success", { status: 200 });

    } catch (err) {
        console.log("[CHAPTERS_REORDER]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}