import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressComponent } from '../address/address.component';
import { FullLocation, getEmptyFullLocation } from '../../models/full-location.model';
import { getEmptyPhone } from '../../models/phone.model';
import { PhoneComponent } from '../phone/phone.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-full-form',
  templateUrl: './full-form.component.html',
  styleUrls: ['./full-form.component.css'],
  imports: [CommonModule, FormsModule, AddressComponent, PhoneComponent, RouterLink]
})
export class FullFormComponent {
  @Output() submitEvent = new EventEmitter<any>();

  formData: FullLocation = getEmptyFullLocation()

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

  // Handle form submission
  handleSubmit() {
    console.log('Form Data:', this.formData);
    this.submitEvent.emit(this.formData);
  }
}