import { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Create Note - NoteHub",
  description: "Create a new note and organize your thoughts with NoteHub.",
  openGraph: {
    title: "Create Note - NoteHub",
    description: "Create a new note and organize your thoughts with NoteHub.",
    url: "https://notehub.example.com/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
