import React from "react";
import { NoteTile } from "./NoteTile";
import type { NoteDto } from "../../../models/notes/NoteDto";

interface NotesGridProps {
  notes: NoteDto[];
  setNotes: React.Dispatch<React.SetStateAction<NoteDto[]>>
  onUpdateNote: (note: NoteDto) => void;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  setNotes,
  onUpdateNote
}) => {
  const handleRemove = (id: number) => {
    setNotes((prev) => prev.filter((q) => q.id !== id));
  };
  const handlePin = (note: NoteDto) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? note : n))
    );
  };
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return 0;
  });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sortedNotes.map((note) => (
        <NoteTile
          key={note.id}
          note={note}
          onDelete={handleRemove}
          onRefreshNote={handlePin}
          onRefreshNotes={setNotes}
          onUpdateNote={onUpdateNote}
        />
      ))}
    </div>
  );
};
