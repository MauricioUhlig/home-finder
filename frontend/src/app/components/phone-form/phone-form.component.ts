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

  get phoneFormated(): string {
    // Step 1: Ensure the input is a string
    if (typeof this.phone.Phone !== 'string') {
      console.error("Input must be a string");
      return this.phone.Phone;
    }
  
    // Step 2: Remove all non-digit characters
    const cleaned = this.phone.Phone.replace(/\D/g, '');
  
    // Step 3: Validate the length
    if (cleaned.length > 11) {
      console.error("Invalid phone number length");
      return this.phone.Phone; // Return the original input if invalid
    }
    if (cleaned.length === 9)
      return cleaned.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2-$3');
      
    // Step 4: Apply the mask
    if (cleaned.length === 10)
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    
    
    return cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  }
  set phoneFormated(input: string) {
    this.phone.Phone = input.replace(/\D/g, '')
  }
}
