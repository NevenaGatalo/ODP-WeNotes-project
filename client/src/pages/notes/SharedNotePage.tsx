import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { NoteDto } from "../../models/notes/NoteDto";
import { notesApi } from "../../api_services/notes/NotesAPIService";

export default function SharedNotePage() {
  const { share_guid } = useParams<{ share_guid: string }>();
  const [note, setNote] = useState<NoteDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!share_guid) return;

    const fetchNote = async () => {
      try {
        setLoading(true);
        const fetchedNote = await notesApi.showSharedNote(share_guid);
        if (fetchedNote && fetchedNote.id !== 0) {
          setNote(fetchedNote);
        } else {
          setError("Beleška nije pronađena.");
        }
      } catch {
        setError("Greška pri učitavanju beleške.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [share_guid]);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!note) return <p>Nema podataka za prikaz.</p>;

  /* return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <p className="mb-4">{note.content}</p>
      {note.image_url && (
        <img
          src={note.image_url}
          alt="Note"
          className="w-full h-auto rounded mb-4"
        />
      )}
    </div>
  ); */
  return (
  <div className="min-h-screen bg-black flex justify-center items-center p-6">
    <div className="max-w-lg w-full p-6 bg-gray-900 rounded-2xl shadow-lg border border-gray-700 text-white">
      <h1 className="text-2xl font-bold mb-4 text-yellow-400">{note.title}</h1>
      <p className="mb-4">{note.content}</p>
      {note.image_url && (
        <img
          src={note.image_url}
          alt="Note"
          className="w-full h-auto rounded-xl border border-gray-600 shadow-md mb-4"
        />
      )}
    </div>
  </div>
);


}
