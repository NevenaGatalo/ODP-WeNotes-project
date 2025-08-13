import {Note} from "../../models/Note";

export interface INotesRepository{
      create(note: Note): Promise<Note>;
      getById(id: number): Promise<Note>;
      getByUserId(ownerId: number): Promise<Note[]>;
}