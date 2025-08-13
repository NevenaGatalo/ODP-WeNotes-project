export class NoteDto{
    public constructor(
        public id: number = 0,
        public title: string = '',
        public content: string = '',
        public image_url: string = '',
        public is_pinned: boolean = false,
        public owner_id: number = 0
    ){}
}