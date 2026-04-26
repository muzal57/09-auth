import { cookies, headers } from "next/headers";
import { axiosInstance } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

const getAuthHeaders = async () => {
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
  const cookieHeader = ["accessToken", "refreshToken"]
    .map((name) => cookieStore.get(name)?.value)
    .filter(Boolean)
    .join("; ");

  return cookieHeader
    ? {
        headers: {
          Cookie: cookieHeader,
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
  return axiosInstance
    .get("/notes", {
      params: { search: query, page, perPage, tag: tag === "all" ? "" : tag },
      ...auth,
    })
    .then((res) => res.data);
};

export const fetchNoteById = async (id: string) => {
  const auth = await getAuthHeaders();
  return axiosInstance.get<Note>(`/notes/${id}`, auth).then((res) => res.data);
};

export const getMe = async () => {
  const auth = await getAuthHeaders();
  return axiosInstance.get<User>("/users/me", auth).then((res) => res.data);
};

export const checkSession = async () => {
  const auth = await getAuthHeaders();
  try {
    const res = await axiosInstance.get<User | null>("/auth/session", auth);
    return res.data;
  } catch {
    return null;
  }
};
