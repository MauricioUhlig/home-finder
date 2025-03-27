import { Marker } from "leaflet"
import { Address, getEmptyAddress } from "./address.mode"

export interface Location {
    ID: number | null,
    Address: Address,
    Title: string,
    Description: string,
    Color: string | null,
    Marker: Marker | null,
    Type: string,
    Price: number,
    Deleted: boolean | null
}

export function getEmptyLocation(): Location {
    return {
        ID: 0,
        Title: '',
        Description: '',
        Type: 'Lote',
        Address: getEmptyAddress(),
        Color: null,
        Marker: null,
        Price: 0,
        Deleted: false
    }
}