import { Marker } from "leaflet"
import { SelectOption } from "./select-option.model"

export interface Location {
    Name: string,
    Details: string,
    Lat: number,
    Lng: number,
    Color: string, 
    Marker: Marker | null,
    Type: SelectOption | null
}