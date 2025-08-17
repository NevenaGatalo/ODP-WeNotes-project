import React from "react";
import { NoteTile } from "./NoteTile";
import type { NoteDto } from "../../models/notes/NoteDto";

interface NotesGridProps {
  notes: NoteDto[];
  setNotes: React.Dispatch<React.SetStateAction<NoteDto[]>>
  //userRole: "user" | "admin";
  //onPin: (id: string) => void;
  //onDuplicate: (id: string) => void;
  //onShare: (id: string) => void;
  //onCopyLink: (id: string) => void;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  setNotes,
  //userRole,
  //onPin,
  //onDuplicate,
  //onShare,
  //onCopyLink,
}) => {
    const handleRemove = (id: number) => {
    setNotes((prev) => prev.filter((q) => q.id !== id));
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {notes.map((note) => (
        <NoteTile
          key={note.id} note={note} onDelete={handleRemove}
          //userRole={userRole}
          //onPin={onPin}
          //onDuplicate={onDuplicate}
          //onShare={onShare}
          //onCopyLink={onCopyLink}
        />
      ))}
    </div>
  );
};
