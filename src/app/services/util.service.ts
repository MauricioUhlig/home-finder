import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address, getEmptyAddress } from '../models/address.mode';

@Injectable({
    providedIn: 'root', // Provided in the root injector (singleton)
})
export class UtilService {
    private screenWidth$ = new BehaviorSubject<boolean>(window.innerWidth < 880);

    constructor() {
        window.addEventListener('resize', () => {
            this.screenWidth$.next(window.innerWidth < 880);
        });
    }

    isSmallScreen() {
        return this.screenWidth$.asObservable(); // Returns an observable to subscribe to changes
    }

    async getAddress(lat: number, lng: number): Promise<Address> {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch address: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.address) {
                return this.createEmptyAddress(lat, lng);
            }

            const address: Address = {
                Street: data.address.road || null,
                District: data.address.suburb || null,
                City: data.address.city || null,
                CEP: data.address.postcode || null,
                Lat: lat,
                Lng: lng,
                HouseNumber: data.address.house_number || null,
            };

            return address;
        } catch (error) {
            console.error('Error fetching address:', error);
            return this.createEmptyAddress(lat, lng);
        }
    }

    private createEmptyAddress(lat: number, lng: number): Address {
        const emptyAddress: Address = getEmptyAddress();
        emptyAddress.Lat = lat;
        emptyAddress.Lng = lng;
        return emptyAddress;
    }
}