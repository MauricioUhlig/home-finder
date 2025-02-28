export interface Address {
    Street: string | null,
    HouseNumber: string | null,
    District: string,
    City: string,
    CEP: string | null
}

export function getEmptyAddress(): Address {
    return {
        Street: null,
        HouseNumber: null,
        District: '',
        City: '',
        CEP: null,
    };
}