export interface Address {
    Street: string | null,
    HouseNumber: string | null,
    District: string,
    City: string,
    CEP: string | null,
    Lat: number,
    Lng: number
}

export function getEmptyAddress(): Address {
    return {
        Street: null,
        HouseNumber: null,
        District: '',
        City: '',
        CEP: null,
        Lat: -20.345, 
        Lng: -40.377
    };
}