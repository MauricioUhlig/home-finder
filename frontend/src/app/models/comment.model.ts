export interface Comment {
    ID: number | null,
    LocationID: number,
    AuthorID: number,
    AuthorName: string,
    Date: string,
    Comment: string
}