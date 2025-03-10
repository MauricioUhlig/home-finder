export interface SelectOption {
    Id: string,
    Name: string,
}

export function getEmptyLocation() {
    return { Id: '0', Name: "Lote" }
}