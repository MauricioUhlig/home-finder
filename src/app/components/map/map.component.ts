import { Component, Input, Output, EventEmitter, AfterViewInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Location } from '../../models/location.model';
import { Address, getEmptyAddress } from '../../models/address.mode';

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

  private maxZoom: number = 17;
  private initialZoom: number = 15;
  private initialLatLng = new L.LatLng(-20.345, -40.377);

  map: L.Map | null = null;
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
      if (this.focusPoint)
        this.map.setView([this.focusPoint.Lat, this.focusPoint.Lng], this.maxZoom);
    }
  }

  initMap() {
    // Initialize the map
    this.map = L.map(this.mapId)
    if (!this.smallSize)
      this.map.zoomControl.remove();
    if (this.focusPoint)
      this.map.setView([this.focusPoint.Lat, this.focusPoint.Lng], this.maxZoom);
    else
      this.map.setView(this.initialLatLng, this.initialZoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  addMarkers() {
    // Clear existing markers
    if (this.map) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map?.removeLayer(layer);
        }
      });
    }

    if (this.points)
      this.points.forEach((point) => {
        point.Marker = this.addPointToMap(point);
      });
  }

  addPointToMap(point: Location): L.Marker {
    const marker = L.marker([point.Address.Lat, point.Address.Lng], { icon: this.createCustomMarker(point.Color) });
    marker.bindPopup(`<div class="popup-details"><strong>${point.Title}</strong><br>${point.Description}</div>`);
    marker.on('click', () => {
      this.selectedMarker = {
        marker,
        previousZoom: this.getZoom(),
        previousLatLng: this.getCenter(),
      };
      this.flyTo([point.Address.Lat, point.Address.Lng]); // Center the map on the clicked marker
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

  addListeners() {
    if (this.map) {
      this.map.on('click', () => this.resetZoom());

      // Handle right-click to add a new point
      this.map.on('contextmenu', async (e: L.LeafletMouseEvent) => {
        e.originalEvent.preventDefault();
        if (this.currentMarker) {
          this.map?.removeLayer(this.currentMarker); // Remove existing marker
        }

        const { lat, lng } = e.latlng;
        this.currentMarker = L.marker([lat, lng], { icon: this.createCustomMarker('red') }).addTo(this.map!);

        // Show "Loading..." popup initially
        this.currentMarker
          .bindPopup(`<strong>Selected Location</strong><br>Loading address...`)
          .openPopup();

        // Fetch and update the address
        const address = await this.getAddress(lat, lng);
        const addressHTML = this.getAddressHtml(address)
        this.currentMarker.setPopupContent(addressHTML + this.getAddButton()).openPopup();
        // Emit event with the new coordinates
        this.addPoint.emit(address);
      });
    }

    // Handle Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.resetZoom();
        if (this.currentMarker) {
          this.map?.removeLayer(this.currentMarker);
        }
      }
    });
  }

  async getAddress(lat: number, lng: number): Promise<Address> {
    return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.address) {
          const address: Address = {
            Street: data.address.road,
            District: data.address.suburb,
            City: data.address.city,
            CEP: data.address.postcode,
            Lat: lat,
            Lng: lng,
            HouseNumber: null
          }
          return address
        }
        const emptyAddress: Address = getEmptyAddress();
        emptyAddress.Lat = lat;
        emptyAddress.Lng = lng;
        return emptyAddress;

      })
      .catch((error) => {
        console.error('Error fetching address:', error);
        const emptyAddress: Address = getEmptyAddress();
        emptyAddress.Lat = lat;
        emptyAddress.Lng = lng;
        return emptyAddress;
      });
  }

  getAddressHtml(address: Address): string {
    return `<strong>${address.Street}</strong><br>${address.District} - ${address.City}<br>${address.CEP}`;
  }
  getAddButton(): string {
    return `<br><button class="btn btn-success location-plus" style="display:flex" data-bs-toggle="modal" data-bs-target="#novo-local-modal"></button>`
  }
  flyTo(latlng: L.LatLngExpression, zoom: number | null = null) {
    this.map?.flyTo(latlng, zoom ?? this.maxZoom);
  }

  resetZoom() {
    if (this.selectedMarker) {
      this.flyTo(this.selectedMarker.previousLatLng, this.selectedMarker.previousZoom);
      this.selectedMarker = null;
    }
  }

  getZoom(): number {
    return this.map?.getZoom() || this.initialZoom;
  }

  getCenter(): L.LatLng {
    return this.map?.getCenter() || this.initialLatLng;
  }
}