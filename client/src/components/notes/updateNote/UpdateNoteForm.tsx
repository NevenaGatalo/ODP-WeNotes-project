import { useState } from "react";
import type { INotesAPIService } from "../../../api_services/notes/INotesAPIService";
import { NoteDto } from "../../../models/notes/NoteDto";
import { useAuth } from "../../../hooks/auth/useAuthHook";
import toast from "react-hot-toast";
import { ValidateNewNote } from "../../../api_services/validators/notes/NotesValidator";

const UpdateNoteForm = ({
  note,
  notesApi,
  onRefreshNotes,
  onCancel
}: {
  note: NoteDto;
  notesApi: INotesAPIService;
  onRefreshNotes: (notes: NoteDto[]) => void;
  onCancel: () => void;
}) => {
  const [notesData, setNotesData] = useState({
    title: note.title,
    content: note.content,
    image_url: note.image_url,
  });
  const { user, token } = useAuth();
  const [error, setError] = useState<string>("");

  /* const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image_url" && files && files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);
      setNotesData((prev) => ({
        ...prev,
        image_url: imageUrl,
      }));
    } else {
      setNotesData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }; */
  const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target as HTMLInputElement;
        setNotesData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleChangeImage = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { files } = e.target as HTMLInputElement;
        // generiše lokalni URL za izabranu sliku
        if (files && files[0]) {
            const imageUrl = URL.createObjectURL(files[0]);
            console.log("imageUrl createObject: " + imageUrl);
            setNotesData((prev) => ({
                ...prev,
                image_url: imageUrl,
            }));
        }

    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = ValidateNewNote(
      notesData.title,
      notesData.content
    );

    if (!validation.uspesno) {
      setError(validation.poruka ?? "");
      return;
    }

    try {
      await notesApi.updateNote(
        note.id,
        new NoteDto(note.id, notesData.title, notesData.content, notesData.image_url),
        token!
      );
      toast.success("Beleška ažurirana");

      const refreshed = await notesApi.getAllUserNotes(token!);
      onRefreshNotes(refreshed);
      onCancel();
    } catch {
      toast.error("Greška prilikom ažuriranja beleške");
    }
  };

  /* return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-blue-800">Izmeni belešku</h2>

        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={notesData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            value={notesData.content}
            name="content"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            rows={5}
          />
        </div>

        {user!.uloga === "admin" && (
          <div>
            <label className="block text-gray-700 mb-2">Izaberite sliku</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-700"
            />
          </div>
        )}

        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Update
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  ); */
  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-center text-yellow-400">
          Izmeni belešku
        </h2>

        <div>
          <label className="block text-sm mb-2 text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            value={notesData.title}
            onChange={handleChange}
            className="w-full p-3 bg-black text-white border border-gray-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300">Content</label>
          <textarea
            value={notesData.content}
            name="content"
            onChange={handleChange}
            className="w-full p-3 bg-black text-white border border-gray-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            rows={5}
          />
        </div>

        {user!.uloga === "admin" && (
          <div>
            <label className="block text-sm mb-2 text-gray-300">Izaberite sliku</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="w-full text-gray-300"
            />

            {/* Preview izabrane slike */}
            {/* {previewImage && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Preview:</p>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full rounded-xl border border-gray-600 shadow-md"
                />
              </div>
            )} */}
          </div>
        )}

        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-800 text-gray-200 rounded-xl 
                       hover:bg-gray-700 transition shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-yellow-400 text-black rounded-xl 
                       hover:bg-yellow-500 transition shadow-md font-semibold"
          >
            Update
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default UpdateNoteForm;
