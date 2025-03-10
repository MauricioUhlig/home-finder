import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Address, getEmptyAddress } from '../../models/address.mode';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  imports: [FormsModule,]
})
export class AddressComponent {
  @Input() endereco: Address = getEmptyAddress();
  @Output() submitEvent = new EventEmitter<any>();

}