import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '../../models/location.model';
import { SelectOption } from '../../models/select-option.model';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css'], // Optional, if you have styles
  imports: [FormsModule, CommonModule]
})
export class AddModalComponent implements OnChanges {
  @Input() latitude!: number;
  @Input() longitude!: number;
  @Output() saveEvent = new EventEmitter<any>();

  pointTypes: SelectOption[] = [
    { Id: 1, Name: 'Casa' },
    { Id: 2, Name: 'Lote' }
  ];

  newPoint: Location = {
    Id: 0,
    Title: '',
    Description: '',
    Lat: 0, // Initialize to 0, will be updated in ngOnChanges
    Lng: 0, // Initialize to 0, will be updated in ngOnChanges
    Color: 'blue',
    Marker: null,
    Type: this.pointTypes[0]
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['latitude'] || changes['longitude']) {
      this.newPoint.Lat = this.latitude ?? 0;
      this.newPoint.Lng = this.longitude ?? 0;
    }
  }

  save() {
    this.saveEvent.emit(this.newPoint);
  }
}