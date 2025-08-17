// NoteTile.tsx
import React from "react";
import type { NoteDto } from "../../models/notes/NoteDto";
import { notesApi } from "../../api_services/notes/NotesAPIService";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/auth/useAuthHook";

interface NoteTileProps {
  note: NoteDto;
  //userRole: "user" | "admin";
  onDelete: (id: number) => void;
  //onPin: (id: number) => void;
  //onDuplicate: (id: number) => void;
  //onShare: (id: number) => void;
  //onCopyLink: (id: number) => void;
}

export const NoteTile: React.FC<NoteTileProps> = ({
  note,
  //userRole,
  onDelete
  //onPin,
  //onDuplicate,
  //onShare,
  //onCopyLink,
}) => {
    const { token } = useAuth();
    const handleDelete = async () => {
        if (!token) {
      toast.error("Token ne postoji.");
      return;
    }
    try {
      const success = await notesApi.deleteNote(note.id, token!);
      if (success) {
        onDelete(note.id);
        toast.success("Pitanje obrisano!");
      } else {
        toast.error("Greška prilikom brisanja.");
      }
    } catch {
      toast.error("Došlo je do greške.");
    }
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
        note tile
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <button
          //onClick={() => onPin(note.id)}
          className={`text-sm px-2 py-1 rounded ${
            note.is_pinned ? "bg-yellow-400 text-white" : "bg-gray-200"
          }`}
        >
          {note.is_pinned ? "Pinned" : "Pin"}
        </button>
      </div>

      <p className="text-gray-700 mb-2">{note.content}</p>

      {/* Prikaz slike samo za admina */}
      {/* {user === "admin" && note.image_url && (
        <img
          src={note.image_url}
          alt="Note"
          className="w-full h-32 object-cover rounded mb-2"
        />
      )} */}

      <div className="flex justify-between mt-2">
        <button
          //onClick={() => onDuplicate(note.id)}
          className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Duplicate
        </button>

        {!note.share_guid ? (
          <button
            //onClick={() => onShare(note.id)}
            className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Share
          </button>
        ) : (
          <button
            //onClick={() => onCopyLink(note.id)}
            className="text-sm bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
          >
            Copy Link
          </button>
        )}
        <button
          onClick={handleDelete}
          className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
