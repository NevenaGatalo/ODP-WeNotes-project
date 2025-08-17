import axios from "axios";
import type { NoteData, NotesData, ShareLinkData } from "../../types/notes/NotesData";
import type { INotesAPIService } from "./INotesAPIService";
import { NoteDto } from "../../models/notes/NoteDto";



const API_URL: string = import.meta.env.VITE_API_URL + "notes";

export const notesApi: INotesAPIService = {
    async createNote(note: NoteDto): Promise<NoteDto> {
        try {
            const res = await axios.post<NoteData>(API_URL, note);
            return res.data.data;
        } catch {
            return new NoteDto();
        }
    },
    async getAllUserNotes(token: string): Promise<NoteDto[]> {
        try{
            //const res = await axios.get<NotesData>(`${API_URL}/${ownerId}`);
            //const res = await axios.get<NotesData>(API_URL);
            const res = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
            return res.data.data;
        }catch{
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
    async updateNote(id: number, note: NoteDto): Promise<NoteDto> {
        try {
            const res = await axios.put<NoteData>(`${API_URL}/${id}`, note);
            return res.data.data;
        } catch {
            return new NoteDto();
        }
    },
    async duplicateNote(id: number, owner_id: number): Promise<NoteDto> {
        try{
            const res = await axios.post<NoteData>(`${API_URL}/${id}`, owner_id);
            return res.data.data;
        }catch{
            return new NoteDto();
        }
    },
    async shareNote(id: number): Promise<string> {
        try{
            const res = await axios.put<ShareLinkData>(`${API_URL}/share/${id}`);
            return res.data.data;
        }catch{
            return "";
        }
    },
    async showSharedNote(guid: string): Promise<NoteDto> {
        try{
            const res = await axios.get<NoteData>(`${API_URL}/share/${guid}`);
            return res.data.data;
        }catch{
            return new NoteDto();
        }
    }
}