"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PlusCircle, ImageIcon, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    url: z.string().min(1),
})

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const toggleEdit = () => setIsEditing(current => !current)
    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course attachment updated");
            toggleEdit();
            router.refresh();

        } catch {
            toast.error("Something went wrong!")
        }

    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted");
            router.refresh();

        } catch {
            toast.error("Something went wrong!")
        } finally {
            setDeletingId(null)
        }

    }

    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachment
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4  mr-2" />
                            Add {initialData.attachments.length > 0 ? "more" : "a"} file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md" key={attachment.id}>
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id ?
                                        (
                                            <div className="ml-auto">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            </div>
                                        ) :
                                        (
                                            <button
                                                onClick={() => onDelete(attachment.id)}
                                                className="ml-auto hover:opacity-75 transition"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )
                                    }
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="">
                    <FileUpload
                        endpoint={"courseAttachment"}
                        onChange={(url1) => {
                            if (url1) {
                                onSubmit({ url: url1 });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete the course.
                    </div>
                </div>
            )}
        </div>
    );
}
