import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddModalComponent } from './components/add-modal/add-modal.component';
import { LocationListComponent } from './components/location-list/location-list.component';
import { MapComponent } from './components/map/map.component';
import { Location } from './models/location.model';
import { SelectOption } from './models/select-option.model';
import { FullFormComponent } from './components/full-form/full-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, AddModalComponent, LocationListComponent, MapComponent, FullFormComponent],
})
export class AppComponent {
  @ViewChild(MapComponent) map!: MapComponent;

  lat: number | null = null;
  lng: number | null = null;
  points: Location[] = [
    { Name: 'Casa', Details: 'casa atual', Lat: -20.345083831226688, Lng: -40.37798609159118, Color: 'green', Marker: null, Type: null },
    { Name: 'Lote', Details: 'Boa opção', Lat: -20.34140545584462, Lng: -40.379709270782776, Color: 'blue', Marker: null, Type: null },
  ];
  isAddButtonDisabled = true;

  centerMap(point: Location) {
    this.map.flyTo(point.Marker!.getLatLng())
  }

  handleAddPoint(coords: { lat: number; lng: number }) {
    this.lat = coords.lat;
    this.lng = coords.lng;
    this.isAddButtonDisabled = false;
  }

  save(newPoint: any) {
    this.addLocation(newPoint.name, newPoint.details, newPoint.lat, newPoint.lng, newPoint.type);
    this.clear();
  }

  addLocation(name: string, details: string, lat: number, lng: number, type: SelectOption) {
    const newPoint: Location = { Name: name, Details: details, Lat: lat, Lng: lng, Marker: null, Color: 'blue', Type: type };
    this.points.push(newPoint);
  }

  clear() {
    this.lat = null;
    this.lng = null;
    this.isAddButtonDisabled = true;
  }

  handleFormSubmit(form: any) {

  }
}