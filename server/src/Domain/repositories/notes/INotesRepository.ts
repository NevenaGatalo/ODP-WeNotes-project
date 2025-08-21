import {Note} from "../../models/Note";

export interface INotesRepository{
      create(note: Note): Promise<Note>;
      getById(id: number): Promise<Note>;
      getByUserId(ownerId: number): Promise<Note[]>;
      delete(id: number):  Promise<boolean>;
      getUserNoteCount(ownerId: number): Promise<number>;
      update(note: Note): Promise<Note>;
      updateGuid(note: Note): Promise<Note>;
      findByGuid(guid: string): Promise<Note>
}