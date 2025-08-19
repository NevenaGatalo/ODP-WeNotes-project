// NoteTile.tsx
import React from "react";
import type { NoteDto } from "../../../models/notes/NoteDto";
import { notesApi } from "../../../api_services/notes/NotesAPIService";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/auth/useAuthHook";

interface NoteTileProps {
  note: NoteDto;
  onDelete: (id: number) => void;
  //da refreshuje notes
  onRefreshNote: (note: NoteDto) => void;
  onRefreshNotes: (notes: NoteDto[]) => void;
  onUpdateNote: (note: NoteDto) => void;

}

export const NoteTile: React.FC<NoteTileProps> = ({
  note,
  onDelete,
  onRefreshNote,
  onRefreshNotes,
  onUpdateNote
}) => {
  const { token, user } = useAuth();
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

  const handlePin = async () => {
    //treba da poziva update i da mu prosledi novu vrednost pina
    try {
      //promeni is_pinned
      note.is_pinned = !note.is_pinned;
      const updatedNote = await notesApi.updateNote(note.id, note, token!);
      onRefreshNote(updatedNote);
    } catch {
      toast.error("Došlo je do greške.");
    }
  };
  const handleCopyLink = async () => {
    try {
      if (note.share_guid) {
        const link = `http://localhost:5173/shared/${note.share_guid}`;
        await navigator.clipboard.writeText(link);
        toast.success("Link kopiran u clipboard!");
      } else {
        toast.error("Nema kreiranog linka za ovu belešku.");
      }
    } catch {
      toast.error("Došlo je do greške prilikom kopiranja linka.");
    }
  };
  const handleShare = async () => {
    try {
      if (!token) {
        toast.error("Token ne postoji.");
        return;
      }

      const response = await notesApi.shareNote(note.id, note, token!);
      if (response) {
        // response.data sadrži tvoj link
        const link = `http://localhost:5173/share/${response.share_guid}`;
        await navigator.clipboard.writeText(link);
        toast.success("Link kreiran i kopiran u clipboard!");
        // osveži note da bi share_guid bio setovan
        onRefreshNote(response);
      } else {
        toast.error("Greška prilikom kreiranja linka.");
      }
    } catch (error) {
      toast.error("Došlo je do greške.");
    }
  };
  const handleDuplicate = async () => {
    try {
      if (!token) {
        toast.error("Token ne postoji.");
        return;
      }

      // Poziva servis za dupliranje
      const duplicatedNote = await notesApi.duplicateNote(note.id, note.owner_id, token);

      if (duplicatedNote && duplicatedNote.id !== 0) {
        // Osvežava listu beleški u parent komponenti
        const refreshed = await notesApi.getAllUserNotes(token!);
        onRefreshNotes(refreshed);
        toast.success("Beleška je duplirana!");
      } else {
        toast.error("Greška prilikom dupliranja beleške.");
      }
    } catch {
      toast.error("Došlo je do greške.");
    }
  };
  const handleUpdate = async () => {
    onUpdateNote(note);
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
      note tile
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <button
          onClick={handlePin}
          className={`text-sm px-2 py-1 rounded ${note.is_pinned ? "bg-yellow-400 text-white" : "bg-gray-200"
            }`}
        >
          {note.is_pinned ? "Pinned" : "Pin"}
        </button>
      </div>

      <p className="text-gray-700 mb-2">{note.content}</p>

      {/* Prikaz slike samo za admina */}
      {user?.uloga === "admin" && note.image_url && (
        <img
          src={note.image_url}
          alt="Note"
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}

      <div className="flex justify-between mt-2">
        <button
          onClick={handleDuplicate}
          className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Duplicate
        </button>

        <button
          onClick={handleUpdate}
          className="text-sm bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
        >
          Update
        </button>

        {!note.share_guid ? (
          <button
            onClick={handleShare}
            className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Share
          </button>
        ) : (
          <button
            onClick={handleCopyLink}
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
