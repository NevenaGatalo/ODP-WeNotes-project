import { useNavigate } from "react-router-dom";
import type { INotesAPIService } from "../../api_services/notes/INotesAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { ObrišiVrednostPoKljuču, PročitajVrednostPoKljuču } from "../../helpers/local_storage";
import { useEffect, useState } from "react";
import type { NoteDto } from "../../models/notes/NoteDto";
import toast from "react-hot-toast";
import { NotesGrid } from "../../components/notes/showNotes/NotesGrid";
import CreateNoteForm from "../../components/notes/createNote/CreateNoteForm";
import UpdateNoteForm from "../../components/notes/updateNote/UpdateNoteForm";
import { LogOut, Plus } from "lucide-react";


interface NotesGridPageProps {
    notesApi: INotesAPIService;
}

export default function NotesGridPage({ notesApi }: NotesGridPageProps) {
    const [notes, setNotes] = useState<NoteDto[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingNote, setEditingNote] = useState<NoteDto | null>(null);

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

    const handleLogout = () => {
        ObrišiVrednostPoKljuču("authToken");
        logout();
    };

    /*  return (
         <main>
             {editingNote ? (
                 <UpdateNoteForm
                     note={editingNote}
                     notesApi={notesApi}
                     onRefreshNotes={setNotes}
                     onCancel={() => setEditingNote(null)}
                 />
             ) : showCreateForm ? (
                 <CreateNoteForm
                     notesApi={notesApi}
                     onRefreshNotes={setNotes}
                     onCancel={() => setShowCreateForm(false)}
                 />
             ) : (
                 <>
                     <button
                         onClick={() => setShowCreateForm(true)}
                         className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                     >
                         ➕ Nova beleška
                     </button>
 
                     <NotesGrid
                         notes={notes}
                         setNotes={setNotes}
                         onUpdateNote={(note) => setEditingNote(note)}
                     />
 
                     <button onClick={handleLogout}>Logout</button>
                 </>
             )}
         </main>
 
     ) */
    return (
        <main className="min-h-screen bg-black text-white p-6">


            {editingNote ? (

                <UpdateNoteForm
                    note={editingNote}
                    notesApi={notesApi}
                    onRefreshNotes={setNotes}
                    onCancel={() => setEditingNote(null)}
                />
            ) : showCreateForm ? (
                <CreateNoteForm
                    notesApi={notesApi}
                    onRefreshNotes={setNotes}
                    onCancel={() => setShowCreateForm(false)}
                />
            ) : (
                <>
                    <header className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-yellow-400">Notes</h1>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-2xl font-semibold hover:bg-yellow-500 shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                                New note
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-2xl font-semibold hover:bg-gray-700 shadow-md text-white"
                            >
                                Logout
                                <LogOut className="w-5 h-5" />

                            </button>
                        </div>
                    </header>
                    <NotesGrid
                        notes={notes}
                        setNotes={setNotes}
                        onUpdateNote={(note) => setEditingNote(note)}
                    />
                </>

            )}
        </main>
    );

}