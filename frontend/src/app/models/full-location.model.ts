import { getEmptyAddress } from "./address.mode"
import { Dimensions, getEmptyDimensions } from "./dimensions.model"
import { Image } from "./image.model"
import { Location } from "./location.model"
import { getEmptyPhone, Phone } from "./phone.model"

export interface FullLocation extends Location {
    ID: number | null,
    Phones: Phone[] | null,
    Dimensions: Dimensions,
    Size: number | null
    URL: URL | null,
    Type: string,
    Images: Image[] | null
}

export function getEmptyFullLocation(): FullLocation {
    return {
        ID: 0,
        Title: '',
        Address: getEmptyAddress(),
        Phones: [getEmptyPhone()],
        Dimensions: getEmptyDimensions(),
        Size: 0,
        Price: 0,
        URL: null,
        Description: '',
        Type: '',
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
        Images: null,
    }
}