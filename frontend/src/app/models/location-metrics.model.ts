export interface LocationMetrics {
    Id: number,
    LocationId: number,
    Estrelas: number,
    Localicao: number,
    Vizinhanca: number,
    Seguranca: number,
    CustoBeneficio: number,
}

export function getEmptyLocationMetrics(): LocationMetrics {
    return {
        Id: 0,
        LocationId: 0,
        Estrelas: 0,
        Localicao: 0,
        Vizinhanca: 0,
        Seguranca: 0,
        CustoBeneficio: 0
    }
}


export function createEmptyLocationMetrics(locationId: number): LocationMetrics {
    return {
        ... getEmptyLocationMetrics(),
        LocationId: locationId
    }
}