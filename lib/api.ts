import axios from "axios";
import { Note, NoteFormData } from "@/types/note";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_BASE_URL = "https://notehub-public.goit.study/api"; 
const notehubToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!notehubToken) {
  console.error("NEXT_PUBLIC_NOTEHUB_TOKEN is not defined");
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(notehubToken && { Authorization: `Bearer ${notehubToken}` }),
  },
});

export const fetchNotes = async (
  query?: string,
  page: number = 1,
  limit: number = 10,
  tag?: string,
): Promise<NotesResponse> => {
  const params: Record<string, string | number | undefined> = {
    search: query,
    page,
    perPage: limit,
  };

  if (tag && tag !== "all") {
    params.tag = tag;
  }

  const response = await axiosInstance.get<NotesResponse>("/notes", {
    params,
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axiosInstance.get<Note>(`/notes/${id}`);
  return response.data;
};

export const addNote = async (noteData: NoteFormData): Promise<Note> => {
  const response = await axiosInstance.post<Note>("/notes", noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};
