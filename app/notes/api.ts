import axios from "axios";
import { Note, NoteFormData } from "@/types/note";

const axiosInstance = axios.create({
  baseURL: "https://67be369db2320ee050100063.mockapi.io/api", // Замініть на ваш URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (query?: string): Promise<Note[]> => {
  const response = await axiosInstance.get("/notes", {
    params: query ? { search: query } : {},
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axiosInstance.get(`/notes/${id}`);
  return response.data;
};

export const addNote = async (noteData: NoteFormData): Promise<Note> => {
  const response = await axiosInstance.post("/notes", noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/notes/${id}`);
};
