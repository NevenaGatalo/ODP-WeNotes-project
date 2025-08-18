import type { NoteDto } from "../../models/notes/NoteDto";
import type { ResponseData } from "../response/ResponseData";

export interface NoteData extends ResponseData{
    data: NoteDto
}

export interface NotesData extends ResponseData{
    data: NoteDto[];
}

// export interface ShareLinkData extends ResponseData{
//     data: string
// }