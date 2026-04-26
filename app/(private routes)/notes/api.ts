import { axiosInstance } from "@/lib/api/api";
import { Note, NoteFormData } from "@/types/note";

export const fetchNotes = async (query?: string): Promise<Note[]> => {
  const response = await axiosInstance.get("/notes", {
    params: query ? { search: query } : {},
  });
  return response.data.data; // Бекенд повертає масив у полі data
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axiosInstance.get(`/notes/${id}`);
  return response.data.data;
};

export const addNote = async (noteData: NoteFormData): Promise<Note> => {
  const response = await axiosInstance.post("/notes", noteData);
  return response.data.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/notes/${id}`);
};
