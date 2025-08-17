import type { NoteDto } from "../../models/notes/NoteDto";



export interface INotesAPIService{
    createNote(note: NoteDto): Promise<NoteDto>;
    getAllUserNotes(ownerId: number): Promise<NoteDto[]>;
    deleteNote(id: number): Promise<boolean>;
    updateNote(id: number, note: NoteDto): Promise<NoteDto>;
    duplicateNote(id: number, owner_id: number): Promise<NoteDto>;
    shareNote(id: number): Promise<string>;
    showSharedNote(guid: string): Promise<NoteDto>;
}