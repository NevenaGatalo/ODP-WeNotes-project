export interface NoteDto {
    id: number,
    title: string,
    content: string,
    image_url: string,
    is_pinned: boolean,
    owner_id: number,
    share_guid: string
}