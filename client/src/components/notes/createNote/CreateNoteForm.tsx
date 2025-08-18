import { useState } from "react";
import type { INotesAPIService } from "../../../api_services/notes/INotesAPIService";
import { NoteDto } from "../../../models/notes/NoteDto";
import { useAuth } from "../../../hooks/auth/useAuthHook";
import toast from "react-hot-toast";
import { ValidateNewNote } from "../../../api_services/validators/notes/NotesValidator";

const CreateNoteForm = ({
    notesApi,
    onRefreshNotes,
    onCancel
}: {
    notesApi: INotesAPIService;
    onRefreshNotes: (notes: NoteDto[]) => void;
    onCancel: () => void;
}) => {
    const [notesData, setNotesData] = useState({
        title: "",
        content: "",
        image_url: "",
    });
    const { user, token } = useAuth();
    const [error, setError] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, files } = e.target as HTMLInputElement; // cast da imamo files

        if (name === "image_url" && files && files[0]) {
            // generiše lokalni URL za izabranu sliku
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
    };

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
            await notesApi.createNote(
                new NoteDto(0, notesData.title, notesData.content, notesData.image_url),
                token!
            );
            toast.success("Beleska dodata");

            setNotesData({ title: "", content: "", image_url: "" });
            setError("");
            if (!token) {
                toast.error("Token ne postoji.");
                return;
            }
            const refreshed = await notesApi.getAllUserNotes(token!);
            onRefreshNotes(refreshed);
            onCancel();
        } catch {
            toast.error("Greska prilikom kreiranja beleske");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
                <h2 className="text-2xl font-semibold text-center text-blue-800">Kreiraj novu belešku</h2>

                <div>
                    <label className="block text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={notesData.title}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Unesite naslov beleške"
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
                        placeholder="Unesite sadržaj beleške"
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
                        Create
                    </button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
        </div>
    );
}

export default CreateNoteForm;