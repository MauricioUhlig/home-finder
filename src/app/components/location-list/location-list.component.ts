import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationItemComponent } from '../location-item/location-item.component'
import { Location } from '../../models/location.model';
import { UtilService } from '../../services/util.service';

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

  constructor(private util: UtilService) { }

  isExpanded = false; // State for expanded overlay
  isSmallScreen: boolean = true;
  resize$: any;


  ngOnInit() {
    this.resize$ = this.util.isSmallScreen().subscribe((small) => {
      this.isSmallScreen = small;
    });

  }

  ngOnDestroy() {
    // Clean up window resize listener
    this.resize$.unsubscribe();
  }


  // Toggle overlay expansion
  toggleOverlay() {
    this.isExpanded = !this.isExpanded;
  }


  onCenterMap(point: Location) {
    this.centerMap.emit(point);
  }
}