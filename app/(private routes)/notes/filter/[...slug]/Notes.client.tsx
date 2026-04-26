"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import css from "../../Notes.module.css";
import { NotesResponse } from "@/lib/api/clientApi";

interface NotesClientProps {
  tag?: string;
}

const NotesClient = ({ tag }: NotesClientProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce logic for search query
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset page on new search
    }, 500); // 500ms debounce delay

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const { data, isLoading, isError, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", debouncedSearchQuery, currentPage, tag ?? "all"],
    queryFn: () => fetchNotes(debouncedSearchQuery, currentPage, 10, tag),
    placeholderData: (previousData) => previousData, // For smooth pagination
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (isError) {
    return <div className={css.error}>Error: {error?.message}</div>;
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1>Notes {tag ? `filtered by ${tag}` : ""}</h1>
        <Link href="/notes/action/create" className={css.addButton}>
          + Create note
        </Link>
      </div>
      <SearchBox onSearch={handleSearch} />
      {isLoading ? (
        <div className={css.loading}>Loading notes...</div>
      ) : notes.length > 0 ? (
        <>
          <NoteList notes={notes} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className={css.empty}>No notes available.</div>
      )}
    </div>
  );
};

export default NotesClient;
