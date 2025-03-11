export interface SelectOption {
    ID: string,
    Name: string,
}

export function getEmptyLocation() {
    return { ID: '0', Name: "Lote" }
}