"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import ReactConfetti from "react-confetti";


export const ConfettiProvider = () => {
    const confetti = useConfettiStore()
    if (!confetti.isOpne) return null;

    return (
        <ReactConfetti
            className="ponter-events-none z-[100]"
            numberOfPieces={500}
            recycle={false}
            onConfettiComplete={() => {
                confetti.onClose();
            }}
        />
    );
}