import { Component, Input } from '@angular/core';
import { Phone } from '../../models/phone.model';

@Component({
  selector: 'app-phone',
  imports: [],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.css'
})
export class PhoneComponent {
  @Input() phone: Phone | undefined;

  formatedPhoneNumber(): string {
    const digits = this.formatPhoneWithoutMask();
    // Apply the mask (##) # ####-####
    return digits.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
  }

  formatPhoneWithoutMask(): string {
    if (!this.phone)
      return "";
    let digits = this.phone?.Phone.replace(/\D/g, '');
    if (digits.length == 9)
      digits = "27" + digits;
    return digits
  }
  whatsappLink(): URL {
    let patialUrl = "https://wa.me/55";
    const digits = this.formatPhoneWithoutMask()
    return new URL(patialUrl + digits);
  }
}
