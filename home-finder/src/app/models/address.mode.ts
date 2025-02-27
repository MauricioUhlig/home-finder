export interface Address {
    Street: string | null,
    District: string,
    City: string,
    CEP: string | null
}

export function getEmptyAddress(): Address {
    return {
        Street: null,
        District: '',
        City: '',
        CEP: null,
    };
}