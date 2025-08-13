import { NoteDto } from "../../Domain/DTOs/notes/NoteDto";
import { INotesRepository } from "../../Domain/repositories/notes/INotesRepository";
import { INoteService } from "../../Domain/services/notes/INoteService";

export class NoteService implements INoteService{
    constructor(private notesRepository: INotesRepository) {}

    async getAllUserNotes(ownerId: number): Promise<NoteDto[]> {
        const notes = await this.notesRepository.getByUserId(ownerId);
        return notes.map(
            (n) => new NoteDto(n.id, n.title, n.content, n.image_url, n.is_pinned, n.owner_id)
        );
    }

}