import { useNavigate } from "react-router-dom";
import type { INotesAPIService } from "../../api_services/notes/INotesAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { PročitajVrednostPoKljuču } from "../../helpers/local_storage";
import { useEffect, useState } from "react";
import type { NoteDto } from "../../models/notes/NoteDto";
import toast from "react-hot-toast";
import { NotesGrid } from "../../components/notes/NotesGrid";

interface NotesGridPageProps {
    notesApi: INotesAPIService;
}

export default function NotesGridPage({ notesApi }: NotesGridPageProps) {
    const [notes, setNotes] = useState<NoteDto[]>([]);
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

    // useEffect(() => {
        
    //     const token = PročitajVrednostPoKljuču("authToken");
    //     const fetchQuestions = async () => {
    //         if (!user) return;
    //         try {
    //             const fetched = await notesApi.getAllUserNotes(token);
    //             setNotes(fetched);
    //         } catch {
    //             toast.error("Greška prilikom učitavanja pitanja");
    //         }
    //     };
    //     fetchQuestions();
    // }, [notesApi]);

    return (
        <main>
            <NotesGrid
                notes={notes}
                setNotes={setNotes}></NotesGrid>
        </main>
    )
}