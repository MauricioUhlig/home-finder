import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddModalComponent } from '../add-modal/add-modal.component';
import { LocationListComponent } from '../location-list/location-list.component';
import { MapComponent } from '../map/map.component';
import { Location } from '../../models/location.model';
// import { FullFormComponent } from "../full-form/full-form.component";

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.css'],
  imports: [CommonModule, AddModalComponent, LocationListComponent, MapComponent],
})
export class HomeMapComponent {
  @ViewChild(MapComponent) map!: MapComponent;

  lat: number | null = null;
  lng: number | null = null;
  points: Location[] = [
    { Id: 1, Title: 'Casa', Description: 'casa atual', Lat: -20.345083831226688, Lng: -40.37798609159118, Color: 'green', Marker: null, Type: null },
    { Id: 2, Title: 'Lote', Description: 'Boa opção', Lat: -20.34140545584462, Lng: -40.379709270782776, Color: 'blue', Marker: null, Type: null },
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

  save(newPoint: Location) {
    this.addLocation(newPoint);
    this.clear();
  }

  addLocation(newPoint: Location) {
    newPoint.Color = 'blue'
    newPoint.Marker = this.map.addPointToMap(newPoint);
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