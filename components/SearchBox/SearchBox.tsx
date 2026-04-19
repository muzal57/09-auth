"use client";

import { ChangeEvent } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className={css.searchContainer}>
      <input
        type="text"
        placeholder="Search notes..."
        onChange={handleChange}
        className={css.input}
      />
    </div>
  );
};

export default SearchBox;
