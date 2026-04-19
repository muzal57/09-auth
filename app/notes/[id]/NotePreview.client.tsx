"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NoteDetails.module.css";

const NotePreview = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id!),
    enabled: !!id,
    refetchOnMount: false,
  });

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/notes/filter/all");
    }
  };

  return (
    <Modal title={note?.title || "Note Preview"} onClose={handleClose}>
      {isLoading && <p>Loading note preview...</p>}
      {isError && <p>Failed to load note preview.</p>}
      {note && (
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </p>
          {note.updatedAt && note.createdAt !== note.updatedAt && (
            <p className={css.date}>
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
};

export default NotePreview;
