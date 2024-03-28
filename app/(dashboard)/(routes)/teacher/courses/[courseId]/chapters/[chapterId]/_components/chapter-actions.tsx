"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/modals/confirm-model";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}



export const ChapterActions = ({ disabled,
    courseId,
    chapterId,
    isPublished }: ChapterActionsProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success(`Chapter is Unpublished`);
            }
            else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                toast.success(`Chapter is Published`);
            }
            router.refresh();

        } catch {
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }
    const onDelete = async () => {
        try {
            setIsLoading(true)

            const chapter = await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success(`Chapter Deleted`);
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);

        } catch {
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant={"outline"}
                size={"sm"}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal title={"Are you sure, You want to delete this chapter"} onConfirm={onDelete} >
                <Button
                    size={"sm"}
                    disabled={isLoading}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
}