import type { NoteDto } from "../../models/notes/NoteDto";



export interface INotesAPIService{
    createNote(note: NoteDto, token: string): Promise<NoteDto>;
    getAllUserNotes(token: string): Promise<NoteDto[]>;
    deleteNote(id: number, token: string): Promise<boolean>;
    updateNote(id: number, note: NoteDto, token: string): Promise<NoteDto>;
    duplicateNote(id: number, owner_id: number, token: string): Promise<NoteDto>;
    //shareNote(id: number, token: string): Promise<string>;
    shareNote(id: number, note: NoteDto, token: string): Promise<NoteDto>;
    showSharedNote(guid: string): Promise<NoteDto>;
}