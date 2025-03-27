import { Component, EventEmitter, Input, type OnChanges, type OnInit, Output, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { FullLocation, getEmptyFullLocation } from "../../models/full-location.model"
import { AddressComponent } from "../address/address.component"
import { LocationPickerComponent } from "../location-picker/location-picker.component"
import * as L from 'leaflet';
import { PhoneFormComponent } from "../phone-form/phone-form.component"
import { getEmptyPhone } from "../../models/phone.model"
import { UtilService } from "../../services/util.service"
import { Address, getEmptyAddress } from "../../models/address.mode"

@Component({
  selector: "app-location-form-dialog",
  standalone: true,
  imports: [CommonModule, FormsModule, AddressComponent, LocationPickerComponent, PhoneFormComponent],
  templateUrl: "./location-form-dialog.component.html",
  styleUrl: "./location-form-dialog.component.css",
})
export class LocationFormDialogComponent implements OnInit, OnChanges {
  @Input() open = false
  @Input() initialData: FullLocation | null = null
  @Input() address: Address | null = null
  @Output() save = new EventEmitter<FullLocation>()
  @Output() close = new EventEmitter<boolean>()

  constructor(private util: UtilService) { }

  formData: FullLocation = { ...getEmptyFullLocation(), Address: this.address ?? getEmptyAddress()}

  get addressLatLng(): L.LatLng | null {
    if (this.formData.Address.Lat)
      return new L.LatLng(this.formData.Address.Lat, this.formData.Address.Lng!)
    else if (this.address?.Lat)
      return new L.LatLng(this.address?.Lat, this.address?.Lng!)
    else
      return null
  }
  get formatedPrice(): string {
    // Add the dot as thousands separator
    return this.formData.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  set formatedPrice(value: string) {
    const price = Number(value.toString().replace(/[^\d]+/g, ''))
    this.formData.Price = price;
  }

  ngOnInit(): void {
    this.resetForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["initialData"] || changes["open"]) {
      this.resetForm()
    }
  }

  resetForm(): void {
    if (this.initialData) {
      this.formData = { ...this.initialData }
    } else {
      this.formData = getEmptyFullLocation();
    }
  }

  async onLocationPick(coordinates: { lat: number; lng: number }) {

    this.formData.Address = await this.util.getAddress(coordinates.lat, coordinates.lng)
  }

  onSubmit(): void {
    this.save.emit(this.formData)
  }

  onClose(): void {
    this.close.emit(true)
  }

  // Add a new phone input
  addPhone() {
    if (this.formData.Phones)
      this.formData.Phones.push(getEmptyPhone());
    else
      this.formData.Phones = [getEmptyPhone()];
  }

  // Remove a phone input
  removePhone(index: number) {
    this.formData.Phones!.splice(index, 1);
  }

}

