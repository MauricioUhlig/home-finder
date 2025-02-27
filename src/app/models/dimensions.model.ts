export interface Dimensions {
    Front: number,
    Deep: number,
    Back: number | null
}
export function getEmptyDimensions():Dimensions {
    return {
        Front: 0,
        Deep: 0,
        Back: null
    }
}