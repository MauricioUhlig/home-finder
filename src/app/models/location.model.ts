import { Marker } from "leaflet"
import { SelectOption } from "./select-option.model"
import { Address, getEmptyAddress } from "./address.mode"

export interface Location {
    Id: number | null,
    Address: Address,
    Title: string,
    Description: string,
    Color: string | null,
    Marker: Marker | null,
    Type: SelectOption | null
}

export function getEmptyLocation(): Location {
    return {
        Id: 0,
        Title: '',
        Description: '',
        Type: null,
        Address: getEmptyAddress(),
        Color: null,
        Marker: null,
    }
}