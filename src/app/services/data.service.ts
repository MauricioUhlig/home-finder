import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';
import { createFullLocation, FullLocation } from '../models/full-location.model';

@Injectable({
    providedIn: 'root', // Provided in the root injector (singleton)
})
export class DataService {
    public isLoading: boolean = false;
    constructor() { }

    private locations: FullLocation[] = [
        {
            Id: 1,
            Title: 'Minha residencia atual',
            Description: 'casa atual',
            Lat: -20.345083831226688,
            Lng: -40.37798609159118,
            Color: 'green',
            Marker: null,
            Address: {
                Street: 'Rua Ametista',
                HouseNumber: "252",
                District: 'São Geraldo',
                City: 'Cariacica',
                CEP: '29146-677'
            },
            Phones: [
                {
                    Name: "Mauricio",
                    Phone: "27997987705"
                },
                {
                    Name: "Uhlig",
                    Phone: "9 9798-7705"
                }
            ],
            Dimensions: {
                Front: 0,
                Back: null,
                Deep: 0
            },
            Size: null,
            URL: new URL("http://mauriciouhlig.dev.br"),
            Value: 0,
            Images: null,
            Type: { Id: 1, Name: "casa" }
        },
        {
            Id: 2,
            Title: 'Lote',
            Description: 'Boa opção',
            Lat: -20.34140545584462,
            Lng: -40.379709270782776,
            Color: 'blue',
            Marker: null,
            Type: { Id: 0, Name: "Lote" },
            Address: {
                Street: 'Rua Ametista',
                HouseNumber: "N/A",
                District: 'São Geraldo',
                City: 'Cariacica',
                CEP: '29146-677'
            },
            Phones: null,
            Dimensions: {
                Front: 0,
                Back: null,
                Deep: 0
            },
            Size: null,
            URL: null,
            Value: 0,
            Images: null
        },
    ];

    async getAllLocations(): Promise<FullLocation[]> {
        await this.delay(2000);
        return this.locations;
    }

    async getById(id: number): Promise<FullLocation | undefined> {
        await this.delay(1000);
        return this.locations.find(l => l.Id == id)
    }

    async add(location: Location): Promise<number> {
        const maxId = this.locations.length > 0 ? Math.max(...this.locations.map((item) => item.Id ?? 0)) : -1;
        location.Id = maxId + 1;
        this.locations.push(createFullLocation(location))
        await this.delay(300);
        return maxId
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}