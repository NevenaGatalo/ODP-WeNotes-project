import { NoteDto } from "../../DTOs/notes/NoteDto";

export interface INoteService{
    getAllUserNotes(ownerId: number): Promise<NoteDto[]>;
}