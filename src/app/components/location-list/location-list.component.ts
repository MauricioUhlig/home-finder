import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationItemComponent } from '../location-item/location-item.component'
import { Location } from '../../models/location.model';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css'], // Optional, if you have styles
  imports: [CommonModule, LocationItemComponent]
})
export class LocationListComponent implements OnInit, OnDestroy {
  @Input() points: Location[] | null = null; // Input for points array
  @Input() loading: boolean = false;
  @Output() centerMap = new EventEmitter<Location>(); // Output to center the map on a point

  isExpanded = false; // State for expanded overlay
  screenWidth = window.innerWidth; // Track screen width

  // Computed property for small screen breakpoint
  get isSmallScreen(): boolean {
    return this.screenWidth < 1200;
  }

  ngOnInit() {
    // Add window resize listener
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    // Clean up window resize listener
    window.removeEventListener('resize', this.onResize);
  }

  // Handle window resize
  @HostListener('window:resize')
  onResize = () => {
    this.screenWidth = window.innerWidth;
  };

  // Toggle overlay expansion
  toggleOverlay() {
    this.isExpanded = !this.isExpanded;
  }


  onCenterMap(point: Location) {
    this.centerMap.emit(point);
  }
}