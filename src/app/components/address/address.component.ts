import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Address } from '../../models/address.mode';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  imports: [FormsModule,]
})
export class AddressComponent {
  @Input() endereco: Address | null = null;
  @Output() submitEvent = new EventEmitter<any>();

  addressForm: Address= {
    Street: null,
    District: '',
    City: '',
    CEP: null
  };
}