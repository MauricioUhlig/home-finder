export interface Dimensions {
    Front: number |null,
    Deep: number | null,
    Back: number | null
}
export function getEmptyDimensions():Dimensions {
    return {
        Front: null,
        Deep: null,
        Back: null
    }
}