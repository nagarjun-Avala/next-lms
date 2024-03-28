import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const { courseId } = params;

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const UnpublishedCourse = await db.course.update({
            where: {
                id: course.id,
                userId,
            },
            data: {
                isPublished: false,
            },
        });

        return NextResponse.json(UnpublishedCourse);


    } catch (err) {
        console.log("[COURSE_ID_UNPUBLISH]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
