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
        const { url } = await req.json();


        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId,
            },
        });

        return NextResponse.json(attachment);

    } catch (err) {
        console.log("[COURSES_ID_ATTACHMENTS]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}