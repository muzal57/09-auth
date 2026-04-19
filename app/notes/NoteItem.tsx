"use client";

import { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import Link from "next/link";
import css from "./NoteItem.module.css";

interface NoteItemProps {
  note: Note;
}

const NoteItem = ({ note }: NoteItemProps) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(note.id);
  };

  return (
    <li className={css.item}>
      <h3 className={css.title}>{note.title}</h3>
      <p className={css.content}>{note.content}</p>
      <p className={css.tag}>{note.tag}</p>
      <p className={css.date}>
        {new Date(note.createdAt).toLocaleDateString()}
      </p>
      <div className={css.actions}>
        <Link href={`/notes/${note.id}`} className={css.viewDetails}>
          View details
        </Link>
        <button onClick={handleDelete} disabled={deleteMutation.isPending}>
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
};

export default NoteItem;
