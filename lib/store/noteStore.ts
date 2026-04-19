import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NoteFormData } from "@/types/note";

export const initialDraft: NoteFormData = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteStore {
  draft: NoteFormData;
  setDraft: (note: Partial<NoteFormData>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage",
    },
  ),
);
