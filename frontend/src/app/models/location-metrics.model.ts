export interface LocationMetrics {
    ID: number,
    LocationID: number,
    Stars: number,
    Location: number,
    Neighborhood: number,
    Safety: number,
    CustBenefit: number,
}

export function getEmptyLocationMetrics(): LocationMetrics {
    return {
        ID: 0,
        LocationID: 0,
        Stars: 0,
        Location: 0,
        Neighborhood: 0,
        Safety: 0,
        CustBenefit: 0
    }
}


export function createEmptyLocationMetrics(locationId: number): LocationMetrics {
    return {
        ... getEmptyLocationMetrics(),
        LocationID: locationId
    }
}