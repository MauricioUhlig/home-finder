import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '../../models/location.model';
import { Address, getEmptyAddress } from '../../models/address.mode';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css'], // Optional, if you have styles
  imports: [FormsModule, CommonModule]
})
export class AddModalComponent implements OnChanges {
  @Input() address!: Address;
  @Output() saveEvent = new EventEmitter<any>();

  newPoint: Location = {
    Id: 0,
    Title: '',
    Price: 0,
    Description: '',
    Address: getEmptyAddress(),
    Color: 'blue',
    Marker: null,
    Type: ''
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address']) {
      this.newPoint.Address = this.address ?? getEmptyAddress();
    }
  }

  save() {
    this.saveEvent.emit(this.newPoint);
  }
}