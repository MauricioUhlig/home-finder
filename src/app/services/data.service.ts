import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';
import { createFullLocation, FullLocation } from '../models/full-location.model';
import { getEmptyLocation } from '../models/select-option.model'
import { LocationMetrics } from '../models/location-metrics.model';
import { Comment } from '../models/comment.model';

@Injectable({
    providedIn: 'root', // Provided in the root injector (singleton)
})
export class DataService {
    public isLoading: boolean = false;
    constructor() { }

    private locations: FullLocation[] = [
        {
            Id: 1,
            Title: 'Casa antiga com garagem',
            Description: 'casa atual',
            Color: 'green',
            Marker: null,
            Type: 'Casa',
            Address: {
                Street: 'Rua Ametista',
                HouseNumber: "252",
                District: 'São Geraldo',
                City: 'Cariacica',
                CEP: '29146-677',
                Lat: -20.345083831226688,
                Lng: -40.37798609159118,
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
                Front: null,
                Back: null,
                Deep: 12
            },
            Size: 64,
            URL: new URL("http://mauriciouhlig.dev.br"),
            Value: 130000,
            Images: null
        },
        {
            Id: 2,
            Title: 'Lote',
            Description: 'Boa opção',
            Color: 'blue',
            Marker: null,
            Type: 'Lote',
            Address: {
                Street: 'Rua Ametista',
                HouseNumber: "N/A",
                District: 'São Geraldo',
                City: 'Cariacica',
                CEP: '29146-677',
                Lat: -20.34140545584462,
                Lng: -40.379709270782776,
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

    private metrics: LocationMetrics[] = [
        {
            Id: 1,
            LocationId: 1,
            Seguranca: 8,
            Vizinhanca: 9,
            CustoBeneficio: 3,
            Estrelas: 4.3,
            Localicao: 9
        }
    ]

    private comments: Comment[] = [
        {
            Id: 1,
            LocationId: 1,
            AuthorId: 1,
            AuthorName: 'Mauricio',
            Date: '07/03/2025 19:33:15',
            Comment: 'Eu gostei desta opção!',
        },
        {
            Id: 2,
            LocationId: 1,
            AuthorId: 102,
            AuthorName: 'Hillary',
            Date: '07/03/2025 19:35:15',
            Comment: 'Achei meio pequeno',
        },
    ];
    async getAllLocations(): Promise<FullLocation[]> {
        await this.delay(500);
        return this.locations;
    }

    async getById(id: number): Promise<FullLocation | undefined> {
        await this.delay(500);
        return this.locations.find(l => l.Id == id)
    }

    async getMetricsByLocationId(id: number): Promise<LocationMetrics | undefined> {
        await this.delay(500);
        return this.metrics.find(l => l.LocationId == id)
    }

    async getCommentsByLocationId(id: number): Promise<Comment[] | undefined> {
        await this.delay(300);
        return this.comments.filter(l => l.LocationId == id)
    }

    async addComment(comment: Comment): Promise<number> {
        const maxId = this.comments.length > 0 ? Math.max(...this.comments.map((item) => item.Id ?? 0)) : -1;
        comment.Id = maxId + 1;
        this.comments.push(comment)
        await this.delay(300);
        return maxId
    }
    async deleteComment(id: number): Promise<boolean> {
        this.comments = this.comments.filter((comment) => comment.Id !== id);
        await this.delay(100);
        return true;
    }
    async updateComment(comment: Comment): Promise<boolean> {
        const index = this.comments.findIndex((m) => m.Id === comment.Id);
        await this.delay(100);
        if (index !== -1) {
            // Update existing metric
            this.comments[index] = { ...this.comments[index], ...comment };
            return true;
        } else {
            return false;
        }
    }

    async add(location: Location): Promise<number> {
        const maxId = this.locations.length > 0 ? Math.max(...this.locations.map((item) => item.Id ?? 0)) : -1;
        location.Id = maxId + 1;
        this.locations.push(createFullLocation(location))
        await this.delay(300);
        return maxId
    }

    async saveMetric(metric: LocationMetrics) {
        await this.delay(100);
        const index = this.metrics.findIndex((m) => m.Id === metric.Id);

        if (index !== -1) {
            // Update existing metric
            this.metrics[index] = { ...this.metrics[index], ...metric };
        } else {
            // Insert new metric
            this.metrics.push(metric);
        }
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}