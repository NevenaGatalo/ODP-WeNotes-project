import { NoteDto } from "../../Domain/DTOs/notes/NoteDto";
import { INotesRepository } from "../../Domain/repositories/notes/INotesRepository";
import { INoteService } from "../../Domain/services/notes/INoteService";
import { Note } from "../../Domain/models/Note";
import { v4 as uuidv4 } from 'uuid';

export class NoteService implements INoteService {
    constructor(private notesRepository: INotesRepository) { }
    async getNoteByGuid(guid: string): Promise<NoteDto> {
        const note = await this.notesRepository.findByGuid(guid);
        if(!note.id){
            return new NoteDto();
        }
        return new NoteDto(note.id, note.title, note.content, note.image_url, note.is_pinned, note.owner_id, note.share_guid);

    }
    async shareNote(id: number): Promise<string | null> {
        const guid = uuidv4(); // generiše jedinstveni GUID

        const success = await this.notesRepository.updateGuid(id, guid);
        if (success) return guid;
        return null;
    }
    async getNoteById(id: number): Promise<NoteDto> {
        const note = await this.notesRepository.getById(id);
        if (!note.id) {
            return new NoteDto(); // nije pronadjena
        }
        return new NoteDto(note.id, note.title, note.content, note.image_url, note.is_pinned, note.owner_id, note.share_guid);
    }

    async duplicateNote(noteId: number, ownerId: number): Promise<NoteDto> {
        const note = await this.notesRepository.getById(noteId);

        if (!note.id) {
            return new NoteDto(); // nije pronadjena
        }

        const newTitle = note.title + " (Kopija)";

        const newNote = await this.notesRepository.create(
            new Note(0, newTitle, note.content, note.image_url, note.is_pinned, ownerId)
        );

        return new NoteDto(newNote.id, newNote.title, newNote.content, newNote.image_url, newNote.is_pinned, newNote.owner_id);
    }


    async updateNote(note: NoteDto): Promise<NoteDto> {
        const updatedNote = await this.notesRepository.update(
            new Note(note.id, note.title, note.content, note.image_url, note.is_pinned, note.owner_id, note.share_guid)
        );

        return new NoteDto(updatedNote.id, updatedNote.title, updatedNote.content, updatedNote.image_url, updatedNote.is_pinned, updatedNote.owner_id, updatedNote.share_guid);
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