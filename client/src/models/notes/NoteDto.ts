export class NoteDto {
    public id: number;
    public title: string;
    public content: string;
    public image_url: string;
    public is_pinned: boolean;
    public owner_id: number;
    public share_guid: string

    public constructor(id: number = 0, title: string = "", content: string = "", image_url: string = "",
        is_pinned: boolean = false, owner_id: number = 0, share_guid: string = ""
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.image_url = image_url;
        this.is_pinned = is_pinned;
        this.owner_id = owner_id;
        this.share_guid = share_guid;
    }
}