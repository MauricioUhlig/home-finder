import { getEmptyAddress } from "./address.mode"
import { Dimensions, getEmptyDimensions } from "./dimensions.model"
import { Image } from "./image.model"
import { Location } from "./location.model"
import { getEmptyPhone, Phone } from "./phone.model"
import { SelectOption, getEmptyLocation } from "./select-option.model"

export interface FullLocation extends Location {
    Id: number | null,
    Phones: Phone[] | null,
    Dimensions: Dimensions,
    Size: number | null
    URL: URL | null,
    Value: number | null,
    Type: SelectOption,
    Images: Image[] | null
}

export function getEmptyFullLocation(): FullLocation {
    return {
        Id: 0,
        Title: '',
        Address: getEmptyAddress(),
        Phones: [getEmptyPhone()],
        Dimensions: getEmptyDimensions(),
        Size: 0,
        URL: null,
        Description: '',
        Value: null,
        Type: getEmptyLocation(),
        Color: null,
        Marker: null,
        Images: null,
    }
}

export function createFullLocation(location: Location): FullLocation {
    return {
        ...location,
        Phones: [getEmptyPhone()],
        Dimensions: getEmptyDimensions(),
        Size: 0,
        URL: null,
        Value: null,
        Type: getEmptyLocation(),
        Images: null,
    }
}