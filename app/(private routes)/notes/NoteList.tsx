import { Note } from "@/types/note";
import NoteItem from "./NoteItem";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </ul>
  );
};

export default NoteList;
