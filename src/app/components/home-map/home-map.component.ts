import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddModalComponent } from '../add-modal/add-modal.component';
import { LocationListComponent } from '../location-list/location-list.component';
import { MapComponent } from '../map/map.component';
import { Location, getEmptyLocation } from '../../models/location.model';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.css'],
  imports: [CommonModule, AddModalComponent, LocationListComponent, MapComponent],
})
export class HomeMapComponent implements AfterViewInit {
  @ViewChild(MapComponent) map!: MapComponent;

  constructor(private dataService: DataService) { }

  async ngAfterViewInit(): Promise<void> {
    this.points = await this.dataService.getAllLocations();
    this.map.addMarkers();
  }

  lat: number | null = null;
  lng: number | null = null;
  points: Location[] | null = null;

  isAddButtonDisabled = true;

  centerMap(point: Location) {
    this.map.flyTo(point.Marker!.getLatLng())
  }

  handleAddPoint(coords: { lat: number; lng: number }) {
    this.lat = coords.lat;
    this.lng = coords.lng;
    this.isAddButtonDisabled = false;
  }

  async save(newPoint: Location) {
    await this.addLocation(newPoint);
    this.clear();
  }

  async addLocation(newPoint: Location) {
    newPoint.Color = 'blue'
    newPoint.Marker = this.map.addPointToMap(newPoint);
    await this.dataService.add(newPoint);
  }

  clear() {
    this.lat = null;
    this.lng = null;
    this.isAddButtonDisabled = true;
  }

  handleFormSubmit(form: any) {

  }
}