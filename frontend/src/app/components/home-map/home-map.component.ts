import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationListComponent } from '../location-list/location-list.component';
import { MapComponent } from '../map/map.component';
import { Location } from '../../models/location.model';
import { DataService } from '../../services/data.service';
import { DetailsComponent } from "../details/details.component";
import { UtilService } from '../../services/util.service';
import { LocationDetailsService } from '../../services/location-details.service';
import { Address, getEmptyAddress } from '../../models/address.mode';
import { FullFormComponent } from '../full-form/full-form.component';
import { LocationFormDialogComponent } from '../location-form-dialog/location-form-dialog.component';
import { FullLocation } from '../../models/full-location.model';


@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.css'],
  imports: [CommonModule, LocationListComponent, MapComponent, DetailsComponent, FullFormComponent, LocationFormDialogComponent],
})
export class HomeMapComponent implements AfterViewInit {
  @ViewChild(MapComponent) map!: MapComponent;

  constructor(private dataService: DataService, private util: UtilService, private locationDetailsService: LocationDetailsService) { }
  ngOnInit() {
    this.resize$ = this.util.isSmallScreen().subscribe((small) => {
      this.isSmallScreen = small;
    });
  }
  ngOnDestroy() {
    // Clean up window resize listener
    this.resize$.unsubscribe();
  }

  get showContent(): boolean {
    return !(this.isSmallScreen && this.isDetailsOpen)
  }
  get isDetailsOpen(): boolean {
    return this.locationDetailsService.isDetailsMenuOpen()
  }
  get isEditOpen(): boolean {
    return this.locationDetailsService.isEditMenuOpen()
  }
  async ngAfterViewInit(): Promise<void> {
    this.points = await this.dataService.getAllLocations();
    this.map.addMarkers();
  }

  address : Address = getEmptyAddress();
  points: Location[] | null = null;
  isSmallScreen: boolean = true;
  resize$: any;
  isAddModalOpen: boolean = false;
  isAddButtonDisabled = true;

  centerMap(point: Location) {
    this.map.flyTo(point.Marker!.getLatLng())
  }

  handleAddPoint(address: Address) {
    this.address = address;
    this.openModal()
  }

  async save(newPoint: FullLocation) {
    if(await this.addLocation(newPoint))
      this.clear();
    else 
      alert("Erro ao salvar!")
  }

  async addLocation(newPoint: FullLocation): Promise<boolean> {
    
    newPoint.Color = 'blue'
    newPoint.Marker = this.map.addPointToMap(newPoint);
    newPoint.ID  = await this.dataService.add(newPoint);
    if(newPoint.ID){
      this.points?.push(newPoint);
      return true
    }
    else 
     return false
  }

  clear() {
    this.address = getEmptyAddress();
    this.closeModal();
    this.isAddButtonDisabled = true;
  }

  openModal(){
    this.isAddModalOpen = true;
  }

  closeModal(){
    this.isAddModalOpen = false;
  }
}