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
        imageFile: null as File | null
    });
    const { user, token } = useAuth();
    const [error, setError] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target as HTMLInputElement;
        setNotesData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            const previewUrl = URL.createObjectURL(file);

            setNotesData(prev => ({
                ...prev,
                imageFile: file,
                image_url: previewUrl
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
                notesData.imageFile,
                token!
            );
            toast.success("Beleska dodata");

            setNotesData({ title: "", content: "", image_url: "", imageFile: null });
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
        <div className="flex justify-center items-center min-h-screen bg-black text-white p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 border border-gray-700"
            >
                <h2 className="text-2xl font-bold text-center text-yellow-400">
                    Kreiraj novu belešku
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
                        placeholder="Unesite naslov beleške"
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
                        placeholder="Unesite sadržaj beleške"
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
                        Create
                    </button>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
            </form>
        </div>
    );

}

export default CreateNoteForm;