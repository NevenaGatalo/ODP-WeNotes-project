import axios from "axios";
import type { NoteData } from "../../types/notes/NotesData";
import type { INotesAPIService } from "./INotesAPIService";
import { NoteDto } from "../../models/notes/NoteDto";



const API_URL: string = import.meta.env.VITE_API_URL + "notes";

export const notesApi: INotesAPIService = {
    /* async createNote(note: NoteDto, token: string): Promise<NoteDto> {
        try {
            const res = await axios.post<NoteData>(API_URL, note, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.data;
        } catch {
            return new NoteDto();
        }
    }, */
    async createNote(note: NoteDto, file: File | null, token: string): Promise<NoteDto> {
        try {
            const formData = new FormData();
            formData.append("title", note.title);
            formData.append("content", note.content);
            if (file) {
                formData.append("image", file); // "image" je key koji multer očekuje
            }

            const res = await axios.post<NoteData>(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });

            return res.data.data;
        } catch {
            return new NoteDto();
        }
    },

    async getAllUserNotes(token: string): Promise<NoteDto[]> {
        try {
            const res = await axios.get(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.data;
        } catch {
            return [];
        }
    },
    async deleteNote(id: number, token: string): Promise<boolean> {
        try {
            const res = await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.success;
        } catch {
            return false;
        }
    },
    async updateNote(id: number, note: NoteDto, token: string): Promise<NoteDto> {
        try {
            const res = await axios.put<NoteData>(`${API_URL}/${id}`, note, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.data;
        } catch {
            return new NoteDto();
        }
    },
    async duplicateNote(id: number, owner_id: number, token: string): Promise<NoteDto> {
        try {
            const res = await axios.post<NoteData>(`${API_URL}/${id}`, owner_id, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.data;
        } catch {
            return new NoteDto();
        }
    },
    async shareNote(id: number, note: NoteDto, token: string): Promise<NoteDto> {
        try {
            const res = await axios.put<NoteData>(`${API_URL}/share/${id}`, note, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.data;
        } catch {
            return new NoteDto();
        }
    },
    async showSharedNote(guid: string): Promise<NoteDto> {
        try {
            const res = await axios.get<NoteData>(`${API_URL}/share/${guid}`);
            return res.data.data;
        } catch {
            return new NoteDto();
        }
    }
}