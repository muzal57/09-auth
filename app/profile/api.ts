import axios from "axios";
import { Note, NoteFormData } from "@/types/note";

const API_BASE_URL = "https://notehub.app/api"; // Replace with your actual API base URL if different

const notehubToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!notehubToken) {
  console.error("NEXT_PUBLIC_NOTEHUB_TOKEN is not defined");
  // In a real application, you might want to throw an error or handle this more gracefully
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(notehubToken && { Authorization: `Bearer ${notehubToken}` }),
  },
});

export const fetchNotes = async (query?: string): Promise<Note[]> => {
  try {
    const response = await axiosInstance.get("/notes", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const response = await axiosInstance.get(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching note with ID ${id}:`, error);
    throw error;
  }
};

export const addNote = async (noteData: NoteFormData): Promise<Note> => {
  try {
    const response = await axiosInstance.post("/notes", noteData);
    return response.data;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/notes/${id}`);
  } catch (error) {
    console.error(`Error deleting note with ID ${id}:`, error);
    throw error;
  }
};
