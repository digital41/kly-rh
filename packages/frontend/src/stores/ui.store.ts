import { create } from 'zustand';

interface UIState {
  isSheetOpen: boolean;
  sheetStartDate: string | null;
  sheetEndDate: string | null;
  toastMessage: string | null;
  toastTimeout: ReturnType<typeof setTimeout> | null;
  openSheet: () => void;
  openSheetWithDates: (start: string, end: string) => void;
  closeSheet: () => void;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isSheetOpen: false,
  sheetStartDate: null,
  sheetEndDate: null,
  toastMessage: null,
  toastTimeout: null,

  openSheet: () => set({ isSheetOpen: true, sheetStartDate: null, sheetEndDate: null }),

  openSheetWithDates: (start, end) =>
    set({ isSheetOpen: true, sheetStartDate: start, sheetEndDate: end }),

  closeSheet: () => set({ isSheetOpen: false, sheetStartDate: null, sheetEndDate: null }),

  showToast: (msg) => {
    const prev = get().toastTimeout;
    if (prev) clearTimeout(prev);
    const timeout = setTimeout(() => {
      set({ toastMessage: null, toastTimeout: null });
    }, 2500);
    set({ toastMessage: msg, toastTimeout: timeout });
  },

  hideToast: () => {
    const prev = get().toastTimeout;
    if (prev) clearTimeout(prev);
    set({ toastMessage: null, toastTimeout: null });
  },
}));
