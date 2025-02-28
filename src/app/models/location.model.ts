import { Marker } from "leaflet"
import { SelectOption } from "./select-option.model"

export interface Location {
    Id: number | null,
    Lat: number,
    Lng: number,
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
        Lat: 0,
        Lng: 0,
        Color: null,
        Marker: null,
    }
}