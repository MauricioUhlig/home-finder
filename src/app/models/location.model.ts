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