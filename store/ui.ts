import { create } from "zustand";

interface UIState {
  searchOpen: boolean;
  menuOpen: boolean;
  cursorLabel: string | null;
  setSearchOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setCursorLabel: (label: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchOpen: false,
  menuOpen: false,
  cursorLabel: null,
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setCursorLabel: (cursorLabel) => set({ cursorLabel }),
}));
