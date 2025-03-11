export interface Comment {
    ID: number | null,
    LocationId: number,
    AuthorId: number,
    AuthorName: string,
    Date: string,
    Comment: string
}