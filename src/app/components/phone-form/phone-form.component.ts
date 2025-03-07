import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { Phone } from '../../models/phone.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phone-form',
  imports: [FormsModule],
  templateUrl: './phone-form.component.html',
  styleUrl: './phone-form.component.css'
})
export class PhoneFormComponent {
  @Input() phone!: Phone;
  @Input() index: number = 0;
  @Output() removeEvent = new EventEmitter<number>();

  removePhone(index: number) {
    this.removeEvent.emit(index);
  }
}
