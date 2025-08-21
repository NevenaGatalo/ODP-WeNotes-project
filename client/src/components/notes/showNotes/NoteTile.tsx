import React from "react";
import type { NoteDto } from "../../../models/notes/NoteDto";
import { notesApi } from "../../../api_services/notes/NotesAPIService";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/auth/useAuthHook";
import { Pin, PinOff, Copy, Share2, Trash2, Edit, Files } from "lucide-react";


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
        toast.success("Beleska je obrisana.");
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
        const link = `http://localhost:5173/shared/${response.share_guid}`;
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
    <div className="bg-gray-900 rounded-2xl shadow-lg p-4 flex flex-col justify-between border border-gray-800 hover:border-yellow-400 transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-yellow-400">{note.title}</h3>
        <button onClick={handlePin}>
          {note.is_pinned ? (
            <Pin className="text-yellow-400 w-5 h-5" />
          ) : (
            <PinOff className="text-gray-500 hover:text-yellow-400 w-5 h-5" />
          )}
        </button>
      </div>

      {/* Content */}
      <p className="text-white/80 mb-3">{note.content}</p>

      {/* Prikaz slike za admina */}
      {user?.uloga === "admin" && note.image_url && (
        <img
          src={`http://localhost:4000${note.image_url}`}
          alt="Note"
          className="w-full h-36 object-cover rounded-xl mb-3 border border-gray-700"
        />
      )}

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-3 text-gray-400">
        <button onClick={handleDuplicate} className="hover:text-yellow-400">
          <Files className="w-5 h-5" />
        </button>
        <button onClick={handleUpdate} className="hover:text-yellow-400">
          <Edit className="w-5 h-5" />
        </button>
        {!note.share_guid ? (
          <button onClick={handleShare} className="hover:text-yellow-400">
            <Share2 className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={handleCopyLink} className="hover:text-yellow-400">
            <Copy className="w-5 h-5" />
          </button>
        )}
        <button onClick={handleDelete} className="hover:text-red-500">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );


};
