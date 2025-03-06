import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root', // Provided in the root injector (singleton)
})
export class UtilService {
    private screenWidth$ = new BehaviorSubject<boolean>(window.innerWidth < 700);

    constructor() {
        window.addEventListener('resize', () => {
            this.screenWidth$.next(window.innerWidth < 880);
        });
    }

    isSmallScreen() {
        return this.screenWidth$.asObservable(); // Returns an observable to subscribe to changes
    }
}