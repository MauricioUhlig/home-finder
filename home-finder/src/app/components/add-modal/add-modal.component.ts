import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '../../models/location.model'
import { SelectOption } from '../../models/select-option.model'

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css'], // Optional, if you have styles
  imports: [FormsModule, CommonModule]
})
export class AddModalComponent {
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;
  @Output() saveEvent = new EventEmitter<any>();

  pointTypes: SelectOption[] = [
    { Id: 1, Name: 'Casa' },
    { Id: 2, Name: 'Lote' }
  ];

  newPoint: Location = {
    Name: '',
    Details: '',
    Lat: this.latitude ?? 0,
    Lng: this.longitude ?? 0,
    Color: 'blue',
    Marker: null,
    Type: this.pointTypes[0]
  };

  save() {
    this.saveEvent.emit(this.newPoint);
  }
}