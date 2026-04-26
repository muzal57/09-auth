import { axiosInstance } from "./api";
import { Note, NoteFormData } from "@/types/note";
import { User } from "@/types/user";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = (query = "", page = 1, perPage = 12, tag = "") =>
  axiosInstance
    .get<NotesResponse>("/notes", {
      params: {
        search: query,
        page,
        perPage,
        tag: tag === "all" ? "" : tag,
      },
    })
    .then((res) => res.data);

export const fetchNoteById = (id: string) =>
  axiosInstance.get<Note>(`/notes/${id}`).then((res) => res.data);

export const createNote = (noteData: NoteFormData) =>
  axiosInstance.post<Note>("/notes", noteData).then((res) => res.data);

export const deleteNote = (id: string) =>
  axiosInstance.delete(`/notes/${id}`).then((res) => res.data);

export const register = (data: { email: string; password: string }) =>
  axiosInstance.post<User>("/auth/register", data).then((res) => res.data);

export const login = (data: { email: string; password: string }) =>
  axiosInstance.post<User>("/auth/login", data).then((res) => res.data);

export const logout = () =>
  axiosInstance.post("/auth/logout").then(() => undefined);

export const checkSession = async (): Promise<boolean> => {
  const response = await axiosInstance.get<{ success: boolean }>(
    "/auth/session",
  );
  return response.data.success;
};

export const getMe = () =>
  axiosInstance.get<User>("/users/me").then((res) => res.data);

export const updateMe = (data: Partial<User>) =>
  axiosInstance.patch<User>("/users/me", data).then((res) => res.data);
