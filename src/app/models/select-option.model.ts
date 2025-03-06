export interface SelectOption {
    Id: number,
    Name: string,
}

export function getEmptyLocation() {
    return { Id: 0, Name: "Lote" }
}