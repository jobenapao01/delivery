import { create } from "zustand";

type ModalState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id?: string) => void;
  onClose: () => void;
};

export const useOpenOrderModal = create<ModalState>((set) => ({
  id: undefined,
  isOpen: false,
  onClose: () => set({ id: undefined, isOpen: false }),
  onOpen: (id?: string) => set({ id, isOpen: true }),
}));
