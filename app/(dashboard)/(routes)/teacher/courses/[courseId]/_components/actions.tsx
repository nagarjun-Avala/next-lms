"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/modals/confirm-model";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";


interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({ disabled,
    courseId,
    isPublished }: ActionsProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const confetti = useConfettiStore();
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success(`Course is Unpublished`);
            }
            else {
                await axios.patch(`/api/courses/${courseId}/publish`)
                toast.success(`Course is Published`);
                confetti.onOpen();
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

            const chapter = await axios.delete(`/api/courses/${courseId}`);
            toast.success(`Course Deleted`);
            router.refresh();
            router.push(`/teacher/courses`);

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
            <ConfirmModal title={"Are you sure, You want to delete this Course"} onConfirm={onDelete} >
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