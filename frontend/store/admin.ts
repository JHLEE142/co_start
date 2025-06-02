// store/admin.ts
import { create } from "zustand";

type AdminState = {
  isAdmin: boolean;
  setAdmin: (value: boolean) => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  isAdmin: false,
  setAdmin: (value) => set({ isAdmin: value }),
}));
