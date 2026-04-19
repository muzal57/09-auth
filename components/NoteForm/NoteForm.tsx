"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { addNote } from "@/lib/api";
import { NoteFormData } from "@/types/note";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  onCancel?: () => void;
}

const NoteForm = ({ onCancel }: NoteFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize form with draft or initial values
  useEffect(() => {
    if (formRef.current) {
      const titleInput = formRef.current.elements.namedItem(
        "title",
      ) as HTMLInputElement;
      const contentInput = formRef.current.elements.namedItem(
        "content",
      ) as HTMLTextAreaElement;
      const tagSelect = formRef.current.elements.namedItem(
        "tag",
      ) as HTMLSelectElement;

      if (titleInput) titleInput.value = draft.title || "";
      if (contentInput) contentInput.value = draft.content || "";
      if (tagSelect) tagSelect.value = draft.tag || "Todo";
    }
  }, [draft]);

  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.back();
    },
    onError: (error: any) => {
      setErrors({ submit: error?.message || "Failed to add note" });
      setIsSubmitting(false);
    },
  });

  const validateForm = (formData: NoteFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = "Title is required and must be at least 3 characters";
    }

    if (formData.content && formData.content.length > 500) {
      newErrors.content = "Content must be less than 500 characters";
    }

    if (!formData.tag) {
      newErrors.tag = "Tag is required";
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleInput = formRef.current?.elements.namedItem(
      "title",
    ) as HTMLInputElement;
    const contentInput = formRef.current?.elements.namedItem(
      "content",
    ) as HTMLTextAreaElement;
    const tagSelect = formRef.current?.elements.namedItem(
      "tag",
    ) as HTMLSelectElement;

    const formData: NoteFormData = {
      title: titleInput?.value || "",
      content: contentInput?.value || "",
      tag: tagSelect?.value || "Todo",
    };

    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    addNoteMutation.mutate(formData);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form ref={formRef} className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          onChange={handleChange}
          defaultValue={draft.title}
        />
        {errors.title && <div className={css.error}>{errors.title}</div>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content (optional)</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          onChange={handleChange}
          defaultValue={draft.content}
        />
        {errors.content && <div className={css.error}>{errors.content}</div>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={handleChange}
          defaultValue={draft.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <div className={css.error}>{errors.tag}</div>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || addNoteMutation.isPending}
          className={css.submitButton}
        >
          {addNoteMutation.isPending ? "Adding..." : "Add Note"}
        </button>
      </div>
      {errors.submit && <p className={css.error}>{errors.submit}</p>}
    </form>
  );
};

export default NoteForm;
