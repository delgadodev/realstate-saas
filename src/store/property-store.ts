import { create } from "zustand";

interface State {
  isCreated: boolean;

  onCreated: () => void;
}

export const usePropertyState = create<State>()((set) => ({
  isCreated: false,

  onCreated: () => set({ isCreated: true }),
}));
