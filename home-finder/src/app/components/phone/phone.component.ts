import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { Phone } from '../../models/phone.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phone',
  imports: [FormsModule],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.css'
})
export class PhoneComponent {
  @Input() phone!: Phone;
  @Input() index: number = 0;
  @Output() removeEvent = new EventEmitter<number>();

  removePhone(index: number) {
    console.log(index)
    this.removeEvent.emit(index);
  }
}
