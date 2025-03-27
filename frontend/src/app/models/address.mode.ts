export interface Address {
    Street: string | null,
    HouseNumber: string | null,
    District: string,
    City: string,
    CEP: string | null,
    Lat: number | null,
    Lng: number | null
}

export function getEmptyAddress(): Address {
    return {
        Street: null,
        HouseNumber: null,
        District: '',
        City: '',
        CEP: null,
        Lat: null, 
        Lng: null
    };
}