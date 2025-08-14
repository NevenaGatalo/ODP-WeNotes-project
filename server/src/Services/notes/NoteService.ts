import { NoteDto } from "../../Domain/DTOs/notes/NoteDto";
import { INotesRepository } from "../../Domain/repositories/notes/INotesRepository";
import { INoteService } from "../../Domain/services/notes/INoteService";
import { Note } from "../../Domain/models/Note";

export class NoteService implements INoteService {
    constructor(private notesRepository: INotesRepository) { }
    async updateNote(note: NoteDto): Promise<NoteDto> {
        const updatedNote = await this.notesRepository.update(
            new Note(note.id, note.title, note.content, note.image_url, note.is_pinned, note.owner_id)
        );

        return new NoteDto(updatedNote.id, updatedNote.title, updatedNote.content, updatedNote.image_url, updatedNote.is_pinned, updatedNote.owner_id);
    }

    async getUserNoteCount(ownerId: number): Promise<number> {
        return await this.notesRepository.getUserNoteCount(ownerId);
    }

    async createNote(note: NoteDto): Promise<NoteDto> {
        const createdNote = await this.notesRepository.create(new Note(note.id, note.title, note.content, note.image_url, note.is_pinned, note.owner_id));

        return new NoteDto(createdNote.id, createdNote.title, createdNote.content, createdNote.image_url, createdNote.is_pinned, createdNote.owner_id);
    }

    async getAllUserNotes(ownerId: number): Promise<NoteDto[]> {
        const notes = await this.notesRepository.getByUserId(ownerId);
        return notes.map(
            (n) => new NoteDto(n.id, n.title, n.content, n.image_url, n.is_pinned, n.owner_id)
        );
    }
    async deleteNote(id: number): Promise<boolean> {
        return this.notesRepository.delete(id);
    }
}