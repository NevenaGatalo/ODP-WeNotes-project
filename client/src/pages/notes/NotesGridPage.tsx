import { useNavigate } from "react-router-dom";
import type { INotesAPIService } from "../../api_services/notes/INotesAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { PročitajVrednostPoKljuču } from "../../helpers/local_storage";
import { useEffect, useState } from "react";
import type { NoteDto } from "../../models/notes/NoteDto";
import toast from "react-hot-toast";
import { NotesGrid } from "../../components/notes/showNotes/NotesGrid";
import CreateNoteForm from "../../components/notes/createNote/CreateNoteForm";


interface NotesGridPageProps {
    notesApi: INotesAPIService;
}

export default function NotesGridPage({ notesApi }: NotesGridPageProps) {
    const [notes, setNotes] = useState<NoteDto[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = PročitajVrednostPoKljuču("authToken");

        if (!isAuthenticated || !token) {
            logout();
            navigate("/login");

        }

        const fetchNotes = async () => {
            if (!user) return;
            try {
                const fetched = await notesApi.getAllUserNotes(token!);
                setNotes(fetched);
            } catch {
                toast.error("Greška prilikom učitavanja pitanja");
            }
        };
        fetchNotes();

    }, [isAuthenticated, logout, navigate, notesApi]);


    return (
        <main>
            <button
                onClick={() => setShowCreateForm(true)}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
                ➕ Nova beleška
            </button>

            {showCreateForm && (
                <CreateNoteForm
                    notesApi={notesApi}
                    onRefreshNotes = {setNotes}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}

            <NotesGrid
                notes={notes}
                setNotes={setNotes}>
            </NotesGrid>

        </main>
    )
}