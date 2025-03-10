import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressComponent } from '../address/address.component';
import { FullLocation, getEmptyFullLocation } from '../../models/full-location.model';
import { getEmptyPhone } from '../../models/phone.model';
import { PhoneFormComponent } from '../phone-form/phone-form.component';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { LocationDetailsService } from '../../services/location-details.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-full-form',
  templateUrl: './full-form.component.html',
  styleUrls: ['./full-form.component.css'],
  imports: [CommonModule, FormsModule, AddressComponent, PhoneFormComponent]
})
export class FullFormComponent {
  @Output() submitEvent = new EventEmitter<any>();

  isOverlayMode = true;
  resize$: any;


  constructor(private route: ActivatedRoute, private dataService: DataService, private detailsService: LocationDetailsService, private util: UtilService) { }

  async ngOnInit() {
    this.resize$ = this.util.isSmallScreen().subscribe((small) => {
      this.isOverlayMode = !small;
    });
    this.route.children.forEach(childRoute => {
      childRoute.paramMap.subscribe(params => {
        let locationId = params.get('id') || '';
        this.getLocation(locationId);
      });
    });
  }

  formData: FullLocation = getEmptyFullLocation()

  async getLocation(locationId: any) {
    if (locationId && Number(locationId)) {
      var resp = await this.dataService.getById(Number(locationId));
      if (resp !== undefined)
        this.formData = resp
    }
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

  // Handle image upload
  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            if (this.formData.Images)
              this.formData.Images!.push({ File: file, URL: e.target.result as string });
            else
              this.formData.Images = [{ File: file, URL: e.target.result as string }]
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // Remove an image
  removeImage(index: number) {
    this.formData.Images!.splice(index, 1);
  }

  close(): void {
    this.detailsService.closeEditMenu(this.formData.Id);
  }

  // Handle form submission
  handleSubmit() {
    this.submitEvent.emit(this.formData);
  }
}