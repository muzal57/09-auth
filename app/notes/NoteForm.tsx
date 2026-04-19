"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "@/lib/api";
import { NoteFormData } from "@/types/note";
import css from "./NoteForm.module.css";

const NoteForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    content: "",
    tag: "",
  });

  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setFormData({ title: "", content: "", tag: "" });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNoteMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
        className={css.input}
      />
      <textarea
        name="content"
        placeholder="Content"
        value={formData.content}
        onChange={handleChange}
        required
        className={css.textarea}
      />
      <input
        type="text"
        name="tag"
        placeholder="Tag"
        value={formData.tag}
        onChange={handleChange}
        className={css.input}
      />
      <button
        type="submit"
        disabled={addNoteMutation.isPending}
        className={css.button}
      >
        {addNoteMutation.isPending ? "Adding..." : "Add Note"}
      </button>
      {addNoteMutation.isError && (
        <p className={css.error}>
          Error adding note: {addNoteMutation.error?.message}
        </p>
      )}
    </form>
  );
};

export default NoteForm;
