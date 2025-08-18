import { INotesRepository } from "../../../Domain/repositories/notes/INotesRepository";
import { Note } from "../../../Domain/models/Note";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { NoteDto } from "../../../Domain/DTOs/notes/NoteDto";

export class NotesRepository implements INotesRepository {
    async findByGuid(guid: string): Promise<Note> {
        try {
            const query = `SELECT * FROM notes WHERE share_guid = ?`;
            const [rows] = await db.execute<RowDataPacket[]>(query, [guid]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Note(row.id, row.title, row.content, row.image_url, row.is_pinned, row.owner_id, row.share_guid);
            }

            return new Note();
        } catch (error) {
            return new Note();
        }
    }
    async getById(id: number): Promise<Note> {
        try {
            const query = `SELECT *FROM notes WHERE id = ?`;
            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Note(row.id, row.title, row.content, row.image_url, row.is_pinned, row.owner_id, row.share_guid);
            }

            return new Note();
        } catch {
            return new Note();
        }
    }
    // async updateGuid(id: number, guid: string): Promise<boolean> {
    //     try {
    //         const query = `UPDATE notes SET share_guid = ? WHERE id = ?`;
    //         const [result] = await db.execute<ResultSetHeader>(query, [guid, id]);

    //         if (result.affectedRows > 0) {
    //             return true;
    //         }
    //         return false;
    //     } catch (error) {
    //         return false;
    //     }
    // }
     async updateGuid(note: Note): Promise<Note> {
        try {
            const query = `UPDATE notes SET share_guid = ? WHERE id = ?`;
            const [result] = await db.execute<ResultSetHeader>(query, [note.share_guid, note.id]);

            if (result.affectedRows > 0) {
                return note;
            }
            return new Note();
        } catch (error) {
            return new Note();
        }
    }
    async update(note: Note): Promise<Note> {
        try {
            const query = `
        UPDATE notes 
        SET title = ?, content = ?, image_url = ?, is_pinned = ?
        WHERE id = ?
      `;
            const [result] = await db.execute<ResultSetHeader>(query, [
                note.title,
                note.content,
                note.image_url,
                note.is_pinned,
                note.id
            ]);
            if (result.affectedRows > 0) {
                return note;
            }
            return new Note();
        } catch (error) {
            return new Note();
        }
    }
    async getUserNoteCount(ownerId: number): Promise<number> {
        try {
            const query = `SELECT COUNT(*) AS noteCount FROM notes WHERE owner_id = ?`;
            const [rows] = await db.execute<RowDataPacket[]>(query, [ownerId]);
            return rows[0].noteCount;
        } catch (error) {
            return -1;
        }
    }
    async create(note: Note): Promise<Note> {
        try {
            const query = `
        INSERT INTO notes (id, title, content, image_url, is_pinned, owner_id) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

            const [result] = await db.execute<ResultSetHeader>(query, [
                note.id,
                note.title,
                note.content,
                note.image_url,
                note.is_pinned,
                note.owner_id
            ]);


            if (result.insertId) {
                return new Note(result.insertId, note.title, note.content, note.image_url, note.is_pinned, note.owner_id);
            }

            return new Note();
        } catch (error) {
            console.error('Error creating note:', error);
            return new Note();
        }
    }

    async getByUserId(ownerId: number): Promise<Note[]> {
        try {
            const query = 'SELECT * FROM notes WHERE owner_id = ?';
            const [rows] = await db.execute<RowDataPacket[]>(query, [ownerId]);

            if (rows.length > 0) {
                return rows.map(row => new Note(row.id, row.title, row.content, row.image_url, row.is_pinned, row.owner_id, row.share_guid));
            }
            return [];
        } catch {
            return [];
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `
        DELETE FROM notes 
        WHERE id = ?
      `;
            const [result] = await db.execute<ResultSetHeader>(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            return false;
        }
    }
}