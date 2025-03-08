import { Component, Input, Output, EventEmitter, AfterViewInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Location } from '../../models/location.model';
import { Address, getEmptyAddress } from '../../models/address.mode';
import { UtilService } from '../../services/util.service';
import { LocationDetailsService } from '../../services/location-details.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'] // Optional, if you have styles
})
export class MapComponent implements AfterViewInit {
  @Input() points: Location[] | null = null; // Input for points array
  @Input() smallSize: boolean = false;
  @Input() mapId: string = "map"
  @Input() focusPoint: Address | undefined;
  @Output() addPoint = new EventEmitter<Address>(); // Output for new point coordinates

  constructor(private util: UtilService, private locationDetails: LocationDetailsService) { }

  private maxZoom: number = 17;
  private initialZoom: number = 15;
  private initialLatLng = new L.LatLng(-20.345, -40.377);

  map!: L.Map;
  currentMarker: L.Marker | null = null;
  selectedMarker: { marker: L.Marker; previousZoom: number; previousLatLng: L.LatLng } | null = null;

  ngAfterViewInit() {
    this.initMap();
    this.addMarkers();
    this.addListeners();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['points'] && this.map) {
      this.addMarkers(); // Re-render markers when points change
      if (this.focusPoint) {
        this.focusOnPoint(this.focusPoint);
      }
    }
  }

  initMap() {
    // Initialize the map
    this.map = L.map(this.mapId);

    // Configure map controls based on size
    if (this.smallSize) {
      this.disableMapInteractions();
    } else {
      this.map.zoomControl.remove();
    }

    // Set the initial view
    this.setInitialMapView();

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  addListeners() {
    if (!this.smallSize && this.map) {
      this.map.on('click', () => this.resetZoom());

      // Handle right-click to add a new point
      this.map.on('contextmenu', async (e: L.LeafletMouseEvent) => {
        e.originalEvent.preventDefault();
        await this.handleRightClick(e);
      });

      // Handle Escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.resetZoom();
          this.removeCurrentMarker();
        }
      });

    }
  }

  // Helper Methods

  private disableMapInteractions() {
    this.map.scrollWheelZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.touchZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
  }

  private setInitialMapView() {
    if (this.focusPoint) {
      this.focusOnPoint(this.focusPoint);
    } else {
      this.map.setView(this.initialLatLng, this.initialZoom);
    }
  }

  private focusOnPoint(point: { Lat: number; Lng: number }) {
    this.map.setView([point.Lat, point.Lng], this.maxZoom);
  }

  private async handleRightClick(e: L.LeafletMouseEvent) {
    const { lat, lng } = e.latlng;

    // Remove existing marker if present
    this.removeCurrentMarker();

    // Add a new marker
    this.currentMarker = L.marker([lat, lng], { icon: this.createCustomMarker('red') }).addTo(this.map);

    // Show "Loading..." popup initially
    this.currentMarker
      .bindPopup(`<strong>Selected Location</strong><br>Loading address...`)
      .openPopup();

    try {
      // Fetch and update the address
      const address = await this.util.getAddress(lat, lng);
      const addressHTML = this.getAddressHtml(address);
      this.currentMarker.setPopupContent(addressHTML + this.getAddButton()).openPopup();

      // Emit event with the new coordinates
      this.addPoint.emit(address);
    } catch (error) {
      console.error('Error fetching address:', error);
      this.currentMarker.setPopupContent(`<strong>Error</strong><br>Could not fetch address.`).openPopup();
    }
  }

  private removeCurrentMarker() {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
      this.currentMarker = null;
    }
  }
  addMarkers() {
    this.clearExistingMarkers();

    if (this.points) {
      this.points.forEach((point) => {
        point.Marker = this.addPointToMap(point);
      });
    }
  }

  addPointToMap(point: Location): L.Marker {
    const marker = L.marker([point.Address.Lat, point.Address.Lng], {
      icon: this.createCustomMarker(point.Color),
    });

    marker.bindPopup(this.createPopupContent(point.Title, point.Description));

    marker.on('click', () => {
      this.handleMarkerClick(marker, point);
    });

    marker.addTo(this.map!);
    return marker;
  }

  createCustomMarker(color: string | null = 'blue'): L.Icon {
    return L.icon({
      iconUrl: `images/point-${color ?? 'blue'}.webp`, // Update with your icon path
      iconSize: [35, 35],
      iconAnchor: [10, 34],
      popupAnchor: [0, -34],
    });
  }

  createPopupContent(title: string, description: string): string {
    return `<div class="popup-details"><strong>${title}</strong><br>${description}</div>` + this.getExpandButton();
  }

  getAddressHtml(address: Address): string {
    return `<strong>${address.Street}</strong><br>${address.District} - ${address.City}<br>${address.CEP}`;
  }

  getAddButton(): string {
    return `<br><button class="btn btn-success location-plus" style="display:flex" data-bs-toggle="modal" data-bs-target="#novo-local-modal"></button>`;
  }
  getExpandButton(): string {
    return `<br><button class="btn btn-outline-primary" id="popup-button"> <i class="fas fa-expand"></i></button>`;
  }

  flyTo(latlng: L.LatLngExpression, zoom: number | null = null) {
    this.map.flyTo(latlng, zoom ?? this.maxZoom);
  }

  resetZoom() {
    if (this.selectedMarker) {
      this.flyTo(this.selectedMarker.previousLatLng, this.selectedMarker.previousZoom);
      this.selectedMarker = null;
    }
  }

  getZoom(): number {
    return this.map.getZoom();
  }

  getCenter(): L.LatLng {
    return this.map.getCenter();
  }

  // Helper Methods

  private clearExistingMarkers() {
    if (this.map) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
    }
  }

  private handleMarkerClick(marker: L.Marker, point: Location) {
    this.selectedMarker = {
      marker,
      previousZoom: this.getZoom(),
      previousLatLng: this.getCenter(),
    };
    const button = document.getElementById('popup-button');

    button!.addEventListener('click', () => {
      this.expand(point.Id ?? 0);
      marker.closePopup();
    });

    this.flyTo([point.Address.Lat, point.Address.Lng]);
  }

  private expand(id: number) {
    this.locationDetails.openDetailsMenu(id)
  }
}