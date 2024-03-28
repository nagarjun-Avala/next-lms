import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const { courseId, attachmentId } = params;


        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const attachment = await db.attachment.delete({
            where: {
                courseId,
                id: attachmentId
            },
        });

        return NextResponse.json(attachment);

    } catch (err) {
        console.log("[ATTACHMENT_ID]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}