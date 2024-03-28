import { create } from 'zustand'

type ConfettiStore = {
    isOpne: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useConfettiStore = create<ConfettiStore>((set) => ({
    isOpne: false,
    onOpen: () => set({ isOpne: true }),
    onClose: () => set({ isOpne: false }),

}))