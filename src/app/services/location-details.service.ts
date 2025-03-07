import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LocationDetailsService {
  constructor(private router: Router) { }

  openDetailsMenu(locationId: number) {
    // Navigate to the details menu route
    this.router.navigate(['/location', locationId]);
  }

  closeDetailsMenu() {
    // Navigate back to the main page
    this.router.navigate(['/']);
  }

  openEditMenu(locationId: number) {
    // Navigate to the details menu route
    this.router.navigate(['/location', locationId, 'edit']);
  }
  closeEditMenu(locationId: number | null) {
    // Navigate back to the main page
    if (locationId)
      this.router.navigate(['/location', locationId]);
    else
      this.closeDetailsMenu();
  }

  isDetailsMenuOpen(): boolean {
    // Check if the current route is the details menu
    return this.router.url.includes('/location/') && !this.router.url.includes('/edit');
  }
  isEditMenuOpen(): boolean {
    // Check if the current route is the details menu
    return this.router.url.includes('/edit');
  }
}