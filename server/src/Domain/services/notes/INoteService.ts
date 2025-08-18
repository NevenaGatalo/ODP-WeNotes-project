import { NoteDto } from "../../DTOs/notes/NoteDto";
import { Note } from "../../models/Note";

export interface INoteService{
    createNote(note: NoteDto): Promise<NoteDto>;
    getAllUserNotes(ownerId: number): Promise<NoteDto[]>;
    deleteNote(id: number): Promise<boolean>;
    getUserNoteCount(ownerId: number): Promise<number>;
    updateNote(note: NoteDto): Promise<NoteDto>;
    duplicateNote(noteId: number, ownerId: number): Promise<NoteDto>;
    getNoteById(id: number): Promise<NoteDto>;
    //shareNote(id: number): Promise<string | null>;
    shareNote(note: NoteDto): Promise<NoteDto>;
    getNoteByGuid(guid: string): Promise<NoteDto>
}