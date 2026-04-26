import { cookies, headers } from "next/headers";
import { axiosInstance } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const getAuthHeaders = async (cookieHeader?: string) => {
  if (cookieHeader) {
    return {
      headers: {
        Cookie: cookieHeader,
      },
    };
  }

  const requestHeaders = await headers();
  const incomingCookieHeader = requestHeaders.get("cookie");
  if (incomingCookieHeader) {
    return {
      headers: {
        Cookie: incomingCookieHeader,
      },
    };
  }

  const cookieStore = await cookies();
  const generatedCookieHeader = ["accessToken", "refreshToken"]
    .map((name) => cookieStore.get(name)?.value)
    .filter(Boolean)
    .join("; ");

  return generatedCookieHeader
    ? {
        headers: {
          Cookie: generatedCookieHeader,
        },
      }
    : {};
};

export const fetchNotes = async (
  query = "",
  page = 1,
  perPage = 12,
  tag = "",
) => {
  const auth = await getAuthHeaders();
  const response = await axiosInstance.get<NotesResponse>("/notes", {
    params: {
      search: query,
      page,
      perPage,
      tag: tag === "all" ? "" : tag,
    },
    ...auth,
  });
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const auth = await getAuthHeaders();
  const response = await axiosInstance.get<Note>(`/notes/${id}`, auth);
  return response.data;
};

export const getMe = async () => {
  const auth = await getAuthHeaders();
  const response = await axiosInstance.get<User>("/users/me", auth);
  return response.data;
};

export const checkSession = async (cookieHeader?: string) => {
  const auth = await getAuthHeaders(cookieHeader);
  return axiosInstance.get<{ success: boolean }>("/auth/session", auth);
};
