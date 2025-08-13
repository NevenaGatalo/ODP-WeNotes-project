import { NoteDto } from "../../DTOs/notes/NoteDto";
import { Note } from "../../models/Note";

export interface INoteService{
    createNote(note: NoteDto): Promise<NoteDto>;
    getAllUserNotes(ownerId: number): Promise<NoteDto[]>;
}